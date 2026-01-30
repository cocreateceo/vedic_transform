import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// Lazy initialization to avoid blocking app startup
let dynamodbClient: DynamoDBDocumentClient | null = null;

function getDynamoDBClient(): DynamoDBDocumentClient {
  if (!dynamodbClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      maxAttempts: 3,
      requestHandler: {
        connectionTimeout: 3000,
        requestTimeout: 5000,
      } as any,
    });
    dynamodbClient = DynamoDBDocumentClient.from(client);
  }
  return dynamodbClient;
}

export const dynamodb = new Proxy({} as DynamoDBDocumentClient, {
  get(target, prop) {
    const client = getDynamoDBClient();
    return (client as any)[prop];
  }
});

// Table name prefix
const TABLE_PREFIX = "VedicTransform-";

// Helper to generate CUID-like IDs (client-side)
export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// USER OPERATIONS
// ============================================

export const userDb = {
  async findUnique(params: { where: { id?: string; email?: string } }) {
    if (params.where.id) {
      const result = await dynamodb.send(
        new GetCommand({
          TableName: `${TABLE_PREFIX}Users`,
          Key: { id: params.where.id },
        })
      );
      return result.Item || null;
    }

    if (params.where.email) {
      const result = await dynamodb.send(
        new QueryCommand({
          TableName: `${TABLE_PREFIX}Users`,
          IndexName: "EmailIndex",
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": params.where.email,
          },
        })
      );
      return result.Items?.[0] || null;
    }

    return null;
  },

  async create(params: { data: any }) {
    const id = generateId();
    const now = new Date().toISOString();
    const user = {
      ...params.data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: `${TABLE_PREFIX}Users`,
        Item: user,
      })
    );

    return user;
  },

  async update(params: { where: { id: string }; data: any }) {
    const updates = Object.keys(params.data);
    const updateExpression = `SET ${updates.map((k, i) => `#${k} = :${k}`).join(", ")}, updatedAt = :updatedAt`;
    const expressionAttributeNames = updates.reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
    const expressionAttributeValues = {
      ...updates.reduce((acc, k) => ({ ...acc, [`:${k}`]: params.data[k] }), {}),
      ":updatedAt": new Date().toISOString(),
    };

    await dynamodb.send(
      new UpdateCommand({
        TableName: `${TABLE_PREFIX}Users`,
        Key: { id: params.where.id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return this.findUnique({ where: params.where });
  },
};

// ============================================
// JOURNEY OPERATIONS
// ============================================

export const journeyDb = {
  async findFirst(params: { where: { userId: string; isActive?: boolean } }) {
    const keyCondition = "userId = :userId";
    const filterExpression = params.where.isActive !== undefined
      ? "isActive = :isActive"
      : undefined;
    const expressionAttributeValues: any = {
      ":userId": params.where.userId,
    };
    if (params.where.isActive !== undefined) {
      expressionAttributeValues[":isActive"] = params.where.isActive;
    }

    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}Journeys`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: keyCondition,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: 1,
      })
    );

    return result.Items?.[0] || null;
  },

  async create(params: { data: any }) {
    const id = generateId();
    const now = new Date().toISOString();
    const journey = {
      ...params.data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: `${TABLE_PREFIX}Journeys`,
        Item: journey,
      })
    );

    return journey;
  },
};

// ============================================
// PILLAR OPERATIONS
// ============================================

export const pillarDb = {
  async findMany(params?: { where?: any; orderBy?: any }) {
    const result = await dynamodb.send(
      new ScanCommand({
        TableName: `${TABLE_PREFIX}Pillars`,
      })
    );

    return result.Items || [];
  },
};

// ============================================
// DAILY CHECKIN OPERATIONS
// ============================================

export const dailyCheckinDb = {
  async findMany(params: { where: any; include?: any }) {
    const keyCondition = "userId = :userId";
    const filterExpressions: string[] = [];
    const expressionAttributeValues: any = {
      ":userId": params.where.userId,
    };

    if (params.where.checkinDate) {
      filterExpressions.push("checkinDate = :checkinDate");
      expressionAttributeValues[":checkinDate"] = params.where.checkinDate.toISOString();
    }

    if (params.where.completed !== undefined) {
      filterExpressions.push("completed = :completed");
      expressionAttributeValues[":completed"] = params.where.completed;
    }

    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}DailyCheckins`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: keyCondition,
        FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    // Note: DynamoDB doesn't support joins, so we'll need to fetch related data separately if include is used
    // For now, returning items without includes
    return result.Items || [];
  },
};

// ============================================
// KARMA TRANSACTION OPERATIONS
// ============================================

export const karmaTransactionDb = {
  async findMany(params: { where: any; select?: any }) {
    const keyCondition = "userId = :userId";
    const expressionAttributeValues: any = {
      ":userId": params.where.userId,
    };

    const filterExpressions: string[] = [];
    if (params.where.createdAt?.gte) {
      filterExpressions.push("createdAt >= :createdAtGte");
      expressionAttributeValues[":createdAtGte"] = params.where.createdAt.gte.toISOString();
    }

    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}KarmaTransactions`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: keyCondition,
        FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return result.Items || [];
  },
};

// ============================================
// STREAK OPERATIONS
// ============================================

export const streakDb = {
  async findFirst(params: { where: { userId: string; journeyId: string }; select?: any }) {
    const keyCondition = "userId = :userId";
    const filterExpression = "journeyId = :journeyId";
    const expressionAttributeValues = {
      ":userId": params.where.userId,
      ":journeyId": params.where.journeyId,
    };

    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}Streaks`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: keyCondition,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: 1,
      })
    );

    return result.Items?.[0] || null;
  },

  async create(params: { data: any }) {
    const id = generateId();
    const now = new Date().toISOString();
    const streak = {
      ...params.data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: `${TABLE_PREFIX}Streaks`,
        Item: streak,
      })
    );

    return streak;
  },
};

