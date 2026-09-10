import {
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCompany } from "@/data/mockCompanyData";

export const CompanyHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
            <span className="text-lg font-bold text-primary-foreground">
              IP
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">IREBE GROUP</h1>
            <p className="text-xs text-muted-foreground">Company Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/company" className="text-sm font-medium text-primary">
            Dashboard
          </a>
          <a
            href="/company/workers"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Workers
          </a>
          <a
            href="/company/requests"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hiring Requests
          </a>
          <a
            href="/company/revenue"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Revenue
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              2
            </span>
          </Button>

          {/* Company Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{mockCompany.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Verified Company
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Company Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
