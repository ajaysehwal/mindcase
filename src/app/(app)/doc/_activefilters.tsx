import { useEffect, useState } from "react";

import { Box, Text } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { XIcon, CheckIcon } from "lucide-react";

import { filters } from "@/lib/data/filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface ActiveFiltersProps {
  activefilters: string[];
  setActiveFilters: (filters: string[]) => void;
  activeFilterValues: { [key: string]: string[] };
  setActiveFilterValues: (filters: { [key: string]: string[] }) => void;
  uniqueCourts?: string[];
  uniqueTypes?: string[];
  category: string;
}

export const ActiveFilters = ({
  activefilters,
  setActiveFilters,
  activeFilterValues,
  setActiveFilterValues,
  uniqueCourts,
  uniqueTypes,
  category,
}: ActiveFiltersProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  return (
    <Box className="flex flex-wrap items-center gap-2">
      {/* <Text className="whitespace-nowrap">Filters:</Text> */}
      {filters.map((filterGroup) =>
        filterGroup.filters.map(
          (filter) =>
            // only show filters that are in the list of activeFilters
            activefilters.includes(filter.name) &&
            filter.name === "Type of bench" &&
            filter.category === category && (
              <>
                <Popover key={filter.name}>
                  <PopoverTrigger asChild>
                    <Button
                      key={filter.name}
                      variant={
                        activefilters.includes(filter.name)
                          ? "secondary"
                          : "outline"
                      }
                      className="flex items-center h-8 space-x-4"
                    >
                      <Text className="whitespace-nowrap">{filter.name}</Text>
                      <XIcon
                        size={"15"}
                        onClick={() =>
                          setActiveFilters(
                            activefilters.filter((f) => f !== filter.name)
                          )
                        }
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    {/* <Calendar mode="single" initialFocus /> */}
                    <Command>
                      <CommandInput placeholder="Search value..." />
                      <CommandEmpty>No value found.</CommandEmpty>
                      <CommandGroup className="relative h-[400px]">
                        <Box className="absolute w-full h-[400px]">
                          <ScrollArea className="w-full h-full max-h-[400px]">
                            {filter.values.map((filterValue) => (
                              <CommandItem
                                key={filterValue.toString()}
                                value={filterValue.toString()}
                                onSelect={(e) => {
                                  if (
                                    activeFilterValues[filter.name]?.includes(
                                      filterValue.toString()
                                    )
                                  ) {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: activeFilterValues[
                                        filter.name
                                      ].filter(
                                        (f) => f !== filterValue.toString()
                                      ),
                                    });
                                  } else {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: [
                                        ...(activeFilterValues[filter.name] ||
                                          []),
                                        filterValue.toString(),
                                      ],
                                    });
                                  }
                                }}
                              >
                                {filterValue}
                                {activeFilterValues[filter.name]?.includes(
                                  filterValue.toString()
                                ) && (
                                  <CheckIcon className="ml-auto" size={"15"} />
                                )}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </Box>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )
        )
      )}
      {filters.map((filterGroup) =>
        filterGroup.filters.map(
          (filter) =>
            // only show filters that are in the list of activeFilters
            activefilters.includes(filter.name) &&
            filter.name === "Court" &&
            filter.category === category && (
              <>
                <Popover key={filter.name}>
                  <PopoverTrigger asChild>
                    <Button
                      key={filter.name}
                      variant={
                        activefilters.includes(filter.name)
                          ? "secondary"
                          : "outline"
                      }
                      className="flex items-center h-8 space-x-4"
                    >
                      <Text className="whitespace-nowrap">{filter.name}</Text>
                      <XIcon
                        size={"15"}
                        onClick={() =>
                          setActiveFilters(
                            activefilters.filter((f) => f !== filter.name)
                          )
                        }
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    {/* <Calendar mode="single" initialFocus /> */}
                    <Command>
                      <CommandInput placeholder="Search value..." />
                      <CommandEmpty>No value found.</CommandEmpty>
                      <CommandGroup className="relative h-[400px]">
                        <Box className="absolute w-full h-[400px]">
                          <ScrollArea className="w-full h-full max-h-[400px]">
                            {uniqueCourts!.map((filterValue) => (
                              <CommandItem
                                key={filterValue.toString()}
                                value={filterValue.toString()}
                                onSelect={(e) => {
                                  if (
                                    activeFilterValues[filter.name]?.includes(
                                      filterValue.toString()
                                    )
                                  ) {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: activeFilterValues[
                                        filter.name
                                      ].filter(
                                        (f) => f !== filterValue.toString()
                                      ),
                                    });
                                  } else {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: [
                                        ...(activeFilterValues[filter.name] ||
                                          []),
                                        filterValue.toString(),
                                      ],
                                    });
                                  }
                                }}
                              >
                                {filterValue}
                                {activeFilterValues[filter.name]?.includes(
                                  filterValue.toString()
                                ) && (
                                  <CheckIcon className="ml-auto" size={"15"} />
                                )}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </Box>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )
        )
      )}
      {filters.map((filterGroup) =>
        filterGroup.filters.map(
          (filter) =>
            // only show filters that are in the list of activeFilters
            activefilters.includes(filter.name) &&
            filter.name === "Decision date" &&
            filter.category === category && (
              <>
                <Popover key={filter.name}>
                  <PopoverTrigger asChild>
                    <Button
                      key={filter.name}
                      variant={
                        activefilters.includes(filter.name)
                          ? "secondary"
                          : "outline"
                      }
                      className="flex items-center h-8 space-x-4"
                    >
                      <Text className="whitespace-nowrap">{filter.name}</Text>
                      <XIcon
                        size={"15"}
                        onClick={() =>
                          setActiveFilters(
                            activefilters.filter((f) => f !== filter.name)
                          )
                        }
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {/* <Calendar mode="single" initialFocus /> */}
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(e) => {
                        setDate(e);
                        var fromDateEvent = e?.from;
                        var toDateEvent = e?.to;
                        var datesArray = [];

                        if (
                          fromDateEvent &&
                          toDateEvent &&
                          toDateEvent >= fromDateEvent
                        ) {
                          // Iterate over the date range
                          for (
                            var currentDate = new Date(fromDateEvent);
                            currentDate <= toDateEvent;
                            currentDate.setDate(currentDate.getDate() + 1)
                          ) {
                            var formattedFromDate = "";

                            // Manually construct the date string in yyyy/mm/dd format
                            var year = currentDate.getFullYear();
                            var month = currentDate.getMonth() + 1; // getMonth() is zero-indexed
                            var day = currentDate.getDate();

                            // Pad the month and day with leading zeros if necessary
                            formattedFromDate =
                              year +
                              "/" +
                              String(month).padStart(2, "0") +
                              "/" +
                              String(day).padStart(2, "0");

                            datesArray.push(formattedFromDate); // Push the formatted date into the array
                          }
                        }

                        setActiveFilterValues({
                          ...activeFilterValues,
                          [filter.name]: datesArray,
                        });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </>
            )
        )
      )}
      {filters.map((filterGroup) =>
        filterGroup.filters.map(
          (filter) =>
            // only show filters that are in the list of activeFilters
            activefilters.includes(filter.name) &&
            filter.name === "Type" &&
            filter.category === category && (
              <>
                <Popover key={filter.name}>
                  <PopoverTrigger asChild>
                    <Button
                      key={filter.name}
                      variant={
                        activefilters.includes(filter.name)
                          ? "secondary"
                          : "outline"
                      }
                      className="flex items-center h-8 space-x-4"
                    >
                      <Text className="whitespace-nowrap">{filter.name}</Text>
                      <XIcon
                        size={"15"}
                        onClick={() =>
                          setActiveFilters(
                            activefilters.filter((f) => f !== filter.name)
                          )
                        }
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    {/* <Calendar mode="single" initialFocus /> */}
                    <Command>
                      <CommandInput placeholder="Search value..." />
                      <CommandEmpty>No value found.</CommandEmpty>
                      <CommandGroup className="relative h-[400px]">
                        <Box className="absolute w-full h-[400px]">
                          <ScrollArea className="w-full h-full max-h-[400px]">
                            {uniqueTypes!.map((filterValue) => (
                              <CommandItem
                                key={filterValue.toString()}
                                value={filterValue.toString()}
                                onSelect={(e) => {
                                  if (
                                    activeFilterValues[filter.name]?.includes(
                                      filterValue.toString()
                                    )
                                  ) {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: activeFilterValues[
                                        filter.name
                                      ].filter(
                                        (f) => f !== filterValue.toString()
                                      ),
                                    });
                                  } else {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: [
                                        ...(activeFilterValues[filter.name] ||
                                          []),
                                        filterValue.toString(),
                                      ],
                                    });
                                  }
                                }}
                              >
                                {filterValue}
                                {activeFilterValues[filter.name]?.includes(
                                  filterValue.toString()
                                ) && (
                                  <CheckIcon className="ml-auto" size={"15"} />
                                )}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </Box>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )
        )
      )}
      {filters.map((filterGroup) =>
        filterGroup.filters.map(
          (filter) =>
            // only show filters that are in the list of activeFilters
            activefilters.includes(filter.name) &&
            filter.name === "Enactment year" &&
            filter.category === category && (
              <>
                <Popover key={filter.name}>
                  <PopoverTrigger asChild>
                    <Button
                      key={filter.name}
                      variant={
                        activefilters.includes(filter.name)
                          ? "secondary"
                          : "outline"
                      }
                      className="flex items-center h-8 space-x-4"
                    >
                      <Text className="whitespace-nowrap">{filter.name}</Text>
                      <XIcon
                        size={"15"}
                        onClick={() =>
                          setActiveFilters(
                            activefilters.filter((f) => f !== filter.name)
                          )
                        }
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    {/* <Calendar mode="single" initialFocus /> */}
                    <Command>
                      <CommandInput placeholder="Search value..." />
                      <CommandEmpty>No value found.</CommandEmpty>
                      <CommandGroup className="relative h-[400px]">
                        <Box className="absolute w-full h-[400px]">
                          <ScrollArea className="w-full h-full max-h-[400px]">
                            {filter.values!.map((filterValue) => (
                              <CommandItem
                                key={filterValue.toString()}
                                value={filterValue.toString()}
                                onSelect={(e) => {
                                  if (
                                    activeFilterValues[filter.name]?.includes(
                                      filterValue.toString()
                                    )
                                  ) {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: activeFilterValues[
                                        filter.name
                                      ].filter(
                                        (f) => f !== filterValue.toString()
                                      ),
                                    });
                                  } else {
                                    setActiveFilterValues({
                                      ...activeFilterValues,
                                      [filter.name]: [
                                        ...(activeFilterValues[filter.name] ||
                                          []),
                                        filterValue.toString(),
                                      ],
                                    });
                                  }
                                }}
                              >
                                {filterValue}
                                {activeFilterValues[filter.name]?.includes(
                                  filterValue.toString()
                                ) && (
                                  <CheckIcon className="ml-auto" size={"15"} />
                                )}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </Box>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )
        )
      )}
    </Box>
  );
};
