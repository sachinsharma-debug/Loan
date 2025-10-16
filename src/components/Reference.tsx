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
  const [addFormKey, setAddFormKey] = useState(0);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [enableCommPincodeAutofill, setEnableCommPincodeAutofill] =
    useState(false);
  const [commAutofillPincode, setCommAutofillPincode] = useState("");
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

  // Safe fallbacks to avoid runtime errors if props are not provided yet
  const safeBranches = branches ?? [];
  const [branchOptions, setBranchOptions] = useState<Branch[]>([]);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [addBranchId, setAddBranchId] = useState<string>("");
  const [editBranchId, setEditBranchId] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

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
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (open) {
              // Remount the form to clear previous selections
              setAddFormKey((k) => k + 1);
              // Reset address states
              setIsSameAddress(false);
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
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Reference</DialogTitle>
            </DialogHeader>
            <div className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <form
                key={addFormKey}
                onSubmit={handleSubmit}
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
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="empCode"
                      className="text-xs w-40 text-right"
                    >
                      Reference Code:
                    </Label>
                    <Input
                      id="empCode"
                      name="empCode"
                      className="h-6 text-xs flex-1"
                      required
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
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="accountingGroup"
                      className="text-xs w-40 text-right"
                    >
                      Accounting Group:
                    </Label>
                    <Input
                      id="accountingGroup"
                      name="accountingGroup"
                      className="h-6 text-xs flex-1"
                      required
                    />
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
                      <Select name="branchId" required defaultValue="">
                        <SelectTrigger className="h-6 text-xs w-full">
                          <SelectValue
                            placeholder={
                              branchOptions.length === 0
                                ? "Loading branches..."
                                : "Select branch"
                            }
                          />
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
                            onChange={(e) =>
                              handleCommunicationAddressChange(
                                "address",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {/* Autofill by Pincode field - placed exactly like in SalesManManager */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Autofill by Pincode:
                          </Label>
                          <div
                            className={`relative w-12 h-6 flex items-center cursor-pointer select-none mr-2 ${
                              enableCommPincodeAutofill
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            } rounded-full transition-colors`}
                            onClick={() => {
                              setEnableCommPincodeAutofill((prev) => {
                                const next = !prev;
                                if (!next) {
                                  setCommAutofillPincode("");
                                  setCommunicationAddress((prevAddr) => ({
                                    ...prevAddr,
                                    pincode: "",
                                    state: "",
                                    district: "",
                                    city: "",
                                    postoffice: "",
                                  }));
                                }
                                return next;
                              });
                            }}
                          >
                            <div
                              className={`absolute left-0 top-0 w-12 h-6 flex items-center px-1`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                                  enableCommPincodeAutofill
                                    ? "translate-x-6"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                          {enableCommPincodeAutofill && (
                            <Input
                              type="text"
                              className="h-6 text-xs flex-1"
                              placeholder="Enter pincode to autofill"
                              maxLength={6}
                              value={commAutofillPincode}
                              onChange={async (e) => {
                                const pincode = e.target.value;
                                setCommAutofillPincode(pincode);
                                if (pincode.length === 6) {
                                  try {
                                    const response = await fetch(
                                      `https://api.postalpincode.in/pincode/${pincode}`
                                    );
                                    const data = await response.json();
                                    if (
                                      data &&
                                      data[0] &&
                                      data[0].Status === "Success" &&
                                      data[0].PostOffice &&
                                      data[0].PostOffice.length > 0
                                    ) {
                                      const postOffice = data[0].PostOffice[0];
                                      const newAddress = {
                                        ...communicationAddress,
                                        pincode: pincode,
                                        state: postOffice.State || "",
                                        district: postOffice.District || "",
                                        city: postOffice.Name || "",
                                        postoffice: postOffice.Name || "",
                                      };
                                      setCommunicationAddress(newAddress);
                                      if (isSameAddress) {
                                        const form =
                                          document.querySelector("form");
                                        if (form) {
                                          (
                                            form.elements.namedItem(
                                              "perm_state"
                                            ) as HTMLInputElement
                                          ).value = postOffice.State || "";
                                          (
                                            form.elements.namedItem(
                                              "perm_district"
                                            ) as HTMLInputElement
                                          ).value = postOffice.District || "";
                                          (
                                            form.elements.namedItem(
                                              "perm_city"
                                            ) as HTMLInputElement
                                          ).value = postOffice.Name || "";
                                          (
                                            form.elements.namedItem(
                                              "perm_postoffice"
                                            ) as HTMLInputElement
                                          ).value = postOffice.Name || "";
                                          (
                                            form.elements.namedItem(
                                              "perm_pincode"
                                            ) as HTMLInputElement
                                          ).value = pincode;
                                        }
                                      }
                                    }
                                  } catch (error) {
                                    toast.error("Error fetching pincode data");
                                  }
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
                    Cancel
                  </Button>
                  <Button type="submit">Add Reference</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Reference</DialogTitle>
          </DialogHeader>
          {editingReference && (
            <div className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <form
                onSubmit={handleEditSubmit}
                onKeyDown={createFormKeyDownHandler()}
                className="space-y-3"
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
                <div className="space-y-1 mr-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Label
                      htmlFor="edit-masterId"
                      className="text-xs w-40 text-right"
                    >
                      Master ID:
                    </Label>
                    <Input
                      id="edit-masterId"
                      name="masterId"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.masterId || ""}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-alterId"
                      className="text-xs w-40 text-right"
                    >
                      Alter ID:
                    </Label>
                    <Input
                      id="edit-alterId"
                      name="alterId"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.alterId || ""}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-companyId"
                      className="text-xs w-40 text-right"
                    >
                      Company ID:
                    </Label>
                    <Input
                      id="edit-companyId"
                      name="companyId"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.companyId || ""}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-empCode"
                      className="text-xs w-40 text-right"
                    >
                      Reference Code:
                    </Label>
                    <Input
                      id="edit-empCode"
                      name="empCode"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.empCode}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-name"
                      className="text-xs w-40 text-right"
                    >
                      Name:
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.name}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-accountingGroup"
                      className="text-xs w-40 text-right"
                    >
                      Accounting Group:
                    </Label>
                    <Input
                      id="edit-accountingGroup"
                      name="accountingGroup"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.accountingGroup || ""}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-phone"
                      className="text-xs w-40 text-right"
                    >
                      Phone:
                    </Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      type="tel"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.phone}
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-email"
                      className="text-xs w-40 text-right"
                    >
                      Email:
                    </Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      className="h-6 text-xs flex-1"
                      defaultValue={editingReference.email}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-branchId"
                      className="text-xs w-40 text-right"
                    >
                      Branch:
                    </Label>
                    <div className="flex-1">
                      <Select
                        value={editBranchId || editingReference.branchId}
                        onValueChange={setEditBranchId}
                        required
                      >
                        <SelectTrigger className="h-6 text-xs w-full">
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
                        <p className="mt-1 text-xs text-red-600">
                          {branchError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-isActive"
                      className="text-xs w-40 text-right"
                    >
                      Status:
                    </Label>
                    <div className="flex-1">
                      <Select
                        value={editIsActive.toString()}
                        onValueChange={(v) => setEditIsActive(v === "true")}
                        required
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
                            id="edit-comm_address"
                            name="comm_address"
                            className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none"
                            rows={2}
                            defaultValue={editingReference.comm_address || ""}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            State:
                          </Label>
                          <Input
                            id="edit-comm_state"
                            name="comm_state"
                            className="h-6 text-xs flex-1"
                            defaultValue={editingReference.comm_state || ""}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            District:
                          </Label>
                          <Input
                            id="edit-comm_district"
                            name="comm_district"
                            className="h-6 text-xs flex-1"
                            defaultValue={editingReference.comm_district || ""}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            City:
                          </Label>
                          <Input
                            id="edit-comm_city"
                            name="comm_city"
                            className="h-6 text-xs flex-1"
                            defaultValue={editingReference.comm_city || ""}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Pincode:
                          </Label>
                          <Input
                            id="edit-comm_pincode"
                            name="comm_pincode"
                            className="h-6 text-xs flex-1"
                            defaultValue={editingReference.comm_pincode || ""}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Post Office:
                          </Label>
                          <Input
                            id="edit-comm_postoffice"
                            name="comm_postoffice"
                            className="h-6 text-xs flex-1"
                            defaultValue={
                              editingReference.comm_postoffice || ""
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Police Station:
                          </Label>
                          <Input
                            id="edit-comm_policestation"
                            name="comm_policestation"
                            className="h-6 text-xs flex-1"
                            defaultValue={
                              editingReference.comm_policestation || ""
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Landmark:
                          </Label>
                          <Input
                            id="edit-comm_landmark"
                            name="comm_landmark"
                            className="h-6 text-xs flex-1"
                            defaultValue={editingReference.comm_landmark || ""}
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
                          <div className="flex items-start gap-2">
                            <Label className="text-xs w-24 text-right mt-1 flex-shrink-0">
                              Address:
                            </Label>
                            <textarea
                              id="edit-perm_address"
                              name="perm_address"
                              className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none"
                              rows={2}
                              defaultValue={editingReference.perm_address || ""}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              State:
                            </Label>
                            <Input
                              id="edit-perm_state"
                              name="perm_state"
                              className="h-6 text-xs flex-1"
                              defaultValue={editingReference.perm_state || ""}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              District:
                            </Label>
                            <Input
                              id="edit-perm_district"
                              name="perm_district"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingReference.perm_district || ""
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              City:
                            </Label>
                            <Input
                              id="edit-perm_city"
                              name="perm_city"
                              className="h-6 text-xs flex-1"
                              defaultValue={editingReference.perm_city || ""}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Pincode:
                            </Label>
                            <Input
                              id="edit-perm_pincode"
                              name="perm_pincode"
                              className="h-6 text-xs flex-1"
                              defaultValue={editingReference.perm_pincode || ""}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Post Office:
                            </Label>
                            <Input
                              id="edit-perm_postoffice"
                              name="perm_postoffice"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingReference.perm_postoffice || ""
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Police Station:
                            </Label>
                            <Input
                              id="edit-perm_policestation"
                              name="perm_policestation"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingReference.perm_policestation || ""
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Landmark:
                            </Label>
                            <Input
                              id="edit-perm_landmark"
                              name="perm_landmark"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingReference.perm_landmark || ""
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
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Reference</Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reference Details</DialogTitle>
          </DialogHeader>
          {viewReference && (
            <div className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="space-y-3">
                <div className="space-y-1 mr-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Label className="text-xs w-40 text-right">
                      Master ID:
                    </Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.masterId || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Alter ID:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.alterId || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Company ID:
                    </Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.companyId || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Reference Code:
                    </Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.empCode}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Name:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.name}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Accounting Group:
                    </Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.accountingGroup || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Phone:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.phone}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Email:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.email}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Branch:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={getBranchName(viewReference.branchId)}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">Status:</Label>
                    <Input
                      className="h-6 text-xs flex-1"
                      value={viewReference.isActive ? "Active" : "Inactive"}
                      readOnly
                    />
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
                            className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none bg-gray-50"
                            rows={2}
                            value={viewReference.comm_address || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            State:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_state || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            District:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_district || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            City:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_city || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Pincode:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_pincode || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Post Office:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_postoffice || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Police Station:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_policestation || ""}
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-24 text-right flex-shrink-0">
                            Landmark:
                          </Label>
                          <Input
                            className="h-6 text-xs flex-1"
                            value={viewReference.comm_landmark || ""}
                            readOnly
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
                          <div className="flex items-start gap-2">
                            <Label className="text-xs w-24 text-right mt-1 flex-shrink-0">
                              Address:
                            </Label>
                            <textarea
                              className="h-12 text-xs flex-1 border rounded px-2 py-1 resize-none bg-gray-50"
                              rows={2}
                              value={viewReference.perm_address || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              State:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_state || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              District:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_district || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              City:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_city || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Pincode:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_pincode || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Post Office:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_postoffice || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Police Station:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_policestation || ""}
                              readOnly
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-24 text-right flex-shrink-0">
                              Landmark:
                            </Label>
                            <Input
                              className="h-6 text-xs flex-1"
                              value={viewReference.perm_landmark || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
