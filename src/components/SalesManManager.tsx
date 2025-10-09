import React, { useCallback, useEffect, useState } from "react";
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
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, UserCheck, Eye, Trash2 } from "lucide-react";
import { SalesMan, Branch } from "@/types";
import { branchApi } from "@/api/organisationstructure";
import { salesmanService } from "@/api/salesmanService";
import { toast } from "react-toastify";

const SalesManManager = () => {
  const [salesMen, setSalesMen] = useState<SalesMan[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSalesMan, setEditingSalesMan] = useState<SalesMan | null>(null);
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [addFormKey, setAddFormKey] = useState(0);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingSalesMan, setViewingSalesMan] = useState<SalesMan | null>(null);

  const normalizeId = (obj: any) =>
    obj?.id ?? obj?._id ?? String(obj?.Id ?? obj?.ID ?? "");

  const reloadSales = useCallback(async () => {
    try {
      const list = await salesmanService.getAll();
      const raw = Array.isArray(list) ? list : (list as any)?.data || [];
      const normalized = raw.map((s: any) => ({ ...s, id: normalizeId(s) }));
      setSalesMen(normalized);
    } catch {}
  }, []);

  // Initial load for salesmen and branches
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        setIsLoadingBranches(true);
        const [sales, branches] = await Promise.all([
          salesmanService.getAll(),
          branchApi.getBranches(),
        ]);
        // sales
        const salesRaw = Array.isArray(sales)
          ? sales
          : (sales as any)?.data || [];
        const normalizedSales = salesRaw.map((s: any) => ({
          ...s,
          id: normalizeId(s),
        }));
        if (mounted) setSalesMen(normalizedSales);

        // branches
        const brRaw = Array.isArray(branches)
          ? branches
          : (branches as any)?.data || [];
        const normalizedBranches: Branch[] = (brRaw as any[]).map((b: any) => ({
          ...b,
          id:
            b?.id ??
            b?._id ??
            b?.branchId ??
            b?.code ??
            String(b?.Id ?? b?.ID ?? ""),
          name:
            b?.name ??
            b?.branchName ??
            b?.companyName ??
            b?.branch ??
            b?.mailingName ??
            b?.code ??
            "Unnamed Branch",
        }));
        if (mounted) setBranchList(normalizedBranches);
      } catch (e: any) {
        toast.error(`Failed to load data: ${e?.message || String(e)}`);
      } finally {
        if (mounted) setIsLoadingBranches(false);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, [reloadSales]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: Omit<SalesMan, "id"> = {
      empCode: formData.get("empCode") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      branchId: formData.get("branchId") as string,
      isActive: true,
    };

    salesmanService
      .create(payload)
      .then((createdResp) => {
        const created: any = (createdResp as any)?.data || createdResp;
        const normalized: SalesMan = { ...created, id: normalizeId(created) };
        setSalesMen((prev) => [normalized, ...prev]);
        return reloadSales();
      })
      .then(() => {
        toast.success("Salesman created");
        setIsAddDialogOpen(false);
      })
      .catch((e: any) => {
        toast.error(e?.message || "Failed to add salesman");
      });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSalesMan) return;

    const formData = new FormData(e.currentTarget);

    const update: Partial<SalesMan> = {
      empCode: formData.get("empCode") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      branchId: formData.get("branchId") as string,
      isActive: formData.get("isActive") === "true",
    };

    salesmanService
      .update(editingSalesMan.id, update)
      .then((updatedResp) => {
        const updated: any = (updatedResp as any)?.data || updatedResp;
        setSalesMen((prev) =>
          prev.map((s) =>
            s.id === editingSalesMan.id ? { ...s, ...updated } : s
          )
        );
        return reloadSales();
      })
      .then(() => {
        toast.success("Salesman updated");
        setIsEditDialogOpen(false);
        setEditingSalesMan(null);
      })
      .catch((e: any) => {
        toast.error(e?.message || "Failed to update salesman");
      });
  };

  const openEditDialog = (salesman: SalesMan) => {
    setEditingSalesMan(salesman);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (salesman: SalesMan) => {
    setViewingSalesMan(salesman);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (salesman: SalesMan) => {
    const confirm = window.confirm(
      `Are you sure you want to delete salesman: ${salesman.name}?`
    );
    if (!confirm) return;
    salesmanService
      .delete(salesman.id)
      .then(() => {
        setSalesMen((prev) => prev.filter((s) => s.id !== salesman.id));
        return reloadSales();
      })
      .then(() => toast.success("Salesman deleted"))
      .catch((e: any) =>
        toast.error(e?.message || "Failed to delete salesman")
      );
  };

  const getBranchName = (branchId: string) => {
    const branch = branchList.find((b) => b.id === branchId);
    return branch ? branch.branchname : branchId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <UserCheck className="h-8 w-8" />
            <span>SalesMan</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage sales personnel</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (open) {
              // Remount the form to clear previous selections
              setAddFormKey((k) => k + 1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add SalesMan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New SalesMan</DialogTitle>
            </DialogHeader>
            <form
              key={addFormKey}
              onSubmit={handleSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="empCode">Employee Code</Label>
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
                <select
                  id="branchId"
                  name="branchId"
                  required
                  defaultValue=""
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="" disabled>
                    {isLoadingBranches
                      ? "Loading branches..."
                      : branchList.length === 0
                      ? "No branches found"
                      : "Select"}
                  </option>
                  {branchList.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchname}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                Add SalesMan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SalesMan</DialogTitle>
          </DialogHeader>
          {editingSalesMan && (
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="edit-empCode">Employee Code</Label>
                <Input
                  id="edit-empCode"
                  name="empCode"
                  defaultValue={editingSalesMan.empCode}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingSalesMan.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingSalesMan.phone}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={editingSalesMan.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-branchId">Branch</Label>
                <select
                  id="edit-branchId"
                  name="branchId"
                  required
                  defaultValue={editingSalesMan.branchId}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {isLoadingBranches && (
                    <option value="" disabled>
                      Loading branches...
                    </option>
                  )}
                  {branchList.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-isActive">Status</Label>
                <Select
                  name="isActive"
                  defaultValue={editingSalesMan.isActive.toString()}
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
                  Update SalesMan
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Sales Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesMen.map((salesman) => (
                <TableRow key={salesman.id}>
                  <TableCell className="font-medium">
                    {salesman.empCode}
                  </TableCell>
                  <TableCell>{salesman.name}</TableCell>
                  <TableCell>{salesman.phone}</TableCell>
                  <TableCell>{salesman.email}</TableCell>
                  <TableCell>{getBranchName(salesman.branchId)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={salesman.isActive ? "default" : "secondary"}
                    >
                      {salesman.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openViewDialog(salesman)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(salesman)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(salesman)}
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SalesMan Details</DialogTitle>
          </DialogHeader>
          {viewingSalesMan && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Employee Code</Label>
                  <div className="mt-1 text-sm text-gray-900">
                    {viewingSalesMan.empCode}
                  </div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div className="mt-1 text-sm text-gray-900">
                    {viewingSalesMan.name}
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1 text-sm text-gray-900">
                    {viewingSalesMan.phone}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 text-sm text-gray-900 break-all">
                    {viewingSalesMan.email}
                  </div>
                </div>
                <div>
                  <Label>Branch</Label>
                  <div className="mt-1 text-sm text-gray-900">
                    {getBranchName(viewingSalesMan.branchId)}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        viewingSalesMan.isActive ? "default" : "secondary"
                      }
                    >
                      {viewingSalesMan.isActive ? "Active" : "Inactive"}
                    </Badge>
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
    </div>
  );
};

export default SalesManManager;
