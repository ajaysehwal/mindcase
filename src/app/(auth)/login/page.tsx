import Link from "next/link";
import Image from "next/image";

import AuthForm from "./auth-form";

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative flex items-center gap-4 text-lg font-medium">
            <div className="flex h-fit justify-center items-center">
              <Link
                href="/"
                className={`flex items-center justify-center gap-1`}
              >
                <Image src="/logo-dark.svg" alt="logo" width={30} height={30} />
                <span className="hidden font-bold sm:inline-block"></span>
                <div className="tracking-widest text-xl line-clamp-1">
                  <div className="font-bold inline-block">mind</div>
                  <div className="font-light inline-block">case</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="relative mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Experience the power of AI with deep legal expertise and
                intelligent workflows.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center">
          <div className="mx-auto flex flex-col justify-center w-full max-w-[350px]">
            <AuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
