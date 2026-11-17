import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CompanyManagement from "./pages/dashboard/CompanyManagement";

import NotFound from "./pages/NotFound";
import Login from "./auth/Login";
import ConsolidatedIncome from "./pages/dashboard/ConsolidatedIncome";
import ConsolidatedBalance from "./pages/dashboard/ConsolidatedBalance";
import CashFlowAnalysis from "./pages/dashboard/CashFlowAnalysis";
import TransactionsManagement from "./pages/dashboard/TransactionsManagement";
import CategoryManagement from "./pages/dashboard/CategoryManagement";
import UserManagement from "./pages/dashboard/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="companies" element={<CompanyManagement />} />
              <Route path="consolidated-income" element={<ConsolidatedIncome />} />
              <Route path="consolidated-balance" element={<ConsolidatedBalance />} />
              <Route path="cashflow" element={<CashFlowAnalysis />} />
              <Route path="record" element={<TransactionsManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
