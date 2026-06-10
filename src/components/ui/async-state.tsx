import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/helper/utils";
import { AlertTriangle, Loader2 } from "lucide-react";

type LoadingStateCardProps = {
  className?: string;
  lines?: number;
};

export function LoadingStateCard({ className, lines = 4 }: LoadingStateCardProps) {
  return (
    <div className={cn("rounded-2xl border border-glass bg-card/65 p-4 backdrop-blur-sm", className)}>
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando dados...
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded-lg" />
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

type TableLoadingStateProps = {
  className?: string;
  columns?: number;
  rows?: number;
};

export function TableLoadingState({ className, columns = 6, rows = 6 }: TableLoadingStateProps) {
  return (
    <div className={cn("rounded-xl border border-glass bg-card/65 p-3 backdrop-blur-sm", className)}>
      <div className="mb-2 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-4/5 rounded-lg" />
        ))}
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-3.5 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type ErrorStateCardProps = {
  title?: string;
  message: string;
  className?: string;
  onRetry?: () => void;
};

export function ErrorStateCard({ title = "Não foi possível carregar", message, className, onRetry }: ErrorStateCardProps) {
  return (
    <div className={cn("empty-state border-destructive/25 bg-destructive/5", className)}>
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-xs text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2 rounded-full" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
