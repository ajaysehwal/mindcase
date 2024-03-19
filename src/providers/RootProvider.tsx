"use client";

import {
  type RootStore,
  createRootStore,
  defaultRootState,
} from "@/state/store";
import { createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

interface Props {
  children: JSX.Element;
}

export const RootStoreContext = createContext<StoreApi<RootStore>>(
  createRootStore(defaultRootState)
);

export const RootStoreProvider = ({ children }: Props) => {
  const storeRef = useRef<StoreApi<RootStore>>();
  if (!storeRef.current) {
    storeRef.current = createRootStore(defaultRootState);
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = (
  selector: (store: RootStore) => RootStore
): RootStore => {
  const rootStoreContext = useContext(RootStoreContext);

  if (rootStoreContext === undefined) {
    throw new Error(`state manager provider error`);
  }

  return useStore(rootStoreContext, selector);
};
