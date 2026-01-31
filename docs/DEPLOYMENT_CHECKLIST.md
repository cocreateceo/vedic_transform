# Deployment Checklist

## Pre-Deployment

### Prerequisites
- [ ] Node.js 20+ installed
- [ ] AWS Account configured  
- [ ] AWS CLI installed
- [ ] Git installed

### Infrastructure Setup
- [ ] Create 19 DynamoDB tables
- [ ] Seed pillars data (12 items)
- [ ] Seed badges data (6 items)

### Configuration
- [ ] `.env.local` created with JWT_SECRET
- [ ] AWS_REGION set to us-east-1
- [ ] Dependencies installed (`npm install`)

## Deployment

### Build & Deploy
- [ ] Run `npm run build`
- [ ] Run `npx sst deploy --stage production`
- [ ] Note CloudFront URL

## Post-Deployment

### Verification
- [ ] Homepage loads (200 OK)
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard accessible
- [ ] API endpoints functional

### Testing Commands
```bash
# Test homepage
curl https://your-cloudfront-url.cloudfront.net

# Test registration
curl -X POST https://your-cloudfront-url.cloudfront.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","name":"Test"}'
```

### Monitoring
- [ ] CloudWatch logs accessible
- [ ] Billing alarm set up
- [ ] Cost monitoring enabled

## Sign-Off

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Production URL: _________________
- [ ] Deployment Date: _________________

---

**Checklist Version:** 1.0
**Last Updated:** January 2, 2026
