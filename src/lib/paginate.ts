type PagedLike<T> = { items?: Array<T | null>; pageSize?: number; totalRecords?: number };

/**
 * Fetches every page of a paginated endpoint and returns the flattened, non-null items.
 * Page 1 is fetched first to learn the total; the remaining pages run concurrently.
 * Defends against missing/zero pageSize or totalRecords (no division-by-zero, no runaway).
 */
export async function fetchAllPages<T>(fetchPage: (page: number) => Promise<PagedLike<T>>): Promise<T[]> {
  const collect = (page: PagedLike<T>): T[] => (page.items ?? []).filter((item): item is T => item != null);

  const firstPage = await fetchPage(1);
  const items = collect(firstPage);
  const pageSize = Math.max(firstPage.pageSize || 0, items.length, 1);
  const totalPages = Math.max(1, Math.ceil((firstPage.totalRecords || items.length) / pageSize));

  if (totalPages === 1) return items;

  const remaining = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 2)));
  return [...items, ...remaining.flatMap(collect)];
}
