"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "@/actions/auth";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const res = await signOut();

        if (res.error) {
          console.log("error signout out");
          return;
        }

        router.replace("/");
      }}
      className="bg-black text-white font-bold hover:bg-black/80"
    >
      Sign Out
    </Button>
  );
};

export default LogoutButton;
