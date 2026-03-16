import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const weekNumber = event.queryStringParameters?.weekNumber;

    const params: any = {
      TableName: Resource.GoalTasks.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    };

    if (weekNumber) {
      params.FilterExpression = 'weekNumber = :week';
      params.ExpressionAttributeValues[':week'] = parseInt(weekNumber);
    }

    const result = await db.send(new QueryCommand(params));
    return ok({ goals: result.Items || [] });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { title, description, weekNumber, pillarId } = body;

    if (!title || weekNumber === undefined) return err(400, 'title and weekNumber are required');

    const now = new Date().toISOString();
    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.GoalTasks.name,
      Item: {
        id,
        userId: user.id,
        weekNumber,
        title,
        description: description || null,
        pillarId: pillarId || null,
        isCompleted: false,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
    }));

    return ok({ success: true, goalId: id });
  }

  if (method === 'PATCH') {
    const body = parseBody(event);
    const { id, isCompleted, title, description } = body;

    if (!id) return err(400, 'id is required');

    const updates: string[] = [];
    const values: Record<string, any> = {};

    if (isCompleted !== undefined) {
      updates.push('isCompleted = :isCompleted');
      values[':isCompleted'] = isCompleted;
      updates.push('completedAt = :completedAt');
      values[':completedAt'] = isCompleted ? new Date().toISOString() : null;
    }
    if (title !== undefined) { updates.push('title = :title'); values[':title'] = title; }
    if (description !== undefined) { updates.push('description = :description'); values[':description'] = description; }

    updates.push('updatedAt = :updatedAt');
    values[':updatedAt'] = new Date().toISOString();

    await db.send(new UpdateCommand({
      TableName: Resource.GoalTasks.name,
      Key: { id },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ...values, ':userId': user.id },
    }));

    return ok({ success: true });
  }

  if (method === 'DELETE') {
    const id = event.queryStringParameters?.id;
    if (!id) return err(400, 'id is required');

    await db.send(new DeleteCommand({
      TableName: Resource.GoalTasks.name,
      Key: { id },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
