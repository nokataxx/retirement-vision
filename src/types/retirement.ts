/** 基本情報 */
export interface BasicInfo {
  currentAge: number;
  /** 誕生月（1〜12） */
  birthMonth: number;
  lifeExpectancy: number; // 85, 90, 95, 100
  hasSpouse: boolean;
  spouseAge: number | null;
}

/** 年金情報 */
export interface PensionInfo {
  /** 年金見込み額（65歳受給時、万円/年） */
  pensionAmountAt65: number;
  /** 受給開始年齢 */
  pensionStartAge: number;
  /** 配偶者の年金見込み額（万円/年） */
  spousePensionAmount: number;
  /** 加給年金の有無 */
  hasKakyuPension: boolean;
}

/** その他の収入 */
export interface OtherIncome {
  /** 就労収入（万円/年） */
  employmentIncome: number;
  /** 就労終了年齢 */
  employmentEndAge: number | null;
  /** iDeCo受取額（万円/年） */
  idecoAmount: number;
  /** iDeCo受取開始年齢 */
  idecoStartAge: number;
  /** 企業年金受取額（万円/年） */
  corporatePensionAmount: number;
  /** 不動産収入（万円/年） */
  realEstateIncome: number;
  /** 配当所得（万円/年） */
  dividendIncome: number;
  /** 配当の課税方式: withholding=源泉徴収(申告不要), declaration=確定申告 */
  dividendTaxMethod: "withholding" | "declaration";
}

/** 全入力パラメータ */
export interface SimulationInput {
  basic: BasicInfo;
  pension: PensionInfo;
  otherIncome: OtherIncome;
}

/** 年齢ごとの収支詳細 */
export interface AnnualBreakdown {
  age: number;
  /** 年金収入（額面、万円） */
  pensionIncome: number;
  /** その他収入（万円） */
  otherIncome: number;
  /** 合計収入（万円） */
  totalIncome: number;
  /** 所得税（万円） */
  incomeTax: number;
  /** 住民税（万円） */
  residenceTax: number;
  /** 介護保険料（万円） */
  nursingInsurance: number;
  /** 医療保険料（万円） */
  healthInsurance: number;
  /** 在職老齢年金の減額（万円） */
  pensionReduction: number;
  /** 配当源泉徴収税額（万円） */
  dividendWithholdingTax: number;
  /** 手取り合計（万円） */
  netIncome: number;
}

/** サマリー結果 */
export interface SimulationSummary {
  /** 年金月額（額面、万円/月） */
  monthlyPensionGross: number;
  /** 年金月額（手取り、万円/月） */
  monthlyPensionNet: number;
  /** 手取り率（%） */
  netIncomeRate: number;
  /** 生涯手取り総受取額（万円） */
  lifetimeNetIncome: number;
  /** 損益分岐点年齢（65歳受給と比較） */
  breakEvenAge: number | null;
}

/** シミュレーション結果 */
export interface SimulationResult {
  summary: SimulationSummary;
  annualBreakdowns: AnnualBreakdown[];
}
