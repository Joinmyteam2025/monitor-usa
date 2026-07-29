import { ConvexAuthProvider } from "@convex-dev/auth/react";
import type { ReactNode } from "react";
import { convex } from "@/auth/convexClient";
import { safeTokenStorage } from "../../auth/safeTokenStorage";

export function ViktorProductAuthProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  if (!enabled) return <>{children}</>;
  return <ConvexAuthProvider client={convex} storage={safeTokenStorage}>{children}</ConvexAuthProvider>;
}
