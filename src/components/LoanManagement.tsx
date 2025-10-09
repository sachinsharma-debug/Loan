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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Eye, CheckCircle, XCircle } from "lucide-react";
import { Loan, Member } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface LoanManagementProps {
  loans: Loan[];
  members: Member[];
  onAddLoan: (loan: Omit<Loan, "id">) => void;
  onUpdateLoan: (id: string, loan: Partial<Loan>) => void;
}

const LoanManagement = ({
  loans,
  members,
  onAddLoan,
  onUpdateLoan,
}: LoanManagementProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newMember, setNewMember] = useState({
    enrollmentDate: "",
    memberId: "",
    memberName: "",
    uploadPhotoSign: "No",
    area: "",
    branch: "",
    accountType: "Single",
    memberGroup: "Members",
  });

  const [loanDetails, setLoanDetails] = useState([
    {
      applicationDate: "1-Aug-22",
      approvalDate: "1-8-2022",
      loanId: "LN/B1ML0015",
      statusOfDisbursement: "Disbursement",
      repaidStatus: "",
      closedDate: "",
      viewDetails: "No",
    },
    {
      applicationDate: "1-Aug-22",
      approvalDate: "1-9-2022",
      loanId: "LN/B1ML0016",
      statusOfDisbursement: "Disbursement",
      repaidStatus: "",
      closedDate: "",
      viewDetails: "No",
    },
  ]);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.objective &&
        loan.objective.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateMember = async () => {
    setLoading(true);
    try {
      // Create a member entry that can be used for loans later
      const memberData = {
        ...newMember,
        loanId: `L${Date.now()}`,
        amount: 0,
        interestRate: 0,
        duration: 0,
        objective: "Member Registration",
        status: "pending" as const,
        appliedDate: new Date().toISOString().split("T")[0],
        currentStep: 1,
        penaltyMode: "none",
        remainingAmount: 0,
      };

      await onAddLoan(memberData);

      // Reset form
      setNewMember({
        enrollmentDate: "",
        memberId: "",
        memberName: "",
        uploadPhotoSign: "No",
        area: "",
        branch: "",
        accountType: "Single",
        memberGroup: "Members",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating member:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewMember({
      enrollmentDate: "",
      memberId: "",
      memberName: "",
      uploadPhotoSign: "No",
      area: "",
      branch: "",
      accountType: "Single",
      memberGroup: "Members",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      defaulted: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const canApproveLoans = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Member Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage member registrations and information
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)} disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Register Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Member Registration</DialogTitle>
              <DialogDescription>
                Fill in the details to register a new member
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMember();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="enrollmentDate"
                      className="text-xs w-32 text-right"
                    >
                      Enrollment Date:
                    </Label>
                    <Input
                      id="enrollmentDate"
                      name="enrollmentDate"
                      type="date"
                      value={newMember.enrollmentDate}
                      onChange={handleInputChange}
                      className="h-6 text-xs flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="memberId"
                      className="text-xs w-32 text-right"
                    >
                      Member ID:
                    </Label>
                    <Input
                      id="memberId"
                      name="memberId"
                      value={newMember.memberId}
                      onChange={handleInputChange}
                      placeholder="M/B1/0046"
                      className="h-6 text-xs flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="memberName"
                      className="text-xs w-32 text-right"
                    >
                      Member Name:
                    </Label>
                    <Input
                      id="memberName"
                      name="memberName"
                      value={newMember.memberName}
                      onChange={handleInputChange}
                      placeholder="Amit Kumar"
                      className="h-6 text-xs flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="uploadPhotoSign"
                      className="text-xs w-32 text-right"
                    >
                      Upload Photo/Sign:
                    </Label>
                    <Select
                      value={newMember.uploadPhotoSign}
                      onValueChange={(value) =>
                        handleSelectChange("uploadPhotoSign", value)
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="area" className="text-xs w-32 text-right">
                      Area:
                    </Label>
                    <Select
                      value={newMember.area}
                      onValueChange={(value) =>
                        handleSelectChange("area", value)
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Area1">Area1</SelectItem>
                        <SelectItem value="Area2">Area2</SelectItem>
                        <SelectItem value="Area3">Area3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="branch" className="text-xs w-20 text-right">
                      Branch:
                    </Label>
                    <Select
                      value={newMember.branch}
                      onValueChange={(value) =>
                        handleSelectChange("branch", value)
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Branch1">Branch1</SelectItem>
                        <SelectItem value="Branch2">Branch2</SelectItem>
                        <SelectItem value="Branch3">Branch3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="accountType"
                      className="text-xs w-20 text-right"
                    >
                      A/c Type:
                    </Label>
                    <Select
                      value={newMember.accountType}
                      onValueChange={(value) =>
                        handleSelectChange("accountType", value)
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Joint">Joint</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="memberGroup"
                      className="text-xs w-20 text-right"
                    >
                      Member Group:
                    </Label>
                    <Select
                      value={newMember.memberGroup}
                      onValueChange={(value) =>
                        handleSelectChange("memberGroup", value)
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select member group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Members">Members</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Loan Details Table */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Loan Details of: {newMember.memberName || "Member"}
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLoanDetails([
                        ...loanDetails,
                        {
                          applicationDate: "",
                          approvalDate: "",
                          loanId: "",
                          statusOfDisbursement: "",
                          repaidStatus: "",
                          closedDate: "",
                          viewDetails: "No",
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Loan
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Application Date
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Approval Date
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Loan ID
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Status of Disbursement
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Repaid Status
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Closed Date
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          View Details
                        </TableHead>
                        <TableHead className="text-xs font-medium h-8 px-2">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanDetails.map((loan, index) => (
                        <TableRow
                          key={index}
                          className={index === 1 ? "bg-yellow-100" : ""}
                        >
                          <TableCell className="h-8 px-2">
                            <Input
                              type="date"
                              value={loan.applicationDate}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].applicationDate = e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0"
                            />
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <Input
                              type="date"
                              value={loan.approvalDate}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].approvalDate = e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0"
                            />
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <Input
                              value={loan.loanId}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].loanId = e.target.value;
                                setLoanDetails(updated);
                              }}
                              placeholder="LN/B1ML0015"
                              className="h-6 text-xs border-none bg-transparent p-0"
                            />
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <select
                              value={loan.statusOfDisbursement}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].statusOfDisbursement =
                                  e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0 w-full"
                            >
                              <option value="">Select</option>
                              <option value="Disbursement">Disbursement</option>
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                            </select>
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <Input
                              value={loan.repaidStatus}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].repaidStatus = e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0"
                            />
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <Input
                              type="date"
                              value={loan.closedDate}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].closedDate = e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0"
                            />
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <select
                              value={loan.viewDetails}
                              onChange={(e) => {
                                const updated = [...loanDetails];
                                updated[index].viewDetails = e.target.value;
                                setLoanDetails(updated);
                              }}
                              className="h-6 text-xs border-none bg-transparent p-0 w-full"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </TableCell>
                          <TableCell className="h-8 px-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const updated = loanDetails.filter(
                                  (_, i) => i !== index
                                );
                                setLoanDetails(updated);
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Register
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredLoans.length} of {loans.length} members
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Upload Photo/Sign</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>A/c Type</TableHead>
                <TableHead>Member Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    {(loan as any).enrollmentDate || loan.appliedDate}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(loan as any).memberId || loan.loanId}
                  </TableCell>
                  <TableCell>{loan.memberName}</TableCell>
                  <TableCell>{(loan as any).uploadPhotoSign || "No"}</TableCell>
                  <TableCell>{(loan as any).area || "-"}</TableCell>
                  <TableCell>{(loan as any).branch || "-"}</TableCell>
                  <TableCell>{(loan as any).accountType || "-"}</TableCell>
                  <TableCell>{(loan as any).memberGroup || "-"}</TableCell>
                  <TableCell>{getStatusBadge(loan.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canApproveLoans && loan.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() =>
                              onUpdateLoan(loan.id, {
                                status: "approved",
                                approvedDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                              })
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() =>
                              onUpdateLoan(loan.id, { status: "rejected" })
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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

export default LoanManagement;
