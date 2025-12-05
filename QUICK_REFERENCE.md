# Expense Tracker - Quick Reference Guide

## 📋 Project Structure

```
ExpanseTrackkingSystem/
├── server/                          # Node.js/Express backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── redis.js                # Redis connection
│   ├── controllers/
│   │   ├── user.js                 # User management
│   │   ├── category.js             # Category CRUD
│   │   ├── expense.js              # Expense transactions
│   │   ├── income.js               # Income transactions
│   │   ├── budgetController.js     # Budget management
│   │   ├── uploadController.js     # File uploads
│   │   ├── account.js              # Account management
│   │   ├── transaction.js          # Transaction CRUD
│   │   └── report.js               # Analytics & reports
│   ├── models/
│   │   ├── userModel.js            # User schema (JWT, roles)
│   │   ├── categoryModel.js        # Category schema
│   │   ├── transactionModel.js     # Transaction schema (unified)
│   │   ├── budgetModel.js          # Budget schema
│   │   ├── accountModel.js         # Account schema
│   │   ├── auditLogModel.js        # Audit trail
│   │   ├── expenseModel.js         # Legacy (deprecated)
│   │   └── IncomeModel.js          # Legacy (deprecated)
│   ├── routes/
│   │   ├── userRoutes.js           # /api/users
│   │   ├── categoryRoutes.js       # /api/categories
│   │   ├── expenseRoutes.js        # /api/expenses
│   │   ├── incomeRoutes.js         # /api/incomes
│   │   ├── transactionRoutes.js    # /api/transactions
│   │   ├── budgetRoutes.js         # /api/budgets
│   │   ├── accountRoutes.js        # /api/accounts
│   │   ├── reportRoutes.js         # /api/reports
│   │   └── uploadRoutes.js         # /api/upload
│   ├── middleware/
│   │   ├── rbacMiddleware.js       # Authentication & authorization
│   │   └── errorHandler.js         # Error handling
│   ├── utils/
│   │   ├── validators.js           # Input validation
│   │   ├── s3Upload.js             # AWS S3 utilities
│   │   └── jwtUtils.js             # JWT token management
│   ├── index.js                    # Main Express app
│   ├── package.json                # Dependencies
│   └── .env                        # Environment variables
│
├── client/                         # React frontend (to be created)
│   ├── public/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API services
│   │   ├── store/                  # Zustand state management
│   │   ├── hooks/                  # Custom React hooks
│   │   └── App.jsx                 # Root component
│   ├── package.json
│   └── .env
│
├── REACT_SETUP_COMPLETE.md         # React setup guide
├── API_DOCUMENTATION.md            # API endpoints reference
├── DEPLOYMENT_GUIDE.md             # Production deployment
└── TESTING_GUIDE.md                # Testing strategies

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB Atlas (cloud) or local MongoDB
- Redis (local or cloud)
- AWS S3 bucket (for file uploads)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
# Server runs on http://localhost:8000
```

### Environment Variables (.env)
```
PORT=8000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-random-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1
```

### Frontend Setup
```bash
cd client
npx create-react-app .
npm install react-router-dom zustand react-query axios recharts
npm start
# App runs on http://localhost:3000
```

---

## 📡 API Base URL
```
http://localhost:8000/api
```

---

## 🔐 Authentication Flow

### 1. Signup
```javascript
POST /users/signup
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
// Response: { userId, email, accessToken, refreshToken }
```

### 2. Login
```javascript
POST /users/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
// Response: { user, accessToken, refreshToken }
```

### 3. Use Token
```javascript
// Add to all requests
Authorization: Bearer <accessToken>
```

### 4. Refresh Token
```javascript
POST /users/refresh-token
{
  "refreshToken": "<refreshToken>"
}
// Returns new accessToken
```

---

## 💰 Transaction Types

### Expense
```javascript
POST /transactions
{
  "type": "expense",
  "category": "Food",
  "amount": 500,
  "date": "2024-01-15",
  "description": "Lunch at restaurant"
}
```

### Income
```javascript
POST /transactions
{
  "type": "income",
  "category": "Salary",
  "amount": 50000,
  "date": "2024-01-01"
}
```

### Transfer
```javascript
POST /transactions
{
  "type": "transfer",
  "fromAccount": "account-1",
  "toAccount": "account-2",
  "amount": 10000,
  "date": "2024-01-15"
}
```

---

## 💳 Budget Management

