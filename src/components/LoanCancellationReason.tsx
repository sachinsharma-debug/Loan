import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Eye, Edit, Plus, Trash2 } from "lucide-react";
import { LoanCancellationReason } from "@/types";

type LoanCancellationReasonProps = {
  reasons: LoanCancellationReason[];
  onAddReason: (data: { description: string }) => void;
  onUpdateReason: (id: string, data: any) => void;
  onDeleteReason: (id: string) => void;
};

const LoanCancellationReasonComponent = ({
  reasons,
  onAddReason,
  onUpdateReason,
  onDeleteReason,
}: LoanCancellationReasonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [currentItem, setCurrentItem] = useState<LoanCancellationReason | null>(
    null
  );

  const handleAdd = () => {
    setDialogMode("add");
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LoanCancellationReason) => {
    setDialogMode("edit");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleView = (item: LoanCancellationReason) => {
    setDialogMode("view");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reason?")) {
      onDeleteReason(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      description: formData.get("description") as string,
    };

    if (dialogMode === "add") {
      onAddReason(data);
    } else if (dialogMode === "edit" && currentItem) {
      onUpdateReason(currentItem.id, data);
    }

    setIsDialogOpen(false);
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "add":
        return "Add New Reason for Loan Cancellation";
      case "edit":
        return "Edit Reason for Loan Cancellation";
      case "view":
        return "View Reason for Loan Cancellation";
      default:
        return "Reason for Loan Cancellation";
    }
  };

  const isReadOnly = dialogMode === "view";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reason for Loan Cancellation
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Reason for Loan Cancellation Settings
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reason for Loan Cancellation</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reason for Loan Cancellation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{getDialogTitle()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">
                      Reason for Loan Cancellation
                    </Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2 min-h-[80px] border rounded-md p-3 bg-gray-50">
                        {currentItem?.description || ""}
                      </p>
                    ) : (
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter reason for loan cancellation..."
                        defaultValue={currentItem?.description || ""}
                        rows={4}
                        required
                      />
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
                        Update Reason
                      </Button>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full">
                      Add Reason
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
                <TableHead>Reason for Loan Cancellation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reasons.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-md truncate" title={item.description}>
                      {item.description}
                    </div>
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
                        variant="outline"
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

export default LoanCancellationReasonComponent;
