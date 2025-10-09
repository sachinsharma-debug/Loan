import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DealerReceivablePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dealer Receivable
          </h1>
          <p className="text-gray-600 mt-2">Manage dealer receivable records</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Seizure</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="nameOfDealer">Name of Dealer</Label>
              <Input id="nameOfDealer" name="nameOfDealer" required />
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

export default DealerReceivablePage;