### Create Budget
```javascript
POST /budgets
{
  "category": "Food",
  "limit": 5000,
  "period": "monthly",
  "alertThreshold": 80,
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Get Budget Status
```javascript
GET /budgets/status/Food
// Returns: { limit, spent, remaining, percentageUsed, alertTriggered }
```

### Update Budget
```javascript
PUT /budgets/:budgetId
{
  "limit": 6000,
  "alertThreshold": 75
}
```

### Reset Budget Spent
```javascript
POST /budgets/:budgetId/reset
// Resets spent amount for new period
```

---

## 📁 File Upload

### Upload Single Receipt
```javascript
POST /upload/:transactionId
FormData {
  file: <file>
}
// Max size: 5MB (PNG, JPG, PDF)
```

### Bulk Upload
```javascript
POST /upload/:transactionId/bulk
FormData {
  files: [<file1>, <file2>, ...]
}
// Max 5 files, 5MB each
```

### Get Attachments
```javascript
GET /upload/:transactionId
// Returns: [{ url, fileName, uploadedAt }, ...]
```

### Delete Attachment
```javascript
DELETE /upload/:transactionId/:attachmentIndex
```

---

## 📊 Reports & Analytics

### Dashboard Stats
```javascript
GET /reports/dashboard
// Returns: totalIncome, totalExpenses, balance, activeBudgets, monthlyData, categoryData
```

### Monthly Report
```javascript
GET /reports/monthly?month=01&year=2024
// Returns: income, expenses, netIncome, categoryBreakdown, savingsRate
```

### Category Analytics
```javascript
GET /reports/category-analytics?startDate=2024-01-01&endDate=2024-01-31
// Returns: categories with amount, percentage, transaction count
```

---

## 🛠️ Core Features

### ✅ Implemented
- User authentication (JWT + refresh tokens)
- Role-based access control (RBAC)
- Transaction management (income/expense/transfer)
- Budget management with alerts
- Category management
- File uploads to S3
- Audit logging
- Report generation
- Account management
- Pagination & filtering

### 🟡 Partially Implemented
- React frontend (architecture documented, components pending)
- Email notifications (backend ready, email service not configured)

### ⭕ Pending
- Recurring transaction scheduler (BullMQ)
- Real-time notifications (WebSockets)
- Mobile app
- Advanced reporting (custom date ranges, export)

---

## 📝 Common API Patterns

### Pagination
```javascript
GET /transactions?page=1&limit=20
// Response: { data: [...], pagination: { page, limit, total, pages } }
```

### Filtering
```javascript
GET /transactions?type=expense&category=Food&minAmount=100&maxAmount=5000
GET /transactions?startDate=2024-01-01&endDate=2024-01-31
```

### Sorting
```javascript
GET /transactions?sort=date&order=desc
// sort: date, amount, category, createdAt
// order: asc, desc
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## 🔒 RBAC (Role-Based Access Control)

### Roles
- **admin**: Full access to all resources
- **manager**: Can read/write/approve transactions and budgets
- **user**: Can read/write own transactions, read own budgets

### Permissions
- `read`: View resources
- `write`: Create/update resources
- `delete`: Delete resources
- `approve`: Approve transactions (manager only)

### Example Middleware Usage
```javascript
router.post('/transactions', 
  authenticate,                    // Check JWT token
  authorize(['write']),            // Check permission
  handleCreateTransaction          // Handler
);
```

---

## 🧪 Testing Commands

### Backend Tests
```bash
cd server
npm test                           # Run all tests
npm run test:watch                # Watch mode
npm run test:coverage             # Coverage report
```

### Frontend Tests
```bash
cd client
npm test                           # Run tests
npm test -- --watch               # Watch mode
npm test -- --coverage            # Coverage report
```

### E2E Tests
```bash
npx cypress open                   # Interactive
npx cypress run                    # Headless
```

### Load Testing
```bash
npx artillery run load-test.yml    # Performance testing
```

---

## 🚢 Deployment Options

### Recommended Stack
- **Backend**: Railway or Heroku ($5-15/month)
- **Frontend**: Vercel (free)
- **Database**: MongoDB Atlas (free tier up to 1GB)
- **Storage**: AWS S3 (free tier up to 5GB)
- **Total**: ~$5-15/month

### One-Click Deployment
1. **Railway**: `npm install -g @railway/cli && railway up`
2. **Vercel**: Push to GitHub, auto-deploys
3. **Heroku**: `heroku create && git push heroku main`

---

## 🐛 Debugging Tips

### Check MongoDB Connection
```bash
# In server terminal
echo 'db.runCommand({ ping: 1 })' | mongosh "your-connection-string"
```

### Check Redis Connection
```bash
# In terminal
redis-cli ping
```

### Check API Health
```bash
curl http://localhost:8000/dashboard
```

