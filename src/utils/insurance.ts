/**
 * 社会保険料計算ロジック（東京都新宿区・令和6年度基準）
 * Phase 1 では簡易版を実装し、Phase 2 で詳細化する
 */

/** 介護保険の基準額（万円/月） */
const NURSING_BASE_MONTHLY = 0.7;

/**
 * 介護保険料を計算（65歳以上）
 * 所得段階別の倍率を簡易的に適用
 * @param totalIncome 合計所得（万円/年）
 * @param age 年齢
 * @returns 介護保険料（万円/年）
 */
export function calcNursingInsurance(
  totalIncome: number,
  age: number
): number {
  if (age < 65) return 0;

  // 所得段階別の倍率（簡易版）
  let multiplier: number;
  if (totalIncome <= 80) {
    multiplier = 0.3;
  } else if (totalIncome <= 120) {
    multiplier = 0.5;
  } else if (totalIncome <= 200) {
    multiplier = 0.7;
  } else if (totalIncome <= 300) {
    multiplier = 1.0;
  } else if (totalIncome <= 500) {
    multiplier = 1.25;
  } else if (totalIncome <= 700) {
    multiplier = 1.5;
  } else {
    multiplier = 1.7;
  }

  return Math.round(NURSING_BASE_MONTHLY * 12 * multiplier * 100) / 100;
}

/**
 * 国民健康保険料を計算（退職後〜75歳未満）
 * 医療分 + 支援金分で計算（介護分は calcNursingInsurance で別途計算）
 * @param totalIncome 合計所得（万円/年）
 * @param age 年齢
 * @returns 国保保険料（万円/年）
 */
export function calcNationalHealthInsurance(
  totalIncome: number,
  age: number
): number {
  if (age >= 75) return 0;

  // 基礎控除後の所得
  const taxableBase = Math.max(totalIncome - 43, 0);

  // 医療分：所得割7.17% + 均等割4.51万円
  const medicalRate = 0.0717;
  const medicalFlat = 4.51;
  const medicalMax = 65; // 上限65万円
  const medical = Math.min(taxableBase * medicalRate + medicalFlat, medicalMax);

  // 支援金分：所得割2.42% + 均等割1.52万円
  const supportRate = 0.0242;
  const supportFlat = 1.52;
  const supportMax = 24; // 上限24万円
  const support = Math.min(taxableBase * supportRate + supportFlat, supportMax);

  return Math.round((medical + support) * 100) / 100;
}

/**
 * 後期高齢者医療保険料を計算（75歳以上）
 * @param totalIncome 合計所得（万円/年）
 * @param age 年齢
 * @returns 後期高齢者医療保険料（万円/年）
 */
export function calcLateElderlyInsurance(
  totalIncome: number,
  age: number
): number {
  if (age < 75) return 0;

  // 基礎控除後の所得
  const taxableBase = Math.max(totalIncome - 43, 0);

  // 均等割約4万円 + 所得割約9%
  const flatAmount = 4;
  const incomeRate = 0.09;
  const maxAmount = 80; // 上限80万円

  return Math.round(Math.min(taxableBase * incomeRate + flatAmount, maxAmount) * 100) / 100;
}

/**
 * 社会保険料の合計を計算
 * @param totalIncome 合計所得（万円/年）
 * @param age 年齢
 * @returns { nursing, health, total } 各保険料と合計（万円/年）
 */
export function calcTotalInsurance(
  totalIncome: number,
  age: number
): { nursing: number; health: number; total: number } {
  const nursing = calcNursingInsurance(totalIncome, age);
  const health =
    age >= 75
      ? calcLateElderlyInsurance(totalIncome, age)
      : calcNationalHealthInsurance(totalIncome, age);

  return {
    nursing,
    health,
    total: Math.round((nursing + health) * 100) / 100,
  };
}
