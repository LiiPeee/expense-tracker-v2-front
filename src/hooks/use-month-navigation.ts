import { getDefaultYearMonth, getMonthNames } from "@/helper/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type MonthNavigation = {
  month: number;
  year: number;
  label: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};

export function useMonthNavigation(): MonthNavigation {
  const { i18n } = useTranslation();
  const initial = getDefaultYearMonth();
  const [{ month, year }, setCursor] = useState({ month: initial.month, year: initial.year });

  function shiftBy(monthDelta: number) {
    setCursor((current) => {
      const shifted = new Date(current.year, current.month - 1 + monthDelta, 1);
      return { month: shifted.getMonth() + 1, year: shifted.getFullYear() };
    });
  }

  return {
    month,
    year,
    label: `${getMonthNames(i18n.language)[month - 1]} ${year}`,
    goToPreviousMonth: () => shiftBy(-1),
    goToNextMonth: () => shiftBy(1),
  };
}
