import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import logo from "../assets/logo-ema.png";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
      ${isVisible ? "translate-y-0" : "-translate-y-full"} 
      ${theme === "dark" ? "bg-black/90 backdrop-blur-md" : "bg-white/90 backdrop-blur-md"}`}
    >
      {/* Ndryshimi i strukturës: flex-col për mobile, flex-row për desktop */}
      <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 px-4 md:px-12 lg:px-16 gap-4 md:gap-0">
        {/* RRESHTI 1: LOGOJA */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="EMA Logo"
            className={`h-18 md:h-20 w-auto transition-all duration-300 ${
              theme === "dark" ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        {/* RRESHTI 2: NAVIGIMI */}
        <nav className="flex items-center space-x-6 md:space-x-12 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium">
          <Link
            to="/"
            className="text-gray-500 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/profile"
            className="text-gray-500 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-500 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            Contact
          </Link>

          <Link
            to="/team"
            className="text-gray-500 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            Team
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 transition-transform hover:scale-110"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <FiMoon size={18} className="text-gray-500" />
            ) : (
              <FiSun size={18} className="gold-shimmer" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
