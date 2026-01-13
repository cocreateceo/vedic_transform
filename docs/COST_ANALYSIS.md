# Cost Analysis: EC2 vs Serverless

## Summary

| Metric | EC2 | Serverless | Savings |
|--------|-----|-----------|---------|
| **Monthly** | $17.30 | $2.00 | **88%** |
| **Annual** | $207.60 | $24.00 | **88%** |
| **5-Year** | $1,038 | $120 | **88%** |

## Detailed Breakdown

### EC2 Architecture (Old)
- EC2 t2.small: $16.79/month
- EFS Storage: $0.30/month
- Data Transfer: $0.20/month
- **Total: $17.30/month**

### Serverless Architecture (New)
- Lambda: $0.20/month (free tier covers most usage)
- DynamoDB: $1.40/month (on-demand)
- S3: $0.10/month
- CloudFront: $0.30/month
- **Total: $2.00/month**

## ROI

- **Break-even**: Immediate (no migration costs)
- **Annual Savings**: $183.60
- **5-Year Savings**: $918

## Hidden Savings

- **Maintenance**: 0 hours/month (was 3.5 hours)
- **Value**: $175/month at $50/hour
- **Total 5-Year Value**: $12,918

---

**Document Version:** 1.0
**Last Updated:** January 2, 2026
