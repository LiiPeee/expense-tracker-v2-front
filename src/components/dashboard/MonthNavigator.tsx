import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type MonthNavigatorProps = {
  label: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export function MonthNavigator({ label, onPreviousMonth, onNextMonth }: MonthNavigatorProps) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex items-center gap-2 rounded-xl border border-glass bg-card/70 px-2 py-1.5 backdrop-blur-md">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPreviousMonth} aria-label={t("previousMonth")}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-36 text-center text-sm font-medium">{label}</span>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextMonth} aria-label={t("nextMonth")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
