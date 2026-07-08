import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  aggregateDailyToMonthly,
  calcCdiAccruedSummary,
  calcCdiDailyHistory,
  isCdbHistoryPreset,
  parseCdiRateInput,
  type CdiAccruedInputs,
} from "@/helper/cdi";
import { formatBRL } from "@/helper/utils";
import { useCurrentCdiRate } from "@/hooks/use-cdi-rate";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation } from "react-router-dom";

const CdbHistory = () => {
  const { t } = useTranslation("cdiCalculator");
  const location = useLocation();
  const preset = isCdbHistoryPreset(location.state) ? location.state : undefined;
  const today = useMemo(() => new Date(), []);
  const [cdiAnnualRate, setCdiAnnualRate] = useCurrentCdiRate();
  const [historyView, setHistoryView] = useState<"daily" | "monthly">("monthly");

  // Sem location.state (refresh/navegação direta) não há CDB para mostrar — não existe mais
  // um modo de simulação genérica para cair como fallback, então volta para a carteira.
  if (!preset) {
    return <Navigate to="/stocks" replace />;
  }

  const parsedCdiRate = parseCdiRateInput(cdiAnnualRate);
  const accruedInputs: CdiAccruedInputs | null = parsedCdiRate
    ? { principal: preset.principal, cdbRate: preset.cdbRate, cdiAnnualRate: parsedCdiRate, investmentDate: preset.investmentDate }
    : null;

  const accruedSummary = accruedInputs ? calcCdiAccruedSummary(accruedInputs, today) : null;
  const dailyHistory = accruedInputs ? calcCdiDailyHistory(accruedInputs, today) : [];
  const monthlyHistory = aggregateDailyToMonthly(dailyHistory);

  return (
    <div className="page-shell">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium reveal-up flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("pageTitle")}</h2>
              <Badge variant="secondary">{preset.ticker}</Badge>
            </div>
            <p className="text-muted-foreground text-base">{t("pageSubtitle")}</p>
          </div>
          <Link to="/stocks" className="shrink-0">
            <Button variant="outline" className="gap-2 rounded-xl border-glass">
              <ChevronLeft className="w-4 h-4" />
              {t("viewPortfolio")}
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <Card className="surface-card rounded-2xl reveal-up stagger-1 self-start">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("investmentTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">{t("principalLabel")}</p>
                <p className="text-lg font-semibold text-foreground">{formatBRL(preset.principal)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">{t("cdbRateLabel")}</p>
                <p className="text-lg font-semibold text-foreground">{preset.cdbRate}% CDI</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">{t("investmentDateLabel")}</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(preset.investmentDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <label htmlFor="cdiRate" className="text-sm font-medium">{t("currentCdiRateLabel")}</label>
                <div className="relative">
                  <Input id="cdiRate" className="pr-16" value={cdiAnnualRate} onChange={(e) => setCdiAnnualRate(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">% a.a.</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("currentCdiRateHint")}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            {accruedSummary && (
              <Card className="surface-card rounded-2xl reveal-up stagger-1 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{t("accruedTitle")}</CardTitle>
                  <p className="text-xs text-muted-foreground">{t("accruedRateAssumption")}</p>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("elapsedDaysLabel")}</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{accruedSummary.elapsedDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("accruedValueLabel")}</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{formatBRL(accruedSummary.accruedValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("totalEarnedLabel")}</p>
                    <p className="text-lg font-bold text-success tabular-nums">+ {formatBRL(accruedSummary.totalEarnings)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("dailyEarningsNowLabel")}</p>
                    <p className="text-lg font-bold text-success tabular-nums">+ {formatBRL(accruedSummary.currentDailyEarnings)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="surface-card rounded-2xl reveal-up stagger-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold">{t("historyTitle")}</CardTitle>
                <Tabs value={historyView} onValueChange={(v) => setHistoryView(v as "daily" | "monthly")}>
                  <TabsList>
                    <TabsTrigger value="daily">{t("tabDaily")}</TabsTrigger>
                    <TabsTrigger value="monthly">{t("tabMonthly")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                {dailyHistory.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-muted-foreground">{t("historyEmpty")}</p>
                ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{historyView === "daily" ? t("historyColDate") : t("historyColMonth")}</TableHead>
                        <TableHead className="text-right">{t("historyColEarnings")}</TableHead>
                        <TableHead className="text-right">{t("colAccumulated")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyView === "daily"
                        ? dailyHistory.map((row) => (
                            <TableRow key={row.dayIndex}>
                              <TableCell className="text-muted-foreground">
                                {new Date(row.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                              </TableCell>
                              <TableCell className="text-right text-success font-medium tabular-nums">+ {formatBRL(row.earnings)}</TableCell>
                              <TableCell className="text-right font-semibold tabular-nums">{formatBRL(row.accumulatedValue)}</TableCell>
                            </TableRow>
                          ))
                        : monthlyHistory.map((row) => (
                            <TableRow key={`${row.year}-${row.month}`}>
                              <TableCell className="text-muted-foreground">
                                {String(row.month).padStart(2, "0")}/{row.year}
                              </TableCell>
                              <TableCell className="text-right text-success font-medium tabular-nums">+ {formatBRL(row.earnings)}</TableCell>
                              <TableCell className="text-right font-semibold tabular-nums">{formatBRL(row.accumulatedValue)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CdbHistory;
