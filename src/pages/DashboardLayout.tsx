import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CompanySidebar, navRoutes, type ActiveView } from "@/components/company/CompanySidebar";
import { DashboardTopBar } from "@/components/company/DashboardTopBar";

const viewTitles: Record<ActiveView, string> = {
  dashboard: "Group Dashboard",
  companies: "Company Management",
  "consolidated-income": "Consolidated Income",
  "consolidated-balance": "Consolidated Balance",
  cashflow: "Cash Flow Analysis",
  record: "Transactions Management",
  categories: "Category Management",
  users: "User Management",
};

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const current = navRoutes.find((r) =>
    r.id === "dashboard" ? pathname === r.path : pathname.startsWith(r.path)
  );
  const title = current ? viewTitles[current.id] : "Dashboard";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CompanySidebar />

        <div className="flex flex-1 flex-col">
          <DashboardTopBar title={title} notificationCount={2} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
