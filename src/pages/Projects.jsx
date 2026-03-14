import { motion } from "framer-motion";
import { projectsData } from "../data/projects";
import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <div className="pb-32 px-4 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            {/* KËTU ËSHTË NDRYSHIMI: Shtohet Link që lidhet me slug-un */}
            <Link
              to={`/project/${project.slug}`}
              className="group block cursor-pointer"
            >
              <div className="overflow-hidden bg-[#f4f4f4] aspect-[4/3]">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-[1s] ease-in-out group-hover:scale-105"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-900">
                  {project.title}
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                  {project.location} — {project.category}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
