"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/actions/auth";

const LoginButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Button
        onClick={() => signInWithGoogle()}
        className="flex gap-2 bg-black text-white text-base px-8 py-6 rounded-xl font-bold hover:bg-black/80 shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]"
      >
        Continue With Google
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        <MoveRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default LoginButton;
