/** Builds a minimal fetch Response stub for service/transport unit tests. */
export function createJsonResponse<T>(data: T, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
  } as unknown as Response;
}
