"use client";

import { Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";

import { Thread } from "./sidebarThreads";
import { Times, cn, maxRange } from "@/lib/utils";
import { useRootStore } from "@/providers/RootProvider";

interface Props {
  timeText: Times;
}

export const TimeSeparatedThreads = ({ timeText = Times.Today }: Props) => {
  const today = new Date();
  const { threads, setNewThreadLoading } = useRootStore((state) => state);

  const couldMax = maxRange(timeText);
  const filteredThreads = threads.filter((t) => {
    const createdAt = new Date(t.modified_at);
    const diff = Number(today) - Number(createdAt);
    if (diff >= couldMax[0] && diff <= couldMax[1]) return true;
    else return false;
  });

  return (
    <div
      className={cn(
        "mr-4 flex-1 h-fit flex-col gap-1 mb-6",
        filteredThreads.length ? "flex" : "hidden"
      )}
    >
      {threads.length > 0 && (
        <h5 className="text-[12px] font-medium text-gray-500 self-start">
          {timeText}
        </h5>
      )}
      <Flex direction="column" className="gap-0.5">
        <AnimatePresence>
          {filteredThreads.length < 1 ? (
            <Text className="text-center text-gray-400">No threads</Text>
          ) : (
            filteredThreads.map((thread) => (
              <motion.ul
                layout
                key={thread.id}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Thread thread={thread} deleteIndicator={setNewThreadLoading} />
              </motion.ul>
            ))
          )}
        </AnimatePresence>
      </Flex>
    </div>
  );
};
