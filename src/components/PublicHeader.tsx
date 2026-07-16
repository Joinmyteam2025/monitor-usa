import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { getEmailPasswordSignInAvailable } from "@/lib/viktor-spaces-access/config";

export function PublicHeader() {
  const authAvailable = getEmailPasswordSignInAvailable();
  const convexAuth = (() => {
    try { return useConvexAuth(); } catch { return { isAuthenticated: false, isLoading: true }; }
  })();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5" style={{ background: "rgba(11,27,43,0.9)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition-opacity">
          <Shield className="size-6 text-cyan-400" />
          <span>MonitorUSA<span className="text-cyan-400">.ai</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Plans</a>
          <span className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">Features</span>
          <span className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">FAQ</span>
        </nav>

        <div className="flex items-center gap-3">
          {authAvailable && !convexAuth.isAuthenticated && (
            <>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="rounded-lg font-semibold" asChild
                style={{ background: "linear-gradient(135deg, #00D4FF, #0088FF)", color: "#0B1B2B" }}>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
          {convexAuth.isAuthenticated && (
            <Button size="sm" className="rounded-lg font-semibold" asChild
              style={{ background: "linear-gradient(135deg, #00D4FF, #0088FF)", color: "#0B1B2B" }}>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
