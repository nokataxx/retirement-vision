/** 繰り上げ減額率（1ヶ月あたり） */
const EARLY_CLAIM_RATE_PER_MONTH = 0.004;

/** 繰り下げ増額率（1ヶ月あたり） */
const DEFERRED_CLAIM_RATE_PER_MONTH = 0.007;

/** 加給年金の年額（万円） */
export const KAKYU_PENSION_ANNUAL = 39;

/** 在職老齢年金の基準額（万円/月） */
const IN_SERVICE_THRESHOLD = 50;

/**
 * 繰り上げ・繰り下げ後の年金額を計算
 * @param pensionAt65 65歳時の年金見込み額（万円/年）
 * @param startAge 受給開始年齢
 * @returns 調整後の年金額（万円/年）
 */
export function calcAdjustedPension(
  pensionAt65: number,
  startAge: number
): number {
  const monthsDiff = (startAge - 65) * 12;

  if (startAge < 65) {
    // 繰り上げ：減額
    const rate = 1 - EARLY_CLAIM_RATE_PER_MONTH * Math.abs(monthsDiff);
    return Math.round(pensionAt65 * rate * 100) / 100;
  } else if (startAge > 65) {
    // 繰り下げ：増額
    const rate = 1 + DEFERRED_CLAIM_RATE_PER_MONTH * monthsDiff;
    return Math.round(pensionAt65 * rate * 100) / 100;
  }

  return pensionAt65;
}

/**
 * 在職老齢年金の減額を計算
 * 給与（月額）+ 年金（月額）が50万円を超える場合、超過分の1/2が年金から減額
 * @param monthlyPension 年金月額（万円）
 * @param monthlyEmployment 就労収入月額（万円）
 * @returns 年間の減額分（万円/年）
 */
export function calcInServicePensionReduction(
  monthlyPension: number,
  monthlyEmployment: number
): number {
  const total = monthlyPension + monthlyEmployment;
  if (total <= IN_SERVICE_THRESHOLD) return 0;

  const monthlyReduction = (total - IN_SERVICE_THRESHOLD) / 2;
  // 減額は年金月額を超えない
  const actualReduction = Math.min(monthlyReduction, monthlyPension);
  return Math.round(actualReduction * 12 * 100) / 100;
}

/**
 * 特定の年齢での年金収入を計算
 * @param age 対象年齢
 * @param pensionAt65 65歳時の年金見込み額（万円/年）
 * @param startAge 受給開始年齢
 * @param hasKakyu 加給年金の有無
 * @param spouseAge 配偶者の年齢（加給年金判定用）
 * @param currentAge 本人の現在の年齢（配偶者年齢の差分計算用）
 * @param birthMonth 誕生月（1〜12）。受給開始年の按分に使用
 * @returns 年金収入（万円/年）
 */
export function calcPensionIncomeAtAge(
  age: number,
  pensionAt65: number,
  startAge: number,
  hasKakyu: boolean,
  spouseAge: number | null,
  currentAge: number,
  birthMonth: number
): number {
  if (age < startAge) return 0;

  let pension = calcAdjustedPension(pensionAt65, startAge);

  // 加給年金：配偶者が65歳未満の間のみ加算
  if (hasKakyu && spouseAge !== null) {
    const spouseAgeAtYear = spouseAge + (age - currentAge);
    if (spouseAgeAtYear < 65) {
      pension += KAKYU_PENSION_ANNUAL;
    }
  }

  // 受給開始年は誕生月の翌月からの按分（2日以降生まれ前提）
  if (age === startAge) {
    const monthsReceiving = 12 - birthMonth;
    pension = Math.round((pension * monthsReceiving) / 12 * 100) / 100;
  }

  return pension;
}
