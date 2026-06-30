import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  /** Texto exibido enquanto isLoading é true. Padrão: o próprio children. */
  loadingText?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, loadingText, disabled, children, ...props }, ref) => (
    <Button ref={ref} disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading ? (loadingText ?? children) : children}
    </Button>
  ),
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
