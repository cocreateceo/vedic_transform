import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;
  const todayIso = () => new Date().toISOString().split('T')[0];

  if (method === 'GET') {
    const filter = event.queryStringParameters?.type;
    const limit = parseInt(event.queryStringParameters?.limit || '30');

    const results: any = {};

    if (!filter || filter === 'gratitude') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.GratitudeEntries.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      const items = r.Items || [];
      results.gratitudeEntries = items;
      // The Journal page reads `todayGratitude` to pre-fill the form so the
      // saved state survives a refresh. Compute it here so the client doesn't
      // need to re-filter the whole array.
      const today = todayIso();
      results.todayGratitude = items.find((i: any) => i.entryDate === today) || null;
    }

    if (!filter || filter === 'intention') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.Intentions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      const items = r.Items || [];
      results.intentions = items;
      const today = todayIso();
      results.todayIntention = items.find((i: any) => i.intentionDate === today) || null;
    }

    if (!filter || filter === 'manifestation') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.Manifestations.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      results.manifestations = r.Items || [];
    }

    return ok(results);
  }

  if (method === 'POST') {
    const body = parseBody(event);
    // The Journal UI sends `action`; older callers send `type`. Accept either
    // so the existing client just works without coordinated deploys.
    const op = body.type || body.action;
    const now = new Date().toISOString();
    const today = todayIso();

    if (op === 'gratitude') {
      const { gratitude1, gratitude2, gratitude3 } = body;

      // Upsert by entryDate — previously every save inserted a new row,
      // duplicating today's entry under "Recent Entries" each click.
      const existing = await db.send(new QueryCommand({
        TableName: Resource.GratitudeEntries.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'entryDate = :date',
        ExpressionAttributeValues: { ':userId': user.id, ':date': today },
      }));

      if ((existing.Items || []).length > 0) {
        const id = existing.Items![0].id;
        await db.send(new UpdateCommand({
          TableName: Resource.GratitudeEntries.name,
          Key: { id },
          UpdateExpression:
            'SET gratitude1 = :g1, gratitude2 = :g2, gratitude3 = :g3, updatedAt = :now',
          ConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':g1': gratitude1 || null,
            ':g2': gratitude2 || null,
            ':g3': gratitude3 || null,
            ':now': now,
            ':userId': user.id,
          },
        }));
        return ok({ success: true, id, upserted: true });
      }

      const id = generateId();
      await db.send(new PutCommand({
        TableName: Resource.GratitudeEntries.name,
        Item: {
          id,
          userId: user.id,
          entryDate: today,
          gratitude1: gratitude1 || null,
          gratitude2: gratitude2 || null,
          gratitude3: gratitude3 || null,
          createdAt: now,
          updatedAt: now,
        },
      }));
      return ok({ success: true, id });
    }

    if (op === 'intention') {
      const { intentionText } = body;
      if (!intentionText) return err(400, 'intentionText is required');

      const existing = await db.send(new QueryCommand({
        TableName: Resource.Intentions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'intentionDate = :date',
        ExpressionAttributeValues: { ':userId': user.id, ':date': today },
      }));

      if ((existing.Items || []).length > 0) {
        const id = existing.Items![0].id;
        await db.send(new UpdateCommand({
          TableName: Resource.Intentions.name,
          Key: { id },
          UpdateExpression: 'SET intentionText = :text, updatedAt = :now',
          ConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':text': intentionText,
            ':now': now,
            ':userId': user.id,
          },
        }));
        return ok({ success: true, id, upserted: true });
      }

      const id = generateId();
      await db.send(new PutCommand({
        TableName: Resource.Intentions.name,
        Item: {
          id,
          userId: user.id,
          intentionDate: today,
          intentionText,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        },
      }));
      return ok({ success: true, id });
    }

    if (op === 'manifestation') {
      const { title, description, imageUrl } = body;
      if (!title) return err(400, 'title is required');

      const id = generateId();

      await db.send(new PutCommand({
        TableName: Resource.Manifestations.name,
        Item: {
          id,
          userId: user.id,
          title,
          description: description || null,
          imageUrl: imageUrl || null,
          isAchieved: false,
          achievedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      }));

      return ok({ success: true, id });
    }

    return err(400, 'Invalid type. Use: gratitude, intention, manifestation');
  }

  if (method === 'PATCH') {
    const body = parseBody(event);
    const op = body.type || body.action;
    const id = body.id;

    if (!id) return err(400, 'id is required');
    if (op !== 'manifestation') return err(400, 'PATCH only supports type=manifestation');

    const { isAchieved } = body;
    if (isAchieved === undefined) return err(400, 'isAchieved is required');

    const now = new Date().toISOString();

    await db.send(new UpdateCommand({
      TableName: Resource.Manifestations.name,
      Key: { id },
      UpdateExpression:
        'SET isAchieved = :a, achievedAt = :ach, updatedAt = :now',
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':a': isAchieved,
        ':ach': isAchieved ? now : null,
        ':now': now,
        ':userId': user.id,
      },
    }));

    return ok({ success: true });
  }

  if (method === 'DELETE') {
    const id = event.queryStringParameters?.id;
    const op = event.queryStringParameters?.type || event.queryStringParameters?.action || 'manifestation';
    if (!id) return err(400, 'id is required');
    if (op !== 'manifestation') return err(400, 'DELETE only supports type=manifestation');

    await db.send(new DeleteCommand({
      TableName: Resource.Manifestations.name,
      Key: { id },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
