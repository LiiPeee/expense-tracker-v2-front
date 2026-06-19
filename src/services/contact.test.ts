import { authFetch, BASE_URL } from "@/lib/api";
import { deleteContact } from "./contact";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    BASE_URL: "http://api.test",
    authFetch: vi.fn(),
  };
});

const mockedAuthFetch = vi.mocked(authFetch);

function createResponse<T>(data: T, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn(async () => data),
  } as unknown as Response;
}

describe("contact service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delete contact issues a DELETE request with the id", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, true, 200));

    await expect(deleteContact(12)).resolves.toBeUndefined();

    expect(mockedAuthFetch).toHaveBeenCalledWith(
      `${BASE_URL}/Contact/DeleteContact?id=12`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("throw fallback message when delete fails", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, false, 500));

    await expect(deleteContact(7)).rejects.toThrow("Falha ao excluir contato");
  });
});
