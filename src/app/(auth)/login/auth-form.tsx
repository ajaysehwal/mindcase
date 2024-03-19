"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const { theme } = useTheme();
  const supabase = createClient();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(new URL(window.location.href).origin + "/auth/callback");
  }, []);

  return (
    <Auth
      supabaseClient={supabase}
      view="sign_in"
      theme={theme}
      providers={["google"]}
      redirectTo={`${currentUrl}`}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "darkblue",
              brandAccent: "blue",
            },
          },
        },
      }}
    />
  );
}
