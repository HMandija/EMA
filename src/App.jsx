import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomePage from "./components/WelcomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

// Importo Team dhe të tjerat...

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="dark:bg-black min-h-screen transition-colors duration-500">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <WelcomePage key="welcome" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Navbar />
            <main className="pt-20">
              {/* Këtu vendos Routes e tua */}
              <Projects />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
