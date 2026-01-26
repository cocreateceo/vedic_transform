# Vedic Transform - Deployment Guide

## Overview

This document explains how to deploy the Vedic Transform application to GitHub and AWS.

---

## GitHub Deployment

### Prerequisites
- Git installed locally
- GitHub account with repository access

### Steps

1. **Initialize Git Repository**
```bash
cd /path/to/vedic-transform
git init
```

2. **Add Remote Repository**
```bash
git remote add origin https://github.com/GopiSunware/vedic-transformation.git
```

3. **Configure Git User (if not set)**
```bash
git config user.email "your-email@example.com"
git config user.name "YourUsername"
```

4. **Add Files and Commit**
```bash
git add .
git commit -m "your commit message"
```

5. **Push to GitHub**
```bash
git branch -M main
git push -u origin main
```

### Repository URL
- https://github.com/GopiSunware/vedic-transformation

---

## AWS Deployment

### Architecture
```
User → CloudFront (HTTPS) → EC2 (Nginx:80 → Next.js:3000)
```

### Prerequisites
- AWS CLI configured with profile `sunwaretech`
- SSH key pair (`sunware-hr-key`) in AWS

### Step 1: Create Security Group

```bash
# Create security group
aws ec2 create-security-group \
  --group-name vedic-transform-sg \
  --description "Security group for Vedic Transform app" \
  --vpc-id <your-vpc-id> \
  --profile sunwaretech

# Add inbound rules (SSH, HTTP, HTTPS, Node.js port)
aws ec2 authorize-security-group-ingress \
  --group-id <security-group-id> \
  --protocol tcp --port 22 --cidr 0.0.0.0/0 \
  --profile sunwaretech

aws ec2 authorize-security-group-ingress \
  --group-id <security-group-id> \
  --protocol tcp --port 80 --cidr 0.0.0.0/0 \
  --profile sunwaretech

aws ec2 authorize-security-group-ingress \
  --group-id <security-group-id> \
  --protocol tcp --port 443 --cidr 0.0.0.0/0 \
  --profile sunwaretech

aws ec2 authorize-security-group-ingress \
  --group-id <security-group-id> \
  --protocol tcp --port 3000 --cidr 0.0.0.0/0 \
  --profile sunwaretech
```

### Step 2: Create EC2 User Data Script

Create a file `vedic-userdata.sh`:

```bash
#!/bin/bash
set -e

# Update system
yum update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs git nginx

# Install PM2 globally
npm install -g pm2

# Create app directory
mkdir -p /opt/vedic-transform
cd /opt/vedic-transform

# Clone the repository
git clone https://github.com/GopiSunware/vedic-transformation.git .

# Install dependencies
npm install

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed the database
npm run db:seed

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "vedic-transform" -- start
pm2 save
pm2 startup

# Configure Nginx as reverse proxy
cat > /etc/nginx/conf.d/vedic.conf << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

### Step 3: Launch EC2 Instance

```bash
aws ec2 run-instances \
  --image-id ami-08d7aabbb50c2c24e \
  --instance-type t2.small \
  --key-name sunware-hr-key \
  --security-group-ids <security-group-id> \
  --subnet-id <subnet-id> \
  --associate-public-ip-address \
  --user-data file://vedic-userdata.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=vedic-transform}]' \
  --profile sunwaretech
```

### Step 4: Wait for Instance and Get Public IP

```bash
# Wait for instance to be running
aws ec2 wait instance-running --instance-ids <instance-id> --profile sunwaretech

# Get public IP
aws ec2 describe-instances \
  --instance-ids <instance-id> \
  --profile sunwaretech \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text
```

### Step 5: Create CloudFront Distribution

Create `cloudfront-config.json`:

```json
{
  "CallerReference": "vedic-transform-unique-id",
  "Comment": "Vedic Transform Distribution",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "vedic-transform-origin",
        "DomainName": "<ec2-public-dns>",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only",
          "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
          },
          "OriginReadTimeout": 60,
          "OriginKeepaliveTimeout": 60
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "vedic-transform-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 7,
      "Items": ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "OriginRequestPolicyId": "216adef6-5c7f-47e4-b989-5492eafa07d3",
    "Compress": true
  }
}
```

Create distribution:

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --profile sunwaretech
```

---

## Current Deployment Details

| Resource | Value |
|----------|-------|
| **GitHub Repo** | https://github.com/GopiSunware/vedic-transformation |
| **CloudFront URL** | https://d2ygim4h37f5gc.cloudfront.net |
| **EC2 Instance ID** | i-0b2480c3c6600cbee |
| **EC2 Public IP** | 18.233.111.142 |
| **EC2 Direct URL** | http://18.233.111.142 |
| **Security Group** | sg-0910b64cf3bb336b8 |
| **CloudFront ID** | E2PV72CWKDPZLT |

---

## SSH Access to EC2

```bash
ssh -i /path/to/sunware-hr-key.pem ec2-user@18.233.111.142
```

### Useful Commands on EC2

```bash
# Check app status
pm2 status

# View app logs
pm2 logs vedic-transform

# Restart app
pm2 restart vedic-transform

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### 504 Gateway Timeout
- App may still be deploying (user data script takes 3-5 minutes)
- SSH into EC2 and check PM2 status: `pm2 status`
- Check if port 3000 is listening: `netstat -tlnp | grep 3000`

### App Not Starting
```bash
cd /opt/vedic-transform
pm2 logs vedic-transform --lines 50
```

### Database Issues
```bash
cd /opt/vedic-transform
npx prisma db push
npm run db:seed
```

### Rebuild App
```bash
cd /opt/vedic-transform
git pull
npm install
npm run build
pm2 restart vedic-transform
```
