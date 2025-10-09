import React, { useState } from "react";
import MemberManagement from "@/components/MemberManagement";
import { Member } from "@/types";

// Demo data
const demoMembers: Member[] = [
  {
    id: "1",
    memberName: "Rajesh Kumar",
    memberConfigId: "MEM001",
    kyc: "KYC001",
    areaCode: "AR001",
    areaName: "Mumbai Central",
    occupation: "Business",
    education: "Graduate",
    casteCategory: "General",
    caste: "Brahmin",
    relationship: "Self",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    address: "123 Main Street, Mumbai",
    dateJoined: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    memberName: "Priya Sharma",
    memberConfigId: "MEM002",
    kyc: "KYC002",
    areaCode: "AR002",
    areaName: "Pune West",
    occupation: "Service",
    education: "Post Graduate",
    casteCategory: "OBC",
    caste: "Patel",
    relationship: "Self",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9876543211",
    address: "456 Park Lane, Pune",
    dateJoined: "2024-02-20",
    status: "active",
  },
];

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>(demoMembers);

  const handleAddMember = (memberData: Omit<Member, "id">) => {
    const newMember = {
      ...memberData,
      id: (members.length + 1).toString(),
    };
    setMembers([...members, newMember]);
  };

  const handleUpdateMember = (id: string, memberData: Partial<Member>) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, ...memberData } : member
      )
    );
  };

  return (
    <MemberManagement
      members={members}
      onAddMember={handleAddMember}
      onUpdateMember={handleUpdateMember}
    />
  );
};

export default MembersPage;
