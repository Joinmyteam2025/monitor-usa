import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicLandingPage } from "@/pages/PublicLandingPage";
import { OfferPage } from "@/pages/OfferPage";
import { BlogPage } from "@/pages/BlogPage";
import { ArticlePage } from "@/pages/ArticlePage";
import FaqPage from "@/pages/FaqPage";
import PublicAboutPage from "@/pages/PublicAboutPage";


function PublicShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export function PublicAppRoutes() {
  return (
    <Routes>
      {/* VSL offer page — standalone, no layout wrapper */}
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      <Route element={<PublicShell />}>
        <Route path="/" element={<PublicLandingPage />} />
      </Route>

              <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about-us" element={<PublicAboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
