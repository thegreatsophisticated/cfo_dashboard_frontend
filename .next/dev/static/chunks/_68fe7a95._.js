(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000/") || "";
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const USER_STORAGE_KEY = "irebe_user";
const TOKENS_STORAGE_KEY = "irebe_tokens";
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Handle unauthorized access - clear auth and redirect to login
    const handleUnauthorized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[handleUnauthorized]": ()=>{
            console.log("Session expired - redirecting to login");
            // Clear auth state
            setUser(null);
            setTokens(null);
            // Clear localStorage
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKENS_STORAGE_KEY);
            localStorage.removeItem("irebe_active_tab");
            localStorage.removeItem("irebe_sidebar_collapsed");
            // Force re-render to show login form
            setIsLoading(false);
        // Optional: Navigate to login page if you have a dedicated route
        // if (pathname !== "/login") {
        //   router.push("/login")
        // }
        }
    }["AuthProvider.useCallback[handleUnauthorized]"], [
        pathname
    ]);
    // Check auth on mount - only runs client-side
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            setIsMounted(true);
            try {
                const storedUser = localStorage.getItem(USER_STORAGE_KEY);
                const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
                if (storedUser && storedTokens) {
                    const parsedUser = JSON.parse(storedUser);
                    const parsedTokens = JSON.parse(storedTokens);
                    setUser(parsedUser);
                    setTokens(parsedTokens);
                }
            } catch (error) {
                console.error("Failed to restore auth:", error);
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem(TOKENS_STORAGE_KEY);
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (email, password)=>{
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "AuthProvider.useCallback[login]": ()=>({})
                    }["AuthProvider.useCallback[login]"]);
                    console.error("Login failed:", errorData);
                    return false;
                }
                const data = await response.json();
                setUser(data.user);
                setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
                localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                }));
                return true;
            } catch (error) {
                console.error("Login error:", error);
                return false;
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useCallback[login]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            setUser(null);
            setTokens(null);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKENS_STORAGE_KEY);
            localStorage.removeItem("irebe_active_tab");
            localStorage.removeItem("irebe_sidebar_collapsed");
        }
    }["AuthProvider.useCallback[logout]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: isMounted && !!user,
            isLoading: !isMounted || isLoading,
            tokens,
            login,
            logout,
            handleUnauthorized
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "lwUNHYRC4Szaih+4RV/G2OSii7Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/query-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/query-provider.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "f/7BZILF/fNND3CteZQSTywI90c=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/fetchWithAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Custom fetch wrapper that handles 401 errors globally
 * Import this and use it instead of the native fetch in your API calls
 */ // Store the unauthorized handler globally
__turbopack_context__.s([
    "fetchWithAuth",
    ()=>fetchWithAuth,
    "setUnauthorizedHandler",
    ()=>setUnauthorizedHandler,
    "useAuthErrorHandler",
    ()=>useAuthErrorHandler
]);
let globalUnauthorizedHandler = null;
function setUnauthorizedHandler(handler) {
    globalUnauthorizedHandler = handler;
}
async function fetchWithAuth(url, options) {
    const response = await fetch(url, options);
    // Handle 401 Unauthorized
    if (response.status === 401 && !options?.skipAuthRedirect) {
        console.error("Unauthorized request detected - session expired");
        // Clear tokens from localStorage
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem("irebe_user");
            localStorage.removeItem("irebe_tokens");
            localStorage.removeItem("irebe_active_tab");
        }
        // Call the global handler if available
        if (globalUnauthorizedHandler) {
            globalUnauthorizedHandler();
        }
        // Throw error to stop further processing
        throw new Error("Session expired. Please login again.");
    }
    return response;
}
function useAuthErrorHandler(handler) {
    if ("TURBOPACK compile-time truthy", 1) {
        setUnauthorizedHandler(handler);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API Base URL - Use NEXT_PUBLIC_ prefix for client-side access
// Set this in the v0 sidebar: Vars -> Add -> NEXT_PUBLIC_API_BASE_URL
__turbopack_context__.s([
    "createCategory",
    ()=>createCategory,
    "createCompany",
    ()=>createCompany,
    "createRecurringTransaction",
    ()=>createRecurringTransaction,
    "createSubSubCategory",
    ()=>createSubSubCategory,
    "createTransaction",
    ()=>createTransaction,
    "createTransactionRecord",
    ()=>createTransactionRecord,
    "createUser",
    ()=>createUser,
    "deleteCategory",
    ()=>deleteCategory,
    "deleteCompany",
    ()=>deleteCompany,
    "deleteRecurringTransaction",
    ()=>deleteRecurringTransaction,
    "deleteTransaction",
    ()=>deleteTransaction,
    "deleteUser",
    ()=>deleteUser,
    "executeRecurringTransaction",
    ()=>executeRecurringTransaction,
    "fetchBalanceSheet",
    ()=>fetchBalanceSheet,
    "fetchCashBook",
    ()=>fetchCashBook,
    "fetchCategoryById",
    ()=>fetchCategoryById,
    "fetchCategoryTree",
    ()=>fetchCategoryTree,
    "fetchCompanies",
    ()=>fetchCompanies,
    "fetchCompanyById",
    ()=>fetchCompanyById,
    "fetchCompanyComparison",
    ()=>fetchCompanyComparison,
    "fetchCompanyDetail",
    ()=>fetchCompanyDetail,
    "fetchCompanyTransactions",
    ()=>fetchCompanyTransactions,
    "fetchConsolidatedIncome",
    ()=>fetchConsolidatedIncome,
    "fetchDashboardStats",
    ()=>fetchDashboardStats,
    "fetchGlobalBalanceSheet",
    ()=>fetchGlobalBalanceSheet,
    "fetchGlobalCashBook",
    ()=>fetchGlobalCashBook,
    "fetchGlobalFinancialSummary",
    ()=>fetchGlobalFinancialSummary,
    "fetchGlobalIncomeStatement",
    ()=>fetchGlobalIncomeStatement,
    "fetchIncomeStatement",
    ()=>fetchIncomeStatement,
    "fetchLeafCategories",
    ()=>fetchLeafCategories,
    "fetchMainCategories",
    ()=>fetchMainCategories,
    "fetchRecentTransactions",
    ()=>fetchRecentTransactions,
    "fetchRecurringTransactionById",
    ()=>fetchRecurringTransactionById,
    "fetchRecurringTransactions",
    ()=>fetchRecurringTransactions,
    "fetchRecurringTransactionsByCompany",
    ()=>fetchRecurringTransactionsByCompany,
    "fetchSubCategories",
    ()=>fetchSubCategories,
    "fetchSubSubCategories",
    ()=>fetchSubSubCategories,
    "fetchTransactionById",
    ()=>fetchTransactionById,
    "fetchTransactions",
    ()=>fetchTransactions,
    "fetchTransactionsByCategory",
    ()=>fetchTransactionsByCategory,
    "fetchTransactionsByDateRange",
    ()=>fetchTransactionsByDateRange,
    "fetchUsers",
    ()=>fetchUsers,
    "getNextCategoryCode",
    ()=>getNextCategoryCode,
    "restoreCategory",
    ()=>restoreCategory,
    "updateCompany",
    ()=>updateCompany,
    "updateRecurringTransaction",
    ()=>updateRecurringTransaction,
    "updateTransaction",
    ()=>updateTransaction,
    "updateUser",
    ()=>updateUser,
    "validateCategoryCode",
    ()=>validateCategoryCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/fetchWithAuth.ts [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000/") || "";
;
const USER_STORAGE_TOKENS = "irebe_tokens";
// =====================================================
// HELPER FUNCTIONS
// =====================================================
/**
 * Get authentication tokens from localStorage
 */ function getAuthTokens() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const storedTokens = localStorage.getItem(USER_STORAGE_TOKENS);
        if (!storedTokens) return null;
        return JSON.parse(storedTokens);
    } catch (error) {
        console.error("Failed to parse auth tokens:", error);
        return null;
    }
}
/**
 * Get authorization header with access token
 */ function getAuthHeaders() {
    const tokens = getAuthTokens();
    if (tokens?.accessToken) {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.accessToken}`
        };
    }
    return {
        "Content-Type": "application/json"
    };
}
async function apiCall(endpoint, options) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Use fetchWithAuth instead of native fetch
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options?.headers
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(()=>({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return response.json();
}
async function fetchDashboardStats() {
    return apiCall("/api/dashboard/stats");
}
async function fetchRecentTransactions() {
    return apiCall("/transactions/recent");
}
async function fetchConsolidatedIncome() {
    return apiCall("/reports/consolidated-income");
}
async function fetchCompanies() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}company`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch companies: ${response.status}`);
        }
        const data = await response.json();
        return data?.data || data?.companies || [];
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
}
async function fetchCompanyById(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}company/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch company: ${response.status}`);
        }
        const data = await response.json();
        return data.company || data;
    } catch (error) {
        console.error("Error fetching company:", error);
        throw error;
    }
}
async function fetchCompanyDetail(companyId) {
    return apiCall(`/company/${companyId}/detail`);
}
async function createCompany(data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}company/create`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to create company: ${response.status}`);
        }
        const result = await response.json();
        return result.company;
    } catch (error) {
        console.error("Error creating company:", error);
        throw error;
    }
}
async function updateCompany(id, data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}company/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to update company: ${response.status}`);
        }
        const result = await response.json();
        return result.company;
    } catch (error) {
        console.error("Error updating company:", error);
        throw error;
    }
}
async function deleteCompany(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}company/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to delete company: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting company:", error);
        throw error;
    }
}
async function fetchTransactions() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch transactions: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}
async function fetchTransactionById(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch transaction: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching transaction:", error);
        throw error;
    }
}
async function fetchCompanyTransactions(companyId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/company/${companyId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch company transactions: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching company transactions:", error);
        throw error;
    }
}
async function fetchTransactionsByCategory(categoryId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/category/${categoryId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch transactions by category: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching transactions by category:", error);
        throw error;
    }
}
async function fetchTransactionsByDateRange(companyId, startDate, endDate) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/date-range/${companyId}?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch transactions by date range: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching transactions by date range:", error);
        throw error;
    }
}
async function createTransactionRecord(data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to create transaction: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
}
async function createTransaction(data) {
    // Use fetchWithAuth instead of native fetch
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create transaction");
    }
    return response.json();
}
async function updateTransaction(id, data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to update transaction: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}
async function deleteTransaction(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to delete transaction: ${response.status}`);
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}
async function fetchRecurringTransactions() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch recurring transactions: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching recurring transactions:", error);
        throw error;
    }
}
async function fetchRecurringTransactionById(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch recurring transaction: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching recurring transaction:", error);
        throw error;
    }
}
async function fetchRecurringTransactionsByCompany(companyId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring/company/${companyId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch recurring transactions by company: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching recurring transactions by company:", error);
        throw error;
    }
}
async function createRecurringTransaction(data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to create recurring transaction: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error creating recurring transaction:", error);
        throw error;
    }
}
async function updateRecurringTransaction(id, data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to update recurring transaction: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error updating recurring transaction:", error);
        throw error;
    }
}
async function deleteRecurringTransaction(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to delete recurring transaction: ${response.status}`);
    } catch (error) {
        console.error("Error deleting recurring transaction:", error);
        throw error;
    }
}
async function executeRecurringTransaction(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/recurring/${id}/execute`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to execute recurring transaction: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error executing recurring transaction:", error);
        throw error;
    }
}
async function fetchIncomeStatement(companyId, year) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/income-statement/${companyId}?year=${year}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch income statement: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching income statement:", error);
        throw error;
    }
}
async function fetchBalanceSheet(companyId, asOfDate) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch balance sheet: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching balance sheet:", error);
        throw error;
    }
}
async function fetchCashBook(companyId, startDate, endDate) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/cash-book/${companyId}?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch cash book: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching cash book:", error);
        throw error;
    }
}
async function fetchGlobalIncomeStatement(year) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/global/income-statement?year=${year}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch global income statement: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching global income statement:", error);
        throw error;
    }
}
async function fetchGlobalBalanceSheet(asOfDate) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch global balance sheet: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching global balance sheet:", error);
        throw error;
    }
}
async function fetchGlobalCashBook(startDate, endDate) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch global cash book: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching global cash book:", error);
        throw error;
    }
}
async function fetchGlobalFinancialSummary(year) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/global/summary?year=${year}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch global financial summary: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching global financial summary:", error);
        throw error;
    }
}
async function fetchCompanyComparison(year) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}transactions/reports/global/company-comparison?year=${year}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch company comparison: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching company comparison:", error);
        throw error;
    }
}
async function fetchMainCategories() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/main`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch main categories: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching main categories:", error);
        throw error;
    }
}
async function fetchSubCategories(mainCategoryId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/main/${mainCategoryId}/sub`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch sub categories: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching sub categories:", error);
        throw error;
    }
}
async function fetchSubSubCategories(subCategoryId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/sub/${subCategoryId}/sub-sub`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch sub-sub categories: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching sub-sub categories:", error);
        throw error;
    }
}
async function fetchCategoryTree() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/tree`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch category tree: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching category tree:", error);
        throw error;
    }
}
async function fetchLeafCategories() {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/leaf`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch leaf categories: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching leaf categories:", error);
        throw error;
    }
}
async function fetchCategoryById(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to fetch category: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}
async function createCategory(data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to create category: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}
async function createSubSubCategory(data) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/sub-sub`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to create sub-sub category: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error creating sub-sub category:", error);
        throw error;
    }
}
async function deleteCategory(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to delete category: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
async function restoreCategory(id) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/${id}/restore`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `Failed to restore category: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error restoring category:", error);
        throw error;
    }
}
async function validateCategoryCode(code) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/validate/code?code=${encodeURIComponent(code)}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to validate code: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error validating category code:", error);
        throw error;
    }
}
async function getNextCategoryCode(parentId) {
    try {
        // Use fetchWithAuth instead of native fetch
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fetchWithAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWithAuth"])(`${API_BASE_URL}categories/parent/${parentId}/next-code`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Failed to get next code: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error getting next category code:", error);
        throw error;
    }
}
async function fetchUsers(filters) {
    console.log(filters);
    return apiCall(`users?page=${filters.page}&limit=${filters.limit}&name=${filters.name}`);
}
async function createUser(data) {
    return apiCall("users", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
async function updateUser(id, data) {
    return apiCall(`users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
async function deleteUser(id) {
    await apiCall(`users/${id}`, {
        method: "DELETE"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/login-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-layout.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AppContent() {
    _s();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginForm"], {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 12,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardLayout"], {}, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(AppContent, "1LGxUrjNz4q7iKM/2JDC9lJQ3xY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = AppContent;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContent, {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "AppContent");
__turbopack_context__.k.register(_c1, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_68fe7a95._.js.map