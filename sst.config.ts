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
    // Deploy the Next.js site to AWS Lambda
    const site = new sst.aws.Nextjs("VedicTransformSite", {
      permissions: [
        {
          actions: ["dynamodb:*"],
          resources: ["arn:aws:dynamodb:us-east-1:*:table/VedicTransform-*"],
        },
      ],
    });

    return {
      siteUrl: site.url,
    };
  },
});
