import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import WelcomePage from "./components/WelcomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Menaxhimi i temës që zgjidh error-in në App.jsx:17
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    // Sfondi i zi fiks gjatë loading-ut për të hequr "flash-in" e bardhë
    <div
      className={`${isLoading ? "bg-black" : theme === "dark" ? "bg-black text-white" : "bg-white text-black"} min-h-screen transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <WelcomePage key="welcome" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Kalojmë temën si props te Navbar */}
            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <main className="min-h-screen pt-64 md:pt-72">
              <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="/team" element={<Team />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
              </Routes>
            </main>

            <Footer theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
