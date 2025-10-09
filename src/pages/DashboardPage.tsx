import React from "react";
import Dashboard from "@/components/Dashboard";
import { DashboardStats } from "@/types";

// Demo data for dashboard stats
const dashboardStats: DashboardStats = {
  totalMembers: 0,
  activeLoans: 0,
  totalLoanAmount: 0,
  pendingApplications: 0,
  collectionsDue: 0,
  defaultedLoans: 0,
};

const DashboardPage = () => {
  return <Dashboard stats={dashboardStats} />;
};

export default DashboardPage;
