import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { HideValuesToggle } from "@/components/layout/HideValuesToggle";
import { StockFormDialog } from "@/components/stocks/StockFormDialog";
import { StocksPaginatedTable } from "@/components/stocks/StocksPaginatedTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useHideValues } from "@/contexts/hide-values-context";
import { parseCdiRateInput, type CdbHistoryPreset } from "@/helper/cdi";
import { canViewCdiHistory, type StockResponse } from "@/helper/stock";
import { useCreateStock } from "@/hooks/stock/use-create-stock";
import { usePortfolioAllocation } from "@/hooks/stock/use-portfolio-allocation";
import { useStocksList } from "@/hooks/stock/use-stocks-query";
import { useCurrentCdiRate } from "@/hooks/use-cdi-rate";
import { useProductTour } from "@/hooks/use-product-tour";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Stocks = () => {
  const { t } = useTranslation("stocks");
  const { isHidden } = useHideValues();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [cdiRateInput, setCdiRateInput] = useCurrentCdiRate();
  const today = useMemo(() => new Date(), []);
  const cdiAnnualRate = parseCdiRateInput(cdiRateInput) ?? 0;

  const { isDialogOpen, onOpenChange, submitStock } = useCreateStock();
  const { stocks, currentPage: serverPage, totalPages, totalRecords, isLoading, isRefreshing } = useStocksList(currentPage, cdiAnnualRate, today);
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

  const handleViewHistory = (stock: StockResponse) => {
    if (!canViewCdiHistory(stock)) return;
    const preset: CdbHistoryPreset = {
      ticker: stock.ticker,
      principal: stock.priceBuyed * stock.quantity,
      cdbRate: stock.cdiRate,
      investmentDate: stock.investmentDate,
    };
    navigate("/cdb-history", { state: preset });
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

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <RefreshAllButton isRefreshing={isLoading || isRefreshing || isLoadingAllocation} onRefresh={handleRefresh} />
          <HideValuesToggle className="rounded-xl border border-glass bg-card/70" />

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="currentCdiRate" className="text-sm text-muted-foreground">
              {t("currentCdiRateLabel")}
            </label>
            <div className="relative w-24">
              <Input
                id="currentCdiRate"
                className="pr-7 rounded-xl border-glass bg-card/70"
                value={cdiRateInput}
                onChange={(e) => setCdiRateInput(e.target.value)}
                title={t("currentCdiRateHint")}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
            </div>
          </div>
        </div>

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
                <ExpensePieChart data={rendaVariavel} totalExpense={totalRV} layout="side" isHidden={isHidden} />
              )}
            </CardContent>
          </Card>

          <Card className="surface-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("rendaFixaTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAllocation ? (
                <LoadingStateCard className="h-64" lines={4} />
              ) : allocationError ? (
                <ErrorStateCard message={allocationError} onRetry={refetchAllocation} className="h-64" />
              ) : (
                <ExpensePieChart data={rendaFixa} totalExpense={totalRF} layout="side" isHidden={isHidden} />
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
              <ExpensePieChart data={overview} totalExpense={totalValue} layout="side" isHidden={isHidden} />
            )}
          </CardContent>
        </Card>

        <StocksPaginatedTable
          stocks={stocks}
          currentPage={serverPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
          isHidden={isHidden}
          onPageChange={setCurrentPage}
          onViewHistory={handleViewHistory}
        />
      </main>
    </div>
  );
};

export default Stocks;
