"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export interface UserProfile {
  id: number
  gender: string | null
  maritalStatus: string | null
  position: string | null
  dateOfBirth: string | null
  profileImage: string | null
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "admin" | "cfo" | "accountant" | "user" | "viewer"
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  profile: UserProfile | null
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  tokens: AuthTokens | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  handleUnauthorized: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = "irebe_user"
const TOKENS_STORAGE_KEY = "irebe_tokens"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Handle unauthorized access - clear auth and redirect to login
  const handleUnauthorized = useCallback(() => {
    console.log("Session expired - redirecting to login")
    
    // Clear auth state
    setUser(null)
    setTokens(null)
    
    // Clear localStorage
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKENS_STORAGE_KEY)
    localStorage.removeItem("irebe_active_tab")
    localStorage.removeItem("irebe_sidebar_collapsed")
    
    // Force re-render to show login form
    setIsLoading(false)
    
    // Optional: Navigate to login page if you have a dedicated route
    // if (pathname !== "/login") {
    //   router.push("/login")
    // }
  }, [pathname])

  // Check auth on mount - only runs client-side
  useEffect(() => {
    setIsMounted(true)
    
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY)
      
      if (storedUser && storedTokens) {
        const parsedUser = JSON.parse(storedUser)
        const parsedTokens = JSON.parse(storedTokens)
        
        setUser(parsedUser)
        setTokens(parsedTokens)
      }
    } catch (error) {
      console.error("Failed to restore auth:", error)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(TOKENS_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Login failed:", errorData)
        return false
      }

      const data: LoginResponse = await response.json()

      setUser(data.user)
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }))

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKENS_STORAGE_KEY)
    localStorage.removeItem("irebe_active_tab")
    localStorage.removeItem("irebe_sidebar_collapsed")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isMounted && !!user,
        isLoading: !isMounted || isLoading,
        tokens,
        login,
        logout,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
