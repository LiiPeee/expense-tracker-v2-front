import type { PagedStocksResponse } from "@/helper/stock";
import { getAllStocks } from "@/services/stock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Stocks from "./Stocks";

vi.mock("@/services/stock", () => ({
  getAllStocks: vi.fn(),
  createStock: vi.fn(async () => undefined),
}));

const mockedGetAllStocks = vi.mocked(getAllStocks);

function renderStocks() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Stocks />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Stocks page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the translated title and the assets total", async () => {
    mockedGetAllStocks.mockResolvedValue({
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 1,
      items: [{ ticker: "PETR4", priceMarket: 40, priceBuyed: 30, percentage: "33.33%" }],
    } as PagedStocksResponse);

    renderStocks();

    expect(await screen.findByText("PETR4")).toBeInTheDocument();
    expect(screen.getByText("Minha Carteira")).toBeInTheDocument();
    // totalLabel must interpolate the value (regression guard for the {{value}} key)
    expect(screen.getByText(/Total: 1/)).toBeInTheDocument();
  });
});
