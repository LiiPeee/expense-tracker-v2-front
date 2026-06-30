import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type BudgetLimit, summarizeBudgetAlerts } from "@/helper/budget";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BudgetAlertsBanner({ budgets }: { budgets: BudgetLimit[] }) {
  const { t } = useTranslation("budgets");
  const { over, warning } = summarizeBudgetAlerts(budgets);
  if (over === 0 && warning === 0) return null;

  const parts: string[] = [];
  if (over > 0) parts.push(t("bannerOver", { value: over }));
  if (warning > 0) parts.push(t("bannerWarning", { value: warning }));

  return (
    <Alert variant={over > 0 ? "destructive" : "default"} className="mb-6 rounded-2xl border-amber-400/40">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("bannerTitle")}</AlertTitle>
      <AlertDescription>{parts.join(" · ")}.</AlertDescription>
    </Alert>
  );
}
