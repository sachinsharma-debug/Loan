import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InterestGenerationPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Interest Generation
          </h1>
          <p className="text-gray-600 mt-2">
            Manage interest generation records
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interest Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="asOn">As On</Label>
                <Input type="date" id="asOn" name="asOn" required />
              </div>
              <div>
                <Label htmlFor="lastInterestGeneratedOn">
                  Last Interest generated on
                </Label>
                <Input
                  type="date"
                  id="lastInterestGeneratedOn"
                  name="lastInterestGeneratedOn"
                  required
                />
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

export default InterestGenerationPage;
