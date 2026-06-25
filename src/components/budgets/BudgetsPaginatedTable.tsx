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
import type { BudgetLimit, BudgetUsageStatus } from "@/helper/budget";
import { formatBudgetMonthYear, getBudgetCategoryName, getBudgetUsageStatus, parseBudgetPercentage } from "@/helper/budget";
import { formatBRL } from "@/helper/utils";
import { PiggyBank } from "lucide-react";
import { useTranslation } from "react-i18next";

const USAGE_BAR_COLOR: Record<BudgetUsageStatus, string> = {
  over: "bg-destructive",
  warning: "bg-amber-400",
  ok: "bg-success",
};

function BudgetProgressBar({ percentage }: { percentage: BudgetLimit["percentage"] }) {
  const pct = parseBudgetPercentage(percentage);
  if (pct == null) return <span className="text-muted-foreground text-sm">—</span>;

  const clamped = Math.min(Math.max(pct, 0), 100);
  const color = USAGE_BAR_COLOR[getBudgetUsageStatus(pct)];

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

function BudgetStatusBadge({ budget }: { budget: BudgetLimit }) {
  const { t } = useTranslation("budgets");
  const status = getBudgetUsageStatus(budget.percentage);

  if (status === "over") {
    return (
      <Badge variant="default" className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">
        {t("statusOver")}
      </Badge>
    );
  }

  if (status === "warning") {
    return (
      <Badge variant="default" className="bg-amber-400/15 text-amber-600 border-amber-400/30 hover:bg-amber-400/20">
        {t("statusWarning")}
      </Badge>
    );
  }

  if (budget.isLimit) {
    return (
      <Badge variant="default" className="bg-success/15 text-success border-success/30 hover:bg-success/20">
        {t("statusActive")}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-muted-foreground">
      {t("statusInactive")}
    </Badge>
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
  isLoading = false,
  onPageChange,
}: BudgetsPaginatedTableProps) {
  const { t } = useTranslation("budgets");
  return (
    <Card className="surface-card rounded-2xl reveal-up stagger-2">
      <CardHeader>
        <CardTitle>{t("tableTitle")} ({totalRecords})</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && budgets.length === 0 ? (
          <TableLoadingState columns={5} rows={8} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("colPeriod")}</TableHead>
                <TableHead className="text-right">{t("limit")}</TableHead>
                <TableHead className="text-right">{t("colUsage")}</TableHead>
                <TableHead className="text-center">{t("colStatus")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="empty-state">
                      <PiggyBank className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
                      <p className="text-xs text-muted-foreground">{t("emptySubtitle")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                budgets.map((budget) => (
                  <TableRow key={`${budget.id ?? getBudgetCategoryName(budget)}-${budget.month}-${budget.year}`} className="table-row-lift">
                    <TableCell className="font-medium">{budget.category?.name?.trim() || t("noCategory")}</TableCell>
                    <TableCell className="text-muted-foreground">{formatBudgetMonthYear(budget)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatBRL(Number(budget.limitAmount) || 0)}</TableCell>
                    <TableCell className="text-right">
                      <BudgetProgressBar percentage={budget.percentage} />
                    </TableCell>
                    <TableCell className="text-center">
                      <BudgetStatusBadge budget={budget} />
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
            {" · "}
            {t("records", { value: totalRecords })}
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
