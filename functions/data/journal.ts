import { Resource } from 'sst';
import { createHash } from 'node:crypto';
import { QueryCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

/**
 * Stable, opaque id for a Training-origin entry, derived from the
 * server-authenticated user plus the chapter and prompt it answers. Same
 * inputs → same id, so a re-save edits rather than duplicates.
 */
function trainingEntryId(
  userId: string,
  chapterSlug: string,
  promptIndex: unknown,
): string {
  const prompt = Number.isInteger(promptIndex) ? String(promptIndex) : 'all';
  return createHash('sha256')
    .update(`training|${userId}|${chapterSlug}|${prompt}`)
    .digest('hex')
    .slice(0, 32);
}

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

    // Generic free-prose entries. Returned under their own key so existing
    // consumers of gratitudeEntries / intentions / manifestations are
    // unaffected.
    if (!filter || filter === 'entry') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.JournalEntries.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        Limit: limit,
      }));
      results.journalEntries = r.Items || [];
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

    // Generic journal entry. `source`/`chapterSlug`/`promptIndex` are optional
    // context — the entry type is "entry", not "reflection", because the table
    // is deliberately generic and Training is only its first caller.
    //
    // Deliberately does NOT call any check-in / pillar credit. Writing a
    // reflection is not practising; Journey day, streak and karma are
    // untouched by this path.
    if (op === 'entry') {
      const { body: entryBody, source, chapterSlug, promptIndex } = body;
      const prose = typeof entryBody === 'string' ? entryBody.trim() : '';
      if (!prose) return err(400, 'body is required');

      const isTraining = source === 'training';
      if (isTraining && (typeof chapterSlug !== 'string' || !chapterSlug)) {
        return err(400, 'chapterSlug is required for training entries');
      }

      // Training reflections are logically one per (user, chapter, prompt), so
      // re-saving edits the same entry instead of appending a duplicate — that
      // is what makes double-submit and retry-after-a-failed-progress-write
      // safe. The identity is derived server-side from the AUTHENTICATED user;
      // a client-supplied userId is never trusted. Ordinary entries keep
      // generated ids and may repeat freely within a day.
      const id = isTraining
        ? trainingEntryId(user.id, chapterSlug, promptIndex)
        : generateId();

      const existing = await db.send(new GetCommand({
        TableName: Resource.JournalEntries.name,
        Key: { id },
      }));
      const prior = existing.Item;
      if (prior && prior.userId !== user.id) return err(403, 'Forbidden');

      await db.send(new PutCommand({
        TableName: Resource.JournalEntries.name,
        Item: {
          id,
          userId: user.id,
          entryDate: prior?.entryDate ?? today,
          // User prose only. The authored Training question is never copied in
          // here — it stays in training-book.ts and is resolved for display
          // from chapterSlug + promptIndex.
          body: prose,
          source: source ?? null,
          chapterSlug: isTraining ? chapterSlug : null,
          promptIndex:
            isTraining && Number.isInteger(promptIndex) ? promptIndex : null,
          createdAt: prior?.createdAt ?? now,
          updatedAt: now,
        },
      }));

      return ok({ success: true, id, updated: Boolean(prior) });
    }

    return err(400, 'Invalid type. Use: gratitude, intention, manifestation, entry');
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
