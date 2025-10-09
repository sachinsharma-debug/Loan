import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { toast } from "react-toastify";
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
import { Eye, Edit, Plus, Trash2, Trash } from "lucide-react";
import { KYC } from "@/types";

type KycProps = {
  kycs: KYC[];
  onAddKYC: (data: Omit<KYC, "id">) => Promise<void> | void;
  onUpdateKYC: (id: string, data: Partial<KYC>) => Promise<void> | void;
  onDeleteKYC?: (id: string) => Promise<void> | void;
  loading?: boolean;
};

const KycComponent = ({
  kycs,
  onAddKYC,
  onUpdateKYC,
  onDeleteKYC,
  loading,
}: KycProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KYC | null>(null);
  const [viewingItem, setViewingItem] = useState<KYC | null>(null);

  // Single document state for Add KYC dialog
  const [document, setDocument] = useState("");
  const [documentCategory, setDocumentCategory] = useState<
    | "Identity Proof"
    | "Address Proof"
    | "Income Proof"
    | "Business Documents"
    | "Other Documents"
  >("Identity Proof");
  const [noOfCopy, setNoOfCopy] = useState(1);
  const [mandatory, setMandatory] = useState<"yes" | "no">("yes");
  const [requirementType, setRequirementType] = useState<
    "Original" | "Photo Copy"
  >("Original");

  const handleDelete = async (item: KYC) => {
    if (!onDeleteKYC) return;

    if (
      window.confirm("Are you sure you want to delete this KYC document set?")
    ) {
      try {
        await onDeleteKYC(item.id);
        toast.success("KYC documents deleted successfully");
      } catch (error) {
        toast.error("Failed to delete KYC documents");
      }
    }
  };

  const handleEdit = (item: KYC) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleView = (item: KYC) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData(e.currentTarget);

    const updatedData: Partial<KYC> = {
      document: formData.get("document") as string,
      noOfCopy: Number(formData.get("noOfCopy")) || 1,
      mandatory: formData.get("mandatory") as "yes" | "no",
      requirementType: formData.get("type") as "Original" | "Photo Copy",
    };

    try {
      await onUpdateKYC(editingItem.id, updatedData);
      toast.success("Document updated successfully");
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Failed to update document");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (document.trim() === "") {
      toast.error("Please enter a document name");
      return;
    }

    const kycData: Omit<KYC, "id"> & { documentCategory: string } = {
      document: document.trim(),
      documentCategory: documentCategory,
      noOfCopy: noOfCopy,
      mandatory: mandatory,
      requirementType: requirementType,
    };

    try {
      await onAddKYC(kycData);
      toast.success("Document added successfully");
      setIsAddDialogOpen(false);

      // Reset form fields
      setDocument("");
      setNoOfCopy(1);
      setMandatory("yes");
      setRequirementType("Original");
      setDocumentCategory("Identity Proof");
    } catch (error) {
      console.error("Failed to add document:", error);
      toast.error(
        "Failed to add document. Please check the console for details."
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KYCs</h1>
          <p className="text-gray-600 mt-2">Manage KYCs Document</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>KYCs</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Document</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAddSubmit}
                  onKeyDown={createFormKeyDownHandler()}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-40 text-right">
                        Document:
                      </Label>
                      <Input
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        placeholder="Enter document name"
                        className="h-6 text-xs flex-1"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-40 text-right">
                        Document Category:
                      </Label>
                      <div className="flex-1">
                        <Select
                          value={documentCategory}
                          onValueChange={(v) => setDocumentCategory(v as any)}
                        >
                          <SelectTrigger className="h-6 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="Identity Proof">
                              Identity Proof
                            </SelectItem>
                            <SelectItem value="Address Proof">
                              Address Proof
                            </SelectItem>
                            <SelectItem value="Income Proof">
                              Income Proof
                            </SelectItem>
                            <SelectItem value="Business Documents">
                              Business Documents
                            </SelectItem>
                            <SelectItem value="Other Documents">
                              Other Documents
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-40 text-right">
                        No of Copy:
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={noOfCopy}
                        onChange={(e) =>
                          setNoOfCopy(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="h-6 text-xs w-28"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-40 text-right">
                        Mandatory:
                      </Label>
                      <div className="flex-1">
                        <Select
                          value={mandatory}
                          onValueChange={(v) => setMandatory(v as "yes" | "no")}
                        >
                          <SelectTrigger className="h-6 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-40 text-right">
                        Requirement Type:
                      </Label>
                      <div className="flex-1">
                        <Select
                          value={requirementType}
                          onValueChange={(v) =>
                            setRequirementType(v as "Original" | "Photo Copy")
                          }
                        >
                          <SelectTrigger className="h-6 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="Original">Original</SelectItem>
                            <SelectItem value="Photo Copy">
                              Photo Copy
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                    <Button type="submit">Add Document</Button>
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
                <TableHead>Document Name</TableHead>
                <TableHead>Document Category</TableHead>
                <TableHead>No of Copies</TableHead>
                <TableHead>Mandatory</TableHead>
                <TableHead>Requirement Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span className="text-gray-500">
                        Loading documents...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : kycs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No KYC documents found. Add some documents to get started.
                  </TableCell>
                </TableRow>
              ) : (
                kycs.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.document}
                    </TableCell>
                    <TableCell>{item.documentCategory}</TableCell>
                    <TableCell>{item.noOfCopy}</TableCell>
                    <TableCell>
                      {item.mandatory === "yes" ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>{item.requirementType}</TableCell>
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
                        {onDeleteKYC && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={createFormKeyDownHandler()}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="document">Document Name</Label>
                  <Input
                    id="document"
                    name="document"
                    defaultValue={editingItem.document}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="documentCategory">Document Category</Label>
                  <Select
                    name="documentCategory"
                    defaultValue={
                      editingItem.documentCategory || "Identity Proof"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Identity Proof">
                        Identity Proof
                      </SelectItem>
                      <SelectItem value="Address Proof">
                        Address Proof
                      </SelectItem>
                      <SelectItem value="Income Proof">Income Proof</SelectItem>
                      <SelectItem value="Business Documents">
                        Business Documents
                      </SelectItem>
                      <SelectItem value="Other Documents">
                        Other Documents
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="noOfCopy">No of Copies</Label>
                  <Input
                    id="noOfCopy"
                    name="noOfCopy"
                    type="number"
                    min={1}
                    defaultValue={editingItem.noOfCopy}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mandatory">Mandatory</Label>
                  <Select name="mandatory" defaultValue={editingItem.mandatory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requirementType">Requirement Type</Label>
                  <Select
                    name="requirementType"
                    defaultValue={editingItem.requirementType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Original">Original</SelectItem>
                      <SelectItem value="Photo Copy">Photo Copy</SelectItem>
                    </SelectContent>
                  </Select>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Document Name:</Label>
                  <p className="text-gray-700">{viewingItem.document}</p>
                </div>
                <div>
                  <Label className="font-medium">Document Category:</Label>
                  <p className="text-gray-700">
                    {viewingItem.documentCategory}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">No of Copies:</Label>
                  <p className="text-gray-700">{viewingItem.noOfCopy}</p>
                </div>
                <div>
                  <Label className="font-medium">Mandatory:</Label>
                  <p className="text-gray-700">
                    {viewingItem.mandatory === "yes" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Requirement Type:</Label>
                  <p className="text-gray-700">{viewingItem.requirementType}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {onDeleteKYC && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this KYC document?"
                        )
                      ) {
                        try {
                          await onDeleteKYC(viewingItem.id);
                          toast.success("KYC document deleted successfully");
                          setIsViewDialogOpen(false);
                        } catch (error) {
                          toast.error("Failed to delete KYC document");
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
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

export default KycComponent;
