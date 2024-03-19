"use client";

import { createClient } from "@/lib/supabase/client";
import {
  type AuthStore,
  createAuthStore,
  defaultInitState,
} from "@/state/store";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { StoreApi, useStore } from "zustand";

interface Props {
  children: JSX.Element;
}

export const AuthStoreContext = createContext<StoreApi<AuthStore>>(
  createAuthStore(defaultInitState)
);

export const AuthStoreProvider = ({ children }: Props) => {
  const path = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const storeRef = useRef<StoreApi<AuthStore>>();
  if (!storeRef.current) {
    storeRef.current = createAuthStore(defaultInitState);
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const store = storeRef.current?.getState();
      if (store && session) {
        store.setUser(session.user);
        if (path.startsWith("/login")) router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = (
  selector: (store: AuthStore) => AuthStore
): AuthStore => {
  const authStoreContext = useContext(AuthStoreContext);

  if (authStoreContext === undefined) {
    throw new Error(`state manager provider error`);
  }

  return useStore(authStoreContext, selector);
};
