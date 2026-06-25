import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type BudgetLimit, summarizeBudgetAlerts } from "@/helper/budget";
import { AlertTriangle } from "lucide-react";

/** Summary banner shown above the budgets list when any budget is near or over its limit. */
export function BudgetAlertsBanner({ budgets }: { budgets: BudgetLimit[] }) {
  const { over, warning } = summarizeBudgetAlerts(budgets);
  if (over === 0 && warning === 0) return null;

  const parts: string[] = [];
  if (over > 0) parts.push(`${over} acima do limite`);
  if (warning > 0) parts.push(`${warning} perto do limite`);

  return (
    <Alert variant={over > 0 ? "destructive" : "default"} className="mb-6 rounded-2xl border-amber-400/40">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Atenção aos seus orçamentos</AlertTitle>
      <AlertDescription>{parts.join(" · ")}.</AlertDescription>
    </Alert>
  );
}
