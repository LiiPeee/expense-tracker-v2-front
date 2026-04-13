import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useExpenseByCategory } from "@/hooks/transaction/use-expense-by-category";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { DollarSign, Receipt, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Dashboard = () => {
  const { isRefreshing, getAllExpenseAndIncome, expenseMonthTotal, incomeMonthTotal, enconomyMonthTotal } = useGetAll();
  const { isLoading: isLoadingChart, chartData, totalExpense, loadData } = useExpenseByCategory();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    void getAllExpenseAndIncome();
    void loadData();
  }, [getAllExpenseAndIncome, loadData]);

  return (
    <div className="min-h-screen bg-background">
      <Header user="{user}" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllExpenseAndIncome} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{formatBRL(incomeMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatBRL(expenseMonthTotal) ? formatBRL(expenseMonthTotal) : 0.0}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Economia</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatBRL(enconomyMonthTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-medium">
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
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  Carregando...
                </div>
              ) : (
                <ExpensePieChart data={chartData} totalExpense={totalExpense} compact />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Link to="/transactions">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <Receipt className="w-6 h-6" />
                  <span>Nova Transação</span>
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
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
