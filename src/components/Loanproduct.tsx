import React, { useState, useEffect, useMemo } from "react";
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
import {
  Plus,
  Edit,
  ArrowRightLeft,
  PackageOpen,
  Search,
  Trash2,
} from "lucide-react";
import {
  getLoanProducts,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
} from "@/api/loanProductService";
import type { LoanProduct } from "@/types";
import { toast } from "react-toastify";

// Utility to get unique typeOfLoan and subType options from loanproducts
export function getLoanTypeOptions(loanproducts: LoanProduct[]) {
  // Return unique typeOfLoan values; ignore empty
  const types = loanproducts
    .map((lp) => (lp.typeOfLoan || "").trim())
    .filter(Boolean);
  return Array.from(new Set(types));
}

export function getLoanSubTypeOptions(
  loanproducts: LoanProduct[],
  typeOfLoan: string
) {
  // Return unique subType values for the given typeOfLoan
  return loanproducts
    .filter((lp) => (lp.typeOfLoan || "").trim() === typeOfLoan)
    .map((lp) => (lp.subType || "").trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

const LoanProductComponent: React.FC = () => {
  // Data + UI state
  const [loanproducts, setLoanproducts] = useState<LoanProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Unified Add/Edit dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<LoanProduct | null>(null);

  // Type-of-loan and subtype
  const [selectedLoanType, setSelectedLoanType] = useState<
    "not-applicable" | "vehicle" | "other"
  >("not-applicable");

  // Interest history
  const [annualRateApplicable, setAnnualRateApplicable] = useState<
    "yes" | "no" | ""
  >("");
  const [interestHistory, setInterestHistory] = useState<
    { date: string; rate: string }[]
  >([{ date: "", rate: "" }]);
  const [isInterestHistoryDialogOpen, setIsInterestHistoryDialogOpen] =
    useState(false);
  const currentInterestRate = useMemo(() => {
    const lastNonEmpty = [...interestHistory]
      .reverse()
      .find((h) => (h.rate || "").toString().trim().length > 0)?.rate;
    return (lastNonEmpty || "").toString();
  }, [interestHistory]);

  // Eligibility setup
  const [eligibilitySetup, setEligibilitySetup] = useState<"yes" | "no" | "">(
    ""
  );
  const [isEligibilityDialogOpen, setIsEligibilityDialogOpen] = useState(false);
  const [incomeSourceWeight, setIncomeSourceWeight] = useState<number>(0);
  const [cibilScoreWeight, setCibilScoreWeight] = useState<number>(0);
  const [ageFrom, setAgeFrom] = useState<number>(0);
  const [ageTo, setAgeTo] = useState<number>(0);

  // Name validation
  const [nameValidation, setNameValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: "" });

  // Applicable Charges
  const [isChargesChecked, setIsChargesChecked] = useState<boolean>(false);
  const [isChargesDialogOpen, setIsChargesDialogOpen] =
    useState<boolean>(false);
  const [chargesData, setChargesData] = useState<
    {
      ledgerName: string;
      group: string;
      appliedOn: string;
      applicableAs: string;
      charges: string;
    }[]
  >([
    { ledgerName: "", group: "", appliedOn: "", applicableAs: "", charges: "" },
  ]);

  // Helpers
  const getEntityId = (obj: any): string | number | undefined =>
    obj?.id ?? obj?._id ?? obj?.Id ?? obj?.ID ?? obj?.Code ?? obj?.code;

  const resetEligibilityWeights = () => {
    setIncomeSourceWeight(0);
    setCibilScoreWeight(0);
    setAgeFrom(0);
    setAgeTo(0);
  };

  const handleSaveEligibilityWeights = () => {
    // Optional: enforce total weight constraints; for now just close dialog
    setIsEligibilityDialogOpen(false);
  };

  const resetFormStates = () => {
    setSelectedLoanType("not-applicable");
    setAnnualRateApplicable("");
    setInterestHistory([{ date: "", rate: "" }]);
    setEligibilitySetup("");
    resetEligibilityWeights();
    setNameValidation({ isValid: true, message: "" });
    setIsChargesChecked(false);
    setChargesData([
      {
        ledgerName: "",
        group: "",
        appliedOn: "",
        applicableAs: "",
        charges: "",
      },
    ]);
  };

  const handleAddChargesRow = () => {
    setChargesData([
      ...chargesData,
      {
        ledgerName: "",
        group: "",
        appliedOn: "",
        applicableAs: "",
        charges: "",
      },
    ]);
  };

  const handleChargesFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newData = [...chargesData];
    newData[index] = { ...newData[index], [field]: value };
    setChargesData(newData);
  };

  const handleChargesKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    currentField: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const fields = [
        "ledgerName",
        "group",
        "appliedOn",
        "applicableAs",
        "charges",
      ];
      const currentFieldIndex = fields.indexOf(currentField);

      if (currentFieldIndex < fields.length - 1) {
        // Move to next field in same row
        const nextField = fields[currentFieldIndex + 1];
        const nextInput = document.getElementById(
          `charges-${rowIndex}-${nextField}`
        );
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        // Last field in row, add new row and focus first field of new row
        handleAddChargesRow();
        setTimeout(() => {
          const newRowInput = document.getElementById(
            `charges-${rowIndex + 1}-ledgerName`
          );
          if (newRowInput) {
            newRowInput.focus();
          }
        }, 0);
      }
    }
  };

  const handleChargesCheckboxClick = () => {
    const newChecked = !isChargesChecked;
    setIsChargesChecked(newChecked);
    if (newChecked) {
      setIsChargesDialogOpen(true);
    }
  };

  const validateName = (name: string, excludeId?: string | number): boolean => {
    const trimmed = (name || "").trim();
    if (!trimmed) {
      setNameValidation({ isValid: false, message: "Name is required" });
      return false;
    }
    const exists = loanproducts.some(
      (p) =>
        (p.Name || "").trim().toLowerCase() === trimmed.toLowerCase() &&
        (excludeId ? getEntityId(p) !== excludeId : true)
    );
    if (exists) {
      setNameValidation({
        isValid: false,
        message: "A loan product with this name already exists",
      });
      return false;
    }
    setNameValidation({ isValid: true, message: "" });
    return true;
  };

  // Display helpers for the table
  const deriveLoanType = (p: LoanProduct): string => {
    if (p.typeOfLoan) {
      const key = p.typeOfLoan;
      if (key === "vehicle") return "Vehicle";
      if (key === "other") return "Other";
      return "Not Applicable";
    }
    // No legacy fallback; default when missing
    return "Not Applicable";
  };

  const prettySubType = (t?: string): string => {
    const key = (t || "").toLowerCase();
    switch (key) {
      case "new-car-loan":
        return "New Car Loan";
      case "used-car-loan":
        return "Used Car Loan";
      case "commercial-vehicle":
        return "Commercial Vehicle";
      case "two-wheeler-loan":
        return "Two-wheeler Loan";
      case "tractor-loan":
        return "Tractor Loan";
      case "loan-against-car":
        return "Loan Against Car";
      case "refinance-vehicle-loan":
        return "Refinance on Vehicle Loan";
      case "other":
        return "Other";
      case "not-applicable":
      case "":
        return "-";
      default:
        // fallback: capitalize words
        return key
          .split("-")
          .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
          .join(" ");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextIdOrSelectDataId?: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!nextIdOrSelectDataId) return;
      // Try element by id
      const el = document.getElementById(nextIdOrSelectDataId);
      if (el) {
        (el as HTMLElement).focus();
        return;
      }
      // Try shadcn select trigger by data-field-id
      const selectTrigger = document.querySelector(
        `[data-field-id="${nextIdOrSelectDataId}"]`
      ) as HTMLElement | null;
      if (selectTrigger) {
        selectTrigger.click();
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    (async () => {
      try {
        const products = await getLoanProducts();
        const list = Array.isArray(products)
          ? products
          : (products as any)?.data ?? [];
        const normalized = list.map((p: any) => ({ ...p, id: getEntityId(p) }));
        setLoanproducts(normalized);
      } catch (err) {
        console.error("Failed to fetch loan products", err);
        toast.error("Failed to load loan products");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const name =
        (formData.get("companyName") as string) ||
        (formData.get("Name") as string) ||
        "";
      if (!validateName(name)) return;

      // Only use fields present in the dialog form
      const rawSubtype = ((formData.get("subtype") as string) || "").trim();
      // Persist type of loan and sub type separately
      const typeOfLoan = selectedLoanType;
      const subType = rawSubtype;
      const description = (formData.get("description") as string) || "";
      const annualRateOfInterestApplicable =
        (formData.get("annualrateofinterest_applicable") as string) || "no";
      const currentAnnualRateOfInterest = currentInterestRate || "";
      const validateTermsInApproval =
        (formData.get("isloanapproved") as string) || "no";
      const totalWeightage =
        (formData.get("loaneligibilitysetup") as string) || "no";
      const funding = (formData.get("funding") as string) || "";
      const minAmount =
        parseFloat((formData.get("minamount") as string) || "0") || undefined;
      const maxAmount =
        parseFloat((formData.get("maxamount") as string) || "0") || undefined;
      const minDuration =
        parseInt((formData.get("minduration") as string) || "0") || undefined;
      const maxDuration =
        parseInt((formData.get("maxduration") as string) || "0") || undefined;
      const processingFee =
        parseFloat((formData.get("processingfee") as string) || "0") ||
        undefined;
      const documentationFee =
        parseFloat((formData.get("documentationfee") as string) || "0") ||
        undefined;
      const partialDisbursement = ((formData.get(
        "enablepartialdisbursement"
      ) as string) || "no") as "yes" | "no";
      const accruedInterest = ((formData.get(
        "enableaccruedinterest"
      ) as string) || "yes") as "yes" | "no";
      const foreclosePenalty =
        (formData.get("foreclosepenalty") as string) || "";

      // Compose new product object with only dialog fields, plus required fields
      const newProduct = {
        Name: name,
        typeOfLoan,
        subType,
        description,
        annualRateOfInterestApplicable: annualRateOfInterestApplicable as
          | "yes"
          | "no",
        currentAnnualRateOfInterest,
        validateTermsInApproval: validateTermsInApproval as "yes" | "no",
        totalWeightage: totalWeightage as "yes" | "no",
        incomeSourceWeight,
        cibilScoreWeight,
        ageFrom,
        ageTo,
        funding,
        minAmount,
        maxAmount,
        minDuration,
        maxDuration,
        processingFee,
        documentationFee,
        partialDisbursement,
        accruedInterest,
        foreclosePenalty,
        interestHistory,
        applicableFrom: interestHistory
          .filter((h) => (h.date || "").trim())
          .map((h) => h.date),
        isActive: true,
      };

      const createdProduct = await createLoanProduct(newProduct);
      toast.success("Loan product added successfully");

      const createdEntity = (createdProduct as any)?.data || createdProduct;
      if (createdEntity && getEntityId(createdEntity)) {
        const normalized = {
          ...(createdEntity as any),
          id: getEntityId(createdEntity),
        } as LoanProduct as any;
        setLoanproducts((prev) => [...prev, normalized]);
      } else {
        try {
          const products = await getLoanProducts();
          const list = Array.isArray(products)
            ? products
            : (products as any)?.data ?? [];
          const normalized = list.map((p: any) => ({
            ...p,
            id: getEntityId(p),
          }));
          setLoanproducts(normalized);
        } catch (err) {
          console.error("Failed to refresh loan products after create:", err);
        }
      }

      setIsAddDialogOpen(false);
      setEditingType(null);
      resetFormStates();
    } catch (error) {
      console.error("Failed to add loan product:", error);
      toast.error("Failed to add loan product");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Editing type:", editingType);
    if (!editingType) return;

    try {
      const formData = new FormData(e.currentTarget);

      // Capture all form fields like in the Add form
      // Only use fields present in the dialog form, plus required fields
      const name =
        (formData.get("companyName") as string) ||
        (formData.get("Name") as string) ||
        editingType.Name;
      // Collect subtype separately
      const subType = (
        (formData.get("subtype") as string) ||
        editingType.subType ||
        ""
      )
        .toString()
        .trim();
      const description =
        (formData.get("description") as string) ||
        editingType.description ||
        "";
      const annualRateOfInterestApplicable =
        (formData.get("annualrateofinterest_applicable") as string) ||
        editingType.annualRateOfInterestApplicable ||
        "no";
      const currentAnnualRateOfInterest =
        currentInterestRate || editingType.currentAnnualRateOfInterest || "";
      const funding =
        (formData.get("funding") as string) || editingType.funding || "";
      const minAmount =
        parseFloat(
          (formData.get("minamount") as string) ||
            editingType.minAmount?.toString() ||
            "0"
        ) || undefined;
      const maxAmount =
        parseFloat(
          (formData.get("maxamount") as string) ||
            editingType.maxAmount?.toString() ||
            "0"
        ) || undefined;
      const minDuration =
        parseInt(
          (formData.get("minduration") as string) ||
            editingType.minDuration?.toString() ||
            "0"
        ) || undefined;
      const maxDuration =
        parseInt(
          (formData.get("maxduration") as string) ||
            editingType.maxDuration?.toString() ||
            "0"
        ) || undefined;
      const processingFee =
        parseFloat(
          (formData.get("processingfee") as string) ||
            editingType.processingFee?.toString() ||
            "0"
        ) || undefined;
      const documentationFee =
        parseFloat(
          (formData.get("documentationfee") as string) ||
            editingType.documentationFee?.toString() ||
            "0"
        ) || undefined;
      const partialDisbursement = ((formData.get(
        "enablepartialdisbursement"
      ) as string) ||
        editingType.partialDisbursement ||
        "no") as "yes" | "no";
      const accruedInterest = ((formData.get(
        "enableaccruedinterest"
      ) as string) ||
        editingType.accruedInterest ||
        "yes") as "yes" | "no";
      const foreclosePenalty =
        (formData.get("foreclosepenalty") as string) ||
        editingType.foreclosePenalty ||
        "";
      const validateTermsInApproval =
        (formData.get("isloanapproved") as string) ||
        editingType.validateTermsInApproval ||
        "no";
      const totalWeightage =
        (formData.get("loaneligibilitysetup") as string) ||
        editingType.totalWeightage ||
        "no";
      const isActiveRaw = formData.get("isActive");

      const updatedProduct = {
        Name: name,
        typeOfLoan: selectedLoanType,
        subType,
        description,
        annualRateOfInterestApplicable: annualRateOfInterestApplicable as
          | "yes"
          | "no",
        currentAnnualRateOfInterest,
        validateTermsInApproval: validateTermsInApproval as "yes" | "no",
        totalWeightage: totalWeightage as "yes" | "no",
        incomeSourceWeight,
        cibilScoreWeight,
        ageFrom,
        ageTo,
        funding,
        minAmount,
        maxAmount,
        minDuration,
        maxDuration,
        processingFee,
        documentationFee,
        partialDisbursement,
        accruedInterest,
        foreclosePenalty,
        interestHistory,
        applicableFrom: interestHistory
          .filter((h) => (h.date || "").trim())
          .map((h) => h.date),
        isActive: String(isActiveRaw) === "true",
      };

      // Call API to update the loan product using robust id
      await updateLoanProduct(String(getEntityId(editingType)), updatedProduct);

      // Update local state with the new data
      setLoanproducts((prev) =>
        prev.map((item) =>
          getEntityId(item) === getEntityId(editingType)
            ? { ...item, ...updatedProduct }
            : item
        )
      );

      // Call external handler if provided (non-blocking UI)
      toast.success("Loan product updated successfully");

      setIsAddDialogOpen(false);
      setEditingType(null);
    } catch (error) {
      console.error("Failed to update loan product:", error);
      toast.error("Failed to update loan product");
    }
  };

  const openEditDialog = (type: LoanProduct) => {
    console.log("Opening edit dialog for:", type);
    setEditingType(type);

    // Populate existing data for dialogs
    if (type.interestHistory && Array.isArray(type.interestHistory)) {
      setInterestHistory(type.interestHistory);
    } else if (type.currentAnnualRateOfInterest) {
      // If no history but has current rate, create a basic history entry
      setInterestHistory([
        { date: "", rate: type.currentAnnualRateOfInterest },
      ]);
    }

    // Populate eligibility weights from existing data
    if (type.incomeSourceWeight !== undefined) {
      setIncomeSourceWeight(type.incomeSourceWeight);
    }
    if (type.cibilScoreWeight !== undefined) {
      setCibilScoreWeight(type.cibilScoreWeight);
    }
    if (type.ageFrom !== undefined) {
      setAgeFrom(type.ageFrom);
    }
    if (type.ageTo !== undefined) {
      setAgeTo(type.ageTo);
    }
    // Prefill selects/flags for add dialog
    setAnnualRateApplicable((type.annualRateOfInterestApplicable as any) || "");
    setEligibilitySetup(((type.totalWeightage as any) || "") as any);
    // Use explicit typeOfLoan or default
    setSelectedLoanType(((type.typeOfLoan as any) || "not-applicable") as any);

    // Open the add dialog in edit mode
    setIsAddDialogOpen(true);
    console.log("Using Add dialog for editing");
  };

  const handleDelete = async (item: LoanProduct) => {
    const id = getEntityId(item);
    if (!id) {
      toast.error("Missing product ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this loan product?")) {
      return;
    }
    try {
      await deleteLoanProduct(String(id));
      setLoanproducts((prev) => prev.filter((p) => getEntityId(p) !== id));
      toast.success("Loan product deleted");
    } catch (err) {
      console.error("Failed to delete loan product", err);
      toast.error("Failed to delete loan product");
    }
  };

  const filteredLoanProducts = searchTerm.trim()
    ? loanproducts.filter((lp) => {
        const q = searchTerm.toLowerCase();
        return (
          (lp.Name ?? "").toLowerCase().includes(q) ||
          (lp.typeOfLoan ?? "").toLowerCase().includes(q) ||
          (lp.subType ?? "").toLowerCase().includes(q) ||
          (lp.description ?? "").toLowerCase().includes(q) ||
          (lp.currentAnnualRateOfInterest ?? "").toLowerCase().includes(q) ||
          (lp.funding ?? "").toLowerCase().includes(q) ||
          (lp.isActive ? "active" : "inactive").includes(q)
        );
      })
    : loanproducts;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div>Loading loan products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <PackageOpen className="h-8 w-8" />
            <span>Loan Product</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage loan products</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center w-72 h-9 rounded-md border border-input bg-background px-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search loan products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
            />
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingType(null);
                resetFormStates();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Loan Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Edit Loan Product" : "Add Loan Product"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) =>
                  editingType ? handleEditSubmit(e) : handleSubmit(e)
                }
                className="space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="companyId"
                      className="text-xs w-40 text-right"
                    >
                      Company ID:
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="companyId"
                        name="companyId"
                        className="h-6 text-xs flex-1"
                        onKeyDown={(e) => handleKeyDown(e, "masterId")}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="masterId"
                      className="text-xs w-40 text-right"
                    >
                      Master ID:
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="masterId"
                        name="masterId"
                        className="h-6 text-xs flex-1"
                        onKeyDown={(e) => handleKeyDown(e, "alterId")}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="alterId"
                      className="text-xs w-40 text-right"
                    >
                      Alter ID:
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="alterId"
                        name="alterId"
                        className="h-6 text-xs flex-1"
                        onKeyDown={(e) => handleKeyDown(e, "Name")}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="Name" className="text-xs w-40 text-right">
                      Name:
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="Name"
                        name="companyName"
                        className={`h-6 text-xs flex-1 ${
                          !nameValidation.isValid ? "border-red-500" : ""
                        }`}
                        defaultValue={editingType?.Name || ""}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const inputValue = e.currentTarget.value;
                            const isValid = validateName(
                              inputValue,
                              editingType ? getEntityId(editingType) : undefined
                            );
                            if (isValid) {
                              setTimeout(() => {
                                const selectTrigger = document.querySelector(
                                  `[data-field-id="typeofloan-select"]`
                                ) as HTMLElement;
                                if (selectTrigger) selectTrigger.click();
                              }, 100);
                            }
                          }
                        }}
                        onChange={(e) =>
                          validateName(
                            e.target.value,
                            editingType ? getEntityId(editingType) : undefined
                          )
                        }
                        required
                      />
                      {!nameValidation.isValid && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {nameValidation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="typeofloan"
                      className="text-xs w-40 text-right"
                    >
                      Type of Loan:
                    </Label>
                    <Select
                      name="typeofloan"
                      value={selectedLoanType}
                      onValueChange={(val) => {
                        setSelectedLoanType(
                          val as "not-applicable" | "vehicle" | "other"
                        );
                        setTimeout(() => {
                          const selectTrigger = document.querySelector(
                            `[data-field-id="subtype-select"]`
                          ) as HTMLElement;
                          if (selectTrigger) selectTrigger.click();
                        }, 100);
                      }}
                    >
                      <SelectTrigger
                        className="h-6 text-xs flex-1"
                        data-field-id="typeofloan-select"
                      >
                        <SelectValue placeholder="Select Type of Loan" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                      >
                        <SelectItem value="not-applicable">
                          Not Applicable
                        </SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLoanType === "vehicle" && (
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="subtype"
                        className="text-xs w-40 text-right"
                      >
                        Sub Type:
                      </Label>
                      <Select
                        name="subtype"
                        defaultValue={editingType?.subType || undefined}
                        onValueChange={() =>
                          setTimeout(() => {
                            const next = document.getElementById("description");
                            next?.focus();
                          }, 100)
                        }
                      >
                        <SelectTrigger
                          className="h-6 text-xs flex-1"
                          data-field-id="subtype-select"
                        >
                          <SelectValue placeholder="Select Sub Type" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                        >
                          <SelectItem value="not-applicable">
                            Not Applicable
                          </SelectItem>
                          <SelectItem value="new-car-loan">
                            New Car Loan
                          </SelectItem>
                          <SelectItem value="used-car-loan">
                            Used Car Loan
                          </SelectItem>
                          <SelectItem value="commercial-vehicle">
                            Commercial Vehicle
                          </SelectItem>
                          <SelectItem value="two-wheeler-loan">
                            Two-wheeler Loan
                          </SelectItem>
                          <SelectItem value="tractor-loan">
                            Tractor Loan
                          </SelectItem>
                          <SelectItem value="loan-against-car">
                            Loan Against Car
                          </SelectItem>
                          <SelectItem value="refinance-vehicle-loan">
                            Refinance on Vehicle Loan
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Label
                      htmlFor="description"
                      className="text-xs w-40 text-right pt-1"
                    >
                      Description:
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="text-xs flex-1 min-h-[40px]"
                      defaultValue={editingType?.description || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          setTimeout(() => {
                            const selectTrigger = document.querySelector(
                              `[data-field-id="annualrate-select"]`
                            ) as HTMLElement;
                            if (selectTrigger) selectTrigger.click();
                          }, 100);
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-1/2">
                      <Label
                        htmlFor="interestType"
                        className="text-xs w-40 text-right"
                      >
                        Interest Type:
                      </Label>
                      <div className="flex-1">
                        <Select
                          name="interestType"
                          defaultValue={editingType?.interestType || ""}
                        >
                          <SelectTrigger
                            className="h-6 text-xs w-full"
                            data-field-id="interesttype-select"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="compound">Compound</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                      <Label
                        htmlFor="interestMethod"
                        className="text-xs w-40 text-right"
                      >
                        Interest Method:
                      </Label>
                      <div className="flex-1">
                        <Select
                          name="interestMethod"
                          defaultValue={editingType?.interestMethod || ""}
                        >
                          <SelectTrigger
                            className="h-6 text-xs w-full"
                            data-field-id="interestmethod-select"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="flat-reducing-balance">
                              Flat Rate (Reducing Balance - Fixed EMI)
                            </SelectItem>
                            <SelectItem value="flat-simple-interest">
                              Flat Rate (Simple Interest on Reducing Balance)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Annual Rate Of Interest:
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Select
                        name="annualrateofinterest_applicable"
                        value={annualRateApplicable}
                        onValueChange={(v) => {
                          setAnnualRateApplicable(v as any);
                          if (v === "yes") {
                            setInterestHistory([{ date: "", rate: "" }]);
                            setIsInterestHistoryDialogOpen(true);
                            return;
                          }
                          setTimeout(() => {
                            const selectTrigger = document.querySelector(
                              `[data-field-id="eligibility-select"]`
                            ) as HTMLElement;
                            if (selectTrigger) selectTrigger.click();
                          }, 100);
                        }}
                      >
                        <SelectTrigger
                          className="h-6 text-xs w-32"
                          data-field-id="annualrate-select"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                        >
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <span className="text-xs w-40 text-right font-bold">
                          Current Rate of Interest:
                        </span>
                        <Input
                          id="currentannualrateofinterest"
                          name="currentannualrateofinterest"
                          className="h-6 text-xs w-24"
                          placeholder="11%"
                          value={currentInterestRate}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="loaneligibilitysetup"
                      className="text-xs w-40 text-right"
                    >
                      Loan Eligibility:
                    </Label>
                    <div className="flex-1">
                      <Select
                        name="loaneligibilitysetup"
                        value={eligibilitySetup}
                        onValueChange={(val) => {
                          setEligibilitySetup(val as "yes" | "no");
                          if (val === "yes") {
                            setIncomeSourceWeight(30);
                            setCibilScoreWeight(30);
                            setAgeFrom(18);
                            setAgeTo(60);
                            setIsEligibilityDialogOpen(true);
                            return;
                          }
                          setTimeout(() => {
                            const selectTrigger = document.querySelector(
                              `[data-field-id="isloanapproved-select"]`
                            ) as HTMLElement;
                            if (selectTrigger) selectTrigger.click();
                          }, 100);
                        }}
                      >
                        <SelectTrigger
                          className="h-6 text-xs w-full"
                          data-field-id="eligibility-select"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                        >
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="isloanapproved"
                      className="text-xs w-40 text-right"
                    >
                      Validate terms in apps/approval:
                    </Label>
                    <div className="flex-1">
                      <Select
                        name="isloanapproved"
                        defaultValue={editingType?.validateTermsInApproval}
                        onValueChange={() => {
                          setTimeout(() => {
                            const nextField =
                              document.getElementById("funding");
                            nextField?.focus();
                          }, 100);
                        }}
                      >
                        <SelectTrigger
                          className="h-6 text-xs w-full"
                          data-field-id="isloanapproved-select"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                        >
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Applicable Charges Checkbox and Dialog */}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="applicable-charges"
                      className="text-xs w-40 text-right"
                    >
                      Applicable Charges:
                    </Label>
                    <div className="flex-1">
                      <Dialog
                        open={isChargesDialogOpen}
                        onOpenChange={setIsChargesDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={handleChargesCheckboxClick}
                          >
                            <input
                              type="checkbox"
                              id="applicable-charges"
                              className="accent-primary"
                              checked={isChargesChecked}
                              onChange={(e) => e.stopPropagation()}
                              tabIndex={0}
                            />
                            <span className="text-xs">View/Edit Charges</span>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto z-[60]">
                          <DialogHeader>
                            <DialogTitle>Applicable Charges</DialogTitle>
                          </DialogHeader>
                          <div
                            className="overflow-x-auto border rounded-md"
                            style={{ position: "relative", zIndex: 1 }}
                          >
                            <Table className="table-fixed w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs py-1 px-2 w-16">
                                    Sl. No
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-32">
                                    Ledger Name
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-24">
                                    Group
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-32">
                                    Applied On
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-32">
                                    Applicable As
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-24">
                                    Charges (%/₹)
                                  </TableHead>
                                  <TableHead className="text-xs py-1 px-2 w-20">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {chargesData.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="text-xs py-1 px-2 text-center">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell className="py-1 px-2">
                                      <Input
                                        id={`charges-${index}-ledgerName`}
                                        className="h-7 text-xs border-gray-300"
                                        value={row.ledgerName}
                                        onChange={(e) =>
                                          handleChargesFieldChange(
                                            index,
                                            "ledgerName",
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleChargesKeyDown(
                                            e,
                                            index,
                                            "ledgerName"
                                          )
                                        }
                                        placeholder="Ledger name"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1 px-2">
                                      <Input
                                        id={`charges-${index}-group`}
                                        className="h-7 text-xs border-gray-300"
                                        value={row.group}
                                        onChange={(e) =>
                                          handleChargesFieldChange(
                                            index,
                                            "group",
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleChargesKeyDown(
                                            e,
                                            index,
                                            "group"
                                          )
                                        }
                                        placeholder="Group"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1 px-2">
                                      <Select
                                        value={row.appliedOn}
                                        onValueChange={(val) =>
                                          handleChargesFieldChange(
                                            index,
                                            "appliedOn",
                                            val
                                          )
                                        }
                                      >
                                        <SelectTrigger
                                          className="h-7 text-xs w-full border-gray-300"
                                          id={`charges-${index}-appliedOn`}
                                        >
                                          <SelectValue
                                            placeholder="Select"
                                            className="text-xs"
                                          />
                                        </SelectTrigger>
                                        <SelectContent
                                          className="text-xs min-w-[200px]"
                                          position="popper"
                                          style={{ zIndex: 99999 }}
                                        >
                                          <SelectItem
                                            value="Fixed Deposit"
                                            className="text-xs py-1"
                                          >
                                            Fixed Deposit
                                          </SelectItem>
                                          <SelectItem
                                            value="Loan Application"
                                            className="text-xs py-1"
                                          >
                                            Loan Application
                                          </SelectItem>
                                          <SelectItem
                                            value="Loan Disbursement"
                                            className="text-xs py-1"
                                          >
                                            Loan Disbursement
                                          </SelectItem>
                                          <SelectItem
                                            value="Member Registration"
                                            className="text-xs py-1"
                                          >
                                            Member Registration
                                          </SelectItem>
                                          <SelectItem
                                            value="Recurring Deposit"
                                            className="text-xs py-1"
                                          >
                                            Recurring Deposit
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="py-1 px-2">
                                      <Select
                                        value={row.applicableAs}
                                        onValueChange={(val) =>
                                          handleChargesFieldChange(
                                            index,
                                            "applicableAs",
                                            val
                                          )
                                        }
                                      >
                                        <SelectTrigger
                                          className="h-7 text-xs w-full border-gray-300"
                                          id={`charges-${index}-applicableAs`}
                                        >
                                          <SelectValue
                                            placeholder="Select"
                                            className="text-xs"
                                          />
                                        </SelectTrigger>
                                        <SelectContent
                                          className="text-xs min-w-[150px]"
                                          position="popper"
                                          style={{ zIndex: 99999 }}
                                        >
                                          <SelectItem
                                            value="% of PR Amount"
                                            className="text-xs py-1"
                                          >
                                            % of PR Amount
                                          </SelectItem>
                                          <SelectItem
                                            value="INR"
                                            className="text-xs py-1"
                                          >
                                            INR
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="py-1 px-2">
                                      <Input
                                        id={`charges-${index}-charges`}
                                        className="h-7 text-xs border-gray-300"
                                        value={row.charges}
                                        onChange={(e) =>
                                          handleChargesFieldChange(
                                            index,
                                            "charges",
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleChargesKeyDown(
                                            e,
                                            index,
                                            "charges"
                                          )
                                        }
                                        placeholder="Amount"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1 px-2 text-center">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => {
                                          const newData = chargesData.filter(
                                            (_, i) => i !== index
                                          );
                                          setChargesData(
                                            newData.length > 0
                                              ? newData
                                              : [
                                                  {
                                                    ledgerName: "",
                                                    group: "",
                                                    appliedOn: "",
                                                    applicableAs: "",
                                                    charges: "",
                                                  },
                                                ]
                                          );
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </TableCell>
                                    {/* End TableRow */}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddChargesRow}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Row
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setIsChargesDialogOpen(false);
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="funding"
                      className="text-xs w-40 text-right"
                    >
                      Funding (%):
                    </Label>
                    <Input
                      id="funding"
                      name="funding"
                      className="h-6 text-xs flex-1"
                      placeholder="100%"
                      defaultValue={editingType?.funding || ""}
                      onKeyDown={(e) => handleKeyDown(e, "minamount")}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Loan Amount Range:
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        id="minamount"
                        name="minamount"
                        className="h-6 text-xs w-32"
                        placeholder="Min Amount"
                        defaultValue={editingType?.minAmount?.toString() || ""}
                        onKeyDown={(e) => handleKeyDown(e, "maxamount")}
                      />
                      <span className="text-xs">to</span>
                      <Input
                        id="maxamount"
                        name="maxamount"
                        className="h-6 text-xs w-32"
                        placeholder="Max Amount"
                        defaultValue={editingType?.maxAmount?.toString() || ""}
                        onKeyDown={(e) => handleKeyDown(e, "minduration")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-40 text-right">
                      Duration Range:
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        id="minduration"
                        name="minduration"
                        className="h-6 text-xs w-32"
                        placeholder="Min Duration"
                        defaultValue={
                          editingType?.minDuration?.toString() || ""
                        }
                        onKeyDown={(e) => handleKeyDown(e, "maxduration")}
                      />
                      <span className="text-xs">Months</span>
                      <span className="text-xs">to</span>
                      <Input
                        id="maxduration"
                        name="maxduration"
                        className="h-6 text-xs w-32"
                        placeholder="Max Duration"
                        defaultValue={
                          editingType?.maxDuration?.toString() || ""
                        }
                        onKeyDown={(e) => handleKeyDown(e, "processingfee")}
                      />
                      <span className="text-xs">Months</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-1/2">
                      <Label
                        htmlFor="enablepartialdisbursement"
                        className="text-xs w-40 text-right"
                      >
                        Partial Disbursement:
                      </Label>
                      <div className="flex-1">
                        <Select
                          name="enablepartialdisbursement"
                          onValueChange={() => {
                            setTimeout(() => {
                              const selectTrigger = document.querySelector(
                                `[data-field-id="accruedinterest-select"]`
                              ) as HTMLElement;
                              selectTrigger?.click();
                            }, 100);
                          }}
                          defaultValue={editingType?.partialDisbursement}
                        >
                          <SelectTrigger
                            className="h-6 text-xs w-full"
                            data-field-id="partialdisbursement-select"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                      <Label
                        htmlFor="enableaccruedinterest"
                        className="text-xs w-40 text-right"
                      >
                        Accrued Interest:
                      </Label>
                      <div className="flex-1">
                        <Select
                          name="enableaccruedinterest"
                          onValueChange={() =>
                            setTimeout(() => {
                              const next =
                                document.getElementById("foreclosepenalty");
                              next?.focus();
                            }, 100)
                          }
                          defaultValue={editingType?.accruedInterest}
                        >
                          <SelectTrigger
                            className="h-6 text-xs w-full"
                            data-field-id="accruedinterest-select"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="foreclosepenalty"
                      className="text-xs w-40 text-right"
                    >
                      Foreclose Penalty:
                    </Label>
                    <Input
                      id="foreclosepenalty"
                      name="foreclosepenalty"
                      className="h-6 text-xs flex-1"
                      placeholder="3%"
                      defaultValue={editingType?.foreclosePenalty || ""}
                    />
                  </div>

                  {editingType && (
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="edit-isActive"
                        className="text-xs w-40 text-right"
                      >
                        Status:
                      </Label>
                      <div className="flex-1">
                        <Select
                          name="isActive"
                          defaultValue={String(editingType.isActive)}
                        >
                          <SelectTrigger
                            className="h-6 text-xs w-full"
                            data-field-id="status-select"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetFormStates();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingType ? "Update Loan Product" : "Add Loan Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Removed old standalone Edit Dialog - unified with Add dialog */}

      {/* Interest Rate History Dialog */}
      <Dialog
        open={isInterestHistoryDialogOpen}
        onOpenChange={(o) => {
          setIsInterestHistoryDialogOpen(o);
          if (!o && annualRateApplicable !== "yes") {
            setAnnualRateApplicable("no");
          }
        }}
      >
        <DialogContent className="max-w-lg z-[60]" style={{ zIndex: 60 }}>
          <DialogHeader>
            <DialogTitle>Interest Rate History</DialogTitle>
          </DialogHeader>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-2 bg-muted text-xs font-semibold px-2 py-1">
              <div>Applicable From</div>
              <div>Interest Rate (%)</div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {interestHistory.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-3 items-center px-2 py-1 border-b last:border-b-0"
                >
                  <Input
                    type="date"
                    className="h-6 text-xs"
                    value={row.date}
                    onChange={(e) => {
                      const v = e.target.value;
                      setInterestHistory((prev) => {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], date: v };
                        return copy;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        // focus next input
                        const next =
                          e.currentTarget.parentElement?.querySelectorAll(
                            "input"
                          )[1] as HTMLInputElement | undefined;
                        next?.focus();
                      }
                    }}
                  />
                  <Input
                    placeholder="11"
                    className="h-6 text-xs"
                    value={row.rate}
                    onChange={(e) => {
                      const v = e.target.value;
                      setInterestHistory((prev) => {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], rate: v };
                        return copy;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setInterestHistory((prev) => {
                          // Only add new blank row if current row has some data and it's the last row
                          if (
                            idx === prev.length - 1 &&
                            (prev[idx].date.trim() || prev[idx].rate.trim())
                          ) {
                            return [...prev, { date: "", rate: "" }];
                          }
                          return prev;
                        });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-[10px] text-muted-foreground">
              Press Enter inside rate to add new line.
            </div>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInterestHistory([{ date: "", rate: "" }]);
                }}
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (!currentInterestRate) {
                    toast.warning("Please enter at least one interest rate");
                    return;
                  }
                  setIsInterestHistoryDialogOpen(false);
                  // Navigate to next field after closing dialog (Add/Edit unified)
                  setTimeout(() => {
                    const selectTrigger = document.querySelector(
                      `[data-field-id="eligibility-select"]`
                    ) as HTMLElement;
                    if (selectTrigger) selectTrigger.click();
                  }, 100);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Eligibility Weightage Dialog */}
      <Dialog
        open={isEligibilityDialogOpen}
        onOpenChange={(o) => {
          setIsEligibilityDialogOpen(o);
          if (!o && eligibilitySetup !== "yes") {
            setEligibilitySetup("no");
          }
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto z-[60]"
          style={{ zIndex: 60 }}
        >
          <DialogHeader>
            <DialogTitle>Loan Eligibility Setup</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEligibilityWeights();
            }}
            className="space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-xs w-40 text-right">
                  Income Source:
                </Label>
                <Input
                  id="elig_incomeSource"
                  type="number"
                  name="elig_incomeSource"
                  value={incomeSourceWeight}
                  onChange={(e) =>
                    setIncomeSourceWeight(Number(e.target.value) || 0)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "elig_cibilScore")}
                  className="h-6 text-xs w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-40 text-right">CIBIL Score:</Label>
                <Input
                  id="elig_cibilScore"
                  type="number"
                  name="elig_cibilScore"
                  value={cibilScoreWeight}
                  onChange={(e) =>
                    setCibilScoreWeight(Number(e.target.value) || 0)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "elig_ageFrom")}
                  className="h-6 text-xs w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-40 text-right">
                  Age of Borrower:
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    id="elig_ageFrom"
                    type="number"
                    name="elig_ageFrom"
                    value={ageFrom}
                    onChange={(e) => setAgeFrom(Number(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, "elig_ageTo")}
                    className="h-6 text-xs w-20"
                    placeholder="From"
                  />
                  <span className="text-xs">to</span>
                  <Input
                    id="elig_ageTo"
                    type="number"
                    name="elig_ageTo"
                    value={ageTo}
                    onChange={(e) => setAgeTo(Number(e.target.value) || 0)}
                    className="h-6 text-xs w-20"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetEligibilityWeights();
                }}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEligibilityDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Loan Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type of Loan</TableHead>
                <TableHead>Sub Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Duration (Months)</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoanProducts?.map((type) => (
                <TableRow key={getEntityId(type)}>
                  <TableCell className="font-medium">{type.Name}</TableCell>
                  <TableCell>{deriveLoanType(type)}</TableCell>
                  <TableCell>
                    {type.subType ? (
                      <Badge variant="outline">
                        {prettySubType(type.subType)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.description}
                  </TableCell>
                  <TableCell>
                    {type.currentAnnualRateOfInterest ? (
                      <Badge variant="outline">
                        {type.currentAnnualRateOfInterest}%
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {typeof type.minDuration === "number" &&
                    typeof type.maxDuration === "number" ? (
                      <span className="text-sm">
                        {type.minDuration} - {type.maxDuration} months
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.funding ? (
                      <span className="text-sm">{type.funding}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={type.isActive ? "default" : "secondary"}>
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log("Edit button clicked for:", type);
                        openEditDialog(type);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleDelete(type)}
                    >
                      <Trash2 className="h-4 w-4" />
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

export default LoanProductComponent;
