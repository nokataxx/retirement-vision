import type { AnnualBreakdown } from "@/types/retirement";

interface BreakdownTableProps {
  breakdowns: AnnualBreakdown[];
}

export function BreakdownTable({ breakdowns }: BreakdownTableProps) {
  // 5歳刻みでフィルタ（最初と最後は必ず含める）
  const filtered = breakdowns.filter(
    (b, i) =>
      i === 0 ||
      i === breakdowns.length - 1 ||
      b.age % 5 === 0
  );

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">年齢別 収支詳細</h3>
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
                <td className="p-2 text-right font-semibold">
                  {b.netIncome.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted-foreground">単位：万円/年</p>
      </div>
    </div>
  );
}
