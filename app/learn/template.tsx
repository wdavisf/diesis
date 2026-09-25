import type { ReactNode } from "react";

/** Remounts on every navigation under /app, so each screen fades in. Opacity only: a transform
 *  on this wrapper would become the containing block of the fixed, sideways game shell. */
export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">{children}</div>;
}
