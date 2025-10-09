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

const RecuringPaymentPage = () => {
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
            Recurring Deposit Payment
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="row">
            <div className="col-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="Member" className="text-xs w-32  ">
                  RD-Paid-Branch1 No:
                </Label>
                <Input
                  id="Member"
                  name="Member"
                  
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="col-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="Member" className="text-xs w-32  ">
                  Account:
                </Label>
                <Input
                  id="Member"
                  name="Member"
                  
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="col-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="Member" className="text-xs w-32  ">
                  Member Name:
                </Label>
                <Input
                  id="Member"
                  name="Member"
                  
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="col-4 mt-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="Member" className="text-xs w-32  ">
                  Product:
                </Label>
                <Input
                  id="Member"
                  name="Member"
                  
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
            <div className="col-4 mt-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="Member" className="text-xs w-32  ">
                  Account No:
                </Label>
                <Input
                  id="Member"
                  name="Member"
                  
                  className="h-6 text-xs flex-1"
                  required
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="border-t mt-3">
            <TableHeader>
              <TableRow className="bg-light">
                <TableHead>Particulars</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-20</TableCell>
                <TableCell>Main Branch</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuringPaymentPage;