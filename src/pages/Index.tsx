import React, { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import TransactionTypeManager from "@/components/TransactionTypeManager";
import { Member, Loan, DashboardStats, TransactionType } from "@/types";
import TransactionFinserv from "@/components/TransactionFinserv";

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  // State for dashboard stats
  const [members] = useState<Member[]>([]);
  const [loans] = useState<Loan[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );

  const dashboardStats: DashboardStats = {
    totalMembers: members.length,
    activeLoans: loans.filter((l) => l.status === "active").length,
    totalLoanAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
    pendingApplications: loans.filter((l) => l.status === "pending").length,
    collectionsDue: loans.reduce(
      (sum, loan) => sum + (loan.remainingAmount || 0),
      0
    ),
    defaultedLoans: loans.filter((l) => l.status === "defaulted").length,
  };

  // Transaction type handlers
  const handleAddTransactionType = (data: Omit<TransactionType, "id">) => {
    const newTransactionType = {
      ...data,
      id: (transactionTypes.length + 1).toString(),
    };
    setTransactionTypes([...transactionTypes, newTransactionType]);
  };

  const handleUpdateTransactionType = (
    id: string,
    data: Partial<TransactionType>
  ) => {
    setTransactionTypes(
      transactionTypes.map((type) =>
        type.id === id ? { ...type, ...data } : type
      )
    );
  };

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard stats={dashboardStats} />;

      case "transaction-finserv":
        return <TransactionFinserv />;

      case "transaction-type":
        return (
          <TransactionTypeManager
            transactionTypes={transactionTypes}
            onAddTransactionType={handleAddTransactionType}
            onUpdateTransactionType={handleUpdateTransactionType}
          />
        );

      default:
        return <Dashboard stats={dashboardStats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;
