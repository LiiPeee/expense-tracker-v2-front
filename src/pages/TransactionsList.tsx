import { Header } from "@/components/layout/Header";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionsFiltersCard } from "@/components/transactions/TransactionsFiltersCard";
import { TransactionsPaginatedTable } from "@/components/transactions/TransactionsPaginatedTable";
import { TransactionsSummaryCards } from "@/components/transactions/TransactionsSummaryCards";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { TRANSACTION_CATEGORY_OPTIONS } from "@/constants/transaction-categories";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useFinancialSummary } from "@/hooks/transaction/use-financial-summary";
import { useTransactionsList } from "@/hooks/transaction/use-get-transactions";
import { useTransactionFilters } from "@/hooks/transaction/use-transaction-filters";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { toast } from "sonner";

const TransactionsList = () => {
  const queryClient = useQueryClient();

  const {
    handleDelete,
    handleEdit,
    handleDialogClose,
    handleSubmit,
    setIsDialogOpen,
    setFormData,
    editingTransaction,
    isDialogOpen,
    isSubmitting,
    formData,
  } = useTransaction();

  const { contacts, getAllContact } = useContact();

  const { expenseMonthTotal, incomeMonthTotal, economyMonthTotal, isFetching: isSummaryFetching } = useFinancialSummary();

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
    applyFilters,
    goToPage,
    resetToFirstPage,
  } = useTransactionFilters();

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
      toast.success("Sucesso ao atualizar a página!");
    } catch {
      toast.error("Erro ao atualizar a página!");
    }
  };

  // "Consulta por Filtros" é ação explícita do usuário: além de aplicar os
  // filtros, invalida a lista para sempre buscar dados frescos — mesmo quando
  // o filtro repete um já consultado (que o cache do React Query serviria).
  const handleApplyFilters = () => {
    applyFilters();
    void queryClient.invalidateQueries({ queryKey: ["transactions", "list"] });
  };

  const handleSubmitAndRefresh = async (e: FormEvent) => {
    await handleSubmit(e);
    resetToFirstPage();
  };

  return (
    <div className="page-shell">
      <Header user={null} />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium flex-1 mr-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Todas as Transações</h2>
            <p className="text-muted-foreground text-base">Visualize, filtre e gerencie suas transações com agilidade</p>
          </div>

          <TransactionFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onPrepareNew={() => {
              handleDialogClose();
              void getAllContact();
            }}
            onSubmit={handleSubmitAndRefresh}
            contacts={contacts}
            formData={formData}
            setFormData={setFormData}
            editingTransaction={editingTransaction}
            categoryOptions={TRANSACTION_CATEGORY_OPTIONS}
            isSubmitting={isSubmitting}
          />
        </div>

        <TransactionsSummaryCards
          incomeMonthTotal={incomeMonthTotal}
          expenseMonthTotal={expenseMonthTotal}
          economyMonthTotal={economyMonthTotal}
        />

        <RefreshAllButton isRefreshing={isRefreshing || isSummaryFetching} onRefresh={handleRefresh} />

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
