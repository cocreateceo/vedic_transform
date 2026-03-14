import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const assessmentType = event.queryStringParameters?.type;

    const params: any = {
      TableName: Resource.SelfAssessments.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
      ScanIndexForward: false,
    };

    if (assessmentType) {
      params.FilterExpression = 'assessmentType = :type';
      params.ExpressionAttributeValues[':type'] = assessmentType;
    }

    const result = await db.send(new QueryCommand(params));
    return ok({ assessments: result.Items || [] });
  }

  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const {
      assessmentType, dayNumber,
      stressLevel, sleepQuality, energyLevel, mentalClarity,
      physicalFitness, emotionalStability, spiritualConnection,
      lifeSatisfaction, focusLevel, overallWellbeing,
      biggestChallenge, biggestWin, oneWordFeeling, notes,
    } = body;

    if (!assessmentType) return err(400, 'assessmentType is required');

    const requiredFields = [stressLevel, sleepQuality, energyLevel, mentalClarity,
      physicalFitness, emotionalStability, spiritualConnection, lifeSatisfaction];
    if (requiredFields.some(f => f === undefined || f === null)) {
      return err(400, 'All assessment scores are required');
    }

    const now = new Date().toISOString();
    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.SelfAssessments.name,
      Item: {
        id,
        userId: user.id,
        assessmentDate: now,
        assessmentType,
        dayNumber: dayNumber || null,
        stressLevel, sleepQuality, energyLevel, mentalClarity,
        physicalFitness, emotionalStability, spiritualConnection,
        lifeSatisfaction,
        focusLevel: focusLevel || null,
        overallWellbeing: overallWellbeing || null,
        biggestChallenge: biggestChallenge || null,
        biggestWin: biggestWin || null,
        oneWordFeeling: oneWordFeeling || null,
        notes: notes || null,
        createdAt: now,
      },
    }));

    return ok({ success: true, id });
  }

  return err(405, 'Method not allowed');
}
