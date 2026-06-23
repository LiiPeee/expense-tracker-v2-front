import { cn } from "@/helper/utils";

const PALETTE = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-600",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-pink-500",
];

function colorFromTicker(ticker: string): string {
  const hash = [...ticker].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

type StockAvatarProps = {
  ticker: string;
  className?: string;
};

export function StockAvatar({ ticker, className }: StockAvatarProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tracking-wide text-white shadow-sm",
        colorFromTicker(ticker),
        className,
      )}
    >
      {ticker.slice(0, 2).toUpperCase()}
    </div>
  );
}
