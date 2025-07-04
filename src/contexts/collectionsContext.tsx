"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCollections } from "@/hooks/useCollections";

const CollectionsContext = createContext<ReturnType<
  typeof useCollections
> | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const collectionsData = useCollections();

  return (
    <CollectionsContext.Provider value={collectionsData}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollectionsContext() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "useCollectionsContext must be used within CollectionsProvider"
    );
  }
  return context;
}
