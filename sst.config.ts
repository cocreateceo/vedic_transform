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
    // Deploy the landing page to vedics.net
    const landingPage = new sst.aws.StaticSite("LandingPage", {
      path: "landing-page",
      domain: {
        name: "vedics.net",
        redirects: ["www.vedics.net"],
      },
    });

    // Deploy the Next.js app to 10x.vedics.net
    const app = new sst.aws.Nextjs("VedicTransformSite", {
      domain: "10x.vedics.net",
      permissions: [
        {
          actions: ["dynamodb:*"],
          resources: ["arn:aws:dynamodb:us-east-1:*:table/VedicTransform-*"],
        },
      ],
    });

    return {
      landingPage: landingPage.url,
      app: app.url,
    };
  },
});
