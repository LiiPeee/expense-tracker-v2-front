import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useGetAll } from "@/hooks/use-get-all";
import { DollarSign, MapPin, Receipt, Tags, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isRefreshing, getAllExpense } = useGetAll();
  return (
    <div className="min-h-screen bg-background">
      <Header user="{user}" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllExpense} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total</CardTitle>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">Conecte sua API para ver dados reais</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Economia</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

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
            <Link to="/categories">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Tags className="w-6 h-6" />
                <span>Gerenciar Categorias</span>
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Gerenciar Contatos</span>
              </Button>
            </Link>
            <Link to="/addresses">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <MapPin className="w-6 h-6" />
                <span>Gerenciar Endereços</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
