# React Frontend Setup Guide

## 📦 Prerequisites

Before starting, ensure you have:
- Node.js (v14+)
- npm or yarn
- VS Code or any editor

## 🚀 Create React App

```bash
# Navigate to your projects directory
cd j:\Projects\ExpanseTrackkingSystem

# Create React app
npx create-react-app client
cd client

# Install additional dependencies
npm install react-router-dom axios react-query zustand
npm install @mui/material @emotion/react @emotion/styled
npm install recharts date-fns
npm install -D tailwindcss postcss autoprefixer
```

## 📂 Folder Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       └── Signup.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TransactionDetail.jsx
│   │   ├── BudgetDetail.jsx
│   │   └── NotFound.jsx
│   ├── store/
│   │   ├── authStore.js
│   │   ├── transactionStore.js
│   │   └── budgetStore.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTransactions.js
│   │   └── useBudgets.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── budgets.js
│   │   └── reports.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── App.jsx
│   └── index.jsx
├── public/
├── package.json
└── .env.local
```

## 🔧 Create .env.local

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_JWT_STORAGE_KEY=expenseTracker_token
```

## 📝 Core Files to Create

### 1. services/api.js

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(process.env.REACT_APP_JWT_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. store/authStore.js

```javascript
import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY),
  isLoading: false,
  error: null,

  signup: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/signup', { username, email, password });
      const { token, data } = response.data;
      localStorage.setItem(process.env.REACT_APP_JWT_STORAGE_KEY, token);
      set({ user: data, token, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, data } = response.data;
      localStorage.setItem(process.env.REACT_APP_JWT_STORAGE_KEY, token);
      set({ user: data, token, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(process.env.REACT_APP_JWT_STORAGE_KEY);
    set({ user: null, token: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY);
    set({ token });
  },
}));

export default useAuthStore;
```

### 3. components/Dashboard.jsx

```javascript
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/reports/dashboard');
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (!dashboard) return <div className="p-4">Failed to load dashboard</div>;

  const { monthlyStats, budgetStatus, recentTransactions, topCategories } = dashboard;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{monthlyStats.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Expense</h3>
          <p className="text-2xl font-bold text-red-600">₹{monthlyStats.totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Net Cashflow</h3>
          <p className={`text-2xl font-bold ${monthlyStats.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{monthlyStats.netCashflow.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Top Categories Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Top Spending Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoryInfo[0].name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Budget Status</h2>
          <div className="space-y-4">
            {budgetStatus.slice(0, 5).map((budget, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{budget.category}</span>
                  <span className="text-sm">{budget.percentageUsed}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${parseFloat(budget.percentageUsed) > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(parseFloat(budget.percentageUsed), 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  ₹{budget.spent.toFixed(2)} / ₹{budget.limit.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Category</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-left py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.slice(0, 10).map((tx, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="py-2">{tx.description}</td>
                <td className="py-2">{tx.category.name}</td>
                <td className="text-right py-2">₹{tx.amount.toFixed(2)}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tx.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 4. App.jsx

```javascript
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
```

## 🎨 Tailwind CSS Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## ✅ Key Pages to Implement

1. **Login.jsx** - User authentication
2. **Signup.jsx** - New user registration  
3. **Dashboard.jsx** - Financial overview ✓
4. **Transactions.jsx** - CRUD transactions with filters
5. **Budgets.jsx** - Budget management and tracking
6. **Reports.jsx** - Advanced reporting and exports
7. **Settings.jsx** - User profile and preferences
8. **Navbar.jsx** - Top navigation with user menu
9. **Sidebar.jsx** - Main navigation menu

## 🚀 Run Frontend

```bash
npm start
```

Visit `http://localhost:3000`

## 📋 Features to Implement

- ✅ Authentication (login/signup/logout)
- ✅ Dashboard with analytics
- Transaction CRUD with filters & search
- Budget creation & tracking with alerts
- Reports with date range & export
- File upload for receipts
- Recurring transaction management
- Split payment handling
- Category management
- Account switching
- Profile settings
- Dark mode toggle

## 🔗 API Integration Points

All components should use the provided services in `src/services/` to call backend APIs. Example:

```javascript
import api from '../services/api';

const response = await api.get('/transactions?page=1&limit=20');
```

---

Next Steps:
1. Create React app following this structure
2. Implement all components
3. Test all API endpoints
4. Add S3 file upload integration
5. Deploy to Vercel/Netlify
