import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Company } from "@/types";
import { companyApi } from "@/api/organisationstructure";

interface AuthContextType {
  user: User | null;
  selectedCompany: Company | null;
  availableCompanies: Company[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setSelectedCompany: (company: Company) => void;
  fetchCompanies: () => Promise<void>;
  refreshCompanies: () => Promise<void>; // Add refresh function for external components
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: User[] = [
  {
    id: "1",
    _id: "1",
    email: "admin@finservice.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    workingMode: "online",
    lastActive: "2024-06-01",
    createdAt: "2024-01-01",
    permissions: [
      "user_management",
      "system_settings",
      "reports",
      "all_loans",
      "all_members",
    ],
  },
  {
    id: "2",
    _id: "2",
    email: "manager@finservice.com",
    name: "Manager User",
    role: "manager",
    status: "active",
    workingMode: "online",
    lastActive: "2024-06-01",
    createdAt: "2024-01-01",
    permissions: [
      "reports",
      "approve_loans",
      "member_management",
      "loan_management",
    ],
  },
  {
    id: "3",
    _id: "3",
    email: "staff@finservice.com",
    name: "Staff User",
    role: "staff",
    status: "active",
    workingMode: "offline",
    lastActive: "2024-05-31",
    createdAt: "2024-01-01",
    permissions: ["view_members", "view_loans", "basic_operations"],
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(
    null
  );
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("fin_service_user");
    const storedCompany = localStorage.getItem("fin_service_selected_company");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedCompany) {
      setSelectedCompanyState(JSON.parse(storedCompany));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = demoUsers.find((u) => u.email === email);

    if (foundUser && password === "password123") {
      setUser(foundUser);
      localStorage.setItem("fin_service_user", JSON.stringify(foundUser));

      // Fetch companies after successful login
      try {
        await fetchCompanies();
      } catch (error) {
        console.error("Failed to fetch companies during login:", error);
      }

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedCompanyState(null);
    setAvailableCompanies([]);
    localStorage.removeItem("fin_service_user");
    localStorage.removeItem("fin_service_selected_company");
  };

  const setSelectedCompany = (company: Company) => {
    setSelectedCompanyState(company);
    localStorage.setItem(
      "fin_service_selected_company",
      JSON.stringify(company)
    );
  };

  const fetchCompanies = async () => {
    try {
      const raw = await companyApi.getCompanies();
      const list: any[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
      const normalized: Company[] = list.map((c: any) => ({
        // ensure id and name fields exist regardless of backend naming
        id: (c?.id ?? c?._id ?? "").toString(),
        companyName: c?.companyName ?? c?.company_name ?? c?.mailingName ?? "",
        mailingName: c?.mailingName ?? c?.mailing_name ?? c?.companyName ?? "",
        address: c?.address ?? "",
        district: c?.district ?? "",
        state: c?.state ?? "",
        country: c?.country ?? "",
        city: c?.city ?? "",
        pincode: c?.pincode ?? "",
        telephone: c?.telephone ?? "",
        mobile: c?.mobile ?? "",
        fax: c?.fax ?? "",
        email: c?.email ?? "",
        website: c?.website ?? "",
        parentCompanyId: c?.parentCompanyId ?? c?.parent_company_id ?? "",
        financialYear:
          c?.financialYear ?? c?.financial_year_beginning_from ?? "",
        bookBeginning: c?.bookBeginning ?? c?.book_beginning_from ?? "",
      }));
      setAvailableCompanies(normalized);

      // If no company is selected but companies are available, select the first one
      if (!selectedCompany && normalized.length > 0) {
        setSelectedCompany(normalized[0]);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      // Set a default company if API fails
      const defaultCompany: Company = {
        id: "default",
        companyName: "DEMO COMPANY",
        mailingName: "Demo Company",
        address: "Demo Address",
        state: "Demo State",
        country: "Demo Country",
        pincode: "000000",
        telephone: "0000000000",
        mobile: "0000000000",
      };
      setAvailableCompanies([defaultCompany]);
      if (!selectedCompany) {
        setSelectedCompany(defaultCompany);
      }
    }
  };

  // Refresh companies function that can be called from external components
  const refreshCompanies = async () => {
    await fetchCompanies();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCompany,
        availableCompanies,
        login,
        logout,
        setSelectedCompany,
        fetchCompanies,
        refreshCompanies,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
