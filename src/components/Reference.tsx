import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, UserCheck, Eye, Trash2 } from "lucide-react";
import type { Reference as ReferenceType, Branch } from "@/types";
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { branchApi } from "@/api/organisationstructure";
import { toast } from "react-toastify";

interface ReferenceManagerProps {
  references: ReferenceType[];
  branches: Branch[];
  onAddReference: (data: Omit<ReferenceType, "id">) => Promise<void> | void;
  onUpdateReference: (
    id: string,
    data: Partial<ReferenceType>
  ) => Promise<void> | void;
  onDeleteReference?: (id: string) => Promise<void> | void;
}

const Reference = ({
  references,
  branches,
  onAddReference,
  onUpdateReference,
  onDeleteReference,
}: ReferenceManagerProps) => {
  // Debug props at the start
  console.log("Reference component props:", {
    onAddReference: typeof onAddReference,
    onUpdateReference: typeof onUpdateReference,
    referencesCount: references?.length || 0,
    branchesCount: branches?.length || 0,
  });
  console.log("Reference component props:", {
    references: references?.length || 0,
    branches: branches?.length || 0,
    onAddReference: typeof onAddReference,
    onUpdateReference: typeof onUpdateReference,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<ReferenceType | null>(null);
  const [viewReference, setViewReference] = useState<ReferenceType | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ReferenceType | null>(null);

  // Safe fallbacks to avoid runtime errors if props are not provided yet
  const safeBranches = branches ?? [];
  const [branchOptions, setBranchOptions] = useState<Branch[]>([]);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [addBranchId, setAddBranchId] = useState<string>("");
  const [editBranchId, setEditBranchId] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // When branch options are loaded, default addBranchId to first option if empty
  useEffect(() => {
    if (!addBranchId && branchOptions.length > 0) {
      setAddBranchId(branchOptions[0].id);
      console.log("Auto-selected branch:", branchOptions[0]); // Debug log
    }
  }, [branchOptions, addBranchId]);

  // Always fetch branches from API so options reflect the database
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await branchApi.getBranches();
        const raw = Array.isArray(list)
          ? list
          : Array.isArray((list as any)?.data)
          ? (list as any).data
          : [];
        const normalized: Branch[] = raw.map((b: any) => ({
          ...b,
          id:
            b.id ??
            b._id ??
            b.branchId ??
            b.code ??
            String(b.Id ?? b.ID ?? b._id ?? b.code ?? ""),
          name:
            b.name ??
            b.branchName ??
            b.companyName ??
            b.branch ??
            b.mailingName ??
            b.code ??
            "Unnamed Branch",
        }));
        if (mounted) {
          setBranchOptions(normalized);
          console.log("Loaded branches:", normalized); // Debug log
        }
      } catch (e: any) {
        if (mounted) setBranchError(e?.message || "Failed to load branches");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const safeReferences = references ?? [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      empCode: formData.get("empCode") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      branchId: addBranchId || (formData.get("branchId") as string),
      isActive: true,
    } as Omit<ReferenceType, "id">;

    console.log("Submitting payload:", payload); // Debug log

    if (!payload.branchId) {
      toast.error("Please select a branch");
      return;
    }

    try {
      await onAddReference(payload);
      toast.success("Reference added successfully");
      setIsAddDialogOpen(false);
      setAddBranchId("");
      // Clear form
      e.currentTarget.reset();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.message || "Failed to add reference");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReference) return;

    const formData = new FormData(e.currentTarget);
    const update = {
      empCode: formData.get("empCode") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      branchId:
        editBranchId ||
        (formData.get("branchId") as string) ||
        editingReference.branchId,
      isActive: formData.get("isActive") === "true",
    } as Partial<ReferenceType>;

    console.log("Updating reference:", update); // Debug log

    if (!update.branchId) {
      toast.error("Please select a branch");
      return;
    }

    try {
      await onUpdateReference(editingReference.id, update);
      setIsEditDialogOpen(false);
      setEditingReference(null);
      setEditBranchId("");
      toast.success("Reference updated successfully");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err?.message || "Failed to update reference");
    }
  };

  const openEditDialog = (reference: ReferenceType) => {
    setEditingReference(reference);
    setEditBranchId(reference.branchId || "");
    setEditIsActive(!!reference.isActive);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (reference: ReferenceType) => {
    setViewReference(reference);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (reference: ReferenceType) => {
    setDeleteTarget(reference);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (!onDeleteReference) {
        toast.error("Delete action not available");
        return;
      }
      await onDeleteReference(deleteTarget.id);
      toast.success("Reference deleted");
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete reference");
    }
  };

  const getBranchName = (branchId: string) => {
    const source =
      branchOptions && branchOptions.length > 0 ? branchOptions : safeBranches;
    const branch = source.find((b) => b.id === branchId);
    return branch ? branch.branchname : branchId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <UserCheck className="h-8 w-8" />
            <span>Reference</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage references</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reference</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              {/* Hidden input to ensure FormData captures branchId from Radix Select */}
              <input type="hidden" name="branchId" value={addBranchId} />
              <div>
                <Label htmlFor="empCode">Reference Code</Label>
                <Input id="empCode" name="empCode" required />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="accountUnder">Account Under</Label>
                <Input id="accountUnder" name="accountUnder" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="branchId">Branch</Label>
                <Select
                  required
                  onValueChange={setAddBranchId}
                  value={addBranchId || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {(branchOptions && branchOptions.length > 0
                      ? branchOptions
                      : safeBranches
                    ).length === 0 ? (
                      <SelectItem disabled value="__no_branch__">
                        No branches found
                      </SelectItem>
                    ) : (
                      (branchOptions && branchOptions.length > 0
                        ? branchOptions
                        : safeBranches
                      ).map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.branchname}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {branchError && (
                  <p className="mt-1 text-xs text-red-600">{branchError}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Add Reference
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reference</DialogTitle>
          </DialogHeader>
          {editingReference && (
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              {/* Hidden input to ensure FormData captures branchId from Radix Select */}
              <input
                type="hidden"
                name="branchId"
                value={editBranchId || editingReference.branchId}
              />
              {/* Hidden input for isActive since Radix Select isn't a native input */}
              <input
                type="hidden"
                name="isActive"
                value={editIsActive ? "true" : "false"}
              />
              <div>
                <Label htmlFor="edit-empCode">Employee Code</Label>
                <Input
                  id="edit-empCode"
                  name="empCode"
                  defaultValue={editingReference.empCode}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingReference.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingReference.phone}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={editingReference.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-branchId">Branch</Label>
                <Select
                  value={editBranchId || editingReference.branchId}
                  onValueChange={setEditBranchId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(branchOptions && branchOptions.length > 0
                      ? branchOptions
                      : safeBranches
                    ).length === 0 ? (
                      <SelectItem disabled value="__no_branch__">
                        No branches found
                      </SelectItem>
                    ) : (
                      (branchOptions && branchOptions.length > 0
                        ? branchOptions
                        : safeBranches
                      ).map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.branchname}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {branchError && (
                  <p className="mt-1 text-xs text-red-600">{branchError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-isActive">Status</Label>
                <Select
                  value={editIsActive.toString()}
                  onValueChange={(v) => setEditIsActive(v === "true")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Reference
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reference Details</DialogTitle>
          </DialogHeader>
          {viewReference && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Reference Code: </span>
                <span>{viewReference.empCode}</span>
              </div>
              <div>
                <span className="font-medium">Name: </span>
                <span>{viewReference.name}</span>
              </div>
              <div>
                <span className="font-medium">Phone: </span>
                <span>{viewReference.phone}</span>
              </div>
              <div>
                <span className="font-medium">Email: </span>
                <span>{viewReference.email}</span>
              </div>
              <div>
                <span className="font-medium">Branch: </span>
                <span>{getBranchName(viewReference.branchId)}</span>
              </div>
              <div>
                <span className="font-medium">Status: </span>
                <span>{viewReference.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reference</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>Are you sure you want to delete this reference?</p>
            {deleteTarget && (
              <p className="text-gray-600">
                {deleteTarget.empCode} — {deleteTarget.name}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeReferences.map((reference) => (
                <TableRow key={reference.id}>
                  <TableCell className="font-medium">
                    {reference.empCode}
                  </TableCell>
                  <TableCell>{reference.name}</TableCell>
                  <TableCell>{reference.phone}</TableCell>
                  <TableCell>{reference.email}</TableCell>
                  <TableCell>{getBranchName(reference.branchId)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={reference.isActive ? "default" : "secondary"}
                    >
                      {reference.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openViewDialog(reference)}
                        aria-label="View"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(reference)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(reference)}
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reference;
