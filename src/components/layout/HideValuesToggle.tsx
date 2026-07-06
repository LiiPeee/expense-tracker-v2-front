import { Button } from "@/components/ui/button";
import { useHideValues } from "@/contexts/hide-values-context";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

type HideValuesToggleProps = {
  className?: string;
};

export function HideValuesToggle({ className }: HideValuesToggleProps) {
  const { t } = useTranslation();
  const { isHidden, toggleHidden } = useHideValues();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={isHidden ? t("showValues") : t("hideValues")}
      onClick={toggleHidden}
    >
      {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </Button>
  );
}
