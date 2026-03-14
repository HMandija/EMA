import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        {/* Content Section */}
        <main className="flex-grow pt-32 px-4 md:px-12 lg:px-24">
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
        </main>

        {/* Footer Section - Jashtë main për kontroll më të mirë */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
