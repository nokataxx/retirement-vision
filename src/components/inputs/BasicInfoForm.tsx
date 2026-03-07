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
export function BasicInfoForm() {
  const { basic, updateBasic } = useRetirementStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">基本情報</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentAge">現在の年齢</Label>
          <Input
            id="currentAge"
            type="number"
            min={50}
            max={80}
            value={basic.currentAge}
            onChange={(e) =>
              updateBasic({ currentAge: Number(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthMonth">誕生月</Label>
          <Select
            value={String(basic.birthMonth)}
            onValueChange={(v) => updateBasic({ birthMonth: Number(v) })}
          >
            <SelectTrigger id="birthMonth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={String(month)}>
                  {month}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lifeExpectancy">想定寿命</Label>
          <Select
            value={String(basic.lifeExpectancy)}
            onValueChange={(v) => updateBasic({ lifeExpectancy: Number(v) })}
          >
            <SelectTrigger id="lifeExpectancy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="85">85歳</SelectItem>
              <SelectItem value="90">90歳</SelectItem>
              <SelectItem value="95">95歳</SelectItem>
              <SelectItem value="100">100歳</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div />

        <div className="space-y-2">
          <Label htmlFor="hasSpouse">配偶者の有無</Label>
          <Select
            value={basic.hasSpouse ? "yes" : "no"}
            onValueChange={(v) => {
              const hasSpouse = v === "yes";
              updateBasic({
                hasSpouse,
                spouseAge: hasSpouse ? basic.spouseAge ?? 60 : null,
              });
            }}
          >
            <SelectTrigger id="hasSpouse">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">あり</SelectItem>
              <SelectItem value="no">なし</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {basic.hasSpouse && (
          <div className="space-y-2">
            <Label htmlFor="spouseAge">配偶者の年齢</Label>
            <Input
              id="spouseAge"
              type="number"
              min={40}
              max={90}
              value={basic.spouseAge ?? 60}
              onChange={(e) =>
                updateBasic({ spouseAge: Number(e.target.value) })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
