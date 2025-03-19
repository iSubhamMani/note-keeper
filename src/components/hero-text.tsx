"use client";

import { motion } from "framer-motion";

const HeroText = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="text-5xl md:text-6xl font-black leading-tight"
    >
      Your notes, <br />
      <motion.span
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-blue-600"
      >
        supercharged with AI
      </motion.span>{" "}
    </motion.h1>
  );
};

export default HeroText;
