import { BASE_URL } from "@/lib/api";
import { createJsonResponse } from "@/test/response";
import { deleteContact } from "./contact";

const fetchMock = vi.fn();

describe("contact service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delete contact issues a DELETE request with the id", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, true, 200));

    await expect(deleteContact(12)).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/Contact/DeleteContact?id=12`);
    expect(init.method).toBe("DELETE");
  });

  it("throw fallback message when delete fails", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, false, 500));

    await expect(deleteContact(7)).rejects.toThrow("Falha ao excluir contato");
  });
});
