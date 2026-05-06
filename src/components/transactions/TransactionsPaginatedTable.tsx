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
import type { TransactionResponse } from "@/helper/transaction";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";

const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

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
};

export function TransactionsPaginatedTable({
  transactions,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
}: TransactionsPaginatedTableProps) {
  return (
    <Card className="surface-card rounded-2xl reveal-up stagger-2">
      <CardHeader>
        <CardTitle>Transacoes ({totalRecords})</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && transactions.length === 0 ? (
          <TableLoadingState columns={11} rows={8} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead className="w-[120px]">Nome</TableHead>
                <TableHead className="w-[120px]">Descricao</TableHead>
                <TableHead className="w-[120px]">Categoria</TableHead>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead className="w-[120px]">Valor</TableHead>
                <TableHead className="w-[120px]">Email</TableHead>
                <TableHead className="w-[120px]">Nome Contato</TableHead>
                <TableHead className="w-[120px]">Telefone</TableHead>
                <TableHead className="w-[120px]">Recorrencia</TableHead>
                <TableHead className="w-[120px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11}>
                    <div className="empty-state">
                      <ReceiptText className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Nenhuma transacao encontrada</p>
                      <p className="text-xs text-muted-foreground">Ajuste os filtros ou altere o periodo para ver resultados.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="table-row-lift">
                    <TableCell className="truncate">
                      {transaction.dateOfInstallment
                        ? new Date(transaction.dateOfInstallment).toLocaleDateString("pt-BR")
                        : transaction.createdDate
                          ? new Date(transaction.createdDate).toLocaleDateString("pt-BR")
                          : "-"}
                    </TableCell>
                    <TableCell className="truncate">{transaction.name ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.description}</TableCell>
                    <TableCell className="truncate">{transaction.category?.name ?? "-"}</TableCell>
                    <TableCell className="truncate">
                      {transaction.typeTransaction === 1 ? "Despesa" : transaction.typeTransaction === 2 ? "Receita" : "-"}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${transaction.typeTransaction === 1 ? "text-destructive" : "text-success"}`}
                    >
                      {formatBRL(Number(transaction.amount) || 0)}
                    </TableCell>
                    <TableCell className="truncate">{transaction.contact?.email ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.contact?.name ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.contact?.phone ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.recurrence ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:scale-105 transition-transform"
                          aria-label="Editar transacao"
                          onClick={() => onEdit(transaction)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:scale-105 transition-transform"
                          aria-label="Excluir transacao"
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
            Pagina <span className="font-medium text-foreground">{currentPage}</span> de{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
            <span className="ml-2">
              (Total: <span className="font-medium text-foreground">{totalRecords}</span>, pageSize:{" "}
              <span className="font-medium text-foreground">{pageSize}</span>)
            </span>
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
