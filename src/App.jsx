import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import WelcomePage from "./components/WelcomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";

// Admin imports
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminContactInfo from "./pages/admin/AdminContactInfo";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/ema-admin";

// ─── Public pages ─────────────────────────────────────────────────────
const PublicSite = ({ theme, toggleTheme, isLoading, setIsLoading }) => {
  return (
    <div
      className={`${
        isLoading
          ? "bg-black"
          : theme === "dark"
          ? "bg-black text-white"
          : "bg-white text-black"
      } min-h-screen transition-colors duration-500`}
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
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main className="min-h-screen pt-32 md:pt-40">
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
};

// ─── Main App ─────────────────────────────────────────────────────────
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
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

  // Check if we're on an admin route (hidden from public site)
  const isAdminRoute = location.pathname.startsWith(ADMIN_PATH);

  if (isAdminRoute) {
    return (
      <AuthProvider>
        <Routes>
          {/* Hidden login — direct URL only */}
          <Route path={ADMIN_PATH} element={<AdminLogin />} />

          {/* Protected admin pages */}
          <Route
            path={`${ADMIN_PATH}/dashboard`}
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ADMIN_PATH}/projects`}
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ADMIN_PATH}/team`}
            element={
              <ProtectedRoute>
                <AdminTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ADMIN_PATH}/messages`}
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ADMIN_PATH}/contact-info`}
            element={
              <ProtectedRoute>
                <AdminContactInfo />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    );
  }

  // Public site (no connection to admin)
  return (
    <PublicSite
      theme={theme}
      toggleTheme={toggleTheme}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />
  );
}

export default App;
