import { Resource } from 'sst';
import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';

const SHIELD_COST = 200;
const MAX_SHIELDS = 2;

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  if (event.requestContext?.http?.method !== 'POST') {
    return err(405, 'Method not allowed');
  }

  // Find the user's streak row (mirror checkin.ts's selection — most recent
  // updatedAt). We can't write without one; the user must have an active
  // journey before they can buy shields.
  const streaks = await db.send(new QueryCommand({
    TableName: Resource.Streaks.name,
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': user.id },
  }));

  const sorted = (streaks.Items || []).slice().sort((a: any, b: any) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );
  const streak = sorted[0];

  if (!streak) return err(404, 'No active streak — start a journey first');

  const currentShields: number = streak.shields || 0;
  if (currentShields >= MAX_SHIELDS) {
    return err(409, `You already have the maximum of ${MAX_SHIELDS} Karma Shields`);
  }

  // Compute the user's current karma balance by summing all transactions.
  // KarmaTransactions has small per-user row counts; full GSI scan is cheap
  // at this scale. P1 optimization: cache total on the user record.
  const karmaResult = await db.send(new QueryCommand({
    TableName: Resource.KarmaTransactions.name,
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': user.id },
  }));

  const balance = (karmaResult.Items || []).reduce(
    (sum: number, t: any) => sum + (Number(t.points) || 0),
    0,
  );

  if (balance < SHIELD_COST) {
    return err(402, `Not enough karma. Need ${SHIELD_COST}, have ${balance}.`);
  }

  // Atomic debit + increment. TransactWriteItems ensures we never bump
  // shields without recording the karma cost (and vice versa).
  const now = new Date().toISOString();
  const txId = generateId();

  try {
    await db.send(new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: Resource.Streaks.name,
            Key: { id: streak.id },
            UpdateExpression:
              'SET shields = :newShields, shieldsPurchased = if_not_exists(shieldsPurchased, :zero) + :one, updatedAt = :now',
            ConditionExpression: 'attribute_not_exists(shields) OR shields < :max',
            ExpressionAttributeValues: {
              ':newShields': currentShields + 1,
              ':one': 1,
              ':zero': 0,
              ':max': MAX_SHIELDS,
              ':now': now,
            },
          },
        },
        {
          Put: {
            TableName: Resource.KarmaTransactions.name,
            Item: {
              id: txId,
              userId: user.id,
              points: -SHIELD_COST,
              reason: 'Karma Shield purchased',
              pillarId: null,
              pillarSlug: null,
              badgeId: null,
              createdAt: now,
            },
          },
        },
      ],
    }));
  } catch (e: any) {
    // ConditionalCheckFailed → caller's view of `shields` was stale.
    if (e?.name === 'TransactionCanceledException') {
      return err(409, 'Shield purchase failed — you may already have the maximum');
    }
    console.error('Shield purchase error:', e);
    return err(500, 'Could not complete purchase');
  }

  return ok({
    success: true,
    shields: currentShields + 1,
    karmaBalance: balance - SHIELD_COST,
    cost: SHIELD_COST,
  });
}
