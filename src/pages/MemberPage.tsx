import React from "react";
import MemberComponent from "@/components/Member";

const MemberPage = () => {
  // Example data and handlers; replace with actual logic or state as needed
  const members = [];
  const onAddMember = (member: any) => {
    // Add member logic here
  };
  const onUpdateMember = (member: any) => {
    // Update member logic here
  };

  return (
    <MemberComponent
      members={members}
      onAddMember={onAddMember}
      onUpdateMember={onUpdateMember}
    />
  );
};

export default MemberPage;
