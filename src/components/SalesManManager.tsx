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
import { chartOfAccountsService } from "@/api/chartOfAccountsService";
import { toast } from "react-toastify";

const SalesManManager = () => {
  const [salesMen, setSalesMen] = useState<SalesMan[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit" | "view">("add");
  const [editingSalesMan, setEditingSalesMan] = useState<SalesMan | null>(null);
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [addFormKey, setAddFormKey] = useState(0);
  // unified dialog: remove separate view/edit dialogs
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [communicationAddress, setCommunicationAddress] = useState({
    address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    postoffice: "",
    policestation: "",
    landmark: "",
  });
  // Toggle for autofill by pincode
  const [enableCommPincodeAutofill, setEnableCommPincodeAutofill] =
    useState("no");

  // Accounting Groups options (from Chart of Accounts)
  const [accountGroups, setAccountGroups] = useState<string[]>([]);
  const [isLoadingAccountGroups, setIsLoadingAccountGroups] = useState(false);

  const loadAccountGroups = useCallback(async () => {
    try {
      setIsLoadingAccountGroups(true);
      const all: any[] = (await chartOfAccountsService.getAll()) as any[];
      const wanted = new Set(["broker", "agent", "salesman"]);
      const names = Array.from(
        new Set(
          (all || [])
            .filter((a: any) =>
              wanted.has(String(a?.AccountType || "").toLowerCase())
            )
            .map((a: any) => String(a?.accountName || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
      setAccountGroups(names);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load accounting groups");
    } finally {
      setIsLoadingAccountGroups(false);
    }
  }, []);

  const normalizeId = (obj: any) =>
    obj?.id ?? obj?._id ?? String(obj?.Id ?? obj?.ID ?? "");

  // Handle checkbox change
  const handleSameAddressChange = (checked: boolean) => {
    setIsSameAddress(checked);
    if (checked) {
      // Copy communication address to permanent address fields
      const form = document.querySelector("form");
      if (form) {
        (form.elements.namedItem("perm_address") as HTMLTextAreaElement).value =
          communicationAddress.address;
        (form.elements.namedItem("perm_state") as HTMLInputElement).value =
          communicationAddress.state;
        (form.elements.namedItem("perm_district") as HTMLInputElement).value =
          communicationAddress.district;
        (form.elements.namedItem("perm_city") as HTMLInputElement).value =
          communicationAddress.city;
        (form.elements.namedItem("perm_pincode") as HTMLInputElement).value =
          communicationAddress.pincode;
        (form.elements.namedItem("perm_postoffice") as HTMLInputElement).value =
          communicationAddress.postoffice;
        (
          form.elements.namedItem("perm_policestation") as HTMLInputElement
        ).value = communicationAddress.policestation;
        (form.elements.namedItem("perm_landmark") as HTMLInputElement).value =
          communicationAddress.landmark;
      }
    }
  };

  // Handle communication address field changes
  const handleCommunicationAddressChange = (field: string, value: string) => {
    const newAddress = { ...communicationAddress, [field]: value };
    setCommunicationAddress(newAddress);

    // If same address is checked, update permanent address fields
    if (isSameAddress) {
      const form = document.querySelector("form");
      if (form) {
        const permField = form.elements.namedItem(`perm_${field}`) as
          | HTMLInputElement
          | HTMLTextAreaElement;
        if (permField) {
          permField.value = value;
        }
      }
    }
  };

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
      accountingGroup: (formData.get("accountingGroup") as string) || undefined,
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
      accountingGroup: (formData.get("accountingGroup") as string) || undefined,
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
        setIsAddDialogOpen(false);
        setFormMode("add");
        setEditingSalesMan(null);
      })
      .catch((e: any) => {
        toast.error(e?.message || "Failed to update salesman");
      });
  };

  const openEditDialog = (salesman: SalesMan) => {
    setEditingSalesMan(salesman);
    setFormMode("edit");
    // seed communication address state if available on salesman
    setCommunicationAddress((prev) => ({
      ...prev,
      address: (salesman as any)?.comm_address || prev.address,
      state: (salesman as any)?.comm_state || prev.state,
      district: (salesman as any)?.comm_district || prev.district,
      city: (salesman as any)?.comm_city || prev.city,
      pincode: (salesman as any)?.comm_pincode || prev.pincode,
      postoffice: (salesman as any)?.comm_postoffice || prev.postoffice,
      policestation:
        (salesman as any)?.comm_policestation || prev.policestation,
      landmark: (salesman as any)?.comm_landmark || prev.landmark,
    }));
    setIsAddDialogOpen(true);
  };

  const openViewDialog = (salesman: SalesMan) => {
    setEditingSalesMan(salesman);
    setFormMode("view");
    setCommunicationAddress((prev) => ({
      ...prev,
      address: (salesman as any)?.comm_address || prev.address,
      state: (salesman as any)?.comm_state || prev.state,
      district: (salesman as any)?.comm_district || prev.district,
      city: (salesman as any)?.comm_city || prev.city,
      pincode: (salesman as any)?.comm_pincode || prev.pincode,
      postoffice: (salesman as any)?.comm_postoffice || prev.postoffice,
      policestation:
        (salesman as any)?.comm_policestation || prev.policestation,
      landmark: (salesman as any)?.comm_landmark || prev.landmark,
    }));
    setIsAddDialogOpen(true);
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
              // For add mode, clear the form; for edit/view, keep existing values
              setAddFormKey((k) => k + 1);
              setIsSameAddress(false);
              loadAccountGroups();
              if (formMode === "add") {
                setEditingSalesMan(null);
                setCommunicationAddress({
                  address: "",
                  state: "",
                  district: "",
                  city: "",
                  pincode: "",
                  postoffice: "",
                  policestation: "",
                  landmark: "",
                });
              }
            } else {
              // Reset mode when closing
              setFormMode("add");
              setEditingSalesMan(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setFormMode("add");
                setEditingSalesMan(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add SalesMan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {formMode === "add"
                  ? "Add New SalesMan"
                  : formMode === "edit"
                  ? "Edit SalesMan"
                  : "View SalesMan"}
              </DialogTitle>
            </DialogHeader>
            <div className=" max-w-4xl max-h-[80vh] overflow-y-auto">
              <form
                key={addFormKey}
                onSubmit={formMode === "edit" ? handleEditSubmit : handleSubmit}
                onKeyDown={createFormKeyDownHandler()}
                className="space-y-3"
              >
                <div className="space-y-1 mr-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Label
                      htmlFor="masterId"
                      className="text-xs w-40 text-right"
                    >
                      Master ID:
                    </Label>
                    <Input
                      id="masterId"
                      name="masterId"
                      className="h-6 text-xs flex-1"
                      disabled={formMode === "view"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="alterId"
                      className="text-xs w-40 text-right"
                    >
                      Alter ID:
                    </Label>
                    <Input
                      id="alterId"
                      name="alterId"
                      className="h-6 text-xs flex-1"
                      disabled={formMode === "view"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="companyId"
                      className="text-xs w-40 text-right"
                    >
                      Company ID:
                    </Label>
                    <Input
                      id="companyId"
                      name="companyId"
                      className="h-6 text-xs flex-1"
                      disabled={formMode === "view"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="empCode"
                      className="text-xs w-40 text-right"
                    >
                      Employee Code:
                    </Label>
                    <Input
                      id="empCode"
                      name="empCode"
                      className="h-6 text-xs flex-1"
                      required
                      disabled={formMode === "view"}
                      defaultValue={editingSalesMan?.empCode || undefined}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="name" className="text-xs w-40 text-right">
                      Name:
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      className="h-6 text-xs flex-1"
                      required
                      disabled={formMode === "view"}
                      defaultValue={editingSalesMan?.name || undefined}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="accountingGroup"
                      className="text-xs w-40 text-right"
                    >
                      Accounting Group:
                    </Label>
                    <div className="flex-1">
                      <Select
                        name="accountingGroup"
                        required
                        defaultValue={editingSalesMan?.accountingGroup || ""}
                        disabled={formMode === "view"}
                      >
                        <SelectTrigger className="h-6 text-xs w-full">
                          <SelectValue
                            placeholder={
                              isLoadingAccountGroups
                                ? "Loading groups..."
                                : accountGroups.length === 0
                                ? "No groups found"
                                : "Select accounting group"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {accountGroups.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="phone" className="text-xs w-40 text-right">
                      Phone:
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="h-6 text-xs flex-1"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                      disabled={formMode === "view"}
                      defaultValue={editingSalesMan?.phone || undefined}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email" className="text-xs w-40 text-right">
                      Email:
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="h-6 text-xs flex-1"
                      required
                      disabled={formMode === "view"}
                      defaultValue={editingSalesMan?.email || undefined}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="branchId"
                      className="text-xs w-40 text-right"
                    >
                      Branch:
                    </Label>
                    <div className="flex-1">
                      <Select
                        name="branchId"
                        required
                        defaultValue={editingSalesMan?.branchId || ""}
                        disabled={formMode === "view"}
                      >
                        <SelectTrigger className="h-6 text-xs w-full">
                          <SelectValue
                            placeholder={
                              isLoadingBranches
                                ? "Loading branches..."
                                : branchList.length === 0
                                ? "No branches found"
                                : "Select branch"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {branchList.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.branchname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="isActive"
                      className="text-xs w-40 text-right"
                    >
                      Status:
                    </Label>
                    <div className="flex-1">
                      <Select
                        name="isActive"
                        required
                        defaultValue={
                          editingSalesMan
                            ? editingSalesMan.isActive.toString()
                            : "true"
                        }
                        disabled={formMode === "view" || formMode === "add"}
                      >
                        <SelectTrigger className="h-6 text-xs w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Address Section */}
                  <div className="mt-6">
                    <div className="text-center text-lg font-semibold mb-4 text-gray-800">
                      Address Information
                    </div>

                    {/* Two column layout for addresses */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Communication Address */}
                      <div className="space-y-2">
                        <div className="text-center text-sm font-semibold mb-3 text-gray-700 border-b pb-1">
                          Communication Address
                        </div>
                        <div className="flex items-start gap-2">
                          <Label className="text-xs w-24 text-right mt-1 flex-shrink-0">
                            Address:
                          </Label>
                          <textarea
                            id="comm_address"
                            name="comm_address"
                            className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none"
                            rows={2}
                            value={communicationAddress.address}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "address",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {/* Autofill by Pincode with Toggle */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Autofill by Pincode:
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">No</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={enableCommPincodeAutofill === "yes"}
                                onChange={(e) =>
                                  setEnableCommPincodeAutofill(
                                    e.target.checked ? "yes" : "no"
                                  )
                                }
                                className="sr-only peer"
                                disabled={formMode === "view"}
                              />
                              <div
                                className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                                  enableCommPincodeAutofill === "yes"
                                    ? "bg-blue-600"
                                    : "bg-gray-200"
                                } relative`}
                              >
                                <div
                                  className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                                    enableCommPincodeAutofill === "yes"
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></div>
                              </div>
                            </label>
                            <span className="text-xs">Yes</span>
                          </div>
                          {enableCommPincodeAutofill === "yes" && (
                            <Input
                              type="text"
                              className="h-6 text-xs flex-1"
                              placeholder="Enter pincode"
                              value={communicationAddress.pincode}
                              disabled={formMode === "view"}
                              onChange={async (e) => {
                                const pincode = e.target.value;
                                handleCommunicationAddressChange(
                                  "pincode",
                                  pincode
                                );
                                if (
                                  pincode.length === 6 &&
                                  /^\d{6}$/.test(pincode)
                                ) {
                                  try {
                                    const res = await fetch(
                                      `https://api.postalpincode.in/pincode/${pincode}`
                                    );
                                    const data = await res.json();
                                    const info = data?.[0]?.PostOffice?.[0];
                                    if (info) {
                                      setCommunicationAddress((prev) => ({
                                        ...prev,
                                        state: info.State || prev.state,
                                        district:
                                          info.District || prev.district,
                                        city: info.Block || prev.city,
                                        postoffice:
                                          info.Name || prev.postoffice,
                                      }));
                                      toast.success(
                                        "Address autofilled by pincode"
                                      );
                                    } else {
                                      toast.error(
                                        "No address found for this pincode"
                                      );
                                    }
                                  } catch {
                                    toast.error("Failed to autofill address");
                                  }
                                } else if (pincode.length === 0) {
                                  setCommunicationAddress((prev) => ({
                                    ...prev,
                                    state: "",
                                    district: "",
                                    city: "",
                                    postoffice: "",
                                  }));
                                }
                              }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            State:
                          </Label>
                          <Input
                            id="comm_state"
                            name="comm_state"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.state}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "state",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            District:
                          </Label>
                          <Input
                            id="comm_district"
                            name="comm_district"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.district}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "district",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            City:
                          </Label>
                          <Input
                            id="comm_city"
                            name="comm_city"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.city}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "city",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Pincode:
                          </Label>
                          <Input
                            id="comm_pincode"
                            name="comm_pincode"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.pincode}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "pincode",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Post Office:
                          </Label>
                          <Input
                            id="comm_postoffice"
                            name="comm_postoffice"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.postoffice}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "postoffice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Police Station:
                          </Label>
                          <Input
                            id="comm_policestation"
                            name="comm_policestation"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.policestation}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "policestation",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Landmark:
                          </Label>
                          <Input
                            id="comm_landmark"
                            name="comm_landmark"
                            className="h-6 text-xs flex-1"
                            value={communicationAddress.landmark}
                            disabled={formMode === "view"}
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "landmark",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Vertical divider line */}
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 -ml-3"></div>

                        {/* Permanent Address */}
                        <div className="space-y-2">
                          <div className="text-center text-sm font-semibold mb-3 text-gray-700 border-b pb-1">
                            Permanent Address
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <input
                              type="checkbox"
                              id="same_as_comm"
                              name="same_as_comm"
                              className="h-4 w-4"
                              checked={isSameAddress}
                              onChange={(e) =>
                                handleSameAddressChange(e.target.checked)
                              }
                            />
                            <Label
                              htmlFor="same_as_comm"
                              className="text-xs cursor-pointer"
                            >
                              Same as Communication Address
                            </Label>
                          </div>
                          <div className="flex items-start gap-2">
                            <Label className="text-xs w-24 text-right mt-1 flex-shrink-0">
                              Address:
                            </Label>
                            <textarea
                              id="perm_address"
                              name="perm_address"
                              className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none"
                              rows={2}
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.address
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              State:
                            </Label>
                            <Input
                              id="perm_state"
                              name="perm_state"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.state
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              District:
                            </Label>
                            <Input
                              id="perm_district"
                              name="perm_district"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.district
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              City:
                            </Label>
                            <Input
                              id="perm_city"
                              name="perm_city"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.city
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Pincode:
                            </Label>
                            <Input
                              id="perm_pincode"
                              name="perm_pincode"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.pincode
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Post Office:
                            </Label>
                            <Input
                              id="perm_postoffice"
                              name="perm_postoffice"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.postoffice
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Police Station:
                            </Label>
                            <Input
                              id="perm_policestation"
                              name="perm_policestation"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.policestation
                                  : undefined
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Landmark:
                            </Label>
                            <Input
                              id="perm_landmark"
                              name="perm_landmark"
                              className="h-6 text-xs flex-1"
                              disabled={isSameAddress}
                              value={
                                isSameAddress
                                  ? communicationAddress.landmark
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    {formMode === "view" ? "Close" : "Cancel"}
                  </Button>
                  {formMode !== "view" && (
                    <Button type="submit">
                      {formMode === "edit" ? "Update SalesMan" : "Add SalesMan"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Unified dialog replaces separate Edit dialog */}

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

      {/* Unified dialog replaces separate View dialog */}
    </div>
  );
};

export default SalesManManager;
