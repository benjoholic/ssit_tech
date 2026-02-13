"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ClientSidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const ClientSidebarContext = createContext<ClientSidebarContextValue | null>(
  null
);

export function ClientSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  return (
    <ClientSidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </ClientSidebarContext.Provider>
  );
}

export function useClientSidebar() {
  const ctx = useContext(ClientSidebarContext);
  return ctx;
}
