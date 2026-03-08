import { useMemo } from "react";
import { useRetirementStore } from "@/store/retirementStore";
import { useSimulation } from "@/hooks/useSimulation";
import { InputPanel } from "@/components/inputs/InputPanel";
import { BreakdownTable } from "@/components/results/BreakdownTable";
import { PensionStartAgeSlider } from "@/components/results/PensionStartAgeSlider";
import { NetIncomeChart } from "@/components/results/NetIncomeChart";
import { PensionStartAgeComparisonTable } from "@/components/results/PensionStartAgeComparisonTable";
import { NetIncomeByStartAgeChart } from "@/components/results/NetIncomeByStartAgeChart";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const { basic, pension, otherIncome } = useRetirementStore();
  const result = useSimulation({ basic, pension, otherIncome });

  // 65歳受給のベースライン（比較用）
  const baselineInput = useMemo(
    () => ({ basic, pension: { ...pension, pensionStartAge: 65 }, otherIncome }),
    [basic, pension, otherIncome]
  );
  const baselineResult = useSimulation(baselineInput);

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-xl font-bold">Retirement Vision</h1>
          <p className="text-sm text-muted-foreground">
            年金手取り最適化シミュレーター
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border bg-card p-4">
            <InputPanel />
          </aside>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold mt-4">年齢別 収支詳細</h3>
            <BreakdownTable
              breakdowns={baselineResult.annualBreakdowns}
              pensionStartAge={65}
              subtitle="65歳受給（ベースライン）"
            />
            <div className="pt-6 border-t">
              <BreakdownTable
                breakdowns={result.annualBreakdowns}
                pensionStartAge={pension.pensionStartAge}
                subtitle={`${pension.pensionStartAge}歳受給シミュレーション`}
                headerSlot={<PensionStartAgeSlider />}
              />
            </div>
            <NetIncomeChart
              baselineBreakdowns={baselineResult.annualBreakdowns}
              simulatedBreakdowns={result.annualBreakdowns}
              pensionStartAge={pension.pensionStartAge}
              breakEvenAge={result.summary.breakEvenAge}
            />
            <PensionStartAgeComparisonTable
              basic={basic}
              pension={pension}
              otherIncome={otherIncome}
            />
            <NetIncomeByStartAgeChart
              basic={basic}
              pension={pension}
              otherIncome={otherIncome}
            />
          </div>
        </div>
      </main>

      <footer className="border-t text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <p>
            本ツールの計算結果は参考値です。税率・保険料率は東京都新宿区の令和6年度基準を使用しています。
            正確な年金額はねんきんネットまたは年金事務所でご確認ください。
          </p>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}

export default App;
