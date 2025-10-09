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

const EMIReceiptPage = () => {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [isEMIReceiptOpen, setIsEMIReceiptOpen] = useState(false);
  const [isAddEMIOpen, setIsAddEMIOpen] = useState(false);

  const handleEMIReceiptSubmit = () => {
    setIsEMIReceiptOpen(false);
    setIsAddEMIOpen(true);
  };

  const handleAddEMIClose = () => {
    setIsAddEMIOpen(false);
    setReceiptNumber("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EMI Receipt</h1>
          <p className="text-gray-600 mt-2">Manage EMI receipt records</p>
        </div>

        {/* EMI Receipt Dialog */}
        <Dialog open={isEMIReceiptOpen} onOpenChange={setIsEMIReceiptOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add EMI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>EMI Receipt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="Member" className="text-xs w-32 ">
                    Member Name:
                  </Label>
                  <Input
                    id="Member"
                    name="Member"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="Member" className="text-xs w-32 ">
                    Loan ID:
                  </Label>
                  <Input
                    id="Member"
                    name="Member"
                    className="h-6 text-xs flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleEMIReceiptSubmit}
                disabled={!receiptNumber.trim()}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add New EMI Dialog */}
        <Dialog open={isAddEMIOpen} onOpenChange={setIsAddEMIOpen}>
          <DialogContent className="max-w-[90%] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New EMI</DialogTitle>
            </DialogHeader>
            <div className="row">
              <div className="col-11 border-r">
                <div className="space-y-1">
                  <div className="row border-b pb-3">
                    <div className="col-3">
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

                    <div className="col-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Loan ID:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Last Rcpt date:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="date" className="text-xs w-32 ">
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
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Dealer:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Folio No:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Voucher Number:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Narration:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Total Amount:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Penalty Charge:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Int Rate(%):
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Cash/Bank Ledger:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Prev Penalty:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Current Penalty:
                        </Label>
                        <Input
                          id="loanid"
                          name="loanid"
                          className="h-6 text-xs flex-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="loanid" className="text-xs w-32 ">
                          Due Penalty:
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Installment No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Balance Amount</TableHead>
                      <TableHead>Due Amount</TableHead>
                      <TableHead>Alloted Amount</TableHead>
                      <TableHead>Loan Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-01-20</TableCell>
                      <TableCell>Main Branch</TableCell>
                      <TableCell>Group A</TableCell>
                      <TableCell>APP</TableCell>
                      <TableCell>Happy</TableCell>
                      <TableCell>LOAN</TableCell>
                      <TableCell>Happy</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex justify-end space-x-2 mt-5">
                  <Button variant="outline" onClick={handleAddEMIClose}>
                    Cancel
                  </Button>
                  <Button>Add</Button>
                </div>
              </div>
              <div className="col-1 bg-light">
                <div className="text-xs mt-2">Period</div>
                <div className="text-xs mt-2">Loan Info</div>
                <div className="text-xs mt-2">Show Penalty</div>
                <div className="text-xs mt-2">Post-Dated</div>
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
                <TableHead>Due Date</TableHead>
                <TableHead>Installment No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Balance Amount</TableHead>
                <TableHead>Due Amount</TableHead>
                <TableHead>Alloted Amount</TableHead>
                <TableHead>Loan Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-20</TableCell>
                <TableCell>Main Branch</TableCell>
                <TableCell>Group A</TableCell>
                <TableCell>APP</TableCell>
                <TableCell>Happy</TableCell>
                <TableCell>LOAN</TableCell>
                <TableCell>Happy</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMIReceiptPage;
