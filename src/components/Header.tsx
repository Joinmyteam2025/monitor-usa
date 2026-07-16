import { useAuthActions } from "@convex-dev/auth/react";
import { Shield, LogOut, Settings, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const { signOut } = useAuthActions();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 h-14" style={{ background: "rgba(11,27,43,0.95)" }}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-slate-400 hover:text-white" />
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-white">
            <Shield className="size-5 text-cyan-400" />
            <span className="hidden sm:inline">MonitorUSA<span className="text-cyan-400">.ai</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <div className="size-2 rounded-full animate-pulse bg-green-500" />
            <span className="text-xs text-green-400 font-medium hidden sm:inline">AI Active</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="size-4 mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-400">
                <LogOut className="size-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
