import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Loader from "./components/Loader"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Loader/>
    </ThemeProvider>
  )
}

export default App