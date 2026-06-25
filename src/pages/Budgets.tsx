import { BudgetAlertsBanner } from "@/components/budgets/BudgetAlertsBanner";
import { BudgetFormDialog } from "@/components/budgets/BudgetFormDialog";
import { BudgetsPaginatedTable } from "@/components/budgets/BudgetsPaginatedTable";
import { Header } from "@/components/layout/Header";
import { ErrorStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSACTION_CATEGORY_OPTIONS } from "@/constants/transaction-categories";
import { useBudgetFilters } from "@/hooks/budget/use-budget-filters";
import { useBudgetLimits } from "@/hooks/budget/use-budget-limits";
import { Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const Budgets = () => {
  const { t } = useTranslation("budgets");
  const { budgets, error, isDialogOpen, isRefreshing, refetchBudgets, submitBudget, setIsDialogOpen } = useBudgetLimits();

  const {
    filterName,
    filterCategory,
    setFilterName,
    setFilterCategory,
    clearFilters,
    paginatedBudgets,
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    goToPage,
  } = useBudgetFilters(budgets);

  async function handleRefresh() {
    await refetchBudgets();
  }

  return (
    <div className="page-shell">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="mr-4 flex-1 rounded-3xl border border-glass bg-card/70 px-6 py-6 shadow-medium backdrop-blur-md">
            <h2 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">{t("pageTitle")}</h2>
            <p className="text-base text-muted-foreground">{t("pageSubtitle")}</p>
          </div>

          <BudgetFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={submitBudget}
            categoryOptions={TRANSACTION_CATEGORY_OPTIONS}
          />
        </div>

        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={handleRefresh} />

        <BudgetAlertsBanner budgets={budgets} />

        <Card className="mb-6 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t("filters")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,260px)_auto]">
            <div className="space-y-2">
              <Label htmlFor="budget-search-name">{t("filterByName")}</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="budget-search-name"
                  value={filterName}
                  onChange={(event) => setFilterName(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("searchHint")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-filter-category">{t("filterByCategory")}</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="budget-filter-category" aria-label={t("filterByCategory")}>
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
                  {TRANSACTION_CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t("categoryHint")}</p>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={clearFilters}
                disabled={!filterName && filterCategory === "all"}
              >
                {t("clearFilter")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && budgets.length === 0 ? (
          <ErrorStateCard message={error} onRetry={handleRefresh} className="min-h-40" />
        ) : (
          <BudgetsPaginatedTable
            budgets={paginatedBudgets}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            isLoading={isRefreshing}
            onPageChange={goToPage}
          />
        )}
      </main>
    </div>
  );
};

export default Budgets;
