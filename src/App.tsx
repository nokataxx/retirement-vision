import { useRetirementStore } from "@/store/retirementStore";
import { useSimulation } from "@/hooks/useSimulation";
import { InputPanel } from "@/components/inputs/InputPanel";
import { SummaryCards } from "@/components/results/SummaryCards";
import { BreakdownTable } from "@/components/results/BreakdownTable";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const { basic, pension, otherIncome } = useRetirementStore();
  const result = useSimulation({ basic, pension, otherIncome });

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <h1 className="text-xl font-bold">年金手取り最適化シミュレーター</h1>
        <p className="text-sm text-muted-foreground">
          受給開始年齢による手取り額の変化を比較できます
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border bg-card p-4">
            <InputPanel />
          </aside>

          <div className="space-y-6">
            <SummaryCards
              summary={result.summary}
              pensionStartAge={pension.pensionStartAge}
            />
            <BreakdownTable breakdowns={result.annualBreakdowns} />
          </div>
        </div>
      </main>

      <footer className="border-t px-6 py-4 text-xs text-muted-foreground">
        <p>
          本ツールの計算結果は参考値です。税率・保険料率は東京都新宿区の令和6年度基準を使用しています。
          正確な年金額はねんきんネットまたは年金事務所でご確認ください。
        </p>
      </footer>
    </div>
    </TooltipProvider>
  );
}

export default App;
