import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Building, MapPin, Eye } from "lucide-react";

const VehicleInsurancePage = () => {
  const [activeTab, setActiveTab] = useState("parent-company");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Vehicle Insurance
          </h1>
          <p className="text-gray-600 mt-2">
            Manage vehicle insurance policies
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Create</span>
          </TabsTrigger>
          <TabsTrigger value="alter" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Alter</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Insurance Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Choose Member Name</Label>
                    <Input id="memberName" name="memberName" required />
                  </div>
                  <div>
                    <Label htmlFor="applicationNo">Application No.</Label>
                    <Input id="applicationNo" name="applicationNo" required />
                  </div>
                  <div>
                    <Label htmlFor="loanId">Loan ID</Label>
                    <Input id="loanId" name="loanId" required />
                  </div>
                  <div>
                    <Label htmlFor="loanProduct">Loan Product</Label>
                    <Input id="loanProduct" name="loanProduct" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleRegNo">
                      Vehicle Registration No.
                    </Label>
                    <Input id="vehicleRegNo" name="vehicleRegNo" required />
                  </div>
                  <div>
                    <Label htmlFor="chassisNo">Chassis No.</Label>
                    <Input id="chassisNo" name="chassisNo" required />
                  </div>
                  <div>
                    <Label htmlFor="policyDate">Policy Date</Label>
                    <Input
                      type="date"
                      id="policyDate"
                      name="policyDate"
                      required
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Policy Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceCompany">
                      Name of Insurance Company
                    </Label>
                    <Input
                      id="insuranceCompany"
                      name="insuranceCompany"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyNo">Policy No.</Label>
                    <Input id="policyNo" name="policyNo" required />
                  </div>
                  <div>
                    <Label htmlFor="policyAmount">Policy Amount</Label>
                    <Input id="policyAmount" name="policyAmount" required />
                  </div>
                  <div>
                    <Label htmlFor="policyTenure">Policy Tenure</Label>
                    <Input id="policyTenure" name="policyTenure" required />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextPremiumDate">Next Premium Date</Label>
                    <Input
                      type="date"
                      id="nextPremiumDate"
                      name="nextPremiumDate"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alter">
          <Card>
            <CardHeader>
              <CardTitle>Alter</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="nameOfInsured">Name of Insured</Label>
                  <Input id="nameOfInsured" name="nameOfInsured" required />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleInsurancePage;
