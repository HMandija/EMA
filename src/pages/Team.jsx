import { motion } from "framer-motion";
import sidiImage from "../assets/team/sidi/sidi.jpg";

const Team = () => {
  return (
    <div className="pt-40 pb-32 px-4 md:px-12 lg:px-16 min-h-screen transition-colors duration-500 dark:bg-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        {/* Krahu i Majtë: Imazhi */}
        <motion.div
          className="w-full lg:w-1/3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:project-card-custom">
            <img
              src={sidiImage}
              alt="Ersid Mandija"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-6 text-lg font-semibold uppercase tracking-widest dark:gold-shimmer">
            Ersid Mandija
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
            Founder / Principal Architect
          </p>
        </motion.div>

        {/* Krahu i Djathtë: Të dhënat */}
        <motion.div
          className="w-full lg:w-2/3 space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
              With 7 years of professional experience, Ersid Mandija is an
              architect specializing in residential architecture and interior
              design. He has collaborated with architecture studios on projects
              across the United States, Australia, and Europe, contributing to a
              wide range of residential and interior developments.
            </p>

            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
              His work spans multiple project phases, with strong experience in
              Design Development (DD) through Construction Documentation (CDs).
              Ersid is highly skilled in producing detailed technical drawings,
              coordinated construction sets, and precise architectural
              documentation that support the successful execution of projects.
            </p>

            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
              Throughout his career, he has developed extensive expertise in
              AutoCAD drafting, architectural detailing, and contribution in
              preparation of permit and construction drawings. His experience
              working with international teams has also given him a strong
              understanding of different architectural standards, workflows, and
              remote collaboration environments.
            </p>
          </div>

          {/* Vizë ndarëse minimaliste e artë */}
          <div className="h-[1px] w-20 bg-gray-200 dark:bg-yellow-700/30"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
