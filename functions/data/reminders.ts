import { Resource } from 'sst';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const result = await db.send(new GetCommand({
      TableName: Resource.ReminderSettings.name,
      Key: { userId: user.id },
    }));

    if (!result.Item) {
      // Return defaults
      return ok({
        settings: {
          userId: user.id,
          morningEnabled: true,
          morningTime: '05:00',
          eveningEnabled: true,
          eveningTime: '21:00',
          sandhyaEnabled: false,
          sandhyaMorningTime: '06:00',
          sandhyaNoonTime: '12:00',
          sandhyaEveningTime: '18:00',
          streakWarningEnabled: true,
          streakWarningTime: '20:00',
          dailyDigestEnabled: false,
          weeklyDigestEnabled: true,
          weeklyDigestDay: 'sunday',
          emailNotifications: true,
          pushNotifications: false,
          timezone: 'UTC',
        },
      });
    }

    return ok({ settings: result.Item });
  }

  if (method === 'PUT') {
    const body = JSON.parse(event.body || '{}');
    const now = new Date().toISOString();

    await db.send(new PutCommand({
      TableName: Resource.ReminderSettings.name,
      Item: {
        userId: user.id,
        morningEnabled: body.morningEnabled ?? true,
        morningTime: body.morningTime ?? '05:00',
        eveningEnabled: body.eveningEnabled ?? true,
        eveningTime: body.eveningTime ?? '21:00',
        sandhyaEnabled: body.sandhyaEnabled ?? false,
        sandhyaMorningTime: body.sandhyaMorningTime ?? '06:00',
        sandhyaNoonTime: body.sandhyaNoonTime ?? '12:00',
        sandhyaEveningTime: body.sandhyaEveningTime ?? '18:00',
        streakWarningEnabled: body.streakWarningEnabled ?? true,
        streakWarningTime: body.streakWarningTime ?? '20:00',
        dailyDigestEnabled: body.dailyDigestEnabled ?? false,
        weeklyDigestEnabled: body.weeklyDigestEnabled ?? true,
        weeklyDigestDay: body.weeklyDigestDay ?? 'sunday',
        emailNotifications: body.emailNotifications ?? true,
        pushNotifications: body.pushNotifications ?? false,
        timezone: body.timezone ?? 'UTC',
        createdAt: body.createdAt || now,
        updatedAt: now,
      },
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
