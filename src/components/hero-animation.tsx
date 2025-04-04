"use client";

import { motion } from "framer-motion";

export default function HeroAnimation() {
  const floatAnimation = {
    y: [0, -10, 0],
    rotate: [0, 2, 0],
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main note app window */}
      <motion.div
        className="bg-white border-4 border-black rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        animate={floatAnimation}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-gray-100 border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-bold">Note Keeper</div>
          <div className="w-4"></div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <motion.div
              className="h-8 bg-gray-200 rounded-lg w-3/4 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            ></motion.div>
            <motion.div
              className="h-8 bg-gray-200 rounded-lg w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            ></motion.div>
          </div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </motion.div>

          <motion.div
            className="mt-6 p-4 bg-blue-100 rounded-xl border-2 border-blue-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                <div className="h-3 bg-blue-200 rounded w-full"></div>
                <div className="h-3 bg-blue-200 rounded w-5/6"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements with different animation timings */}
      <motion.div
        className="absolute hidden sm:block -top-6 -right-6 w-20 h-20 bg-yellow-300 rounded-lg border-4 border-black rotate-12 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: [0, -15, 0],
          rotate: [12, 15, 12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.9,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-3xl">💡</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute hidden sm:block -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-lg border-4 border-black -rotate-12 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: [0, -10, 0],
          rotate: [-12, -8, -12],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.1,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
      </motion.div>
    </div>
  );
}
