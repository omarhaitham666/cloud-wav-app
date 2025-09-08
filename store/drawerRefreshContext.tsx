"use client";
import { createContext, FC, PropsWithChildren, use, useState } from "react";

interface DrawerRefreshContextProps {
  refreshKey: number;
  triggerDrawerRefresh: () => void;
}

const DrawerRefreshContext = createContext<DrawerRefreshContextProps | null>(null);

export const DrawerRefreshProvider: FC<PropsWithChildren> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerDrawerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DrawerRefreshContext.Provider value={{ refreshKey, triggerDrawerRefresh }}>
      {children}
    </DrawerRefreshContext.Provider>
  );
};

export const useDrawerRefresh = () => {
  const contextValue = use(DrawerRefreshContext);
  if (!contextValue)
    throw new Error("useDrawerRefresh must be used within a DrawerRefreshProvider");
  return contextValue;
};
