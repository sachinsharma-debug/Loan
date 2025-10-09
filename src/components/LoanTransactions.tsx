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
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Receipt,
  Banknote,
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

interface LoanTransactionsProps {
  loans: Loan[];
  transactions: LoanTransaction[];
  onUpdateTransaction: (id: string, data: Partial<LoanTransaction>) => void;
  onAddTransaction: (transaction: Omit<LoanTransaction, "id">) => void;
}

const LoanTransactions = ({
  loans,
  transactions,
  onUpdateTransaction,
  onAddTransaction,
}: LoanTransactionsProps) => {
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");
  const [newTransaction, setNewTransaction] = useState({
    loanId: "",
    step: 1,
    type: "application" as LoanTransaction["type"],
    amount: 0,
    notes: "",
  });

  const tabs = [
    { id: "date", label: "Date" },
    { id: "company", label: "Company" },
    { id: "application", label: "Application" },
    { id: "createmember", label: "Create Member" },
    { id: "loanapproval", label: "Loan Approval" },
    { id: "loandisburment", label: "Loan Disburment" },
    { id: "eligibilityofloan", label: "Eligibility of Loan" },
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
    onAddTransaction(transactionToAdd);
    setNewTransaction({
      loanId: "",
      step: 1,
      type: "application",
      amount: 0,
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Transactions
          </h1>
          <p className="text-gray-600 mt-2">
            Track loan workflow and transaction steps
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl h-[100vh] flex flex-col p-0">
            <div className="flex flex-1 overflow-hidden">
              {/* Left side - Form content */}
              <div className="flex-1 overflow-y-auto p-6">
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl">
                      Add New Transaction
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
                  {activeTab === "application" && (
                    <>
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold   underline">
                            Loan Application
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="applicantname">
                            Applicant's Name
                          </Label>
                          <Input
                            id="applicantname"
                            name="applicantname"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberid">Member ID</Label>
                          <Input id="memberid" name="memberid" required />
                        </div>
                        <div>
                          <Label htmlFor="emireceipttype">
                            Emi Receipt Type
                          </Label>
                          <Select name="emireceipttype" required>
                            <SelectTrigger>
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
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input type="date" id="date" name="date" required />
                        </div>
                        <div>
                          <Label htmlFor="applicationno">Application No.</Label>
                          <Input
                            id="applicationno"
                            name="applicationno"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="loanobjective">Loan Objective</Label>
                          <Input
                            id="loanobjective"
                            name="loanobjective"
                            required
                          />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 underline">
                            Loan Details
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="loanproduct">Loan Product</Label>
                          <Input id="loanproduct" name="loanproduct" required />
                        </div>
                        <div>
                          <Label htmlFor="interestmethod">
                            Interest Method
                          </Label>
                          <Input
                            id="interestmethod"
                            name="interestmethod"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="interestrate">Interest Rate</Label>
                          <Input
                            id="interestrate"
                            name="interestrate"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="invoicevalue">Invoice Value</Label>
                          <Input
                            id="invoicevalue"
                            name="interestvalue"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="funding">Funding(%)</Label>
                          <Input id="funding" name="funding" required />
                        </div>
                        <div>
                          <Label htmlFor="netloanamount">Net Loan Amount</Label>
                          <Input
                            id="netloanamount"
                            name="netloanamount"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="repaymentplan">Repayment Plan</Label>
                          <Input
                            id="repaymentplan"
                            name="repaymentplan"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="loanterm">Loan Term</Label>
                          <Input id="loanterm" name="loanterm" required />
                        </div>
                        <div>
                          <Label htmlFor="noofemi">No. of EMI</Label>
                          <Input id="noofemi" name="noofemi" required />
                        </div>
                        <div>
                          <Label htmlFor="intereststyle">Interest Style</Label>
                          <Input
                            id="intereststyle"
                            name="intereststyle"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="interestrateperday/month">
                            Interest Rate per Day/Month
                          </Label>
                          <Input
                            id="interestrateperday/month"
                            name="interestrateperday/month"
                            required
                          />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2 underline">
                            Gurantor Details
                          </h2>
                        </div>

                        <div>
                          <Label htmlFor="guarantorfrom">Guarantor From</Label>
                          <Input
                            id="guarantorfrom"
                            name="guarantorfrom"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="id">ID</Label>
                          <Input id="id" name="id" required />
                        </div>
                        <div>
                          <Label htmlFor="relationship">Relationship</Label>
                          <Input
                            id="relationship"
                            name="relationship"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" name="age" required />
                        </div>
                        <div>
                          <Label htmlFor="contactno">Contact No.</Label>
                          <Input id="contactno" name="contactno" required />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" name="address" required />
                        </div>
                        <div>
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" name="occupation" required />
                        </div>
                        <div>
                          <Label htmlFor="income">Income</Label>
                          <Input id="income" name="income" required />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2 underline">
                            Credit Officer Details
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="creditofficer">Credit Officer</Label>
                          <Input
                            id="creditofficer"
                            name="creditofficer"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactno">Contact No.</Label>
                          <Input id="contactno" name="contactno" required />
                        </div>

                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2 underline">
                            Reference Details
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="remarks">Remarks</Label>
                          <Input id="remarks" name="remarks" required />
                        </div>

                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="contactno">Contact No.</Label>
                          <Input id="contactno" name="contactno" required />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2 underline">
                            Misc Charges
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="yesno">Yes/No</Label>
                          <Select name="yesno" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ownershipindicator">
                            Ownership Indicator
                          </Label>
                          <Input
                            id="ownershipindicator"
                            name="ownershipindicator"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "createmember" && (
                    <>
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold   underline">
                            Membership Alteration Form (Create)
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="enrollmentdate">
                            Enrollment Date
                          </Label>
                          <Input
                            type="date"
                            id="enrollmentdate"
                            name="enrollmentdate"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Input id="branch" name="branch" required />
                        </div>
                        <div>
                          <Label htmlFor="memberid">Member Id</Label>
                          <Input id="memberid" name="memberid" required />
                        </div>
                        <div>
                          <Label htmlFor="accounttype">Account Type</Label>
                          <Input id="accounttype" name="accounttype" required />
                        </div>
                        <div>
                          <Label htmlFor="membername">Member Name</Label>
                          <Input id="membername" name="membername" required />
                        </div>
                        <div>
                          <Label htmlFor="membergroup">Member Group</Label>
                          <Input id="membergroup" name="membergroup" required />
                        </div>

                        <div>
                          <Label htmlFor="uploadphoto-sign">
                            Upload Photo/Sign
                          </Label>
                          <Input
                            id="uploadphoto-sign"
                            name="uploadphoto-sign"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="area">Area</Label>
                          <Input id="area" name="area" required />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold">
                            Applicant's Details
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="name">Name (in block letters)</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="fathersname">Father's Name</Label>
                          <Input id="fathersname" name="fathersname" required />
                        </div>
                        <div>
                          <Label htmlFor="mothersname">
                            Mother's Maiden Name
                          </Label>
                          <Input id="mothersname" name="mothersname" required />
                        </div>
                        <div>
                          <Label htmlFor="dateofbirth">Date of Birth</Label>
                          <Input
                            type="date"
                            id="dateofbirth"
                            name="dateofbirth"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" name="age" required />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select name="gender" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from below" />
                            </SelectTrigger>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="maritalstatus">Marital Status</Label>
                          <Input
                            id="maritalstatus"
                            name="maritalstatus"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="spousename">Spouse Name</Label>
                          <Input id="spousename" name="spousename" required />
                        </div>
                        <div>
                          <Label htmlFor="caste">Caste</Label>
                          <Input id="caste" name="caste" required />
                        </div>
                        <div>
                          <Label htmlFor="religion">Religion</Label>
                          <Input id="religion" name="religion" required />
                        </div>
                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Input id="education" name="education" required />
                        </div>
                        <div>
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" name="occupation" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" required />
                        </div>
                        <div>
                          <Label htmlFor="mobile-no">Mobile No.</Label>
                          <Input id="mobile-no" name="mobile-no" required />
                        </div>
                        <div>
                          <Label htmlFor="telephone-no">Telephone No.</Label>
                          <Input
                            id="telephone-no"
                            name="telephone-no"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pan-no">Pan No.</Label>
                          <Input id="pan-no" name="pan-no" required />
                        </div>
                        <div>
                          <Label htmlFor="aadharcard-no">Aadhar Card No</Label>
                          <Input
                            id="aadharcard-no"
                            name="aadharcard-no"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="gstin">GSTIN/UIN</Label>
                          <Input id="gstin" name="gstin" required />
                        </div>
                        <div>
                          <Label htmlFor="passport-no">Passport No.</Label>
                          <Input id="passport-no" name="passport-no" required />
                        </div>
                        <div>
                          <Label htmlFor="cibilscore">Cibil Score</Label>
                          <Input id="cibilscore" name="cibilscore" required />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="communicationaddress">
                            Communication Address
                          </Label>
                          <Input
                            id="communicationaddress"
                            name="communicationaddress"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="landmark">Landmark</Label>
                          <Input id="landmark" name="landmark" required />
                        </div>

                        <div>
                          <Label htmlFor="postoffice">Post Office</Label>
                          <Input id="postoffice" name="postoffice" required />
                        </div>
                        <div>
                          <Label htmlFor="policestation">Police Station</Label>
                          <Input
                            id="policestation"
                            name="policestation"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="pincode" required />
                        </div>

                        <div>
                          <Label htmlFor="city-district">City/District</Label>
                          <Input
                            id="city-district"
                            name="city-district"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state-province">State/Province</Label>
                          <Input
                            id="state-province"
                            name="state-province"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="permanentaddress">
                            Permanent Address
                          </Label>
                          <Input
                            id="permanentaddress"
                            name="permanentaddress"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="area">Area</Label>
                          <Input id="area" name="area" required />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="pincode" required />
                        </div>
                        <div>
                          <Label htmlFor="city-district">City/District</Label>
                          <Input
                            id="city-district"
                            name="city-district"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state-province">State/Province</Label>
                          <Input
                            id="state-province"
                            name="state-province"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="officeaddress">Office Address</Label>
                          <Input
                            id="officeaddress"
                            name="officeaddress"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "loanapproval" && (
                    <>
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2">
                            Loan Approval Process
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input type="date" id="date" name="date" required />
                        </div>
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Input id="branch" name="branch" required />
                        </div>
                        <div>
                          <Label htmlFor="applicantionno">
                            Applicantion No
                          </Label>
                          <Input
                            id="applicantionno"
                            name="applicantionno"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="membergroup">Member Group</Label>
                          <Input id="membergroup" name="membergroup" required />
                        </div>
                        <div>
                          <Label htmlFor="membername">Member Name</Label>
                          <Input id="membername" name="membername" required />
                        </div>
                        <div>
                          <Label htmlFor="productname">Product Name</Label>
                          <Input id="productname" name="productname" required />
                        </div>
                        <div>
                          <Label htmlFor="interestmethod">
                            Interest Method
                          </Label>
                          <Input
                            id="interestmethod"
                            name="interestmethod"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rate">Rate(%)</Label>
                          <Input id="rate" name="rate" required />
                        </div>
                        <div>
                          <Label htmlFor="loanterm">Loan Term</Label>
                          <Input id="loanterm" name="loanterm" required />
                        </div>
                        <div>
                          <Label htmlFor="repaymentplan">Repayment Plan</Label>
                          <Input
                            id="repaymentplan"
                            name="repaymentplan"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="noofemis">No Of EMI's</Label>
                          <Input id="noofemis" name="noofemis" required />
                        </div>
                        <div>
                          <Label htmlFor="loanamount">Loan Amount</Label>
                          <Input id="loanamount" name="loanamount" required />
                        </div>
                        <div>
                          <Label htmlFor="objective">Objective</Label>
                          <Input id="objective" name="objective" required />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "loandisburment" && (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4">
                          <h2 className="text-lg font-semibold mb-2 mt-2">
                            Loan Disburment
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input type="date" id="date" name="date" required />
                        </div>
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Input id="branch" name="branch" required />
                        </div>
                        <div>
                          <Label htmlFor="membergroup">Member Group</Label>
                          <Input id="membergroup" name="membergroup" required />
                        </div>
                        <div>
                          <Label htmlFor="applicantionno">
                            Applicantion No
                          </Label>
                          <Input
                            id="applicantionno"
                            name="applicantionno"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberid">Member ID</Label>
                          <Input id="memberid" name="memberid" required />
                        </div>
                        <div>
                          <Label htmlFor="loanid">Loan ID</Label>
                          <Input id="loanid" name="loanid" required />
                        </div>

                        <div>
                          <Label htmlFor="membername">Member Name</Label>
                          <Input id="membername" name="membername" required />
                        </div>
                        <div>
                          <Label htmlFor="productname">Product Name</Label>
                          <Input id="productname" name="productname" required />
                        </div>
                        <div>
                          <Label htmlFor="interestmethod">
                            Interest Method
                          </Label>
                          <Input
                            id="interestmethod"
                            name="interestmethod"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="interestrate">Interest Rate(%)</Label>
                          <Input
                            id="interestrate"
                            name="interestrate"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="loanterm">Loan Term</Label>
                          <Input id="loanterm" name="loanterm" required />
                        </div>
                        <div>
                          <Label htmlFor="noofemis">No Of EMI's</Label>
                          <Input id="noofemis" name="noofemis" required />
                        </div>
                        <div>
                          <Label htmlFor="loanamount">Loan Amount</Label>
                          <Input id="loanamount" name="loanamount" required />
                        </div>
                        <div>
                          <Label htmlFor="disbursedamount">
                            Disbursed Amount (Partial)
                          </Label>
                          <Input
                            id="disbursedamount"
                            name="disbursedamount"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="approvaldate">Approval Date</Label>
                          <Input
                            type="date"
                            id="approvaldate"
                            name="approvaldate"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="approvedby">Approved By</Label>
                          <Input id="approvedby" name="approvedby" required />
                        </div>
                        <div>
                          <Label htmlFor="isdisbursed">Is Disbursed </Label>
                          <Input id="isdisbursed" name="isdisbursed" required />
                        </div>
                        <div>
                          <Label htmlFor="postentry">Post Entry</Label>
                          <Input id="postentry" name="postentry" required />
                        </div>
                        <div>
                          <Label htmlFor="datedgen">Dated Gen</Label>
                          <Input id="datedgen" name="datedgen" required />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Input id="status" name="status" required />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "eligibilityofloan" && (
                    <>
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold mb-2 mt-2">
                            Eligibility of Loan
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="membername">Member Name</Label>
                          <Input id="membername" name="membername" required />
                        </div>
                        <div>
                          <Label htmlFor="productname">Product Name</Label>
                          <Input id="productname" name="productname" required />
                        </div>
                        <div>
                          <Label htmlFor="tenure">Tenure (Months)</Label>
                          <Input id="tenure" name="tenure" required />
                        </div>
                        <div>
                          <Label htmlFor="incomesource">Income Source</Label>
                          <Input
                            id="incomesource"
                            name="incomesource"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cibilscore">CIBIL Score</Label>
                          <Input id="cibilscore" name="cibilscore" required />
                        </div>
                        <div>
                          <Label htmlFor="ageofborrower">Age of Borrower</Label>
                          <Input
                            id="ageofborrower"
                            name="ageofborrower"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthlyincome">Monthly Income</Label>
                          <Input
                            id="monthlyincome"
                            name="monthlyincome"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="pincode" required />
                        </div>
                        <div className="col-span-6">
                          <h2 className="text-lg font-semibold">
                            Risk score generator
                          </h2>
                        </div>
                        <div>
                          <Label htmlFor="scorerange">Score Range</Label>
                          <Input id="scorerange" name="scorerange" required />
                        </div>
                        <div>
                          <Label htmlFor="roibasedonrange">
                            ROI Based On Range
                          </Label>
                          <Input
                            id="roibasedonrange"
                            name="roibasedonrange"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" name="category" required />
                        </div>
                        <div>
                          <Label htmlFor="maxemicapacity">
                            Max EMI Capacity (Monthly)
                          </Label>
                          <Input
                            id="maxemicapacity"
                            name="maxemicapacity"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalloaneligibility">
                            Total Loan Eligibility basis income :
                          </Label>
                          <Input
                            id="totalloaneligibility"
                            name="totalloaneligibility"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>

              {/* Right side - Vertical tabs */}
              <div className="w-56 border-l bg-blue-100">
                <div className="sticky top-0 p-4 space-y-1 h-full">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === tab.id
                          ? "bg-white shadow-sm"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </Button>
                  ))}
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
              <Button onClick={handleAddTransaction}>Add Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loan Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.slice(0, 6).map((loan) => (
          <Card key={loan.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{loan.loanId}</CardTitle>
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
          <CardTitle>Transaction Workflow</CardTitle>
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
                              onUpdateTransaction(transaction.id, {
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

export default LoanTransactions;
