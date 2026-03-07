import { useRetirementStore } from "@/store/retirementStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function OtherIncomeForm() {
  const { otherIncome, updateOtherIncome } = useRetirementStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">その他の収入</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employment">就労収入</Label>
          <div className="flex items-center gap-2">
            <Input
              id="employment"
              type="number"
              min={0}
              max={2000}
              value={otherIncome.employmentIncome}
              onChange={(e) =>
                updateOtherIncome({
                  employmentIncome: Number(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">万円/年</span>
          </div>
        </div>

        {otherIncome.employmentIncome > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="employmentEnd">就労終了年齢</Label>
            <Input
              id="employmentEnd"
              type="number"
              min={55}
              max={80}
              value={otherIncome.employmentEndAge ?? 65}
              onChange={(e) =>
                updateOtherIncome({
                  employmentEndAge: Number(e.target.value),
                })
              }
            />
          </div>
        ) : (
          <div />
        )}

        <div className="space-y-2">
          <Label htmlFor="ideco">iDeCo受取額</Label>
          <div className="flex items-center gap-2">
            <Input
              id="ideco"
              type="number"
              min={0}
              max={500}
              value={otherIncome.idecoAmount}
              onChange={(e) =>
                updateOtherIncome({ idecoAmount: Number(e.target.value) })
              }
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">万円/年</span>
          </div>
        </div>
        <div />

        <div className="space-y-2">
          <Label htmlFor="corporate">企業年金受取額</Label>
          <div className="flex items-center gap-2">
            <Input
              id="corporate"
              type="number"
              min={0}
              max={500}
              value={otherIncome.corporatePensionAmount}
              onChange={(e) =>
                updateOtherIncome({
                  corporatePensionAmount: Number(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">万円/年</span>
          </div>
        </div>
        <div />

        <div className="space-y-2">
          <Label htmlFor="realEstate">不動産収入</Label>
          <div className="flex items-center gap-2">
            <Input
              id="realEstate"
              type="number"
              min={0}
              max={2000}
              value={otherIncome.realEstateIncome}
              onChange={(e) =>
                updateOtherIncome({
                  realEstateIncome: Number(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">万円/年</span>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}
