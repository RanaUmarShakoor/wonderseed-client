import { createStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";

type User = any;

export interface AppStore {
  auth: {
    // Whether a user is logged in or not
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string;
    programId: any | null;
    cohortId: any | null;
  };
  cohortConfirmed: boolean;
  firstLogin: boolean;
  authenticated(user: User, accessToken: string, cohortId: any | null, programId: any | null): void;
  loggedOut(): void;
  confirmCohort(cohortId: any, programId: any): void;
  setFirstLogin(val: boolean): void;
}

export const appStoreInstance = createStore<
  AppStore,
  [["zustand/persist", any], ["zustand/immer", never]]
>(
  persist(
    immer(set => ({
      auth: {
        isAuthenticated: false,
        user: null,
        accessToken: "",
        programId: null,
        cohortId: null
      },
      cohortConfirmed: false,
      firstLogin: false,
      authenticated: (user: User, accessToken: string, cohortId: any | null, programId: any | null) =>
        set(store => {
          store.auth.isAuthenticated = true;
          store.auth.user = user;
          store.auth.accessToken = accessToken;
          store.auth.cohortId = cohortId;
          store.auth.programId = programId;
          store.cohortConfirmed = false;
        }),
      loggedOut: () =>
        set(store => {
          store.auth = {
            isAuthenticated: false,
            user: null,
            accessToken: "",
            cohortId: null,
            programId: null,
          };
          store.cohortConfirmed = false;
          store.firstLogin = false;
        }),
      confirmCohort: (cohortId, programId) =>
        set(store => {
          store.auth.cohortId = cohortId;
          store.auth.programId = programId;
          store.cohortConfirmed = true;
        }),
      setFirstLogin: val =>
        set(store => {
          store.firstLogin = val;
        })
    })),
    {
      name: "wonderseed-lms",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the auth field
      partialize: ({ auth }) => ({ auth }),
      version: 3
    }
  )
);

export const useAppStore = <T>(
  selector: (store: AppStore) => T,
  equalityFn?: (a: T, b: T) => boolean
) => useStoreWithEqualityFn(appStoreInstance, selector, equalityFn);

export const useAppStoreKey = <T extends keyof AppStore>(key: T) =>
  useAppStore(store => store[key]);

export declare const gstore: AppStore;
if (typeof (window as any)["gstore"] === "undefined") {
  Object.defineProperty(window, "gstore", {
    get: function () {
      return appStoreInstance.getState();
    }
  });
}
