import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { Header } from "@/components/layout/Header";
import { HideValuesToggle } from "@/components/layout/HideValuesToggle";
import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHideValues } from "@/contexts/hide-values-context";
import { formatBRLMasked, getDefaultYearMonth, getMonthNames } from "@/helper/utils";
import { useExpenseByCategory } from "@/hooks/transaction/use-expense-by-category";
import type { TransactionFilterPreset } from "@/hooks/transaction/use-transaction-filters";
import { PieChart, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const Reports = () => {
  const { t, i18n } = useTranslation("reports");
  const { isHidden } = useHideValues();
  const navigate = useNavigate();
  const localizedMonths = getMonthNames(i18n.language);
  const ym = getDefaultYearMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(String(ym.month));
  const [selectedYear, setSelectedYear] = useState<string>(String(ym.year));
  const [appliedMonth, setAppliedMonth] = useState(ym.month);
  const [appliedYear, setAppliedYear] = useState(ym.year);
  const { isLoading, error, chartData, totalExpense, refetch } = useExpenseByCategory(appliedMonth, appliedYear);

  function handleCategoryClick(category: string) {
    const preset: TransactionFilterPreset = {
      kind: "categoryType",
      category,
      typeName: "EXPENSE",
      period: { month: appliedMonth, year: appliedYear },
    };
    navigate("/transactions-list", { state: preset });
  }

  function handleApplyFilter() {
    const nextMonth = Number(selectedMonth);
    const nextYear = Number(selectedYear);
    const isSamePeriod = nextMonth === appliedMonth && nextYear === appliedYear;

    setAppliedMonth(nextMonth);
    setAppliedYear(nextYear);

    if (isSamePeriod) {
      void refetch();
    }
  }

  const selectedMonthLabel = localizedMonths[appliedMonth - 1];

  return (
    <div className="page-shell">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="mb-8 rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium reveal-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{t("pageTitle")}</h2>
          <p className="text-muted-foreground">{t("pageSubtitle")}</p>
        </div>

        <Card className="mb-6 rounded-2xl reveal-up stagger-1">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">{t("month")}</span>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {localizedMonths.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">{t("year")}</span>
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

                <Button onClick={handleApplyFilter} disabled={isLoading} className="gap-2 rounded-xl">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? t("loading") : t("apply")}
                </Button>
              </div>

              <HideValuesToggle className="rounded-xl border border-glass bg-card/70" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl reveal-up stagger-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {t("chartTitle")} — {selectedMonthLabel} {appliedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingStateCard className="h-64" lines={6} />
              ) : error ? (
                <ErrorStateCard message={error} onRetry={handleApplyFilter} className="h-64" />
              ) : (
                <ExpensePieChart data={chartData} totalExpense={totalExpense} isHidden={isHidden} />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl reveal-up stagger-3">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("detailTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingStateCard className="h-64" lines={6} />
              ) : error ? (
                <ErrorStateCard message={error} onRetry={handleApplyFilter} className="h-64" />
              ) : chartData.length === 0 ? (
                <div className="empty-state">
                  <PieChart className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
                  <p className="text-xs text-muted-foreground">{t("emptySubtitle")}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                    <span>{t("colCategory")}</span>
                    <span className="text-right">{t("colValue")}</span>
                    <span className="text-right">{t("colPercent")}</span>
                  </div>
                  {chartData.map((item) => (
                    <button
                      key={item.category}
                      type="button"
                      onClick={() => handleCategoryClick(item.category)}
                      className="grid w-full grid-cols-3 items-center py-2 border-b border-border/40 last:border-0 text-left rounded-md transition-colors hover:bg-accent/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm truncate">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium text-right">{formatBRLMasked(item.total, isHidden)}</span>
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
                    </button>
                  ))}
                  <div className="grid grid-cols-3 items-center pt-3 font-semibold text-sm">
                    <span>{t("total")}</span>
                    <span className="text-right text-destructive">{formatBRLMasked(totalExpense, isHidden)}</span>
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
