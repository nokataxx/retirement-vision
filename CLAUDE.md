# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Retirement-vision is a Japanese pension take-home pay optimization simulator (年金手取り最適化シミュレーター). It calculates actual take-home pension amounts after taxes and social insurance premiums, allowing users to compare different pension start ages (60-75) and find break-even points. Tax/insurance calculations use Tokyo Shinjuku-ku rates (令和6年度). All data stays in the browser (localStorage only, no server).

See `docs/requirements.md` for the full requirements specification (in Japanese).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

## Tech Stack

- **React 19 + TypeScript** with Vite 7
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** components (Radix UI + CVA) in `src/components/ui/`
- **Zustand** for state management (planned)
- **Recharts** for graphs (planned)
- **react-router** for routing

## Project Structure

The app is early-stage (still has default Vite scaffold in `App.tsx`). The planned architecture from the requirements:

- `src/components/inputs/` — Parameter input forms
- `src/components/charts/` — Chart components (Recharts)
- `src/components/results/` — Result display components
- `src/hooks/useSimulation.ts` — Simulation calculation hook
- `src/store/retirementStore.ts` — Zustand store
- `src/types/retirement.ts` — Type definitions
- `src/utils/pension.ts` — Pension calculation (繰り上げ/繰り下げ)
- `src/utils/tax.ts` — Tax calculation logic
- `src/utils/insurance.ts` — Social insurance calculation

Currently existing:
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/components/ui/button.tsx` — shadcn Button component

## Path Alias

`@/*` maps to `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

## Key Domain Concepts

- Pension amounts are based on 65-year-old baseline from ねんきん定期便
- Early claiming (60-64): -0.4%/month; deferred claiming (66-75): +0.7%/month
- Tax calculation: income tax (progressive 5-45% + 2.1% reconstruction tax) + residence tax (10% + ¥5,000)
- Insurance: nursing care (65+), national health insurance (until 75), late-stage elderly medical (75+)
- In-service pension reduction applies when salary + pension exceeds ¥500k/month
