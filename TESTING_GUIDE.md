# Expense Tracker - Complete Testing Guide

## Testing Overview
This guide covers unit testing, integration testing, and end-to-end testing for the Expense Tracker application.

---

## Backend Testing Setup

### 1. Install Testing Dependencies
```bash
npm install --save-dev jest supertest
npm install --save-dev mongodb-memory-server
```

### 2. Create Jest Configuration
Create `jest.config.js`:
```javascript
export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000,
  detectOpenHandles: true,
};
```

### 3. Update package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Backend Unit Tests

### Test User Controller
Create `__tests__/controllers/userController.test.js`:
```javascript
import { User } from '../../models/userModel.js';
import { signup, login } from '../../controllers/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/userModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({
        userId: 'uuid-123',
        email: 'test@example.com',
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User created successfully',
        })
      );
    });

    it('should reject weak password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject duplicate email', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'Test123!',
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const mockUser = {
        userId: 'uuid-123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.any(Object),
            accessToken: expect.any(String),
          }),
        })
      );
    });

    it('should reject invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
```

### Test Transaction Controller
Create `__tests__/controllers/transactionController.test.js`:
```javascript
import * as transactionController from '../../controllers/expense.js';
import { Transaction } from '../../models/transactionModel.js';
import { Budget } from '../../models/budgetModel.js';

jest.mock('../../models/transactionModel.js');
jest.mock('../../models/budgetModel.js');

describe('Transaction Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 'user-123' },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('handleCreateExpense', () => {
    it('should create expense transaction', async () => {
      req.body = {
        type: 'expense',
        category: 'Food',
        amount: 500,
        date: '2024-01-15',
      };

      Transaction.prototype.save = jest.fn().mockResolvedValue({
        transactionId: 'txn-123',
        type: 'expense',
        amount: 500,
      });

      await transactionController.handleCreateExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should update budget when creating expense', async () => {
      req.body = {
        type: 'expense',
        category: 'Food',
        amount: 500,
        date: '2024-01-15',
      };

      const mockBudget = {
        spent: 1000,
        limit: 5000,
        alertThreshold: 80,
        save: jest.fn(),
      };

      Budget.findOne.mockResolvedValue(mockBudget);
      Transaction.prototype.save = jest.fn();

      await transactionController.handleCreateExpense(req, res);

      expect(mockBudget.spent).toBe(1500);
    });

    it('should trigger budget alert when threshold exceeded', async () => {
      req.body = {
        type: 'expense',
        category: 'Food',
        amount: 5000,
        date: '2024-01-15',
      };

      const mockBudget = {
        spent: 1000,
        limit: 5000,
        alertThreshold: 80,
        alertTriggered: false,
        save: jest.fn(),
      };

      Budget.findOne.mockResolvedValue(mockBudget);

      await transactionController.handleCreateExpense(req, res);

      expect(mockBudget.alertTriggered).toBe(true);
    });

    it('should reject invalid amount', async () => {
      req.body = {
        category: 'Food',
        amount: -100,
        date: '2024-01-15',
      };

      await transactionController.handleCreateExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('handleGetExpense', () => {
    it('should get transactions with pagination', async () => {
      req.query = { page: 1, limit: 20 };

      Transaction.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          { transactionId: 'txn-1', amount: 500 },
        ]),
      });

      Transaction.countDocuments.mockResolvedValue(50);

      await transactionController.handleGetExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            pagination: expect.any(Object),
          }),
        })
      );
    });

    it('should filter by date range', async () => {
      req.query = {
        page: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      Transaction.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      await transactionController.handleGetExpense(req, res);

      const findCall = Transaction.find.mock.calls[0][0];
      expect(findCall.date).toBeDefined();
    });
  });
});
```

