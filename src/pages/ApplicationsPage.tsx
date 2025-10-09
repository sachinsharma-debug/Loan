import React, { useState } from "react";
import LoanManagement from "@/components/LoanManagement";
import { Loan, Member } from "@/types";

// Demo data for pending loan applications
const demoPendingLoans: Loan[] = [
  {
    id: "2",
    loanId: "LOAN002",
    memberId: "2",
    memberName: "Priya Sharma",
    amount: 25000,
    interestRate: 10,
    duration: 6,
    objective: "Personal use",
    penaltyMode: "monthly",
    status: "pending",
    appliedDate: "2024-02-15",
    remainingAmount: 25000,
    currentStep: 1,
  },
];

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

const ApplicationsPage = () => {
  const [loans, setLoans] = useState<Loan[]>(demoPendingLoans);
  const [members] = useState<Member[]>(demoMembers);

  const handleAddLoan = (loanData: Omit<Loan, "id">) => {
    const newLoan = {
      ...loanData,
      id: (loans.length + 1).toString(),
    };
    setLoans([...loans, newLoan]);
  };

  const handleUpdateLoan = (id: string, loanData: Partial<Loan>) => {
    setLoans(
      loans.map((loan) => (loan.id === id ? { ...loan, ...loanData } : loan))
    );
  };

  return (
    <LoanManagement
      loans={loans.filter((l) => l.status === "pending")}
      members={members}
      onAddLoan={handleAddLoan}
      onUpdateLoan={handleUpdateLoan}
    />
  );
};

export default ApplicationsPage;
