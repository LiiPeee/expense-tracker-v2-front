import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { StockFormDialog } from "@/components/stocks/StockFormDialog";
import { StocksPaginatedTable } from "@/components/stocks/StocksPaginatedTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useCreateStock } from "@/hooks/stock/use-create-stock";
import { usePortfolioAllocation } from "@/hooks/stock/use-portfolio-allocation";
import { useStocksList } from "@/hooks/stock/use-stocks-query";
import { useProductTour } from "@/hooks/use-product-tour";
import { useQueryClient } from "@tanstack/react-query";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Stocks = () => {
  const { t } = useTranslation("stocks");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { isDialogOpen, onOpenChange, submitStock } = useCreateStock();
  const { stocks, currentPage: serverPage, totalPages, totalRecords, isLoading, isRefreshing } = useStocksList(currentPage);
  const {
    rendaVariavel,
    rendaFixa,
    overview,
    totalRV,
    totalRF,
    totalValue,
    isLoading: isLoadingAllocation,
    error: allocationError,
    refetch: refetchAllocation,
  } = usePortfolioAllocation();

  useProductTour("stocks");

  const handleRefresh = async () => {
    try {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["stocks"] }), refetchAllocation()]);
      toast.success(t("refreshSuccess"));
    } catch {
      toast.error(t("refreshError"));
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium flex-1 mr-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{t("pageTitle")}</h2>
            <p className="text-muted-foreground text-base">{t("pageSubtitle")}</p>
          </div>

          <div data-tour="new-asset">
            <StockFormDialog open={isDialogOpen} onOpenChange={onOpenChange} onSubmit={submitStock} />
          </div>
        </div>

        <RefreshAllButton isRefreshing={isLoading || isRefreshing || isLoadingAllocation} onRefresh={handleRefresh} />

        <div data-tour="allocation-chart" className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="surface-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("rendaVariavelTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAllocation ? (
                <LoadingStateCard className="h-64" lines={4} />
              ) : allocationError ? (
                <ErrorStateCard message={allocationError} onRetry={refetchAllocation} className="h-64" />
              ) : (
                <ExpensePieChart data={rendaVariavel} totalExpense={totalRV} layout="side" />
              )}
            </CardContent>
          </Card>

          <Card className="surface-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">{t("rendaFixaTitle")}</CardTitle>
              <Link to="/cdi-calculator">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                  <Calculator className="w-3.5 h-3.5" />
                  {t("cdiCalculatorLink")}
                </button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingAllocation ? (
                <LoadingStateCard className="h-64" lines={4} />
              ) : allocationError ? (
                <ErrorStateCard message={allocationError} onRetry={refetchAllocation} className="h-64" />
              ) : (
                <ExpensePieChart data={rendaFixa} totalExpense={totalRF} layout="side" />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="surface-card rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t("overviewTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAllocation ? (
              <LoadingStateCard className="h-64" lines={4} />
            ) : allocationError ? (
              <ErrorStateCard message={allocationError} onRetry={refetchAllocation} className="h-64" />
            ) : (
              <ExpensePieChart data={overview} totalExpense={totalValue} layout="side" />
            )}
          </CardContent>
        </Card>

        <StocksPaginatedTable
          stocks={stocks}
          currentPage={serverPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default Stocks;
