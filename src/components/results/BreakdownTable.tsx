import type { ReactNode } from "react";
import type { AnnualBreakdown } from "@/types/retirement";

interface BreakdownTableProps {
  breakdowns: AnnualBreakdown[];
  pensionStartAge: number;
  title?: string;
  subtitle?: string;
  headerSlot?: ReactNode;
}

export function BreakdownTable({ breakdowns, pensionStartAge, title, subtitle, headerSlot }: BreakdownTableProps) {
  const hasDividendWithholding = breakdowns.some((b) => b.dividendWithholdingTax > 0);
  const lifetimeTotal = Math.round(
    breakdowns.reduce((sum, b) => sum + b.netIncome, 0) * 10
  ) / 10;

  // 受給開始年の行から月額を算出
  const startYearBreakdown = breakdowns.find((b) => b.age === pensionStartAge) ?? breakdowns[0];
  const monthlyGross = Math.round((startYearBreakdown.pensionIncome / 12) * 100) / 100;
  const monthlyNet = Math.round((startYearBreakdown.netIncome / 12) * 100) / 100;
  const netRate =
    startYearBreakdown.totalIncome > 0
      ? Math.round((startYearBreakdown.netIncome / startYearBreakdown.totalIncome) * 1000) / 10
      : 0;

  // 5歳刻みでフィルタ（最初と最後は必ず含める）
  const filtered = breakdowns.filter(
    (b, i) =>
      i === 0 ||
      i === breakdowns.length - 1 ||
      b.age % 5 === 0
  );

  return (
    <div>
      {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
      {subtitle && <h4 className="mb-2 text-base font-medium text-muted-foreground">{subtitle}</h4>}
      {headerSlot && <div className="mb-3">{headerSlot}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">年齢</th>
              <th className="p-2 text-right">年金収入</th>
              <th className="p-2 text-right">その他収入</th>
              <th className="p-2 text-right">所得税</th>
              <th className="p-2 text-right">住民税</th>
              <th className="p-2 text-right">介護保険</th>
              <th className="p-2 text-right">医療保険</th>
              {hasDividendWithholding && (
                <th className="p-2 text-right">配当源泉</th>
              )}
              <th className="p-2 text-right font-semibold">手取り</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.age} className="border-b hover:bg-muted/50">
                <td className="p-2">{b.age}歳</td>
                <td className="p-2 text-right">{b.pensionIncome.toFixed(1)}</td>
                <td className="p-2 text-right">{b.otherIncome.toFixed(1)}</td>
                <td className="p-2 text-right text-red-600">
                  {b.incomeTax > 0 ? `-${b.incomeTax.toFixed(1)}` : "—"}
                </td>
                <td className="p-2 text-right text-red-600">
                  {b.residenceTax > 0 ? `-${b.residenceTax.toFixed(1)}` : "—"}
                </td>
                <td className="p-2 text-right text-red-600">
                  {b.nursingInsurance > 0
                    ? `-${b.nursingInsurance.toFixed(1)}`
                    : "—"}
                </td>
                <td className="p-2 text-right text-red-600">
                  {b.healthInsurance > 0
                    ? `-${b.healthInsurance.toFixed(1)}`
                    : "—"}
                </td>
                {hasDividendWithholding && (
                  <td className="p-2 text-right text-red-600">
                    {b.dividendWithholdingTax > 0
                      ? `-${b.dividendWithholdingTax.toFixed(1)}`
                      : "—"}
                  </td>
                )}
                <td className="p-2 text-right font-semibold">
                  {b.netIncome.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">単位：万円/年</p>
          <div className="text-sm text-right space-y-1">
            <p>
              生涯手取り総受取額：
              <span className="font-bold text-lg">{lifetimeTotal.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">万円</span>
            </p>
            <p className="text-xs text-muted-foreground">
              年金月額（額面）：{monthlyGross.toFixed(1)}万円
              ／手取り：{monthlyNet.toFixed(1)}万円
              ／手取り率：{netRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
