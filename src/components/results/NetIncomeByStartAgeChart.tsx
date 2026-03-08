import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { BasicInfo, PensionInfo, OtherIncome } from "@/types/retirement";
import { runSimulation } from "@/hooks/useSimulation";

interface Props {
  basic: BasicInfo;
  pension: PensionInfo;
  otherIncome: OtherIncome;
}

export function NetIncomeByStartAgeChart({ basic, pension }: Props) {
  const data = useMemo(() => {
    // その他収入をゼロにして年金収入のみでシミュレーション
    const pensionOnlyOtherIncome: OtherIncome = {
      employmentIncome: 0,
      employmentEndAge: null,
      idecoAmount: 0,
      idecoStartAge: 65,
      corporatePensionAmount: 0,
      realEstateIncome: 0,
      dividendIncome: 0,
      dividendTaxMethod: "withholding",
    };

    return Array.from({ length: 16 }, (_, i) => {
      const startAge = 60 + i;
      const input = {
        basic,
        pension: { ...pension, pensionStartAge: startAge },
        otherIncome: pensionOnlyOtherIncome,
      };
      const result = runSimulation(input);

      // 満額受給の最初の年（受給開始年は按分されるため翌年を使用）
      const fullYear =
        result.annualBreakdowns.find((b) => b.age === startAge + 1) ??
        result.annualBreakdowns.find((b) => b.age === startAge);

      if (!fullYear) {
        return { startAge, netIncome: 0, incomeTax: 0, residenceTax: 0, socialInsurance: 0 };
      }

      return {
        startAge,
        netIncome: Math.round(fullYear.netIncome * 10) / 10,
        incomeTax: Math.round(fullYear.incomeTax * 10) / 10,
        residenceTax: Math.round(fullYear.residenceTax * 10) / 10,
        socialInsurance:
          Math.round((fullYear.nursingInsurance + fullYear.healthInsurance) * 10) / 10,
      };
    });
  }, [basic, pension]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <YAxis
            type="category"
            dataKey="startAge"
            tickFormatter={(v) => `${v}歳`}
            fontSize={12}
            width={40}
          />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}`}
            fontSize={12}
            label={{ value: "万円/年", position: "insideBottomRight", fontSize: 11, offset: 0 }}
          />
          <Tooltip
            formatter={(value, name) => [`${Number(value).toFixed(1)}万円`, name]}
            labelFormatter={(label) => `${label}歳受給開始`}
            contentStyle={{ fontSize: 11 }}
            labelStyle={{ fontSize: 11 }}
            itemSorter={(item) => {
              const order: Record<string, number> = { netIncome: 0, socialInsurance: 1, residenceTax: 2, incomeTax: 3 };
              return order[item.dataKey as string] ?? 4;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            content={() => {
              const items = [
                { name: "手取り", color: "#3b82f6" },
                { name: "社会保険料", color: "#f59e0b" },
                { name: "住民税", color: "#ef4444" },
                { name: "所得税", color: "#f87171" },
              ];
              return (
                <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 11 }}>
                  {items.map((item) => (
                    <span key={item.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 10, height: 10, backgroundColor: item.color, display: "inline-block" }} />
                      {item.name}
                    </span>
                  ))}
                </div>
              );
            }}
          />
          <Bar dataKey="netIncome" name="手取り" stackId="a" fill="#3b82f6" />
          <Bar dataKey="socialInsurance" name="社会保険料" stackId="a" fill="#f59e0b" />
          <Bar dataKey="residenceTax" name="住民税" stackId="a" fill="#ef4444" />
          <Bar dataKey="incomeTax" name="所得税" stackId="a" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
