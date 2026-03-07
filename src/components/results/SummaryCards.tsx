import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimulationSummary } from "@/types/retirement";

interface SummaryCardsProps {
  summary: SimulationSummary;
  pensionStartAge: number;
}

function StatCard({
  title,
  value,
  unit,
  description,
}: {
  title: string;
  value: string;
  unit: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary, pensionStartAge }: SummaryCardsProps) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">
        {pensionStartAge}歳受給開始のシミュレーション結果
      </h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          title="年金月額（額面）"
          value={summary.monthlyPensionGross.toFixed(1)}
          unit="万円/月"
        />
        <StatCard
          title="年金月額（手取り）"
          value={summary.monthlyPensionNet.toFixed(1)}
          unit="万円/月"
        />
        <StatCard
          title="手取り率"
          value={summary.netIncomeRate.toFixed(1)}
          unit="%"
          description="手取り / 額面"
        />
        <StatCard
          title="生涯手取り総受取額"
          value={summary.lifetimeNetIncome.toFixed(0)}
          unit="万円"
        />
        <StatCard
          title="損益分岐点年齢"
          value={
            summary.breakEvenAge !== null
              ? `${summary.breakEvenAge}`
              : "—"
          }
          unit={summary.breakEvenAge !== null ? "歳" : ""}
          description="65歳受給と比較して累計手取りが逆転する年齢"
        />
      </div>
    </div>
  );
}
