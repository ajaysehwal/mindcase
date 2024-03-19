import { memo } from "react";
import { Space_Mono } from "next/font/google";
import { CheckCircle, Loader2Icon } from "lucide-react";

const spaceMono = Space_Mono({
  preload: false,
  subsets: ["latin"],
  weight: "400",
  // fallback: ["comic sans"],
});

interface Props {
  message: string;
  loading?: boolean;
}

export const AnimatedQueryStatus = ({ message, loading }: Props) => {
  // const [displayedWords, setDisplayedWords] = useState([""]);
  // const words = message.split("");

  // useEffect(() => {
  //   const timeouts: NodeJS.Timeout[] = [];
  //   words.forEach((word, index) => {
  //     const timeout = setTimeout(() => {
  //       setDisplayedWords((currentWords) => [...currentWords, word]);
  //     }, 100 * (index + 1));
  //     timeouts.push(timeout);
  //   });

  //   return () => timeouts.forEach(clearTimeout);
  // }, []);

  return (
    <div
      className="transition-opacity duration-300 ease-in ml-14 text-xs w-fit flex text-foreground shadow-sm p-2 rounded-md bg-primary-foreground tracking-tight"
      style={{
        fontFamily: spaceMono.style.fontFamily,
        whiteSpace: "pre-wrap",
      }}
    >
      {loading ? (
        <Loader2Icon className="w-4 h-auto animate-spin ml-1" />
      ) : (
        <CheckCircle className="w-3 h-auto" />
      )}
      <p className="ml-2">{message}</p>
    </div>
  );
};

export const QueryStatus = memo(function QueryStatus({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="ml-14 flex items-center gap-2 text-xs w-fit text-foreground shadow-sm p-2 rounded-md bg-primary-foreground tracking-tight"
      style={{
        fontFamily: spaceMono.style.fontFamily,
        whiteSpace: "pre-wrap",
      }}
    >
      <CheckCircle className="w-3 h-auto" />
      {text}
    </div>
  );
});
