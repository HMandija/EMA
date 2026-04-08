import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "projects"), orderBy("createdAt", "desc"))
        );
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-900" />
              <div className="mt-4 h-3 bg-gray-100 dark:bg-zinc-900 w-2/3" />
              <div className="mt-2 h-2 bg-gray-100 dark:bg-zinc-900 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Dropdown Kategorive */}
      <div className="relative mb-12 flex justify-end">
        <div className="w-48">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left border-b border-black dark:border-white py-2 flex justify-between items-center text-[10px] uppercase tracking-[0.2em]"
          >
            Category: {selectedCategory}
            <span
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full bg-white dark:bg-black border border-t-0 border-black dark:border-white z-20 shadow-xl"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-[9px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid Projekteve */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/project/${project.slug}`} className="group block">
                <div className="overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-zinc-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-medium">
                      {project.title}
                    </h3>
                    <p className="text-[9px] text-gray-500 uppercase tracking-tighter mt-1">
                      {project.location}
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-zinc-800 px-2 py-1">
                    {project.category}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {projects.length === 0 && !loading && (
        <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest py-20">
          Nuk ka projekte akoma.
        </p>
      )}
    </div>
  );
};

export default Projects;
