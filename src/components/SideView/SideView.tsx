import "./SideView.scss";

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

type Box<T> = {
  value: T;
  set: (value: T) => unknown;
};

function useBox<T>(state: [T, Dispatch<SetStateAction<T>>]): Box<T> {
  return useMemo(
    () => ({
      value: state[0],
      set: value => state[1](value)
    }),
    [state[0]]
  );
}

type SideViewContextTy = {
  collapsed: Box<boolean>;
};

const SideViewContext = createContext<SideViewContextTy | null>(null);

export function useSideView() {
  return useContext(SideViewContext)!;
}

export function SideView(p: PropsWithChildren) {
  const collapsedBox = useBox(useState(false));

  return (
    <aside
      data-collapsed={collapsedBox.value}
      id='app-sideview'
      className='group/side-view self-stretch px-8 pt-6'
    >
      <SideViewContext.Provider
        value={{
          collapsed: collapsedBox
        }}
      >
        {p.children}
      </SideViewContext.Provider>
    </aside>
  );
}
