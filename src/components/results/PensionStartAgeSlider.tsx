import { useRetirementStore } from "@/store/retirementStore";
import { Slider } from "@/components/ui/slider";
import { calcAdjustedPension } from "@/utils/pension";

export function PensionStartAgeSlider() {
  const { pension, updatePension } = useRetirementStore();

  const adjustedPension = calcAdjustedPension(
    pension.pensionAmountAt65,
    pension.pensionStartAge
  );

  const diffFromBase = adjustedPension - pension.pensionAmountAt65;
  const diffRate = ((adjustedPension / pension.pensionAmountAt65 - 1) * 100).toFixed(1);

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-muted-foreground shrink-0">60歳</span>
      <Slider
        min={60}
        max={75}
        step={1}
        value={[pension.pensionStartAge]}
        onValueChange={([v]) => updatePension({ pensionStartAge: v })}
        className="max-w-56"
      />
      <span className="text-muted-foreground shrink-0">75歳</span>
      <span className="text-muted-foreground shrink-0">
        調整後：<span className="font-medium text-foreground">{adjustedPension.toFixed(1)}</span>万円
        <span className={`ml-1 ${diffFromBase >= 0 ? "text-green-600" : "text-red-600"}`}>
          ({diffFromBase >= 0 ? "+" : ""}{diffRate}%)
        </span>
      </span>
    </div>
  );
}
