import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { supabase } = createClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!user) {
    if (!req.nextUrl.pathname.startsWith("/login"))
      return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/login", "/logout", "/t", "/d", "/doc", "/"],
};
