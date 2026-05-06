import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useExpenseByCategory } from "@/hooks/transaction/use-expense-by-category";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { useIncomeByCategory } from "@/hooks/transaction/use-income-by-category";
import { DollarSign, Receipt, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Dashboard = () => {
  const { isRefreshing, getAllExpenseAndIncome, expenseMonthTotal, incomeMonthTotal, economyMonthTotal } = useGetAll();
  const { isLoading: isLoadingChart, error: expenseChartError, chartData, totalExpense, loadData } = useExpenseByCategory();
  const {
    isLoading: isLoadingIncomeChart,
    error: incomeChartError,
    chartData: incomeChartData,
    totalIncome,
    loadData: loadIncomeData,
  } = useIncomeByCategory();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    void getAllExpenseAndIncome();
    void loadData();
    void loadIncomeData();
  }, [getAllExpenseAndIncome, loadData, loadIncomeData]);

  return (
    <div className="page-shell">
      <Header user={null} />
      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="mb-8 rounded-3xl border border-white/50 bg-white/70 backdrop-blur-md px-6 py-6 shadow-medium reveal-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground text-base">Visão geral das suas finanças em tempo real</p>
        </div>
        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllExpenseAndIncome} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="surface-card rounded-2xl reveal-up stagger-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-success">{formatBRL(incomeMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-2xl reveal-up stagger-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-destructive">{formatBRL(expenseMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-2xl reveal-up stagger-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Economia</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-primary">{formatBRL(economyMonthTotal)}</div>
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
                <ErrorStateCard message={expenseChartError} onRetry={() => void loadData()} className="h-40" />
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
                <ErrorStateCard message={incomeChartError} onRetry={() => void loadIncomeData()} className="h-40" />
              ) : (
                <ExpensePieChart data={incomeChartData} totalExpense={totalIncome} compact />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="surface-card rounded-2xl reveal-up stagger-3">
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Link to="/transactions">
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col gap-2 rounded-2xl border-white/70 bg-white/70 hover:bg-white hover:scale-[1.01] transition-transform"
                >
                  <Receipt className="w-6 h-6" />
                  <span>Nova Transação</span>
                </Button>
              </Link>
              <Link to="/contacts">
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col gap-2 rounded-2xl border-white/70 bg-white/70 hover:bg-white hover:scale-[1.01] transition-transform"
                >
                  <Users className="w-6 h-6" />
                  <span>Gerenciar Contatos</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
