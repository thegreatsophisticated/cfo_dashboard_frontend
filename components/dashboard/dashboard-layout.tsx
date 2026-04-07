"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { setUnauthorizedHandler } from "./../../lib/fetchWithAuth";

// Tab components
import { DashboardOverview } from "./tabs/dashboard-overview";
import { ConsolidatedIncome } from "./tabs/consolidated-income";
import { ConsolidatedBalance } from "./tabs/consolidated-balance";
import { UserManagement } from "./tabs/user-management";
import { CategoryManagement } from "./tabs/category-management";
import { TransactionManagement } from "./tabs/record-transaction";
import CompaniesPage from "./tabs/companies-overview";
import { LoginForm } from "../login-form";
import { GlobalCashBook } from "./tabs/cashflow-analysis";

const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  dashboard: {
    title: "Group Financial Summary",
    breadcrumb: "IREBE Group / Dashboard",
  },
  companies: { title: "All Companies", breadcrumb: "IREBE Group / Companies" },
  construction: {
    title: "IREBE Construction Ltd",
    breadcrumb: "IREBE Group / Companies / Construction",
  },
  trading: {
    title: "IREBE Trading Ltd",
    breadcrumb: "IREBE Group / Companies / Trading",
  },
  logistics: {
    title: "IREBE Logistics Ltd",
    breadcrumb: "IREBE Group / Companies / Logistics",
  },
  tech: {
    title: "IREBE Tech Solutions Ltd",
    breadcrumb: "IREBE Group / Companies / Tech",
  },
  "consolidated-income": {
    title: "Consolidated Income Statement",
    breadcrumb: "IREBE Group / Reports / Income",
  },
  "consolidated-balance": {
    title: "Consolidated Balance Sheet",
    breadcrumb: "IREBE Group / Reports / Balance",
  },
  cashflow: {
    title: "Cash Flow Analysis",
    breadcrumb: "IREBE Group / Reports / Cash Flow",
  },
  record: {
    title: "Record Transaction",
    breadcrumb: "IREBE Group / Data Entry",
  },
  categories: {
    title: "Category Management",
    breadcrumb: "IREBE Group / Admin / Categories",
  },
  users: {
    title: "User Management",
    breadcrumb: "IREBE Group / Admin / Users",
  },
};

const ACTIVE_TAB_KEY = "irebe_active_tab";
const SIDEBAR_COLLAPSED_KEY = "irebe_sidebar_collapsed";

export function DashboardLayout() {
  const { user, isAuthenticated, isLoading, handleUnauthorized } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Set up global 401 handler - runs once
  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  // Load saved state on mount (client-side only) - runs once
  useEffect(() => {
    const savedTab = localStorage.getItem(ACTIVE_TAB_KEY);
    const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    if (savedTab && savedTab in pageTitles) {
      setActiveTab(savedTab);
    }
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === "true");
    }
    
    // Mark as hydrated after loading state
    setIsHydrated(true);
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
    }
  }, [activeTab, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    }
  }, [sidebarCollapsed, isHydrated]);

  const currentPage = pageTitles[activeTab] || pageTitles.dashboard;

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onNavigate={setActiveTab} />;
      case "companies":
       return <CompaniesPage />;
      case "consolidated-income":
        return <ConsolidatedIncome />;
      case "consolidated-balance":
        return <ConsolidatedBalance />;
      case "cashflow":
        return <GlobalCashBook />;
      case "record":
        return <TransactionManagement />;
      case "categories":
        return <CategoryManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  }, [activeTab]);

  // Show loading during auth check OR before hydration
  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only check authentication AFTER loading is complete
  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <TopBar title={currentPage.title} breadcrumb={currentPage.breadcrumb} />
        <div className="p-6">{tabContent}</div>
      </main>
    </div>
  );
}