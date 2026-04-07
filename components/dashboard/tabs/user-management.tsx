"use client"

import React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Shield, 
  User as UserIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2
} from "lucide-react"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const roleColors: Record<string, string> = {
  admin: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  cfo: "bg-accent/20 text-accent-foreground border-accent/30",
  accountant: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  user: "bg-muted text-muted-foreground border-border",
  viewer: "bg-muted text-muted-foreground border-border",
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  cfo: "CFO",
  accountant: "Accountant",
  user: "User",
  viewer: "Viewer",
}

export function UserManagement() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    profile: {
      gender: "",
      maritalStatus: "",
      position: "",
      dateOfBirth: "",
    }
  })

  // Fetch users with filters
  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
  })

  console.log("usersResponse", usersResponse)
  
  // Extract users array and meta from response
  const users = usersResponse?.data || []
  const meta = usersResponse?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsDialogOpen(false)
      resetForm()
      showSuccess("User created successfully!")
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to create user")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsDialogOpen(false)
      setEditingUser(null)
      resetForm()
      showSuccess("User updated successfully!")
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update user")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      showSuccess("User deleted successfully!")
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to delete user")
    },
  })

  const showSuccess = (message: string) => {
    setSuccess(message)
    setError("")
    setTimeout(() => setSuccess(""), 5000)
  }

  const showError = (message: string) => {
    setError(message)
    setSuccess("")
    setTimeout(() => setError(""), 5000)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "user",
      password: "",
      profile: {
        gender: "",
        maritalStatus: "",
        position: "",
        dateOfBirth: "",
      }
    })
  }

  const handleOpenCreate = () => {
    setEditingUser(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
      profile: {
        gender: user.profile?.gender || "",
        maritalStatus: user.profile?.maritalStatus || "",
        position: user.profile?.position || "",
        dateOfBirth: user.profile?.dateOfBirth || "",
      }
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      // Update user - exclude password and only send changed fields
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      }

      // Only include profile if any profile field is filled
      if (formData.profile && Object.values(formData.profile).some(val => val)) {
        updateData.profile = formData.profile
      }

      updateMutation.mutate({
        id: editingUser.id,
        data: updateData,
      })
    } else {
      // Create user
      const createData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      }

      // Only include profile if any profile field is filled
      if (formData.profile && Object.values(formData.profile).some(val => val)) {
        createData.profile = formData.profile
      }

      createMutation.mutate(createData)
    }
  }

  const handleDelete = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteMutation.mutate(user.id)
    }
  }

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, name: searchTerm, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-3.5 w-3.5" />
        <AlertDescription className="text-xs">Failed to load users. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {success && (
        <Alert className="bg-chart-1/10 border-chart-1/20 text-chart-1 py-2">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <AlertDescription className="text-xs">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">User Management</CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Manage system users and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 h-8 w-48 text-xs"
                value={filters.name}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenCreate} size="sm" className="h-8 text-xs">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] h-8">User Info</TableHead>
                <TableHead className="text-[11px] h-8">Contact</TableHead>
                <TableHead className="text-[11px] h-8">Role & Position</TableHead>
                <TableHead className="text-[11px] h-8">Joined</TableHead>
                <TableHead className="text-right text-[11px] h-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {user.role === "admin" ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-xs truncate">{user.name}</div>
                          <div className="text-[10px] text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="space-y-0.5">
                        <div className="text-xs truncate">{user.email}</div>
                        <div className="text-[10px] text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="outline" 
                          className={`${roleColors[user.role] || roleColors.user} text-[10px] h-5 px-1.5 w-fit`}
                        >
                          {roleLabels[user.role] || user.role}
                        </Badge>
                        {user.profile?.position && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            {user.profile.position}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleOpenEdit(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="text-[11px] text-muted-foreground">
                Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="text-[11px] font-medium px-2">
                  Page {meta.page} of {meta.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={4}
                    placeholder="Enter full name"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="user@example.com"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+250 XXX XXX XXX"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                      <SelectItem value="cfo" className="text-xs">CFO</SelectItem>
                      <SelectItem value="accountant" className="text-xs">Accountant</SelectItem>
                      <SelectItem value="user" className="text-xs">User</SelectItem>
                      <SelectItem value="viewer" className="text-xs">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="h-8 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-3 pt-2 border-t">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Profile (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-xs">Position</Label>
                  <Input
                    id="position"
                    value={formData.profile?.position || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, position: e.target.value }
                    })}
                    placeholder="e.g., Senior Accountant"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="text-xs">Gender</Label>
                  <Select
                    value={formData.profile?.gender || ""}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, gender: value }
                    })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="text-xs">Male</SelectItem>
                      <SelectItem value="female" className="text-xs">Female</SelectItem>
                      <SelectItem value="other" className="text-xs">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="maritalStatus" className="text-xs">Marital Status</Label>
                  <Select
                    value={formData.profile?.maritalStatus || ""}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, maritalStatus: value }
                    })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single" className="text-xs">Single</SelectItem>
                      <SelectItem value="married" className="text-xs">Married</SelectItem>
                      <SelectItem value="divorced" className="text-xs">Divorced</SelectItem>
                      <SelectItem value="widowed" className="text-xs">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-xs">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.profile?.dateOfBirth || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, dateOfBirth: e.target.value }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-3">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="text-xs"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}