import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type RefreshAllButtonProps = {
  isRefreshing?: boolean;
  onRefresh: () => void;
};

export function RefreshAllButton({ isRefreshing, onRefresh }: RefreshAllButtonProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isRefreshing} aria-label="Recarregar dados" title="Recarregar dados">
      <RefreshCcw className={isRefreshing ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
    </Button>
  );
}
