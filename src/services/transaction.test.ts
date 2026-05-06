import { authFetch, BASE_URL } from "@/lib/api";
import { getExpenseValue, getTransactionsByTypeAndContactPaged, updateTransaction } from "./transaction";

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

describe("transaction service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("request transactions by contact and type with id", async () => {
    const payload = {
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 0,
      items: [],
    };
    mockedAuthFetch.mockResolvedValueOnce(createResponse(payload));

    const result = await getTransactionsByTypeAndContactPaged("Expense", "12", 5, 2026, 1);

    expect(result).toEqual(payload);
    expect(mockedAuthFetch).toHaveBeenCalledWith(`${BASE_URL}/Transaction/GetByContact?id=12&type=Expense&month=5&year=2026&pageNumber=1`);
  });

  it("throw backend message when request fails", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({ message: "Backend falhou" }, false, 400));

    await expect(getTransactionsByTypeAndContactPaged("Income", "7", 1, 2026, 1)).rejects.toThrow("Backend falhou");
  });

  it("fallback to default error message when backend has no message", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, false, 500));

    await expect(getExpenseValue()).rejects.toThrow("Falha ao buscar despesas");
  });

  it("update transaction by id", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, true, 200));

    const result = await updateTransaction(10, {
      transactionName: "Internet",
      paid: true,
      contactName: "Contato A",
      recurrence: 4,
      description: "Conta mensal",
      amount: 120,
      type: "Expense",
      category: "Moradia",
    });

    expect(result).toBe(true);
    expect(mockedAuthFetch).toHaveBeenCalledWith(
      `${BASE_URL}/Transaction/EditTransaction?id=10`,
      expect.objectContaining({ method: "POST" }),
    );
  });
});
