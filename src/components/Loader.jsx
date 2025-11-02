import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/TejLogo.png";

const Loader = ({ duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 h-[100vh] flex flex-col items-center justify-center 
                     bg-gradient-to-br from-[#0D3B66] via-[#1E6091] to-[#0D3B66]
                     animate-gradientMove z-[9999]"
        > 
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative"
          >
            <motion.img
              src={Logo}
              alt="TejBuy"
              className="w-32 h-32 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            />
            <motion.div
              className="absolute top-0 left-[-150%] w-full h-full bg-gradient-to-r 
                         from-transparent via-white/30 to-transparent rotate-12"
              animate={{ left: ["-150%", "150%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 0.9, 1], y: [20, 0, 0, 0] }}
            transition={{ duration: 2 }}
            className="text-4xl font-bold text-white tracking-wide"
          >
            Welcome to <span className="text-yellow-300">TejBuy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0.8, 1], y: [10, 0, 0, 0] }}
            transition={{ duration: 2, delay: 1.5 }}
            className="mt-2 text-white/80 text-sm tracking-wide italic"
          >
            "Fastest delivery. Desi convenience."
          </motion.p>

          {/* Loader spinner */}
          <motion.div
            className="mt-8 w-12 h-12 border-4 border-t-yellow-300 border-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
