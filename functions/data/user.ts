import { Resource } from 'sst';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const result = await db.send(new GetCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
    }));
    if (!result.Item) return err(404, 'User not found');

    const { passwordHash, ...profile } = result.Item;
    return ok(profile);
  }

  if (method === 'PATCH') {
    const body = parseBody(event);
    const { name, phone, avatarUrl, onboardingCompleted, onboardingData, doshaType, doshaSecondary, doshaScores, doshaAssessedAt } = body;

    const updates: string[] = [];
    const values: Record<string, any> = {};
    const names: Record<string, string> = {};

    if (name !== undefined) { updates.push('#n = :name'); values[':name'] = name; names['#n'] = 'name'; }
    if (phone !== undefined) { updates.push('phone = :phone'); values[':phone'] = phone; }
    if (avatarUrl !== undefined) { updates.push('avatarUrl = :avatarUrl'); values[':avatarUrl'] = avatarUrl; }
    if (onboardingCompleted !== undefined) { updates.push('onboardingCompleted = :onboarded'); values[':onboarded'] = onboardingCompleted; updates.push('onboardingCompletedAt = :onboardedAt'); values[':onboardedAt'] = new Date().toISOString(); }
    if (onboardingData !== undefined) { updates.push('onboardingData = :onboardingData'); values[':onboardingData'] = onboardingData; }
    if (doshaType !== undefined) { updates.push('doshaType = :doshaType'); values[':doshaType'] = doshaType; }
    if (doshaSecondary !== undefined) { updates.push('doshaSecondary = :doshaSecondary'); values[':doshaSecondary'] = doshaSecondary; }
    if (doshaScores !== undefined) { updates.push('doshaScores = :doshaScores'); values[':doshaScores'] = doshaScores; }
    if (doshaAssessedAt !== undefined) { updates.push('doshaAssessedAt = :doshaAssessedAt'); values[':doshaAssessedAt'] = doshaAssessedAt; }

    updates.push('updatedAt = :updatedAt');
    values[':updatedAt'] = new Date().toISOString();

    if (updates.length === 1) return err(400, 'No fields to update');

    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeValues: values,
      ...(Object.keys(names).length > 0 ? { ExpressionAttributeNames: names } : {}),
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
