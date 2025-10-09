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
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { Plus, Edit, Eye, Trash2, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

const goldCarats = [10, 12, 14, 18, 22, 24];

interface GoldRateSet {
  id: string;
  date: string;
  rates: { [carat: number]: string };
}

const GoldPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [goldRateSets, setGoldRateSets] = useState<GoldRateSet[]>([]);
  const [editingRateSet, setEditingRateSet] = useState<GoldRateSet | null>(
    null
  );
  const [viewingRateSet, setViewingRateSet] = useState<GoldRateSet | null>(
    null
  );
  const [formKey, setFormKey] = useState(0);
  const today = new Date().toISOString().slice(0, 10);

  // Search state
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const date = formData.get("date") as string;
    const rates: { [carat: number]: string } = {};

    goldCarats.forEach((carat) => {
      const rate = formData.get(`rate_${carat}`) as string;
      if (rate && rate.trim() !== "") {
        rates[carat] = rate;
      }
    });

    if (Object.keys(rates).length === 0) {
      toast.error("Please enter at least one gold rate");
      return;
    }

    const newRateSet: GoldRateSet = {
      id: editingRateSet ? editingRateSet.id : `${date}-${Date.now()}`,
      date,
      rates,
    };

    if (editingRateSet) {
      setGoldRateSets((prev) =>
        prev.map((rateSet) =>
          rateSet.id === editingRateSet.id ? newRateSet : rateSet
        )
      );
      toast.success("Gold rates updated successfully");
    } else {
      setGoldRateSets((prev) => [newRateSet, ...prev]);
      toast.success("Gold rates added successfully");
    }

    setIsDialogOpen(false);
    setEditingRateSet(null);
  };

  const openEditDialog = (rateSet: GoldRateSet) => {
    setEditingRateSet(rateSet);
    setFormKey((k) => k + 1);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingRateSet(null);
    setFormKey((k) => k + 1);
    setIsDialogOpen(true);
  };

  const openViewDialog = (rateSet: GoldRateSet) => {
    setViewingRateSet(rateSet);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (rateSet: GoldRateSet) => {
    const confirm = window.confirm(
      `Are you sure you want to delete gold rates for ${rateSet.date}?`
    );
    if (!confirm) return;

    setGoldRateSets((prev) => prev.filter((set) => set.id !== rateSet.id));
    toast.success("Gold rates deleted successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-8 w-8" />
              <span>Gold Rate Settings</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage gold rates for different carats
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Set Gold Rate
          </Button>
        </div>
      </div>
      {/* Single Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRateSet
                ? `Edit Gold Rates for ${editingRateSet.date}`
                : `Set Gold Rate for ${today}`}
            </DialogTitle>
          </DialogHeader>
          <form
            key={formKey}
            onSubmit={handleSubmit}
            onKeyDown={createFormKeyDownHandler()}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={editingRateSet ? editingRateSet.date : today}
                required
              />
            </div>
            <div className="space-y-3">
              <Label>Gold Rates (per Gram)</Label>
              {goldCarats.map((carat) => (
                <div key={carat} className="flex items-center justify-between">
                  <Label className="w-16">{carat} Carat</Label>
                  <Input
                    name={`rate_${carat}`}
                    type="number"
                    step="0.01"
                    placeholder="Rate"
                    defaultValue={editingRateSet?.rates[carat] || ""}
                    className="w-32"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingRateSet(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingRateSet ? "Update" : "Save"} Gold Rates
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <CardTitle>Gold Rates</CardTitle>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500 mb-1">
                Search by Date Range
              </span>
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                <span className="text-sm text-gray-600">From</span>
                <Input
                  id="search-from"
                  type="date"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-32 h-8 px-2 py-1 text-sm border-none bg-transparent focus:ring-0"
                />
                <span className="text-sm text-gray-600 ml-2">To</span>
                <Input
                  id="search-to"
                  type="date"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-32 h-8 px-2 py-1 text-sm border-none bg-transparent focus:ring-0"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {goldCarats.map((carat) => (
                  <TableHead key={carat}>{carat}K</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Filter by date range
                let filtered = goldRateSets;
                if (searchFrom) {
                  filtered = filtered.filter((set) => set.date >= searchFrom);
                }
                if (searchTo) {
                  filtered = filtered.filter((set) => set.date <= searchTo);
                }
                if (filtered.length === 0) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={goldCarats.length + 2}
                        className="text-center py-8 text-gray-500"
                      >
                        No gold rates found for selected date range.
                      </TableCell>
                    </TableRow>
                  );
                }
                return filtered.map((rateSet) => (
                  <TableRow key={rateSet.id}>
                    <TableCell className="font-medium">
                      {rateSet.date}
                    </TableCell>
                    {goldCarats.map((carat) => (
                      <TableCell key={carat}>
                        {rateSet.rates[carat]
                          ? `₹${rateSet.rates[carat]}`
                          : "-"}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewDialog(rateSet)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(rateSet)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(rateSet)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gold Rate Details</DialogTitle>
          </DialogHeader>
          {viewingRateSet && (
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {viewingRateSet.date}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gold Rates (per Gram)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {goldCarats.map((carat) => (
                    <div
                      key={carat}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{carat}K:</span>
                      <span className="text-lg font-semibold">
                        {viewingRateSet.rates[carat]
                          ? `₹${viewingRateSet.rates[carat]}`
                          : "-"}
                      </span>
                    </div>
                  ))}
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

export default GoldPage;
