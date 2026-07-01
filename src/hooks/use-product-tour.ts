import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SEGMENTS = ["dashboard", "transactions", "stocks", "budgets"] as const;
type Segment = (typeof SEGMENTS)[number];

const SEGMENT_ROUTES: Record<Segment, string> = {
  dashboard: "/dashboard",
  transactions: "/transactions-list",
  stocks: "/stocks",
  budgets: "/budgets",
};

const TOUR_DONE_KEY = "product-tour-done";
const TOUR_SEGMENT_KEY = "product-tour-segment";

function getSteps(segment: Segment, t: (k: string) => string) {
  const steps: Record<Segment, { element: string; title: string; description: string }[]> = {
    dashboard: [
      { element: '[data-tour="summary-cards"]', title: t("tour:dashboard.summaryTitle"), description: t("tour:dashboard.summaryDesc") },
      { element: '[data-tour="expense-chart"]', title: t("tour:dashboard.chartTitle"), description: t("tour:dashboard.chartDesc") },
    ],
    transactions: [
      { element: '[data-tour="new-transaction"]', title: t("tour:transactions.newTitle"), description: t("tour:transactions.newDesc") },
      { element: '[data-tour="filters-card"]', title: t("tour:transactions.filtersTitle"), description: t("tour:transactions.filtersDesc") },
    ],
    stocks: [
      { element: '[data-tour="new-asset"]', title: t("tour:stocks.newTitle"), description: t("tour:stocks.newDesc") },
      { element: '[data-tour="allocation-chart"]', title: t("tour:stocks.chartTitle"), description: t("tour:stocks.chartDesc") },
    ],
    budgets: [
      { element: '[data-tour="new-budget"]', title: t("tour:budgets.newTitle"), description: t("tour:budgets.newDesc") },
      { element: '[data-tour="budgets-table"]', title: t("tour:budgets.tableTitle"), description: t("tour:budgets.tableDesc") },
    ],
  };
  return steps[segment];
}

export function useProductTour(segment: Segment) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const isDone = localStorage.getItem(TOUR_DONE_KEY) === "true";
    if (isDone) return;

    const storedSegment = localStorage.getItem(TOUR_SEGMENT_KEY) as Segment | null;
    const isFirstVisit = storedSegment === null && segment === "dashboard";
    const shouldRun = isFirstVisit || storedSegment === segment;
    if (!shouldRun) return;

    localStorage.setItem(TOUR_SEGMENT_KEY, segment);

    const nextSegment = SEGMENTS[SEGMENTS.indexOf(segment) + 1] ?? null;

    const steps = getSteps(segment, t);

    const driverObj = driver({
      showProgress: true,
      animate: true,
      nextBtnText: t("tour:next"),
      prevBtnText: t("tour:prev"),
      doneBtnText: nextSegment ? t("tour:next") : t("tour:done"),
      onNextClick: () => {
        if (driverObj.isLastStep()) {
          if (nextSegment) {
            localStorage.setItem(TOUR_SEGMENT_KEY, nextSegment);
            driverObj.destroy();
            navigate(SEGMENT_ROUTES[nextSegment]);
          } else {
            localStorage.setItem(TOUR_DONE_KEY, "true");
            localStorage.removeItem(TOUR_SEGMENT_KEY);
            driverObj.destroy();
          }
        } else {
          driverObj.moveNext();
        }
      },
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_DONE_KEY, "true");
        localStorage.removeItem(TOUR_SEGMENT_KEY);
        driverObj.destroy();
      },
      steps: steps.map((s) => ({
        element: s.element,
        popover: { title: s.title, description: s.description, side: "bottom" as const },
      })),
    });

    const timer = setTimeout(() => driverObj.drive(), 600);
    return () => clearTimeout(timer);
  }, [segment]);
}
