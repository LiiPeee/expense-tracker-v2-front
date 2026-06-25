import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

type RefreshAllButtonProps = {
  isRefreshing?: boolean;
  onRefresh: () => void;
};

export function RefreshAllButton({ isRefreshing, onRefresh }: RefreshAllButtonProps) {
  const { t } = useTranslation();
  return (
    <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isRefreshing} aria-label={t("refreshData")} title={t("refreshData")}>
      <RefreshCcw className={isRefreshing ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
    </Button>
  );
}
