import { Header } from "@/components/layout/Header";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionsFiltersCard } from "@/components/transactions/TransactionsFiltersCard";
import { TransactionsPaginatedTable } from "@/components/transactions/TransactionsPaginatedTable";
import { TransactionsSummaryCards } from "@/components/transactions/TransactionsSummaryCards";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  "Alimentação",
  "Conforto",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Bens Pessoais",
  "Investimento",
  "Renda Variável",
  "Benefícios",
  "Salário",
  "Outros",
] as const;

type ActiveQuery =
  | { kind: "all" }
  | { kind: "type"; typeName: string }
  | { kind: "categoryType"; category: string; typeName: string }
  | { kind: "contactType"; contactId: string; typeName: string };

const TransactionsList = () => {
  const { handleDelete, handleEdit, handleDialogClose, handleSubmit, setIsDialogOpen, setFormData, editingTransaction, isDialogOpen, formData } = useTransaction();
  const { contacts, getAllContact } = useContact();

  const {
    transactions,
    expenseMonthTotal,
    incomeMonthTotal,
    economyMonthTotal,
    isRefreshing,
    year,
    month,
    setYear,
    setMonth,
    getAllTransaction,
    getByType,
    getByContactAndType,
    getAllExpenseAndIncome,
    getByCategoryAndType,
    currentPage: serverPage,
    totalPages: serverTotalPages,
    totalRecords: serverTotalRecords,
    pageSize: serverPageSize,
  } = useGetAll();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterContact, setFilterContact] = useState<string>("all");
  const [activeQuery, setActiveQuery] = useState<ActiveQuery>({ kind: "all" });

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    setActiveQuery({ kind: "all" });
    void getAllTransaction(1);
  }, [getAllTransaction]);

  const goToPage = (page: number) => {
    if (activeQuery.kind === "all") {
      void getAllTransaction(page);
      return;
    }

    if (activeQuery.kind === "type") {
      void getByType(activeQuery.typeName, page);
      return;
    }

    if (activeQuery.kind === "categoryType") {
      void getByCategoryAndType(activeQuery.category, activeQuery.typeName, page);
      return;
    }

    if (activeQuery.kind === "contactType") {
      void getByContactAndType(activeQuery.contactId, activeQuery.typeName, page);
    }
  };

  const handleApplyFilters = () => {
    if (filterCategory === "all" && filterType === "all") {
      setActiveQuery({ kind: "all" });
      void getAllTransaction(1);
      return;
    }

    if (filterContact !== "all" && filterType !== "all") {
      setActiveQuery({ kind: "contactType", contactId: filterContact, typeName: filterType });
      void getByContactAndType(filterContact, filterType, 1);
      return;
    }

    if (filterCategory === "all" && filterType !== "all") {
      setActiveQuery({ kind: "type", typeName: filterType });
      void getByType(filterType, 1);
      return;
    }

    if (filterCategory !== "all" && filterType !== "all") {
      setActiveQuery({ kind: "categoryType", category: filterCategory, typeName: filterType });
      void getByCategoryAndType(filterCategory, filterType, 1);
      return;
    }

    toast.error("Selecione tambem o tipo para filtrar.");
  };

  const handleRefresh = async () => {
    try {
      await getAllExpenseAndIncome();
      await getAllContact();
      setActiveQuery({ kind: "all" });
      await getAllTransaction(1);
      toast.success("Sucesso ao atualizar a página!");
    } catch {
      toast.error("Erro ao atualizar a página!");
    }
  };

  const handleSubmitAndRefresh = async (e: FormEvent) => {
    await handleSubmit(e);
    void getAllTransaction(1);
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
            categoryOptions={CATEGORY_OPTIONS}
          />
        </div>

        <TransactionsSummaryCards
          incomeMonthTotal={incomeMonthTotal}
          expenseMonthTotal={expenseMonthTotal}
          economyMonthTotal={economyMonthTotal}
        />

        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={handleRefresh} />

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
          totalPages={serverTotalPages}
          totalRecords={serverTotalRecords}
          pageSize={serverPageSize}
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
