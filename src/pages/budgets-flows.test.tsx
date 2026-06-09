import { USER_KEY } from "@/lib/api";
import { createBudgetLimit, getAllBudgetLimitsByAccount } from "@/services/budget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import Budgets from "./Budgets";

vi.mock("@/services/budget", () => ({
  createBudgetLimit: vi.fn(async () => undefined),
  getAllBudgetLimitsByAccount: vi.fn(),
}));

const mockedCreateBudgetLimit = vi.mocked(createBudgetLimit);
const mockedGetAllBudgetLimitsByAccount = vi.mocked(getAllBudgetLimitsByAccount);

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("budgets page flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(USER_KEY, JSON.stringify({ id: "7", email: "dev@test.com", name: "Dev" }));

    mockedGetAllBudgetLimitsByAccount.mockResolvedValue(
      Array.from({ length: 11 }, (_, index) => ({
        id: index + 1,
        month: index === 10 ? 2 : 1,
        year: 2026,
        accountId: 7,
        limitAmount: index === 10 ? 999 : 100 + index,
        percentage: index + 1,
        isLimit: index % 2 === 0,
        category: {
          id: index + 1,
          name: index === 10 ? "Saúde" : index === 0 ? "Alimentação" : `Moradia ${index + 1}`,
        },
      })),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("loads budgets by account, filters by name and category, and paginates", async () => {
    renderWithProviders(<Budgets />);

    await waitFor(() => {
      expect(mockedGetAllBudgetLimitsByAccount).toHaveBeenCalledWith(7);
    });

    expect(await screen.findByText("Alimentação")).toBeInTheDocument();
    expect(screen.queryByText("Saúde")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "2" }));

    await waitFor(() => {
      expect(screen.getByText("Saúde")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filtrar por nome"), { target: { value: "Saú" } });

    await waitFor(() => {
      expect(screen.getByText("Saúde")).toBeInTheDocument();
      expect(screen.queryByText("Alimentação")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filtrar por nome"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar por categoria" }));
    fireEvent.click(await screen.findByText("Alimentação"));

    await waitFor(() => {
      expect(screen.getByText("Alimentação")).toBeInTheDocument();
      expect(screen.queryByText("Saúde")).not.toBeInTheDocument();
    });
  });

  it("opens the budget creation flow from the header action", async () => {
    renderWithProviders(<Budgets />);

    await waitFor(() => {
      expect(mockedGetAllBudgetLimitsByAccount).toHaveBeenCalledWith(7);
    });

    fireEvent.click(screen.getByRole("button", { name: "Novo Orçamento" }));

    expect(await screen.findByRole("heading", { name: "Novo Orçamento" })).toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Mês")).toBeInTheDocument();
    expect(screen.getByLabelText("Ano")).toBeInTheDocument();
    expect(screen.getByLabelText("Limite")).toBeInTheDocument();
    expect(mockedCreateBudgetLimit).not.toHaveBeenCalled();
  });
});
