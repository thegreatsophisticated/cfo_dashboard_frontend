"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { QueryProvider } from "@/lib/query-provider"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <DashboardLayout />
}

export default function Page() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryProvider>
  )
}
