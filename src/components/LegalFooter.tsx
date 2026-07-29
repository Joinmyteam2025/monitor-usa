import { Link } from "react-router-dom";

export function LegalFooter() {
  return (
    <footer className="mt-12 pt-6 border-t border-border/20 text-center">
      <p className="text-[10px] text-muted-foreground/50 leading-relaxed max-w-xl mx-auto">
        MonitorUSA.ai provides alarm monitoring services through licensed central
        monitoring stations. Monitoring service requires compatible equipment and
        an active agreement. Emergency response times depend on local authorities
        and are not guaranteed.
      </p>
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground/40">
        <Link to="/terms" className="hover:text-muted-foreground transition-colors">
          Terms of Service
        </Link>
        <span>·</span>
        <Link to="/privacy" className="hover:text-muted-foreground transition-colors">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/faq" className="hover:text-muted-foreground transition-colors">
          FAQ
        </Link>
      </div>
      <p className="text-[10px] text-muted-foreground/30 mt-3">
        © {new Date().getFullYear()} MonitorUSA.ai — All rights reserved
      </p>
    </footer>
  );
}
