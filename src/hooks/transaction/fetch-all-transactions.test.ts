import type { PagedTransactionsResponse } from "@/helper/transaction";
import { getAllTransactionsPaged } from "@/services/transaction";
import { fetchAllTransactions } from "./use-get-transactions";

vi.mock("@/services/transaction", () => ({
  getAllTransactionsPaged: vi.fn(),
  getTransactionsByTypePaged: vi.fn(),
  getTransactionsByCategoryPaged: vi.fn(),
  getTransactionsByTypeAndContactPaged: vi.fn(),
}));

const mockedGetAll = vi.mocked(getAllTransactionsPaged);

function page(items: number[], pageNumber: number, totalRecords: number): PagedTransactionsResponse {
  return {
    pageNumber,
    pageSize: 2,
    totalRecords,
    items: items.map((id) => ({ id, recurrence: 4, description: "d", amount: id, typeTransaction: 1, contact: {}, category: {} })),
  } as unknown as PagedTransactionsResponse;
}

describe("fetchAllTransactions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches and flattens every page, normalizing recurrence", async () => {
    mockedGetAll.mockResolvedValueOnce(page([1, 2], 1, 3)).mockResolvedValueOnce(page([3], 2, 3));

    const result = await fetchAllTransactions({ kind: "all", month: 6, year: 2026 });

    expect(result).toHaveLength(3);
    expect(mockedGetAll).toHaveBeenCalledTimes(2);
    expect(result[0].recurrence).toBe("Mensal");
  });

  it("returns a single page without extra requests", async () => {
    mockedGetAll.mockResolvedValueOnce(page([1], 1, 1));

    const result = await fetchAllTransactions({ kind: "all", month: 6, year: 2026 });

    expect(result).toHaveLength(1);
    expect(mockedGetAll).toHaveBeenCalledTimes(1);
  });
});
