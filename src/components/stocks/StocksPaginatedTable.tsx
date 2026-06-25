import { StockAvatar } from "@/components/stocks/StockAvatar";
import { TableLoadingState } from "@/components/ui/async-state";
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
import { type StockResponse } from "@/helper/stock";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

type StocksPaginatedTableProps = {
  stocks: StockResponse[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

function isPositive(percentage: string): boolean {
  return !percentage.startsWith("-");
}

export function StocksPaginatedTable({
  stocks,
  currentPage,
  totalPages,
  totalRecords,
  isLoading = false,
  onPageChange,
}: StocksPaginatedTableProps) {
  const { t } = useTranslation("stocks");

  return (
    <Card className="surface-card rounded-2xl reveal-up stagger-2">
      <CardHeader>
        <CardTitle>
          {t("tableTitle")} ({totalRecords})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && stocks.length === 0 ? (
          <TableLoadingState columns={4} rows={6} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">{t("columnTicker")}</TableHead>
                <TableHead className="w-[110px] text-right">{t("columnQuantity")}</TableHead>
                <TableHead className="w-[160px] text-right">{t("columnMarketPrice")}</TableHead>
                <TableHead className="w-[160px] text-right">{t("columnBuyPrice")}</TableHead>
                <TableHead className="w-[140px] text-right">{t("columnChange")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="empty-state">
                      <TrendingUp className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
                      <p className="text-xs text-muted-foreground">{t("emptySubtitle")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock) => {
                  const positive = isPositive(stock.percentage);
                  return (
                    <TableRow key={stock.ticker} className="table-row-lift">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StockAvatar ticker={stock.ticker} />
                          <span className="font-semibold">{stock.ticker}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{stock.quantity}</TableCell>
                      <TableCell className="text-right">
                        {stock.priceMarket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell className="text-right">
                        {stock.priceBuyed.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${positive ? "text-success" : "text-destructive"}`}>
                        <span className="inline-flex items-center justify-end gap-1">
                          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {stock.percentage}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
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
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.max(1, currentPage - 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
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
                  onClick={(e) => {
                    e.preventDefault();
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
