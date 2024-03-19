import { SupabaseClient } from "@supabase/supabase-js";
import { Cases, Database } from ".";

const filterBuilder = (filterValues: { [key: string]: string[] }) => {
  let filter = "";
  Object.keys(filterValues).forEach((key) => {
    if (key === "Court") {
      filterValues[key].forEach((value) => {
        filter += `court.eq.${value},`;
      });
    }
    if (key === "Decision date") {
      filterValues[key].forEach((value) => {
        filter += `decision_date.eq.${value},`;
      });
    }
  });
  if (filter === "") filter = "court.neq.null,";
  return filter.slice(0, -1);
};

const filteredQuery = (
  supabase: SupabaseClient<Database>,
  search: string,
  filterValues: { [key: string]: string[] },
  count: boolean = false,
  page: number = 0,
  limit: number = 5
) => {
  let query = supabase
    .from("Cases")
    .select("*", count ? { count: "exact", head: true } : {});
  if (!count)
    query = query
      .order("court", { ascending: true })
      .range(page * limit, page * limit + limit - 1);
  if (search)
    query = query.textSearch("case_name", search, {
      type: "websearch",
      config: "english",
    });
  if (filterValues) query = query.or(filterBuilder(filterValues));
  return query;
};

export const getCases = async (
  supabase: SupabaseClient<Database>,
  page: number = 0,
  limit: number = 5,
  search: string,
  filters: { [key: string]: string[] }
): Promise<Cases[]> => {
  console.log("getCases");
  const query = filteredQuery(supabase, search, filters, false, page, limit);
  const { data, error } = await query;
  if (error) console.log(error);
  if (error) return Array<Cases>();
  return data ?? Array<Cases>();
};

export const getCaseCount = async (
  supabase: SupabaseClient<Database>,
  search: string,
  filters: { [key: string]: string[] }
): Promise<number> => {
  console.log("getCaseCount");
  const query = filteredQuery(supabase, search, filters, true);
  const { count, error } = await query;
  console.log("casecount", count);
  //   if (error) return 0;
  return count ?? 0;
};

export const getCaseByIds = async (
  supabase: SupabaseClient<Database>,
  ids: string[]
): Promise<Cases[]> => {
  const { data, error } = await supabase
    .from("Cases")
    .select()
    .in("file_id", ids);
  if (error) return Array<Cases>();
  return data;
};

export const getCourts = async (
  supabase: SupabaseClient<Database>
): Promise<string[]> => {
  const { data, error } = await supabase.from("Cases").select("court");
  const uniqueValuesSet = new Set(data!.map((item: any) => item.court));
  const uniqueValues = Array.from(uniqueValuesSet).sort();

  return uniqueValues;
};
