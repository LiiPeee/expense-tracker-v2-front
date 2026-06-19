import { TableLoadingState } from "@/components/ui/async-state";
import { Badge } from "@/components/ui/badge";
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
import type { BudgetLimit } from "@/helper/budget";
import { formatBudgetMonthYear, getBudgetCategoryName } from "@/helper/budget";
import { formatBRL } from "@/helper/utils";
import { PiggyBank } from "lucide-react";

function parsePct(value: BudgetLimit["percentage"]): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

function BudgetProgressBar({ percentage }: { percentage: BudgetLimit["percentage"] }) {
  const pct = parsePct(percentage);
  if (pct == null) return <span className="text-muted-foreground text-sm">—</span>;

  const clamped = Math.min(Math.max(pct, 0), 100);
  const color =
    clamped >= 90 ? "bg-destructive" : clamped >= 70 ? "bg-amber-400" : "bg-success";

  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-sm font-medium tabular-nums w-10 text-right">{pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</span>
      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

type BudgetsPaginatedTableProps = {
  budgets: BudgetLimit[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export function BudgetsPaginatedTable({
  budgets,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  isLoading = false,
  onPageChange,
}: BudgetsPaginatedTableProps) {
  return (
    <Card className="surface-card rounded-2xl reveal-up stagger-2">
      <CardHeader>
        <CardTitle>Orçamentos ({totalRecords})</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && budgets.length === 0 ? (
          <TableLoadingState columns={5} rows={8} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Limite</TableHead>
                <TableHead className="text-right">Uso</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="empty-state">
                      <PiggyBank className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Nenhum orçamento encontrado</p>
                      <p className="text-xs text-muted-foreground">Crie um orçamento ou ajuste o filtro para visualizar resultados.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                budgets.map((budget) => (
                  <TableRow key={`${budget.id ?? getBudgetCategoryName(budget)}-${budget.month}-${budget.year}`} className="table-row-lift">
                    <TableCell className="font-medium">{getBudgetCategoryName(budget)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatBudgetMonthYear(budget)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatBRL(Number(budget.limitAmount) || 0)}</TableCell>
                    <TableCell className="text-right">
                      <BudgetProgressBar percentage={budget.percentage} />
                    </TableCell>
                    <TableCell className="text-center">
                      {budget.isLimit ? (
                        <Badge variant="default" className="bg-success/15 text-success border-success/30 hover:bg-success/20">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Página <span className="font-medium text-foreground">{currentPage}</span> de{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
            {" · "}
            <span className="font-medium text-foreground">{totalRecords}</span> registros
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
