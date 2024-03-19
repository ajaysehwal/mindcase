import { Box } from "@radix-ui/themes";
import { motion } from "framer-motion";

export const MainSearchAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      // initial y : middle of screen
      initial={{ y: "50vh" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

export const SearchResultsAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};
