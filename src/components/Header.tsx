import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Company } from "@/types";

const Header = () => {
  const navigate = useNavigate();
  const {
    user,
    selectedCompany,
    availableCompanies,
    setSelectedCompany,
    fetchCompanies,
    refreshCompanies,
  } = useAuth();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    // Fetch companies when component mounts
    const loadCompanies = async () => {
      setIsLoadingCompanies(true);
      await fetchCompanies();
      setIsLoadingCompanies(false);
    };

    loadCompanies();

    // Set up periodic refresh to catch changes made in Organization Structure
    const refreshInterval = setInterval(() => {
      refreshCompanies();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".company-selector")) {
        setShowCompanyDropdown(false);
      }
    };

    if (showCompanyDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCompanyDropdown]);

  const handleLogout = () => {
    // Clear any session/local storage if needed
    // localStorage.clear(); // optional
    // sessionStorage.clear(); // optional

    // Redirect to login page
    navigate("/");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDropdown(false);
  };

  const handleRefreshCompanies = async () => {
    setIsLoadingCompanies(true);
    await refreshCompanies();
    setIsLoadingCompanies(false);
  };

  const displayCompanyName = selectedCompany?.companyName || "DEMO COMPANY";
  const isAdmin = user?.role === "admin";
  const hasMultipleCompanies = availableCompanies.length > 1;

  if (isLoadingCompanies && !selectedCompany) {
    // Show loading state
    return (
      <header className="top-header">
        <div className="center">
          <strong>Loading...</strong>
          <div>01 Apr 2024 to 31 Mar 2025</div>
        </div>
        <div className="text-center">1 October 2025</div>
        <div className="right">
          <span>🔔</span>
          <span>💼</span>
          <span onClick={handleSettingsClick} style={{ cursor: "pointer" }}>
            ⚙️
          </span>
          <span>↩️</span>
          <div className="dropdown">
            <button
              className="user-avatar btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              JZ
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <span>Jaydipsinh Zala1</span>
        </div>
      </header>
    );
  }

  return (
    <header className="top-header">
      {/* <div className="left">
        <span className="logo">📘 ERP</span>
        <span className="dropdown">▼</span>
      </div> */}
      <div className="center">
        {isAdmin && hasMultipleCompanies ? (
          <div className="company-selector" style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {isLoadingCompanies ? "Loading..." : displayCompanyName}
                <span style={{ fontSize: "12px" }}>▼</span>
              </strong>
              <button
                onClick={handleRefreshCompanies}
                disabled={isLoadingCompanies}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isLoadingCompanies ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  opacity: isLoadingCompanies ? 0.5 : 1,
                }}
                title="Refresh company list"
              >
                🔄
              </button>
            </div>
            {showCompanyDropdown && (
              <div
                className="company-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  minWidth: "200px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "5px",
                }}
              >
                {availableCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      backgroundColor:
                        selectedCompany?.id === company.id
                          ? "#f0f0f0"
                          : "white",
                      color: "#333",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCompany?.id !== company.id) {
                        e.currentTarget.style.backgroundColor = "#f8f8f8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCompany?.id !== company.id) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {company.companyName}
                    </div>
                    {company.mailingName &&
                      company.mailingName !== company.companyName && (
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {company.mailingName}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <strong>
              {isLoadingCompanies ? "Loading..." : displayCompanyName}
            </strong>
            {isAdmin && (
              <button
                onClick={handleRefreshCompanies}
                disabled={isLoadingCompanies}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isLoadingCompanies ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  opacity: isLoadingCompanies ? 0.5 : 1,
                }}
                title="Refresh company list"
              >
                🔄
              </button>
            )}
          </div>
        )}
        <div>01 Apr 2024 to 31 Mar 2025</div>
      </div>
      <div className="text-center">7 October 2025</div>
      <div className="right">
        <span>🔔</span>
        <span>💼</span>
        <span onClick={handleSettingsClick} style={{ cursor: "pointer" }}>
          ⚙️
        </span>
        <span>↩️</span>
        {/* <div classNameName="user-avatar">JZ</div> */}
        <div className="dropdown">
          <button
            className="user-avatar btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            JZ
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Logout
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Another action
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
        <span>Jaydipsinh Zala</span>
      </div>
    </header>
  );
};

export default Header;
