import {
  LayoutDashboard,
  Building,
  FileText,
  Scale,
  Wallet,
  PenSquare,
  FolderTree,
  Users,
  Settings,
  Bell,
  LogOut,
  Building2,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCompany } from "@/data/mockCompanyData";
import { useAuth } from "@/context/AuthContext";

export type ActiveView =
  | "dashboard"
  | "companies"
  | "consolidated-income"
  | "consolidated-balance"
  | "cashflow"
  | "record"
  | "categories"
  | "users";

// Central place mapping a nav id to its route — reused by the layout for titles too
export const navRoutes: { id: ActiveView; path: string }[] = [
  { id: "dashboard", path: "/dashboard" },
  { id: "companies", path: "/dashboard/companies" },
  { id: "consolidated-income", path: "/dashboard/consolidated-income" },
  { id: "consolidated-balance", path: "/dashboard/consolidated-balance" },
  { id: "cashflow", path: "/dashboard/cashflow" },
  { id: "record", path: "/dashboard/record" },
  { id: "categories", path: "/dashboard/categories" },
  { id: "users", path: "/dashboard/users" },
];

const navItems: {
  id: ActiveView;
  label: string;
  icon: JSX.Element;
  section: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-[15px] w-[15px]" />, section: "Overview" },
  { id: "companies", label: "Company Management", icon: <Building className="h-[15px] w-[15px]" />, section: "Data Entry" },
  { id: "consolidated-income", label: "Consolidated Income", icon: <FileText className="h-[15px] w-[15px]" />, section: "Reports" },
  { id: "consolidated-balance", label: "Consolidated Balance", icon: <Scale className="h-[15px] w-[15px]" />, section: "Reports" },
  { id: "cashflow", label: "Cash Flow Analysis", icon: <Wallet className="h-[15px] w-[15px]" />, section: "Reports" },
  { id: "record", label: "Transactions Management", icon: <PenSquare className="h-[15px] w-[15px]" />, section: "Data Entry" },
  { id: "categories", label: "Category Management", icon: <FolderTree className="h-[15px] w-[15px]" />, section: "Data Entry" },
  { id: "users", label: "User Management", icon: <Users className="h-[15px] w-[15px]" />, section: "Data Entry" },
];

const groupedNavItems = navItems.reduce<Record<string, typeof navItems>>(
  (groups, item) => {
    (groups[item.section] ||= []).push(item);
    return groups;
  },
  {},
);

const pathFor = (id: ActiveView) => navRoutes.find((r) => r.id === id)!.path;

export const CompanySidebar = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/60">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
            <Building2 className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">
                IREBE GROUP
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/80">
                Company Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="opacity-60" />

      <SidebarContent className="gap-0.5">
        {Object.entries(groupedNavItems).map(([section, items]) => (
          <SidebarGroup key={section} className="py-1.5">
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <NavLink to={pathFor(item.id)} end={item.id === "dashboard"}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.label}
                          className="h-8 rounded-md text-[12.5px] font-medium transition-colors data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                        >
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator className="opacity-60" />

        <SidebarGroup className="py-1.5">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Notifications"
                  className="relative h-8 rounded-md text-[12.5px] font-medium"
                >
                  <Bell className="h-[15px] w-[15px]" />
                  <span>Notifications</span>
                  <Badge className="ml-auto h-4 min-w-4 rounded-full bg-primary px-1 text-[9px] leading-none text-primary-foreground">
                    0
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-sidebar-accent">
              <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
                <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                  {user?.email?.slice(0, 2).toUpperCase() ?? "KD"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-[12.5px] font-medium text-sidebar-foreground">
                      {user?.name}
                    </span>
                    <span className="truncate text-[10px] text-muted-foreground/80">
                      {user?.email ?? mockCompany.ownerEmail}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 text-[12.5px]">
            <DropdownMenuItem className="gap-2 text-[12.5px]">
              <Building2 className="h-3.5 w-3.5" />
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-[12.5px]">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-[12.5px] text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
