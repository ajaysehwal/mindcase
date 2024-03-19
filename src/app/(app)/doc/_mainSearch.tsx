import { Box, Text } from "@radix-ui/themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { FilterIcon, SearchIcon } from "lucide-react";

import { filters } from "@/lib/data/filters";
import { Input } from "@/components/ui/input";

interface MainSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activefilters: string[];
  setActiveFilters: (filters: string[]) => void;
  category: string;
  setCategory: (category: string) => void;
}

export const MainSearch = ({
  searchTerm,
  setSearchTerm,
  activefilters,
  setActiveFilters,
  category,
  setCategory,
}: MainSearchProps) => {
  const setSearchValue = () => {
    setSearchTerm(
      (document.getElementById("search") as HTMLInputElement | null)?.value ||
        ""
    );
  };

  return (
    <Box className="w-full h-auto flex rounded-md overflow-hidden border divide-x">
      <Select
        defaultValue="CaseLaws"
        onValueChange={(e) => {
          setCategory(e);
        }}
      >
        <SelectTrigger className="w-[180px] h-[full] rounded-r-none border-none whitespace-nowrap">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="CaseLaws">Case Laws</SelectItem>
            <SelectItem value="Acts">Acts</SelectItem>
            <SelectItem value="Rules">Rules</SelectItem>
            <SelectItem value="Circulars">Circulars</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Box className="w-full overflow-hidden">
        {/* <CommandInput className="flex w-full h-[full]" placeholder="Search" /> */}
        <Input
          id="search"
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          className="flex w-full border-none rounded-none focus-visible:ring-0"
          placeholder="Search"
        />
      </Box>
      <Popover>
        <PopoverTrigger asChild>
          <Box>
            <Button
              variant={"outline"}
              className="flex items-center h-full rounded-none border-none space-x-1"
            >
              <FilterIcon size={"15"} />
              <Text className="whitespace-nowrap">Add Filter</Text>
            </Button>
          </Box>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <ScrollArea className="w-full h-full max-h-[400px] overflow-y-scroll">
            <Box className="flex flex-col px-4">
              {filters.map((filterGroup) => (
                <Box
                  key={filterGroup.name}
                  className="flex flex-col space-y-1 py-4 border-b"
                >
                  <Text className="text-md font-semibold">
                    {filterGroup.name}
                  </Text>
                  {filterGroup.filters.map(
                    (filter) =>
                      filter.category === category && (
                        <Button
                          key={filter.name}
                          className="flex items-center text-left h-8"
                          disabled={filter.type === "disabled"}
                          variant={
                            activefilters.includes(filter.name)
                              ? "secondary"
                              : "outline"
                          }
                          onClick={() => {
                            if (activefilters.includes(filter.name)) {
                              setActiveFilters(
                                activefilters.filter((f) => f !== filter.name)
                              );
                            } else {
                              setActiveFilters([...activefilters, filter.name]);
                            }
                          }}
                        >
                          <Text className="w-full text-sm">{filter.name}</Text>
                        </Button>
                      )
                  )}
                </Box>
              ))}
            </Box>
            {/* <ScrollBar orientation="vertical" /> */}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Button
        // on click setsearchterm to string in input having id 'search'
        onClick={setSearchValue}
        className="rounded-none h-auto"
      >
        <SearchIcon size={"20"} />
      </Button>
    </Box>
  );
};
