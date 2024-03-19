import "./globals.css";
import type { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { AuthStoreProvider } from "@/providers/AuthProvider";

import { RootStoreProvider } from "@/providers/RootProvider";

export const metadata: Metadata = {
  title: "Mindcase | Redefining Legal Industry",
  description: "Mindcase | Redefining Legal Industry",
};

interface RootProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthStoreProvider>
          <RootStoreProvider>
            <ThemeProvider
              enableColorScheme
              attribute="class"
              defaultTheme="light"
              enableSystem
            >
              <Theme suppressHydrationWarning asChild hasBackground={false}>
                <TanstackProvider>
                  <div className={"flex flex-col h-screen overflow-clip"}>
                    {children}
                  </div>
                </TanstackProvider>
              </Theme>
            </ThemeProvider>
          </RootStoreProvider>
        </AuthStoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
