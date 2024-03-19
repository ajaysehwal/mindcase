import { SupabaseClient } from "@supabase/supabase-js";
import { Acts, Database } from ".";

const filterBuilder = (filterValues: { [key: string]: string[] }) => {
  let filter = "";
  Object.keys(filterValues).forEach((key) => {
    if (key === "Type") {
      filterValues[key].forEach((value) => {
        filter += `act_type.eq.${value},`;
      });
    }
    if (key === "Enactment year") {
      filterValues[key].forEach((value) => {
        filter += `act_name.like.%${value}%,`;
      });
    }
  });
  if (filter === "") filter = "act_name.neq.null,";
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
    .from("Acts")
    .select("*", count ? { count: "exact", head: true } : {});
  if (!count)
    query = query
      .order("act_name", { ascending: true })
      .range(page * limit, page * limit + limit - 1);
  if (search)
    query = query.textSearch("act_name", search, {
      type: "websearch",
      config: "english",
    });
  if (filterValues) query = query.or(filterBuilder(filterValues));
  return query;
};

export const getActs = async (
  supabase: SupabaseClient<Database>,
  page: number = 0,
  limit: number = 5,
  search: string,
  filters: { [key: string]: string[] }
): Promise<Acts[]> => {
  console.log("getActs");
  const query = filteredQuery(supabase, search, filters, false, page, limit);
  const { data, error } = await query;
  if (error) console.log(error);
  if (error) return Array<Acts>();
  return data ?? Array<Acts>();
};

export const getActCount = async (
  supabase: SupabaseClient<Database>,
  search: string,
  filters: { [key: string]: string[] }
): Promise<number> => {
  console.log("getActsCount");
  const query = filteredQuery(supabase, search, filters, true);
  const { count, error } = await query;
  console.log("casecount", count);
  //   if (error) return 0;
  return count ?? 0;
};

export const getActByIds = async (
  supabase: SupabaseClient<Database>,
  ids: string[]
): Promise<Acts[]> => {
  const { data, error } = await supabase
    .from("Acts")
    .select()
    .in("pdf_link", ids);
  if (error) return Array<Acts>();
  return data;
};

export const getTypes = async (
  supabase: SupabaseClient<Database>
): Promise<string[]> => {
  const { data, error } = await supabase.from("Acts").select("act_type");
  const uniqueValuesSet = new Set(data!.map((item: any) => item.act_type));
  const uniqueValues = Array.from(uniqueValuesSet).sort();

  console.log(uniqueValues);
  return uniqueValues;
};
