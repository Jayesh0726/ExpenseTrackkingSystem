# Expense Tracker API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except login/signup) require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## User Management Endpoints

### 1. User Signup
**POST** `/users/signup`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "uuid-string",
    "email": "john@example.com",
    "firstName": "John",
    "role": "user"
  }
}
```

### 2. User Login
**POST** `/users/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "uuid-string",
      "email": "john@example.com",
      "firstName": "John",
      "role": "user"
    },
    "accessToken": "jwt-token-15min",
    "refreshToken": "jwt-token-7days"
  }
}
```

### 3. Refresh Token
**POST** `/users/refresh-token`

**Request:**
```json
{
  "refreshToken": "previous-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

### 4. Get User Profile
**GET** `/users/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-string",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "profilePicture": "url",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5. Update User Profile
**PUT** `/users/profile`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": "url"
}
```

---

## Transaction Endpoints

### 1. Create Transaction
**POST** `/transactions`

**Request:**
```json
{
  "type": "expense",
  "category": "Food",
  "amount": 500,
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "account": "account-id",
  "tags": ["lunch", "restaurant"],
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid-string",
    "type": "expense",
    "amount": 500,
    "category": "Food",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 2. Get All Transactions
**GET** `/transactions?page=1&limit=20&type=expense&category=Food&startDate=2024-01-01&endDate=2024-01-31`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: 'income' | 'expense' | 'transfer'
- `category`: Filter by category
- `startDate`: YYYY-MM-DD format
- `endDate`: YYYY-MM-DD format
- `minAmount`: Minimum amount
- `maxAmount`: Maximum amount

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 3. Get Single Transaction
**GET** `/transactions/:transactionId`

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid-string",
    "type": "expense",
    "amount": 500,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15",
    "attachments": [
      {
        "url": "s3-url",
        "fileName": "receipt.jpg",
        "uploadedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 4. Update Transaction
**PUT** `/transactions/:transactionId`

**Request:**
```json
{
  "amount": 600,
  "description": "Updated lunch amount",
  "category": "Food & Dining"
}
```

### 5. Delete Transaction
**DELETE** `/transactions/:transactionId`

---

## Category Endpoints

### 1. Create Category
**POST** `/categories`

**Request:**
```json
{
  "name": "Food",
  "type": "expense",
  "color": "#FF6B6B",
  "icon": "utensils"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": "uuid-string",
    "name": "Food",
    "type": "expense",
    "color": "#FF6B6B"
  }
}
```

### 2. Get All Categories
**GET** `/categories?type=expense&page=1`

**Query Parameters:**
- `type`: 'income' | 'expense'
- `page`: Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [...],
    "pagination": {
      "page": 1,
      "total": 12
    }
  }
}
```

### 3. Get Single Category
**GET** `/categories/:categoryId`

### 4. Update Category
**PUT** `/categories/:categoryId`

**Request:**
```json
{
  "name": "Food & Dining",
  "color": "#FF8B8B"
}
```

### 5. Delete Category
**DELETE** `/categories/:categoryId`

---

## Budget Endpoints

### 1. Create Budget
**POST** `/budgets`

**Request:**
```json
{
  "category": "Food",
  "limit": 5000,
  "period": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "alertThreshold": 80,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "budgetId": "uuid-string",
    "category": "Food",
    "limit": 5000,
    "spent": 2500,
    "remaining": 2500,
    "percentageUsed": 50,
    "period": "monthly"
  }
}
```

### 2. Get All Budgets
**GET** `/budgets?page=1&isActive=true`

**Query Parameters:**
- `page`: Page number
- `isActive`: true | false

**Response:**
```json
{
  "success": true,
  "data": {
    "budgets": [...],
    "pagination": {
      "page": 1,
      "total": 8
    }
  }
}
```

### 3. Get Budget Status
**GET** `/budgets/status/:categoryId`

**Response:**
```json
{
  "success": true,
  "data": {
    "budgetId": "uuid-string",
    "category": "Food",
    "limit": 5000,
    "spent": 4500,
    "remaining": 500,
    "percentageUsed": 90,
    "alertTriggered": true,
    "status": "warning"
  }
}
```

### 4. Update Budget
**PUT** `/budgets/:budgetId`

