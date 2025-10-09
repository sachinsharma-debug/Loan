import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, ArrowRightLeft, Search } from "lucide-react";
import { TransactionType } from "@/types";
import { useRef, useState } from "react";

interface TransactionTypeManagerProps {
  transactionTypes: TransactionType[];
  onAddTransactionType: (data: Omit<TransactionType, "id">) => void;
  onUpdateTransactionType: (id: string, data: Partial<TransactionType>) => void;
}

const TransactionTypeManager = ({
  transactionTypes,
  onAddTransactionType,
  onUpdateTransactionType,
}: TransactionTypeManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransactionType | null>(null);
  const [listSearchTerm, setListSearchTerm] = useState("");
  const [selectedVoucherType, setSelectedVoucherType] = useState("Attendance");
  const [abbreviation, setAbbreviation] = useState("ATTE");
  const [voucherNumbering, setVoucherNumbering] = useState("Automatic");
  const [isNumberingDetailsDialogOpen, setIsNumberingDetailsDialogOpen] =
    useState(false);
  const [voucherTypeSearch, setVoucherTypeSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getAbbreviation = (type: string) =>
    type
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 4)
      .toUpperCase();

  const voucherTypeOptions = [
    "Attendance",
    "Contra",
    "Credit Note",
    "Debit Note",
    "Delivery Note",
    "Job Work In Order",
    "Job Work Out Order",
    "Journal",
    "Material In",
    "Material Out",
    "Memorandum",
    "Payment",
    "Payroll",
    "Physical Stock",
    "Purchase",
    "Purchase Order",
    "Receipt",
    "Receipt Note",
    "Rejections In",
    "Rejections Out",
    "Reversing Journal",
    "Sales",
    "Sales Order",
    "Stock Journal",
    "Loan Request",
  ];

  const filteredVoucherTypes =
    voucherTypeSearch.length === 1
      ? voucherTypeOptions.filter((type) =>
          type.toLowerCase().startsWith(voucherTypeSearch.toLowerCase())
        )
      : voucherTypeOptions;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onAddTransactionType({
      typeCode: formData.get("typeCode") as string,
      typeName: formData.get("typeName") as string,
      category: formData.get("category") as
        | "loan"
        | "payment"
        | "charges"
        | "other",
      description: formData.get("description") as string,
      isActive: true,
    });

    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingType) return;

    const formData = new FormData(e.currentTarget);

    onUpdateTransactionType(editingType.id, {
      typeCode: formData.get("typeCode") as string,
      typeName: formData.get("typeName") as string,
      category: formData.get("category") as
        | "loan"
        | "payment"
        | "charges"
        | "other",
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "true",
    });

    setIsEditDialogOpen(false);
    setEditingType(null);
  };

  const handleVoucherTypeChange = (type: string) => {
    setSelectedVoucherType(type);
    setAbbreviation(getAbbreviation(type));
  };

  const handleAdditionalNumberingDetailsChange = (value: string) => {
    if (value === "yes") {
      setIsNumberingDetailsDialogOpen(true);
    }
  };

  // Restart Numbering table-like rows state and handlers
  type RestartRow = {
    applicableFrom: string;
    startingNumber: string;
    periodicity: "daily" | "weekly" | "monthly" | "yearly" | "never";
  };
  const [restartRows, setRestartRows] = useState<RestartRow[]>([]);
  const [restartDraft, setRestartDraft] = useState<RestartRow>({
    applicableFrom: "",
    startingNumber: "1",
    periodicity: "monthly",
  });
  const addRestartRow = () => {
    if (
      !restartDraft.applicableFrom ||
      !restartDraft.startingNumber ||
      !restartDraft.periodicity
    )
      return;
    setRestartRows((prev) => [...prev, restartDraft]);
    setRestartDraft({
      applicableFrom: "",
      startingNumber: "1",
      periodicity: "monthly",
    });
  };
  const removeRestartRow = (index: number) => {
    setRestartRows((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRestartKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRestartRow();
    }
  };

  // Prefix/Suffix table-like rows state and handlers
  type AffixRow = {
    applicableFrom: string;
    particulars: string;
  };
  // Prefix
  const [prefixRows, setPrefixRows] = useState<AffixRow[]>([]);
  const [prefixDraft, setPrefixDraft] = useState<AffixRow>({
    applicableFrom: "",
    particulars: "",
  });
  const addPrefixRow = () => {
    if (!prefixDraft.applicableFrom || !prefixDraft.particulars.trim()) return;
    setPrefixRows((prev) => [...prev, prefixDraft]);
    setPrefixDraft({ applicableFrom: "", particulars: "" });
  };
  const removePrefixRow = (index: number) => {
    setPrefixRows((prev) => prev.filter((_, i) => i !== index));
  };
  const handlePrefixKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPrefixRow();
    }
  };
  // Suffix
  const [suffixRows, setSuffixRows] = useState<AffixRow[]>([]);
  const [suffixDraft, setSuffixDraft] = useState<AffixRow>({
    applicableFrom: "",
    particulars: "",
  });
  const addSuffixRow = () => {
    if (!suffixDraft.applicableFrom || !suffixDraft.particulars.trim()) return;
    setSuffixRows((prev) => [...prev, suffixDraft]);
    setSuffixDraft({ applicableFrom: "", particulars: "" });
  };
  const removeSuffixRow = (index: number) => {
    setSuffixRows((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSuffixKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSuffixRow();
    }
  };

  const openEditDialog = (type: TransactionType) => {
    setEditingType(type);
    setIsEditDialogOpen(true);
  };

  const filteredTransactionTypes = listSearchTerm.trim()
    ? transactionTypes.filter((t) => {
        const q = listSearchTerm.toLowerCase();
        return (
          (t.typeCode ?? "").toLowerCase().includes(q) ||
          (t.typeName ?? "").toLowerCase().includes(q) ||
          (t.category ?? "").toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q) ||
          (t.isActive ? "active" : "inactive").includes(q)
        );
      })
    : transactionTypes;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <ArrowRightLeft className="h-8 w-8" />
            <span>Transaction Type</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage transaction types</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center w-72 h-9 rounded-md border border-input bg-background px-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transaction types..."
              value={listSearchTerm}
              onChange={(e) => setListSearchTerm(e.target.value)}
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction Type
              </Button>
            </DialogTrigger>
            <DialogContent className="py-6 px-6 max-w-7xl h-[97vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-xxl font-semibold">
                  Add New Voucher Type
                </DialogTitle>
              </DialogHeader>

              <form
                id="addVoucherForm"
                onSubmit={handleSubmit}
                className="space-y-4 py-2 overflow-y-auto flex-1"
                style={{ minHeight: 0 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="name" className="text-xs w-48 text-right">
                      Name:
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue="Aaa"
                      className="h-6 text-xs w-48"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 pt-3 border-t">
                  {/* Basic Info Section */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">
                      Basic Info
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="voucherTypeSearch"
                          className="text-xs w-48 text-right"
                        >
                          Select Voucher Type:
                        </Label>
                        <div className="relative flex-1">
                          <Input
                            id="voucherTypeSearch"
                            name="voucherTypeSearch"
                            placeholder="Type to search or click ▼"
                            value={voucherTypeSearch}
                            onChange={(e) => {
                              setVoucherTypeSearch(e.target.value);
                              setShowDropdown(true);
                            }}
                            className="h-6 text-xs pr-8"
                            autoComplete="off"
                            ref={inputRef}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() =>
                              setTimeout(() => setShowDropdown(false), 150)
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                            tabIndex={-1}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setShowDropdown((prev) => !prev);
                              inputRef.current?.focus();
                            }}
                          >
                            ▼
                          </button>
                          {showDropdown && (
                            <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1 w-full max-h-40 overflow-y-auto">
                              {voucherTypeOptions.filter((type) =>
                                type
                                  .toLowerCase()
                                  .includes(voucherTypeSearch.toLowerCase())
                              ).length > 0 ? (
                                voucherTypeOptions
                                  .filter((type) =>
                                    type
                                      .toLowerCase()
                                      .includes(voucherTypeSearch.toLowerCase())
                                  )
                                  .map((type) => (
                                    <div
                                      key={type}
                                      className={`cursor-pointer px-2 py-1 hover:bg-gray-100 ${
                                        selectedVoucherType === type
                                          ? "bg-gray-200 font-semibold"
                                          : ""
                                      }`}
                                      onMouseDown={() => {
                                        setSelectedVoucherType(type);
                                        setAbbreviation(getAbbreviation(type));
                                        setVoucherTypeSearch("");
                                        setShowDropdown(false);
                                      }}
                                    >
                                      {type}
                                    </div>
                                  ))
                              ) : (
                                <div className="text-gray-500 px-2 py-1">
                                  No matches
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedVoucherType && (
                        <div className="ml-[12.5rem] -mt-1 text-xs text-gray-700">
                          Selected:{" "}
                          <span className="font-semibold">
                            {selectedVoucherType}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="abbreviation"
                          className="text-xs w-48 text-right"
                        >
                          Abbreviation:
                        </Label>
                        <Input
                          id="abbreviation"
                          name="abbreviation"
                          value={abbreviation}
                          onChange={(e) => setAbbreviation(e.target.value)}
                          className="h-6 text-xs flex-1 bg-gray-100"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="activatevouchertype"
                          className="text-xs w-48 text-right"
                        >
                          Activate this Voucher Type:
                        </Label>
                        <div className="flex-1">
                          <Select name="activatevouchertype" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="No" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="voucherNumbering"
                          className="text-xs w-48 text-right"
                        >
                          Method of Voucher Numbering:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="voucherNumbering"
                            value={voucherNumbering}
                            onValueChange={setVoucherNumbering}
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Automatic">
                                Automatic
                              </SelectItem>
                              <SelectItem value="Automatic (Manual Override)">
                                Automatic (Manual Override)
                              </SelectItem>
                              <SelectItem value="Manual">Manual</SelectItem>
                              <SelectItem value="Multi-user Auto">
                                Multi-user Auto
                              </SelectItem>
                              <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="numberingBehavior"
                          className="text-xs w-48 text-right"
                        >
                          Numbering behaviour on insertion/deletion:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="numberingBehavior"
                            defaultValue="Retain Original Voucher No."
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Retain Original Voucher No.">
                                Retain Original Voucher No.
                              </SelectItem>
                              <SelectItem value="Renumber Vouchers">
                                Renumber Vouchers
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="additionalNumberingDetails"
                          className="text-xs w-48 text-right"
                        >
                          Set/Alter additional numbering details:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="additionalNumberingDetails"
                            defaultValue="no"
                            onValueChange={
                              handleAdditionalNumberingDetailsChange
                            }
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Dialog
                          open={isNumberingDetailsDialogOpen}
                          onOpenChange={setIsNumberingDetailsDialogOpen}
                        >
                          <DialogContent className="py-6 px-6 max-w-7xl h-[100vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle>
                                Additional Numbering Details
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              id="numberingDetailsForm"
                              onSubmit={handleSubmit}
                              className="space-y-4 py-4 overflow-y-auto flex-1"
                              style={{ minHeight: 0 }}
                            >
                              <div className="d-flex justify-content-center">
                                <div className="space-y-2 ">
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="startingNumber"
                                      className="text-xs w-56 text-right"
                                    >
                                      Starting Number:
                                    </Label>
                                    <Input
                                      id="startingNumber"
                                      name="startingNumber"
                                      type="number"
                                      min="1"
                                      step="1"
                                      defaultValue="1"
                                      className="h-6 text-xs w-48"
                                      required
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="widthOfNumericalPart"
                                      className="text-xs w-56 text-right"
                                    >
                                      Width of Numerical Part:
                                    </Label>
                                    <Input
                                      id="widthOfNumericalPart"
                                      name="widthOfNumericalPart"
                                      type="number"
                                      min="1"
                                      step="1"
                                      defaultValue="4"
                                      className="h-6 text-xs w-48"
                                      required
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="prefillWithZero"
                                      className="text-xs w-56 text-right"
                                    >
                                      Prefill with Zero:
                                    </Label>
                                    <div className="flex-1">
                                      <Select
                                        name="prefillWithZero"
                                        defaultValue="yes"
                                        required
                                      >
                                        <SelectTrigger className="h-6 text-xs w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="yes">
                                            Yes
                                          </SelectItem>
                                          <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Restart Numbering
                                  </h3>
                                  {/* Header row */}
                                  <div className="grid grid-cols-4 text-xs font-semibold text-gray-700 md:divide-x md:divide-gray-200">
                                    <div className="px-2">Applicable From</div>
                                    <div className="px-2">Starting Number</div>
                                    <div className="px-2">Periodicity</div>
                                    <div className="px-2 text-right">
                                      Action
                                    </div>
                                  </div>
                                  {/* Existing read-only rows */}
                                  {restartRows.map((row, idx) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-4 text-xs md:divide-x md:divide-gray-200"
                                    >
                                      <div className="px-2">
                                        {row.applicableFrom}
                                      </div>
                                      <div className="px-2">
                                        {row.startingNumber}
                                      </div>
                                      <div className="px-2 capitalize">
                                        {row.periodicity}
                                      </div>
                                      <div className="px-2 flex items-center justify-end">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => removeRestartRow(idx)}
                                          className="h-6 text-[11px] px-2 border border-black text-black bg-white hover:bg-black hover:text-white"
                                          aria-label={`Delete row ${idx + 1}`}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {/* Draft editable row */}
                                  <div
                                    className="grid grid-cols-4 items-center md:divide-x md:divide-gray-200"
                                    onKeyDown={handleRestartKeyDown}
                                  >
                                    <div className="px-2">
                                      <Input
                                        id="applicableFrom"
                                        name="applicableFrom"
                                        type="date"
                                        value={restartDraft.applicableFrom}
                                        onChange={(e) =>
                                          setRestartDraft((d) => ({
                                            ...d,
                                            applicableFrom: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    <div className="px-2">
                                      <Input
                                        id="startingNumberRestart"
                                        name="startingNumber"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={restartDraft.startingNumber}
                                        onChange={(e) =>
                                          setRestartDraft((d) => ({
                                            ...d,
                                            startingNumber: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    <div className="px-2">
                                      <Select
                                        name="periodicity"
                                        value={restartDraft.periodicity}
                                        onValueChange={(v) =>
                                          setRestartDraft((d) => ({
                                            ...d,
                                            periodicity:
                                              v as RestartRow["periodicity"],
                                          }))
                                        }
                                      >
                                        <SelectTrigger className="h-6 text-xs w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="daily">
                                            Daily
                                          </SelectItem>
                                          <SelectItem value="weekly">
                                            Weekly
                                          </SelectItem>
                                          <SelectItem value="monthly">
                                            Monthly
                                          </SelectItem>
                                          <SelectItem value="yearly">
                                            Yearly
                                          </SelectItem>
                                          <SelectItem value="never">
                                            Never
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {/* Empty cell to align with Actions column */}
                                    <div className="px-2"></div>
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Press Enter to add row. Added rows become
                                    read-only and can be deleted only.
                                  </div>
                                </div>

                                <div className="space-y-2 md:border-l md:border-gray-200 md:pl-6">
                                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Prefix Details
                                  </h3>
                                  {/* Header */}
                                  <div className="grid grid-cols-3 text-xs font-semibold text-gray-700 md:divide-x md:divide-gray-200">
                                    <div className="px-2">Applicable From</div>
                                    <div className="px-2">Particulars</div>
                                    <div className="px-2 text-right">
                                      Action
                                    </div>
                                  </div>
                                  {/* Read-only rows */}
                                  {prefixRows.map((row, idx) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-3 text-xs md:divide-x md:divide-gray-200"
                                    >
                                      <div className="px-2">
                                        {row.applicableFrom}
                                      </div>
                                      <div className="px-2">
                                        {row.particulars}
                                      </div>
                                      <div className="px-2 flex items-center justify-end">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => removePrefixRow(idx)}
                                          className="h-6 text-[11px] px-2 border border-black text-black bg-white hover:bg-black hover:text-white"
                                          aria-label={`Delete prefix row ${
                                            idx + 1
                                          }`}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {/* Draft row */}
                                  <div
                                    className="grid grid-cols-3 items-center md:divide-x md:divide-gray-200"
                                    onKeyDown={handlePrefixKeyDown}
                                  >
                                    <div className="px-2">
                                      <Input
                                        id="prefixApplicableFrom"
                                        name="prefixApplicableFrom"
                                        type="date"
                                        value={prefixDraft.applicableFrom}
                                        onChange={(e) =>
                                          setPrefixDraft((d) => ({
                                            ...d,
                                            applicableFrom: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    <div className="px-2">
                                      <Input
                                        id="prefixParticulars"
                                        name="prefixParticulars"
                                        placeholder="e.g. INV"
                                        maxLength={5}
                                        value={prefixDraft.particulars}
                                        onChange={(e) =>
                                          setPrefixDraft((d) => ({
                                            ...d,
                                            particulars: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    {/* Empty cell to align with Actions column */}
                                    <div className="px-2"></div>
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Press Enter to add row. Added rows become
                                    read-only.
                                  </div>
                                </div>

                                <div className="space-y-2 md:border-l md:border-gray-200 md:pl-6">
                                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Suffix Details
                                  </h3>
                                  {/* Header */}
                                  <div className="grid grid-cols-3 text-xs font-semibold text-gray-700 md:divide-x md:divide-gray-200">
                                    <div className="px-2">Applicable From</div>
                                    <div className="px-2">Particulars</div>
                                    <div className="px-2 text-right">
                                      Action
                                    </div>
                                  </div>
                                  {/* Read-only rows */}
                                  {suffixRows.map((row, idx) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-3 text-xs md:divide-x md:divide-gray-200"
                                    >
                                      <div className="px-2">
                                        {row.applicableFrom}
                                      </div>
                                      <div className="px-2">
                                        {row.particulars}
                                      </div>
                                      <div className="px-2 flex items-center justify-end">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => removeSuffixRow(idx)}
                                          className="h-6 text-[11px] px-2 border border-black text-black bg-white hover:bg-black hover:text-white"
                                          aria-label={`Delete suffix row ${
                                            idx + 1
                                          }`}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {/* Draft row */}
                                  <div
                                    className="grid grid-cols-3 items-center md:divide-x md:divide-gray-200"
                                    onKeyDown={handleSuffixKeyDown}
                                  >
                                    <div className="px-2">
                                      <Input
                                        id="suffixApplicableFrom"
                                        name="suffixApplicableFrom"
                                        type="date"
                                        value={suffixDraft.applicableFrom}
                                        onChange={(e) =>
                                          setSuffixDraft((d) => ({
                                            ...d,
                                            applicableFrom: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    <div className="px-2">
                                      <Input
                                        id="suffixParticulars"
                                        name="suffixParticulars"
                                        placeholder="e.g. INV"
                                        maxLength={5}
                                        value={suffixDraft.particulars}
                                        onChange={(e) =>
                                          setSuffixDraft((d) => ({
                                            ...d,
                                            particulars: e.target.value,
                                          }))
                                        }
                                        className="h-6 text-xs w-full"
                                      />
                                    </div>
                                    {/* Empty cell to align with Actions column */}
                                    <div className="px-2"></div>
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Press Enter to add row. Added rows become
                                    read-only.
                                  </div>
                                </div>
                              </div>
                            </form>
                            <div className="mt-2 pt-3 border-t flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  setIsNumberingDetailsDialogOpen(false)
                                }
                              >
                                Cancel
                              </Button>
                              <Button type="submit" form="numberingDetailsForm">
                                Save Numbering Settings
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="showunusedVoucherNos"
                          className="text-xs w-48 text-right"
                        >
                          Show unused voucher nos. in transactions for Retail
                          Voucher no. behaviour:
                        </Label>
                        <div className="flex-1">
                          <Select name="showunusedVoucherNos" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical divider - only visible on larger screens */}
                  <div className="hidden md:block border-l border-gray-200 h-auto"></div>

                  {/* Advance Features Section */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">
                      Advance Features
                    </h2>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="printing"
                          className="text-xs w-56 text-right"
                        >
                          Print Voucher after Saving:
                        </Label>
                        <div className="flex-1">
                          <Select name="printing" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="effectiveDates"
                          className="text-xs w-56 text-right"
                        >
                          Use effective dates for vouchers:
                        </Label>
                        <div className="flex-1">
                          <Select name="effectiveDates" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="zeroValuedTransactions"
                          className="text-xs w-56 text-right"
                        >
                          Allow zero-valued transactions:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="zeroValuedTransactions"
                            defaultValue="no"
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="optionalVoucher"
                          className="text-xs w-56 text-right"
                        >
                          Make this voucher type as 'Optional' by default:
                        </Label>
                        <div className="flex-1">
                          <Select name="optionalVoucher" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="allowNarration"
                          className="text-xs w-56 text-right"
                        >
                          Allow narration in voucher:
                        </Label>
                        <div className="flex-1">
                          <Select name="allowNarration" defaultValue="yes">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="narrationPerLedger"
                          className="text-xs w-56 text-right"
                        >
                          Provide narrations for each ledger in voucher:
                        </Label>
                        <div className="flex-1">
                          <Select name="narrationPerLedger" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="whatsappVoucher"
                          className="text-xs w-56 text-right"
                        >
                          WhatsApp voucher after saving:
                        </Label>
                        <div className="flex-1">
                          <Select name="whatsappVoucher" defaultValue="no">
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-2 pt-3 border-t flex justify-end">
                <Button type="submit" form="addVoucherForm">
                  Save Voucher Type
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction Type</DialogTitle>
          </DialogHeader>
          {editingType && (
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-typeCode"
                  className="text-xs w-48 text-right"
                >
                  Type Code:
                </Label>
                <Input
                  id="edit-typeCode"
                  name="typeCode"
                  defaultValue={editingType.typeCode}
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-typeName"
                  className="text-xs w-48 text-right"
                >
                  Type Name:
                </Label>
                <Input
                  id="edit-typeName"
                  name="typeName"
                  defaultValue={editingType.typeName}
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-category"
                  className="text-xs w-48 text-right"
                >
                  Category:
                </Label>
                <div className="flex-1">
                  <Select
                    name="category"
                    defaultValue={editingType.category}
                    required
                  >
                    <SelectTrigger className="h-6 text-xs w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="charges">Charges</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Label
                  htmlFor="edit-description"
                  className="text-xs w-48 text-right pt-1"
                >
                  Description:
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingType.description}
                  className="text-xs flex-1 min-h-[80px]"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-isActive"
                  className="text-xs w-48 text-right"
                >
                  Status:
                </Label>
                <div className="flex-1">
                  <Select
                    name="isActive"
                    defaultValue={editingType.isActive.toString()}
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
                  Update Transaction Type
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Types</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Code</TableHead>
                <TableHead>Type Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactionTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.typeCode}</TableCell>
                  <TableCell>{type.typeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {type.category.charAt(0).toUpperCase() +
                        type.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Badge variant={type.isActive ? "default" : "secondary"}>
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default TransactionTypeManager;
