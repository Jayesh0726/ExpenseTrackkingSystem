import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
// Ensure the correct path and file exist; if your store file is named differently or in a different location, update the import accordingly.
import store from "./store/store"
import ReactDOM from 'react-dom/client'
import { AuthLayout } from './components/index'

const router = createBrowserRouter([{
  path:"/",
  element: <App />,
  children:[
    
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path:"/login",
      element: (
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path:"/signup",
      element: (
        <AuthLayout authentication={false}>
          <SignUp />
        </AuthLayout>
      )
    },
    {
      path: "/profile",
      element: (
        <AuthLayout authentication>
          {" "}
          <Profile />
        </AuthLayout>
      )
    }
  ]
}
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
