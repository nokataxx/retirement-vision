import { useMemo } from "react";
import type { BasicInfo, PensionInfo, OtherIncome } from "@/types/retirement";
import { runSimulation } from "@/hooks/useSimulation";
import { calcAdjustedPension } from "@/utils/pension";

interface Props {
  basic: BasicInfo;
  pension: PensionInfo;
  otherIncome: OtherIncome;
}

export function PensionStartAgeComparisonTable({ basic, pension, otherIncome }: Props) {
  const rows = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const startAge = 60 + i;
      const input = {
        basic,
        pension: { ...pension, pensionStartAge: startAge },
        otherIncome,
      };
      const result = runSimulation(input);

      // 受給開始年の年間額面年金額
      const adjustedPension = calcAdjustedPension(
        pension.pensionAmountAt65,
        startAge
      );

      // 満額受給の最初の年（受給開始年は按分されるため翌年を使用）
      const fullYear = result.annualBreakdowns.find((b) => b.age === startAge + 1)
        ?? result.annualBreakdowns.find((b) => b.age === startAge);
      const taxAndInsurance = fullYear
        ? fullYear.incomeTax +
          fullYear.residenceTax +
          fullYear.nursingInsurance +
          fullYear.healthInsurance
        : 0;

      const netAnnual = fullYear ? fullYear.netIncome : 0;

      const netRate =
        fullYear && fullYear.totalIncome > 0
          ? Math.round((fullYear.netIncome / fullYear.totalIncome) * 1000) / 10
          : 0;

      // 損益分岐点は100歳まで延長して計算（想定寿命に依存しない）
      const extendedInput = {
        basic: { ...basic, lifeExpectancy: 100 },
        pension: { ...pension, pensionStartAge: startAge },
        otherIncome,
      };
      const extendedResult = runSimulation(extendedInput);

      return {
        startAge,
        adjustedPension,
        taxAndInsurance,
        netAnnual,
        netRate,
        lifetimeNetIncome: result.summary.lifetimeNetIncome,
        breakEvenAge: extendedResult.summary.breakEvenAge,
      };
    });
  }, [basic, pension, otherIncome]);

  return (
    <div className="border-t pt-6">
      <h3 className="mb-3 text-lg font-semibold">受給開始年齢別 比較表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2 text-center">受給開始</th>
              <th className="p-2 pr-6 text-right">年金額（額面）</th>
              <th className="p-2 text-right">税・保険料</th>
              <th className="p-2 text-right">手取り年額</th>
              <th className="p-2 text-right">手取り率</th>
              <th className="p-2 text-right">生涯手取り</th>
              <th className="p-2 text-center">損益分岐点</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.startAge}
                className={`border-b hover:bg-muted/50 ${
                  r.startAge === 65 ? "bg-muted/30 font-semibold" : ""
                }`}
              >
                <td className="p-2 text-center">{r.startAge}歳</td>
                <td className="p-2 pr-12 text-right">
                  {r.adjustedPension.toFixed(1)}
                </td>
                <td className="p-2 pr-6 text-right text-red-600">
                  {r.taxAndInsurance > 0
                    ? `-${r.taxAndInsurance.toFixed(1)}`
                    : "—"}
                </td>
                <td className="p-2 pr-6 text-right">{r.netAnnual.toFixed(1)}</td>
                <td className="p-2 pr-2 text-right">{r.netRate.toFixed(1)}%</td>
                <td className="p-2 pr-6 text-right">
                  {r.lifetimeNetIncome.toFixed(1)}
                </td>
                <td className="p-2 text-center">
                  {r.startAge === 65
                    ? "—"
                    : r.breakEvenAge
                      ? `${r.breakEvenAge}歳`
                      : "なし"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted-foreground">
          単位：万円/年（生涯手取りは万円） 税・保険料・手取りは満額受給年の値、損益分岐点は65歳受給との比較です。
        </p>
      </div>
    </div>
  );
}
