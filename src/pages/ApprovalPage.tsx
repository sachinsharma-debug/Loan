import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { Checkbox } from "@/components/ui/checkbox";

import { Plus, Search, Edit, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Member } from "@/types";
const mockMembers: Member[] = [
  {
    id: "1",
    memberName: "John Doe",
    memberConfigId: "MC001",
    kyc: "KYC001",
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    areaCode: "A001",
    areaName: "Downtown",
    occupation: "Engineer",
    education: "Graduate",
    casteCategory: "General",
    caste: "Doe",
    relationship: "Single",
    address: "123 Main St",
    status: "active",
    dateJoined: "2024-06-01",
  },
  {
    id: "2",
    memberName: "Jane Smith",
    memberConfigId: "MC002",
    kyc: "KYC002",
    name: "Jane Smith",
    phone: "9876543210",
    email: "jane@example.com",
    areaCode: "A002",
    areaName: "Uptown",
    occupation: "Teacher",
    education: "Post Graduate",
    casteCategory: "OBC",
    caste: "Smith",
    relationship: "Married",
    address: "456 Oak Ave",
    status: "active",
    dateJoined: "2024-05-20",
  },
  {
    id: "3",
    memberName: "Rahul Verma",
    memberConfigId: "MC003",
    kyc: "KYC003",
    name: "Rahul Verma",
    phone: "9012345678",
    email: "rahul@example.com",
    areaCode: "A003",
    areaName: "Midtown",
    occupation: "Accountant",
    education: "Graduate",
    casteCategory: "General",
    caste: "Verma",
    relationship: "Married",
    address: "789 Pine Rd",
    status: "active",
    dateJoined: "2024-04-15",
  },
  {
    id: "4",
    memberName: "Ayesha Khan",
    memberConfigId: "MC004",
    kyc: "KYC004",
    name: "Ayesha Khan",
    phone: "9123456780",
    email: "ayesha@example.com",
    areaCode: "A004",
    areaName: "Old Town",
    occupation: "Designer",
    education: "Diploma",
    casteCategory: "Minority",
    caste: "Khan",
    relationship: "Single",
    address: "321 Cedar St",
    status: "active",
    dateJoined: "2024-03-10",
  },
  {
    id: "5",
    memberName: "Carlos Ruiz",
    memberConfigId: "MC005",
    kyc: "KYC005",
    name: "Carlos Ruiz",
    phone: "9234567801",
    email: "carlos@example.com",
    areaCode: "A005",
    areaName: "Harbor",
    occupation: "Driver",
    education: "High School",
    casteCategory: "General",
    caste: "Ruiz",
    relationship: "Married",
    address: "654 Bay Blvd",
    status: "active",
    dateJoined: "2024-02-05",
  },
  {
    id: "6",
    memberName: "Meera Iyer",
    memberConfigId: "MC006",
    kyc: "KYC006",
    name: "Meera Iyer",
    phone: "9345678012",
    email: "meera@example.com",
    areaCode: "A006",
    areaName: "Tech Park",
    occupation: "Software Engineer",
    education: "Post Graduate",
    casteCategory: "General",
    caste: "Iyer",
    relationship: "Single",
    address: "987 Silicon Dr",
    status: "active",
    dateJoined: "2024-01-25",
  },
  {
    id: "7",
    memberName: "Liam O'Neil",
    memberConfigId: "MC007",
    kyc: "KYC007",
    name: "Liam O'Neil",
    phone: "9456780123",
    email: "liam@example.com",
    areaCode: "A007",
    areaName: "Greenfield",
    occupation: "Sales Executive",
    education: "Graduate",
    casteCategory: "General",
    caste: "O'Neil",
    relationship: "Married",
    address: "111 Meadow Ln",
    status: "active",
    dateJoined: "2023-12-30",
  },
];

type ApprovalStatus = "select" | "pending" | "approve" | "hold" | "reject";
type ApproveForm = {
  date: string;
  amount: string;
  interestRate: string;
  repaymentPlan: string;
  loanTerm: string; // number of months
  noOfEmis: string;
  irr: string;
  narration: string;
};
type ApprovalForm = {
  memberId: string;
  memberName: string;
  applicationDate: string; // yyyy-mm-dd
  applicationNo: string;
  loanId: string;
  approvalStatus: ApprovalStatus;
};

