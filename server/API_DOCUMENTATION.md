# Expense Tracking System - API Documentation

## Base URL
`http://localhost:8000/api`

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Sign Up
**POST** `/users/signup`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login
**POST** `/users/login`
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Refresh Token
**POST** `/users/refresh`
```json
{
  "refreshToken": "token_here"
}
```

### Verify Session
**POST** `/users/verify-session`
```json
{
  "sessionId": "session_id_here"
}
```

### Logout
**POST** `/users/logout`
```json
{
  "sessionId": "session_id_here"
}
```

---

## Transaction Endpoints

### Create Transaction
**POST** `/transactions`
```json
{
  "type": "expense",
  "amount": 50.00,
  "currency": "USD",
  "category": "category_id",
  "account": "account_id",
  "vendor": "Coffee Shop",
  "description": "Morning coffee",
  "tags": ["breakfast", "food"],
  "date": "2025-12-05T08:00:00Z",
  "recurring": {
    "isRecurring": false
  }
}
```

### Get All Transactions
**GET** `/transactions?page=1&limit=20&type=expense&startDate=2025-01-01&endDate=2025-12-31&sortBy=-date`

### Get Single Transaction
**GET** `/transactions/{transaction_id}`

### Update Transaction
**PUT** `/transactions/{transaction_id}`
```json
{
  "amount": 55.00,
  "description": "Updated description"
}
```

### Delete Transaction
**DELETE** `/transactions/{transaction_id}`

### Approve Transaction
**POST** `/transactions/{transaction_id}/approve`

---

## Account Endpoints

### Create Account
**POST** `/accounts`
```json
{
  "name": "My Savings",
  "type": "Bank",
  "currency": "USD",
  "balance": 5000
}
```

### Get All Accounts
**GET** `/accounts?page=1&limit=20`

### Get Single Account
**GET** `/accounts/{account_id}`

### Update Account
**PUT** `/accounts/{account_id}`
```json
{
  "name": "Updated Account Name",
  "balance": 5500
}
```

### Delete Account
**DELETE** `/accounts/{account_id}`

---

## Report Endpoints

### Get Dashboard
**GET** `/reports/dashboard`

Response includes:
- Monthly income & expense stats
- Budget status by category
- Recent transactions
- Top spending categories

### Get Financial Report
**GET** `/reports/financial-report?startDate=2025-01-01&endDate=2025-12-31&groupBy=month`

### Export Transactions
**GET** `/reports/export?startDate=2025-01-01&endDate=2025-12-31&format=csv`

---

## Category Endpoints

### Create Category
**POST** `/categories`
```json
{
  "name": "Food",
  "type": "Expense"
}
```

### Get All Categories
**GET** `/categories`

### Get Single Category
**GET** `/categories/{category_id}`

### Update Category
**PUT** `/categories/{category_id}`

### Delete Category
**DELETE** `/categories/{category_id}`

---

## Budget Endpoints

### Create Budget
**POST** `/budgets`
```json
{
  "category": "category_id",
  "period": "monthly",
  "limit": 500,
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "alertThreshold": 80
}
```

### Get All Budgets
**GET** `/budgets`

### Update Budget
**PUT** `/budgets/{budget_id}`

### Delete Budget
**DELETE** `/budgets/{budget_id}`

---

## User Endpoints

### Get Profile
**GET** `/users/profile`

### Update Profile
**PUT** `/users/profile`
```json
{
  "phone": "+1234567890",
  "profileImage": "image_url"
}
```

### Get All Users (Admin Only)
**GET** `/users`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Role-Based Access Control

### Roles & Permissions
- **Admin**: read, write, delete, approve, admin
- **Manager**: read, write, approve
- **User**: read, write

### Example: Create Transaction
- Requires: `write` permission
- Roles allowed: admin, manager, user

### Example: Delete Transaction
- Requires: `delete` permission
- Roles allowed: admin

### Example: Approve Transaction
- Requires: `approve` permission
- Roles allowed: admin, manager

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Features

✅ **Authentication & Security**
- JWT tokens (access + refresh)
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Session management with Redis

✅ **Transaction Management**
- Income, expense, and transfer transactions
- Recurring transactions
- Split payments
- Transaction attachments
- Status tracking (pending, approved, completed)

✅ **Budget & Alerts**
- Category-based budgets
- Budget period customization
- Alert thresholds
- Real-time spent tracking

✅ **Reporting & Analytics**
- Dashboard with KPIs
- Financial reports by category/period
- Transaction export (CSV/JSON)
- Spending trends

✅ **Audit & Compliance**
- Complete audit logs
- Before/after change tracking
- Soft deletes
- User action tracking

✅ **Account Management**
- Multiple accounts (cash, bank, credit card)
- Balance tracking
- Account types and currencies