### Test Budget Controller
Create `__tests__/controllers/budgetController.test.js`:
```javascript
import * as budgetController from '../../controllers/budgetController.js';
import { Budget } from '../../models/budgetModel.js';

jest.mock('../../models/budgetModel.js');

describe('Budget Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 'user-123' },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createBudget', () => {
    it('should create budget successfully', async () => {
      req.body = {
        category: 'Food',
        limit: 5000,
        period: 'monthly',
        alertThreshold: 80,
      };

      Budget.prototype.save = jest.fn().mockResolvedValue({
        budgetId: 'budget-123',
        category: 'Food',
        limit: 5000,
        spent: 0,
      });

      await budgetController.createBudget(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should reject overlapping budgets', async () => {
      req.body = {
        category: 'Food',
        limit: 5000,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      Budget.findOne.mockResolvedValue({
        category: 'Food',
        startDate: '2024-01-01',
      });

      await budgetController.createBudget(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should validate limit is positive', async () => {
      req.body = {
        category: 'Food',
        limit: -1000,
      };

      await budgetController.createBudget(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getBudgetStatus', () => {
    it('should calculate correct budget status', async () => {
      req.params.categoryId = 'Food';

      const mockBudget = {
        budgetId: 'budget-123',
        limit: 5000,
        spent: 4000,
        alertThreshold: 80,
      };

      Budget.findOne.mockResolvedValue(mockBudget);

      await budgetController.getBudgetStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            remaining: 1000,
            percentageUsed: 80,
          }),
        })
      );
    });

    it('should trigger alert when threshold exceeded', async () => {
      const mockBudget = {
        budgetId: 'budget-123',
        limit: 5000,
        spent: 4500,
        alertThreshold: 80,
      };

      Budget.findOne.mockResolvedValue(mockBudget);

      await budgetController.getBudgetStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            alertTriggered: true,
          }),
        })
      );
    });
  });
});
```

---

## Frontend Testing Setup

### 1. Install Testing Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### 2. Create Test Configuration
Create `setupTests.js`:
```javascript
import '@testing-library/jest-dom';
```

### 3. Frontend Component Tests
Create `src/__tests__/components/Login.test.jsx`:
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login';
import * as api from '../../services/api';

jest.mock('../../services/api');

