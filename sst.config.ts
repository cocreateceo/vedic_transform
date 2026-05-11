/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "vedic-transform",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // ── Secrets ──────────────────────────────────────────────────────
    const jwtSecret = new sst.Secret("JwtSecret");
    const anthropicApiKey = new sst.Secret("AnthropicApiKey");

    // ── DynamoDB Tables ─────────────────────────────────────────────

    const users = new sst.aws.Dynamo("Users", {
      fields: {
        id: "string",
        email: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "email-index": {
          hashKey: "email",
        },
      },
    });

    const journeys = new sst.aws.Dynamo("Journeys", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const pillars = new sst.aws.Dynamo("Pillars", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    const dailyCheckins = new sst.aws.Dynamo("DailyCheckins", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const karmaTransactions = new sst.aws.Dynamo("KarmaTransactions", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const streaks = new sst.aws.Dynamo("Streaks", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const badges = new sst.aws.Dynamo("Badges", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    const userBadges = new sst.aws.Dynamo("UserBadges", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const gratitudeEntries = new sst.aws.Dynamo("GratitudeEntries", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const intentions = new sst.aws.Dynamo("Intentions", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const manifestations = new sst.aws.Dynamo("Manifestations", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const moodLogs = new sst.aws.Dynamo("MoodLogs", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const selfAssessments = new sst.aws.Dynamo("SelfAssessments", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const goalTasks = new sst.aws.Dynamo("GoalTasks", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const focusPillars = new sst.aws.Dynamo("FocusPillars", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const userInsights = new sst.aws.Dynamo("UserInsights", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const reminderSettings = new sst.aws.Dynamo("ReminderSettings", {
      fields: {
        userId: "string",
      },
      primaryIndex: { hashKey: "userId" },
    });

    const contentProgress = new sst.aws.Dynamo("ContentProgress", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    const notifications = new sst.aws.Dynamo("Notifications", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        "userId-index": {
          hashKey: "userId",
        },
      },
    });

    // ── API Gateway ─────────────────────────────────────────────────
    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // ── Auth Routes ─────────────────────────────────────────────────
    const authLink = [users, jwtSecret];

    api.route("POST /auth/register", {
      handler: "functions/auth/register.handler",
      link: authLink,
    });

    api.route("POST /auth/login", {
      handler: "functions/auth/login.handler",
      link: authLink,
    });

    // ── Data Routes ─────────────────────────────────────────────────

    // User profile
    const userLink = [users, jwtSecret];
    api.route("GET /data/user", {
      handler: "functions/data/user.handler",
      link: userLink,
    });
    api.route("PATCH /data/user", {
      handler: "functions/data/user.handler",
      link: userLink,
    });

    // Journey
    const journeyLink = [journeys, streaks, jwtSecret];
    api.route("GET /data/journey", {
      handler: "functions/data/journey.handler",
      link: journeyLink,
    });
    api.route("POST /data/journey", {
      handler: "functions/data/journey.handler",
      link: journeyLink,
    });

    // Karma Shield purchase (P0-5)
    const buyShieldLink = [streaks, karmaTransactions, jwtSecret];
    api.route("POST /data/streaks/buy-shield", {
      handler: "functions/data/buy-shield.handler",
      link: buyShieldLink,
    });

    // Checkin
    const checkinLink = [dailyCheckins, streaks, karmaTransactions, jwtSecret];
    api.route("GET /data/checkin", {
      handler: "functions/data/checkin.handler",
      link: checkinLink,
    });
    api.route("POST /data/checkin", {
      handler: "functions/data/checkin.handler",
      link: checkinLink,
    });

    // Goals
    const goalsLink = [goalTasks, jwtSecret];
    api.route("GET /data/goals", {
      handler: "functions/data/goals.handler",
      link: goalsLink,
    });
    api.route("POST /data/goals", {
      handler: "functions/data/goals.handler",
      link: goalsLink,
    });
    api.route("PATCH /data/goals", {
      handler: "functions/data/goals.handler",
      link: goalsLink,
    });
    api.route("DELETE /data/goals", {
      handler: "functions/data/goals.handler",
      link: goalsLink,
    });

    // Focus Pillars
    const focusPillarsLink = [focusPillars, jwtSecret];
    api.route("GET /data/focus-pillars", {
      handler: "functions/data/focus-pillars.handler",
      link: focusPillarsLink,
    });
    api.route("POST /data/focus-pillars", {
      handler: "functions/data/focus-pillars.handler",
      link: focusPillarsLink,
    });

    // Journal (gratitude, intentions, manifestations)
    const journalLink = [gratitudeEntries, intentions, manifestations, jwtSecret];
    api.route("GET /data/journal", {
      handler: "functions/data/journal.handler",
      link: journalLink,
    });
    api.route("POST /data/journal", {
      handler: "functions/data/journal.handler",
      link: journalLink,
    });

    // Mood
    const moodLink = [moodLogs, jwtSecret];
    api.route("GET /data/mood", {
      handler: "functions/data/mood.handler",
      link: moodLink,
    });
    api.route("POST /data/mood", {
      handler: "functions/data/mood.handler",
      link: moodLink,
    });

    // Assessment
    const assessmentLink = [selfAssessments, jwtSecret];
    api.route("GET /data/assessment", {
      handler: "functions/data/assessment.handler",
      link: assessmentLink,
    });
    api.route("POST /data/assessment", {
      handler: "functions/data/assessment.handler",
      link: assessmentLink,
    });

    // Insights
    const insightsLink = [userInsights, jwtSecret];
    api.route("GET /data/insights", {
      handler: "functions/data/insights.handler",
      link: insightsLink,
    });
    api.route("POST /data/insights", {
      handler: "functions/data/insights.handler",
      link: insightsLink,
    });
    api.route("PATCH /data/insights", {
      handler: "functions/data/insights.handler",
      link: insightsLink,
    });

    // Reminders
    const remindersLink = [reminderSettings, jwtSecret];
    api.route("GET /data/reminders", {
      handler: "functions/data/reminders.handler",
      link: remindersLink,
    });
    api.route("PUT /data/reminders", {
      handler: "functions/data/reminders.handler",
      link: remindersLink,
    });

    // Reports
    const reportsLink = [journeys, dailyCheckins, karmaTransactions, streaks, userBadges, jwtSecret];
    api.route("GET /data/reports", {
      handler: "functions/data/reports.handler",
      link: reportsLink,
    });

    // Notifications
    const notificationsLink = [notifications, jwtSecret];
    api.route("GET /data/notifications", {
      handler: "functions/data/notifications.handler",
      link: notificationsLink,
    });
    api.route("PATCH /data/notifications", {
      handler: "functions/data/notifications.handler",
      link: notificationsLink,
    });

    // Content Progress
    const contentProgressLink = [contentProgress, jwtSecret];
    api.route("GET /data/content-progress", {
      handler: "functions/data/content-progress.handler",
      link: contentProgressLink,
    });
    api.route("POST /data/content-progress", {
      handler: "functions/data/content-progress.handler",
      link: contentProgressLink,
    });

    // Achievements
    const achievementsLink = [badges, userBadges, jwtSecret];
    api.route("GET /data/achievements", {
      handler: "functions/data/achievements.handler",
      link: achievementsLink,
    });

    // ── Chat (AI Assistant) ─────────────────────────────────────
    api.route("POST /chat", {
      handler: "functions/chat/chat.handler",
      link: [jwtSecret, anthropicApiKey],
    });

    // ── Static Site ─────────────────────────────────────────────────
    const site = new sst.aws.StaticSite("VedicTransformSite", {
      build: {
        command: "npm run build",
        output: "out",
      },
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
    });

    return {
      api: api.url,
      site: site.url,
    };
  },
});
