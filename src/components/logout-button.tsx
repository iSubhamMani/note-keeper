"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const res = await signOut();

        if (res.error) {
          toast("Error signing out", {
            duration: 3000,
            position: "bottom-center",
            style: {
              backgroundColor: "#FF3B30",
              color: "#fff",
              fontWeight: "bold",
            },
          });
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
