import {
  LayoutDashboard,
  Home,
  Camera,
  Bell,
  Users,
  Bot,
  Settings,
  Shield,
  Newspaper,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const BRAND = { navy: "#0B1B2B", navyLight: "#0F2A42", cyan: "#00D4FF" };

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Properties", url: "/properties", icon: Home },
  { title: "Devices", url: "/devices", icon: Camera },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Emergency Contacts", url: "/contacts", icon: Users },
  { title: "AI Support", url: "/support", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Blog", url: "/blog", icon: Newspaper },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-white/5" style={{ background: BRAND.navyLight }}>
      <SidebarHeader className="p-4 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <Shield className="size-7" style={{ color: BRAND.cyan }} />
          <div>
            <span className="font-bold text-white text-sm">MonitorUSA<span style={{ color: BRAND.cyan }}>.ai</span></span>
            <p className="text-[10px] font-medium tracking-wider" style={{ color: BRAND.cyan }}>AI SECURITY</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-[10px] tracking-widest uppercase px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="text-slate-300 hover:text-white hover:bg-white/5">
                      <Link to={item.url} className="flex items-center gap-3 px-4">
                        <item.icon className="size-4" style={active ? { color: BRAND.cyan } : {}} />
                        <span style={active ? { color: BRAND.cyan, fontWeight: 600 } : {}}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
