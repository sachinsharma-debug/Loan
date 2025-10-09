import React from "react";
import { useNavigate } from "react-router-dom";
import { PackageOpen, Percent, Target, Ban } from "lucide-react";

const items = [
  {
    id: "penalty",
    label: "Penalty",
    description: "Define penalty rules and rates",
    icon: Percent,
    to: "/penalty",
  },
  {
    id: "objective-of-loan",
    label: "Objective of loan",
    description: "Maintain allowed loan objectives",
    icon: Target,
    to: "/objective-of-loan",
  },
  {
    id: "loan-cancellation-reasons",
    label: "Reason for loan cancellation",
    description: "Manage cancellation reasons",
    icon: Ban,
    to: "/loan-cancellation-reasons",
  },
  {
    id: "gold",
    label: "Gold",
    description: "Set and manage gold rates",
    icon: Percent,
    to: "/gold",
  },
  {
    id: "kyc",
    label: "KYC",
    description: "Manage KYC key-value data",
    icon: Target,
    to: "/kyc",
  },
  {
    id: "manage-loan-product",
    label: "Loan Product",
    description: "Configure loan product types and parameters",
    icon: PackageOpen,
    to: "/loan-product",
  },
];

const LoanSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Settings</h1>
      <div className="flex flex-col gap-3">
        {items.map(({ id, label, description, icon: Icon, to }) => (
          <button
            key={id}
            onClick={() => navigate(to)}
            className="w-full group text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoanSettingsPage;
