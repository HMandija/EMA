import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pt-10 pb-24 px-4"
    >
      <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-16">
        About — EMA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Kolona e majtë - Përshkrimi */}
        <div className="text-sm leading-relaxed text-gray-600 space-y-6">
          <p>
            <strong>EMA</strong> is an architectural practice focused on
            contemporary design, technical precision, and sustainable
            innovation.
          </p>
          <p>
            With experience ranging from residential projects in the USA to
            large-scale hospitality resorts in the South of Albania, we bridge
            the gap between creative vision and technical execution (Eurocode &
            USA Code).
          </p>
          <p>
            Our work explores the intersection of traditional materials like
            stone and wood with modern technologies such as BIM and sustainable
            energy solutions.
          </p>
        </div>

        {/* Kolona e djathtë - Ekspertiza */}
        <div className="text-[11px] uppercase tracking-widest space-y-8">
          <div>
            <h3 className="text-gray-400 mb-3">Core Expertise</h3>
            <ul className="space-y-2 text-black font-medium">
              <li>Architectural Design</li>
              <li>3D Visualization & Rendering</li>
              <li>Technical & Structural Drawings</li>
              <li>Project Management</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-400 mb-3">Specialization</h3>
            <p className="text-black leading-loose">
              Residential / Commercial / Data Centers / Sustainable Materials
              (Rammed Earth, CLT, Cork)
            </p>
          </div>
        </div>
      </div>

      {/* Seksioni i Edukimit/Eksperiencës (Opsionale) */}
      <div className="mt-24 pt-12 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">
          Building the future through technical excellence.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
