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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Eye } from "lucide-react";
import { Member } from "@/types";

interface MemberManagementProps {
  members: Member[];
  onAddMember: (member: Partial<Member>) => void;
  onUpdateMember: (id: string, member: Partial<Member>) => void;
}

const MemberManagement = ({
  members,
  onAddMember,
  onUpdateMember,
}: MemberManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState<
    Partial<Member> & { status: string }
  >({
    memberConfigId: "",
    kyc: "",
    areaCode: "",
    areaName: "",
    occupation: "",
    education: "",
    casteCategory: "",
    caste: "",
    relationship: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
  });

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberConfigId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    const memberToAdd = {
      ...newMember,
      memberName: newMember.name,
      dateJoined: new Date().toISOString().split("T")[0],
    };
    onAddMember(memberToAdd);
    setNewMember({
      memberConfigId: "",
      kyc: "",
      areaCode: "",
      areaName: "",
      occupation: "",
      education: "",
      casteCategory: "",
      caste: "",
      relationship: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "active",
    });
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Member Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage member profiles and information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memberConfigId">Member Config ID</Label>
                <Input
                  id="memberConfigId"
                  value={newMember.memberConfigId}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      memberConfigId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kyc">KYC</Label>
                <Input
                  id="kyc"
                  value={newMember.kyc}
                  onChange={(e) =>
                    setNewMember({ ...newMember, kyc: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaCode">Area Code</Label>
                <Input
                  id="areaCode"
                  value={newMember.areaCode}
                  onChange={(e) =>
                    setNewMember({ ...newMember, areaCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaName">Area Name</Label>
                <Input
                  id="areaName"
                  value={newMember.areaName}
                  onChange={(e) =>
                    setNewMember({ ...newMember, areaName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={newMember.occupation}
                  onChange={(e) =>
                    setNewMember({ ...newMember, occupation: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={newMember.education}
                  onChange={(e) =>
                    setNewMember({ ...newMember, education: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="casteCategory">Caste Category</Label>
                <Input
                  id="casteCategory"
                  value={newMember.casteCategory}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      casteCategory: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  value={newMember.caste}
                  onChange={(e) =>
                    setNewMember({ ...newMember, caste: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newMember.relationship}
                  onChange={(e) =>
                    setNewMember({ ...newMember, relationship: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newMember.address}
                  onChange={(e) =>
                    setNewMember({ ...newMember, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredMembers.length} of {members.length} members
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.memberConfigId}
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.areaName}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>{member.dateJoined}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
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
    </div>
  );
};

export default MemberManagement;
