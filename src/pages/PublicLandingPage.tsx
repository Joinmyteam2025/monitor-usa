import { LandingPage } from "./LandingPage";

// Public visitors see the same landing page, just without auth actions
export function PublicLandingPage() {
  return <LandingPage />;
}
