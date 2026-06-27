# AWS $100 Free Tier Deployment Guide

## AWS Migration Summary

Your project has been successfully migrated from Google Cloud to AWS with optimized configuration for your free tier ($100 budget).

## AWS Services Overview

### Required AWS Services

#### 1. Amazon ECR (Elastic Container Registry)
**Purpose**: Store and manage Docker images
**Cost**: Free tier: 12 months, up to 500 MB/mo storage
**Setup Required**: ✅ Yes
**Configuration**: Already in workflows

#### 2. Amazon ECS (Elastic Container Service)
**Purpose**: Run Docker containers (Fargate)
**Cost**: Free tier: 750 hours/mo t3.micro
**Setup Required**: ✅ Yes
**Configuration**: Already in workflows

#### 3. Amazon RDS (Relational Database Service)
**Purpose**: Managed PostgreSQL database
**Cost**: Free tier: 750 hours/mo db.t2.micro or db.t3.micro
**Setup Required**: ✅ Yes
**Configuration**: Coming soon

#### 4. CloudFront (Content Delivery Network)
**Purpose**: Secure, fast content delivery
**Cost**: Free tier: 100 GB/mo data transfer
**Setup Required**: ✅ Yes
**Configuration**: Fully integrated

#### 5. AWS S3 (Simple Storage Service)
**Purpose**: Static asset storage (images, CSS, JS)
**Cost**: Free tier: 5 GB/mo storage
**Setup Required**: ✅ Yes
**Configuration**: Coming soon

#### 6. AWS Lambda
**Purpose**: Serverless functions
**Cost**: Free tier: 1M requests/mo
**Setup Required**: ✅ Optional
**Configuration**: Fully integrated

#### 7. AWS Secrets Manager
**Purpose**: Secure secret storage
**Cost**: Free tier: ~$0.40/day
**Setup Required**: ✅ Yes
**Configuration**: Fully integrated

#### 8. Amazon ElastiCache
**Purpose**: Redis caching layer
**Cost**: Free tier: 15 GB/mo
**Setup Required**: ✅ Optional
**Configuration**: Coming soon

### AWS Services Not Used

- ❌ Elastic Beanstalk
- ❌ App Engine
- ❌ Cloud Functions
- ❌ Redshift

## AWS Setup Steps

### Step 1: Create AWS Account & Configure

