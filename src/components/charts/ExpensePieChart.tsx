import { CategoryChartData } from "@/hooks/transaction/use-expense-by-category";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryChartData }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">{data.category}</p>
      <p className="text-muted-foreground">{formatBRL(data.total)}</p>
      <p className="text-muted-foreground">{data.percentage.toFixed(1)}%</p>
    </div>
  );
};

interface ExpensePieChartProps {
  data: CategoryChartData[];
  totalExpense: number;
  compact?: boolean;
}

export function ExpensePieChart({ data, totalExpense, compact = false }: ExpensePieChartProps) {
  const innerRadius = compact ? 50 : 70;
  const outerRadius = compact ? 80 : 110;
  const chartHeight = compact ? 200 : 280;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Nenhum gasto registrado neste período
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="total"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
            >
              <tspan x="50%" dy="-0.5em" fontSize={compact ? 11 : 13} fill="currentColor" opacity={0.6}>
                Total
              </tspan>
              <tspan x="50%" dy="1.4em" fontSize={compact ? 13 : 16} fontWeight="bold" fill="currentColor">
                {formatBRL(totalExpense)}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        {(compact ? data.slice(0, 5) : data).map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.fill }} />
              <span className="text-muted-foreground truncate">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!compact && (
                <span className="text-foreground font-medium">{formatBRL(item.total)}</span>
              )}
              <span className="text-muted-foreground w-10 text-right">{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
        {compact && data.length > 5 && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            +{data.length - 5} categorias — veja o relatório completo
          </p>
        )}
      </div>
    </div>
  );
}
