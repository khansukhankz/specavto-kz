import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedMainPage } from "./pages/ProtectedMainPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { ProtectedAdminPage } from "./pages/ProtectedAdminPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    Component: LoginPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/main",
    Component: ProtectedMainPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin-login",
    Component: AdminLoginPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin/login",
    Component: AdminLoginPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    Component: ProtectedAdminPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    Component: LoginPage,
    errorElement: <ErrorBoundary />,
  },
]);