'use client';

import { createContext, useContext } from 'react';

type HermesDockContextValue = {
  openDock: () => void;
  closeDock: () => void;
  isAvailable: boolean;
};

const HermesDockContext = createContext<HermesDockContextValue>({
  openDock: () => {},
  closeDock: () => {},
  isAvailable: false,
});

export function HermesDockProvider({
  children,
  openDock,
  closeDock,
  isAvailable,
}: {
  children: React.ReactNode;
  openDock: () => void;
  closeDock: () => void;
  isAvailable: boolean;
}) {
  return (
    <HermesDockContext.Provider value={{ openDock, closeDock, isAvailable }}>
      {children}
    </HermesDockContext.Provider>
  );
}

export function useHermesDock() {
  return useContext(HermesDockContext);
}
