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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <Navbar /> */}
      {/* <Page404 /> */}
      {/* <Signup /> */}
      <Dashboard />
      {/* <Login /> */}
      {/* <Loader /> */}
    </ThemeProvider>
  )
}

export default App