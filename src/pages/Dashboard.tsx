import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { TRANSACTION_CATEGORY_OPTIONS } from "@/constants/transaction-categories";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useExpenseByCategory } from "@/hooks/transaction/use-expense-by-category";
import { useFinancialSummary } from "@/hooks/transaction/use-financial-summary";
import { useIncomeByCategory } from "@/hooks/transaction/use-income-by-category";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Dashboard = () => {
  const {
    isFetching: isRefreshingSummary,
    expenseMonthTotal,
    incomeMonthTotal,
    economyMonthTotal,
    refetch: refetchSummary,
  } = useFinancialSummary();
  const {
    isLoading: isLoadingChart,
    error: expenseChartError,
    chartData,
    totalExpense,
    refetch: refetchExpenseChart,
  } = useExpenseByCategory();
  const {
    isLoading: isLoadingIncomeChart,
    error: incomeChartError,
    chartData: incomeChartData,
    totalIncome,
    refetch: refetchIncomeChart,
  } = useIncomeByCategory();

  const { handleDialogClose, handleSubmit, setIsDialogOpen, setFormData, editingTransaction, isDialogOpen, isSubmitting, formData } =
    useTransaction();
  const { contacts, getAllContact } = useContact();

  const isRefreshing = isRefreshingSummary || isLoadingChart || isLoadingIncomeChart;

  async function handleRefresh() {
    await Promise.all([refetchSummary(), refetchExpenseChart(), refetchIncomeChart()]);
  }

  async function handleSubmitAndRefresh(event: FormEvent) {
    await handleSubmit(event);
    void handleRefresh();
  }

  return (
    <div className="page-shell">
      <Header user={null} />
      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-white/50 dark:border-white/10 bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium reveal-up flex-1 mr-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground text-base">Visão geral das suas finanças em tempo real</p>
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

        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={handleRefresh} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="rounded-2xl reveal-up stagger-1 overflow-hidden border-success/20 bg-gradient-to-br from-success/5 to-success/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl lg:text-4xl font-bold text-success tabular-nums">{formatBRL(incomeMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl reveal-up stagger-2 overflow-hidden border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl lg:text-4xl font-bold text-destructive tabular-nums">{formatBRL(expenseMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl reveal-up stagger-3 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Economia</CardTitle>
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl lg:text-4xl font-bold text-primary tabular-nums">{formatBRL(economyMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="surface-card rounded-2xl reveal-up stagger-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Gastos por Categoria</CardTitle>
              <Link to="/reports">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                  Ver relatório
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingChart ? (
                <LoadingStateCard className="h-40" lines={3} />
              ) : expenseChartError ? (
                <ErrorStateCard message={expenseChartError} onRetry={handleRefresh} className="h-40" />
              ) : (
                <ExpensePieChart data={chartData} totalExpense={totalExpense} compact />
              )}
            </CardContent>
          </Card>

          <Card className="surface-card rounded-2xl reveal-up stagger-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Receitas por Categoria</CardTitle>
              <Link to="/reports">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                  Ver relatório
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingIncomeChart ? (
                <LoadingStateCard className="h-40" lines={3} />
              ) : incomeChartError ? (
                <ErrorStateCard message={incomeChartError} onRetry={handleRefresh} className="h-40" />
              ) : (
                <ExpensePieChart data={incomeChartData} totalExpense={totalIncome} compact />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
