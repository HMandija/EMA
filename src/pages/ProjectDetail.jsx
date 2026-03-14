import { useParams, Link } from "react-router-dom";
import { projectsData } from "../data/projects";
import { motion } from "framer-motion";
import { useEffect } from "react"; // Shto këtë

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projectsData.find((p) => p.slug === slug);

  // Kjo bën që faqja të hapet gjithmonë nga fillimi (lart)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project)
    return <div className="pt-20 text-center">Project not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto pb-24 pt-10"
    >
      {/* Header-i i Projektit */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-24 px-4">
        <div className="flex-1">
          <h1 className="text-2xl font-light uppercase tracking-[0.2em]">
            {project.title}
          </h1>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-2">
            {project.location} — {project.category}
          </p>

          {/* Shtohet Statusi dhe Roli nëse ekzistojnë */}
          <div className="mt-8 flex gap-8 text-[10px] uppercase tracking-widest text-gray-500">
            {project.status && (
              <div>
                <span className="text-gray-300">Status:</span> <br />
                {project.status}
              </div>
            )}
            {project.role && (
              <div>
                <span className="text-gray-300">Role:</span> <br />
                {project.role}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-md mt-10 md:mt-0 flex-1">
          <p className="text-[13px] text-gray-600 leading-relaxed font-light">
            {project.description}
          </p>
        </div>
      </div>

      {/* Galeria e fotove */}
      <div className="space-y-12 px-2 md:px-0">
        {project.gallery && project.gallery.length > 0 ? (
          project.gallery.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={img}
                alt={`${project.title} - ${index}`}
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-[1.2s] ease-in-out"
              />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-300 uppercase text-[10px] tracking-widest">
            Images coming soon
          </div>
        )}
      </div>

      {/* Butoni për t'u kthyer */}
      <div className="mt-32 text-center">
        <Link
          to="/"
          className="text-[10px] uppercase tracking-[0.4em] border-b border-black pb-2 hover:text-gray-400 hover:border-gray-400 transition-all"
        >
          Back to Projects
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
