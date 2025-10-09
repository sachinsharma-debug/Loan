import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import LoginForm from "@/components/LoginForm";
import Header from "./Header";

const LayoutContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from current route
  const getActiveTabFromPath = (pathname: string) => {
    const path = pathname.substring(1); // Remove leading slash
    return path || "dashboard";
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabChange = (tab: string) => {
    // Navigate to the corresponding route
    navigate(tab === "dashboard" ? "/" : `/${tab}`);
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 overflow-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
};

export default Layout;
