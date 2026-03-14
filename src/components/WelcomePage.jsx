import { motion } from "framer-motion";
import logo from "../assets/logo-ema.png";

const WelcomePage = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* LOGOJA MONUMENTALE */}
        <motion.img
          src={logo}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }} // Logoja e madhe që kërkuat
          transition={{ duration: 2.5 }}
          onAnimationComplete={() => setTimeout(onComplete, 1000)}
          className="h-48 md:h-64 w-auto object-contain" // Pa invert, që të dalë logo origjinale
        />

        {/* Vija e artë poshtë logos */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120%" }}
          transition={{ delay: 1, duration: 1.5 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent mt-12"
        />
      </div>
    </motion.div>
  );
};

export default WelcomePage;
