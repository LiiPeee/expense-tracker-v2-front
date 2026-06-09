import { type Contact } from "@/helper/contact";
import type { PagedTransactionsResponse, TransactionResponse } from "@/helper/transaction";
import { getAllContacts } from "@/services/contact";
import { deleteTransactions, getAllTransactionsPaged, getEconomy, getExpenseValue, getIncomeValue } from "@/services/transaction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import Transactions from "./Transactions";
import TransactionsList from "./TransactionsList";

vi.mock("@/services/contact", () => ({
  getAllContacts: vi.fn(async () => []),
  createContact: vi.fn(async () => true),
  editContact: vi.fn(async () => true),
  deleteContact: vi.fn(async () => undefined),
}));

vi.mock("@/services/transaction", async () => {
  const actual = await vi.importActual<typeof import("@/services/transaction")>("@/services/transaction");
  return {
    ...actual,
    getAllTransactionsPaged: vi.fn(),
    getExpenseValue: vi.fn(async () => 0),
    getIncomeValue: vi.fn(async () => 0),
    getEconomy: vi.fn(async () => 0),
    deleteTransactions: vi.fn(async () => undefined),
    createTransaction: vi.fn(async () => undefined),
    getTransactionsByTypePaged: vi.fn(),
    getTransactionsByTypeAndContactPaged: vi.fn(),
    getTransactionsByCategoryPaged: vi.fn(),
    getTransactionsByMonthAndYear: vi.fn(),
  };
});

const mockedGetAllContacts = vi.mocked(getAllContacts);
const mockedGetAllTransactionsPaged = vi.mocked(getAllTransactionsPaged);
const mockedDeleteTransactions = vi.mocked(deleteTransactions);
const mockedGetExpenseValue = vi.mocked(getExpenseValue);
const mockedGetIncomeValue = vi.mocked(getIncomeValue);
const mockedGetEconomy = vi.mocked(getEconomy);

const baseTransaction: TransactionResponse = {
  id: 1,
  name: "Salario",
  description: "Pagamento",
  amount: "1000",
  recurrence: "Não",
  typeTransaction: 2,
  contact: {
    id: 99,
    name: "Contato A",
    email: "a@mail.com",
    phone: "1199999-9999",
  },
  category: {
    id: 7,
    name: "Salário",
  },
};

const baseContact: Contact = {
  id: 99,
  name: "Contato A",
  email: "a@mail.com",
  phone: "1199999-9999",
};

function createPaged(
  transactions: TransactionResponse[],
  pageNumber = 1,
  pageSize = 10,
  totalRecords = transactions.length,
): PagedTransactionsResponse {
  return {
    pageNumber,
    pageSize,
    totalRecords,
    items: transactions,
  };
}

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

describe("transactions pages flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAllContacts.mockResolvedValue([baseContact]);
    mockedGetAllTransactionsPaged.mockResolvedValue(createPaged([baseTransaction]));
    mockedGetExpenseValue.mockResolvedValue(100);
    mockedGetIncomeValue.mockResolvedValue(300);
    mockedGetEconomy.mockResolvedValue(200);
  });

  it("Transactions new button triggers contact preload flow", async () => {
    renderWithProviders(<Transactions />);

    await waitFor(() => {
      expect(mockedGetAllTransactionsPaged).toHaveBeenCalledWith(1);
    });

    mockedGetAllContacts.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Nova Transacao" }));

    await waitFor(() => {
      expect(mockedGetAllContacts).toHaveBeenCalledTimes(1);
    });
  });

  it("Transactions table supports edit and delete flows", async () => {
    renderWithProviders(<Transactions />);

    await waitFor(() => {
      expect(mockedGetAllTransactionsPaged).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByLabelText("Editar transacao"));
    expect(screen.getByText("Editar Transacao")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Excluir transacao"));

    await waitFor(() => {
      expect(mockedDeleteTransactions).toHaveBeenCalledWith(baseTransaction.id);
    });
  });

  it("TransactionsList applies default query and paginates", async () => {
    mockedGetAllTransactionsPaged
      .mockResolvedValueOnce(createPaged([baseTransaction], 1, 10, 12))
      .mockResolvedValueOnce(createPaged([baseTransaction], 2, 10, 12));

    renderWithProviders(<TransactionsList />);

    await waitFor(() => {
      expect(mockedGetAllTransactionsPaged).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Consulta por Filtros" }));
    await waitFor(() => {
      expect(mockedGetAllTransactionsPaged).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole("link", { name: "2" }));
    await waitFor(() => {
      expect(mockedGetAllTransactionsPaged).toHaveBeenCalledWith(2);
    });
  });
});
