/**
 * 税金計算ロジック（東京都新宿区・令和6年度基準）
 */

/** 基礎控除（万円） */
const BASIC_DEDUCTION = 48;

/** 住民税均等割（万円） */
const RESIDENCE_TAX_FLAT = 0.5;

/** 復興特別所得税率 */
const RECONSTRUCTION_TAX_RATE = 1.021;

/**
 * 公的年金等控除額を計算
 * @param pensionIncome 年金収入（万円/年）
 * @param age 年齢
 * @returns 控除額（万円）
 */
export function calcPensionDeduction(
  pensionIncome: number,
  age: number
): number {
  if (age >= 65) {
    if (pensionIncome <= 110) return pensionIncome; // 実質ゼロ課税
    if (pensionIncome < 330) return 110;
    if (pensionIncome < 410) return pensionIncome * 0.25 + 27.5;
    if (pensionIncome < 770) return pensionIncome * 0.15 + 68.5;
    return pensionIncome * 0.05 + 145.5;
  } else {
    if (pensionIncome <= 60) return pensionIncome;
    if (pensionIncome < 130) return 60;
    if (pensionIncome < 410) return pensionIncome * 0.25 + 27.5;
    if (pensionIncome < 770) return pensionIncome * 0.15 + 68.5;
    return pensionIncome * 0.05 + 145.5;
  }
}

/** 所得税の累進税率テーブル（万円単位） */
const INCOME_TAX_BRACKETS: { limit: number; rate: number; deduction: number }[] = [
  { limit: 195, rate: 0.05, deduction: 0 },
  { limit: 330, rate: 0.10, deduction: 9.75 },
  { limit: 695, rate: 0.20, deduction: 42.75 },
  { limit: 900, rate: 0.23, deduction: 63.6 },
  { limit: 1800, rate: 0.33, deduction: 153.6 },
  { limit: 4000, rate: 0.40, deduction: 279.6 },
  { limit: Infinity, rate: 0.45, deduction: 479.6 },
];

/**
 * 所得税を計算（復興特別所得税含む）
 * @param taxableIncome 課税所得（万円）
 * @returns 所得税額（万円）
 */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.limit)!;
  const baseTax = taxableIncome * bracket.rate - bracket.deduction;
  return Math.round(baseTax * RECONSTRUCTION_TAX_RATE * 100) / 100;
}

/**
 * 住民税を計算（所得割10% + 均等割5,000円）
 * @param taxableIncome 課税所得（万円）
 * @returns 住民税額（万円）
 */
export function calcResidenceTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.round((taxableIncome * 0.10 + RESIDENCE_TAX_FLAT) * 100) / 100;
}

/**
 * 課税所得を計算
 * @param pensionIncome 年金収入（万円/年）
 * @param otherIncome その他収入（万円/年）
 * @param age 年齢
 * @param socialInsurance 社会保険料合計（万円/年）
 * @returns 課税所得（万円）
 */
export function calcTaxableIncome(
  pensionIncome: number,
  otherIncome: number,
  age: number,
  socialInsurance: number
): number {
  const pensionDeduction = calcPensionDeduction(pensionIncome, age);
  const pensionTaxableIncome = pensionIncome - pensionDeduction;
  const totalIncome = pensionTaxableIncome + otherIncome;
  const taxableIncome = totalIncome - BASIC_DEDUCTION - socialInsurance;
  return Math.max(taxableIncome, 0);
}
