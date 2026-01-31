// Stub file - project migrated from Prisma/SQLite to DynamoDB
// These exports allow the build to pass while legacy code is migrated
// Use dynamodb.ts for actual database operations

export const prisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
  },
  checkin: {
    findMany: async () => [],
    count: async () => 0,
    groupBy: async () => [],
  },
  badge: {
    findMany: async () => [],
  },
  gratitudeEntry: {
    findMany: async () => [],
  },
  journalEntry: {
    findMany: async () => [],
  },
  $disconnect: async () => {},
};