// ============================================
// GOAL TASK OPERATIONS
// ============================================

export const goalTaskDb = {
  async findMany(params: { where: { userId: string }; orderBy?: any }) {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": params.where.userId,
        },
      })
    );

    return result.Items || [];
  },

  async create(params: { data: any }) {
    const id = generateId();
    const now = new Date().toISOString();
    const goalTask = {
      ...params.data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        Item: goalTask,
      })
    );

    return goalTask;
  },

  async update(params: { where: { id: string }; data: any }) {
    const updates = Object.keys(params.data);
    const updateExpression = `SET ${updates.map((k) => `#${k} = :${k}`).join(", ")}, updatedAt = :updatedAt`;
    const expressionAttributeNames = updates.reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
    const expressionAttributeValues = {
      ...updates.reduce((acc, k) => ({ ...acc, [`:${k}`]: params.data[k] }), {}),
      ":updatedAt": new Date().toISOString(),
    };

    await dynamodb.send(
      new UpdateCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        Key: { id: params.where.id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    const result = await dynamodb.send(
      new GetCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        Key: { id: params.where.id },
      })
    );

    return result.Item || null;
  },

  async delete(params: { where: { id: string } }) {
    await dynamodb.send(
      new DeleteCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        Key: { id: params.where.id },
      })
    );

    return { id: params.where.id };
  },

  async findUnique(params: { where: { id: string } }) {
    const result = await dynamodb.send(
      new GetCommand({
        TableName: `${TABLE_PREFIX}GoalTasks`,
        Key: { id: params.where.id },
      })
    );

    return result.Item || null;
  },
};

// ============================================
// FOCUS PILLAR OPERATIONS
// ============================================

export const focusPillarDb = {
  async findMany(params: { where: { userId: string }; orderBy?: any }) {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: `${TABLE_PREFIX}FocusPillars`,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": params.where.userId,
        },
      })
    );

    return result.Items || [];
  },

  async deleteMany(params: { where: { userId: string } }) {
    // First, get all focus pillars for this user
    const items = await this.findMany({ where: params.where });

    // Delete each one
    await Promise.all(
      items.map((item: any) =>
        dynamodb.send(
          new DeleteCommand({
            TableName: `${TABLE_PREFIX}FocusPillars`,
            Key: { id: item.id },
          })
        )
      )
    );

    return { count: items.length };
  },

  async create(params: { data: any }) {
    const id = generateId();
    const now = new Date().toISOString();
    const focusPillar = {
      ...params.data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: `${TABLE_PREFIX}FocusPillars`,
        Item: focusPillar,
      })
    );

    return focusPillar;
  },
};

// Export a Prisma-like interface
export const db = {
  user: userDb,
  journey: journeyDb,
  pillar: pillarDb,
  dailyCheckin: dailyCheckinDb,
  karmaTransaction: karmaTransactionDb,
  streak: streakDb,
  goalTask: goalTaskDb,
  focusPillar: focusPillarDb,
};
