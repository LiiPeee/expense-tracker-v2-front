import type { Contact } from "@/helper/contact";
import { getAllContacts } from "@/services/contact";
import { useQuery } from "@tanstack/react-query";

type UseContactsQueryOptions = {
  enabled?: boolean;
};

export function useContactsQuery(options: UseContactsQueryOptions = {}) {
  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: getAllContacts,
    staleTime: 60_000,
    enabled: options.enabled ?? true,
  });

  return {
    ...query,
    contacts: (query.data ?? []) as Contact[],
  };
}
