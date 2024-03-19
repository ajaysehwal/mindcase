import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  iconVariant?: "white" | "black";
  enableText?: boolean;
  enableLinkEle?: boolean;
  size?: number;
}

export default function Logo({
  iconVariant = "white",
  enableText = true,
  enableLinkEle = true,
  size = 30,
}: Props) {
  const router = useRouter();
  const handleLogoHref = () => {
    router.push("/");
  };

  return (
    <div className="flex h-fit justify-center items-center">
      <div
        onClick={() => {
          if (enableLinkEle) handleLogoHref();
        }}
        className={`flex items-center justify-center ${
          enableText && `space-x-2.5`
        }`}
      >
        {iconVariant === "white" ? (
          <Image src="/logo.svg" alt="logo" width={size} height={size} />
        ) : (
          <Image src="/logo-dark.svg" alt="logo" width={size} height={size} />
        )}
        {enableText ? <LogoText /> : null}
        <span className="hidden font-bold sm:inline-block"></span>
      </div>
    </div>
  );
}

const LogoText = () => {
  return (
    <div className="tracking-widest text-xl line-clamp-1">
      <div className="font-bold inline-block">mind</div>
      <div className="font-light inline-block">case</div>
      {/* <div className="font-light inline-block">.co</div> */}
    </div>
  );
};
