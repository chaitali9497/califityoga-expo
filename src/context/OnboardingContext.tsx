import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/* ---------- Types ---------- */

export type SleepDuration =
  | "Less than 6 hours"
  | "6 - 7 hours"
  | "7 - 8 hours"
  | "8 - 9 hours"
  | "More than 9 hours"
  | null;

export type WakeUpTime = string | null;

/** Step 3 */
export type EndDayTime = string | null;

/** Step 4 */
export type ProcrastinationLevel =
  | "Always"
  | "Sometimes"
  | "Rarely"
  | "Never"
  | null;

/* ---------- Context Type ---------- */

interface OnboardingContextType {
  /** Step 1 */
  sleepDuration: SleepDuration;
  setSleepDuration: (value: SleepDuration) => void;

  /** Step 2 */
  wakeUpTime: WakeUpTime;
  setWakeUpTime: (value: WakeUpTime) => void;

  /** Step 3 */
  endDayTime: EndDayTime;
  setEndDayTime: (value: EndDayTime) => void;

  /** Step 4 */
  procrastination: ProcrastinationLevel;
  setProcrastination: (value: ProcrastinationLevel) => void;
}

/* ---------- Context ---------- */

const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

/* ---------- Provider ---------- */

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({
  children,
}: OnboardingProviderProps) => {
  const [sleepDuration, setSleepDuration] =
    useState<SleepDuration>(null);

  const [wakeUpTime, setWakeUpTime] =
    useState<WakeUpTime>(null);

  const [endDayTime, setEndDayTime] =
    useState<EndDayTime>(null);

  const [procrastination, setProcrastination] =
    useState<ProcrastinationLevel>(null);

  return (
    <OnboardingContext.Provider
      value={{
        sleepDuration,
        setSleepDuration,
        wakeUpTime,
        setWakeUpTime,
        endDayTime,
        setEndDayTime,
        procrastination,
        setProcrastination,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used within an OnboardingProvider"
    );
  }

  return context;
};
