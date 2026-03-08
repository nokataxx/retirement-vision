import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { AnnualBreakdown } from "@/types/retirement";

interface NetIncomeChartProps {
  baselineBreakdowns: AnnualBreakdown[];
  simulatedBreakdowns: AnnualBreakdown[];
  pensionStartAge: number;
  breakEvenAge: number | null;
}

export function NetIncomeChart({
  baselineBreakdowns,
  simulatedBreakdowns,
  pensionStartAge,
  breakEvenAge,
}: NetIncomeChartProps) {
  const data = useMemo(() => {
    const baselineMap = new Map(
      baselineBreakdowns.map((b) => [b.age, b.netIncome])
    );
    const simulatedMap = new Map(
      simulatedBreakdowns.map((b) => [b.age, b.netIncome])
    );

    const allAges = Array.from(
      new Set([
        ...baselineBreakdowns.map((b) => b.age),
        ...simulatedBreakdowns.map((b) => b.age),
      ])
    ).sort((a, b) => a - b);

    let cumulativeBaseline = 0;
    let cumulativeSimulated = 0;

    return allAges.map((age) => {
      cumulativeBaseline += baselineMap.get(age) ?? 0;
      cumulativeSimulated += simulatedMap.get(age) ?? 0;
      return {
        age,
        baseline: Math.round(cumulativeBaseline * 10) / 10,
        simulated: Math.round(cumulativeSimulated * 10) / 10,
      };
    });
  }, [baselineBreakdowns, simulatedBreakdowns]);

  return (
    <div className="border-t pt-6">
      <h3 className="mb-3 text-lg font-semibold">累計手取り額の比較</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="age"
            tickFormatter={(v) => `${v}歳`}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(v) => `${v}`}
            fontSize={12}
            label={{ value: "万円", angle: -90, position: "insideLeft", fontSize: 11, offset: 0 }}
          />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toFixed(1)}万円`,
              name,
            ]}
            labelFormatter={(label) => `${label}歳`}
            contentStyle={{ fontSize: 11 }}
            labelStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine x={65} stroke="#888" strokeDasharray="3 3" />
          {pensionStartAge !== 65 && (
            <ReferenceLine x={pensionStartAge} stroke="#888" strokeDasharray="3 3" />
          )}
          <Line
            type="monotone"
            dataKey="baseline"
            name="65歳受給"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="simulated"
            name={`${pensionStartAge}歳受給`}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      {pensionStartAge !== 65 && (
        <p className="mt-3 text-sm text-center">
          {breakEvenAge !== null ? (
            <>
              損益分岐点：
              <span className="font-bold text-lg">{breakEvenAge}歳</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              想定寿命までに損益分岐点に達しません
            </span>
          )}
        </p>
      )}
    </div>
  );
}
