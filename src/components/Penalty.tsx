import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Plus, Trash2 } from "lucide-react";
import { Penalty } from "@/types";

type PenaltyProps = {
  penalties: Penalty[];
  onAddPenalty: (data: {
    penaltyType: "percentage" | "fixed";
    value: number;
    penaltyMode: "daywise" | "monthly" | "yearly";
    penaltyApplyOn: "principal" | "interest" | "total";
  }) => void;
  onUpdatePenalty: (id: string, data: any) => void;
  onDeletePenalty: (id: string) => void;
};

const PenaltyComponent = ({
  penalties,
  onAddPenalty,
  onUpdatePenalty,
  onDeletePenalty,
}: PenaltyProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [currentItem, setCurrentItem] = useState<Penalty | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Penalty) => {
    setDialogMode("edit");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleView = (item: Penalty) => {
    setDialogMode("view");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this penalty?")) {
      try {
        await onDeletePenalty(id);
        toast.success("Penalty deleted successfully");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete penalty");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      penaltyType: formData.get("penaltyType") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      penaltyMode: formData.get("penaltyMode") as
        | "daywise"
        | "monthly"
        | "yearly",
      penaltyApplyOn: formData.get("penaltyApplyOn") as
        | "principal"
        | "interest"
        | "total",
    };

    try {
      if (dialogMode === "add") {
        await onAddPenalty(data);
        toast.success("Penalty added successfully");
      } else if (dialogMode === "edit" && currentItem) {
        await onUpdatePenalty(currentItem.id, data);
        toast.success("Penalty updated successfully");
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save penalty");
    }
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "add":
        return "Add New Penalty";
      case "edit":
        return "Edit Penalty";
      case "view":
        return "View Penalty";
      default:
        return "Penalty";
    }
  };

  const isReadOnly = dialogMode === "view";

  const formatPenaltyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatPenaltyMode = (mode: string) => {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  const formatPenaltyApplyOn = (applyOn: string) => {
    return applyOn.charAt(0).toUpperCase() + applyOn.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penalty</h1>
          <p className="text-gray-600 mt-2">Manage Penalty Settings</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Penalty</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Penalty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{getDialogTitle()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="penaltyType">Penalty Type</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2">
                        {currentItem
                          ? formatPenaltyType(currentItem.penaltyType)
                          : ""}
                      </p>
                    ) : (
                      <Select
                        name="penaltyType"
                        required
                        defaultValue={currentItem?.penaltyType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select penalty type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="value">Value</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2">
                        {currentItem
                          ? currentItem.penaltyType === "percentage"
                            ? `${currentItem.value}`
                            : `₹${currentItem.value}`
                          : ""}
                      </p>
                    ) : (
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={currentItem?.value || ""}
                        required
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="penaltyMode">Penalty Mode</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2">
                        {currentItem
                          ? formatPenaltyMode(currentItem.penaltyMode)
                          : ""}
                      </p>
                    ) : (
                      <Select
                        name="penaltyMode"
                        required
                        defaultValue={currentItem?.penaltyMode || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select penalty mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daywise">Daywise</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="penaltyApplyOn">Penalty Apply On</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2">
                        {currentItem
                          ? formatPenaltyApplyOn(currentItem.penaltyApplyOn)
                          : ""}
                      </p>
                    ) : (
                      <Select
                        name="penaltyApplyOn"
                        required
                        defaultValue={currentItem?.penaltyApplyOn || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select apply on" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="interest">Interest</SelectItem>
                          <SelectItem value="total">Total</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {isReadOnly ? (
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  ) : dialogMode === "edit" ? (
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Update Penalty
                      </Button>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full">
                      Add Penalty
                    </Button>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penalty Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Penalty Mode</TableHead>
                <TableHead>Penalty Apply On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penalties.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {formatPenaltyType(item.penaltyType)}
                  </TableCell>
                  <TableCell>
                    {item.penaltyType === "percentage"
                      ? `${item.value}`
                      : `₹${item.value}`}
                  </TableCell>
                  <TableCell>{formatPenaltyMode(item.penaltyMode)}</TableCell>
                  <TableCell>
                    {formatPenaltyApplyOn(item.penaltyApplyOn)}
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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

export default PenaltyComponent;
