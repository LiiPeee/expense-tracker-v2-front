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
import { resolveQueryPeriod, type TransactionListQuery, useTransactionsList } from "@/hooks/transaction/use-get-transactions";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

type ActiveQueryKind =
  | { kind: "all" }
  | { kind: "type"; typeName: string }
  | { kind: "categoryType"; category: string; typeName: string }
  | { kind: "contactType"; contactId: string; typeName: string };

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
    formData,
  } = useTransaction();

  const { contacts, getAllContact } = useContact();

  const { expenseMonthTotal, incomeMonthTotal, economyMonthTotal, isFetching: isSummaryFetching } = useFinancialSummary();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterContact, setFilterContact] = useState<string>("all");
  const [activeQueryKind, setActiveQueryKind] = useState<ActiveQueryKind>({ kind: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("");

  // Committed period — only updates when user clicks "Consulta por Filtros" or on page load
  const [activePeriod, setActivePeriod] = useState<{ month: number; year: number }>(() => resolveQueryPeriod("all", ""));

  const transactionQuery = useMemo((): TransactionListQuery => {
    if (activeQueryKind.kind === "type") {
      return { kind: "type", typeName: activeQueryKind.typeName, month: activePeriod.month, year: activePeriod.year };
    }
    if (activeQueryKind.kind === "categoryType") {
      return {
        kind: "categoryType",
        category: activeQueryKind.category,
        typeName: activeQueryKind.typeName,
        month: activePeriod.month,
        year: activePeriod.year,
      };
    }
    if (activeQueryKind.kind === "contactType") {
      return {
        kind: "contactType",
        contactId: activeQueryKind.contactId,
        typeName: activeQueryKind.typeName,
        month: activePeriod.month,
        year: activePeriod.year,
      };
    }
    return { kind: "all", month: activePeriod.month, year: activePeriod.year };
  }, [activeQueryKind, activePeriod]);

  const {
    transactions,
    currentPage: serverPage,
    totalPages,
    totalRecords,
    pageSize,
    isRefreshing,
  } = useTransactionsList(transactionQuery, currentPage);

  const handleApplyFilters = () => {
    const committed = resolveQueryPeriod(month, year);

    if (filterCategory === "all" && filterType === "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "all" });
      setCurrentPage(1);
      return;
    }

    if (filterContact !== "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "contactType", contactId: filterContact, typeName: filterType });
      setCurrentPage(1);
      return;
    }

    if (filterCategory === "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "type", typeName: filterType });
      setCurrentPage(1);
      return;
    }

    if (filterCategory !== "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "categoryType", category: filterCategory, typeName: filterType });
      setCurrentPage(1);
      return;
    }

    toast.error("Selecione também o tipo para filtrar.");
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["transactions"] }), getAllContact()]);
      toast.success("Sucesso ao atualizar a página!");
    } catch {
      toast.error("Erro ao atualizar a página!");
    }
  };

  const handleSubmitAndRefresh = async (e: FormEvent) => {
    await handleSubmit(e);
    setCurrentPage(1);
  };

  return (
    <div className="page-shell">
      <Header user={null} />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-white/50 bg-white/70 backdrop-blur-md px-6 py-6 shadow-medium flex-1 mr-4">
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
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default TransactionsList;
