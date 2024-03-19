"use client";

interface SpinnerProps {
  width?: string;
  mt?: string;
}
export function Spinner({ mt, width = "20px" }: SpinnerProps) {
  const w = width;
  const mainStyles = `h-[${w}] w-[${w}] animate-spin rounded-full border-[3px] border-solid border-slate-600 border-t-green-500 mt-[${mt}]`;
  return (
    <div className="flex items-center justify-center">
      <div className={mainStyles}></div>
    </div>
  );
}
