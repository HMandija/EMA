import { motion } from "framer-motion";
import welcomeVideo from "../assets/logo-video.mp4"; //

const WelcomePage = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={onComplete} // Kjo e mbyll intron sapo mbaron sekonda e fundit
        className="w-full h-full object-contain md:scale-110"
      >
        <source src={welcomeVideo} type="video/mp4" />
      </video>

      {/* Buton "Skip" nëse videoja ngec */}
      <button
        onClick={onComplete}
        className="absolute bottom-10 right-10 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
      >
        Skip Intro
      </button>
    </motion.div>
  );
};

export default WelcomePage;