describe('Login Component', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLogin();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('should display error on failed login', async () => {
    api.default.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should navigate on successful login', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    api.default.post.mockResolvedValue({
      data: {
        data: {
          user: { email: 'test@example.com' },
          accessToken: 'token123',
        },
      },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Test123!' },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

### 4. Dashboard Component Test
Create `src/__tests__/components/Dashboard.test.jsx`:
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../../components/Dashboard';
import * as api from '../../services/api';

jest.mock('../../services/api');

describe('Dashboard Component', () => {
  beforeEach(() => {
    api.default.get.mockResolvedValue({
      data: {
        data: {
          totalIncome: 50000,
          totalExpenses: 15000,
          balance: 35000,
          activeBudgets: 5,
          monthlyData: [],
          categoryData: [],
        },
      },
    });
  });

  it('should display total income', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('₹50000')).toBeInTheDocument();
    });
  });

  it('should display total expenses', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('₹15000')).toBeInTheDocument();
    });
  });

  it('should display net balance', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('₹35000')).toBeInTheDocument();
    });
  });

  it('should render charts', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Monthly Trend')).toBeInTheDocument();
      expect(screen.getByText('Expense by Category')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

---

## Integration Testing

### Test API Endpoints
Create `__tests__/integration/api.integration.test.js`:
```javascript
import request from 'supertest';
import app from '../../index.js';
import { User } from '../../models/userModel.js';
import { Transaction } from '../../models/transactionModel.js';

describe('API Integration Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Setup test user
    const signupRes = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
      });

    userId = signupRes.body.data.userId;
    token = signupRes.body.data.accessToken;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: 'test@example.com' });
  });

  describe('User Endpoints', () => {
    it('POST /api/users/signup - should create user', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'newuser@example.com',
          password: 'Test123!',
          firstName: 'New',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('newuser@example.com');
    });

    it('POST /api/users/login - should login user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('GET /api/users/profile - should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('test@example.com');
    });
  });

  describe('Transaction Endpoints', () => {
    let transactionId;

    it('POST /api/transactions - should create transaction', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          category: 'Food',
          amount: 500,
          date: '2024-01-15',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(500);
      transactionId = res.body.data.transactionId;
    });

    it('GET /api/transactions - should list transactions', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.transactions)).toBe(true);
    });

    it('GET /api/transactions/:id - should get single transaction', async () => {
      const res = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.transactionId).toBe(transactionId);
    });

    it('PUT /api/transactions/:id - should update transaction', async () => {
      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 600,
          description: 'Updated expense',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(600);
    });

    it('DELETE /api/transactions/:id - should delete transaction', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Budget Endpoints', () => {
    let budgetId;

    it('POST /api/budgets - should create budget', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'Food',
          limit: 5000,
          period: 'monthly',
          alertThreshold: 80,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.limit).toBe(5000);
      budgetId = res.body.data.budgetId;
    });

    it('GET /api/budgets - should list budgets', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.budgets)).toBe(true);
    });

    it('GET /api/budgets/:id - should get budget status', async () => {
      const res = await request(app)
        .get(`/api/budgets/status/Food`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.percentageUsed).toBeDefined();
    });

    it('PUT /api/budgets/:id - should update budget', async () => {
      const res = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          limit: 6000,
        });

      expect(res.status).toBe(200);
    });

    it('DELETE /api/budgets/:id - should delete budget', async () => {
      const res = await request(app)
        .delete(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
```

---

## E2E Testing with Cypress

### 1. Install Cypress
```bash
npm install --save-dev cypress
npx cypress open
```

### 2. Create E2E Tests
Create `cypress/e2e/auth.cy.js`:
```javascript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should signup successfully', () => {
    cy.visit('/signup');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('Test123!');
    cy.get('input[placeholder="First Name"]').type('New');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('Test123!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should logout user', () => {
    cy.login('test@example.com', 'Test123!');
    cy.get('[data-testid="logout-btn"]').click();

    cy.url().should('include', '/login');
  });
});
```

Create `cypress/e2e/transactions.cy.js`:
```javascript
describe('Transaction Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'Test123!');
  });

  it('should create transaction', () => {
    cy.visit('/transactions');
    cy.get('[data-testid="add-transaction-btn"]').click();

    cy.get('input[name="amount"]').type('500');
    cy.get('select[name="category"]').select('Food');
    cy.get('input[name="date"]').type('2024-01-15');
    cy.get('button[type="submit"]').click();

    cy.contains('Transaction created successfully').should('be.visible');
  });

  it('should filter transactions by date', () => {
    cy.visit('/transactions');
    cy.get('input[name="startDate"]').type('2024-01-01');
    cy.get('input[name="endDate"]').type('2024-01-31');
    cy.get('[data-testid="filter-btn"]').click();

    cy.get('[data-testid="transaction-list"] > div').should('have.length.greaterThan', 0);
  });

  it('should upload receipt', () => {
    cy.visit('/transactions');
    cy.get('[data-testid="transaction-id-1"]').click();

    cy.get('[data-testid="file-upload"]').selectFile('cypress/fixtures/receipt.jpg');

    cy.contains('File uploaded successfully').should('be.visible');
  });
});
```

---

## Performance Testing

### Load Testing with Artillery
```bash
npm install --save-dev artillery
```

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 60
      arrivalRate: 100
      name: "Spike"

scenarios:
  - name: "Typical user flow"
    flow:
      - post:
          url: "/api/users/login"
          json:
            email: "test@example.com"
            password: "Test123!"
          capture:
            json: "$.data.accessToken"
            as: "authToken"
      
      - get:
          url: "/api/transactions"
          headers:
            Authorization: "Bearer {{ authToken }}"
      
      - post:
          url: "/api/transactions"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            type: "expense"
            category: "Food"
            amount: 500
```

Run load test:
```bash
npx artillery run load-test.yml
```

---

## Test Checklist

### Unit Tests
- [ ] User signup validation
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Transaction amount validation
- [ ] Budget limit validation
- [ ] Category type validation
- [ ] File upload validation

### Integration Tests
- [ ] Login flow with database
- [ ] Create transaction and update budget
- [ ] Create budget and check overlap
- [ ] Upload file and store URL
- [ ] Delete transaction and adjust budget

### E2E Tests
- [ ] Complete signup flow
- [ ] Complete login flow
- [ ] Create multiple transactions
- [ ] Filter and search transactions
- [ ] Create and manage budgets
- [ ] Upload receipts
- [ ] Generate reports

### Performance Tests
- [ ] API response time < 200ms
- [ ] Database queries < 100ms
- [ ] File upload < 5s
- [ ] Concurrent user load (100+ users)

### Security Tests
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] JWT token expiry

---

## Run All Tests

### Backend Tests
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Tests
```bash
npm test               # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

### E2E Tests
```bash
npx cypress open       # Interactive mode
npx cypress run        # Headless mode
```

---

## CI/CD Integration

### GitHub Actions Workflow
Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: cd server && npm install
      - name: Run tests
        run: cd server && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: cd client && npm install
      - name: Run tests
        run: cd client && npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Coverage Goals

- **Overall**: 80% code coverage
- **Critical paths**: 95% coverage
- **UI Components**: 70% coverage
- **API Endpoints**: 90% coverage

## Continuous Improvement

1. Regular test review and updates
2. Add tests for new features before implementation
3. Monitor test failure patterns
4. Keep dependencies updated
5. Document test patterns for team
