# Troubleshooting Guide

## Common Issues

### 1. Lambda Timeout

**Error:** `Task timed out after 10.00 seconds`

**Solution:** Increase timeout in `sst.config.ts`:
```typescript
const site = new sst.aws.Nextjs("VedicTransformSite", {
  timeout: "30 seconds",
});
```

### 2. DynamoDB Access Denied

**Error:** `AccessDeniedException: User is not authorized to perform: dynamodb:Query`

**Solution:** Add permissions in `sst.config.ts`:
```typescript
permissions: [{
  actions: ["dynamodb:*"],
  resources: ["arn:aws:dynamodb:us-east-1:*:table/VedicTransform-*"],
}]
```

### 3. Cannot Find Module 'index'

**Error:** `Runtime.ImportModuleError: Error: Cannot find module 'index'`

**Solution:** Clean and redeploy:
```bash
rm -rf .sst .open-next .next
npm run build
npx sst deploy --stage production
```

### 4. Invalid Token

**Cause:** JWT_SECRET mismatch or token expired

**Solution:** Verify JWT_SECRET in `.env.local` matches production

### 5. Slow Cold Starts

**Cause:** Lambda cold start (normal behavior)

**Options:**
- Accept 2-3s cold starts (most cost-effective)
- Use provisioned concurrency (+$10/month per instance)

## Debugging Tools

### View Lambda Logs
```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/vedi" --region us-east-1
```

### Query DynamoDB
```bash
aws dynamodb scan --table-name VedicTransform-Users --limit 10 --region us-east-1
```

### Test API Locally
```bash
npm run dev
# Test at http://localhost:3000
```

## Emergency Rollback

```bash
# Redeploy from last known good commit
git checkout LAST_GOOD_COMMIT
npm install
npm run build
npx sst deploy --stage production
```

---

**Document Version:** 1.0
**Last Updated:** January 2, 2026
