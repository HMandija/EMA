import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import logo from "../assets/logo-ema.png"; //

const Navbar = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Kontrolli i fshehjes së Navbar gjatë scroll-it
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 
      ${isVisible ? "translate-y-0" : "-translate-y-full"} 
      ${theme === "dark" ? "bg-black/90 border-white/5" : "bg-white/90 border-black/5"} 
      backdrop-blur-xl border-b`}
    >
      <div className="flex flex-col items-center py-6 px-4 md:px-12 lg:px-16 gap-6">
        {/* Grupi i Logos dhe Tekstit Poshtë */}
        <Link
          to="/"
          className="flex flex-col items-center group transition-transform hover:scale-105"
        >
          <img
            src={logo}
            alt="EMA"
            className={`h-12 md:h-16 w-auto transition-all duration-500 ${
              theme === "dark" ? "brightness-0 invert" : "brightness-100"
            }`}
          />
          <span
            className={`text-[8px] md:text-[10px] uppercase tracking-[0.5em] mt-3 font-light ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Architecture & Design
          </span>
        </Link>
        <nav className="flex items-center space-x-6 md:space-x-12 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-light">
          <Link
            to="/"
            className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
          >
            Projects
          </Link>
          <Link
            to="/team"
            className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
          >
            Team
          </Link>
          <Link
            to="/profile"
            className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
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
              <FiMoon size={18} className="text-black" />
            ) : (
              <FiSun size={18} className="text-yellow-500 gold-shimmer" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
