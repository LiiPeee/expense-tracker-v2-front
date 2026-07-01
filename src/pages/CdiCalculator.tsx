import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calcCdiMonthlyProjection, calcCdiSummary, type CdiInputs } from "@/helper/cdi";
import { formatBRL } from "@/helper/utils";
import { Calculator, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CdiCalculator = () => {
  const { t } = useTranslation("cdiCalculator");

  const [principal, setPrincipal] = useState("10000");
  const [cdbRate, setCdbRate] = useState("115");
  const [cdiAnnualRate, setCdiAnnualRate] = useState("13.65");
  const [months, setMonths] = useState("12");

  const inputs = useMemo((): CdiInputs | null => {
    const p = parseFloat(principal.replace(",", "."));
    const cdb = parseFloat(cdbRate.replace(",", "."));
    const cdi = parseFloat(cdiAnnualRate.replace(",", "."));
    const m = parseInt(months, 10);
    if (!isFinite(p) || p <= 0) return null;
    if (!isFinite(cdb) || cdb <= 0) return null;
    if (!isFinite(cdi) || cdi <= 0) return null;
    if (!isFinite(m) || m <= 0) return null;
    return { principal: p, cdbRate: cdb, cdiAnnualRate: cdi, months: m };
  }, [principal, cdbRate, cdiAnnualRate, months]);

  const summary = useMemo(() => (inputs ? calcCdiSummary(inputs) : null), [inputs]);
  const projection = useMemo(() => (inputs ? calcCdiMonthlyProjection(inputs) : []), [inputs]);

  const summaryCards = [
    { label: t("labelDaily"), value: summary?.dailyEarnings ?? 0 },
    { label: t("labelMonthly"), value: summary?.monthlyEarnings ?? 0 },
    { label: t("labelAnnual"), value: summary?.annualEarnings ?? 0 },
    { label: t("labelTotal"), value: summary?.totalGrossEarnings ?? 0 },
  ];

  return (
    <div className="page-shell">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium reveal-up flex-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{t("pageTitle")}</h2>
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
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {t("inputsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="principal" className="text-sm font-medium">{t("fieldPrincipal")}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">R$</span>
                  <Input id="principal" className="pl-9" placeholder={t("fieldPrincipalPlaceholder")} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cdbRate" className="text-sm font-medium">{t("fieldCdbRate")}</label>
                <div className="relative">
                  <Input id="cdbRate" className="pr-16" placeholder={t("fieldCdbRatePlaceholder")} value={cdbRate} onChange={(e) => setCdbRate(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">% CDI</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cdiRate" className="text-sm font-medium">{t("fieldCdiRate")}</label>
                <div className="relative">
                  <Input id="cdiRate" className="pr-16" placeholder={t("fieldCdiRatePlaceholder")} value={cdiAnnualRate} onChange={(e) => setCdiAnnualRate(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">% a.a.</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="months" className="text-sm font-medium">{t("fieldMonths")}</label>
                <Input id="months" type="number" min="1" placeholder={t("fieldMonthsPlaceholder")} value={months} onChange={(e) => setMonths(e.target.value)} />
              </div>

              {summary && (
                <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t("effectiveRate")}</p>
                  <p className="text-lg font-bold text-primary mt-0.5">
                    {(summary.effectiveAnnualRate * 100).toFixed(4)}% a.a.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 reveal-up stagger-2">
              {summaryCards.map(({ label, value }) => (
                <Card key={label} className="surface-card rounded-2xl p-5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                  <p className="text-xl font-bold text-primary tabular-nums">{formatBRL(value)}</p>
                </Card>
              ))}
            </div>

            <Card className="surface-card rounded-2xl reveal-up stagger-3">
              <CardContent className="pt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("grossValueLabel")}</p>
                  <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
                    {formatBRL(summary?.grossValue ?? (parseFloat(principal) || 0))}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-muted-foreground">{t("totalEarningsLabel")}</p>
                  <p className="text-xl font-bold text-success mt-1 tabular-nums">
                    + {formatBRL(summary?.totalGrossEarnings ?? 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {projection.length > 0 && (
              <Card className="surface-card rounded-2xl reveal-up stagger-3">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{t("projectionTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("colMonth")}</TableHead>
                          <TableHead className="text-right">{t("colMonthEarnings")}</TableHead>
                          <TableHead className="text-right">{t("colAccumulated")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projection.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="text-muted-foreground">{t("monthLabel", { month: row.month })}</TableCell>
                            <TableCell className="text-right text-success font-medium tabular-nums">
                              + {formatBRL(row.monthEarnings)}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">
                              {formatBRL(row.accumulatedValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CdiCalculator;
