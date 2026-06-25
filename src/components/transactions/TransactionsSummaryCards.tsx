import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/helper/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

type TransactionsSummaryCardsProps = {
  incomeMonthTotal: number;
  expenseMonthTotal: number;
  economyMonthTotal: number;
};

export function TransactionsSummaryCards({ incomeMonthTotal, expenseMonthTotal, economyMonthTotal }: TransactionsSummaryCardsProps) {
  const { t } = useTranslation("transactions");
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="surface-card rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("income")}</CardTitle>
          <TrendingUp className="w-4 h-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl lg:text-3xl font-bold text-success">{formatBRL(incomeMonthTotal)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t("incomeHint")}</p>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("expenses")}</CardTitle>
          <TrendingDown className="w-4 h-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl lg:text-3xl font-bold text-destructive">{formatBRL(expenseMonthTotal)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t("expensesHint")}</p>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("balance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl lg:text-3xl font-bold ${economyMonthTotal >= 0 ? "text-success" : "text-destructive"}`}>
            {formatBRL(economyMonthTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("balanceHint")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
