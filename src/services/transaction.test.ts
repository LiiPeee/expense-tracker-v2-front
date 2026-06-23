import { BASE_URL } from "@/lib/api";
import { createJsonResponse } from "@/test/response";
import { getExpenseValue, getTransactionsByTypeAndContactPaged, updateTransaction } from "./transaction";

const fetchMock = vi.fn();

describe("transaction service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("request transactions by contact and type with id", async () => {
    const payload = {
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 0,
      items: [],
    };
    fetchMock.mockResolvedValueOnce(createJsonResponse(payload));

    const result = await getTransactionsByTypeAndContactPaged("Expense", "12", 5, 2026, 1);

    expect(result).toEqual(payload);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/Transaction/GetByContact?contactId=12&type=Expense&month=5&year=2026&pageNumber=1`);
  });

  it("throw mapped backend message when request fails with a known error", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: "we cannot find transactions" }, false, 400));

    await expect(getTransactionsByTypeAndContactPaged("Income", "7", 1, 2026, 1)).rejects.toThrow("Nenhuma transação encontrada.");
  });

  it("throw fallback message when backend message is unknown", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: "some untranslated error" }, false, 400));

    await expect(getTransactionsByTypeAndContactPaged("Income", "7", 1, 2026, 1)).rejects.toThrow(
      "Falha ao buscar transações por contato e tipo",
    );
  });

  it("fallback to default error message when backend has no message", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, false, 500));

    await expect(getExpenseValue()).rejects.toThrow("Falha ao buscar despesas");
  });

  it("update transaction by id without error", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, true, 200));

    await expect(
      updateTransaction(10, {
        transactionName: "Internet",
        paid: true,
        contactName: "Contato A",
        recurrence: "Mensal",
        description: "Conta mensal",
        amount: 120,
        type: "Expense",
        category: "Moradia",
      }),
    ).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/Transaction/EditTransaction?id=10`);
    expect(init.method).toBe("POST");
  });
});
