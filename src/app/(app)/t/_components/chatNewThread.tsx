import { Box, Text } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";

interface Props {
  setInput: (input: string) => void;
}

export function ChatNewThread({ setInput }: Props) {
  const focusInput = (message: string) => {
    setInput(message);
    document.getElementById("message")?.focus();
  };

  const SamplePrompts = [
    {
      Title: "Bharti Airtel vs Competition Commission of India",
      Description:
        "Explain the Bharti Airtel vs Competition Commission of India case?",
    },
    {
      Title: "Right to Information Act",
      Description: "What are the objectives of the Right to Information Act?",
    },
    {
      Title: "Data Protection Regulations",
      Description:
        "What are the new data protection regulations for corporations?",
    },
    {
      Title: "Companies Act judgement",
      Description:
        "What are the key judgments on director liabilities under the Companies Act?",
    },
  ];

  return (
    <Box className="h-full w-full flex flex-col py-6 justify-end items-center gap-6">
      <Box className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {SamplePrompts.map((prompt) => (
          <Button
            key={prompt.Title}
            variant="outline"
            className="w-full h-24 group transition-all relative overflow-clip shadow-sm border-[1px] border-slate-300 hover:border-gray-400"
            onClick={() => focusInput(prompt.Description)}
          >
            <Box className="flex flex-col text-left w-full h-auto">
              <Text className="text-clamp font-bold ">{prompt.Title}</Text>
              <Text className="text-clamp text-muted-foreground font-normal">
                {prompt.Description}
              </Text>
            </Box>
            <Box className="h-full w-full absolute hidden group-hover:block">
              <Box className="h-full bg-gradient-to-l from-accent from-10% to-40%" />
            </Box>
            <SendHorizonalIcon className="absolute right-4 hidden group-hover:block" />
          </Button>
        ))}
      </Box>
    </Box>
  );
}
