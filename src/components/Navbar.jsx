import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setIsVisible(false); // Fshihet kur zbresim
    } else {
      setIsVisible(true); // Shfaqet kur ngjitemi
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white z-50 transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex justify-between items-center py-8 px-4 md:px-12 lg:px-16">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tighter uppercase"
        >
          EMA
        </Link>
        <nav className="flex space-x-12 text-[11px] uppercase tracking-[0.2em] font-medium text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">
            Projects
          </Link>
          <Link to="/profile" className="hover:text-black transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
