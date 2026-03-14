import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // Ikona minimaliste dhe profesionale

const ThemeToggle = () => {
  // Kontrollon temën fillestare nga localStorage ose preferenca e sistemit
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );

  useEffect(() => {
    // Shton ose heq klasën "dark" nga elementi <html>
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Ruan preferencën e përdoruesit
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <FiMoon className="w-5 h-5 text-neutral-800" /> // Ikona Hënës për Light Mode
      ) : (
        <FiSun className="w-5 h-5 text-neutral-200" /> // Ikona Diellit për Dark Mode
      )}
    </button>
  );
};

export default ThemeToggle;
