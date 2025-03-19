"use server";

import { createClientForServer } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();
  const auth_callback_url = "http://localhost:3000/auth/callback";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
    return;
  }

  redirect(data.url);
};

const signOut = async () => {
  const supabase = await createClientForServer();
  return await supabase.auth.signOut();
};

const signInWithGoogle = signInWith("google");

export { signInWithGoogle, signOut };
