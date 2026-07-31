"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Building2,
  LayoutDashboard,
  Building,
  HardHat,
  ShoppingCart,
  Truck,
  Monitor,
  FileText,
  Scale,
  Wallet,
  PenSquare,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  FolderTree,
} from "lucide-react"

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  section?: string
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Group Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, section: "Overview" },
  { id: "companies", label: "company Management", icon: <Building className="h-5 w-5" />, section: "Data Entry" },
  { id: "consolidated-income", label: "Consolidated Income", icon: <FileText className="h-5 w-5" />, section: "Reports" },
  { id: "consolidated-balance", label: "Consolidated Balance", icon: <Scale className="h-5 w-5" />, section: "Reports" },
  { id: "cashflow", label: "Cash Flow Analysis", icon: <Wallet className="h-5 w-5" />, section: "Reports" },
  { id: "record", label: "Transactions Management", icon: <PenSquare className="h-5 w-5" />, section: "Data Entry" },
  { id: "categories", label: "Category Management", icon: <FolderTree className="h-5 w-5" />, section: "Data Entry" },
  { id: "users", label: "User Management", icon: <Users className="h-5 w-5" />, section: "Data Entry" },
]

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const { user, logout } = useAuth()

  const groupedItems = navItems.reduce(
    (acc, item) => {
      const section = item.section || "Other"
      if (!acc[section]) acc[section] = []
      acc[section].push(item)
      return acc
    },
    {} as Record<string, NavItem[]>
  )

  // Only show Admin section for admin and cfo roles
  const visibleSections = Object.entries(groupedItems).filter(([section]) => {
    if (section === "Admin" && user?.role !== "admin" && user?.role !== "cfo") {
      return false
    }
    return true
  })

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-sidebar-primary flex-shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-serif font-semibold text-sidebar-primary truncate">
                IREBE Group
              </h1>
            </div>
          )}
        </div>

        {!collapsed && user && (
          <div className="mt-4 p-3 bg-sidebar-accent/30 rounded-md">
            <p className="text-xs text-sidebar-primary font-medium capitalize">
              {user.role === "cfo" ? "Chief Financial Officer" : user.role}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user.name}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {visibleSections.map(([section, items]) => (
          <div key={section} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
                {section}
              </p>
            )}
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all border-l-3 cursor-pointer ",
                  activeTab === item.id
                    ? "bg-sidebar-primary/15 text-sidebar-foreground border-l-sidebar-primary font-medium"
                    : "text-sidebar-foreground/80 border-l-transparent hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:border-l-sidebar-primary/50"
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-md hover:bg-sidebar-primary/90"
      >
        {collapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
