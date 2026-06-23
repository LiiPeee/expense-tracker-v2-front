import { BASE_URL, del, getJson, postJson, postVoid } from "@/lib/api";
import { createJsonResponse } from "@/test/response";

const okJson = <T>(data: T): Response => createJsonResponse(data);
const errJson = (data: unknown, status = 400): Response => createJsonResponse(data, false, status);

describe("api transport", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getJson builds the query string and drops null/undefined params", async () => {
    fetchMock.mockResolvedValueOnce(okJson({ value: 1 }));

    const result = await getJson<{ value: number }>("/Sample/Get", { a: 1, skipUndefined: undefined, c: "two", skipNull: null });

    expect(result).toEqual({ value: 1 });
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/Sample/Get?a=1&c=two`, expect.anything());
  });

  it("getJson without params calls the bare URL (no query string)", async () => {
    fetchMock.mockResolvedValueOnce(okJson([]));

    await getJson("/Sample/All");

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/Sample/All`);
  });

  it("del issues a DELETE with encoded params", async () => {
    fetchMock.mockResolvedValueOnce(okJson({}));

    await expect(del("/Sample/Delete", { id: 9 }, "fallback")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/Sample/Delete?id=9`, expect.objectContaining({ method: "DELETE" }));
  });

  it("postJson sends the serialized body and returns parsed json", async () => {
    fetchMock.mockResolvedValueOnce(okJson({ token: "abc" }));

    const result = await postJson<{ token: string }>("/Sample/Create", { name: "x" });

    expect(result).toEqual({ token: "abc" });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ name: "x" }));
  });

  it("postJson with auth:false omits the Authorization header", async () => {
    fetchMock.mockResolvedValueOnce(okJson({ token: "abc" }));

    await postJson("/Auth/SignIn", { email: "a@b.c" }, { auth: false });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("postVoid throws the fallback message when the backend has no message", async () => {
    fetchMock.mockResolvedValueOnce(errJson({}, 500));

    await expect(postVoid("/Sample/Create", { name: "x" }, { fallback: "Falha custom" })).rejects.toThrow("Falha custom");
  });
});
