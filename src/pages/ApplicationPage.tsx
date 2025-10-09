import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Receipt,
  Banknote,
  Plus,
  Building,
  Calendar,
} from "lucide-react";
import { LoanTransaction, Loan } from "@/types";

const transactionSteps = [
  { step: 1, type: "application", label: "Application", icon: FileText },
  { step: 2, type: "approval", label: "Approval", icon: CheckCircle },
  { step: 3, type: "disbursement", label: "Disbursement", icon: Banknote },
  { step: 4, type: "emi_receipt", label: "EMI Receipt", icon: Receipt },
  { step: 5, type: "charges_receipt", label: "Charges Receipt", icon: Receipt },
  {
    step: 6,
    type: "pre_closure_receipt",
    label: "Pre Closure Receipt",
    icon: Receipt,
  },
  { step: 7, type: "write_off", label: "Write Off", icon: AlertCircle },
  { step: 8, type: "topup", label: "Topup", icon: CreditCard },
  {
    step: 9,
    type: "interest_generation",
    label: "Interest Generation",
    icon: Receipt,
  },
  {
    step: 10,
    type: "dealer_receivable",
    label: "Dealer Receivable",
    icon: Receipt,
  },
  {
    step: 11,
    type: "dealer_receivable_auto",
    label: "Dealer Receivable (auto)",
    icon: Receipt,
  },
  {
    step: 12,
    type: "vehicle_seizure",
    label: "Vehicle Seizure",
    icon: AlertCircle,
  },
  {
    step: 13,
    type: "registration_certificates",
    label: "Registration Certificates",
    icon: FileText,
  },
  {
    step: 14,
    type: "vehicle_insurance",
    label: "Vehicle Insurance",
    icon: FileText,
  },
] as const;

// Sample data for development
const sampleLoans: Loan[] = [
  {
    id: "1",
    loanId: "LOAN-001",
    memberId: "MEM-001",
    memberName: "John Doe",
    amount: 50000,
    interestRate: 12.5,
    duration: 24,
    objective: "Business Expansion",
    penaltyMode: "Monthly",
    status: "active",
    appliedDate: "2024-01-15",
    approvedDate: "2024-01-20",
    dueDate: "2026-01-20",
    remainingAmount: 45000,
    currentStep: 3,
  },
  {
    id: "2",
    loanId: "LOAN-002",
    memberId: "MEM-002",
    memberName: "Jane Smith",
    amount: 75000,
    interestRate: 11.0,
    duration: 36,
    objective: "Home Improvement",
    penaltyMode: "Monthly",
    status: "pending",
    appliedDate: "2024-02-01",
    remainingAmount: 75000,
    currentStep: 1,
  },
];

const sampleTransactions: LoanTransaction[] = [
  {
    id: "1",
    loanId: "1",
    step: 1,
    type: "application",
    status: "completed",
    amount: 0,
    date: "2024-01-15",
    notes: "Application submitted",
    completedBy: "John Doe",
  },
  {
    id: "2",
    loanId: "1",
    step: 2,
    type: "approval",
    status: "completed",
    amount: 0,
    date: "2024-01-20",
    notes: "Loan approved",
    completedBy: "Manager",
  },
  {
    id: "3",
    loanId: "1",
    step: 3,
    type: "disbursement",
    status: "completed",
    amount: 50000,
    date: "2024-01-22",
    notes: "Amount disbursed",
    completedBy: "Finance Team",
  },
];

interface LoanTransactionsProps {
  loans?: Loan[];
  transactions?: LoanTransaction[];
  onUpdateTransaction?: (id: string, data: Partial<LoanTransaction>) => void;
  onAddTransaction?: (transaction: Omit<LoanTransaction, "id">) => void;
}

