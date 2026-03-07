import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BasicInfo,
  PensionInfo,
  OtherIncome,
  SimulationInput,
} from "@/types/retirement";

interface RetirementStore extends SimulationInput {
  updateBasic: (updates: Partial<BasicInfo>) => void;
  updatePension: (updates: Partial<PensionInfo>) => void;
  updateOtherIncome: (updates: Partial<OtherIncome>) => void;
  reset: () => void;
}

const defaultBasic: BasicInfo = {
  currentAge: 60,
  birthMonth: 4,
  lifeExpectancy: 90,
  hasSpouse: false,
  spouseAge: null,
};

const defaultPension: PensionInfo = {
  pensionAmountAt65: 180,
  pensionStartAge: 65,
  spousePensionAmount: 0,
  hasKakyuPension: false,
};

const defaultOtherIncome: OtherIncome = {
  employmentIncome: 0,
  employmentEndAge: null,
  idecoAmount: 0,
  idecoStartAge: 65,
  corporatePensionAmount: 0,
  realEstateIncome: 0,
};

export const useRetirementStore = create<RetirementStore>()(
  persist(
    (set) => ({
      basic: defaultBasic,
      pension: defaultPension,
      otherIncome: defaultOtherIncome,

      updateBasic: (updates) =>
        set((state) => ({ basic: { ...state.basic, ...updates } })),

      updatePension: (updates) =>
        set((state) => ({ pension: { ...state.pension, ...updates } })),

      updateOtherIncome: (updates) =>
        set((state) => ({
          otherIncome: { ...state.otherIncome, ...updates },
        })),

      reset: () =>
        set({
          basic: defaultBasic,
          pension: defaultPension,
          otherIncome: defaultOtherIncome,
        }),
    }),
    {
      name: "retirement-vision-store",
    }
  )
);
