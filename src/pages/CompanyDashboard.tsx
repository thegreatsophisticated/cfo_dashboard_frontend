// import { useState } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import {
//   CompanySidebar,
//   type ActiveView,
// } from "@/components/company/CompanySidebar";
// import { DashboardTopBar } from "@/components/company/DashboardTopBar";
// import { DashboardOverview } from "@/components/company/DashboardOverview";
// import { Card, CardContent } from "@/components/ui/card";
// import { mockCompanyStats } from "@/data/mockCompanyData";

// const viewTitles: Record<ActiveView, string> = {
//   dashboard: "Dashboard",
//   companies: "Company Management",
//   "consolidated-income": "Consolidated Income",
//   "consolidated-balance": "Consolidated Balance",
//   cashflow: "Cash Flow Analysis",
//   record: "Transactions Management",
//   categories: "Category Management",
//   users: "User Management",
// };

// // Placeholder shown for views that don't have a built component yet
// const ComingSoon = ({ label }: { label: string }) => (
//   <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
//     <CardContent className="p-8 text-center">
//       <p className="text-sm text-muted-foreground">
//         {label} view is under construction.
//       </p>
//     </CardContent>
//   </Card>
// );

// const CompanyDashboard = () => {
//   const [activeView, setActiveView] = useState<ActiveView>("dashboard");

//   const renderContent = () => {
//     switch (activeView) {
//       case "dashboard":
//         return (
//           <DashboardOverview
//             stats={mockCompanyStats}
//             recentWorkers={[]}
//             pendingRequests={[]}
//             onViewChange={() => {}}
//             onRegisterWorker={() => {}}
//             onViewWorkerDetails={() => {}}
//             onApproveRequest={() => {}}
//             onRejectRequest={() => {}}
//           />
//         );
//       case "companies":
//         return <ComingSoon label="Company Management" />;
//       case "consolidated-income":
//         return <ComingSoon label="Consolidated Income" />;
//       case "consolidated-balance":
//         return <ComingSoon label="Consolidated Balance" />;
//       case "cashflow":
//         return <ComingSoon label="Cash Flow Analysis" />;
//       case "record":
//         return <ComingSoon label="Transactions Management" />;
//       case "categories":
//         return <ComingSoon label="Category Management" />;
//       case "users":
//         return <ComingSoon label="User Management" />;
//     }
//   };

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full">
//         <CompanySidebar activeView={activeView} onViewChange={setActiveView} />

//         <div className="flex flex-1 flex-col">
//           <DashboardTopBar
//             title={viewTitles[activeView]}
//             notificationCount={2}
//           />

//           <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//             {renderContent()}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default CompanyDashboard;
