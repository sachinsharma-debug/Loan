import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
const API_URL = "https://api-finance.prudent360.in/api/v1";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  UserCheck,
  Wifi,
  WifiOff,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  status: "active" | "inactive";
  workingMode: "online" | "offline";
  lastActive: string;
  createdAt: string;
  permissions?: string[];
}

const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users_list`);

    // Check if the response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("API returned non-JSON response, using demo data");
      // Return demo data if API is not available
      return [
        {
          _id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          workingMode: "online",
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ["all"],
        },
        {
          _id: "2",
          name: "Manager User",
          email: "manager@example.com",
          role: "manager",
          status: "active",
          workingMode: "online",
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ["read", "write"],
        },
      ];
    }

    const data = await response.json();
    if (response.ok) {
      // Transform API data to match our frontend expectations
      return data.Data.map((user: any) => ({
        ...user,
        id: user._id, // Map _id to id for consistency
        status: user.status || "active", // Default status if not provided
        permissions: user.permissions || [], // Default permissions if not provided
      }));
    }
    throw new Error(data.message || "Failed to fetch users");
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return demo data as fallback
    return [
      {
        _id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        workingMode: "online",
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: ["all"],
      },
      {
        _id: "2",
        name: "Manager User",
        email: "manager@example.com",
        role: "manager",
        status: "active",
        workingMode: "online",
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: ["read", "write"],
      },
    ];
  }
};

const createUser = async (
  user: Omit<User, "_id" | "createdAt">
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    if (response.ok) {
      return data.Data;
    }
    throw new Error(data.message || "Failed to create user");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again.");
  }
};

const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/update_users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    if (response.ok) {
      return data.Data;
    }
    throw new Error(data.message || "Failed to update user");
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user. Please try again.");
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/delete_user_by_id/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user. Please try again.");
  }
};

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "_id" | "createdAt">>({
    name: "",
    email: "",
    role: "staff",
    status: "active",
    workingMode: "online",
    permissions: [],
    lastActive: new Date().toISOString(),
  });

  // Fetch users data
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutation for creating a new user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      setIsAddDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "staff",
        status: "active",
        workingMode: "online",
        permissions: [],
        lastActive: new Date().toISOString(),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create user: " + error.message);
    },
  });

  // Mutation for updating a user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<User> }) =>
      updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to update user: " + error.message);
    },
  });

  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to delete user: " + error.message);
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    createUserMutation.mutate(newUser);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "manager" | "staff",
      status: formData.get("status") as "active" | "inactive",
      workingMode: formData.get("workingMode") as "online" | "offline",
    };

    updateUserMutation.mutate({ id: editingUser._id, user: updatedUser });
  };

  const handleStatusChange = (userId: string, checked: boolean) => {
    updateUserMutation.mutate({
      id: userId,
      user: { status: checked ? "active" : "inactive" },
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getWorkingModeIcon = (mode: string) => {
    return mode === "online" ? (
      <Wifi className="w-4 h-4 text-green-600" />
    ) : (
      <WifiOff className="w-4 h-4 text-gray-400" />
    );
  };

  const rolePermissions = {
    admin: [
      "user_management",
      "system_settings",
      "reports",
      "all_loans",
      "all_members",
    ],
    manager: [
      "reports",
      "approve_loans",
      "member_management",
      "loan_management",
    ],
    staff: ["view_members", "view_loans", "basic_operations"],
  };

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-500">
        Error loading users: {error.message}
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingMode">Working Mode</Label>
                <Select
                  value={newUser.workingMode}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, workingMode: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(rolePermissions[newUser.role] || []).map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Switch
                        id={permission}
                        checked={newUser.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewUser({
                              ...newUser,
                              permissions: [...newUser.permissions, permission],
                            });
                          } else {
                            setNewUser({
                              ...newUser,
                              permissions: newUser.permissions.filter(
                                (p) => p !== permission
                              ),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={
                  createUserMutation.isPending ||
                  !newUser.name ||
                  !newUser.email
                }
              >
                {createUserMutation.isPending ? "Creating..." : "Add User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Online Users</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.workingMode === "online").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Working Mode</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getWorkingModeIcon(user.workingMode)}
                      <span className="capitalize">{user.workingMode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={user.status === "active"}
                        onCheckedChange={(checked) =>
                          handleStatusChange(user._id, checked)
                        }
                        disabled={updateUserMutation.isPending}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingUser.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select name="role" defaultValue={editingUser.role} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    name="status"
                    defaultValue={editingUser.status}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-workingMode">Working Mode</Label>
                  <Select
                    name="workingMode"
                    defaultValue={editingUser.workingMode}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm text-gray-600">{viewingUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{viewingUser.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="text-sm text-gray-600">
                    {getRoleBadge(viewingUser.role)}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm text-gray-600">
                    {getStatusBadge(viewingUser.status)}
                  </p>
                </div>
                <div>
                  <Label>Working Mode</Label>
                  <div className="flex items-center space-x-2">
                    {getWorkingModeIcon(viewingUser.workingMode)}
                    <span className="text-sm text-gray-600 capitalize">
                      {viewingUser.workingMode}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(viewingUser.lastActive).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(viewingUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Permissions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(viewingUser.permissions || []).map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          {userToDelete && (
            <div className="space-y-4">
              <p>
                Are you sure you want to delete user{" "}
                <strong>{userToDelete.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={deleteUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteUserMutation.mutate(userToDelete._id)}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
