import { Bell, Search, LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface DashboardTopBarProps {
  title: string;
  notificationCount?: number;
}

function getInitials(name?: string, email?: string) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "??";
}

export const DashboardTopBar = ({ title, notificationCount = 0 }: DashboardTopBarProps) => {
  const { user, logout } = useAuth();
  const initials = getInitials(user?.name, user?.email);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-5">
      <SidebarTrigger className="shrink-0 h-7 w-7" />

      <div className="h-5 w-px shrink-0 bg-border/60" />

      <div className="flex-1 min-w-0">
        <h1 className="truncate text-[12.5px] font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h1>
      </div>

      {/* Search — desktop only */}
      <div className="relative hidden md:block w-56 shrink-0">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder="Search..."
          className="h-8 rounded-md border-border/60 bg-muted/50 pl-8 text-[12px] placeholder:text-muted-foreground/60 focus-visible:ring-primary"
        />
      </div>

      {/* Notifications */}
      <button className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <Bell className="h-4 w-4" />
        {notificationCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full bg-destructive px-1 text-[9px] leading-none text-destructive-foreground">
            {notificationCount}
          </Badge>
        )}
      </button>

      <div className="h-5 w-px shrink-0 bg-border/60" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-accent">
            <Avatar className="h-7 w-7 ring-1 ring-border">
              <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start leading-tight sm:flex">
              <span className="max-w-[120px] truncate text-[12px] font-medium text-foreground">
                {user?.name ?? "Account"}
              </span>
              <span className="max-w-[120px] truncate text-[10px] text-muted-foreground/80">
                {user?.role ?? user?.email}
              </span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground/70 sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 text-[12.5px]">
          <DropdownMenuLabel>
            <div className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-medium">{user?.name ?? "Account"}</span>
              <span className="text-[10px] font-normal text-muted-foreground/80">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-[12.5px]">
            <UserIcon className="h-3.5 w-3.5" />
            Profile
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
    </header>
  );
};
