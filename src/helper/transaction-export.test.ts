import type { TransactionResponse } from "@/helper/transaction";
import { buildTransactionsCsv, TRANSACTION_CSV_HEADERS, transactionToCsvRow } from "./transaction-export";

const income: TransactionResponse = {
  id: 1,
  name: "Salário",
  description: "Pagamento",
  amount: 1234.5,
  recurrence: "Mensal",
  typeTransaction: 2,
  paid: true,
  competenceDate: "2026-07-15",
  contact: { id: 9, name: "Empresa" },
  category: { id: 7, name: "Salário" },
};

describe("transaction CSV export", () => {
  it("maps a transaction to a row", () => {
    const row = transactionToCsvRow(income);
    expect(row[1]).toBe("Salário");
    expect(row[3]).toBe("Salário");
    expect(row[4]).toBe("Receita");
    expect(row[5]).toBe("1234,50");
    expect(row[6]).toBe("Empresa");
    expect(row[8]).toBe("Sim");
  });

  it("labels expenses and unpaid transactions", () => {
    const row = transactionToCsvRow({ ...income, typeTransaction: 1, paid: false });
    expect(row[4]).toBe("Despesa");
    expect(row[8]).toBe("Não");
  });

  it("formats the competence date without a timezone shift", () => {
    expect(transactionToCsvRow(income)[0]).toBe("15/07/2026");
  });

  it("falls back to created date and to empty when no date is present", () => {
    expect(transactionToCsvRow({ ...income, competenceDate: undefined, createdDate: "2026-01-05" })[0]).toBe("05/01/2026");
    expect(transactionToCsvRow({ ...income, competenceDate: undefined, createdDate: undefined })[0]).toBe("");
  });

  it("defaults a missing amount to 0,00", () => {
    expect(transactionToCsvRow({ ...income, amount: undefined as unknown as number })[5]).toBe("0,00");
  });

  it("builds CSV with the header row first", () => {
    const [header] = buildTransactionsCsv([income]).split("\r\n");
    expect(header).toBe(TRANSACTION_CSV_HEADERS.join(";"));
  });
});
