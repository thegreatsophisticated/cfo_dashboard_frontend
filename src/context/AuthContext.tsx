import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { useLoginApi, type AuthUser } from "@/hooks/use-login-api";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "irebe_user";
const TOKENS_STORAGE_KEY = "irebe_tokens";

// Read the saved session synchronously so the first render already knows it
function readStoredSession(): { user: AuthUser | null; tokens: AuthTokens | null } {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
    if (storedUser && storedTokens) {
      return {
        user: JSON.parse(storedUser) as AuthUser,
        tokens: JSON.parse(storedTokens) as AuthTokens,
      };
    }
  } catch (err) {
    console.error("Failed to restore auth:", err);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKENS_STORAGE_KEY);
  }
  return { user: null, tokens: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredSession().user);
  const [tokens, setTokens] = useState<AuthTokens | null>(() => readStoredSession().tokens);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: loginRequest } = useLoginApi();
  const navigate = useNavigate();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loginRequest(email, password);

        const newTokens: AuthTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        setUser(data.user);
        setTokens(newTokens);

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(newTokens));

        navigate("/dashboard");
        return true;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Login failed. Please try again.";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loginRequest, navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKENS_STORAGE_KEY);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user && !!tokens,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
