import React, { useState } from "react";
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
import { Plus, Search, Edit, Eye } from "lucide-react";
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
    // Required fields for Member type (add placeholder values as needed)
    enrollmentDate: "2024-01-01",
    memberId: "M001",
    branch: "Main Branch",
    accountType: "Savings",
    gender: "male",
    dob: "1990-01-01",
    maritalStatus: "Single",
    guardianName: "Jane Doe",
    guardianRelation: "Mother",
    nomineeName: "Jake Doe",
    nomineeRelation: "Brother",
    nomineeDob: "2000-01-01",
    nomineeAadhaar: "123412341234",
    aadhaar: "123412341234",
    pan: "ABCDE1234F",
    voterId: "VOTER1234",
    occupationType: "Salaried",
    annualIncome: "500000",
    religion: "Hindu",
    nationality: "Indian",
    photo: "",
    signature: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    deletedAt: null,
    isActive: true,
    // Add any other required fields from Member type here
  },
  // Add more mock members as needed
];

interface DisbursementData {
  date: string;
  branch: string;
  memberGroup: string;
  applicationNo: string;
  memberId: string;
  loanId: string;
  memberName: string;
  productName: string;
  interestMethod: string;
  interestRate: string;
  loanTerm: string;
  noOfEmis: string;
  loanAmount: string;
  disbursedAmount: string;
  approvalDate: string;
  approvedBy: string;
  isDisbursed: string;
  postEntry: string;
  datedGen: string;
  status: string;
}

