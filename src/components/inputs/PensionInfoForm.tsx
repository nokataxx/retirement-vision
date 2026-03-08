import { useRetirementStore } from "@/store/retirementStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PensionInfoForm() {
  const { basic, pension, updatePension } = useRetirementStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">年金情報</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="pensionAmount" className="cursor-help whitespace-nowrap">
                年金見込み額（65歳受給時）
              </Label>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={4} className="max-w-72">
              <p>ねんきん定期便の「老齢基礎年金＋老齢厚生年金」の合計額</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2">
            <Input
              id="pensionAmount"
              type="number"
              min={0}
              max={500}
              value={pension.pensionAmountAt65}
              onChange={(e) =>
                updatePension({ pensionAmountAt65: Number(e.target.value) })
              }
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">万円/年</span>
          </div>
        </div>
      </div>

      {basic.hasSpouse && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spousePension">配偶者の年金</Label>
            <div className="flex items-center gap-2">
              <Input
                id="spousePension"
                type="number"
                min={0}
                max={500}
                value={pension.spousePensionAmount}
                onChange={(e) =>
                  updatePension({
                    spousePensionAmount: Number(e.target.value),
                  })
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">万円/年</span>
            </div>
          </div>

          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="hasKakyu" className="cursor-help">加給年金</Label>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" sideOffset={4} className="max-w-64">
                <p>厚生年金の加入期間が20年以上ある場合に該当します。配偶者が65歳未満の間、約39万円/年が加算されます。</p>
              </TooltipContent>
            </Tooltip>
            <Select
              value={pension.hasKakyuPension ? "yes" : "no"}
              onValueChange={(v) =>
                updatePension({ hasKakyuPension: v === "yes" })
              }
            >
              <SelectTrigger id="hasKakyu">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">あり</SelectItem>
                <SelectItem value="no">なし</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
