import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionResponse } from "@/helper/transaction";
import { formatBRL, RECURRENCE_LABEL_KEY } from "@/helper/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type TransactionsTableProps = {
  transactions: TransactionResponse[];
  onEdit: (transaction: TransactionResponse) => void;
  onDelete: (id: number) => void;
};

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  const { t } = useTranslation("transactions");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[110px]">{t("colDate")}</TableHead>
          <TableHead className="w-[220px]">{t("colDescription")}</TableHead>
          <TableHead className="w-[160px]">{t("colCategory")}</TableHead>
          <TableHead className="w-[120px]">{t("colType")}</TableHead>
          <TableHead className="w-[140px] text-right">{t("colAmount")}</TableHead>
          <TableHead className="w-[160px]">{t("colName")}</TableHead>
          <TableHead className="w-[220px]">{t("colEmail")}</TableHead>
          <TableHead className="w-[160px]">{t("colPhone")}</TableHead>
          <TableHead className="w-[90px]">{t("colRecurrence")}</TableHead>
          <TableHead className="w-[120px]">{t("colActions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="truncate">
              {transaction.competenceDate
                ? new Date(transaction.competenceDate).toLocaleDateString("pt-BR")
                : transaction.createdDate
                  ? new Date(transaction.createdDate).toLocaleDateString("pt-BR")
                  : "-"}
            </TableCell>
            <TableCell className="truncate">{transaction.description}</TableCell>
            <TableCell className="truncate">{transaction.category?.name ?? "-"}</TableCell>
            <TableCell className="truncate">
              {transaction.typeTransaction === 1 ? t("typeExpense") : transaction.typeTransaction === 2 ? t("typeIncome") : "-"}
            </TableCell>
            <TableCell className={`text-right font-medium ${transaction.typeTransaction === 1 ? "text-destructive" : "text-success"}`}>
              {formatBRL(Number(transaction.amount) || 0)}
            </TableCell>
            <TableCell className="truncate">{transaction.contact?.name ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.contact?.email ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.contact?.phone ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.recurrence && RECURRENCE_LABEL_KEY[transaction.recurrence] ? t(`recLabel.${RECURRENCE_LABEL_KEY[transaction.recurrence]}`) : (transaction.recurrence ?? "-")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" aria-label={t("editAria")} onClick={() => onEdit(transaction)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label={t("deleteAria")} onClick={() => onDelete(transaction.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