const DisbursementPage = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [search, setSearch] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] =
    useState<DisbursementData | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search) ||
      member.memberConfigId.toLowerCase().includes(search.toLowerCase())
  );

  // Mock disbursement data for each member
  const getDisbursementData = (member: Member): DisbursementData => ({
    date: "2024-01-20",
    branch: "Main Branch",
    memberGroup: "Group A",
    applicationNo: `APP${member.id.padStart(6, "0")}`,
    memberId: member.memberConfigId,
    loanId: `LOAN${member.id.padStart(6, "0")}`,
    memberName: member.name,
    productName: "Personal Loan",
    interestMethod: "Reducing Balance",
    interestRate: "12.5",
    loanTerm: "24",
    noOfEmis: "24",
    loanAmount: "50000",
    disbursedAmount: "50000",
    approvalDate: "2024-01-15",
    approvedBy: "Manager",
    isDisbursed: "Yes",
    postEntry: "Posted",
    datedGen: "2024-01-20",
    status: "Active",
  });

  const handleEditClick = (member: Member) => {
    setSelectedDisbursement(getDisbursementData(member));
    setEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    // Here you would typically update the data in your backend
    console.log("Saving changes:", selectedDisbursement);
    setEditDialogOpen(false);
  };

  const handleInputChange = (field: keyof DisbursementData, value: string) => {
    if (selectedDisbursement) {
      setSelectedDisbursement({
        ...selectedDisbursement,
        [field]: value,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Disbursement Process
          </h1>
          <p className="text-gray-600 mt-2">
            Manage loan disbursement processes and track disbursed loans.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Disbursement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Disbursement</DialogTitle>
            </DialogHeader>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="date" className="text-xs w-32">
                  Date:
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="branch" className="text-xs w-32">
                  Branch:
                </Label>
                <Input
                  id="branch"
                  name="branch"
                  placeholder="Branch"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="membergroup" className="text-xs w-32">
                  Member Group:
                </Label>
                <Input
                  id="membergroup"
                  name="membergroup"
                  placeholder="Member Group"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="applicantionno" className="text-xs w-32">
                  Application No:
                </Label>
                <Input
                  id="applicantionno"
                  name="applicantionno"
                  placeholder="Application No"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="memberid" className="text-xs w-32">
                  Member ID:
                </Label>
                <Input
                  id="memberid"
                  name="memberid"
                  placeholder="Member ID"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="loanid" className="text-xs w-32">
                  Loan ID:
                </Label>
                <Input
                  id="loanid"
                  name="loanid"
                  placeholder="Loan ID"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="membername" className="text-xs w-32">
                  Member Name:
                </Label>
                <Input
                  id="membername"
                  name="membername"
                  placeholder="Member Name"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="productname" className="text-xs w-32">
                  Product Name:
                </Label>
                <Input
                  id="productname"
                  name="productname"
                  placeholder="Product Name"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="interestmethod" className="text-xs w-32">
                  Interest Method:
                </Label>
                <Input
                  id="interestmethod"
                  name="interestmethod"
                  placeholder="Interest Method"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="interestrate" className="text-xs w-32">
                  Interest Rate(%):
                </Label>
                <Input
                  id="interestrate"
                  name="interestrate"
                  placeholder="Interest Rate(%)"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="loanterm" className="text-xs w-32">
                  Loan Term:
                </Label>
                <Input
                  id="loanterm"
                  name="loanterm"
                  placeholder="Loan Term"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="noofemis" className="text-xs w-32">
                  No Of EMI's:
                </Label>
                <Input
                  id="noofemis"
                  name="noofemis"
                  placeholder="No Of EMI's"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="loanamount" className="text-xs w-32">
                  Loan Amount:
                </Label>
                <Input
                  id="loanamount"
                  name="loanamount"
                  placeholder="Loan Amount"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="disbursedamount" className="text-xs w-32">
                  Disbursed Amount (Partial):
                </Label>
                <Input
                  id="disbursedamount"
                  name="disbursedamount"
                  placeholder="Disbursed Amount"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="approvaldate" className="text-xs w-32">
                  Approval Date:
                </Label>
                <Input
                  type="date"
                  id="approvaldate"
                  name="approvaldate"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="approvedby" className="text-xs w-32">
                  Approved By:
                </Label>
                <Input
                  id="approvedby"
                  name="approvedby"
                  placeholder="Approved By"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="isdisbursed" className="text-xs w-32">
                  Is Disbursed:
                </Label>
                <Input
                  id="isdisbursed"
                  name="isdisbursed"
                  placeholder="Is Disbursed"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="postentry" className="text-xs w-32">
                  Post Entry:
                </Label>
                <Input
                  id="postentry"
                  name="postentry"
                  placeholder="Post Entry"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="datedgen" className="text-xs w-32">
                  Dated Gen:
                </Label>
                <Input
                  id="datedgen"
                  name="datedgen"
                  placeholder="Dated Gen"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="status" className="text-xs w-32">
                  Status:
                </Label>
                <Input
                  id="status"
                  name="status"
                  placeholder="Status"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-1">
              <Button variant="outline">Cancel</Button>
              <Button>Add Disbursement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search disbursements..."
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
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Member Group</TableHead>
                <TableHead>Application No</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Interest Method</TableHead>
                <TableHead>Interest Rate(%)</TableHead>
                <TableHead>Loan Term</TableHead>
                <TableHead>No Of EMI's</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Disbursed Amount</TableHead>
                <TableHead>Approval Date</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Is Disbursed</TableHead>
                <TableHead>Post Entry</TableHead>
                <TableHead>Dated Gen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const disbursementData = getDisbursementData(member);
                return (
                  <TableRow key={member.id}>
                    <TableCell>{disbursementData.date}</TableCell>
                    <TableCell>{disbursementData.branch}</TableCell>
                    <TableCell>{disbursementData.memberGroup}</TableCell>
                    <TableCell>{disbursementData.applicationNo}</TableCell>
                    <TableCell>{disbursementData.memberId}</TableCell>
                    <TableCell>{disbursementData.loanId}</TableCell>
                    <TableCell>{disbursementData.memberName}</TableCell>
                    <TableCell>{disbursementData.productName}</TableCell>
                    <TableCell>{disbursementData.interestMethod}</TableCell>
                    <TableCell>{disbursementData.interestRate}%</TableCell>
                    <TableCell>{disbursementData.loanTerm} Months</TableCell>
                    <TableCell>{disbursementData.noOfEmis}</TableCell>
                    <TableCell>
                      ₹{parseInt(disbursementData.loanAmount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ₹
                      {parseInt(
                        disbursementData.disbursedAmount
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{disbursementData.approvalDate}</TableCell>
                    <TableCell>{disbursementData.approvedBy}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {disbursementData.isDisbursed}
                      </Badge>
                    </TableCell>
                    <TableCell>{disbursementData.postEntry}</TableCell>
                    <TableCell>{disbursementData.datedGen}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{disbursementData.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={
                            editDialogOpen &&
                            selectedDisbursement?.memberId ===
                              member.memberConfigId
                          }
                          onOpenChange={setEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClick(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90%] max-h-[100vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Disbursement</DialogTitle>
                            </DialogHeader>
                            {selectedDisbursement && (
                              <div className="space-y-1">
                                <div className="row">
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-branch"
                                        className="text-xs w-32"
                                      >
                                        Branch:
                                      </Label>
                                      <Input
                                        id="edit-branch"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-membergroup"
                                        className="text-xs w-32"
                                      >
                                        Fund:
                                      </Label>
                                      <Input
                                        id="edit-membergroup"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-applicationno"
                                        className="text-xs w-32"
                                      >
                                        Application No:
                                      </Label>
                                      <Input
                                        id="edit-applicationno"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-memberid"
                                        className="text-xs w-32"
                                      >
                                        Credit Officer:
                                      </Label>
                                      <Input
                                        id="edit-memberid"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-loanid"
                                        className="text-xs w-32"
                                      >
                                        Member ID:
                                      </Label>
                                      <Input
                                        id="edit-loanid"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-membername"
                                        className="text-xs w-32"
                                      >
                                        Member Name:
                                      </Label>
                                      <Input
                                        id="edit-membername"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-productname"
                                        className="text-xs w-32"
                                      >
                                        Loan ID:
                                      </Label>
                                      <Input
                                        id="edit-productname"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-interestmethod"
                                        className="text-xs w-32"
                                      >
                                        Invoice Value:
                                      </Label>
                                      <Input
                                        id="edit-productname"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-interestrate"
                                        className="text-xs w-32"
                                      >
                                        Funding:
                                      </Label>
                                      <Input
                                        id="edit-interestrate"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-loanterm"
                                        className="text-xs w-32"
                                      >
                                        Approved Loan Amt:
                                      </Label>
                                      <Input
                                        id="edit-loanterm"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-noofemis"
                                        className="text-xs w-32"
                                      >
                                        Applied Loan Amount:
                                      </Label>
                                      <Input
                                        id="edit-noofemis"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-loanamount"
                                        className="text-xs w-32"
                                      >
                                        Interest Amount:
                                      </Label>
                                      <Input
                                        id="edit-loanamount"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-disbursedamount"
                                        className="text-xs w-32"
                                      >
                                        Product Name:
                                      </Label>
                                      <Input
                                        id="edit-disbursedamount"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-approvaldate"
                                        className="text-xs w-32"
                                      >
                                        Loan Term:
                                      </Label>
                                      <Input
                                        id="edit-approvaldate"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-approvedby"
                                        className="text-xs w-32"
                                      >
                                        Interest Method:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-isdisbursed"
                                        className="text-xs w-32"
                                      >
                                        Anual Interest Rate:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Repayment Plan:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Approval Date:
                                      </Label>
                                      <Input
                                        type="date"
                                        id="edit-approvedby"
                                        className="h-6 text-xs px-1 flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Disbursement Date:
                                      </Label>
                                      <Input
                                        type="date"
                                        id="edit-approvedby"
                                        className="h-6 text-xs px-1 flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        1st Installment Date:
                                      </Label>
                                      <Input
                                        type="date"
                                        id="edit-approvedby"
                                        className="h-6 text-xs px-1 flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        No of Advance EMI:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        No of EMIs:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 my-3">
                                    <div className="text-center py-2 bg-light">
                                      Payment Mode
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Transaction Type:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        IRR CIFCO:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Cash/Banker Ledger:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Amount:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 my-3">
                                    <div className="text-center py-2 bg-light">
                                      Vehicle Details
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Vehicle No:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Vehicle Male:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Vehicle Model:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Yr of Mfg:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Chasis No:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3 mt-1">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="edit-status"
                                        className="text-xs w-32"
                                      >
                                        Engine No:
                                      </Label>
                                      <Input
                                        id="edit-approvedby"
                                        className="h-6 text-xs flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 my-3">
                                    <div className="text-center py-2 bg-light">
                                      Misc Charges
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end space-x-2 mt-1">
                              <Button
                                variant="outline"
                                onClick={() => setEditDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveChanges}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default DisbursementPage;
