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
    expect(mockedAuthFetch).toHaveBeenCalledWith(`${BASE_URL}/Transaction/GetByContact?contactId=12&type=Expense&month=5&year=2026&pageNumber=1`);
  });

  it("throw mapped backend message when request fails with a known error", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({ message: "we cannot find transactions" }, false, 400));

    await expect(getTransactionsByTypeAndContactPaged("Income", "7", 1, 2026, 1)).rejects.toThrow("Nenhuma transação encontrada.");
  });

  it("throw fallback message when backend message is unknown", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({ message: "some untranslated error" }, false, 400));

    await expect(getTransactionsByTypeAndContactPaged("Income", "7", 1, 2026, 1)).rejects.toThrow(
      "Falha ao buscar transações por contato e tipo",
    );
  });

  it("fallback to default error message when backend has no message", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, false, 500));

    await expect(getExpenseValue()).rejects.toThrow("Falha ao buscar despesas");
  });

  it("update transaction by id without error", async () => {
    mockedAuthFetch.mockResolvedValueOnce(createResponse({}, true, 200));

    await expect(
      updateTransaction(10, {
        transactionName: "Internet",
        paid: true,
        contactName: "Contato A",
        recurrence: "MONTHLY",
        description: "Conta mensal",
        amount: 120,
        type: "Expense",
        category: "Moradia",
      }),
    ).resolves.toBeUndefined();

    expect(mockedAuthFetch).toHaveBeenCalledWith(
      `${BASE_URL}/Transaction/EditTransaction?id=10`,
      expect.objectContaining({ method: "POST" }),
    );
  });
});
