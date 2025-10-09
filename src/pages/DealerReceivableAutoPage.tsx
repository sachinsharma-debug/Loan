import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DealerReceivablePage from "./DealerReceivablePage";

const DealerReceivableAutoPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dealer Receivable (Auto)
          </h1>
          <p className="text-gray-600 mt-2">Manage dealer receivable records</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member to Dealer Receipt & Company Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dealer">Dealer</Label>
                <Input id="dealer" name="dealer" required />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input type="date" id="dueDate" name="dueDate" required />
              </div>
              <div>
                <Label htmlFor="vchGenerationFor">Vch Generation for</Label>
                <Input id="vchGenerationFor" name="vchGenerationFor" required />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerReceivableAutoPage;
