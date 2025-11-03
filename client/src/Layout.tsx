import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Header/Navbar";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen overflow-x-hidden bg-gray-950">
        <Navbar />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
