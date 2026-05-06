import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

type TransactionsSummaryCardsProps = {
  incomeMonthTotal: number;
  expenseMonthTotal: number;
  economyMonthTotal: number;
};

export function TransactionsSummaryCards({ incomeMonthTotal, expenseMonthTotal, economyMonthTotal }: TransactionsSummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="surface-card rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <TrendingUp className="w-4 h-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl lg:text-3xl font-bold text-success">{formatBRL(incomeMonthTotal)}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de entradas no período</p>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <TrendingDown className="w-4 h-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl lg:text-3xl font-bold text-destructive">{formatBRL(expenseMonthTotal)}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de saídas no período</p>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl lg:text-3xl font-bold ${economyMonthTotal >= 0 ? "text-success" : "text-destructive"}`}>
            {formatBRL(economyMonthTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Receitas menos despesas</p>
        </CardContent>
      </Card>
    </div>
  );
}
