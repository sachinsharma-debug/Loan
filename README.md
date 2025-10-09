import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import {
Eye,
Edit,
Plus,
User,
FileText,
CheckCircle,
Banknote,
CreditCard,
DollarSign,
FileCheck,
Shield,
Users,
Home,
Folder,
} from "lucide-react";
import { Member } from "@/types";

type MemberProps = {
members: Member[];
onAddMember: (data: any) => void;
onUpdateMember: (id: string, data: any) => void;
};

const MemberComponent = ({
members,
onAddMember,
onUpdateMember,
}: MemberProps) => {
const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
const [editingItem, setEditingItem] = useState<Member | null>(null);
const [viewingItem, setViewingItem] = useState<Member | null>(null);
const [activeTab, setActiveTab] = useState("addmember");
const [guarantorRows, setGuarantorRows] = useState([{ id: 1 }]);

// Loan Info table data
type LoanInfo = {
id: number;
date: string;
loanProduct: string;
loanObjective: string;
status: "pending" | "reject" | "close" | "matured";
description?: string;
};
const [loanInfos] = useState<LoanInfo[]>([]);

const getLoanStatusBadge = (status: LoanInfo["status"]) => {
const colors: Record<LoanInfo["status"], string> = {
pending: "bg-yellow-100 text-yellow-800",
reject: "bg-red-100 text-red-800",
close: "bg-gray-100 text-gray-800",
matured: "bg-green-100 text-green-800",
};
const label = status.charAt(0).toUpperCase() + status.slice(1);
return <Badge className={colors[status]}>{label}</Badge>;
};

// Address state
const [commAddress, setCommAddress] = useState({
address: "",
country: "",
state: "",
district: "",
city: "",
pincode: "",
postoffice: "",
landmark: "",
});

const [permAddress, setPermAddress] = useState({
address: "",
country: "",
state: "",
district: "",
city: "",
pincode: "",
postoffice: "",
landmark: "",
});

const [sameAsComm, setSameAsComm] = useState(false);

useEffect(() => {
if (sameAsComm) {
setPermAddress(commAddress);
}
}, [sameAsComm, commAddress]);

// Applicant info state
const [maritalStatus, setMaritalStatus] = useState<string | undefined>(
undefined
);
const [spouseName, setSpouseName] = useState<string>("");

useEffect(() => {
// Clear spouse name whenever marital status is not 'married'
if (maritalStatus !== "married" && spouseName !== "") {
setSpouseName("");
}
}, [maritalStatus]);

// Occupation dialog state (mirrors Guarantor behavior)
const [isOccupationDialogOpen, setIsOccupationDialogOpen] = useState(false);
const [employmentType, setEmploymentType] = useState("");
const [occupationValue, setOccupationValue] = useState("");
const [isOccupationFilled, setIsOccupationFilled] = useState(false);
const [editingOccupationData, setEditingOccupationData] = useState<any>(null);
const [employmentInfo, setEmploymentInfo] = useState<any>(null);

const handleOccupationDialogClose = (open: boolean) => {
setIsOccupationDialogOpen(open);
if (!open) {
setEmploymentType("");
setEditingOccupationData(null);
}
};

const handleOccupationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const formData = new FormData(e.currentTarget);
const empType = formData.get("employmentType") as string;
const positionOrDesignation =
(empType === "self-employed"
? (formData.get("designation") as string)
: (formData.get("position") as string)) || "";

    let occupation = "";
    if (empType === "self-employed") {
      occupation = `Self Employed - ${positionOrDesignation || "Business"}`;
    } else if (empType === "salaried") {
      occupation = `Salaried - ${positionOrDesignation || "Employee"}`;
    } else if (empType === "self-employed-professional") {
      occupation = `Self Employed Professional - ${
        positionOrDesignation || "Professional"
      }`;
    } else if (empType === "others") {
      occupation = `Others - ${positionOrDesignation || "Worker"}`;
    }

    setOccupationValue(occupation);
    setIsOccupationFilled(true);
    setIsOccupationDialogOpen(false);
    setEmploymentType("");

    // Store detailed info to submit with the form via hidden inputs
    const nextInfo: Record<string, any> = { employmentType: empType };
    if (empType === "self-employed") {
      nextInfo.name = (formData.get("name") as string) || "";
      nextInfo.address = (formData.get("address") as string) || "";
      nextInfo.designation = (formData.get("designation") as string) || "";
      nextInfo["trade-license-no"] =
        (formData.get("trade-license-no") as string) || "";
      nextInfo.years = (formData.get("years") as string) || "0";
      nextInfo["annual-income"] =
        (formData.get("annual-income") as string) || "";
      nextInfo["monthly-income"] =
        (formData.get("monthly-income") as string) || "";
      nextInfo.description = (formData.get("description") as string) || "";
    } else if (empType) {
      nextInfo["employer-name"] =
        (formData.get("employer-name") as string) || "";
      nextInfo["employer-address"] =
        (formData.get("employer-address") as string) || "";
      nextInfo.position = (formData.get("position") as string) || "";
      nextInfo["employment-number"] =
        (formData.get("employment-number") as string) || "";
      nextInfo["years-with-employer"] =
        (formData.get("years-with-employer") as string) || "0";
      nextInfo["annual-salary"] =
        (formData.get("annual-salary") as string) || "";
      nextInfo["monthly-salary"] =
        (formData.get("monthly-salary") as string) || "";
      nextInfo.description = (formData.get("description") as string) || "";
    }
    setEmploymentInfo(nextInfo);

};

const handleResetOccupation = () => {
setOccupationValue("");
setIsOccupationFilled(false);
setEmploymentInfo(null);
};

