import React, { useState } from "react";
import LoanTransactions from "@/components/LoanTransactions";
import { Loan, LoanTransaction } from "@/types";

// Demo data
const demoLoans: Loan[] = [
  {
    id: "1",
    loanId: "LOAN001",
    memberId: "1",
    memberName: "Rajesh Kumar",
    amount: 50000,
    interestRate: 12,
    duration: 12,
    objective: "Business expansion",
    penaltyMode: "daily",
    status: "active",
    appliedDate: "2024-01-20",
    approvedDate: "2024-01-22",
    remainingAmount: 45000,
    currentStep: 3,
  },
];

const demoTransactions: LoanTransaction[] = [
  {
    id: "1",
    loanId: "1",
    step: 1,
    type: "application",
    status: "completed",
    date: "2024-01-20",
    notes: "Loan application submitted",
    completedBy: "Rajesh Kumar",
  },
  {
    id: "2",
    loanId: "1",
    step: 2,
    type: "approval",
    status: "completed",
    date: "2024-01-22",
    notes: "Loan approved by manager",
    completedBy: "Manager",
  },
];

const TransactionsPage = () => {
  const [loans] = useState<Loan[]>(demoLoans);
  const [transactions, setTransactions] =
    useState<LoanTransaction[]>(demoTransactions);

  const handleAddTransaction = (
    transactionData: Omit<LoanTransaction, "id">
  ) => {
    const newTransaction = {
      ...transactionData,
      id: (transactions.length + 1).toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleUpdateTransaction = (
    id: string,
    transactionData: Partial<LoanTransaction>
  ) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...transactionData }
          : transaction
      )
    );
  };

  return (
    <LoanTransactions
      loans={loans}
      transactions={transactions}
      onAddTransaction={handleAddTransaction}
      onUpdateTransaction={handleUpdateTransaction}
    />
  );
};

export default TransactionsPage;
