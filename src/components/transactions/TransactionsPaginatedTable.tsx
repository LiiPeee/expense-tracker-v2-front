import { TableLoadingState } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TRANSACTION_TYPE, type TransactionResponse } from "@/helper/transaction";
import { formatBRL, RECURRENCE_LABEL_KEY } from "@/helper/utils";
import { CircleCheck, CircleX, Pencil, ReceiptText, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const TABLE_COLUMN_COUNT = 10;

type TransactionsPaginatedTableProps = {
  transactions: TransactionResponse[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (transaction: TransactionResponse) => void;
  onDelete: (id: number) => void;
  onTogglePaid: (transaction: TransactionResponse) => void;
};

export function TransactionsPaginatedTable({
  transactions,
  currentPage,
  totalPages,
  totalRecords,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onTogglePaid,
}: TransactionsPaginatedTableProps) {
  const { t } = useTranslation("transactions");
  return (
    <Card className="surface-card rounded-2xl reveal-up stagger-2">
      <CardHeader>
        <CardTitle>{t("tableTitle")} ({totalRecords})</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && transactions.length === 0 ? (
          <TableLoadingState columns={TABLE_COLUMN_COUNT} rows={8} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{t("colDate")}</TableHead>
                <TableHead className="w-[120px]">{t("colName")}</TableHead>
                <TableHead className="w-[120px]">{t("colCategory")}</TableHead>
                <TableHead className="w-[120px]">{t("colType")}</TableHead>
                <TableHead className="w-[120px]">{t("colAmount")}</TableHead>
                <TableHead className="w-[120px]">{t("colStatus")}</TableHead>
                <TableHead className="w-[120px]">{t("colContactName")}</TableHead>
                <TableHead className="w-[120px]">{t("colRecurrence")}</TableHead>
                <TableHead className="w-[100px]">{t("colInstallments")}</TableHead>
                <TableHead className="w-[150px]">{t("colActions")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMN_COUNT}>
                    <div className="empty-state">
                      <ReceiptText className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
                      <p className="text-xs text-muted-foreground">{t("emptySubtitle")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="table-row-lift">
                    <TableCell className="truncate">
                      {transaction.competenceDate
                        ? new Date(transaction.competenceDate).toLocaleDateString("pt-BR")
                        : transaction.createdDate
                          ? new Date(transaction.createdDate).toLocaleDateString("pt-BR")
                          : "-"}
                    </TableCell>
                    <TableCell className="truncate">{transaction.name ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.category?.name ?? "-"}</TableCell>
                    <TableCell className="truncate">
                      {transaction.typeTransaction === TRANSACTION_TYPE.EXPENSE
                        ? t("typeExpense")
                        : transaction.typeTransaction === TRANSACTION_TYPE.INCOME
                          ? t("typeIncome")
                          : "-"}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${transaction.typeTransaction === TRANSACTION_TYPE.EXPENSE ? "text-destructive" : "text-success"}`}
                    >
                      {formatBRL(Number(transaction.amount) || 0)}
                    </TableCell>
                    <TableCell className="truncate">{transaction.paid === true ? t("yes") : transaction.paid === false ? t("no") : "-"}</TableCell>
                    <TableCell className="truncate">{transaction.contact?.name ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.recurrence && RECURRENCE_LABEL_KEY[transaction.recurrence] ? t(`recLabel.${RECURRENCE_LABEL_KEY[transaction.recurrence]}`) : (transaction.recurrence ?? "-")}</TableCell>
                    <TableCell className="truncate">{transaction.quantityOfInstallment ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:scale-105 transition-transform"
                          aria-label={transaction.paid === true ? t("markUnpaidAria") : t("markPaidAria")}
                          onClick={() => onTogglePaid(transaction)}
                        >
                          {transaction.paid === true ? (
                            <CircleX className="w-4 h-4 text-destructive" />
                          ) : (
                            <CircleCheck className="w-4 h-4 text-success" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:scale-105 transition-transform"
                          aria-label={t("editAria")}
                          onClick={() => onEdit(transaction)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:scale-105 transition-transform"
                          aria-label={t("deleteAria")}
                          onClick={() => onDelete(transaction.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {t("pagination", { current: currentPage, total: totalPages })}
            <span className="ml-2">({t("totalLabel", { value: totalRecords })})</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(Math.max(1, currentPage - 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(Math.min(totalPages, currentPage + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
