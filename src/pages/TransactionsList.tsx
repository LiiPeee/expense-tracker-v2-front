import { Header } from "@/components/layout/Header";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionsFiltersCard } from "@/components/transactions/TransactionsFiltersCard";
import { TransactionsPaginatedTable } from "@/components/transactions/TransactionsPaginatedTable";
import { TransactionsSummaryCards } from "@/components/transactions/TransactionsSummaryCards";
import { LoadingButton } from "@/components/ui/loading-button";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { TRANSACTION_CATEGORY_OPTIONS } from "@/constants/transaction-categories";
import { downloadCsv } from "@/helper/csv";
import type { TransactionForm } from "@/helper/transaction";
import { buildTransactionsCsv } from "@/helper/transaction-export";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useFinancialSummary } from "@/hooks/transaction/use-financial-summary";
import { fetchAllTransactions, useTransactionsList } from "@/hooks/transaction/use-get-transactions";
import { useTransactionFilters } from "@/hooks/transaction/use-transaction-filters";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const TransactionsList = () => {
  const { t } = useTranslation("transactions");
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { handleDelete, handleEdit, submitTransaction, onOpenChange, transactionDefaults, editingTransaction, isDialogOpen } =
    useTransaction();

  const { contacts, getAllContact } = useContact();

  const {
    month,
    year,
    filterCategory,
    filterType,
    filterContact,
    setMonth,
    setYear,
    setFilterCategory,
    setFilterType,
    setFilterContact,
    transactionQuery,
    currentPage,
    activePeriod,
    applyFilters,
    goToPage,
    resetToFirstPage,
  } = useTransactionFilters();

  const {
    expenseMonthTotal,
    incomeMonthTotal,
    economyMonthTotal,
    isFetching: isSummaryFetching,
  } = useFinancialSummary(activePeriod.month, activePeriod.year);

  const {
    transactions,
    currentPage: serverPage,
    totalPages,
    totalRecords,
    pageSize,
    isRefreshing,
  } = useTransactionsList(transactionQuery, currentPage);

  const handleRefresh = async () => {
    try {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["transactions"] }), getAllContact()]);
      toast.success(t("refreshSuccess"));
    } catch {
      toast.error(t("refreshError"));
    }
  };

  const handleApplyFilters = () => {
    applyFilters();
    void queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const handleSubmitAndRefresh = async (data: TransactionForm) => {
    await submitTransaction(data);
    resetToFirstPage();
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const allTransactions = await fetchAllTransactions(transactionQuery);
      if (allTransactions.length === 0) {
        toast.info(t("nothingToExport"));
        return;
      }
      downloadCsv(
        `transacoes-${activePeriod.year}-${String(activePeriod.month).padStart(2, "0")}.csv`,
        buildTransactionsCsv(allTransactions),
      );
      toast.success(t("exportDone"));
    } catch {
      toast.error(t("exportError"));
    } finally {
      setIsExporting(false);
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

          <TransactionFormDialog
            open={isDialogOpen}
            onOpenChange={onOpenChange}
            onPrepareNew={() => void getAllContact()}
            onSubmit={handleSubmitAndRefresh}
            contacts={contacts}
            editingTransaction={editingTransaction}
            defaultValues={transactionDefaults}
            categoryOptions={TRANSACTION_CATEGORY_OPTIONS}
          />
        </div>

        <TransactionsSummaryCards
          incomeMonthTotal={incomeMonthTotal}
          expenseMonthTotal={expenseMonthTotal}
          economyMonthTotal={economyMonthTotal}
        />

        <div className="flex flex-wrap items-center gap-3">
          <RefreshAllButton isRefreshing={isRefreshing || isSummaryFetching} onRefresh={handleRefresh} />
          <LoadingButton
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={handleExportCsv}
            isLoading={isExporting}
            loadingText={t("exporting")}
            disabled={totalRecords === 0}
          >
            <Download className="h-4 w-4" />
            {t("exportCsv")}
          </LoadingButton>
        </div>

        <TransactionsFiltersCard
          month={month}
          year={year}
          filterCategory={filterCategory}
          filterType={filterType}
          filterContact={filterContact}
          contacts={contacts}
          onChangeMonth={setMonth}
          onChangeYear={setYear}
          onChangeCategory={setFilterCategory}
          onChangeType={setFilterType}
          onChangeContact={setFilterContact}
          onApplyFilters={handleApplyFilters}
        />

        <TransactionsPaginatedTable
          transactions={transactions}
          currentPage={serverPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          isLoading={isRefreshing}
          onPageChange={goToPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default TransactionsList;