**Request:**
```json
{
  "limit": 6000,
  "alertThreshold": 75,
  "isActive": true
}
```

### 5. Reset Budget Spent
**POST** `/budgets/:budgetId/reset`

**Response:**
```json
{
  "success": true,
  "message": "Budget reset successfully",
  "data": {
    "spent": 0,
    "alertTriggered": false
  }
}
```

### 6. Delete Budget
**DELETE** `/budgets/:budgetId`

---

## File Upload Endpoints

### 1. Upload Single Receipt
**POST** `/upload/:transactionId`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Single file (max 5MB, PNG/JPG/PDF)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "s3-url",
    "fileName": "receipt.jpg"
  }
}
```

### 2. Bulk Upload Receipts
**POST** `/upload/:transactionId/bulk`

**Form Data:**
- `files`: Multiple files (max 5 files, 5MB each)

**Response:**
```json
{
  "success": true,
  "message": "3 file(s) uploaded successfully",
  "data": [
    {
      "url": "s3-url-1",
      "fileName": "receipt1.jpg"
    },
    {
      "url": "s3-url-2",
      "fileName": "receipt2.jpg"
    }
  ]
}
```

### 3. Get Transaction Attachments
**GET** `/upload/:transactionId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "s3-url",
      "fileName": "receipt.jpg",
      "uploadedAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### 4. Delete Attachment
**DELETE** `/upload/:transactionId/:attachmentIndex`

**Response:**
```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

---

## Report/Dashboard Endpoints

### 1. Get Dashboard Data
**GET** `/reports/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 15000,
    "balance": 35000,
    "activeBudgets": 5,
    "budgetAlerts": 2,
    "monthlyData": [
      {
        "month": "Jan",
        "income": 50000,
        "expense": 15000
      }
    ],
    "categoryData": [
      {
        "name": "Food",
        "value": 5000
      }
    ]
  }
}
```

### 2. Get Monthly Report
**GET** `/reports/monthly?month=01&year=2024`

**Query Parameters:**
- `month`: 01-12
- `year`: YYYY format

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 15000,
    "netIncome": 35000,
    "categoryBreakdown": [...],
    "topTransactions": [...],
    "savingsRate": 70
  }
}
```

### 3. Get Category Analytics
**GET** `/reports/category-analytics?startDate=2024-01-01&endDate=2024-01-31`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Food",
        "amount": 5000,
        "percentage": 33,
        "transactions": 15,
        "avgPerTransaction": 333
      }
    ]
  }
}
```

---

## Account Endpoints

### 1. Create Account
**POST** `/accounts`

**Request:**
```json
{
  "name": "HDFC Bank",
  "type": "bank",
  "balance": 50000,
  "currency": "INR"
}
```

### 2. Get All Accounts
**GET** `/accounts?page=1`

### 3. Get Account Details
**GET** `/accounts/:accountId`

### 4. Update Account
**PUT** `/accounts/:accountId`

### 5. Delete Account
**DELETE** `/accounts/:accountId`

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `500`: Internal Server Error

---

## Rate Limiting
- Limit: 100 requests per 15 minutes per user
- Header: `X-RateLimit-Remaining`

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

### Create Transaction
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "expense",
    "category": "Food",
    "amount": 500,
    "date": "2024-01-15"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:8000/api/upload/<transactionId> \
  -H "Authorization: Bearer <token>" \
  -F "file=@receipt.jpg"
```

---

## Pagination
All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Filters

### Date Range Filter
```
GET /api/transactions?startDate=2024-01-01&endDate=2024-01-31
```

### Amount Range Filter
```
GET /api/transactions?minAmount=100&maxAmount=5000
```

### Multiple Category Filter
```
GET /api/transactions?categories=Food,Transportation,Entertainment
```

### Search Filter
```
GET /api/transactions?search=lunch
```

---

## Sorting
```
GET /api/transactions?sort=date&order=desc
```

**Sort Options:** `date`, `amount`, `category`, `createdAt`
**Order:** `asc` | `desc`

---

## API Versioning

Future versions will be supported:
```
/api/v2/transactions
/api/v2/budgets
```

Current version is implicit `/api/v1`
