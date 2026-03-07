import { BasicInfoForm } from "./BasicInfoForm";
import { PensionInfoForm } from "./PensionInfoForm";
import { OtherIncomeForm } from "./OtherIncomeForm";

export function InputPanel() {
  return (
    <div className="space-y-6">
      <BasicInfoForm />
      <hr className="border-border" />
      <PensionInfoForm />
      <hr className="border-border" />
      <OtherIncomeForm />
    </div>
  );
}
