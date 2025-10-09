import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to the Loan Product landing page which lists related settings
    navigate("/loan-product", { replace: true });
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Redirecting to loan settings...</p>
      </div>
    </div>
  );
};

export default SettingsPage;
