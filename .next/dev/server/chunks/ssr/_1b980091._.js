module.exports = [
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000/") || "";
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const USER_STORAGE_KEY = "irebe_user";
const TOKENS_STORAGE_KEY = "irebe_tokens";
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check auth on mount - only runs client-side
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, password)=>{
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
                const errorData = await response.json().catch(()=>({}));
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
    }, []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setUser(null);
        setTokens(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKENS_STORAGE_KEY);
        localStorage.removeItem("irebe_active_tab");
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: isMounted && !!user,
            isLoading: !isMounted || isLoading,
            tokens,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
}),
"[project]/lib/query-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function QueryProvider({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    refetchOnWindowFocus: false
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/query-provider.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000/") || "";
// =====================================================
// HELPER FUNCTIONS
// =====================================================
async function apiCall(endpoint, options) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        ...options
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
        const response = await fetch(`${API_BASE_URL}company`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch companies: ${response.status}`);
        }
        const data = await response.json();
        return data.companies;
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
}
async function fetchCompanyById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}company/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}company/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}company/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}company/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/company/${companyId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/category/${categoryId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/date-range/${companyId}?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
    return apiCall("/transactions/create", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
async function updateTransaction(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}transactions/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}transactions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error(`Failed to delete transaction: ${response.status}`);
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}
async function fetchRecurringTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}transactions/recurring`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/recurring/company/${companyId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/recurring`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}transactions/recurring/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error(`Failed to delete recurring transaction: ${response.status}`);
    } catch (error) {
        console.error("Error deleting recurring transaction:", error);
        throw error;
    }
}
async function executeRecurringTransaction(id) {
    try {
        const response = await fetch(`${API_BASE_URL}transactions/recurring/${id}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/income-statement/${companyId}?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/cash-book/${companyId}?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/global/income-statement?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/global/summary?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}transactions/reports/global/company-comparison?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/main`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/main/${mainCategoryId}/sub`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/sub/${subCategoryId}/sub-sub`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/tree`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/leaf`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}categories/sub-sub`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
        const response = await fetch(`${API_BASE_URL}categories/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/${id}/restore`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/validate/code?code=${encodeURIComponent(code)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        const response = await fetch(`${API_BASE_URL}categories/parent/${parentId}/next-code`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
    return apiCall("users");
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
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/login-form.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-layout.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function AppContent() {
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoginForm"], {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 12,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardLayout"], {}, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContent, {}, void 0, false, {
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
}),
];

//# sourceMappingURL=_1b980091._.js.map