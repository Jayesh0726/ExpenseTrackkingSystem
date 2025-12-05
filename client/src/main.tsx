import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./Layout";
import {
  BrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {Loader} from "./components/index";
import {
  LoginPage,
  DashboardPage,
  SignUpPage,
  Add_and_Edit_expansesPage,
  AnalyticsPage,
  NotFoundPage,
  ProfilePage,
  TransactionPage,
} from "./pages";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// Ensure the correct path and file exist; if your store file is named differently or in a different location, update the import accordingly.
import store from "./store/store";
import { AuthLayout } from "./components/index";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<LoginPage />} />
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        }
      />
      <Route
        path="/add-and-edit-expanses"
        element={
          <AuthLayout authentication>
            <Add_and_Edit_expansesPage />
          </AuthLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <AuthLayout authentication>
            <AnalyticsPage />
          </AuthLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthLayout authentication>
            <ProfilePage />
          </AuthLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <AuthLayout authentication>
            <TransactionPage />
          </AuthLayout>
        }
      />
      <Route 
      path="*"
      element={<NotFoundPage />}
      />
    </Route>
  )
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
