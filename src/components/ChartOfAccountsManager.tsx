import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Edit, Database, Trash2, Search, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ChartOfAccount {
  _id: string;
  accountName: string;
  AccountType: "assets" | "liabilities" | "equity" | "income" | "expenses";
  mailingName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const API_BASE_URL = "http://localhost:3000/api/v1";

const ChartOfAccountsManager = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accounting-group");
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(
    null
  );
  const [deletingAccount, setDeletingAccount] = useState<ChartOfAccount | null>(
    null
  );
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [selectedAccountUnder, setSelectedAccountUnder] = useState("");
  const [accountTypeSearchTerm, setAccountTypeSearchTerm] = useState("");
  // For edit dialog
  const [editAccountTypeSearchTerm, setEditAccountTypeSearchTerm] =
    useState("");
  // Track custom account groups created by user with their parent relationships
  const [customAccountGroups, setCustomAccountGroups] = useState<
    { name: string; parent: string }[]
  >([]);
  // General Ledger UI state (now includes all Add Ledger fields)
  type GLRow = {
    companyId: string;
    masterId: string;
    alterId: string;
    ledgerName: string;
    desc: string;
    under: string;
    useAs?: string;
    odLimit?: string;
    occLimit?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifsCode?: string;
    swiftCode?: string;
    bankName?: string;
    branch?: string;
    openingBalance?: string;
    openingBalanceType?: string;
  };
  const [glRows, setGlRows] = useState<GLRow[]>([]);
  const [ledgerNameFilter, setLedgerNameFilter] = useState("");
  const [groupFilter, setgroupFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isAddLedgerOpen, setIsAddLedgerOpen] = useState(false);
  // Track selected group in Add Ledger dialog to conditionally show "Use As" field
  const [ledgerUnder, setLedgerUnder] = useState("");
  const [isUnderOpen, setIsUnderOpen] = useState(false);

  // Name uniqueness validation states
  const [accountNameValidation, setAccountNameValidation] = useState({
    isValid: true,
    message: "",
  });
  const [ledgerNameValidation, setLedgerNameValidation] = useState({
    isValid: true,
    message: "",
  });

  // Helper to get entity id
  const getEntityId = (obj: any): string =>
    obj?._id ?? obj?.id ?? obj?.Id ?? obj?.ID ?? obj?.Code ?? obj?.code;

  // Validate account name uniqueness (case-insensitive, trimmed)
  const validateAccountName = (name: string, excludeId?: string) => {
    const trimmed = (name || "").trim();
    if (!trimmed) {
      setAccountNameValidation({
        isValid: false,
        message: "Account name is required",
      });
      return false;
    }
    const exists = accounts?.some(
      (a) =>
        (a.accountName || "").trim().toLowerCase() === trimmed.toLowerCase() &&
        (excludeId ? getEntityId(a) !== excludeId : true)
    );
    if (exists) {
      setAccountNameValidation({
        isValid: false,
        message: "An account with this name already exists",
      });
      return false;
    }
    setAccountNameValidation({ isValid: true, message: "" });
    return true;
  };

  // Validate ledger name uniqueness (case-insensitive, trimmed)
  const validateLedgerName = (name: string, excludeId?: string) => {
    const trimmed = (name || "").trim();
    if (!trimmed) {
      setLedgerNameValidation({
        isValid: false,
        message: "Ledger name is required",
      });
      return false;
    }
    const exists = glRows?.some(
      (l) =>
        (l.ledgerName || "").trim().toLowerCase() === trimmed.toLowerCase() &&
        (excludeId ? l.ledgerName !== name : true)
    );
    if (exists) {
      setLedgerNameValidation({
        isValid: false,
        message: "A ledger with this name already exists",
      });
      return false;
    }
    setLedgerNameValidation({ isValid: true, message: "" });
    return true;
  };
  const underOptions = [
    "Bank Accounts",
    "Bank OCC A/c",
    "Bank OD A/c",
    "Bills Receivable",
    "Branch / Divisions",
    "Capital Account",
    "Cash-in-Hand",
    "Credit Officer",
    "Current Assets",
    "Current Liabilities",
    "Dealers",
    "Deposits (Asset)",
    "Direct Expenses",
    "Direct Incomes",
    "Duties & Taxes",
    "Expenses (Direct)",
    "Expenses (Indirect)",
    "Fixed Assets",
    "Guarantors",
    "Income (Direct)",
    "Income (Indirect)",
    "Indirect Expenses",
    "Indirect Incomes",
    "Investments",
    "Loans & Advances (Asset)",
    "Loans (Liability)",
    "Members",
    "Members Thrift",
    "Misc. Expenses (ASSET)",
    "Motivator",
    "Provisions",
    "Purchase Accounts",
    "Ram Sr. Motivator",
    "Reserves & Surplus",
    "Retained Earnings",
    "Sales Accounts",
    "Sam Motivator",
    "Secured Loans",
    "Shital Group",
    "Shital Group Thrift",
    "Stock-in-Hand",
    "Sundry Creditors",
    "Sundry Debtors",
    "Suspense A/c",
    "Unsecured Loans",
    "Vehicle Seize Group",
  ] as const;

  const handleAddLedgerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ledgerName = (formData.get("ledgerName") as string)?.trim();
    const under = ledgerUnder || (formData.get("under") as string);
    const ifsCode = (formData.get("ifsCode") as string)?.trim();

    // Validate ledger name uniqueness
    if (!validateLedgerName(ledgerName)) {
      return;
    }
    if (!under) {
      toast.error("Under is required");
      return;
    }

    // Validate IFS Code for bank accounts
    const bankGroups = new Set([
      "Bank Accounts",
      "Bank OCC A/c",
      "Bank OD A/c",
    ]);

    if (bankGroups.has(under) && ifsCode) {
      const ifsCodeRegex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
      if (!ifsCodeRegex.test(ifsCode)) {
        toast.error(
          "Invalid IFS code. The IFS code must start with 4 alphabets, followed by 0 and 6 numbers/alphabets. Example: AAAA0123456"
        );
        return;
      }
    }

    // Collect all form fields
    const newRow: GLRow = {
      companyId: (formData.get("companyId") as string) || "",
      masterId: (formData.get("masterId") as string) || "",
      alterId: (formData.get("alterId") as string) || "",
      ledgerName: ledgerName,
      desc: (formData.get("desc") as string) || "",
      under: under,
      useAs: (formData.get("useAs") as string) || "",
      odLimit: (formData.get("odLimit") as string) || "",
      occLimit: (formData.get("occLimit") as string) || "",
      accountHolderName: (formData.get("accountHolderName") as string) || "",
      accountNumber: (formData.get("accountNumber") as string) || "",
      ifsCode: (formData.get("ifsCode") as string) || "",
      swiftCode: (formData.get("swiftCode") as string) || "",
      bankName: (formData.get("bankName") as string) || "",
      branch: (formData.get("branch") as string) || "",
      openingBalance: (formData.get("openingBalance") as string) || "",
      openingBalanceType: (formData.get("openingBalanceType") as string) || "",
    };
    setGlRows((prev) => [newRow, ...prev]);
    setIsAddLedgerOpen(false);
    setLedgerUnder("");
    toast.success("Ledger added");
  };

  const filteredRows = glRows.filter((r) => {
    const nameOk = r.ledgerName
      .toLowerCase()
      .includes(ledgerNameFilter.toLowerCase());
    const pgOk = r.under.toLowerCase().includes(groupFilter.toLowerCase());
    return nameOk && pgOk;
  });
  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filteredRows.slice(start, end);

  // Fetch chart of accounts
  const {
    data: accounts = [],
    isLoading,
    isError,
  } = useQuery<ChartOfAccount[]>({
    queryKey: ["chartOfAccounts"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/getallchartsofaccountdata`);
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      return data.data || []; // Changed from data.Data to data.data
    },
  });

  // Create mutation
  type CreateAccountPayload = {
    accountName: string;
    AccountType: ChartOfAccount["AccountType"];
    mailingName?: string;
    isActive?: boolean;
  };

  const createAccount = useMutation({
    mutationFn: async (newAccount: CreateAccountPayload) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/create-chart-of-accounts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accountName: newAccount.accountName,
              AccountType: newAccount.AccountType,
              mailingName: newAccount.mailingName || null,
              isActive: newAccount.isActive ?? true,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create account");
        }

        return response.json();
      } catch (error) {
        console.error("Create account error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chartOfAccounts"] });
      toast.success("The account has been successfully created.");
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  // Update mutation
  const updateAccount = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ChartOfAccount>;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/updatechartsofaccount/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update account");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chartOfAccounts"] });
      toast.success("The account has been successfully updated.");
      setIsEditDialogOpen(false);
      setEditingAccount(null);
    },
    onError: () => {
      toast.error("Failed to update account.");
    },
  });

  // Delete mutation
  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${API_BASE_URL}/deletechartsofaccount/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chartOfAccounts"] });
      toast.success("The account has been successfully deleted.");
      setIsDeleteDialogOpen(false);
      setDeletingAccount(null);
    },
    onError: () => {
      toast.error("Failed to delete account.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const accountName = formData.get("accountName") as string;
    const accountType = formData.get("accountType") as string;

    // Validate account name uniqueness
    if (!validateAccountName(accountName)) {
      return;
    }

    if (!accountType) {
      toast.error("Account Type is required");
      return;
    }

    // Add to custom account groups if it's a new group
    const existingGroup = customAccountGroups.find(
      (group) => group.name === accountName.trim()
    );
    if (!existingGroup) {
      setCustomAccountGroups((prev) => [
        ...prev,
        {
          name: accountName.trim(),
          parent: selectedAccountUnder || "Primary",
        },
      ]);
    }

    createAccount.mutate({
      accountName: accountName.trim(),
      AccountType: accountType as ChartOfAccount["AccountType"],
      mailingName: (formData.get("mailingName") as string) || undefined,
      isActive: true,
    });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAccount) return;

    const formData = new FormData(e.currentTarget);

    const accountName = formData.get("accountName") as string;
    const accountType = formData.get("accountType") as string;
    // Under is from selectedAccountUnder (read-only field)

    // Validate account name uniqueness (excluding current account)
    if (!validateAccountName(accountName, getEntityId(editingAccount))) {
      return;
    }

    if (!accountType) {
      toast.error("Account Type is required");
      return;
    }

    updateAccount.mutate({
      id: editingAccount._id,
      data: {
        accountName: accountName.trim(),
        AccountType: accountType as ChartOfAccount["AccountType"],
        // Under is not sent to API, but could be added here if needed
        mailingName: (formData.get("mailingName") as string) || undefined,
        isActive: formData.get("isActive") === "true",
      },
    });
  };

  const handleDelete = () => {
    if (!deletingAccount) return;
    deleteAccount.mutate(deletingAccount._id);
  };

  const openEditDialog = (account: ChartOfAccount) => {
    setEditingAccount(account);
    // Set selectedAccountUnder for edit dialog based on mapping
    const accountTypeMapping: Record<string, string> = {
      "Capital Account": "Primary",
      "Loans (Liability)": "Primary",
      "Current Liabilities": "Primary",
      "Fixed Assets": "Primary",
      Investments: "Primary",
      "Current Assets": "Primary",
      "Branch / Divisions": "Primary",
      "Misc. Expenses (ASSET)": "Primary",
      "Suspense A/c": "Primary",
      "Purchase Accounts": "Primary",
      "Sales Accounts": "Primary",
      "Direct Incomes": "Primary",
      "Direct Expenses": "Primary",
      "Indirect Incomes": "Primary",
      "Indirect Expenses": "Primary",
      "Reserves & Surplus": "Capital Account",
      "Bank OD A/c": "Loans (Liability)",
      "Secured Loans": "Loans (Liability)",
      "Unsecured Loans": "Loans (Liability)",
      "Duties & Taxes": "Current Liabilities",
      Provisions: "Current Liabilities",
      "Sundry Creditors": "Current Liabilities",
      "Stock-in-Hand": "Current Assets",
      "Deposits (Asset)": "Current Assets",
      "Loans & Advances (Asset)": "Current Assets",
      "Sundry Debtors": "Current Assets",
      "Cash-in-Hand": "Current Assets",
      "Bank Accounts": "Current Assets",
      member: "Sundry Debtors",
      salesman: "Sundry Creditors",
      agent: "Sundry Creditors",
      broker: "Sundry Creditors",
      reference: "Sundry Creditors",
      guarantor: "Sundry Creditors",
    };
    // Add custom account groups to the mapping
    customAccountGroups.forEach((group) => {
      accountTypeMapping[group.name] = group.parent;
    });
    setSelectedAccountUnder(accountTypeMapping[account.AccountType] || "");
    setEditAccountTypeSearchTerm("");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (account: ChartOfAccount) => {
    setDeletingAccount(account);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) return <div className="p-6">Loading accounts...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Error loading accounts</div>;

  const filteredAccounts = accountSearchTerm.trim()
    ? accounts.filter((a) => {
        const q = accountSearchTerm.toLowerCase();
        return (
          (a.accountName ?? "").toLowerCase().includes(q) ||
          (a.AccountType ?? "").toLowerCase().includes(q) ||
          (a.mailingName ?? "").toLowerCase().includes(q) ||
          (a.isActive ? "active" : "inactive").includes(q)
        );
      })
    : accounts;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Database className="h-8 w-8" />
            <span>Chart of Accounts</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage your chart of accounts</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transaction-type">Transaction Type</TabsTrigger>
          <TabsTrigger value="accounting-group">Accounting Group</TabsTrigger>
          <TabsTrigger value="general-ledger">General Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="accounting-group">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Accounting Group</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center w-72 h-9 rounded-md border border-input bg-background px-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search accounts..."
                      value={accountSearchTerm}
                      onChange={(e) => setAccountSearchTerm(e.target.value)}
                      className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
                    />
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open);
                      if (!open) {
                        setSelectedAccountUnder("");
                        setAccountTypeSearchTerm("");
                        setAccountNameValidation({
                          isValid: true,
                          message: "",
                        });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Accounting Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit}
                        onKeyDown={createFormKeyDownHandler()}
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
                            <Input
                              id="companyId"
                              name="companyId"
                              className="h-6 text-xs flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
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
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="accountName"
                                className="text-xs w-40 text-right"
                              >
                                Account Name:
                              </Label>
                              <Input
                                id="accountName"
                                name="accountName"
                                className={`h-6 text-xs flex-1 ${
                                  !accountNameValidation.isValid
                                    ? "border-red-500"
                                    : ""
                                }`}
                                required
                                onBlur={(e) =>
                                  validateAccountName(e.target.value)
                                }
                                onChange={(e) => {
                                  if (!accountNameValidation.isValid)
                                    validateAccountName(e.target.value);
                                }}
                              />
                            </div>
                            {!accountNameValidation.isValid && (
                              <span className="text-xs text-red-500 ml-40">
                                {accountNameValidation.message}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="accountType"
                              className="text-xs w-40 text-right"
                            >
                              Account Type:
                            </Label>
                            <div className="flex-1">
                              <Select
                                name="accountType"
                                onValueChange={(value) => {
                                  const accountTypeMapping: Record<
                                    string,
                                    string
                                  > = {
                                    "Capital Account": "Primary",
                                    "Loans (Liability)": "Primary",
                                    "Current Liabilities": "Primary",
                                    "Fixed Assets": "Primary",
                                    Investments: "Primary",
                                    "Current Assets": "Primary",
                                    "Branch / Divisions": "Primary",
                                    "Misc. Expenses (ASSET)": "Primary",
                                    "Suspense A/c": "Primary",
                                    "Purchase Accounts": "Primary",
                                    "Sales Accounts": "Primary",
                                    "Direct Incomes": "Primary",
                                    "Direct Expenses": "Primary",
                                    "Indirect Incomes": "Primary",
                                    "Indirect Expenses": "Primary",
                                    "Reserves & Surplus": "Capital Account",
                                    "Bank OD A/c": "Loans (Liability)",
                                    "Secured Loans": "Loans (Liability)",
                                    "Unsecured Loans": "Loans (Liability)",
                                    "Duties & Taxes": "Current Liabilities",
                                    Provisions: "Current Liabilities",
                                    "Sundry Creditors": "Current Liabilities",
                                    "Stock-in-Hand": "Current Assets",
                                    "Deposits (Asset)": "Current Assets",
                                    "Loans & Advances (Asset)":
                                      "Current Assets",
                                    "Sundry Debtors": "Current Assets",
                                    "Cash-in-Hand": "Current Assets",
                                    "Bank Accounts": "Current Assets",
                                    member: "Sundry Debtors",
                                    salesman: "Sundry Creditors",
                                    agent: "Sundry Creditors",
                                    broker: "Sundry Creditors",
                                    reference: "Sundry Creditors",
                                    guarantor: "Sundry Creditors",
                                  };
                                  // Add custom account groups to the mapping
                                  customAccountGroups.forEach((group) => {
                                    accountTypeMapping[group.name] =
                                      group.parent;
                                  });
                                  // For custom account groups, use the selected account under as parent
                                  let parentGroup = accountTypeMapping[value];
                                  if (
                                    !parentGroup &&
                                    customAccountGroups.find(
                                      (g) => g.name === value
                                    )
                                  ) {
                                    parentGroup = "Primary"; // Fallback for custom groups
                                  }
                                  setSelectedAccountUnder(parentGroup || "");
                                }}
                              >
                                <SelectTrigger className="h-6 text-xs w-full">
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent
                                  position="popper"
                                  className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                                >
                                  <div className="sticky top-0 bg-white border-b p-2 z-10">
                                    <Input
                                      placeholder="Search account type..."
                                      className="h-6 text-xs"
                                      value={accountTypeSearchTerm}
                                      onChange={(e) =>
                                        setAccountTypeSearchTerm(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        e.stopPropagation();
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    />
                                  </div>
                                  {(() => {
                                    const predefinedAccountTypes = [
                                      "Capital Account",
                                      "Loans (Liability)",
                                      "Current Liabilities",
                                      "Fixed Assets",
                                      "Investments",
                                      "Current Assets",
                                      "Branch / Divisions",
                                      "Misc. Expenses (ASSET)",
                                      "Suspense A/c",
                                      "Purchase Accounts",
                                      "Sales Accounts",
                                      "Direct Incomes",
                                      "Direct Expenses",
                                      "Indirect Incomes",
                                      "Indirect Expenses",
                                      "Reserves & Surplus",
                                      "Bank OD A/c",
                                      "Secured Loans",
                                      "Unsecured Loans",
                                      "Duties & Taxes",
                                      "Provisions",
                                      "Sundry Creditors",
                                      "Stock-in-Hand",
                                      "Deposits (Asset)",
                                      "Loans & Advances (Asset)",
                                      "Sundry Debtors",
                                      "Cash-in-Hand",
                                      "Bank Accounts",
                                      "member",
                                      "salesman",
                                      "agent",
                                      "broker",
                                      "reference",
                                      "guarantor",
                                    ];
                                    // Combine predefined types with custom account groups
                                    const accountTypes = [
                                      ...predefinedAccountTypes,
                                      ...customAccountGroups.map((g) => g.name),
                                    ];

                                    const filteredAccountTypes =
                                      accountTypes.filter((type) =>
                                        type
                                          .toLowerCase()
                                          .includes(
                                            accountTypeSearchTerm.toLowerCase()
                                          )
                                      );

                                    return filteredAccountTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type === "member"
                                          ? "Member"
                                          : type === "salesman"
                                          ? "Salesman"
                                          : type === "agent"
                                          ? "Agent"
                                          : type === "broker"
                                          ? "Broker"
                                          : type === "reference"
                                          ? "Reference"
                                          : type === "guarantor"
                                          ? "Guarantor"
                                          : type === "Stock-in-Hand"
                                          ? "Stock in Hand"
                                          : type === "Cash-in-Hand"
                                          ? "Cash in Hand"
                                          : type}
                                      </SelectItem>
                                    ));
                                  })()}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-40 text-right"></Label>
                            <div className="flex-1">
                              <span className="text-xs text-gray-500">
                                {selectedAccountUnder
                                  ? `(Under: ${selectedAccountUnder})`
                                  : "(Select account type to see parent group)"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createAccount.isPending}
                          >
                            {createAccount.isPending
                              ? "Adding..."
                              : "Add Account"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {account.AccountType.charAt(0).toUpperCase() +
                            account.AccountType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={account.isActive ? "default" : "secondary"}
                        >
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(account)}
                          disabled={updateAccount.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(account)}
                          disabled={deleteAccount.isPending}
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
        </TabsContent>

        <TabsContent value="general-ledger">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>General Ledger</CardTitle>
                <Dialog
                  open={isAddLedgerOpen}
                  onOpenChange={(open) => {
                    setIsAddLedgerOpen(open);
                    if (!open) {
                      setLedgerUnder("");
                      setLedgerNameValidation({ isValid: true, message: "" });
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Ledger
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`max-h-[90vh] overflow-y-auto transition-all duration-300 ${(() => {
                      const bankGroups = new Set([
                        "Bank Accounts",
                        "Bank OCC A/c",
                        "Bank OD A/c",
                      ]);
                      return bankGroups.has(ledgerUnder)
                        ? "w-full max-w-5xl"
                        : "max-w-2xl";
                    })()}`}
                  >
                    <DialogHeader>
                      <DialogTitle>Add New Ledger</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleAddLedgerSubmit}
                      onKeyDown={createFormKeyDownHandler()}
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
                          <Input
                            id="companyId"
                            name="companyId"
                            className="h-6 text-xs flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
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
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="ledgerName"
                              className="text-xs w-40 text-right"
                            >
                              Ledger Name:
                            </Label>
                            <Input
                              id="ledgerName"
                              name="ledgerName"
                              className={`h-6 text-xs flex-1 ${
                                !ledgerNameValidation.isValid
                                  ? "border-red-500"
                                  : ""
                              }`}
                              required
                              onBlur={(e) => validateLedgerName(e.target.value)}
                              onChange={(e) => {
                                if (!ledgerNameValidation.isValid)
                                  validateLedgerName(e.target.value);
                              }}
                            />
                          </div>
                          {!ledgerNameValidation.isValid && (
                            <span className="text-xs text-red-500 ml-40">
                              {ledgerNameValidation.message}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="desc"
                            className="text-xs w-40 text-right"
                          >
                            Description:
                          </Label>
                          <textarea
                            id="desc"
                            name="desc"
                            className="h-16 min-h-[2.5rem] max-h-40 resize-y text-xs flex-1 border rounded px-2 py-1"
                            placeholder="Enter description"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="under"
                            className="text-xs w-40 text-right"
                          >
                            Under:
                          </Label>
                          <div className="flex-1 relative">
                            {/* Hidden input to keep form semantics */}
                            <input
                              type="hidden"
                              name="under"
                              value={ledgerUnder}
                            />
                            <Popover
                              open={isUnderOpen}
                              onOpenChange={setIsUnderOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-6 text-xs w-full justify-between"
                                >
                                  {ledgerUnder || "Select group"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                side="bottom"
                                align="start"
                                sideOffset={2}
                                avoidCollisions={true}
                                collisionPadding={8}
                                className="z-[999] p-0 w-full max-w-[400px] shadow-lg border"
                                style={{
                                  width: "var(--radix-popover-trigger-width)",
                                }}
                              >
                                <Command className="w-full">
                                  <CommandInput
                                    placeholder="Search group..."
                                    className="h-8 text-xs"
                                  />
                                  <CommandEmpty className="py-2 text-xs text-center text-gray-500">
                                    No group found.
                                  </CommandEmpty>
                                  <CommandList className="max-h-[200px] overflow-y-auto">
                                    <CommandGroup>
                                      {underOptions.map((opt) => (
                                        <CommandItem
                                          key={opt}
                                          value={opt}
                                          onSelect={() => {
                                            setLedgerUnder(opt);
                                            setIsUnderOpen(false);
                                          }}
                                          className="text-xs py-1.5 px-2 cursor-pointer hover:bg-gray-100"
                                        >
                                          {opt}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        {/* Conditional 'Use As' field based on selected group */}
                        {(() => {
                          const incomeGroups = new Set([
                            "Direct Incomes",
                            "Income (Direct)",
                            "Income (Indirect)",
                            "Indirect Incomes",
                          ]);
                          const expenseGroups = new Set([
                            "Direct Expenses",
                            "Expenses (Direct)",
                            "Expenses (Indirect)",
                            "Indirect Expenses",
                          ]);
                          const isIncome = incomeGroups.has(ledgerUnder);
                          const isExpense = expenseGroups.has(ledgerUnder);
                          const isCurrentLiability =
                            ledgerUnder === "Current Liabilities";

                          if (!isIncome && !isExpense && !isCurrentLiability)
                            return null;

                          return (
                            <React.Fragment>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs w-40 text-right">
                                  Use As:
                                </Label>
                                <div className="flex-1">
                                  {isIncome ? (
                                    <Select name="useAs">
                                      <SelectTrigger className="h-6 text-xs w-full">
                                        <SelectValue placeholder="Select use" />
                                      </SelectTrigger>
                                      <SelectContent
                                        position="popper"
                                        className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                                      >
                                        <SelectItem value="Not Applicable">
                                          Not Applicable
                                        </SelectItem>
                                        <SelectItem value="Loan Apllication">
                                          Loan Apllication
                                        </SelectItem>
                                        <SelectItem value="Loan Misc. Charges">
                                          Loan Misc. Charges
                                        </SelectItem>
                                        <SelectItem value="Fixed Deposit">
                                          Fixed Deposit
                                        </SelectItem>
                                        <SelectItem value="Member Registration">
                                          Member Registration
                                        </SelectItem>
                                        <SelectItem value="Recurring Deposit">
                                          Recurring Deposit
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : isExpense ? (
                                    <Input
                                      name="useAs"
                                      value="Commision payable"
                                      readOnly
                                      className="h-6 text-xs w-full"
                                    />
                                  ) : (
                                    // Current Liabilities
                                    <Input
                                      name="useAs"
                                      value="Loan Disbursement"
                                      readOnly
                                      className="h-6 text-xs w-full"
                                    />
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })()}

                        {/* Bank Account Details - Show for Bank related groups */}
                        {(() => {
                          const bankGroups = new Set([
                            "Bank Accounts",
                            "Bank OCC A/c",
                            "Bank OD A/c",
                          ]);
                          const isBankAccount = bankGroups.has(ledgerUnder);

                          if (!isBankAccount) return null;

                          return (
                            <div className="flex flex-col md:flex-row gap-8">
                              {/* Bank Account Details */}
                              <div className="flex-1 min-w-[320px]">
                                {/* Set OD/OCC Limit (if applicable) */}
                                {ledgerUnder === "Bank OD A/c" && (
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="odLimit"
                                      className="text-xs w-40 text-right"
                                    >
                                      Set OD/OCC Limit:
                                    </Label>
                                    <Input
                                      id="odLimit"
                                      name="odLimit"
                                      type="number"
                                      className="h-6 text-xs flex-1"
                                      placeholder="Enter OD limit amount"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                )}
                                {ledgerUnder === "Bank OCC A/c" && (
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="occLimit"
                                      className="text-xs w-40 text-right"
                                    >
                                      Set OD/OCC Limit:
                                    </Label>
                                    <Input
                                      id="occLimit"
                                      name="occLimit"
                                      type="number"
                                      className="h-6 text-xs flex-1"
                                      placeholder="Enter OCC limit amount"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                )}
                                <div className="mt-4 mb-2 text-center">
                                  <Label className="text-sm font-medium text-gray-700 ">
                                    Bank Account Details
                                  </Label>
                                  <div className="h-px bg-gray-200 mt-1"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="accountHolderName"
                                    className="text-xs w-40 text-right"
                                  >
                                    A/c Holder Name:
                                  </Label>
                                  <Input
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter account holder name"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="accountNumber"
                                    className="text-xs w-40 text-right"
                                  >
                                    A/c No:
                                  </Label>
                                  <Input
                                    id="accountNumber"
                                    name="accountNumber"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter account number"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="ifsCode"
                                    className="text-xs w-40 text-right"
                                  >
                                    IFS Code:
                                  </Label>
                                  <Input
                                    id="ifsCode"
                                    name="ifsCode"
                                    className="h-6 text-xs flex-1"
                                    placeholder="8 to 11 character"
                                    maxLength={11}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="swiftCode"
                                    className="text-xs w-40 text-right"
                                  >
                                    Swift Code:
                                  </Label>
                                  <Input
                                    id="swiftCode"
                                    name="swiftCode"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter swift code"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="bankName"
                                    className="text-xs w-40 text-right"
                                  >
                                    Bank Name:
                                  </Label>
                                  <Input
                                    id="bankName"
                                    name="bankName"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter bank name"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="branch"
                                    className="text-xs w-40 text-right"
                                  >
                                    Branch:
                                  </Label>
                                  <Input
                                    id="branch"
                                    name="branch"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter branch name"
                                  />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Label
                                    htmlFor="openingBalance"
                                    className="text-xs w-40 text-right"
                                  >
                                    Opening Balance:
                                  </Label>
                                  <Input
                                    id="openingBalance"
                                    name="openingBalance"
                                    type="number"
                                    className="h-6 text-xs w-26"
                                    placeholder="Enter opening balance"
                                    min="0"
                                    step="0.01"
                                  />
                                  <Select
                                    name="openingBalanceType"
                                    defaultValue="Cr"
                                  >
                                    <SelectTrigger className="h-6 text-xs w-16">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Cr">Cr</SelectItem>
                                      <SelectItem value="Dr">Dr</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              {/* Mailing Details Section */}
                              <div className="flex-1 min-w-[320px]">
                                <div className="mt-4 mb-2 text-center">
                                  <Label className="text-sm font-medium text-gray-700">
                                    Mailing Details
                                  </Label>
                                  <div className="h-px bg-gray-200 mt-1"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingName"
                                    className="text-xs w-40 text-right"
                                  >
                                    Name:
                                  </Label>
                                  <Input
                                    id="mailingName"
                                    name="mailingName"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter name"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingAddress"
                                    className="text-xs w-40 text-right"
                                  >
                                    Address:
                                  </Label>
                                  <Input
                                    id="mailingAddress"
                                    name="mailingAddress"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter address"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingState"
                                    className="text-xs w-40 text-right"
                                  >
                                    State:
                                  </Label>
                                  <Input
                                    id="mailingState"
                                    name="mailingState"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter state"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingCountry"
                                    className="text-xs w-40 text-right"
                                  >
                                    Country:
                                  </Label>
                                  <Input
                                    id="mailingCountry"
                                    name="mailingCountry"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter country"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingPincode"
                                    className="text-xs w-40 text-right"
                                  >
                                    Pincode:
                                  </Label>
                                  <Input
                                    id="mailingPincode"
                                    name="mailingPincode"
                                    className="h-6 text-xs flex-1"
                                    placeholder="Enter pincode"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddLedgerOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Ledger</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* General Ledger Table - Left Side */}
                <div className="flex-1 max-w-xl min-w-[380px]">
                  {/* Search box for General Ledger table */}
                  <div className="flex items-center w-72 h-9 rounded-md border border-input bg-background px-2 mb-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search ledger..."
                      value={ledgerNameFilter}
                      onChange={(e) => {
                        setPage(1);
                        setLedgerNameFilter(e.target.value);
                      }}
                      className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
                    />
                  </div>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ledger Name</TableHead>
                          <TableHead>Under</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pageRows.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center text-gray-500 h-16"
                            >
                              No records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          pageRows.map((row, idx) => (
                            <TableRow key={`ledger-${idx}`}>
                              <TableCell>{row.ledgerName}</TableCell>
                              <TableCell>{row.under}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      alert(`View: ${row.ledgerName}`)
                                    }
                                    title="View"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      alert(`Edit: ${row.ledgerName}`)
                                    }
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      alert(`Delete: ${row.ledgerName}`)
                                    }
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                    <div>
                      Displaying {total === 0 ? 0 : start + 1} - {end} of{" "}
                      {total}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={currentPage === 1}
                      >
                        «
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        ‹
                      </Button>
                      <span>
                        Page {currentPage} of {pageCount}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(pageCount, p + 1))
                        }
                        disabled={currentPage === pageCount}
                      >
                        ›
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pageCount)}
                        disabled={currentPage === pageCount}
                      >
                        »
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chart of Accounts Tree - Right Side */}
                <div className="w-[350px] min-w-[260px]">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Chart of Accounts
                      </h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          📂 Expand All
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          📁 Collapse All
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Input
                        placeholder="Search..."
                        className="h-8 text-sm"
                        value={accountSearchTerm}
                        onChange={(e) => setAccountSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span>📁</span>
                        <span>Account Groups</span>
                      </div>

                      <div className="ml-4 space-y-1">
                        {[
                          "Primary",
                          "Capital Account",
                          "Current Assets",
                          "Current Liabilities",
                          "Fixed Assets",
                          "Investments",
                          "Direct Incomes",
                          "Direct Expenses",
                          "Indirect Incomes",
                          "Indirect Expenses",
                        ].map((group) => (
                          <div
                            key={group}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 p-1 rounded cursor-pointer"
                          >
                            <span>📁</span>
                            <span>{group}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setAccountNameValidation({ isValid: true, message: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          {editingAccount && (
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-3"
            >
              <div className="space-y-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="edit-accountName"
                      className="text-xs w-40 text-right"
                    >
                      Account Name:
                    </Label>
                    <Input
                      id="edit-accountName"
                      name="accountName"
                      className={`h-6 text-xs flex-1 ${
                        !accountNameValidation.isValid ? "border-red-500" : ""
                      }`}
                      defaultValue={editingAccount.accountName}
                      required
                      onBlur={(e) =>
                        validateAccountName(
                          e.target.value,
                          getEntityId(editingAccount)
                        )
                      }
                      onChange={(e) => {
                        if (!accountNameValidation.isValid)
                          validateAccountName(
                            e.target.value,
                            getEntityId(editingAccount)
                          );
                      }}
                    />
                  </div>
                  {!accountNameValidation.isValid && (
                    <span className="text-xs text-red-500 ml-40">
                      {accountNameValidation.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="edit-accountType"
                    className="text-xs w-40 text-right"
                  >
                    Account Type:
                  </Label>
                  <div className="flex-1">
                    <Select
                      name="accountType"
                      defaultValue={editingAccount.AccountType}
                      onValueChange={(value) => {
                        const accountTypeMapping: Record<string, string> = {
                          "Capital Account": "Primary",
                          "Loans (Liability)": "Primary",
                          "Current Liabilities": "Primary",
                          "Fixed Assets": "Primary",
                          Investments: "Primary",
                          "Current Assets": "Primary",
                          "Branch / Divisions": "Primary",
                          "Misc. Expenses (ASSET)": "Primary",
                          "Suspense A/c": "Primary",
                          "Purchase Accounts": "Primary",
                          "Sales Accounts": "Primary",
                          "Direct Incomes": "Primary",
                          "Direct Expenses": "Primary",
                          "Indirect Incomes": "Primary",
                          "Indirect Expenses": "Primary",
                          "Reserves & Surplus": "Capital Account",
                          "Bank OD A/c": "Loans (Liability)",
                          "Secured Loans": "Loans (Liability)",
                          "Unsecured Loans": "Loans (Liability)",
                          "Duties & Taxes": "Current Liabilities",
                          Provisions: "Current Liabilities",
                          "Sundry Creditors": "Current Liabilities",
                          "Stock-in-Hand": "Current Assets",
                          "Deposits (Asset)": "Current Assets",
                          "Loans & Advances (Asset)": "Current Assets",
                          "Sundry Debtors": "Current Assets",
                          "Cash-in-Hand": "Current Assets",
                          "Bank Accounts": "Current Assets",
                          member: "Sundry Debtors",
                          salesman: "Sundry Creditors",
                          agent: "Sundry Creditors",
                          broker: "Sundry Creditors",
                          reference: "Sundry Creditors",
                          guarantor: "Sundry Creditors",
                        };
                        // Add custom account groups to the mapping
                        customAccountGroups.forEach((group) => {
                          accountTypeMapping[group.name] = group.parent;
                        });
                        // For custom account groups, use the selected account under as parent
                        let parentGroup = accountTypeMapping[value];
                        if (
                          !parentGroup &&
                          customAccountGroups.find((g) => g.name === value)
                        ) {
                          parentGroup = "Primary"; // Fallback for custom groups
                        }
                        setSelectedAccountUnder(parentGroup || "");
                        setEditAccountTypeSearchTerm("");
                      }}
                    >
                      <SelectTrigger className="h-6 text-xs w-full">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                      >
                        <div className="sticky top-0 bg-white border-b p-2 z-10">
                          <Input
                            placeholder="Search account type..."
                            className="h-6 text-xs"
                            value={editAccountTypeSearchTerm}
                            onChange={(e) =>
                              setEditAccountTypeSearchTerm(e.target.value)
                            }
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </div>
                        {(() => {
                          const predefinedAccountTypes = [
                            "Capital Account",
                            "Loans (Liability)",
                            "Current Liabilities",
                            "Fixed Assets",
                            "Investments",
                            "Current Assets",
                            "Branch / Divisions",
                            "Misc. Expenses (ASSET)",
                            "Suspense A/c",
                            "Purchase Accounts",
                            "Sales Accounts",
                            "Direct Incomes",
                            "Direct Expenses",
                            "Indirect Incomes",
                            "Indirect Expenses",
                            "Reserves & Surplus",
                            "Bank OD A/c",
                            "Secured Loans",
                            "Unsecured Loans",
                            "Duties & Taxes",
                            "Provisions",
                            "Sundry Creditors",
                            "Stock-in-Hand",
                            "Deposits (Asset)",
                            "Loans & Advances (Asset)",
                            "Sundry Debtors",
                            "Cash-in-Hand",
                            "Bank Accounts",
                            "member",
                            "salesman",
                            "agent",
                            "broker",
                            "reference",
                            "guarantor",
                          ];
                          // Combine predefined types with custom account groups
                          const accountTypes = [
                            ...predefinedAccountTypes,
                            ...customAccountGroups.map((g) => g.name),
                          ];
                          const filteredAccountTypes = accountTypes.filter(
                            (type) =>
                              type
                                .toLowerCase()
                                .includes(
                                  editAccountTypeSearchTerm.toLowerCase()
                                )
                          );
                          return filteredAccountTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === "member"
                                ? "Member"
                                : type === "salesman"
                                ? "Salesman"
                                : type === "agent"
                                ? "Agent"
                                : type === "broker"
                                ? "Broker"
                                : type === "reference"
                                ? "Reference"
                                : type === "guarantor"
                                ? "Guarantor"
                                : type === "Stock-in-Hand"
                                ? "Stock in Hand"
                                : type === "Cash-in-Hand"
                                ? "Cash in Hand"
                                : type}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="edit-under"
                    className="text-xs w-40 text-right"
                  >
                    Under:
                  </Label>
                  <Input
                    id="edit-under"
                    name="under"
                    value={selectedAccountUnder}
                    readOnly
                    className="h-6 text-xs flex-1 bg-gray-50"
                    placeholder="Select account type first"
                  />
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
                      name="isActive"
                      defaultValue={
                        editingAccount.isActive?.toString() || "true"
                      }
                      required
                    >
                      <SelectTrigger className="h-6 text-xs w-full">
                        <SelectValue />
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
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                  disabled={updateAccount.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateAccount.isPending}
                >
                  {updateAccount.isPending ? "Updating..." : "Update Account"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          {deletingAccount && (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the account{" "}
                <strong>{deletingAccount.accountName}</strong>?
              </p>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All transactions associated with
                this account will need to be reassigned.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={deleteAccount.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChartOfAccountsManager;
