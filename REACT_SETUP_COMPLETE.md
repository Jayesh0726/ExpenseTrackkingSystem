# Expense Tracker - React Frontend Setup Guide

## Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Backend server running on http://localhost:8000

## Quick Start

### 1. Create React App
```bash
npx create-react-app client
cd client
```

### 2. Install Dependencies
```bash
npm install react-router-dom zustand react-query axios recharts react-icons tailwindcss -D
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Folder Structure
Create the following structure in `src/`:
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Transactions.jsx
│   ├── TransactionForm.jsx
│   ├── Budgets.jsx
│   ├── BudgetCard.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   └── FileUpload.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── BudgetsPage.jsx
│   └── ReportsPage.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── transactionService.js
│   ├── budgetService.js
│   └── uploadService.js
├── store/
│   ├── authStore.js
│   ├── transactionStore.js
│   └── budgetStore.js
├── hooks/
│   ├── useAuth.js
│   ├── useTransaction.js
│   └── useBudget.js
├── utils/
│   ├── formatters.js
│   └── validators.js
├── App.jsx
├── App.css
└── index.js
```

### 4. Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_JWT_TOKEN_KEY=expenseTrackerToken
REACT_APP_REFRESH_TOKEN_KEY=expenseTrackerRefreshToken
```

### 5. Tailwind Configuration
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
      },
    },
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f3f4f6;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
}
```

## Core Implementation Files

### 1. `src/services/api.js`
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      try {
        const response = await axios.post(`${API_URL}/users/refresh-token`, {
          refreshToken,
        });

        localStorage.setItem(TOKEN_KEY, response.data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2. `src/store/authStore.js`
```javascript
import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_KEY),
  isLoading: false,

  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  logout: () => {
    localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_KEY);
    localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY);
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
```

### 3. `src/components/Dashboard.jsx`
```javascript
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/reports/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Income</p>
          <p className="text-3xl font-bold text-green-600">₹{stats?.totalIncome}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">₹{stats?.totalExpenses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Net Balance</p>
          <p className={`text-3xl font-bold ${stats?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{stats?.balance}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Active Budgets</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.activeBudgets}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats?.categoryData || []} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                {stats?.categoryData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 4. `src/components/Login.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem(process.env.REACT_APP_JWT_TOKEN_KEY, accessToken);
      localStorage.setItem(process.env.REACT_APP_REFRESH_TOKEN_KEY, refreshToken);

      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

## Components To Create

1. **Navbar.jsx** - Navigation bar with user menu
2. **Sidebar.jsx** - Navigation sidebar with menu items
3. **Transactions.jsx** - List all transactions with filters
4. **TransactionForm.jsx** - Form to add/edit transactions
5. **Budgets.jsx** - List and manage budgets
6. **BudgetCard.jsx** - Individual budget card with progress
7. **Reports.jsx** - Charts and reports
8. **Settings.jsx** - User preferences and settings
9. **FileUpload.jsx** - Receipt upload component with drag-and-drop
10. **Signup.jsx** - User registration form

## File Upload Component Example

```javascript
// src/components/FileUpload.jsx
import React, { useState } from 'react';
import api from '../services/api';

const FileUpload = ({ transactionId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setLoading(true);
    const formData = new FormData();

    for (let file of files) {
      formData.append('files', file);
    }

    try {
      const response = await api.post(`/upload/${transactionId}/bulk`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(response.data.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <p className="text-gray-600">Drag and drop files here, or click to select</p>
      <input
        type="file"
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer text-blue-600">
        Select Files
      </label>
      {loading && <p className="mt-2 text-gray-500">Uploading...</p>}
    </div>
  );
};

export default FileUpload;
```

## API Integration Checklist

- ✅ Authentication endpoints (login, signup, logout, refresh-token)
- ✅ Transaction endpoints (CRUD, list with filters)
- ✅ Budget endpoints (CRUD, status, alerts)
- ✅ Category endpoints (CRUD)
- ✅ Report endpoints (dashboard, analytics)
- ✅ File upload endpoints (upload, delete, list)

## Next Steps

1. Run `npm start` to start development server
2. Implement each component following the structure
3. Connect all components to API using services
4. Add error handling and loading states
5. Implement state management with Zustand
6. Test all features before deployment

## Useful Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Install additional dependencies
npm install [package-name]

# Run tests
npm test
```

## Deployment

For production deployment, consider:
- Vercel (recommended for React): `npm run build` and push to GitHub
- Netlify: Connect GitHub repository directly
- AWS S3 + CloudFront for static hosting
- Environment variables for API URL based on environment

## Security Recommendations

1. Store JWT tokens securely (httpOnly cookies if possible)
2. Implement CSRF protection
3. Validate all user inputs
4. Use HTTPS in production
5. Implement rate limiting on API
6. Keep dependencies updated

## Support & Debugging

- Check browser console for errors
- Verify backend API is running on http://localhost:8000
- Check network tab in browser DevTools for API calls
- Ensure .env variables are correctly set
- Check Redux DevTools for state management debugging
