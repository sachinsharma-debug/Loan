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
  DialogClose,
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
import { Textarea } from "./ui/textarea";

const RecuringACOpeningPage = () => {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [isAddEMIOpen, setIsAddEMIOpen] = useState(false);

  const handleAddEMIClose = () => {
    setIsAddEMIOpen(false);
    setReceiptNumber("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Recurring Deposit Account Opening
          </h1>
        </div>

        {/* Pre-Closure Receipt Dialog */}
        <Dialog open={isAddEMIOpen} onOpenChange={setIsAddEMIOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[70%] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Recurring Deposit Account Opening Form</DialogTitle>
            </DialogHeader>
            <div className="row">
              <div className="col-12 border-r">
                <div className="space-y-1">
                  <div className="row">
                    <div className="col-6">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="Member" className="text-xs w-32  ">
                          Member Name:
                        </Label>
                        <Input
                          id="Member"
                          name="Member"
                          placeholder="Member"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Member ID:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-6 pr-0">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="loanid" className="text-xs w-32 ">
                            Send OTP:
                          </Label>
                          <Input
                            id="loanid"
                            name="loanid"
                            className="h-6 text-xs flex-1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="date" className="text-xs w-32 ">
                          A/C Opening Date:
                        </Label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Account No:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Passbook No:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Product Name:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Tenure Period:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Account Type:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Interest Rate:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Initial Deposit Amount:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Deposit Frequency:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Select Ledger:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 my-3">
                      <div className="text-center bg-light py-2">Maturity Details</div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="date" className="text-xs w-32 ">
                          Maturity Date:
                        </Label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Total Deposit Amount:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Exp Interest Amt:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Exp Maturity Amt:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Select Agent:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Apply Charges:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Remarks:
                        </Label>
                        <Textarea
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Status:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Generate Receipt:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  <Button variant="outline" onClick={handleAddEMIClose}>
                    Cancel
                  </Button>
                  <Button>Add</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute px-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search....." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Adjusted Amount</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>EMI No</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-20</TableCell>
                <TableCell>Main Branch</TableCell>
                <TableCell>Group A</TableCell>
                <TableCell>APP</TableCell>
                <TableCell>Happy</TableCell>
                <TableCell>Happy</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuringACOpeningPage;