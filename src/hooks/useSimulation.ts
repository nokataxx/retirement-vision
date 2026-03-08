import { useMemo } from "react";
import type {
  SimulationInput,
  SimulationResult,
  AnnualBreakdown,
  SimulationSummary,
} from "@/types/retirement";
import {
  calcPensionIncomeAtAge,
  calcInServicePensionReduction,
} from "@/utils/pension";
import { calcTaxableIncome, calcIncomeTax, calcResidenceTax } from "@/utils/tax";
import { calcTotalInsurance } from "@/utils/insurance";

function calcOtherIncomeAtAge(
  age: number,
  input: SimulationInput
): number {
  const { otherIncome, basic } = input;
  let total = 0;

  // 就労収入（就労終了年は誕生月で按分）
  if (
    otherIncome.employmentIncome > 0 &&
    (otherIncome.employmentEndAge === null || age <= otherIncome.employmentEndAge)
  ) {
    let employment = otherIncome.employmentIncome;
    if (otherIncome.employmentEndAge !== null && age === otherIncome.employmentEndAge) {
      // 就労終了年：誕生月末で退職と仮定
      employment = Math.round((employment * basic.birthMonth) / 12 * 100) / 100;
    }
    total += employment;
  }

  // iDeCo
  if (otherIncome.idecoAmount > 0 && age >= otherIncome.idecoStartAge) {
    total += otherIncome.idecoAmount;
  }

  // 企業年金
  if (otherIncome.corporatePensionAmount > 0) {
    total += otherIncome.corporatePensionAmount;
  }

  // 不動産収入
  if (otherIncome.realEstateIncome > 0) {
    total += otherIncome.realEstateIncome;
  }

  // 配当所得（確定申告する分のみ合算。源泉徴収の場合は別途処理）
  if (otherIncome.dividendIncome > 0 && otherIncome.dividendTaxMethod === "declaration") {
    total += otherIncome.dividendIncome;
  }

  return total;
}

function calcAnnualBreakdown(
  age: number,
  input: SimulationInput
): AnnualBreakdown {
  const { basic, pension } = input;

  // 年金収入（受給開始年は誕生月で按分）
  let pensionIncome = calcPensionIncomeAtAge(
    age,
    pension.pensionAmountAt65,
    pension.pensionStartAge,
    pension.hasKakyuPension,
    basic.spouseAge,
    basic.currentAge,
    basic.birthMonth
  );

  // 配偶者の年金（配偶者が65歳以上の場合に年金収入として加算）
  if (
    basic.hasSpouse &&
    basic.spouseAge !== null &&
    pension.spousePensionAmount > 0
  ) {
    const spouseAgeAtYear = basic.spouseAge + (age - basic.currentAge);
    if (spouseAgeAtYear >= 65) {
      pensionIncome += pension.spousePensionAmount;
    }
  }

  // その他収入（就労終了年は誕生月で按分）
  const otherIncome = calcOtherIncomeAtAge(age, input);

  // 在職老齢年金の減額
  let pensionReduction = 0;
  const employmentIncome = input.otherIncome.employmentIncome;
  if (
    employmentIncome > 0 &&
    pensionIncome > 0 &&
    (input.otherIncome.employmentEndAge === null ||
      age <= input.otherIncome.employmentEndAge)
  ) {
    pensionReduction = calcInServicePensionReduction(
      pensionIncome / 12,
      employmentIncome / 12
    );
    pensionIncome = Math.max(pensionIncome - pensionReduction, 0);
  }

  const totalIncome = pensionIncome + otherIncome;

  // 社会保険料
  const insurance = calcTotalInsurance(totalIncome, age);

  // 税金
  // 年金収入部分のみ公的年金等控除の対象、その他収入は給与所得控除なし（簡略化）
  const taxableIncome = calcTaxableIncome(
    pensionIncome,
    otherIncome,
    age,
    insurance.total
  );
  const incomeTax = calcIncomeTax(taxableIncome);
  const residenceTax = calcResidenceTax(taxableIncome);

  // 配当の源泉徴収税額（源泉徴収ありの場合のみ）
  const dividendWithholdingTax =
    input.otherIncome.dividendIncome > 0 && input.otherIncome.dividendTaxMethod === "withholding"
      ? Math.round(input.otherIncome.dividendIncome * 0.20315 * 100) / 100
      : 0;

  // 源泉徴収の場合：配当の手取り分（税引後）を加算
  const dividendNetIncome =
    input.otherIncome.dividendIncome > 0 && input.otherIncome.dividendTaxMethod === "withholding"
      ? input.otherIncome.dividendIncome - dividendWithholdingTax
      : 0;

  const netIncome = Math.round(
    (totalIncome + dividendNetIncome - incomeTax - residenceTax - insurance.total) * 100
  ) / 100;

  return {
    age,
    pensionIncome,
    otherIncome: otherIncome + (input.otherIncome.dividendTaxMethod === "withholding" ? input.otherIncome.dividendIncome : 0),
    totalIncome: totalIncome + (input.otherIncome.dividendTaxMethod === "withholding" ? input.otherIncome.dividendIncome : 0),
    incomeTax,
    residenceTax,
    nursingInsurance: insurance.nursing,
    healthInsurance: insurance.health,
    pensionReduction,
    dividendWithholdingTax,
    netIncome: Math.max(netIncome, 0),
  };
}

function calcBreakEvenAge(
  breakdowns: AnnualBreakdown[],
  input: SimulationInput
): number | null {
  if (input.pension.pensionStartAge === 65) return null;

  // 65歳受給の場合のシミュレーションと比較
  const baseInput: SimulationInput = {
    ...input,
    pension: { ...input.pension, pensionStartAge: 65 },
  };

  let cumulativeCurrent = 0;
  let cumulativeBase = 0;

  for (const bd of breakdowns) {
    const baseBd = calcAnnualBreakdown(bd.age, baseInput);
    cumulativeCurrent += bd.netIncome;
    cumulativeBase += baseBd.netIncome;

    // 繰り下げの場合：累計が65歳受給を上回った時点
    if (input.pension.pensionStartAge > 65 && cumulativeCurrent > cumulativeBase) {
      return bd.age;
    }
    // 繰り上げの場合：累計が65歳受給を下回った時点
    if (input.pension.pensionStartAge < 65 && cumulativeCurrent < cumulativeBase) {
      return bd.age;
    }
  }

  return null;
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const { basic, pension } = input;
  const startAge = Math.min(pension.pensionStartAge, basic.currentAge);
  const endAge = basic.lifeExpectancy;

  const annualBreakdowns: AnnualBreakdown[] = [];
  for (let age = startAge; age <= endAge; age++) {
    annualBreakdowns.push(calcAnnualBreakdown(age, input));
  }

  // 受給開始年齢の年の手取りでサマリーを計算
  const startYearBreakdown =
    annualBreakdowns.find((b) => b.age === pension.pensionStartAge) ??
    annualBreakdowns[0];

  const monthlyGross = Math.round((startYearBreakdown.pensionIncome / 12) * 100) / 100;
  const monthlyNet = Math.round((startYearBreakdown.netIncome / 12) * 100) / 100;
  const netRate =
    startYearBreakdown.totalIncome > 0
      ? Math.round((startYearBreakdown.netIncome / startYearBreakdown.totalIncome) * 1000) / 10
      : 0;

  const lifetimeNetIncome = Math.round(
    annualBreakdowns.reduce((sum, b) => sum + b.netIncome, 0) * 100
  ) / 100;

  const breakEvenAge = calcBreakEvenAge(annualBreakdowns, input);

  const summary: SimulationSummary = {
    monthlyPensionGross: monthlyGross,
    monthlyPensionNet: monthlyNet,
    netIncomeRate: netRate,
    lifetimeNetIncome,
    breakEvenAge,
  };

  return { summary, annualBreakdowns };
}

export function useSimulation(input: SimulationInput): SimulationResult {
  return useMemo(() => runSimulation(input), [
    input.basic.currentAge,
    input.basic.birthMonth,
    input.basic.lifeExpectancy,
    input.basic.hasSpouse,
    input.basic.spouseAge,
    input.pension.pensionAmountAt65,
    input.pension.pensionStartAge,
    input.pension.hasKakyuPension,
    input.pension.spousePensionAmount,
    input.otherIncome.employmentIncome,
    input.otherIncome.employmentEndAge,
    input.otherIncome.idecoAmount,
    input.otherIncome.idecoStartAge,
    input.otherIncome.corporatePensionAmount,
    input.otherIncome.realEstateIncome,
    input.otherIncome.dividendIncome,
    input.otherIncome.dividendTaxMethod,
  ]);
}
