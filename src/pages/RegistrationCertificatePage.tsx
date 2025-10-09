import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Building, MapPin, Eye } from "lucide-react";

const RegistrationCertificatePage = () => {
  const [activeTab, setActiveTab] = useState("parent-company");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Registration Certificate
          </h1>
          <p className="text-gray-600 mt-2">
            Manage vehicle registration certificates
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Input</span>
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Given</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Registration Certificate(Input)</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Member Name</Label>
                    <Input id="memberName" name="memberName" required />
                  </div>
                  <div>
                    <Label htmlFor="applicationNo">Application No</Label>
                    <Input id="applicationNo" name="applicationNo" required />
                  </div>
                  <div>
                    <Label htmlFor="loanId">Loan ID</Label>
                    <Input id="loanId" name="loanId" required />
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input id="nameOnCard" name="nameOnCard" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleRegNo">
                      Vehicle Registration No
                    </Label>
                    <Input id="vehicleRegNo" name="vehicleRegNo" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input id="vehicleModel" name="vehicleModel" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleMake">Vehicle Make</Label>
                    <Input id="vehicleMake" name="vehicleMake" required />
                  </div>
                  <div>
                    <Label htmlFor="inputDate">Input Date</Label>
                    <Input
                      type="date"
                      id="inputDate"
                      name="inputDate"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rcStatus">RC Status</Label>
                    <Input id="rcStatus" name="rcStatus" required />
                  </div>
                  <div>
                    <Label htmlFor="rcNo">RC No</Label>
                    <Input id="rcNo" name="rcNo" required />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="given">
          <Card>
            <CardHeader>
              <CardTitle>Registration Certificate(Given)</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Member Name</Label>
                    <Input id="memberName" name="memberName" required />
                  </div>
                  <div>
                    <Label htmlFor="applicationNo">Application No</Label>
                    <Input id="applicationNo" name="applicationNo" required />
                  </div>
                  <div>
                    <Label htmlFor="loanId">Loan ID</Label>
                    <Input id="loanId" name="loanId" required />
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input id="nameOnCard" name="nameOnCard" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleRegNo">
                      Vehicle Registration No
                    </Label>
                    <Input id="vehicleRegNo" name="vehicleRegNo" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input id="vehicleModel" name="vehicleModel" required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleMake">Vehicle Make</Label>
                    <Input id="vehicleMake" name="vehicleMake" required />
                  </div>
                  <div>
                    <Label htmlFor="inputDate">Input Date</Label>
                    <Input
                      type="date"
                      id="inputDate"
                      name="inputDate"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rcStatus">RC Status</Label>
                    <Input id="rcStatus" name="rcStatus" required />
                  </div>
                  <div>
                    <Label htmlFor="rcNo">RC No</Label>
                    <Input id="rcNo" name="rcNo" required />
                  </div>
                  <div>
                    <Label htmlFor="givenDate">Given Date</Label>
                    <Input
                      type="date"
                      id="givenDate"
                      name="givenDate"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reasonForRcGiven">
                      Reason for RC Given
                    </Label>
                    <Input
                      id="reasonForRcGiven"
                      name="reasonForRcGiven"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistrationCertificatePage;
