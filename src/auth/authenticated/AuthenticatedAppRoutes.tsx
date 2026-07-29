import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import FaqPage from "@/pages/FaqPage";
import PublicAboutPage from "@/pages/PublicAboutPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { OAUTH_CALLBACK_PATH } from "@/auth/oauthReturn";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/components/PublicLayout";
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute";
import { ViktorAutoSignIn } from "@/components/ViktorAutoSignIn";
import { ViktorProductAuthProvider } from "@/lib/viktor-spaces-access/ViktorProductAuthProvider";
import {
  AISupportPage,
  AlertsPage,
  DashboardPage,
  DevicesPage,
  EmergencyContactsPage,
  LandingPage,
  LoginPage,
  OfferPage,
  PropertiesPage,
  SettingsPage,
  SignupPage,
} from "@/pages";
import { ViktorOAuthCallbackPage } from "@/pages/ViktorOAuthCallbackPage";
import { BlogPage } from "@/pages/BlogPage";
import { ArticlePage } from "@/pages/ArticlePage";

export function AuthenticatedRoutes() {
  return (
    <Routes>
      {/* VSL offer page — standalone, no layout wrapper */}
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      {/* Return leg of "Sign in with Viktor" — outside the auth guards
          because it owns the loading/outcome handling itself. */}
      <Route path={OAUTH_CALLBACK_PATH} element={<ViktorOAuthCallbackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/contacts" element={<EmergencyContactsPage />} />
          <Route path="/support" element={<AISupportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      {/* SEO Blog */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/about-us" element={<PublicAboutPage />} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function AuthenticatedAppRoutes() {
  return (
    <ViktorProductAuthProvider enabled>
      {/* Outside the routes so links carrying `viktor_sign_in=auto` work no
          matter which page they land on. */}
      <ViktorAutoSignIn />
      <AuthenticatedRoutes />
    </ViktorProductAuthProvider>
  );
}
