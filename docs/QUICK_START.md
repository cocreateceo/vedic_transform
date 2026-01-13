# Quick Start Guide

Get the Vedic Transform serverless application running in **under 10 minutes**.

---

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ AWS Account with admin access
- ✅ AWS CLI configured with credentials
- ✅ Git installed

---

## 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/GopiSunware/vedic-transformation.git
cd vedic-transformation

# Install dependencies
npm install
```

---

## 2. Configure Environment (1 minute)

Create `.env.local`:

```bash
JWT_SECRET=your-super-secret-key-min-32-characters-long
AWS_REGION=us-east-1
NODE_ENV=development
```

---

## 3. Create DynamoDB Tables (3 minutes)

```bash
# Create all 19 tables
aws dynamodb create-table --table-name VedicTransform-Users \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes "[{\"IndexName\":\"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST --region us-east-1
```

---

## 4. Run Development Server (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

---

## 5. Deploy to Production (3 minutes)

```bash
npm run build
npx sst deploy --stage production
```

---

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npx sst deploy --stage production  # Deploy to AWS
```

---

**Quick Start Complete!** 🎉
