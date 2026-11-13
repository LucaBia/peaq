import type { ReactNode } from "react";
import { Wordmark } from "@/components/peaq/core";
import { AppFrame, LangSwitch, TopBar } from "./ui";

export function AuthScreen({ children, backTo }: { children: ReactNode; backTo?: string }) {
  return (
    <AppFrame>
      <TopBar backTo={backTo} right={<LangSwitch />}><Wordmark className="mx-auto h-5 w-auto" /></TopBar>
      {children}
    </AppFrame>
  );
}
