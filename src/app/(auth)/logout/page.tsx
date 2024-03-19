"use client";

import Image from "next/image";

import { Box, Heading } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Logout() {
  const { removeUser } = useAuthStore((state) => state);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth
      .signOut()
      .then(() => {
        removeUser();
        console.log("signed out successfully");
      })
      .catch((error) => {
        console.log("error signing out", error);
      });
  }, []);

  return (
    <Box className="flex flex-col justify-center items-center h-full w-full">
      <Box className="w-full h-full md:w-[375px] md:h-auto p-12 border rounded-lg bg-primary-foreground">
        <Box className="flex flex-col items-center w-full h-full space-y-8">
          <Image src="/logo.svg" alt="logo" height={"80"} width={"80"} />
          <Heading as="h5">Logged out successfully</Heading>
          <Button asChild >
            <a href="/">Go back to Home Page</a>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
