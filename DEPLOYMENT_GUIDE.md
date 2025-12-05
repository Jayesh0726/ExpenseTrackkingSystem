# Expense Tracker Deployment Guide

## Overview
This guide covers deploying both the backend (Node.js/Express) and frontend (React) to production environments.

---

## Backend Deployment

### Option 1: Railway (Recommended for Beginners)

**Step 1: Install Railway CLI**
```bash
npm i -g @railway/cli
```

**Step 2: Login to Railway**
```bash
railway login
```

**Step 3: Create Railway Project**
```bash
railway init
```

**Step 4: Set Environment Variables**
```bash
railway variables set MONGO_URI=mongodb+srv://...
railway variables set JWT_SECRET=your-secret-key
railway variables set REDIS_HOST=redis.railway.internal
railway variables set AWS_ACCESS_KEY_ID=your-key
railway variables set AWS_SECRET_ACCESS_KEY=your-secret
railway variables set AWS_BUCKET_NAME=your-bucket
railway variables set AWS_REGION=us-east-1
```

**Step 5: Deploy**
```bash
railway up
```

### Option 2: Heroku (Classic Alternative)

**Step 1: Install Heroku CLI**
```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku
```

**Step 2: Login**
```bash
heroku login
```

**Step 3: Create App**
```bash
heroku create your-app-name
```

**Step 4: Set Config Variables**
```bash
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set REDIS_HOST=redis-server-url
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_BUCKET_NAME=your-bucket
heroku config:set AWS_REGION=us-east-1
```

**Step 5: Deploy**
```bash
git push heroku main
```

### Option 3: AWS EC2

**Step 1: Launch EC2 Instance**
- Choose Ubuntu 20.04 LTS
- Select t2.micro (free tier)
- Configure security group (open ports 22, 80, 443, 8000)

**Step 2: Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

**Step 3: Install Dependencies**
```bash
sudo apt update
sudo apt install -y nodejs npm mongodb-org redis-server

# Start MongoDB and Redis
sudo systemctl start mongod
sudo systemctl start redis-server
```

**Step 4: Clone and Deploy**
```bash
git clone your-repo-url
cd server
npm install
npm start
```

**Step 5: Use PM2 for Process Management**
```bash
npm install -g pm2
pm2 start index.js --name "expense-tracker"
pm2 save
pm2 startup
```

### Option 4: Docker Containerization

**Create `Dockerfile`:**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      MONGO_URI: ${MONGO_URI}
      JWT_SECRET: ${JWT_SECRET}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - redis
      - mongo
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

  mongo:
    image: mongo:5
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

---

## Frontend Deployment

### Option 1: Vercel (Easiest)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/expense-tracker-client.git
git push -u origin main
```

**Step 2: Connect to Vercel**
- Go to vercel.com
- Click "New Project"
- Select your GitHub repository
- Click "Import"

**Step 3: Set Environment Variables**
In Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_JWT_TOKEN_KEY=expenseTrackerToken
REACT_APP_REFRESH_TOKEN_KEY=expenseTrackerRefreshToken
```

**Step 4: Deploy**
- Vercel auto-deploys on git push to main

### Option 2: Netlify

**Step 1: Build Project**
```bash
npm run build
```

**Step 2: Connect to Netlify**
- Go to netlify.com
- Drag and drop the `build` folder
- OR connect GitHub for auto-deploy

**Step 3: Configure Environment**
In Netlify dashboard → Settings → Build & Deploy:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Option 3: AWS S3 + CloudFront

**Step 1: Create S3 Bucket**
```bash
aws s3 mb s3://your-expense-tracker-app
```

**Step 2: Build and Upload**
```bash
npm run build

aws s3 sync build/ s3://your-expense-tracker-app \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp build/index.html s3://your-expense-tracker-app/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"
```

**Step 3: Create CloudFront Distribution**
- Set origin to S3 bucket
- Enable HTTPS
- Set default root object to `index.html`

### Option 4: Self-Hosted (VPS)

**Step 1: Connect to VPS**
```bash
ssh root@your-vps-ip
```

**Step 2: Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y nginx
```

**Step 3: Build and Deploy**
```bash
git clone your-repo-url client
cd client
npm install
npm run build

