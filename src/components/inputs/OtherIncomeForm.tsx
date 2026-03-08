import { useRetirementStore } from "@/store/retirementStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

        <div className="space-y-2">
          <Label htmlFor="dividend">配当所得</Label>
          <div className="flex items-center gap-2">
            <Input
              id="dividend"
              type="number"
              min={0}
              max={5000}
              value={otherIncome.dividendIncome}
              onChange={(e) =>
                updateOtherIncome({
                  dividendIncome: Number(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">万円/年</span>
          </div>
        </div>

        {otherIncome.dividendIncome > 0 ? (
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="dividendTaxMethod" className="cursor-help">課税方式</Label>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" sideOffset={4} className="max-w-72">
                <p>
                  <strong>源泉徴収：</strong>20.315%が天引きされ、社会保険料に影響しません。
                </p>
                <p className="mt-1">
                  <strong>確定申告：</strong>総所得に算入され、社会保険料にも影響します。
                </p>
              </TooltipContent>
            </Tooltip>
            <select
              id="dividendTaxMethod"
              value={otherIncome.dividendTaxMethod}
              onChange={(e) =>
                updateOtherIncome({
                  dividendTaxMethod: e.target.value as "withholding" | "declaration",
                })
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              <option value="withholding">源泉徴収</option>
              <option value="declaration">確定申告</option>
            </select>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
