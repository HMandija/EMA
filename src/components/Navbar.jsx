import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi"; // Importojmë ikonat

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Logjika për Temën
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

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
      ${isVisible ? "translate-y-0" : "-translate-y-full"} 
      ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <div className="flex justify-between items-center py-8 px-4 md:px-12 lg:px-16">
        <Link
          to="/"
          className={`text-lg font-semibold tracking-tighter uppercase ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          EMA
        </Link>

        <nav className="flex items-center space-x-8 md:space-x-12 text-[11px] uppercase tracking-[0.2em] font-medium">
          <Link
            to="/"
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/profile"
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Contact
          </Link>

          {/* Butoni i Temës */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 transition-transform hover:scale-110 active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <FiMoon size={18} className="text-gray-500 hover:text-black" />
            ) : (
              <FiSun size={18} className="text-gray-400 hover:text-white" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