const ApplicationPage = ({
  loans = sampleLoans,
  transactions = sampleTransactions,
  onUpdateTransaction,
  onAddTransaction,
}: LoanTransactionsProps) => {
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");
  const [guarantorRows, setGuarantorRows] = useState([{ id: 1 }]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    loanId: "",
    step: 1,
    type: "application" as LoanTransaction["type"],
    amount: 0,
    notes: "",
  });

  const addNewGuarantorRow = () => {
    const newRow = { id: guarantorRows.length + 1 };
    setGuarantorRows([...guarantorRows, newRow]);
  };

  const handleGuarantorKeyDown = (e: React.KeyboardEvent, rowId: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Check if this is the last row and all required fields in current row are filled
      const currentRow = document.querySelector(`[data-row-id="${rowId}"]`);
      if (currentRow && rowId === guarantorRows.length) {
        const inputs = currentRow.querySelectorAll("input[required]");
        const allFilled = Array.from(inputs).every(
          (input: any) => input.value.trim() !== ""
        );

        if (allFilled) {
          addNewGuarantorRow();
          // Focus first input of new row after it's added
          setTimeout(() => {
            const newRowFirstInput = document.querySelector(
              `[data-row-id="${rowId + 1}"] input`
            );
            if (newRowFirstInput) {
              (newRowFirstInput as HTMLInputElement).focus();
            }
          }, 100);
        }
      }
    }
  };

  const tabs = [
    { id: "date", label: "Date", icon: Calendar },
    { id: "company", label: "Company", icon: Building },
    { id: "application", label: "Application", icon: FileText },
    { id: "createmember", label: "Create Member", icon: Plus },
    { id: "loanapproval", label: "Loan Approval", icon: CheckCircle },
    { id: "loandisburment", label: "Loan Disburment", icon: Banknote },
    { id: "eligibilityofloan", label: "Eligibility of Loan", icon: CreditCard },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLoanProgress = (loanId: string) => {
    const loanTransactions = transactions.filter((t) => t.loanId === loanId);
    const completedSteps = loanTransactions.filter(
      (t) => t.status === "completed"
    ).length;
    return (completedSteps / transactionSteps.length) * 100;
  };

  const filteredTransactions = selectedLoanId
    ? transactions.filter((t) => t.loanId === selectedLoanId)
    : transactions;

  const handleAddTransaction = () => {
    const selectedStep = transactionSteps.find(
      (s) => s.step === newTransaction.step
    );
    const transactionToAdd = {
      ...newTransaction,
      type: selectedStep?.type || "application",
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
    };

    if (onAddTransaction) {
      onAddTransaction(transactionToAdd);
    } else {
      // Handle locally if no callback provided
      console.log("New transaction:", transactionToAdd);
    }

    setNewTransaction({
      loanId: "",
      step: 1,
      type: "application",
      amount: 0,
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateTransaction = (
    id: string,
    data: Partial<LoanTransaction>
  ) => {
    if (onUpdateTransaction) {
      onUpdateTransaction(id, data);
    } else {
      // Handle locally if no callback provided
      console.log("Update transaction:", id, data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 inline-block px-2 rounded">
            Loan Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Manage loan applications and track their progress
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[100vh] flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              {/* Left side - Form content */}
              <div className="flex-1 overflow-y-auto p-6">
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl inline-block bg-blue-100 px-2 rounded">
                      New Loan Application
                    </DialogTitle>
                    <div className="text-sm text-gray-600">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </DialogHeader>

                <form className="space-y-6">
                  {activeTab === "date" && (
                    <>
                      <div className="text-sm text-gray-600">
                        Select a date using the Date tab on the right.
                      </div>
                    </>
                  )}

                  {activeTab === "company" && (
                    <>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Company Information
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="companyname"
                                className="text-xs text-right"
                              >
                                Company Name:
                              </Label>
                              <Input
                                id="companyname"
                                name="companyname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="companytype"
                                className="text-xs text-right"
                              >
                                Company Type:
                              </Label>
                              <Select name="companytype" required>
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Select Company Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="private">
                                    Private Limited
                                  </SelectItem>
                                  <SelectItem value="public">
                                    Public Limited
                                  </SelectItem>
                                  <SelectItem value="partnership">
                                    Partnership
                                  </SelectItem>
                                  <SelectItem value="proprietorship">
                                    Sole Proprietorship
                                  </SelectItem>
                                  <SelectItem value="llp">LLP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="registrationnumber"
                                className="text-xs text-right"
                              >
                                Registration Number:
                              </Label>
                              <Input
                                id="registrationnumber"
                                name="registrationnumber"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="gstnumber"
                                className="text-xs text-right"
                              >
                                GST Number:
                              </Label>
                              <Input
                                id="gstnumber"
                                name="gstnumber"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="pannumber"
                                className="text-xs text-right"
                              >
                                PAN Number:
                              </Label>
                              <Input
                                id="pannumber"
                                name="pannumber"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="industry"
                                className="text-xs text-right"
                              >
                                Industry:
                              </Label>
                              <Input
                                id="industry"
                                name="industry"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="col-span-2 grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="companyaddress"
                                className="text-xs text-right"
                              >
                                Company Address:
                              </Label>
                              <Input
                                id="companyaddress"
                                name="companyaddress"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="city"
                                className="text-xs text-right"
                              >
                                City:
                              </Label>
                              <Input
                                id="city"
                                name="city"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="state"
                                className="text-xs text-right"
                              >
                                State:
                              </Label>
                              <Input
                                id="state"
                                name="state"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="pincode"
                                className="text-xs text-right"
                              >
                                Pincode:
                              </Label>
                              <Input
                                id="pincode"
                                name="pincode"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="establisheddate"
                                className="text-xs text-right"
                              >
                                Established Date:
                              </Label>
                              <Input
                                type="date"
                                id="establisheddate"
                                name="establisheddate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="annualrevenue"
                                className="text-xs text-right"
                              >
                                Annual Revenue:
                              </Label>
                              <Input
                                type="number"
                                id="annualrevenue"
                                name="annualrevenue"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="employeecount"
                                className="text-xs text-right"
                              >
                                Employee Count:
                              </Label>
                              <Input
                                type="number"
                                id="employeecount"
                                name="employeecount"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "application" && (
                    <>
                      <div className="space-y-3">
                        {/* Loan Application Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Loan Application
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="applicantname"
                                className="text-xs text-right"
                              >
                                Applicant's Name:
                              </Label>
                              <Input
                                id="applicantname"
                                name="applicantname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="memberid"
                                className="text-xs text-right"
                              >
                                Member ID:
                              </Label>
                              <Input
                                id="memberid"
                                name="memberid"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="emireceipttype"
                                className="text-xs text-right"
                              >
                                EMI Receipt Type:
                              </Label>
                              <Select name="emireceipttype" required>
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Select EMI Receipt Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="cheque">Cheque</SelectItem>
                                  <SelectItem value="online">ECS</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="date"
                                className="text-xs text-right"
                              >
                                Date:
                              </Label>
                              <Input
                                type="date"
                                id="date"
                                name="date"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="applicationno"
                                className="text-xs text-right"
                              >
                                Application No.:
                              </Label>
                              <Input
                                id="applicationno"
                                name="applicationno"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanobjective"
                                className="text-xs text-right"
                              >
                                Loan Objective:
                              </Label>
                              <Input
                                id="loanobjective"
                                name="loanobjective"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Loan Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Loan Details
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanproduct"
                                className="text-xs text-right"
                              >
                                Loan Product:
                              </Label>
                              <Input
                                id="loanproduct"
                                name="loanproduct"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestmethod"
                                className="text-xs text-right"
                              >
                                Interest Method:
                              </Label>
                              <Input
                                id="interestmethod"
                                name="interestmethod"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestrate"
                                className="text-xs text-right"
                              >
                                Interest Rate:
                              </Label>
                              <Input
                                id="interestrate"
                                name="interestrate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="invoicevalue"
                                className="text-xs text-right"
                              >
                                Invoice Value:
                              </Label>
                              <Input
                                id="invoicevalue"
                                name="invoicevalue"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="funding"
                                className="text-xs text-right"
                              >
                                Funding(%):
                              </Label>
                              <Input
                                id="funding"
                                name="funding"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="netloanamount"
                                className="text-xs text-right"
                              >
                                Net Loan Amount:
                              </Label>
                              <Input
                                id="netloanamount"
                                name="netloanamount"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="repaymentplan"
                                className="text-xs text-right"
                              >
                                Repayment Plan:
                              </Label>
                              <Input
                                id="repaymentplan"
                                name="repaymentplan"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanterm"
                                className="text-xs text-right"
                              >
                                Loan Term:
                              </Label>
                              <Input
                                id="loanterm"
                                name="loanterm"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="noofemi"
                                className="text-xs text-right"
                              >
                                No. of EMI:
                              </Label>
                              <Input
                                id="noofemi"
                                name="noofemi"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="intereststyle"
                                className="text-xs text-right"
                              >
                                Interest Style:
                              </Label>
                              <Input
                                id="intereststyle"
                                name="intereststyle"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className=" grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestrateperday"
                                className="text-xs text-right"
                              >
                                Interest Rate per Day/Month:
                              </Label>
                              <Input
                                id="interestrateperday"
                                name="interestrateperday"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Guarantor Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Guarantor Details
                          </h2>
                          <div className="border border-gray-200 rounded-md overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Guarantor From
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Name
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    ID
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Relationship
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Age
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Contact No.
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Address
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center border-r border-gray-200">
                                    Occupation
                                  </th>
                                  <th className="py-2 px-2 font-medium text-center">
                                    Income
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {guarantorRows.map((row, index) => (
                                  <tr
                                    key={row.id}
                                    className={`border-t border-gray-200 ${
                                      index > 0 ? "bg-gray-25" : ""
                                    }`}
                                    data-row-id={row.id}
                                  >
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantorfrom-${row.id}`}
                                        name={`guarantorfrom-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantorname-${row.id}`}
                                        name={`guarantorname-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantorid-${row.id}`}
                                        name={`guarantorid-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`relationship-${row.id}`}
                                        name={`relationship-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantorage-${row.id}`}
                                        name={`guarantorage-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantorcontact-${row.id}`}
                                        name={`guarantorcontact-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantoraddress-${row.id}`}
                                        name={`guarantoraddress-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2 border-r border-gray-200">
                                      <Input
                                        id={`guarantoroccupation-${row.id}`}
                                        name={`guarantoroccupation-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <Input
                                        id={`guarantorincome-${row.id}`}
                                        name={`guarantorincome-${row.id}`}
                                        className="h-6 text-xs border-0 shadow-none p-1 w-full"
                                        required
                                        onKeyDown={(e) =>
                                          handleGuarantorKeyDown(e, row.id)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Fill all fields in a row and press Enter to add a
                            new guarantor
                          </div>
                        </div>

                        {/* Credit Officer Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Credit Officer Details
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="creditofficer"
                                className="text-xs text-right"
                              >
                                Credit Officer:
                              </Label>
                              <Input
                                id="creditofficer"
                                name="creditofficer"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="creditofficercontact"
                                className="text-xs text-right"
                              >
                                Contact No.:
                              </Label>
                              <Input
                                id="creditofficercontact"
                                name="creditofficercontact"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Reference Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Reference Details
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="remarks"
                                className="text-xs text-right"
                              >
                                Remarks:
                              </Label>
                              <Input
                                id="remarks"
                                name="remarks"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="referencename"
                                className="text-xs text-right"
                              >
                                Name:
                              </Label>
                              <Input
                                id="referencename"
                                name="referencename"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="referencecontact"
                                className="text-xs text-right"
                              >
                                Contact No.:
                              </Label>
                              <Input
                                id="referencecontact"
                                name="referencecontact"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Misc Charges Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Misc Charges
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="yesno"
                                className="text-xs text-right"
                              >
                                Yes/No:
                              </Label>
                              <Select name="yesno" required>
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Select Yes or No" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="ownershipindicator"
                                className="text-xs text-right"
                              >
                                Ownership Indicator:
                              </Label>
                              <Input
                                id="ownershipindicator"
                                name="ownershipindicator"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "createmember" && (
                    <>
                      <div className="space-y-3">
                        {/* Member Information Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Membership Alteration Form (Create)
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="enrollmentdate"
                                className="text-xs text-right"
                              >
                                Enrollment Date:
                              </Label>
                              <Input
                                type="date"
                                id="enrollmentdate"
                                name="enrollmentdate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="branch"
                                className="text-xs text-right"
                              >
                                Branch:
                              </Label>
                              <Input
                                id="branch"
                                name="branch"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="memberid"
                                className="text-xs text-right"
                              >
                                Member Id:
                              </Label>
                              <Input
                                id="memberid"
                                name="memberid"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="accounttype"
                                className="text-xs text-right"
                              >
                                Account Type:
                              </Label>
                              <Input
                                id="accounttype"
                                name="accounttype"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membername"
                                className="text-xs text-right"
                              >
                                Member Name:
                              </Label>
                              <Input
                                id="membername"
                                name="membername"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membergroup"
                                className="text-xs text-right"
                              >
                                Member Group:
                              </Label>
                              <Input
                                id="membergroup"
                                name="membergroup"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="uploadphoto-sign"
                                className="text-xs text-right"
                              >
                                Upload Photo/Sign:
                              </Label>
                              <Input
                                id="uploadphoto-sign"
                                name="uploadphoto-sign"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="area"
                                className="text-xs text-right"
                              >
                                Area:
                              </Label>
                              <Input
                                id="area"
                                name="area"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Applicant's Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Applicant's Details
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="name"
                                className="text-xs text-right"
                              >
                                Name (in block letters):
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="fathersname"
                                className="text-xs text-right"
                              >
                                Father's Name:
                              </Label>
                              <Input
                                id="fathersname"
                                name="fathersname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="mothersname"
                                className="text-xs text-right"
                              >
                                Mother's Maiden Name:
                              </Label>
                              <Input
                                id="mothersname"
                                name="mothersname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="dateofbirth"
                                className="text-xs text-right"
                              >
                                Date of Birth:
                              </Label>
                              <Input
                                type="date"
                                id="dateofbirth"
                                name="dateofbirth"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="age"
                                className="text-xs text-right"
                              >
                                Age:
                              </Label>
                              <Input
                                id="age"
                                name="age"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="gender"
                                className="text-xs text-right"
                              >
                                Gender:
                              </Label>
                              <Select name="gender" required>
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Select from below" />
                                </SelectTrigger>
                              </Select>
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="maritalstatus"
                                className="text-xs text-right"
                              >
                                Marital Status:
                              </Label>
                              <Input
                                id="maritalstatus"
                                name="maritalstatus"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="spousename"
                                className="text-xs text-right"
                              >
                                Spouse Name:
                              </Label>
                              <Input
                                id="spousename"
                                name="spousename"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="caste"
                                className="text-xs text-right"
                              >
                                Caste:
                              </Label>
                              <Input
                                id="caste"
                                name="caste"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="religion"
                                className="text-xs text-right"
                              >
                                Religion:
                              </Label>
                              <Input
                                id="religion"
                                name="religion"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="education"
                                className="text-xs text-right"
                              >
                                Education:
                              </Label>
                              <Input
                                id="education"
                                name="education"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="occupation"
                                className="text-xs text-right"
                              >
                                Occupation:
                              </Label>
                              <Input
                                id="occupation"
                                name="occupation"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="email"
                                className="text-xs text-right"
                              >
                                Email:
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="mobile-no"
                                className="text-xs text-right"
                              >
                                Mobile No.:
                              </Label>
                              <Input
                                id="mobile-no"
                                name="mobile-no"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="telephone-no"
                                className="text-xs text-right"
                              >
                                Telephone No.:
                              </Label>
                              <Input
                                id="telephone-no"
                                name="telephone-no"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="pan-no"
                                className="text-xs text-right"
                              >
                                Pan No.:
                              </Label>
                              <Input
                                id="pan-no"
                                name="pan-no"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="aadharcard-no"
                                className="text-xs text-right"
                              >
                                Aadhar Card No:
                              </Label>
                              <Input
                                id="aadharcard-no"
                                name="aadharcard-no"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="gstin"
                                className="text-xs text-right"
                              >
                                GSTIN/UIN:
                              </Label>
                              <Input
                                id="gstin"
                                name="gstin"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="passport-no"
                                className="text-xs text-right"
                              >
                                Passport No.:
                              </Label>
                              <Input
                                id="passport-no"
                                name="passport-no"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="cibilscore"
                                className="text-xs text-right"
                              >
                                Cibil Score:
                              </Label>
                              <Input
                                id="cibilscore"
                                name="cibilscore"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Address Details Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Address Details
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="col-span-2 grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="communicationaddress"
                                className="text-xs text-right"
                              >
                                Communication Address:
                              </Label>
                              <Input
                                id="communicationaddress"
                                name="communicationaddress"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="landmark"
                                className="text-xs text-right"
                              >
                                Landmark:
                              </Label>
                              <Input
                                id="landmark"
                                name="landmark"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="postoffice"
                                className="text-xs text-right"
                              >
                                Post Office:
                              </Label>
                              <Input
                                id="postoffice"
                                name="postoffice"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="policestation"
                                className="text-xs text-right"
                              >
                                Police Station:
                              </Label>
                              <Input
                                id="policestation"
                                name="policestation"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="pincode"
                                className="text-xs text-right"
                              >
                                Pincode:
                              </Label>
                              <Input
                                id="pincode"
                                name="pincode"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="city-district"
                                className="text-xs text-right"
                              >
                                City/District:
                              </Label>
                              <Input
                                id="city-district"
                                name="city-district"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="state-province"
                                className="text-xs text-right"
                              >
                                State/Province:
                              </Label>
                              <Input
                                id="state-province"
                                name="state-province"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="col-span-2 grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="permanentaddress"
                                className="text-xs text-right"
                              >
                                Permanent Address:
                              </Label>
                              <Input
                                id="permanentaddress"
                                name="permanentaddress"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="area"
                                className="text-xs text-right"
                              >
                                Area:
                              </Label>
                              <Input
                                id="area"
                                name="area"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="col-span-2 grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="officeaddress"
                                className="text-xs text-right"
                              >
                                Office Address:
                              </Label>
                              <Input
                                id="officeaddress"
                                name="officeaddress"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "loanapproval" && (
                    <>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Loan Approval Process
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="date"
                                className="text-xs text-right"
                              >
                                Date:
                              </Label>
                              <Input
                                type="date"
                                id="date"
                                name="date"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="branch"
                                className="text-xs text-right"
                              >
                                Branch:
                              </Label>
                              <Input
                                id="branch"
                                name="branch"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="applicantionno"
                                className="text-xs text-right"
                              >
                                Application No:
                              </Label>
                              <Input
                                id="applicantionno"
                                name="applicantionno"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membergroup"
                                className="text-xs text-right"
                              >
                                Member Group:
                              </Label>
                              <Input
                                id="membergroup"
                                name="membergroup"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membername"
                                className="text-xs text-right"
                              >
                                Member Name:
                              </Label>
                              <Input
                                id="membername"
                                name="membername"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="productname"
                                className="text-xs text-right"
                              >
                                Product Name:
                              </Label>
                              <Input
                                id="productname"
                                name="productname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestmethod"
                                className="text-xs text-right"
                              >
                                Interest Method:
                              </Label>
                              <Input
                                id="interestmethod"
                                name="interestmethod"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="rate"
                                className="text-xs text-right"
                              >
                                Rate(%):
                              </Label>
                              <Input
                                id="rate"
                                name="rate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanterm"
                                className="text-xs text-right"
                              >
                                Loan Term:
                              </Label>
                              <Input
                                id="loanterm"
                                name="loanterm"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="repaymentplan"
                                className="text-xs text-right"
                              >
                                Repayment Plan:
                              </Label>
                              <Input
                                id="repaymentplan"
                                name="repaymentplan"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="noofemis"
                                className="text-xs text-right"
                              >
                                No Of EMI's:
                              </Label>
                              <Input
                                id="noofemis"
                                name="noofemis"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanamount"
                                className="text-xs text-right"
                              >
                                Loan Amount:
                              </Label>
                              <Input
                                id="loanamount"
                                name="loanamount"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="objective"
                                className="text-xs text-right"
                              >
                                Objective:
                              </Label>
                              <Input
                                id="objective"
                                name="objective"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "loandisburment" && (
                    <>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Loan Disbursement
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="date"
                                className="text-xs text-right"
                              >
                                Date:
                              </Label>
                              <Input
                                type="date"
                                id="date"
                                name="date"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="branch"
                                className="text-xs text-right"
                              >
                                Branch:
                              </Label>
                              <Input
                                id="branch"
                                name="branch"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membergroup"
                                className="text-xs text-right"
                              >
                                Member Group:
                              </Label>
                              <Input
                                id="membergroup"
                                name="membergroup"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="applicantionno"
                                className="text-xs text-right"
                              >
                                Application No:
                              </Label>
                              <Input
                                id="applicantionno"
                                name="applicantionno"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="memberid"
                                className="text-xs text-right"
                              >
                                Member ID:
                              </Label>
                              <Input
                                id="memberid"
                                name="memberid"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanid"
                                className="text-xs text-right"
                              >
                                Loan ID:
                              </Label>
                              <Input
                                id="loanid"
                                name="loanid"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membername"
                                className="text-xs text-right"
                              >
                                Member Name:
                              </Label>
                              <Input
                                id="membername"
                                name="membername"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="productname"
                                className="text-xs text-right"
                              >
                                Product Name:
                              </Label>
                              <Input
                                id="productname"
                                name="productname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestmethod"
                                className="text-xs text-right"
                              >
                                Interest Method:
                              </Label>
                              <Input
                                id="interestmethod"
                                name="interestmethod"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="interestrate"
                                className="text-xs text-right"
                              >
                                Interest Rate(%):
                              </Label>
                              <Input
                                id="interestrate"
                                name="interestrate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanterm"
                                className="text-xs text-right"
                              >
                                Loan Term:
                              </Label>
                              <Input
                                id="loanterm"
                                name="loanterm"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="noofemis"
                                className="text-xs text-right"
                              >
                                No Of EMI's:
                              </Label>
                              <Input
                                id="noofemis"
                                name="noofemis"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="loanamount"
                                className="text-xs text-right"
                              >
                                Loan Amount:
                              </Label>
                              <Input
                                id="loanamount"
                                name="loanamount"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="disbursedamount"
                                className="text-xs text-right"
                              >
                                Disbursed Amount (Partial):
                              </Label>
                              <Input
                                id="disbursedamount"
                                name="disbursedamount"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="approvaldate"
                                className="text-xs text-right"
                              >
                                Approval Date:
                              </Label>
                              <Input
                                type="date"
                                id="approvaldate"
                                name="approvaldate"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="approvedby"
                                className="text-xs text-right"
                              >
                                Approved By:
                              </Label>
                              <Input
                                id="approvedby"
                                name="approvedby"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="isdisbursed"
                                className="text-xs text-right"
                              >
                                Is Disbursed:
                              </Label>
                              <Input
                                id="isdisbursed"
                                name="isdisbursed"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="postentry"
                                className="text-xs text-right"
                              >
                                Post Entry:
                              </Label>
                              <Input
                                id="postentry"
                                name="postentry"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="datedgen"
                                className="text-xs text-right"
                              >
                                Dated Gen:
                              </Label>
                              <Input
                                id="datedgen"
                                name="datedgen"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="status"
                                className="text-xs text-right"
                              >
                                Status:
                              </Label>
                              <Input
                                id="status"
                                name="status"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "eligibilityofloan" && (
                    <>
                      <div className="space-y-3">
                        {/* Eligibility of Loan Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Eligibility of Loan
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="membername"
                                className="text-xs text-right"
                              >
                                Member Name:
                              </Label>
                              <Input
                                id="membername"
                                name="membername"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="productname"
                                className="text-xs text-right"
                              >
                                Product Name:
                              </Label>
                              <Input
                                id="productname"
                                name="productname"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="tenure"
                                className="text-xs text-right"
                              >
                                Tenure (Months):
                              </Label>
                              <Input
                                id="tenure"
                                name="tenure"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="incomesource"
                                className="text-xs text-right"
                              >
                                Income Source:
                              </Label>
                              <Input
                                id="incomesource"
                                name="incomesource"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="cibilscore"
                                className="text-xs text-right"
                              >
                                CIBIL Score:
                              </Label>
                              <Input
                                id="cibilscore"
                                name="cibilscore"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="ageofborrower"
                                className="text-xs text-right"
                              >
                                Age of Borrower:
                              </Label>
                              <Input
                                id="ageofborrower"
                                name="ageofborrower"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="monthlyincome"
                                className="text-xs text-right"
                              >
                                Monthly Income:
                              </Label>
                              <Input
                                id="monthlyincome"
                                name="monthlyincome"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="pincode"
                                className="text-xs text-right"
                              >
                                Pincode:
                              </Label>
                              <Input
                                id="pincode"
                                name="pincode"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Risk Score Generator Section */}
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                            Risk Score Generator
                          </h2>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="scorerange"
                                className="text-xs text-right"
                              >
                                Score Range:
                              </Label>
                              <Input
                                id="scorerange"
                                name="scorerange"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="roibasedonrange"
                                className="text-xs text-right"
                              >
                                ROI Based On Range:
                              </Label>
                              <Input
                                id="roibasedonrange"
                                name="roibasedonrange"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="category"
                                className="text-xs text-right"
                              >
                                Category:
                              </Label>
                              <Input
                                id="category"
                                name="category"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="maxemicapacity"
                                className="text-xs text-right"
                              >
                                Max EMI Capacity (Monthly):
                              </Label>
                              <Input
                                id="maxemicapacity"
                                name="maxemicapacity"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                            <div className="col-span-2 grid grid-cols-[120px,1fr] gap-2 items-center">
                              <Label
                                htmlFor="totalloaneligibility"
                                className="text-xs text-right"
                              >
                                Total Loan Eligibility basis income:
                              </Label>
                              <Input
                                id="totalloaneligibility"
                                name="totalloaneligibility"
                                className="h-7 text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>

              {/* Right side - Vertical tabs */}
              <div className="w-44 border-l bg-blue-100">
                <div className="sticky top-0 p-4 space-y-1 h-full">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    if (tab.id === "date") {
                      return (
                        <Popover
                          key={tab.id}
                          open={isDatePopoverOpen}
                          onOpenChange={(open) => setIsDatePopoverOpen(open)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant={
                                activeTab === tab.id ? "secondary" : "ghost"
                              }
                              className={`w-full justify-start px-2 py-2 gap-1 ${
                                activeTab === tab.id
                                  ? "bg-white shadow-sm"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                if (activeTab !== "date") setActiveTab("date");
                                setIsDatePopoverOpen(true);
                              }}
                            >
                              <TabIcon className="w-3.5 h-3.5 mr-1 shrink-0" />
                              <span className="min-w-0 flex-1 text-left whitespace-normal break-words text-xs leading-snug">
                                {tab.label}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-auto p-3"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setIsDatePopoverOpen(false);
                                setActiveTab("application");
                              }
                            }}
                          >
                            <div className="mb-2 text-sm font-medium">
                              Current Date
                            </div>
                            <DatePickerCalendar
                              mode="single"
                              selected={currentDate}
                              onSelect={(d) => d && setCurrentDate(d)}
                              initialFocus
                            />
                            <div className="mt-2 text-[11px] text-gray-500">
                              Press Enter to continue to Application
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    }
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "ghost"}
                        className={`w-full justify-start px-2 py-2 gap-1 ${
                          activeTab === tab.id
                            ? "bg-white shadow-sm"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <TabIcon className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span className="min-w-0 flex-1 text-left whitespace-normal break-words text-xs leading-snug">
                          {tab.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>Submit Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loan Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.slice(0, 6).map((loan) => (
          <Card key={loan.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm inline-block  px-2 rounded">
                {loan.loanId}
              </CardTitle>
              <p className="text-xs text-gray-600">{loan.memberName}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{Math.round(getLoanProgress(loan.id))}%</span>
                </div>
                <Progress value={getLoanProgress(loan.id)} className="h-2" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedLoanId(loan.id)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction Steps Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-block  px-2 rounded">
            Transaction Workflow
          </CardTitle>
          <div className="flex items-center space-x-4">
            <select
              className="p-2 border rounded text-sm"
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
            >
              <option value="">All Loans</option>
              {loans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.loanId} - {loan.memberName}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const step = transactionSteps.find(
                  (s) => s.type === transaction.type
                );
                const StepIcon = step?.icon || FileText;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StepIcon className="w-4 h-4" />
                        <span>{transaction.step}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{step?.label}</TableCell>
                    <TableCell>{transaction.loanId}</TableCell>
                    <TableCell>
                      {transaction.amount
                        ? `₹${transaction.amount.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {transaction.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateTransaction(transaction.id, {
                                status: "completed",
                              })
                            }
                          >
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationPage;
