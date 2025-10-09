import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const CompanyDemo = () => {
  const { selectedCompany, availableCompanies, refreshCompanies } = useAuth();

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Company Integration Demo</h3>

      <div className="mb-4">
        <strong>Currently Selected Company:</strong>
        <div className="mt-1 p-2 bg-white border rounded">
          {selectedCompany ? (
            <>
              <div className="font-medium">{selectedCompany.companyName}</div>
              <div className="text-sm text-gray-600">
                {selectedCompany.mailingName}
              </div>
              <div className="text-xs text-gray-500">
                {selectedCompany.address}
              </div>
            </>
          ) : (
            <div className="text-gray-500">No company selected</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <strong>Available Companies ({availableCompanies.length}):</strong>
        <div className="mt-1 space-y-1">
          {availableCompanies.map((company, index) => (
            <div
              key={company.id}
              className="p-2 bg-white border rounded text-sm"
            >
              <span className="font-medium">{company.companyName}</span>
              {company.mailingName &&
                company.mailingName !== company.companyName && (
                  <span className="text-gray-600 ml-2">
                    ({company.mailingName})
                  </span>
                )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={refreshCompanies}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Companies
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>How it works:</strong>
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Header fetches companies from Organization Structure API</li>
          <li>Admin users see a dropdown when multiple companies exist</li>
          <li>Selected company is persisted in localStorage</li>
          <li>Companies refresh automatically every 30 seconds</li>
          <li>Manual refresh available via 🔄 button in header</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyDemo;
