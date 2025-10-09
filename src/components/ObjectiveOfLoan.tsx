import React, { useState, useEffect } from "react";
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

import { objectiveOfLoanApi } from "@/api/objectiveOfLoanApi";
import { toast } from "react-toastify";
import { ObjectiveOfLoan } from "@/types";

// Remove props, use API instead

const ObjectiveOfLoanComponent = () => {
  const [objectives, setObjectives] = useState<ObjectiveOfLoan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [currentItem, setCurrentItem] = useState<ObjectiveOfLoan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch objectives from API
  useEffect(() => {
    const loadObjectives = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await objectiveOfLoanApi.getAll();
        if (Array.isArray(data)) {
          setObjectives(data);
        } else if (data && Array.isArray((data as any).data)) {
          setObjectives((data as any).data);
        } else {
          setObjectives([]);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching objectives");
        toast.error(err.message || "Error fetching objectives");
        setObjectives([]);
      } finally {
        setLoading(false);
      }
    };
    loadObjectives();
  }, []);

  // Add objective via API utility
  const onAddObjective = async (data: { description: string }) => {
    setLoading(true);
    setError(null);
    try {
      const newObj = await objectiveOfLoanApi.create(data);
      setObjectives((prev) => [...prev, newObj]);
      toast.success("Objective added successfully");
    } catch (err: any) {
      setError(err.message || "Error adding objective");
      toast.error(err.message || "Error adding objective");
    } finally {
      setLoading(false);
    }
  };

  // Update objective via API utility
  const onUpdateObjective = async (
    id: string,
    data: { description: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await objectiveOfLoanApi.update(id, data);
      setObjectives((prev) =>
        prev.map((obj) => (obj.id === id ? updated : obj))
      );
      toast.success("Objective updated successfully");
    } catch (err: any) {
      setError(err.message || "Error updating objective");
      toast.error(err.message || "Error updating objective");
    } finally {
      setLoading(false);
    }
  };

  // Delete objective via API utility
  const onDeleteObjective = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this objective?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await objectiveOfLoanApi.delete(id);
      setObjectives((prev) => prev.filter((obj) => obj.id !== id));
      toast.success("Objective deleted successfully");
    } catch (err: any) {
      setError(err.message || "Error deleting objective");
      toast.error(err.message || "Error deleting objective");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setDialogMode("add");
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ObjectiveOfLoan) => {
    setDialogMode("edit");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleView = (item: ObjectiveOfLoan) => {
    setDialogMode("view");
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onDeleteObjective(id);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      description: formData.get("description") as string,
    };

    if (dialogMode === "add") {
      onAddObjective(data);
    } else if (dialogMode === "edit" && currentItem) {
      onUpdateObjective(currentItem.id, data);
    }

    setIsDialogOpen(false);
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "add":
        return "Add New Objective of Loan";
      case "edit":
        return "Edit Objective of Loan";
      case "view":
        return "View Objective of Loan";
      default:
        return "Objective of Loan";
    }
  };

  const isReadOnly = dialogMode === "view";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Objective of Loan
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Objective of Loan Settings
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Objective of Loan</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Objective of Loan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{getDialogTitle()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Objective of Loan</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-gray-600 py-2 min-h-[80px] border rounded-md p-3 bg-gray-50">
                        {currentItem?.description || ""}
                      </p>
                    ) : (
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter objective of loan description..."
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
                        Update Objective
                      </Button>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full">
                      Add Objective
                    </Button>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-blue-600 mb-2">Loading...</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Objective of Loan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objectives.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    No objectives found.
                  </TableCell>
                </TableRow>
              ) : (
                objectives.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div
                        className="max-w-md truncate"
                        title={item.description}
                      >
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
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectiveOfLoanComponent;
