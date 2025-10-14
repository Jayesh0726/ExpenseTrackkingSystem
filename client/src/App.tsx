import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Loader from "./components/Loader"
import Navbar from "./components/Header/Navbar"
import Page404 from "./pages/NotFound"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <ThemeProvider defaultTheme="dark"  storageKey="vite-ui-theme">
      <div className="w-screen overflow-x-hidden">
        {/* <Navbar /> */}
      {/* <Page404 /> */}
      {/* <Signup /> */}
      <Dashboard />
      {/* <Login /> */}
      {/* <Loader /> */}
      </div>
    </ThemeProvider>
  )
}

export default App