const ApprovalPage = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ApprovalStatus | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveForm, setApproveForm] = useState<ApproveForm>({
    date: "",
    amount: "",
    interestRate: "",
    repaymentPlan: "",
    loanTerm: "",
    noOfEmis: "",
    irr: "",
    narration: "",
  });
  const [form, setForm] = useState<ApprovalForm>({
    memberId: "",
    memberName: "",
    applicationDate: "",
    applicationNo: "",
    loanId: "",
    approvalStatus: "select",
  });
  // optional store of statuses by id to persist selections
  const [statusById, setStatusById] = useState<Record<string, ApprovalStatus>>(
    {}
  );

  const openDialogWithSelected = () => {
    if (!selectedId) return;
    const member = members.find((m) => m.id === selectedId);
    if (!member) return;
    const applicationNo = `APP${member.id.padStart(6, "0")}`;
    const loanId = `LN/B1ML${member.id.padStart(4, "0")}`;
    const applicationDate = (member.dateJoined || "").slice(0, 10);
    const approvalStatus = statusById[selectedId] ?? "select";
    setForm({
      memberId: member.memberConfigId || member.id,
      memberName: member.name,
      applicationDate,
      applicationNo,
      loanId,
      approvalStatus,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedId) return setIsDialogOpen(false);
    setStatusById((prev) => ({ ...prev, [selectedId]: form.approvalStatus }));
    setIsDialogOpen(false);
  };

  const openApproveDialog = () => {
    if (!selectedId) return;
    // Prefill from table defaults for now
    const member = members.find((m) => m.id === selectedId);
    const date = (member?.dateJoined || "2024-01-15").slice(0, 10);
    setApproveForm({
      date,
      amount: "₹50,000",
      interestRate: "12.5",
      repaymentPlan: "Monthly",
      loanTerm: "24",
      noOfEmis: "24",
      irr: "",
      narration: "",
    });
    setIsApproveOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedId) return setIsApproveOpen(false);
    setForm((prev) => ({ ...prev, approvalStatus: "approve" }));
    setStatusById((prev) => ({ ...prev, [selectedId]: "approve" }));
    setIsApproveOpen(false);
    // Keep the main details dialog open so the user returns to it
    setIsDialogOpen(true);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search) ||
      member.memberConfigId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Approval Process
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Approval Processes and information for loan applications.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={openDialogWithSelected} disabled={!selectedId}>
            Approve
          </Button>
          <Button disabled={!selectedId}>Ledger Details</Button>
          <Button disabled={!selectedId}>Loan Disburment</Button>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                Approval Details
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="memberId" className="text-xs text-right">
                  Member ID :
                </Label>
                <Input
                  id="memberId"
                  name="memberId"
                  className="h-7 text-xs"
                  value={form.memberId}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="membername" className="text-xs text-right">
                  Member Name :
                </Label>
                <Input
                  id="membername"
                  name="membername"
                  className="h-7 text-xs"
                  value={form.memberName}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="applicationDate" className="text-xs text-right">
                  Application Date :
                </Label>
                <Input
                  type="date"
                  id="applicationDate"
                  name="applicationDate"
                  className="h-7 text-xs"
                  value={form.applicationDate}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="applicationNo" className="text-xs text-right">
                  Application No :
                </Label>
                <Input
                  id="applicationNo"
                  name="applicationNo"
                  className="h-7 text-xs"
                  value={form.applicationNo}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="loanId" className="text-xs text-right">
                  Loan ID :
                </Label>
                <Input
                  id="loanId"
                  name="loanId"
                  className="h-7 text-xs"
                  value={form.loanId}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                <Label htmlFor="approvalStatus" className="text-xs text-right">
                  Approval Status:
                </Label>
                <Select
                  value={form.approvalStatus}
                  onValueChange={(v: ApprovalStatus) => {
                    if (v === "hold" || v === "reject") {
                      setPendingStatus(v);
                      setReason("");
                      setIsReasonOpen(true);
                    } else if (v === "approve") {
                      setPendingStatus("approve");
                      openApproveDialog();
                    } else if (v === "pending") {
                      setForm((prev) => ({ ...prev, approvalStatus: v }));
                    } else {
                      // 'select' option chosen: keep current state
                    }
                  }}
                >
                  <SelectTrigger id="approvalStatus" className="h-7 text-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>Done</Button>
            </div>
          </DialogContent>
          {/* Reason dialog for Hold/Reject */}
          <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Provide Reason</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter a brief reason"
                  className="min-h-[90px]"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsReasonOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!reason.trim()}
                  onClick={() => {
                    if (!pendingStatus) return;
                    setForm((prev) => ({
                      ...prev,
                      approvalStatus: pendingStatus,
                    }));
                    setIsReasonOpen(false);
                    setPendingStatus(null);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Dialog>
        {/* Approve details dialog */}
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Approval Status</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_date">
                  Date
                </Label>
                <Input
                  id="app_date"
                  type="date"
                  className="h-7 text-xs"
                  value={approveForm.date}
                  onChange={(e) =>
                    setApproveForm({ ...approveForm, date: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_amount">
                  Amount
                </Label>
                <Input
                  id="app_amount"
                  className="h-7 text-xs"
                  value={approveForm.amount}
                  onChange={(e) =>
                    setApproveForm({ ...approveForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_rate">
                  Interest Rate
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="app_rate"
                    className="h-7 text-xs"
                    value={approveForm.interestRate}
                    onChange={(e) =>
                      setApproveForm({
                        ...approveForm,
                        interestRate: e.target.value,
                      })
                    }
                  />
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_plan">
                  Repayment Plan
                </Label>
                <Input
                  id="app_plan"
                  className="h-7 text-xs"
                  value={approveForm.repaymentPlan}
                  onChange={(e) =>
                    setApproveForm({
                      ...approveForm,
                      repaymentPlan: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_term">
                  Loan Term
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="app_term"
                    className="h-7 text-xs"
                    value={approveForm.loanTerm}
                    onChange={(e) =>
                      setApproveForm({
                        ...approveForm,
                        loanTerm: e.target.value,
                      })
                    }
                  />
                  <span className="text-xs">Months</span>
                </div>
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_emis">
                  No of EMIs
                </Label>
                <Input
                  id="app_emis"
                  className="h-7 text-xs"
                  value={approveForm.noOfEmis}
                  onChange={(e) =>
                    setApproveForm({ ...approveForm, noOfEmis: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-[120px,1fr] items-center gap-2">
                <Label className="text-xs text-right" htmlFor="app_irr">
                  IRR
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="app_irr"
                    className="h-7 text-xs"
                    value={approveForm.irr}
                    onChange={(e) =>
                      setApproveForm({ ...approveForm, irr: e.target.value })
                    }
                  />
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="grid grid-cols-[120px,1fr] items-start gap-2 col-span-2">
                <Label className="text-xs text-right mt-1" htmlFor="app_note">
                  Narration
                </Label>
                <Textarea
                  id="app_note"
                  className="text-xs min-h-[90px]"
                  value={approveForm.narration}
                  onChange={(e) =>
                    setApproveForm({
                      ...approveForm,
                      narration: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmApprove}>Approve It</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applications..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Application No</TableHead>
                <TableHead>Member Group</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Interest Method</TableHead>
                <TableHead>Rate(%)</TableHead>
                <TableHead>Loan Term</TableHead>
                <TableHead>Repayment Plan</TableHead>
                <TableHead>No Of EMI's</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Objective</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedId === member.id}
                      onCheckedChange={(checked) =>
                        setSelectedId(checked === true ? member.id : null)
                      }
                      aria-label={`Select application APP${member.id.padStart(
                        6,
                        "0"
                      )}`}
                    />
                  </TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>Main Branch</TableCell>
                  <TableCell>APP{member.id.padStart(6, "0")}</TableCell>
                  <TableCell>Group A</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>Personal Loan</TableCell>
                  <TableCell>Reducing Balance</TableCell>
                  <TableCell>12.5%</TableCell>
                  <TableCell>24 Months</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell>₹50,000</TableCell>
                  <TableCell>Home Renovation</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
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
    </div>
  );
};

export default ApprovalPage;
