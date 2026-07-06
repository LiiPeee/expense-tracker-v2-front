import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const HIDE_VALUES_STORAGE_KEY = "hideValues";

type HideValuesContextValue = {
  isHidden: boolean;
  toggleHidden: () => void;
};

const HideValuesContext = createContext<HideValuesContextValue | undefined>(undefined);

function getInitialHiddenState(): boolean {
  return localStorage.getItem(HIDE_VALUES_STORAGE_KEY) === "true";
}

export function HideValuesProvider({ children }: { children: ReactNode }) {
  const [isHidden, setIsHidden] = useState(getInitialHiddenState);

  useEffect(() => {
    localStorage.setItem(HIDE_VALUES_STORAGE_KEY, String(isHidden));
  }, [isHidden]);

  return (
    <HideValuesContext.Provider value={{ isHidden, toggleHidden: () => setIsHidden((prev) => !prev) }}>
      {children}
    </HideValuesContext.Provider>
  );
}

export function useHideValues(): HideValuesContextValue {
  const context = useContext(HideValuesContext);
  if (!context) {
    throw new Error("useHideValues must be used within a HideValuesProvider");
  }
  return context;
}
