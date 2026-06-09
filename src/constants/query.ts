/** Tempo (ms) em que os dados de uma query são considerados frescos antes de refetch. */
export const QUERY_STALE_TIME = 60_000;

/** Tempo (ms) que dados inativos permanecem em cache antes de serem coletados. */
export const QUERY_GC_TIME = 5 * QUERY_STALE_TIME;