const tabs = [
{ id: "loaninfo", label: "Loan Info", icon: Banknote },
{ id: "addmember", label: "Add Member", icon: User },
{ id: "loan-application", label: "Loan Application", icon: FileText },
{ id: "loan-approval", label: "Loan Approval", icon: CheckCircle },
{ id: "loan-disburment", label: "Loan Disbursement", icon: Banknote },
{ id: "kyc", label: "KYC", icon: Shield },
// { id: "charges", label: "Charges", icon: DollarSign },
// { id: "other-documents", label: "Other Documents", icon: FileCheck },
// { id: "collateral", label: "Collateral", icon: CreditCard },
// { id: "occupation", label: "Occupation", icon: Folder },
// { id: "nominee", label: "Nominee", icon: Users },
// { id: "family", label: "Family", icon: Users },
// { id: "household", label: "Household", icon: Home },
];

const handleEdit = (item: Member) => {
setEditingItem(item);
setIsEditDialogOpen(true);
};

const handleView = (item: Member) => {
setViewingItem(item);
setIsViewDialogOpen(true);
};

const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
if (!editingItem) return;
const formData = new FormData(e.currentTarget);
onUpdateMember(editingItem.id, Object.fromEntries(formData.entries()));
setIsEditDialogOpen(false);
setEditingItem(null);
};

const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const formData = new FormData(e.currentTarget);
onAddMember(Object.fromEntries(formData.entries()));
setIsAddDialogOpen(false);
};

const addNewGuarantorRow = () => {
const newRow = { id: guarantorRows.length + 1 };
setGuarantorRows([...guarantorRows, newRow]);
};

const handleGuarantorKeyDown = (e: React.KeyboardEvent, rowId: number) => {
if (e.key === "Enter") {
e.preventDefault();
const currentRow = e.currentTarget.closest("tr");
if (currentRow && rowId === guarantorRows.length) {
const inputs = currentRow.querySelectorAll("input");
const allFilled = Array.from(inputs).every(
(input) => input.value.trim() !== ""
);
if (allFilled) {
addNewGuarantorRow();
}
}
}
};