# Copy build to nginx
sudo cp -r build/* /var/www/html/
```

**Step 4: Configure Nginx**
Create `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

**Step 5: Restart Nginx**
```bash
sudo systemctl restart nginx
```

---

## Environment Variables Checklist

### Backend (.env)
- [ ] `PORT=8000`
- [ ] `MONGO_URI=mongodb+srv://user:pass@...`
- [ ] `JWT_SECRET=random-secret-key`
- [ ] `REDIS_HOST=your-redis-host`
- [ ] `REDIS_PORT=6379`
- [ ] `AWS_ACCESS_KEY_ID=your-key`
- [ ] `AWS_SECRET_ACCESS_KEY=your-secret`
- [ ] `AWS_BUCKET_NAME=your-bucket`
- [ ] `AWS_REGION=us-east-1`
- [ ] `NODE_ENV=production`

### Frontend (.env)
- [ ] `REACT_APP_API_URL=https://your-backend.com/api`
- [ ] `REACT_APP_JWT_TOKEN_KEY=expenseTrackerToken`
- [ ] `REACT_APP_REFRESH_TOKEN_KEY=expenseTrackerRefreshToken`

---

## Database Migration

### Backup MongoDB
```bash
mongodump --uri "mongodb+srv://user:pass@host/dbname" \
  --out /path/to/backup
```

### Restore MongoDB
```bash
mongorestore --uri "mongodb+srv://user:pass@host/dbname" \
  /path/to/backup
```

### Create Database Indexes
```javascript
// Run in MongoDB Atlas console or mongo shell
db.users.createIndex({ email: 1 }, { unique: true });
db.transactions.createIndex({ user: 1, date: -1 });
db.transactions.createIndex({ user: 1, category: 1, date: -1 });
db.budgets.createIndex({ user: 1, category: 1 });
db.auditlogs.createIndex({ user: 1, createdAt: -1 });
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt on VPS
```bash
sudo apt-get install certbot python3-certbot-nginx

sudo certbot certonly --nginx -d yourdomain.com

# Update nginx config with SSL certificate
```

### Using Certbot with Railway
```bash
# Railway automatically provides HTTPS
# No additional configuration needed
```

---

## Monitoring & Logging

### Backend Logging
```javascript
// Add to index.js
import fs from 'fs';

const logStream = fs.createWriteStream('logs/app.log', { flags: 'a' });

app.use((req, res, next) => {
  logStream.write(`${new Date().toISOString()} - ${req.method} ${req.path}\n`);
  next();
});
```

### Monitor with PM2
```bash
pm2 logs
pm2 monit
```

### Check Application Health
```bash
curl https://your-backend.com/health
```

---

## Performance Optimization

### Backend
1. Enable gzip compression:
```javascript
import compression from 'compression';
app.use(compression());
```

2. Add rate limiting:
```javascript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

3. Use connection pooling for MongoDB

### Frontend
1. Code splitting with React.lazy()
2. Image optimization
3. CDN for static assets
4. Minify CSS and JS
5. Enable service workers for offline support

---

## Scaling Strategy

### Phase 1: Single Server
- Backend on Railway/Heroku
- Frontend on Vercel
- Database on MongoDB Atlas (free tier)

### Phase 2: Load Balancing
- Multiple backend instances
- Load balancer (AWS ELB, NGINX)
- Database replication

### Phase 3: Microservices
- Separate services: Auth, Transactions, Reports
- Message queue (RabbitMQ, Kafka)
- Distributed caching

---

## Rollback Plan

### If Deployment Fails
```bash
# Railway
railway down

# Heroku
heroku releases
heroku rollback v123

# Docker
docker-compose down
docker-compose pull
docker-compose up -d
```

---

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test login functionality
- [ ] Test creating a transaction
- [ ] Test file upload
- [ ] Verify API connectivity
- [ ] Check error logs
- [ ] Test on mobile devices
- [ ] Run security audit
- [ ] Monitor application performance
- [ ] Set up database backups
- [ ] Configure email alerts for errors
- [ ] Test payment integration (if applicable)

---

## Monitoring Services

### Uptime Monitoring
- Pingdom
- UptimeRobot
- Statuspage.io

### Error Tracking
- Sentry
- Rollbar
- New Relic

### Analytics
- Google Analytics
- Mixpanel
- Segment

---

## Support & Troubleshooting

### Common Issues

**CORS Error**
```javascript
import cors from 'cors';
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Database Connection Timeout**
- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Increase connection timeout

**File Upload Fails**
- Verify AWS credentials
- Check bucket permissions
- Verify CORS settings on S3 bucket

**Memory Leak**
```bash
node --max-old-space-size=2048 index.js
```

---

## Cost Estimation

### Recommended Free Tier Setup
- **Backend**: Railway (free tier, $5/month paid)
- **Frontend**: Vercel (free)
- **Database**: MongoDB Atlas (free tier up to 1GB)
- **Cache**: Railway Redis (included)
- **Storage**: AWS S3 (free tier up to 5GB)
- **Total**: ~$5/month

### Scaling Cost (1000 users)
- Railway Backend: $15-30/month
- MongoDB Atlas M10: $60/month
- S3 Storage: $5-10/month
- **Total**: ~$80-100/month

---

## Next Steps

1. Choose deployment platform
2. Set up environment variables
3. Deploy backend first
4. Deploy frontend
5. Run integration tests
6. Monitor for 24 hours
7. Set up alerting
8. Create runbooks for common issues