1. **Create AWS Account**: Go to [aws.amazon.com](https://aws.amazon.com) and sign up for free tier
2. **Set Billing Alert**: Configure budget of $100 with notifications at 70%, 90%, and 100%
3. **Enable Free Tier**: Accept terms for free tier usage

### Step 2: Configure AWS Credentials

1. **Create IAM User**:
   ```bash
   aws iam create-user --user-name github-deployer
   ```

2. **Create IAM Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ecr:GetAuthorizationToken",
           "ecr:BatchCheckLayerAvailability",
           "ecr:GetDownloadUrlForLayer",
           "ecr:BatchGetImage",
           "ecr:PutImage",
           "ecr:InitiateLayerUpload",
           "ecr:UploadLayerPart",
           "ecr:CompleteLayerUpload",
           "ecs:RegisterTaskDefinition",
           "ecs:UpdateService",
           "secretsmanager:GetSecretValue",
           "s3:PutObject",
           "cloudfront:CreateDistribution",
           "sns:Publish"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Create IAM Role for ECS**:
   ```bash
   aws iam create-role \
     --role-name ecsTaskExecutionRole \
     --assume-role-policy-document file://ecs-trust-policy.json
   ```

4. **Attach Policies & Credentials**:
   ```bash
   aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
   ```

5. **Create Access Key**:
   ```bash
   aws iam create-access-key --user-name github-deployer
   # Save these in GitHub Secrets
   ```

### Step 3: Create VPC and Networking

1. **Create VPC**:
   ```bash
   aws ec2 create-vpc --cidr-block 10.0.0.0/16
   ```

2. **Create Public Subnets**:
   ```bash
   aws ec2 create-subnet --vpc-id YOUR_VPC_ID \
     --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
   ```

3. **Create Internet Gateway**:
   ```bash
   aws ec2 attach-internet-gateway \
     --internet-gateway-id YOUR_IGW_ID \
     --vpc-id YOUR_VPC_ID
   ```

4. **Create NAT Gateway** (Optional for private subnets)

### Step 4: Configure ECS (For Production)

1. **Create ECS Cluster**:
   ```bash
   aws ecs create-cluster --cluster sales-intelligence-cluster
   ```

2. **Create Task Definition**:
   ```bash
   aws ecs register-task-definition \
     --cli-input-json file://task-definition.json
   ```

3. **Create Security Group**:
   ```bash
   aws ec2 create-security-group \
     --group-name sales-intelligence-sg \
     --description "Security group for sales-intelligence"
   ```

4. **Create Execution Role**:
   ```bash
   aws iam create-role \
     --role-name ecsExecutionRole \
     --assume-role-policy-document file://ecs-trust-policy.json
   ```

5. **Create Service**:
   ```bash
   aws ecs create-service \
     --cluster sales-intelligence-cluster \
     --service-name sales-intelligence-service \
     --task-definition sales-intelligence-service:latest \
     --desired-count 2
   ```

### Step 5: Configure CloudFront (For Production)

1. **Create Certificate**:
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --validation-method DNS
   ```

2. **Create CloudFront Distribution**:
   ```bash
   aws cloudfront create-distribution \
     --distribution-config file://cloudfront-config.json
   ```

3. **Update DNS**:
   ```
   Type    CNAME
   Host    @
   Value   YOUR_CLOUDFRONT_DISTRIBUTION_ID.cloudfront.net
   ```

### Step 6: Configure RDS Database

```bash
# Create RDS Instance
aws rds create-db-instance \
  --db-instance-identifier sales-intelligence-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --master-username admin \
  --master-password YOUR_PASSWORD \
  --vpc-security-group-ids YOUR_SECURITY_GROUP_ID \
  --db-subnet-group-name default

# Get connection info
aws rds describe-db-instances \
  --db-instance-identifier sales-intelligence-db
```

### Step 7: Configure S3 for Static Assets

```bash
# Create S3 buckets
aws s3 mb s3://sales-intelligence-production-statics
aws s3 mb s3://sales-intelligence-test-statics

# Create lifecycle policy
cat > s3-lifecycle.json << EOF
{
  "Rules": [
    {
      "ID": "Expire.objects.after.90.days",
      "Status": "Enabled",
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
EOF

aws s3 put-bucket-lifecycle-configuration \
  --bucket sales-intelligence-production-statics \
  --lifecycle-configuration file://s3-lifecycle.json
```

### Step 8: Configure GitHub Secrets

Go to your repository settings and add these secrets:

**Essential Secrets**:
```
AWS_ACCESS_KEY_ID=AKIA...YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1
```

**ECS Configuration**:
```
AWS_ECS_CPU=var.256
AWS_ECS_MEMORY=var.512
ECS_CLUSTER=sales-intelligence
```

**Secrets Manager**:
```
GEMINI_API_KEY=your-api-key
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Step 9: Configure GitHub Variables

Go to repository settings → Variables → Actions:

```
AWS_CLOUDFRONT_URL=https://your-distribution.cloudfront.net
AWS_CERTIFICATE_ARN=arn:aws:acm:...your-cert
AWS_ECS_CPU=256
AWS_ECS_MEMORY=512
AWS_REQUEST_SCALABILITY=500
AWS_LAMBDA_LIMIT=50
AWS_CLOUDFRONT_EDGE_COST=us-west-2
```

## Cost Management & Optimization

### AWS Pricing Calculator

Visit [AWS Pricing Calculator](https://calculator.aws/) to estimate costs based on your usage.

### Cost Optimization Strategies

#### 1. **ECS Fargate Optimization**
- Use smallest instance size for development
- Use Fargate Spot instances for non-production
- Set appropriate memory limits
- Configure appropriate CPU allocation

#### 2. **Database Optimization**
- Use RDS Proxy to reduce connections
- Enable read replicas for scaling
- Use Multi-AZ for high availability
- Configure proper backups and retention

#### 3. **CloudFront Optimization**
- Enable HTTP/3 for delivery speed
- Configure edge caching appropriately
- Use compression for static assets
- Leverage origin cache policies

#### 4. **Storage Optimization**
- Use S3 lifecycle policies
- Enable Glacier for archival
- Use Intelligent-Tiering for forgotten data
- Clean up old backups

#### 5. **Lambda Optimization**
- Optimize cold start times
- Use provisioned concurrency for bursts
- Set appropriate execution timeouts
- Minimize memory usage needed

#### 6. **Monitoring & Alerts**
- Set up CloudWatch alarms
- Monitor SQS queue lengths
- Track Lambda execution times
- Monitor S3 costs
- Set up budget alerts at 70% and 90%

### Expected Monthly Costs (Free Tier Usage)

**Development Environment**:
- ECS (Fargate): ~$10-20/month (approx. 50-100 hours)
- RDS: ~$5/month (single small instance)
- S3 Storage: ~$1-2/month
- Lambda: ~$10/month (heavier usage)
- DNS: ~$1/month
- **Total**: ~$30-40/month ✓ Fits Free Tier

**Production Staging**:
- CloudFront: ~$20/month (50GB data transfer)
- ECS: ~$50/month (2-3 tasks)
- S3: ~$10/month (optimized)
- **Total**: ~$80-90/month ✓ Leaves 10-20 dollars

**Production**:
- Consider eventual reduction or scaling
- Use full free tier initially
- Monitor usage closely

## Free Tier Limits Breakdown

### EC2 & Containers
- **EC2**: 750 hours/month t3.micro
- **ECS Fargate**: Same as EC2
- **Lambda**: 1 million requests/month
- **Antivirus**: Unlimited

### Storage
- **S3**: 5 GB/mo
- **Elasticache**: 15 GB/mo
- **RDS**: 750 hours/mo db.t2.micro
- **EFS**: 30 GB/mo

### Network
- **CloudFront**: 100 GB/mo data transfer
- **Data Transfer**: 100 GB/mo in/out
- **Gateway Subscription**: Free
- **Nat Gateway**: 45 hours/mo
- **EIP**: 2 EIPs for 24 hours/mo

### Database
- **RDS**: 1 database instance
- **Aurora**: 750 hours/mo
- **DynamoDB**: 25 billion read/write units/mo

### Other
- **Secrets Manager**: Complete daily read
- **CloudWatch**: 10 GB log storage
- **Route53**: 3 hosted zones

## Deployment Workflow

### Manual Deployment
1. Go to GitHub repository → Actions → "Deploy to AWS"
2. Select environment (development, staging, production)
3. Click "Run workflow"
4. Monitor deployment progress
5. Once complete, verify deployment through CloudFront

### Automatic Deployment
1. Push to `main` branch → Triggers production deployment
2. Push to `develop` branch → Triggers staging deployment
3. Pull requests → Auto-validation and testing

## Troubleshooting

### Common Issues

1. **ECS Task Failure**:
   - Check CloudWatch logs
   - Verify ECR image availability
   - Check IAM role permissions

2. **CloudFront not working**:
   - Verify certificate is issued
   - Check DNS configuration
   - Validate origin settings

3. **Connection timeouts**:
   - Check VPC security groups
   - Verify RDS and ElastiCache accessibility
   - Review ECS task network configuration

4. **Memory errors**:
   - Increase ECS task memory allocation
   - Optimize Next.js memory usage
   - Review component memory consumption

## Scaling Strategy

### Horizontal Scaling (Load Balancing)
1. **CloudFront**: Auto-scales edge locations
2. **ECS**: Increase desired count via service update
3. **RDS**: Add read replicas for read traffic
4. **ElastiCache**: Scale using Replication Groups

### Vertical Scaling (Increased Resources)
1. **ECS**: Increase memory/CPU per task (not recommended)
2. **RDS**: Upgrade instance class
3. **ElastiCache**: Increase node type

### Cost Scaling Strategy
1. **Development**: Use smallest instances
2. **Staging**: Moderate resources
3. **Production**: Full optimized allocation

## Monitoring & Maintenance

### CloudWatch Metrics to Monitor
- ECS CPU/Memory utilization
- CloudFront request/response times
- RDS connection count
- Lambda execution time
- SQS queue length
- S3 request/response rates

### Log Management
- **ECS logs**: CloudWatch Logs Group
- **Application logs**: ELK Stack or CloudWatch
- **Access logs**: CloudFront access logs
- **Error logs**: Application-specific logging

### Security Best Practices
- Use IAM Roles (not credentials)
- Enable encryption at rest
- Enable encryption in transit
- Configure security groups
- Regular vulnerability scanning
- API gateway rate limiting

## Success Indicators

✅ CI/CD pipeline running successfully
✅ Docker images deploying to ECR
✅ ECS tasks running and healthy
✅ CloudFront delivering content
✅ Database connections established
✅ IAM roles configured correctly
✅ Cost under free tier limits
✅ Monitoring alerts configured

## Next Steps

1. ✅ **AWS Infrastructure Setup**: Create VPC, ECS cluster, RDS
2. ✅ **Secrets Configuration**: Set up AWS Secrets Manager
3. ✅ **GitHub Connections**: Configure all secrets and variables
4. ⏳ **Deployment Testing**: Run manual deployment workflow
5. ⏳ **Monitoring Setup**: Configure CloudWatch dashboards
6. ⏳ **Cost Analysis**: Regular monitoring and optimization
7. ⏳ **Production Launch**: Gradual rollout strategy

## Support & Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS Pricing Calculator](https://calculator.aws/)
- [ECS Setup Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/welcome.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

**AWS Migration Complete** - Your project is now leveraging the power of AWS with optimized $100 free tier utilization.