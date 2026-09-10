import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UserPlus,
  Pencil,
  Trash2,
  Shield,
  User as UserIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, type User, type UserFilters } from "@/hooks/use-users";
import { handleApiError } from "@/lib/api-errors";
import { ApiError } from "@/lib/api";
import { UserTableSkeleton, UserFormSkeleton } from "@/components/users/UserSkeleton";

const roleColors: Record<string, string> = {
  admin: "bg-gray-900/10 text-gray-900 border-gray-900/20",
  cfo: "bg-gray-700/10 text-gray-700 border-gray-700/20",
  accountant: "bg-gray-600/10 text-gray-600 border-gray-600/20",
  user: "bg-gray-400/10 text-gray-600 border-gray-400/20",
  viewer: "bg-gray-300/10 text-gray-500 border-gray-300/20",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  cfo: "CFO",
  accountant: "Accountant",
  user: "User",
  viewer: "Viewer",
};

interface UserFormState {
  name: string;
  email: string;
  phone: string;
  role: User["role"];
  password: string;
  profile: {
    gender: string;
    maritalStatus: string;
    position: string;
    dateOfBirth: string;
  };
}

const emptyForm: UserFormState = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
  profile: { gender: "", maritalStatus: "", position: "", dateOfBirth: "" },
};

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 10, name: "" });
  const [formData, setFormData] = useState<UserFormState>(emptyForm);

  const { data: usersResponse, isLoading, isError, error: fetchError, refetch } = useUsers(filters);

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  React.useEffect(() => {
    if (isError && fetchError) {
      toast.error("Error loading users", {
        description: handleApiError(fetchError, "Failed to load users"),
      });
    }
  }, [isError, fetchError]);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const resetForm = () => setFormData(emptyForm);

  const handleOpenCreate = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
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
      },
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.name.length < 4) {
      toast.error("Validation error", { description: "Full name is required and must be at least 4 characters" });
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Validation error", { description: "Please enter a valid email address" });
      return;
    }
    if (!formData.phone) {
      toast.error("Validation error", { description: "Phone number is required" });
      return;
    }
    if (!editingUser && (!formData.password || formData.password.length < 8)) {
      toast.error("Validation error", { description: "Password must be at least 8 characters long" });
      return;
    }

    const hasProfileData = Object.values(formData.profile).some((val) => val);

    if (editingUser) {
      updateMutation.mutate(
        {
          id: editingUser.id,
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            ...(hasProfileData ? { profile: formData.profile } : {}),
          },
        },
        {
          onSuccess: () => {
            toast.success("User updated successfully!", { description: `Changes to ${formData.name} have been saved` });
            setIsDialogOpen(false);
            setEditingUser(null);
            resetForm();
          },
          onError: (error) => {
            const isConflict = error instanceof ApiError && error.status === 409;
            if (isConflict) {
              toast.error("Conflict detected", {
                description: "Another user with this email or phone already exists.",
              });
            } else {
              toast.error("Failed to update user", { description: handleApiError(error, "Failed to update user") });
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          ...(hasProfileData ? { profile: formData.profile } : {}),
        },
        {
          onSuccess: () => {
            toast.success("User created successfully!", {
              description: `${formData.name} has been added as ${roleLabels[formData.role]}`,
            });
            setIsDialogOpen(false);
            resetForm();
          },
          onError: (error) => {
            const isConflict = error instanceof ApiError && error.status === 409;
            if (isConflict) {
              toast.error("User already exists", {
                description: "A user with this email or phone number is already registered. Please use different credentials.",
              });
            } else {
              toast.error("Failed to create user", { description: handleApiError(error, "Failed to create user") });
            }
          },
        }
      );
    }
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error("Action not allowed", { description: "You cannot delete your own account" });
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteMutation.mutate(user.id, {
        onSuccess: () => toast.success("User deleted successfully!"),
        onError: (error) => toast.error("Failed to delete user", { description: handleApiError(error, "Failed to delete user") }),
      });
    }
  };

  const handleSearch = (searchTerm: string) => setFilters({ ...filters, name: searchTerm, page: 1 });
  const handlePageChange = (newPage: number) => setFilters({ ...filters, page: newPage });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <UserTableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load users</h3>
          <p className="text-sm text-gray-500 mb-4">{handleApiError(fetchError, "Unable to fetch user data")}</p>
          <Button onClick={() => refetch()} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gray-50/50">
          <div>
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              User Management
            </CardTitle>
            <p className="text-[10px] text-gray-500 mt-0.5">Manage system users and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-8 h-8 w-48 text-xs border-gray-300 focus:border-gray-400"
                value={filters.name}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenCreate} size="sm" className="h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200">
                <TableHead className="text-[11px] h-8 text-gray-600">User Info</TableHead>
                <TableHead className="text-[11px] h-8 text-gray-600">Contact</TableHead>
                <TableHead className="text-[11px] h-8 text-gray-600">Role &amp; Position</TableHead>
                <TableHead className="text-[11px] h-8 text-gray-600">Joined</TableHead>
                <TableHead className="text-right text-[11px] h-8 text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-gray-500">No users found</p>
                    <p className="text-xs mt-1 text-gray-400">Add a new user to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 border-gray-100">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {user.role === "admin" ? (
                            <Shield className="h-4 w-4 text-gray-700" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-gray-900 truncate">{user.name}</div>
                          <div className="text-[10px] text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-700 truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={`${roleColors[user.role] || roleColors.user} text-[10px] h-5 px-1.5 w-fit border-gray-300`}>
                          {roleLabels[user.role] || user.role}
                        </Badge>
                        {user.profile?.position && (
                          <span className="text-[10px] text-gray-500 truncate">{user.profile.position}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-[11px] text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => handleOpenEdit(user)}
                          disabled={user.id === currentUser?.id}
                          title={user.id === currentUser?.id ? "Cannot edit yourself" : "Edit user"}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(user)}
                          disabled={user.id === currentUser?.id}
                          title={user.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
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

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div className="text-[11px] text-gray-500">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="text-[11px] font-medium px-2 text-gray-700">
                  Page {meta.page} of {meta.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 border-gray-300 text-gray-600 hover:bg-gray-50"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-gray-200">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-base text-gray-800">{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          {createMutation.isPending || updateMutation.isPending ? (
            <UserFormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      minLength={4}
                      placeholder="Enter full name"
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="user@example.com"
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+250 XXX XXX XXX"
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs text-gray-700">
                      Role *
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}>
                      <SelectTrigger className="h-8 text-xs border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="text-xs">
                          Admin
                        </SelectItem>
                        <SelectItem value="cfo" className="text-xs">
                          CFO
                        </SelectItem>
                        <SelectItem value="accountant" className="text-xs">
                          Accountant
                        </SelectItem>
                        <SelectItem value="user" className="text-xs">
                          User
                        </SelectItem>
                        <SelectItem value="viewer" className="text-xs">
                          Viewer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!editingUser && (
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs text-gray-700">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                      minLength={8}
                      placeholder="Minimum 8 characters"
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                    <p className="text-[10px] text-gray-500">Password must be at least 8 characters long</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wide">Profile (Optional)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="position" className="text-xs text-gray-700">
                      Position
                    </Label>
                    <Input
                      id="position"
                      value={formData.profile.position}
                      onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, position: e.target.value } })}
                      placeholder="e.g., Senior Accountant"
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs text-gray-700">
                      Gender
                    </Label>
                    <Select
                      value={formData.profile.gender}
                      onValueChange={(value) => setFormData({ ...formData, profile: { ...formData.profile, gender: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs border-gray-300">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="text-xs">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="text-xs">
                          Female
                        </SelectItem>
                        <SelectItem value="other" className="text-xs">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="maritalStatus" className="text-xs text-gray-700">
                      Marital Status
                    </Label>
                    <Select
                      value={formData.profile.maritalStatus}
                      onValueChange={(value) => setFormData({ ...formData, profile: { ...formData.profile, maritalStatus: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs border-gray-300">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single" className="text-xs">
                          Single
                        </SelectItem>
                        <SelectItem value="married" className="text-xs">
                          Married
                        </SelectItem>
                        <SelectItem value="divorced" className="text-xs">
                          Divorced
                        </SelectItem>
                        <SelectItem value="widowed" className="text-xs">
                          Widowed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfBirth" className="text-xs text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.profile.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, dateOfBirth: e.target.value } })}
                      className="h-8 text-xs border-gray-300 focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="text-xs bg-gray-900 hover:bg-gray-800 text-white"
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;
