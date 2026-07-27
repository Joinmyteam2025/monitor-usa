import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { SignUp } from "@/components/SignUp";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function SignupPage() {
  useDocumentTitle("Sign Up");
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0B1B2B" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="size-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">MonitorUSA<span className="text-cyan-400">.ai</span></span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-slate-400">Get started with AI-powered home security</p>
        </div>
        <div className="rounded-2xl p-8" style={{ background: "#0F2A42", border: "1px solid rgba(255,255,255,0.08)" }}>
          <SignUp />
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
