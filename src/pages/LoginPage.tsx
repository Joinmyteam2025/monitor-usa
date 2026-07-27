import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { SignIn } from "@/components/SignIn";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function LoginPage() {
  useDocumentTitle("Sign In");
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0B1B2B" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="size-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">MonitorUSA<span className="text-cyan-400">.ai</span></span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to your monitoring dashboard</p>
        </div>
        <div className="rounded-2xl p-8" style={{ background: "#0F2A42", border: "1px solid rgba(255,255,255,0.08)" }}>
          <SignIn />
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