### View Logs
```bash
# Backend
pm2 logs

# Frontend (dev)
npm start
```

---

## 📦 Dependencies

### Backend (Express Stack)
```json
{
  "express": "4.18.x",
  "mongoose": "7.x",
  "bcrypt": "5.x",
  "jsonwebtoken": "9.x",
  "uuid": "9.x",
  "ioredis": "5.x",
  "aws-sdk": "2.x",
  "multer": "1.x",
  "cors": "2.x"
}
```

### Frontend (React Stack)
```json
{
  "react": "18.x",
  "react-router-dom": "6.x",
  "zustand": "4.x",
  "react-query": "3.x",
  "axios": "1.x",
  "recharts": "2.x",
  "tailwindcss": "3.x"
}
```

---

## 💡 Best Practices

### API Development
- ✅ Always validate input with joi/yup
- ✅ Use pagination for list endpoints
- ✅ Return consistent response format
- ✅ Log all major operations (audit trail)
- ✅ Use appropriate HTTP status codes
- ✅ Implement rate limiting

### Security
- ✅ Hash passwords with bcrypt (10 rounds)
- ✅ Use JWT for stateless auth
- ✅ Implement RBAC for authorization
- ✅ Validate all file uploads
- ✅ Use HTTPS in production
- ✅ Store secrets in .env
- ✅ Implement CSRF protection

### Database
- ✅ Create indexes for frequently queried fields
- ✅ Use soft deletes for important data
- ✅ Implement database backups
- ✅ Monitor slow queries
- ✅ Use connection pooling

### Frontend
- ✅ Use React Router for navigation
- ✅ Implement error boundaries
- ✅ Use Zustand for state management
- ✅ Optimize images
- ✅ Implement lazy loading
- ✅ Use React Query for API calls

---

## 🆘 Troubleshooting

### "MongoDB Connection Failed"
1. Check connection string in .env
2. URL-encode special characters in password
3. Whitelist IP in MongoDB Atlas
4. Check network connectivity

### "JWT Token Expired"
1. Use refresh token endpoint
2. Implement automatic token refresh
3. Clear localStorage and re-login

### "CORS Error"
1. Check CORS middleware is configured
2. Verify frontend URL in CORS whitelist
3. Check credentials flag if sending cookies

### "File Upload Fails"
1. Check AWS S3 credentials
2. Verify bucket exists and is accessible
3. Check file size limit (5MB)
4. Verify CORS settings on S3

### "Budget Not Updating"
1. Verify transaction type is 'expense'
2. Check budget period matches transaction date
3. Ensure budget is active
4. Check category matches exactly

---

## 📞 Getting Help

### Documentation
- API Docs: `API_DOCUMENTATION.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Testing: `TESTING_GUIDE.md`
- React Setup: `REACT_SETUP_COMPLETE.md`

### Common Resources
- MongoDB Docs: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- JWT: https://jwt.io/

---

## ✨ Next Steps

1. **Frontend Implementation**
   - Run `npx create-react-app client`
   - Follow `REACT_SETUP_COMPLETE.md`
   - Create components from examples

2. **Testing**
   - Set up Jest and Cypress
   - Follow `TESTING_GUIDE.md`
   - Achieve 80%+ coverage

3. **Deployment**
   - Choose platform (Railway/Vercel recommended)
   - Follow `DEPLOYMENT_GUIDE.md`
   - Set up monitoring and alerts

4. **Advanced Features**
   - Implement recurring transactions
   - Add email notifications
   - Set up WebSocket for real-time updates
   - Create mobile app

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)           │
│         (Dashboard, Transactions, Budgets, etc)         │
└────────────────────┬────────────────────────────────────┘
                     │ API Calls (axios)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Express.js Backend (Port 8000)             │
│  (Routes, Controllers, Middleware, Validation)          │
└─────────────┬──────────────────────────┬────────────────┘
              ↓                          ↓
    ┌─────────────────┐        ┌─────────────────┐
    │  MongoDB Atlas  │        │  Redis Cache    │
    │  (Databases)    │        │  (Sessions)     │
    └─────────────────┘        └─────────────────┘
              ↑
              ├─ AWS S3 (File Storage)
              └─ JWT Auth + RBAC
```

---

## 🎯 Performance Metrics

### Targets
- API Response Time: < 200ms
- Page Load Time: < 3s
- Database Query Time: < 100ms
- File Upload Time: < 5s
- Concurrent Users: 100+

### Monitoring
- Use PM2 Plus for backend monitoring
- Use Datadog/New Relic for APM
- Set up CloudWatch for AWS resources
- Monitor error rates with Sentry

---

Last Updated: January 2024
Version: 1.0.0
