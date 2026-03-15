import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsData } from "../data/projects";
import { motion, AnimatePresence } from "framer-motion";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find((p) => p.slug === slug);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  if (!project)
    return (
      <div className="pt-40 text-center uppercase tracking-widest">
        Project not found
      </div>
    );

  const categories = [
    "All Projects",
    ...new Set(projectsData.map((p) => p.category)),
  ];

  const handleCategorySelect = (cat) => {
    setIsCategoryOpen(false);
    if (cat === "All Projects") {
      navigate("/");
    } else {
      const firstInCat = projectsData.find((p) => p.category === cat);
      if (firstInCat) navigate(`/project/${firstInCat.slug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Dropdown Explore */}
      <div className="relative mb-12 flex justify-start">
        <div className="w-56">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full text-left border-b border-black/10 dark:border-white/10 py-2 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] hover:border-black dark:hover:border-white transition-colors"
          >
            Explore: {project.category}
            <span
              className={`transition-transform duration-500 ${isCategoryOpen ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </button>

          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border border-t-0 border-black/5 dark:border-white/5 z-50 shadow-2xl"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-4 py-3 text-[9px] uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Titulli kryesor */}
      <div className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extralight uppercase tracking-widest mb-4"
        >
          {project.title}
        </motion.h1>
      </div>

      {/* DETAJET E PROJEKTIT (Bazuar në dokumentin tuaj) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 border-t border-gray-100 dark:border-zinc-800 pt-10">
        {/* Përshkrimi (Description) */}
        <div className="md:col-span-2">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6">
            About the Project
          </h3>
          <p className="text-[11px] leading-relaxed uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300">
            {project.description}
          </p>
        </div>

        {/* Paneli i Informacionit (Status, Role, Location, Credits) */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 border-l border-gray-50 dark:border-zinc-900 md:pl-8">
          {/* Statusi i Projektit */}
          {project.status && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                Status
              </h3>
              <p className="text-[10px] uppercase tracking-widest">
                {project.status}
              </p>
            </div>
          )}

          {/* Vendndodhja */}
          {project.location && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                Location
              </h3>
              <p className="text-[10px] uppercase tracking-widest">
                {project.location}
              </p>
            </div>
          )}

          {/* Roli juaj në projekt */}
          {project.role && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                My Role
              </h3>
              <p className="text-[10px] uppercase tracking-widest leading-relaxed">
                {project.role}
              </p>
            </div>
          )}

          {/* Kreditet Shtesë */}
          {project.additionalCredits && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                Additional Credits
              </h3>
              <p className="text-[10px] uppercase tracking-widest">
                {project.additionalCredits}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Galeria e Imazheve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.gallery.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden bg-stone-50 dark:bg-zinc-900 cursor-pointer"
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={img}
              alt={`${project.title} ${index}`}
              className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[1500ms] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
            <div className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="white"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Fullscreen me Navigim */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
            onClick={() => setCurrentIndex(null)}
          >
            <button className="absolute top-10 right-10 text-white text-[10px] tracking-widest uppercase z-[110]">
              Close
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(
                  (prev) =>
                    (prev - 1 + project.gallery.length) %
                    project.gallery.length,
                );
              }}
              className="absolute left-4 md:left-10 text-white/50 hover:text-white z-[110]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <motion.img
              key={currentIndex}
              src={project.gallery[currentIndex]}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % project.gallery.length);
              }}
              className="absolute right-4 md:right-10 text-white/50 hover:text-white z-[110]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
