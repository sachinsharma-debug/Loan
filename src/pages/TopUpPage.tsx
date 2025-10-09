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
  },
  // Add more mock members as needed
];

const TopUpPage = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [search, setSearch] = useState("");

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
            Loan Top-Up Process
          </h1>
          <p className="text-gray-600 mt-2">
            Manage loan top-up processes and track existing loan enhancements.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Top-Up
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[99vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Top-Up</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="memberid" className="text-xs w-32 text-right">
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
                <Label htmlFor="membername" className="text-xs w-32 text-right">
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
                <Label
                  htmlFor="membergroup"
                  className="text-xs w-32 text-right"
                >
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
                <Label htmlFor="branch" className="text-xs w-32 text-right">
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
                <Label htmlFor="loanid" className="text-xs w-32 text-right">
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
                <Label htmlFor="product" className="text-xs w-32 text-right">
                  Product:
                </Label>
                <Input
                  id="product"
                  name="product"
                  placeholder="Product"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="methodofinterest"
                  className="text-xs w-32 text-right"
                >
                  Method of Interest:
                </Label>
                <Input
                  id="methodofinterest"
                  name="methodofinterest"
                  placeholder="Method of Interest"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="termofloan" className="text-xs w-32 text-right">
                  Term of Loan:
                </Label>
                <Input
                  id="termofloan"
                  name="termofloan"
                  placeholder="Term of Loan"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="rate" className="text-xs w-32 text-right">
                  Rate(%):
                </Label>
                <Input
                  id="rate"
                  name="rate"
                  placeholder="Rate(%)"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="noofemi" className="text-xs w-32 text-right">
                  No of EMI:
                </Label>
                <Input
                  id="noofemi"
                  name="noofemi"
                  placeholder="No of EMI"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="recoveryplan"
                  className="text-xs w-32 text-right"
                >
                  Recovery Plan:
                </Label>
                <Input
                  id="recoveryplan"
                  name="recoveryplan"
                  placeholder="Recovery Plan"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="disburseddate"
                  className="text-xs w-32 text-right"
                >
                  Disbursed Date:
                </Label>
                <Input
                  type="date"
                  id="disburseddate"
                  name="disburseddate"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="firstemi" className="text-xs w-32 text-right">
                  First EMI:
                </Label>
                <Input
                  type="date"
                  id="firstemi"
                  name="firstemi"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="lastemi" className="text-xs w-32 text-right">
                  Last EMI:
                </Label>
                <Input
                  type="date"
                  id="lastemi"
                  name="lastemi"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="principal" className="text-xs w-32 text-right">
                  Principal:
                </Label>
                <Input
                  id="principal"
                  name="principal"
                  placeholder="Principal"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="interest" className="text-xs w-32 text-right">
                  Interest:
                </Label>
                <Input
                  id="interest"
                  name="interest"
                  placeholder="Interest"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="totalamount"
                  className="text-xs w-32 text-right"
                >
                  Total Amount:
                </Label>
                <Input
                  id="totalamount"
                  name="totalamount"
                  placeholder="Total Amount"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="existingtopup"
                  className="text-xs w-32 text-right"
                >
                  Existing TopUp:
                </Label>
                <Input
                  id="existingtopup"
                  name="existingtopup"
                  placeholder="Existing TopUp"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="newtopup" className="text-xs w-32 text-right">
                  New Topup?:
                </Label>
                <Input
                  id="newtopup"
                  name="newtopup"
                  placeholder="New Topup?"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="pdintgen" className="text-xs w-32 text-right">
                  P.D. Int Gen:
                </Label>
                <Input
                  id="pdintgen"
                  name="pdintgen"
                  placeholder="P.D. Int Gen"
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Add Top-Up</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search top-ups..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Member Group</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Method of Interest</TableHead>
                <TableHead>Term of Loan</TableHead>
                <TableHead>Rate(%)</TableHead>
                <TableHead>No of EMI</TableHead>
                <TableHead>Recovery Plan</TableHead>
                <TableHead>Disbursed Date</TableHead>
                <TableHead>First EMI</TableHead>
                <TableHead>Last EMI</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Existing TopUp</TableHead>
                <TableHead>New Topup?</TableHead>
                <TableHead>P.D. Int Gen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.memberConfigId}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>Group A</TableCell>
                  <TableCell>Main Branch</TableCell>
                  <TableCell>LOAN{member.id.padStart(6, "0")}</TableCell>
                  <TableCell>Personal Loan</TableCell>
                  <TableCell>Reducing Balance</TableCell>
                  <TableCell>24 Months</TableCell>
                  <TableCell>12.5%</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>2024-02-15</TableCell>
                  <TableCell>2026-01-15</TableCell>
                  <TableCell>₹45,000</TableCell>
                  <TableCell>₹5,000</TableCell>
                  <TableCell>₹50,000</TableCell>
                  <TableCell>₹10,000</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Yes</Badge>
                  </TableCell>
                  <TableCell>Generated</TableCell>
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

export default TopUpPage;
