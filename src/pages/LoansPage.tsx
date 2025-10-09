import React, { useState } from "react";
import LoanManagement from "@/components/LoanManagement";
import { Loan, Member } from "@/types";

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members] = useState<Member[]>([]);

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
      loans={loans}
      members={members}
      onAddLoan={handleAddLoan}
      onUpdateLoan={handleUpdateLoan}
    />
  );
};

export default LoansPage;
