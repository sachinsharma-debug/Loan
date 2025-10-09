import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Eye, Edit, Plus } from "lucide-react";
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { CasteCategory } from "@/types";

type CasteCategoryProps = {
  casteCategories: CasteCategory[];
  onAddCasteCategory: (data: { casteCategoryName: string }) => void;
  onUpdateCasteCategory: (id: string, data: any) => void;
};

const CasteCategoryComponent = ({
  casteCategories,
  onAddCasteCategory,
  onUpdateCasteCategory,
}: CasteCategoryProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CasteCategory | null>(null);
  const [viewingItem, setViewingItem] = useState<CasteCategory | null>(null);

  const handleEdit = (item: CasteCategory) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleView = (item: CasteCategory) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData(e.currentTarget);
    onUpdateCasteCategory(editingItem.id, {
      casteCategoryName: formData.get("casteCategoryName") as string,
    });
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAddCasteCategory({
      casteCategoryName: formData.get("casteCategoryName") as string,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caste Category</h1>
          <p className="text-gray-600 mt-2">Manage Caste Categories</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Caste Category</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Caste Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Caste Category</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAddSubmit}
                  onKeyDown={createFormKeyDownHandler()}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="casteCategoryName">
                        Caste Category Name
                      </Label>
                      <Input
                        id="casteCategoryName"
                        name="casteCategoryName"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Caste Category</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caste Category Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {casteCategories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.casteCategoryName}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Caste Category</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-casteCategoryName">
                    Caste Category Name
                  </Label>
                  <Input
                    id="edit-casteCategoryName"
                    name="casteCategoryName"
                    defaultValue={editingItem.casteCategoryName}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Caste Category</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Caste Category Name</Label>
                  <p className="text-sm text-gray-600">
                    {viewingItem.casteCategoryName}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CasteCategoryComponent;
