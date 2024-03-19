import { Box } from "@radix-ui/themes";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <Box className="flex items-center justify-center h-screen">
      <Loader2Icon className="h-7 w-7 animate-spin mr-2.5" />
      <Box className="text-2xl font-semibold text-gray-900">Loading...</Box>
    </Box>
  );
}
