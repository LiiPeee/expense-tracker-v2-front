import { Header } from "@/components/layout/Header";
import { StockFormDialog } from "@/components/stocks/StockFormDialog";
import { StocksPaginatedTable } from "@/components/stocks/StocksPaginatedTable";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useCreateStock } from "@/hooks/stock/use-create-stock";
import { useStocksList } from "@/hooks/stock/use-stocks-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const Stocks = () => {
  const { t } = useTranslation("stocks");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { isDialogOpen, onOpenChange, submitStock } = useCreateStock();
  const { stocks, currentPage: serverPage, totalPages, totalRecords, isLoading, isRefreshing } = useStocksList(currentPage);

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["stocks"] });
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

          <StockFormDialog open={isDialogOpen} onOpenChange={onOpenChange} onSubmit={submitStock} />
        </div>

        <RefreshAllButton isRefreshing={isLoading || isRefreshing} onRefresh={handleRefresh} />

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