return (
<div className="p-6 space-y-6">
<div className="flex justify-between items-center">
<div>
<h1 className="text-3xl font-bold text-gray-900">Member</h1>
<p className="text-gray-600 mt-2">Manage Members</p>
</div>
</div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Member</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>

              {/* Styled like LoanTransactions: left content, right vertical tabs */}
              <DialogContent className="max-w-5xl h-[100vh] flex flex-col p-0">
                <div className="flex flex-1 overflow-hidden">
                  {/* Left side - Form content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <DialogHeader className="mb-4">
                      <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl">
                          Create Membership
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

                    <form
                      id="memberForm"
                      onSubmit={handleAddSubmit}
                      className="space-y-6"
                    >
                      {activeTab === "loaninfo" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Loan Info
                              </h2>
                            </div>

                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-16">
                                      Sl.No
                                    </TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Loan Product</TableHead>
                                    <TableHead>Loan Objective</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                      Action
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {loanInfos.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={7}
                                        className="text-center text-xs text-gray-500"
                                      >
                                        No loan records yet.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    loanInfos.map((loan, idx) => (
                                      <TableRow key={loan.id}>
                                        <TableCell className="font-medium">
                                          {idx + 1}
                                        </TableCell>
                                        <TableCell>{loan.date}</TableCell>
                                        <TableCell>
                                          {loan.loanProduct}
                                        </TableCell>
                                        <TableCell>
                                          {loan.loanObjective}
                                        </TableCell>
                                        <TableCell>
                                          {getLoanStatusBadge(loan.status)}
                                        </TableCell>
                                        <TableCell>
                                          {loan.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              type="button"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              type="button"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "addmember" && (
                        <>
                          <div className="space-y-3">
                            {/* Member Information Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Member Information
                              </h2>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                                    htmlFor="salesman"
                                    className="text-xs text-right"
                                  >
                                    Sales Man:
                                  </Label>
                                  <Input
                                    id="salesman"
                                    name="salesman"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="reference"
                                    className="text-xs text-right"
                                  >
                                    Reference:
                                  </Label>
                                  <Input
                                    id="reference"
                                    name="reference"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Applicant's Info Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Applicant's Info
                              </h2>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="maritalstatus"
                                    className="text-xs text-right"
                                  >
                                    Marital Status:
                                  </Label>
                                  <Select
                                    name="maritalstatus"
                                    required
                                    onValueChange={setMaritalStatus}
                                    value={maritalStatus}
                                  >
                                    <SelectTrigger
                                      className="h-7 text-xs"
                                      id="maritalstatus"
                                      aria-label="Marital Status"
                                    >
                                      <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="not_applicable">
                                        ♦ Not Applicable
                                      </SelectItem>
                                      <SelectItem value="divorced">
                                        Divorced
                                      </SelectItem>
                                      <SelectItem value="married">
                                        Married
                                      </SelectItem>
                                      <SelectItem value="separated">
                                        Separated
                                      </SelectItem>
                                      <SelectItem value="unmarried">
                                        Unmarried
                                      </SelectItem>
                                      <SelectItem value="widowed">
                                        Widowed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
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
                                    value={spouseName}
                                    onChange={(e) =>
                                      setSpouseName(e.target.value)
                                    }
                                    required={maritalStatus === "married"}
                                    disabled={maritalStatus !== "married"}
                                  />
                                  {maritalStatus !== "married" && (
                                    <input
                                      type="hidden"
                                      name="spousename"
                                      value=""
                                    />
                                  )}
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
                                <div className="grid grid-cols-[120px,1fr,auto] gap-2 items-center">
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
                                    value={occupationValue}
                                    onChange={(e) => {
                                      if (!isOccupationFilled) {
                                        setOccupationValue(e.target.value);
                                      }
                                    }}
                                    readOnly={isOccupationFilled}
                                    style={{
                                      backgroundColor: isOccupationFilled
                                        ? "#f3f4f6"
                                        : undefined,
                                      cursor: isOccupationFilled
                                        ? "not-allowed"
                                        : undefined,
                                    }}
                                    required
                                  />
                                  {!isOccupationFilled && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs"
                                      onClick={() =>
                                        setIsOccupationDialogOpen(true)
                                      }
                                    >
                                      Add Occupation
                                    </Button>
                                  )}
                                </div>
                                {/* Hidden fields to carry employment info with form submit */}
                                {employmentInfo && (
                                  <>
                                    <input
                                      type="hidden"
                                      name="employmentType"
                                      value={
                                        employmentInfo.employmentType || ""
                                      }
                                    />
                                    {/* Salaried/others */}
                                    <input
                                      type="hidden"
                                      name="employer-name"
                                      value={
                                        employmentInfo["employer-name"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="employer-address"
                                      value={
                                        employmentInfo["employer-address"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="position"
                                      value={employmentInfo.position || ""}
                                    />
                                    <input
                                      type="hidden"
                                      name="employment-number"
                                      value={
                                        employmentInfo["employment-number"] ||
                                        ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="years-with-employer"
                                      value={
                                        employmentInfo["years-with-employer"] ||
                                        ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="annual-salary"
                                      value={
                                        employmentInfo["annual-salary"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="monthly-salary"
                                      value={
                                        employmentInfo["monthly-salary"] || ""
                                      }
                                    />
                                    {/* Self employed */}
                                    <input
                                      type="hidden"
                                      name="name"
                                      value={employmentInfo.name || ""}
                                    />
                                    <input
                                      type="hidden"
                                      name="address"
                                      value={employmentInfo.address || ""}
                                    />
                                    <input
                                      type="hidden"
                                      name="designation"
                                      value={employmentInfo.designation || ""}
                                    />
                                    <input
                                      type="hidden"
                                      name="trade-license-no"
                                      value={
                                        employmentInfo["trade-license-no"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="years"
                                      value={employmentInfo.years || ""}
                                    />
                                    <input
                                      type="hidden"
                                      name="annual-income"
                                      value={
                                        employmentInfo["annual-income"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="monthly-income"
                                      value={
                                        employmentInfo["monthly-income"] || ""
                                      }
                                    />
                                    <input
                                      type="hidden"
                                      name="description"
                                      value={employmentInfo.description || ""}
                                    />
                                  </>
                                )}
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
                                {/* <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
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
                                </div> */}
                              </div>
                            </div>

                            {/* Address Details Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Address Details
                              </h2>
                              {/* Side-by-side layout with a thin vertical divider */}
                              <div className="flex items-start gap-6">
                                {/* Communication Address */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">
                                      Communication Address
                                    </h3>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <Label
                                        htmlFor="communicationaddress"
                                        className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                      >
                                        Address:
                                      </Label>
                                      <Textarea
                                        id="communicationaddress"
                                        name="communicationaddress"
                                        className="text-xs flex-1 min-h-[80px]"
                                        value={commAddress.address}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            address: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="country"
                                        className="text-xs text-right"
                                      >
                                        Country:
                                      </Label>
                                      <Input
                                        id="country"
                                        name="country"
                                        className="h-7 text-xs"
                                        value={commAddress.country}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            country: e.target.value,
                                          })
                                        }
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
                                        value={commAddress.state}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            state: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="district"
                                        className="text-xs text-right"
                                      >
                                        District:
                                      </Label>
                                      <Input
                                        id="district"
                                        name="district"
                                        className="h-7 text-xs"
                                        value={commAddress.district}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            district: e.target.value,
                                          })
                                        }
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
                                        value={commAddress.city}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            city: e.target.value,
                                          })
                                        }
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
                                        value={commAddress.pincode}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            pincode: e.target.value,
                                          })
                                        }
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
                                        value={commAddress.postoffice}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            postoffice: e.target.value,
                                          })
                                        }
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
                                        value={commAddress.landmark}
                                        onChange={(e) =>
                                          setCommAddress({
                                            ...commAddress,
                                            landmark: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Vertical divider */}
                                <div
                                  className="w-px bg-gray-200 self-stretch"
                                  aria-hidden="true"
                                />

                                {/* Permanent Address */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">
                                      Permanent Address
                                    </h3>
                                    <label className="flex items-center gap-2 text-xs select-none ml-4">
                                      <Checkbox
                                        id="sameAsComm"
                                        checked={sameAsComm}
                                        onCheckedChange={(v: boolean) =>
                                          setSameAsComm(!!v)
                                        }
                                      />
                                      <span>Same as Communication Address</span>
                                    </label>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <Label
                                        htmlFor="permanentaddress"
                                        className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                      >
                                        Address:
                                      </Label>
                                      <Textarea
                                        id="permanentaddress"
                                        name="permanentaddress"
                                        className="text-xs flex-1 min-h-[80px]"
                                        value={permAddress.address}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            address: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_country"
                                        className="text-xs text-right"
                                      >
                                        Country:
                                      </Label>
                                      <Input
                                        id="perm_country"
                                        name="perm_country"
                                        className="h-7 text-xs"
                                        value={permAddress.country}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            country: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_state"
                                        className="text-xs text-right"
                                      >
                                        State:
                                      </Label>
                                      <Input
                                        id="perm_state"
                                        name="perm_state"
                                        className="h-7 text-xs"
                                        value={permAddress.state}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            state: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_district"
                                        className="text-xs text-right"
                                      >
                                        District:
                                      </Label>
                                      <Input
                                        id="perm_district"
                                        name="perm_district"
                                        className="h-7 text-xs"
                                        value={permAddress.district}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            district: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_city"
                                        className="text-xs text-right"
                                      >
                                        City:
                                      </Label>
                                      <Input
                                        id="perm_city"
                                        name="perm_city"
                                        className="h-7 text-xs"
                                        value={permAddress.city}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            city: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_pincode"
                                        className="text-xs text-right"
                                      >
                                        Pincode:
                                      </Label>
                                      <Input
                                        id="perm_pincode"
                                        name="perm_pincode"
                                        className="h-7 text-xs"
                                        value={permAddress.pincode}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            pincode: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_postoffice"
                                        className="text-xs text-right"
                                      >
                                        Post Office:
                                      </Label>
                                      <Input
                                        id="perm_postoffice"
                                        name="perm_postoffice"
                                        className="h-7 text-xs"
                                        value={permAddress.postoffice}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            postoffice: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>
                                    <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                      <Label
                                        htmlFor="perm_landmark"
                                        className="text-xs text-right"
                                      >
                                        Landmark:
                                      </Label>
                                      <Input
                                        id="perm_landmark"
                                        name="perm_landmark"
                                        className="h-7 text-xs"
                                        value={permAddress.landmark}
                                        onChange={(e) =>
                                          setPermAddress({
                                            ...permAddress,
                                            landmark: e.target.value,
                                          })
                                        }
                                        required
                                        disabled={sameAsComm}
                                      />
                                    </div>

                                    {/* Hidden fields to include permanent address when sameAsComm is enabled */}
                                    {sameAsComm && (
                                      <div className="hidden">
                                        <input
                                          type="hidden"
                                          name="permanentaddress"
                                          value={commAddress.address}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_country"
                                          value={commAddress.country}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_state"
                                          value={commAddress.state}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_district"
                                          value={commAddress.district}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_city"
                                          value={commAddress.city}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_pincode"
                                          value={commAddress.pincode}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_postoffice"
                                          value={commAddress.postoffice}
                                        />
                                        <input
                                          type="hidden"
                                          name="perm_landmark"
                                          value={commAddress.landmark}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "loan-application" && (
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
                                    htmlFor="memberid2"
                                    className="text-xs text-right"
                                  >
                                    Member ID:
                                  </Label>
                                  <Input
                                    id="memberid2"
                                    name="memberid2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="emireceipttype"
                                    className="text-xs text-right"
                                  >
                                    Emi Receipt Type:
                                  </Label>
                                  <Select name="emireceipttype" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Select EMI Receipt Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cash">Cash</SelectItem>
                                      <SelectItem value="cheque">
                                        Cheque
                                      </SelectItem>
                                      <SelectItem value="ecs">ECS</SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
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
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="interestrateper"
                                    className="text-xs text-right"
                                  >
                                    Interest Rate per Day/Month:
                                  </Label>
                                  <Input
                                    id="interestrateper"
                                    name="interestrateper"
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
                                Fill all fields in a row and press Enter to add
                                a new guarantor
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
                                    htmlFor="co_contactno"
                                    className="text-xs text-right"
                                  >
                                    Contact No.:
                                  </Label>
                                  <Input
                                    id="co_contactno"
                                    name="co_contactno"
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
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="remarks"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Remarks:
                                  </Label>
                                  <Textarea
                                    id="remarks"
                                    name="remarks"
                                    className="text-xs flex-1 min-h-[80px]"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="rname"
                                    className="text-xs text-right"
                                  >
                                    Name:
                                  </Label>
                                  <Input
                                    id="rname"
                                    name="rname"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="rcontactno"
                                    className="text-xs text-right"
                                  >
                                    Contact No.:
                                  </Label>
                                  <Input
                                    id="rcontactno"
                                    name="rcontactno"
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

                            {/* Vehicle Details Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Vehicle Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vehiclemake"
                                    className="text-xs text-right"
                                  >
                                    Vehicle Make:
                                  </Label>
                                  <Input
                                    id="vehiclemake"
                                    name="vehiclemake"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vehiclemodel"
                                    className="text-xs text-right"
                                  >
                                    Vehicle Model:
                                  </Label>
                                  <Input
                                    id="vehiclemodel"
                                    name="vehiclemodel"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vehicletype"
                                    className="text-xs text-right"
                                  >
                                    Vehicle Type:
                                  </Label>
                                  <Input
                                    id="vehicletype"
                                    name="vehicletype"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vehicleno"
                                    className="text-xs text-right"
                                  >
                                    Vehicle No:
                                  </Label>
                                  <Input
                                    id="vehicleno"
                                    name="vehicleno"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="engineno"
                                    className="text-xs text-right"
                                  >
                                    Engine No:
                                  </Label>
                                  <Input
                                    id="engineno"
                                    name="engineno"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="chassisno"
                                    className="text-xs text-right"
                                  >
                                    Chassis No:
                                  </Label>
                                  <Input
                                    id="chassisno"
                                    name="chassisno"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="color"
                                    className="text-xs text-right"
                                  >
                                    Color:
                                  </Label>
                                  <Input
                                    id="color"
                                    name="color"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="fitnessupto"
                                    className="text-xs text-right"
                                  >
                                    Fitness Upto (Date):
                                  </Label>
                                  <Input
                                    type="date"
                                    id="fitnessupto"
                                    name="fitnessupto"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permitupto"
                                    className="text-xs text-right"
                                  >
                                    Permit Upto (Date):
                                  </Label>
                                  <Input
                                    type="date"
                                    id="permitupto"
                                    name="permitupto"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="yearofmanufacturing"
                                    className="text-xs text-right"
                                  >
                                    Year Of Manufacturing:
                                  </Label>
                                  <Input
                                    id="yearofmanufacturing"
                                    name="yearofmanufacturing"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="roadtax"
                                    className="text-xs text-right"
                                  >
                                    Road Tax:
                                  </Label>
                                  <Input
                                    id="roadtax"
                                    name="roadtax"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="permitdetails"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Permit Details:
                                  </Label>
                                  <Textarea
                                    id="permitdetails"
                                    name="permitdetails"
                                    className="text-xs flex-1 min-h-[80px]"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "loan-approval" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Loan Approval Process
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="date2"
                                    className="text-xs text-right"
                                  >
                                    Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="date2"
                                    name="date2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="branch2"
                                    className="text-xs text-right"
                                  >
                                    Branch:
                                  </Label>
                                  <Input
                                    id="branch2"
                                    name="branch2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="applicantionno"
                                    className="text-xs text-right"
                                  >
                                    Applicantion No:
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
                                    htmlFor="membergroup2"
                                    className="text-xs text-right"
                                  >
                                    Member Group:
                                  </Label>
                                  <Input
                                    id="membergroup2"
                                    name="membergroup2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="membername2"
                                    className="text-xs text-right"
                                  >
                                    Member Name:
                                  </Label>
                                  <Input
                                    id="membername2"
                                    name="membername2"
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
                                    htmlFor="interestmethod2"
                                    className="text-xs text-right"
                                  >
                                    Interest Method:
                                  </Label>
                                  <Input
                                    id="interestmethod2"
                                    name="interestmethod2"
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
                                    htmlFor="loanterm2"
                                    className="text-xs text-right"
                                  >
                                    Loan Term:
                                  </Label>
                                  <Input
                                    id="loanterm2"
                                    name="loanterm2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="repaymentplan2"
                                    className="text-xs text-right"
                                  >
                                    Repayment Plan:
                                  </Label>
                                  <Input
                                    id="repaymentplan2"
                                    name="repaymentplan2"
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

                      {activeTab === "loan-disburment" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Loan Disbursement
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="date3"
                                    className="text-xs text-right"
                                  >
                                    Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="date3"
                                    name="date3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="branch3"
                                    className="text-xs text-right"
                                  >
                                    Branch:
                                  </Label>
                                  <Input
                                    id="branch3"
                                    name="branch3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="membergroup3"
                                    className="text-xs text-right"
                                  >
                                    Member Group:
                                  </Label>
                                  <Input
                                    id="membergroup3"
                                    name="membergroup3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="applicantionno2"
                                    className="text-xs text-right"
                                  >
                                    Applicantion No:
                                  </Label>
                                  <Input
                                    id="applicantionno2"
                                    name="applicantionno2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="memberid3"
                                    className="text-xs text-right"
                                  >
                                    Member ID:
                                  </Label>
                                  <Input
                                    id="memberid3"
                                    name="memberid3"
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
                                    htmlFor="membername3"
                                    className="text-xs text-right"
                                  >
                                    Member Name:
                                  </Label>
                                  <Input
                                    id="membername3"
                                    name="membername3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="productname2"
                                    className="text-xs text-right"
                                  >
                                    Product Name:
                                  </Label>
                                  <Input
                                    id="productname2"
                                    name="productname2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="interestmethod3"
                                    className="text-xs text-right"
                                  >
                                    Interest Method:
                                  </Label>
                                  <Input
                                    id="interestmethod3"
                                    name="interestmethod3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="interestrate3"
                                    className="text-xs text-right"
                                  >
                                    Interest Rate(%):
                                  </Label>
                                  <Input
                                    id="interestrate3"
                                    name="interestrate3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="loanterm3"
                                    className="text-xs text-right"
                                  >
                                    Loan Term:
                                  </Label>
                                  <Input
                                    id="loanterm3"
                                    name="loanterm3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="noofemis2"
                                    className="text-xs text-right"
                                  >
                                    No Of EMI's:
                                  </Label>
                                  <Input
                                    id="noofemis2"
                                    name="noofemis2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="loanamount2"
                                    className="text-xs text-right"
                                  >
                                    Loan Amount:
                                  </Label>
                                  <Input
                                    id="loanamount2"
                                    name="loanamount2"
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

                      {activeTab === "kyc" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                KYC Documents
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="kycdocuments"
                                    className="text-xs text-right"
                                  >
                                    KYC Documents:
                                  </Label>
                                  <Select name="kycdocuments" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Select Document Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="drivinglicence">
                                        Driving Licence
                                      </SelectItem>
                                      <SelectItem value="rationcard">
                                        Ration Card
                                      </SelectItem>
                                      <SelectItem value="voteridcard">
                                        Voter ID Card
                                      </SelectItem>
                                      <SelectItem value="passport">
                                        Passport
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="idnumber"
                                    className="text-xs text-right"
                                  >
                                    ID Number:
                                  </Label>
                                  <Input
                                    id="idnumber"
                                    name="idnumber"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="issuedate"
                                    className="text-xs text-right"
                                  >
                                    Issue Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="issuedate"
                                    name="issuedate"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="expirydate"
                                    className="text-xs text-right"
                                  >
                                    Expiry Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="expirydate"
                                    name="expirydate"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="documentspath"
                                    className="text-xs text-right"
                                  >
                                    Documents Path:
                                  </Label>
                                  <Input
                                    id="documentspath"
                                    name="documentspath"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="imagepreview"
                                    className="text-xs text-right"
                                  >
                                    Image Preview?:
                                  </Label>
                                  <Select name="imagepreview" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
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
                        </>
                      )}

                      {activeTab === "charges" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Charges
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="ledgename"
                                    className="text-xs text-right"
                                  >
                                    Ledge Name:
                                  </Label>
                                  <Input
                                    id="ledgename"
                                    name="ledgename"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="asapplicable"
                                    className="text-xs text-right"
                                  >
                                    As Applicable:
                                  </Label>
                                  <Input
                                    id="asapplicable"
                                    name="asapplicable"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="no"
                                    className="text-xs text-right"
                                  >
                                    No:
                                  </Label>
                                  <Input
                                    id="no"
                                    name="no"
                                    type="number"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="group"
                                    className="text-xs text-right"
                                  >
                                    Group:
                                  </Label>
                                  <Input
                                    id="group"
                                    name="group"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="narration"
                                    className="text-xs text-right"
                                  >
                                    Narration (Sales-Charges Voucher):
                                  </Label>
                                  <Input
                                    id="narration"
                                    name="narration"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vchdate"
                                    className="text-xs text-right"
                                  >
                                    Vch Date:
                                  </Label>
                                  <Input
                                    id="vchdate"
                                    name="vchdate"
                                    type="date"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="autoreceipt"
                                    className="text-xs text-right"
                                  >
                                    Auto Receipt:
                                  </Label>
                                  <Select name="autoreceipt" required>
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
                                    htmlFor="narration2"
                                    className="text-xs text-right"
                                  >
                                    Narration (Receipt-Charges Voucher):
                                  </Label>
                                  <Input
                                    id="narration2"
                                    name="narration2"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="status2"
                                    className="text-xs text-right"
                                  >
                                    Status:
                                  </Label>
                                  <Input
                                    id="status2"
                                    name="status2"
                                    className="h-7 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "other-documents" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Other Documents Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="documents"
                                    className="text-xs text-right"
                                  >
                                    Documents:
                                  </Label>
                                  <Select name="documents" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Select Document Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="drivinglicence">
                                        Driving Licence
                                      </SelectItem>
                                      <SelectItem value="rationcard">
                                        Ration Card
                                      </SelectItem>
                                      <SelectItem value="voteridcard">
                                        Voter ID Card
                                      </SelectItem>
                                      <SelectItem value="passport">
                                        Passport
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="documentid"
                                    className="text-xs text-right"
                                  >
                                    Document ID:
                                  </Label>
                                  <Input
                                    id="documentid"
                                    name="documentid"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="issuedate2"
                                    className="text-xs text-right"
                                  >
                                    Issue Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="issuedate2"
                                    name="issuedate2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="expirydate2"
                                    className="text-xs text-right"
                                  >
                                    Expiry Date:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="expirydate2"
                                    name="expirydate2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="documentspath2"
                                    className="text-xs text-right"
                                  >
                                    Documents Path:
                                  </Label>
                                  <Input
                                    id="documentspath2"
                                    name="documentspath2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="imagepreview2"
                                    className="text-xs text-right"
                                  >
                                    Image Preview?:
                                  </Label>
                                  <Select name="imagepreview2" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
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
                        </>
                      )}

                      {activeTab === "collateral" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Collateral Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="propertydetails"
                                    className="text-xs text-right"
                                  >
                                    Property Details?:
                                  </Label>
                                  <Select name="propertydetails" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="vehicledetails"
                                    className="text-xs text-right"
                                  >
                                    Vehicle Details?:
                                  </Label>
                                  <Select name="vehicledetails" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="plantandmachinerydetails"
                                    className="text-xs text-right"
                                  >
                                    Plant and Machinery Details?:
                                  </Label>
                                  <Select
                                    name="plantandmachinerydetails"
                                    required
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="livestockdetails"
                                    className="text-xs text-right"
                                  >
                                    Live Stock Details?:
                                  </Label>
                                  <Select name="livestockdetails" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="No" />
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
                        </>
                      )}

                      {activeTab === "occupation" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Source of Income
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="employed"
                                    className="text-xs text-right"
                                  >
                                    Employed ?:
                                  </Label>
                                  <Select name="employed" required>
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
                                    htmlFor="nameofemployer"
                                    className="text-xs text-right"
                                  >
                                    Name of Employer:
                                  </Label>
                                  <Input
                                    id="nameofemployer"
                                    name="nameofemployer"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="employeraddress"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Address of Employer:
                                  </Label>
                                  <Textarea
                                    id="employeraddress"
                                    name="employeraddress"
                                    className="text-xs flex-1 min-h-[80px]"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="position"
                                    className="text-xs text-right"
                                  >
                                    Position/Designation:
                                  </Label>
                                  <Input
                                    id="position"
                                    name="position"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="employmentno"
                                    className="text-xs text-right"
                                  >
                                    Employment No.:
                                  </Label>
                                  <Input
                                    id="employmentno"
                                    name="employmentno"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="experience"
                                    className="text-xs text-right"
                                  >
                                    Experience (years):
                                  </Label>
                                  <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="yearswithpresentemployer"
                                    className="text-xs text-right"
                                  >
                                    Years with Present Employer:
                                  </Label>
                                  <Input
                                    id="yearswithpresentemployer"
                                    name="yearswithpresentemployer"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="annualsalary"
                                    className="text-xs text-right"
                                  >
                                    Annual Salary:
                                  </Label>
                                  <Input
                                    id="annualsalary"
                                    name="annualsalary"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="monthlysalary"
                                    className="text-xs text-right"
                                  >
                                    Monthly Salary:
                                  </Label>
                                  <Input
                                    id="monthlysalary"
                                    name="monthlysalary"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="description"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Description:
                                  </Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    className="text-xs flex-1 min-h-[80px]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "nominee" && (
                        <>
                          <div className="space-y-3">
                            {/* Nominee Details Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Nominee Details
                              </h2>
                              <p className="text-sm text-gray-700 mb-2">
                                I hereby appoint the following person as nominee
                                in respect of deposit A/c:
                              </p>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="nomineename"
                                    className="text-xs text-right"
                                  >
                                    Nominee Name:
                                  </Label>
                                  <Input
                                    id="nomineename"
                                    name="nomineename"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="relationship2"
                                    className="text-xs text-right"
                                  >
                                    Relationship:
                                  </Label>
                                  <Input
                                    id="relationship2"
                                    name="relationship2"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="age2"
                                    className="text-xs text-right"
                                  >
                                    Age:
                                  </Label>
                                  <Input
                                    id="age2"
                                    name="age2"
                                    type="number"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="sex"
                                    className="text-xs text-right"
                                  >
                                    Sex:
                                  </Label>
                                  <Select name="sex" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="address"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Address:
                                  </Label>
                                  <Textarea
                                    id="address"
                                    name="address"
                                    className="text-xs flex-1 min-h-[80px]"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="dob"
                                    className="text-xs text-right"
                                  >
                                    Date of Birth:
                                  </Label>
                                  <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="isMinor"
                                    className="text-xs text-right"
                                  >
                                    Is Nominee a Minor?:
                                  </Label>
                                  <Select name="isMinor" required>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Guardian Details Section */}
                            <div className="space-y-2" id="guardian-section">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Guardian Details
                              </h2>
                              <p className="text-sm text-gray-700 mb-2">
                                As the nominee is minor on this date, I appoint
                              </p>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="guardianname"
                                    className="text-xs text-right"
                                  >
                                    Shri/Mr/Mrs. (Guardian Name):
                                  </Label>
                                  <Input
                                    id="guardianname"
                                    name="guardianname"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="guardianage"
                                    className="text-xs text-right"
                                  >
                                    Guardian Age:
                                  </Label>
                                  <Input
                                    id="guardianage"
                                    name="guardianage"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="guardianaddress"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Resident of (Guardian Address):
                                  </Label>
                                  <Textarea
                                    id="guardianaddress"
                                    name="guardianaddress"
                                    className="text-xs flex-1 min-h-[80px]"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="guardianrelation"
                                    className="text-xs text-right"
                                  >
                                    Relationship with Minor:
                                  </Label>
                                  <Input
                                    id="guardianrelation"
                                    name="guardianrelation"
                                    className="h-7 text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Witness Details Section */}
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Witness Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="witnessname"
                                    className="text-xs text-right"
                                  >
                                    Witness Name:
                                  </Label>
                                  <Input
                                    id="witnessname"
                                    name="witnessname"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="place"
                                    className="text-xs text-right"
                                  >
                                    Place:
                                  </Label>
                                  <Input
                                    id="place"
                                    name="place"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="date4"
                                    className="text-xs text-right"
                                  >
                                    Date:
                                  </Label>
                                  <Input
                                    id="date4"
                                    name="date4"
                                    type="date"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "family" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Family Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="familymembername"
                                    className="text-xs text-right"
                                  >
                                    Family Member Name:
                                  </Label>
                                  <Input
                                    id="familymembername"
                                    name="familymembername"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="relationship3"
                                    className="text-xs text-right"
                                  >
                                    Relationship:
                                  </Label>
                                  <Input
                                    id="relationship3"
                                    name="relationship3"
                                    className="h-7 text-xs"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="age3"
                                    className="text-xs text-right"
                                  >
                                    Age:
                                  </Label>
                                  <Input
                                    id="age3"
                                    name="age3"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="occupation2"
                                    className="text-xs text-right"
                                  >
                                    Occupation:
                                  </Label>
                                  <Input
                                    id="occupation2"
                                    name="occupation2"
                                    className="h-7 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "household" && (
                        <>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h2 className="text-base font-semibold mb-2 inline-block bg-blue-100 px-2 rounded">
                                Residence Details
                              </h2>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="typeofaccomodation"
                                    className="text-xs text-right"
                                  >
                                    Type of Accommodation:
                                  </Label>
                                  <Select name="typeofaccomodation" required>
                                    <SelectTrigger className="h-7">
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="owned">
                                        Owned
                                      </SelectItem>
                                      <SelectItem value="rented">
                                        Rented
                                      </SelectItem>
                                      <SelectItem value="ancestral">
                                        Ancestral
                                      </SelectItem>
                                      <SelectItem value="companyprovided">
                                        Company Provided
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="residencestatus"
                                    className="text-xs text-right"
                                  >
                                    Residence Status:
                                  </Label>
                                  <Select name="residencestatus" required>
                                    <SelectTrigger className="h-7">
                                      <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="permanent">
                                        Permanent
                                      </SelectItem>
                                      <SelectItem value="temporary">
                                        Temporary
                                      </SelectItem>
                                      <SelectItem value="transit">
                                        Transit
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="applicantstay"
                                    className="text-xs text-right"
                                  >
                                    Applicant stay at this residence?:
                                  </Label>
                                  <Select name="applicantstay" required>
                                    <SelectTrigger className="h-7">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="noofyears"
                                    className="text-xs text-right"
                                  >
                                    No. of Years:
                                  </Label>
                                  <Input
                                    id="noofyears"
                                    name="noofyears"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="nameplate"
                                    className="text-xs text-right"
                                  >
                                    Nameplate outside the house?:
                                  </Label>
                                  <Select name="nameplate" required>
                                    <SelectTrigger className="h-7">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="locality"
                                    className="text-xs text-right"
                                  >
                                    Locality:
                                  </Label>
                                  <Input
                                    id="locality"
                                    name="locality"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="areainsqft"
                                    className="text-xs text-right"
                                  >
                                    Area in Sq. Ft (approx):
                                  </Label>
                                  <Input
                                    id="areainsqft"
                                    name="areainsqft"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="propertyworth"
                                    className="text-xs text-right"
                                  >
                                    Approx Worth of Property:
                                  </Label>
                                  <Input
                                    id="propertyworth"
                                    name="propertyworth"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="householdassets"
                                    className="text-xs text-right"
                                  >
                                    Household Assets:
                                  </Label>
                                  <Input
                                    id="householdassets"
                                    name="householdassets"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="locatinghouse"
                                    className="text-xs text-right"
                                  >
                                    Locating the House:
                                  </Label>
                                  <Input
                                    id="locatinghouse"
                                    name="locatinghouse"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="distancefromoffice"
                                    className="text-xs text-right"
                                  >
                                    Distance from Office (in KM):
                                  </Label>
                                  <Input
                                    id="distancefromoffice"
                                    name="distancefromoffice"
                                    type="number"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="flex items-start gap-2 col-span-2">
                                  <Label
                                    htmlFor="commentonlocality"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Comment on Locality:
                                  </Label>
                                  <Textarea
                                    id="commentonlocality"
                                    name="commentonlocality"
                                    className="text-xs flex-1 min-h-[80px]"
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
                    <div className="sticky top-0 p-2 space-y-1 h-full">
                      {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        return (
                          <Button
                            key={tab.id}
                            variant={
                              activeTab === tab.id ? "secondary" : "ghost"
                            }
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
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" form="memberForm">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.memberName}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Occupation Dialog (Add Member) */}
      <Dialog
        open={isOccupationDialogOpen}
        onOpenChange={handleOccupationDialogClose}
      >
        <DialogContent className="max-w-4xl max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employment Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOccupationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-2">
              <div className="flex items-center gap-2 md:col-span-2">
                <Label
                  htmlFor="employmentType"
                  className="text-xs w-32 text-right"
                >
                  Employed ?
                </Label>
                <div className="flex-1">
                  <Select
                    name="employmentType"
                    value={employmentType}
                    onValueChange={setEmploymentType}
                    required
                  >
                    <SelectTrigger className="h-6 text-xs w-full">
                      <SelectValue placeholder="Select One" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]">
                      <SelectItem value="others">Others</SelectItem>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">
                        Self Employed
                      </SelectItem>
                      <SelectItem value="self-employed-professional">
                        Self Employed Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {employmentType && employmentType !== "self-employed" && (
                <>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="employer-name"
                      className="text-xs w-32 text-right"
                    >
                      Name of Employer
                    </Label>
                    <Input
                      id="employer-name"
                      name="employer-name"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="employer-address"
                      className="text-xs w-32 text-right"
                    >
                      Address of Employer
                    </Label>
                    <Input
                      id="employer-address"
                      name="employer-address"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="position"
                      className="text-xs w-32 text-right"
                    >
                      Position / Designation
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="employment-number"
                      className="text-xs w-32 text-right"
                    >
                      Employment Number
                    </Label>
                    <Input
                      id="employment-number"
                      name="employment-number"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="years-with-employer"
                      className="text-xs w-32 text-right"
                    >
                      Years With Present Employer
                    </Label>
                    <Input
                      id="years-with-employer"
                      name="years-with-employer"
                      type="number"
                      defaultValue="0"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="annual-salary"
                      className="text-xs w-32 text-right"
                    >
                      Annual Salary
                    </Label>
                    <Input
                      id="annual-salary"
                      name="annual-salary"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="monthly-salary"
                      className="text-xs w-32 text-right"
                    >
                      Monthly Salary
                    </Label>
                    <Input
                      id="monthly-salary"
                      name="monthly-salary"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-start gap-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-xs w-32 text-right pt-1"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="text-xs flex-1 h-20"
                    />
                  </div>
                </>
              )}

              {employmentType === "self-employed" && (
                <>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="name" className="text-xs w-32 text-right">
                      Name
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
                      htmlFor="address"
                      className="text-xs w-32 text-right"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="designation"
                      className="text-xs w-32 text-right"
                    >
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      name="designation"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="trade-license-no"
                      className="text-xs w-32 text-right"
                    >
                      Trade License No.
                    </Label>
                    <Input
                      id="trade-license-no"
                      name="trade-license-no"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="years" className="text-xs w-32 text-right">
                      No of Years
                    </Label>
                    <Input
                      id="years"
                      name="years"
                      type="number"
                      defaultValue="0"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="annual-income"
                      className="text-xs w-32 text-right"
                    >
                      Annual Income
                    </Label>
                    <Input
                      id="annual-income"
                      name="annual-income"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="monthly-income"
                      className="text-xs w-32 text-right"
                    >
                      Monthly Income
                    </Label>
                    <Input
                      id="monthly-income"
                      name="monthly-income"
                      className="h-6 text-xs flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-start gap-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-xs w-32 text-right pt-1"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="text-xs flex-1 h-20"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOccupationDialogClose(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Employment Information</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-memberName">Member Name</Label>
                  <Input
                    id="edit-memberName"
                    name="memberName"
                    defaultValue={editingItem.memberName}
                    required
                  />
                </div>
                {/* Add more fields as needed */}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Member</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Member Name</Label>
                  <p className="text-sm text-gray-600">
                    {viewingItem.memberName}
                  </p>
                </div>
                {/* Add more fields as needed */}
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

export default MemberComponent;
"# loan-prudent" 
