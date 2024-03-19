"use client";

import { useEffect, useState } from "react";
import { Box, Text } from "@radix-ui/themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import CasePdfViewer from "./_casepdfviewer";
import CaseViewer from "./_caseviewer";

import { cn } from "@/lib/utils";
import { Cases, Acts } from "@/lib/db";
import { getCaseCount, getCases, getCourts } from "@/lib/db/cases";
import { getActCount, getActs, getTypes } from "@/lib/db/acts";
import { MainSearch } from "./_mainSearch";
import { ActiveFilters } from "./_activefilters";
import { ChevronLeftIcon, ChevronRightIcon, LoaderIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Cases() {
  const [category, setCategory] = useState<string>("CaseLaws");

  const [cases, setCases] = useState<Cases[]>([]);
  const [caseCount, setCaseCount] = useState<number>(0);
  const [Acts, setActs] = useState<Acts[]>([]);
  const [actCount, setActCount] = useState<number>(0);
  const [uniqueCourts, setUniqueCourts] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const [caseId, setCaseId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activefilters, setActiveFilters] = useState<string[]>([]);
  const [activeFilterValues, setActiveFilterValues] = useState<{
    [key: string]: string[];
  }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);

  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   if (searchParams.get("page"))
  //     setPage(parseInt(searchParams.get("page") || "0"));
  //   if (searchParams.get("limit"))
  //     setLimit(parseInt(searchParams.get("limit") || "10"));
  // }, [searchParams]);

  const fetchCaseCount = async () => {
    setLoadingCount(true);
    const supabase = createClient();
    const count = await getCaseCount(supabase, searchTerm, activeFilterValues);
    setCaseCount(count);
    setLoadingCount(false);
  };

  const fetchActCount = async () => {
    setLoadingCount(true);
    const supabase = createClient();
    const count = await getActCount(supabase, searchTerm, activeFilterValues);
    setActCount(count);
    setLoadingCount(false);
  };

  const fetchCaseData = async () => {
    setLoading(true);
    const supabase = createClient();
    const res = await getCases(
      supabase,
      page,
      limit,
      searchTerm,
      activeFilterValues
    );
    setCases(res);
    setCaseId(res[0]?.file_id || "");
    console.log(res);
    setLoading(false);
  };

  const fetchActsData = async () => {
    setLoading(true);
    const supabase = createClient();
    const res = await getActs(
      supabase,
      page,
      limit,
      searchTerm,
      activeFilterValues
    );
    setActs(res);
    setCaseId(res[0]?.pdf_link || "");
    console.log(res);
    setLoading(false);
  };

  const fetchCourts = async () => {
    const supabase = createClient();
    const courts = await getCourts(supabase);
    setUniqueCourts(courts);
  };

  const fetchTypes = async () => {
    const supabase = createClient();
    const types = await getTypes(supabase);
    setUniqueTypes(types);
  };

  useEffect(() => {
    setPage(0);
    if (category === "CaseLaws") {
      fetchCaseData();
      fetchCaseCount();
    } else if (category === "Acts") {
      fetchActsData();
      fetchActCount();
    }
  }, [activeFilterValues, searchTerm, category]);

  useEffect(() => {
    if (category === "CaseLaws") {
      fetchCaseData();
    } else if (category === "Acts") {
      fetchActsData();
    }
  }, [page, limit]);

  useEffect(() => {
    const newFilterValues = { ...activeFilterValues };
    Object.keys(newFilterValues).forEach((key) => {
      delete newFilterValues[key];
    });
    setActiveFilterValues(newFilterValues);
  }, [category]);

  useEffect(() => {
    const newFilterValues = { ...activeFilterValues };

    Object.keys(newFilterValues).forEach((key) => {
      if (!activefilters.includes(key)) {
        delete newFilterValues[key];
      }
    });

    setActiveFilterValues(newFilterValues);

    if (category === "CaseLaws") {
      fetchCourts();
    } else if (category === "Acts") {
      fetchTypes();
    }
  }, [activefilters]);

  return (
    <Box className="h-full w-full flex relative">
      <Box className="h-full w-full flex flex-col px-10 py-4 space-y-4">
        <MainSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activefilters={activefilters}
          setActiveFilters={setActiveFilters}
          category={category}
          setCategory={setCategory}
        />

        <ActiveFilters
          activefilters={activefilters}
          setActiveFilters={setActiveFilters}
          activeFilterValues={activeFilterValues}
          setActiveFilterValues={setActiveFilterValues}
          uniqueCourts={category === "CaseLaws" ? uniqueCourts : undefined}
          uniqueTypes={category === "Acts" ? uniqueTypes : undefined}
          category={category}
        />

        <Box className="h-full w-full overflow-hidden flex relative">
          <Box className="h-full w-full overflow-hidden flex relative border divide-x">
            <CaseViewer
              loading={loading}
              category={category}
              cases={category === "CaseLaws" ? cases : Acts}
              caseLaws={category === "CaseLaws" ? cases : undefined}
              acts={category === "Acts" ? Acts : undefined}
              caseCount={category === "CaseLaws" ? caseCount : actCount}
              loadingCount={loadingCount}
              page={page}
              limit={limit}
              caseId={caseId}
              setCaseId={setCaseId}
              setPage={setPage}
            />
            <CasePdfViewer
              category={category}
              fileID={category === "CaseLaws" ? caseId : undefined}
              pdf_link={category === "Acts" ? caseId : undefined}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
