import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseByCategory } from "@/hooks/transaction/use-expense-by-category";
import { getDefaultYearMonth, monthNames } from "@/helper/utils";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const Reports = () => {
  const { isLoading, chartData, totalExpense, loadData } = useExpenseByCategory();
  const didFetchRef = useRef(false);

  const ym = getDefaultYearMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(String(ym.month));
  const [selectedYear, setSelectedYear] = useState<string>(String(ym.year));

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    void loadData(ym.month, ym.year);
  }, []);

  function handleApplyFilter() {
    void loadData(Number(selectedMonth), Number(selectedYear));
  }

  const selectedMonthLabel = monthNames[Number(selectedMonth) - 1];

  return (
    <div className="min-h-screen bg-background">
      <Header user="{user}" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Relatórios</h2>
          <p className="text-muted-foreground">Análise detalhada dos seus gastos por categoria</p>
        </div>

        {/* Filtros */}
        <Card className="shadow-soft mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Mês</span>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((name, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Ano</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleApplyFilter} disabled={isLoading} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Carregando..." : "Aplicar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo principal */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Gastos por Categoria — {selectedMonthLabel} {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Carregando...
                </div>
              ) : (
                <ExpensePieChart data={chartData} totalExpense={totalExpense} />
              )}
            </CardContent>
          </Card>

          {/* Tabela detalhada */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Detalhamento por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Carregando...
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  Nenhum gasto registrado neste período
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                    <span>Categoria</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">% do Total</span>
                  </div>
                  {chartData.map((item) => (
                    <div
                      key={item.category}
                      className="grid grid-cols-3 items-center py-2 border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm truncate">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium text-right">{formatBRL(item.total)}</span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                        <div className="w-full max-w-20 h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.fill,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 items-center pt-3 font-semibold text-sm">
                    <span>Total</span>
                    <span className="text-right text-destructive">{formatBRL(totalExpense)}</span>
                    <span className="text-right text-muted-foreground">100%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
