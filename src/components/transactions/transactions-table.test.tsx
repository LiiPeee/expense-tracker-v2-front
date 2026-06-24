import type { TransactionResponse } from "@/helper/transaction";
import { render, screen } from "@testing-library/react";
import { TransactionsTable } from "./TransactionsTable";

const baseTransaction: TransactionResponse = {
  id: 1,
  description: "Compra",
  amount: 100,
  recurrence: "Não",
  typeTransaction: 1,
  contact: { id: 9, name: "Loja", email: "loja@mail.com", phone: "11999" },
  category: { id: 6, name: "Lazer" },
};

describe("TransactionsTable date column", () => {
  it("renders the competence date when present", () => {
    const competenceDate = "2026-07-15";
    const expected = new Date(competenceDate).toLocaleDateString("pt-BR");
    render(<TransactionsTable transactions={[{ ...baseTransaction, competenceDate }]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("falls back to a dash when there is no date", () => {
    render(<TransactionsTable transactions={[baseTransaction]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
