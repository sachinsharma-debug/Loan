import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Building,
  Building2,
  MapPin,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Company, Branch, SalesMan, TransactionType } from "@/types";
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { Textarea } from "./ui/textarea";
import { Country, State, City } from "country-state-city";
import { companyApi, branchApi } from "@/api/organisationstructure";
import { useSelector, useDispatch } from "react-redux";
import { setcompanyid } from "../redux/storeSlice";
import { API } from "../api/config";

// Note: You'll need to implement these APIs for complete functionality:
// import { transactionApi } from "@/api/transaction";
// import { masterApi } from "@/api/master";
// import { ledgerApi } from "@/api/ledger";
// Helper to safely read an entity id regardless of backend field naming
const getEntityId = (obj: any): string =>
  (obj?.id ?? obj?._id ?? "").toString();

// Helper for date inputs (yyyy-MM-dd)
const formatDateInput = (val?: string): string => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

// Helpers to resolve ISO codes from labels/codes
const resolveCountryIso = (allCountries: any[], value?: string) => {
  if (!value) return "";
  const v = value.toString();
  const direct = allCountries.find((c) => c.isoCode === v);
  if (direct) return direct.isoCode;
  const byName = allCountries.find(
    (c) => c.name?.toLowerCase() === v.toLowerCase()
  );
  return byName?.isoCode ?? "";
};

// Pick the first non-empty field from possible aliases
const pickField = (obj: any, keys: string[], fallback: string = ""): string => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return fallback;
};
const resolveStateIso = (states: any[], value?: string) => {
  if (!value) return "";
  const v = value.toString();
  const direct = states.find((s: any) => s.isoCode === v);
  if (direct) return direct.isoCode;
  const byName = states.find(
    (s: any) => s.name?.toLowerCase() === v.toLowerCase()
  );
  return byName?.isoCode ?? "";
};

// Resolve a city value to the exact option value (case-insensitive by name)
const resolveCityName = (cities: any[], value?: string) => {
  if (!value) return "";
  const v = value.toString();
  // Our SelectItem value for city is city.name
  const byName = cities.find(
    (c: any) => c.name?.toLowerCase() === v.toLowerCase()
  );
  return byName?.name ?? v; // fall back to provided string if not found
};

// API function to fetch pincode data
const fetchPincodeData = async (pincode: string) => {
  try {
    console.log("Fetching data for pincode:", pincode); // Debug log
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", data); // Debug log

    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
      console.log("API Success! PostOffice data:", data[0].PostOffice); // Debug log
      return data[0].PostOffice;
    } else {
      console.log("API returned error or no data:", data); // Debug log
      return null;
    }
  } catch (error) {
    console.error("Pincode API fetch failed:", error);
    return null;
  }
};

// Safe function to search pincode
const safeSearchByPincode = (pincode: string) => {
  try {
    // Dynamically import to handle potential module issues
    const { searchByPincode } = require("india-pincode-search");
    return searchByPincode(pincode);
  } catch (error) {
    console.warn("Pincode search failed:", error);
    return null;
  }
};

// Safe function to search by city
const safeSearchByCity = (city: string) => {
  try {
    // Dynamically import to handle potential module issues
    const { searchByCity } = require("india-pincode-search");
    return searchByCity(city);
  } catch (error) {
    console.warn("City search failed:", error);
    return null;
  }
};

// interface OrganizationStructureProps {
//   salesMen: SalesMan[];
//   transactionTypes: TransactionType[];

//   onAddSalesMan: (data: Omit<SalesMan, "id">) => void;
//   onAddTransactionType: (data: Omit<TransactionType, "id">) => void;
// }

const OrganizationStructure = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState({ companies: false, branches: false });
  const [error, setError] = useState({ companies: "", branches: "" });
  const [loantype, setloantype] = useState([]);
  const companyid = useSelector((state: any) => state?.Store?.companyid);
  const dispatch = useDispatch();
  const [cmpchangerendor, setcmpchangerendor] = useState(true);
  const [featureloandata, setfeatureloandata] = useState({
    enableloanmanagement: "no",
    applicableloantype: [],
    enablerecurringdeposit: "no",
    autocalculateloanrd: "no",
    enablefixedloan: "no",
    autocalculateloanfd: "no",
    companyid: "",
    memberidconfig: "no",
    // Member ID configuration fields
    memberidformat: "manual", // auto | branchwise | manual
    memberiddisplaylastid: "no", // yes | no
    memberidprefix: "",
    memberidstarting: "0",
    memberidwidth: "0",
    memberidrows: [
      { applicableFrom: "", prefix: "", starting: "0", width: "0" },
    ],
  });
  featureloandata.companyid = companyid;
  const fetchfeature = async () => {
    const res: any = await API.getMethod("/get_master/feature");
    if (res.data.data.length > 0) {
      const incoming = res.data.data[0] || {};
      setfeatureloandata((prev: any) => ({
        ...prev,
        ...incoming,
        memberidrows:
          incoming.memberidrows && incoming.memberidrows.length
            ? incoming.memberidrows
            : prev.memberidrows,
      }));
    } else {
      setfeatureloandata({
        enableloanmanagement: "no",
        applicableloantype: [],
        enablerecurringdeposit: "no",
        autocalculateloanrd: "no",
        enablefixedloan: "no",
        autocalculateloanfd: "no",
        companyid: "",
        memberidconfig: "no",
        memberidformat: "manual",
        memberiddisplaylastid: "no",
        memberidprefix: "",
        memberidstarting: "0",
        memberidwidth: "0",
        memberidrows: [
          { applicableFrom: "", prefix: "", starting: "0", width: "0" },
        ],
      });
    }
  };
  useEffect(() => {
    const fetchloantype = async () => {
      const res: any = await API.getMethod("/get_master/loantype");
      console.log(res, "<<<<<<<<<<<<<<<,");

      setloantype(res?.data?.data || []);
    };
    fetchloantype();

    fetchfeature();
  }, [companyid]);

  const savefeaturedata = async () => {
    if ((featureloandata as any)._id) {
      let __id = (featureloandata as any)._id;
      delete (featureloandata as any)._id;
      let payload = {
        tablename: "feature",
        data: { ...featureloandata },
      };

      const res: any = await API.updateMethod(
        "/update_master/" + __id,
        payload
      );

      if (res?.status == 200) {
        toast.success("Feature updated successfully");
        fetchfeature();
      } else {
        toast.error("Failed to update feature");
      }
    } else {
      let payload = {
        tablename: "feature",
        data: { ...featureloandata },
      };
      const res: any = await API.postMethod("/create_master", payload);
      if (res?.status == 200) {
        toast.success("Feature added successfully");
        fetchfeature();
      } else {
        toast.error("Failed to add feature");
      }
    }
  };

  useEffect(() => {
    setcmpchangerendor(!cmpchangerendor);
  }, [companyid]);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  // Additional base currency details toggle for Company form
  const [additionalBaseCurrency, setAdditionalBaseCurrency] = useState<
    "yes" | "no"
  >("no");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const activeItem = isEditMode ? editingItem : isViewMode ? viewingItem : null;

  // State for Features dialog
  const [isAddFeatureDialogOpen, setIsAddFeatureDialogOpen] = useState(false);

  // Features form states
  const [enableLoanManagement, setEnableLoanManagement] = useState<
    "yes" | "no"
  >("no");
  const [selectedLoanTypes, setSelectedLoanTypes] = useState<string[]>([]);
  console.log(selectedLoanTypes, "selectedLoanTypesselectedLoanTypes");
  const [
    enableRecurringDepositManagement,
    setEnableRecurringDepositManagement,
  ] = useState<"yes" | "no">("no");
  const [autoCalculateLoanTenure, setAutoCalculateLoanTenure] = useState<
    "yes" | "no"
  >("no");
  const [enableFixedDepositManagement, setEnableFixedDepositManagement] =
    useState<"yes" | "no">("no");
  const [autoCalculateLoanTenureForFD, setAutoCalculateLoanTenureForFD] =
    useState<"yes" | "no">("no");

  // Helpers for Member ID table navigation
  const focusMemberIdField = (
    rowIndex: number,
    field: "date" | "prefix" | "starting" | "width"
  ) => {
    const el = document.getElementById(
      `memberid-${rowIndex}-${field}`
    ) as HTMLInputElement | null;
    if (el) {
      el.focus();
      try {
        el.select?.();
      } catch {}
    }
  };

  const isMemberRowComplete = (row: any) => {
    if (!row) return false;
    const hasDate = !!row.applicableFrom;
    const hasPrefix =
      typeof row.prefix === "string" && row.prefix.trim() !== "";
    const hasStarting = row.starting !== undefined && row.starting !== "";
    const hasWidth = row.width !== undefined && row.width !== "";
    return hasDate && hasPrefix && hasStarting && hasWidth;
  };

  // Country-State-City data
  const [countries, setCountries] = useState<any[]>([]);
  const [companyStates, setCompanyStates] = useState<any[]>([]);
  const [companyCities, setCompanyCities] = useState<any[]>([]);
  const [branchStates, setBranchStates] = useState<any[]>([]);
  const [branchCities, setBranchCities] = useState<any[]>([]);
  const [selectedCompanyCountry, setSelectedCompanyCountry] = useState("");
  const [selectedCompanyState, setSelectedCompanyState] = useState("");
  const [selectedBranchState, setSelectedBranchState] = useState("");
  // Company date fields
  const [financialYearDate, setFinancialYearDate] = useState("");
  const [bookBeginningDate, setBookBeginningDate] = useState("");

  // Pincode data
  const [companyPincodes, setCompanyPincodes] = useState<any[]>([]);
  const [branchPincodes, setBranchPincodes] = useState<any[]>([]);
  const [companyPincode, setCompanyPincode] = useState("");
  const [branchPincode, setBranchPincode] = useState("");
  const [selectedCompanyCity, setSelectedCompanyCity] = useState("");
  const [selectedBranchCity, setSelectedBranchCity] = useState("");

  // District states for auto-fill
  const [selectedCompanyDistrict, setSelectedCompanyDistrict] = useState("");
  const [selectedBranchDistrict, setSelectedBranchDistrict] = useState("");

  // Pincode validation states
  const [companyPincodeError, setCompanyPincodeError] = useState("");
  const [branchPincodeError, setBranchPincodeError] = useState("");

  // Mailing name auto-fill state
  const [mailingName, setMailingName] = useState("");

  // Email states for validation and lowercase conversion
  const [companyEmail, setCompanyEmail] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  // Toggle for branch pincode autofill input visibility
  const [enableBranchPincodeAutofill, setEnableBranchPincodeAutofill] =
    useState<"yes" | "no">("no");
  // Toggle for company pincode autofill input visibility
  const [enableCompanyPincodeAutofill, setEnableCompanyPincodeAutofill] =
    useState<"yes" | "no">("no");

  // Currency mapping based on country ISO codes
  const currencyMapping: Record<string, { symbol: string; name: string }> = {
    IN: { symbol: "₹", name: "INR" },
    US: { symbol: "$", name: "USD" },
    GB: { symbol: "£", name: "GBP" },
    JP: { symbol: "¥", name: "JPY" },
    EU: { symbol: "€", name: "EUR" },
    DE: { symbol: "€", name: "EUR" },
    FR: { symbol: "€", name: "EUR" },
    IT: { symbol: "€", name: "EUR" },
    ES: { symbol: "€", name: "EUR" },
    NL: { symbol: "€", name: "EUR" },
    BE: { symbol: "€", name: "EUR" },
    AT: { symbol: "€", name: "EUR" },
    IE: { symbol: "€", name: "EUR" },
    PT: { symbol: "€", name: "EUR" },
    CA: { symbol: "C$", name: "CAD" },
    AU: { symbol: "A$", name: "AUD" },
    NZ: { symbol: "NZ$", name: "NZD" },
    CH: { symbol: "CHF", name: "CHF" },
    SE: { symbol: "kr", name: "SEK" },
    NO: { symbol: "kr", name: "NOK" },
    DK: { symbol: "kr", name: "DKK" },
    PL: { symbol: "zł", name: "PLN" },
    CZ: { symbol: "Kč", name: "CZK" },
    HU: { symbol: "Ft", name: "HUF" },
    RO: { symbol: "lei", name: "RON" },
    BG: { symbol: "лв", name: "BGN" },
    HR: { symbol: "€", name: "EUR" },
    RS: { symbol: "дин", name: "RSD" },
    BA: { symbol: "KM", name: "BAM" },
    MK: { symbol: "ден", name: "MKD" },
    AL: { symbol: "L", name: "ALL" },
    ME: { symbol: "€", name: "EUR" },
    SI: { symbol: "€", name: "EUR" },
    SK: { symbol: "€", name: "EUR" },
    LT: { symbol: "€", name: "EUR" },
    LV: { symbol: "€", name: "EUR" },
    EE: { symbol: "€", name: "EUR" },
    FI: { symbol: "€", name: "EUR" },
    IS: { symbol: "kr", name: "ISK" },
    RU: { symbol: "₽", name: "RUB" },
    BY: { symbol: "Br", name: "BYN" },
    UA: { symbol: "₴", name: "UAH" },
    MD: { symbol: "L", name: "MDL" },
    GE: { symbol: "₾", name: "GEL" },
    AM: { symbol: "֏", name: "AMD" },
    AZ: { symbol: "₼", name: "AZN" },
    KZ: { symbol: "₸", name: "KZT" },
    KG: { symbol: "с", name: "KGS" },
    UZ: { symbol: "so'm", name: "UZS" },
    TJ: { symbol: "ЅМ", name: "TJS" },
    TM: { symbol: "m", name: "TMT" },
    CN: { symbol: "¥", name: "CNY" },
    KR: { symbol: "₩", name: "KRW" },
    MY: { symbol: "RM", name: "MYR" },
    SG: { symbol: "S$", name: "SGD" },
    TH: { symbol: "฿", name: "THB" },
    ID: { symbol: "Rp", name: "IDR" },
    PH: { symbol: "₱", name: "PHP" },
    VN: { symbol: "₫", name: "VND" },
    BD: { symbol: "৳", name: "BDT" },
    PK: { symbol: "₨", name: "PKR" },
    LK: { symbol: "₨", name: "LKR" },
    NP: { symbol: "₨", name: "NPR" },
    BT: { symbol: "Nu", name: "BTN" },
    MV: { symbol: "Rf", name: "MVR" },
    AF: { symbol: "؋", name: "AFN" },
    IR: { symbol: "﷼", name: "IRR" },
    IQ: { symbol: "ع.د", name: "IQD" },
    SA: { symbol: "﷼", name: "SAR" },
    AE: { symbol: "د.إ", name: "AED" },
    QA: { symbol: "ر.ق", name: "QAR" },
    BH: { symbol: "د.ب", name: "BHD" },
    KW: { symbol: "د.ك", name: "KWD" },
    OM: { symbol: "﷼", name: "OMR" },
    YE: { symbol: "﷼", name: "YER" },
    JO: { symbol: "د.ا", name: "JOD" },
    LB: { symbol: "ل.ل", name: "LBP" },
    SY: { symbol: "£", name: "SYP" },
    TR: { symbol: "₺", name: "TRY" },
    CY: { symbol: "€", name: "EUR" },
    IL: { symbol: "₪", name: "ILS" },
    PS: { symbol: "₪", name: "ILS" },
    EG: { symbol: "£", name: "EGP" },
    LY: { symbol: "د.ل", name: "LYD" },
    TN: { symbol: "د.ت", name: "TND" },
    DZ: { symbol: "د.ج", name: "DZD" },
    MA: { symbol: "د.م.", name: "MAD" },
    ZA: { symbol: "R", name: "ZAR" },
    NG: { symbol: "₦", name: "NGN" },
    KE: { symbol: "KSh", name: "KES" },
    ET: { symbol: "Br", name: "ETB" },
    GH: { symbol: "₵", name: "GHS" },
    UG: { symbol: "USh", name: "UGX" },
    TZ: { symbol: "TSh", name: "TZS" },
    RW: { symbol: "FRw", name: "RWF" },
    MG: { symbol: "Ar", name: "MGA" },
    MU: { symbol: "₨", name: "MUR" },
    SC: { symbol: "₨", name: "SCR" },
    BR: { symbol: "R$", name: "BRL" },
    AR: { symbol: "$", name: "ARS" },
    CL: { symbol: "$", name: "CLP" },
    CO: { symbol: "$", name: "COP" },
    PE: { symbol: "S/", name: "PEN" },
    VE: { symbol: "Bs", name: "VES" },
    EC: { symbol: "$", name: "USD" },
    BO: { symbol: "Bs", name: "BOB" },
    PY: { symbol: "₲", name: "PYG" },
    UY: { symbol: "$", name: "UYU" },
    GY: { symbol: "$", name: "GYD" },
    SR: { symbol: "$", name: "SRD" },
    MX: { symbol: "$", name: "MXN" },
    GT: { symbol: "Q", name: "GTQ" },
    BZ: { symbol: "$", name: "BZD" },
    SV: { symbol: "$", name: "USD" },
    HN: { symbol: "L", name: "HNL" },
    NI: { symbol: "C$", name: "NIO" },
    CR: { symbol: "₡", name: "CRC" },
    PA: { symbol: "B/", name: "PAB" },
    JM: { symbol: "$", name: "JMD" },
    CU: { symbol: "$", name: "CUP" },
    HT: { symbol: "G", name: "HTG" },
    DO: { symbol: "$", name: "DOP" },
    TT: { symbol: "$", name: "TTD" },
    BB: { symbol: "$", name: "BBD" },
    BS: { symbol: "$", name: "BSD" },
  };

  // Function to set currency based on country
  const setCurrencyByCountry = (countryCode: string) => {
    const currency = currencyMapping[countryCode];
    if (currency) {
      setBaseCurrencySymbol(currency.symbol);
      setFormalName(currency.name);
    } else {
      // Default to USD if country not found
      setBaseCurrencySymbol("$");
      setFormalName("USD");
    }
  };

  // Currency field states
  const [baseCurrencySymbol, setBaseCurrencySymbol] = useState("₹");
  const [formalName, setFormalName] = useState("INR");
  const [showInMillions, setShowInMillions] = useState("no");
  const [suffixSymbolToAmount, setSuffixSymbolToAmount] = useState("yes");
  const [spaceBetweenAmountAndSymbol, setSpaceBetweenAmountAndSymbol] =
    useState("no");

  // Keyboard navigation states
  const fieldRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Define field order for Company form
  const companyFieldOrder = [
    "masterId",
    "alterId",
    "companyCode",
    "companyName",
    "mailingName",
    "address",
    "country",
    "state",
    "district",
    "city",
    "pincode",
    "fax",
    "telephone",
    "mobile",
    "email",
    "website",
    "financial-year-beginning-from",
    "book-beginning-from",
    "base-currency-symbol",
    "formal-name",
    "additional-base-currency",
    "show-in-millions",
    "decimal-places",
    "after-decimal-word",
    "decimal-places-in-words",
    "suffix-symbol-to-amount",
    "space-between-amount-and-symbol",
  ];

  // Define field order for Branch form
  const branchFieldOrder = [
    "name",
    "address",

    "state",
    "city",
    "branchPincode",
    "Telephone",
    "Mobile",
    "Fax",
    "email",
  ];

  // Load data from API on component mount
  useEffect(() => {
    fetchCompanies();
    fetchBranches();

    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    // Initialize branch states with Indian states by default
    const indianStates = State.getStatesOfCountry("IN");
    setBranchStates(indianStates);
  }, [cmpchangerendor]);

  // API functions
  const fetchCompanies = async () => {
    setLoading((prev) => ({ ...prev, companies: true }));
    setError((prev) => ({ ...prev, companies: "" }));

    try {
      const data = await companyApi.getCompanies();
      const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
      const normalized = list.map((c: any) => ({ ...c, id: getEntityId(c) }));
      setCompanies(normalized);
    } catch (err) {
      setError((prev) => ({ ...prev, companies: "Failed to load companies" }));
      console.error("Error fetching companies:", err);
      toast.error("Failed to load companies");
    } finally {
      setLoading((prev) => ({ ...prev, companies: false }));
    }
  };

  const fetchBranches = async () => {
    setLoading((prev) => ({ ...prev, branches: true }));
    setError((prev) => ({ ...prev, branches: "" }));

    try {
      const data = await branchApi.getBranches();
      const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
      const normalized = list.map((b: any) => ({ ...b, id: getEntityId(b) }));
      setBranches(normalized);
    } catch (err) {
      setError((prev) => ({ ...prev, branches: "Failed to load branches" }));
      console.error("Error fetching branches:", err);
      toast.error("Failed to load branches");
    } finally {
      setLoading((prev) => ({ ...prev, branches: false }));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent,
    fieldName: string,
    isTextarea = false,
    isSelect = false
  ) => {
    if (e.key === "Enter") {
      if (isTextarea) {
        // For textarea: Shift+Enter = new line, Enter = next field
        if (e.shiftKey) {
          // Allow default behavior (new line) when Shift+Enter
          return;
        } else {
          // Single Enter moves to next field
          e.preventDefault();
          focusNextField(fieldName);
        }
      } else {
        // For regular inputs and selects, move to next field immediately
        e.preventDefault();
        focusNextField(fieldName);
      }
    }
  };

  // Focus next field in sequence
  const focusNextField = (currentFieldName: string) => {
    const fieldOrder =
      activeTab === "company" ? companyFieldOrder : branchFieldOrder;
    const currentIndex = fieldOrder.indexOf(currentFieldName);

    if (currentIndex >= 0 && currentIndex < fieldOrder.length - 1) {
      const nextFieldName = fieldOrder[currentIndex + 1];
      const nextField = fieldRefs.current[nextFieldName];

      if (nextField) {
        // Check if it's a select trigger
        const selectTrigger = nextField.querySelector('[role="combobox"]');
        if (selectTrigger) {
          (selectTrigger as HTMLElement).focus();
        } else {
          nextField.focus();
        }
      }
    }
  };

  // Set field ref
  const setFieldRef = (fieldName: string, element: HTMLElement | null) => {
    fieldRefs.current[fieldName] = element;
  };

  // Handle country change for Company form
  const handleCompanyCountryChange = (countryCode: string) => {
    setSelectedCompanyCountry(countryCode);
    setSelectedCompanyState("");
    const states = State.getStatesOfCountry(countryCode);
    setCompanyStates(states);
    setCompanyCities([]);

    // Automatically set currency based on selected country
    setCurrencyByCountry(countryCode);
  };

  // Handle state change for Company form
  const handleCompanyStateChange = (stateCode: string) => {
    setSelectedCompanyState(stateCode);
    const cities = City.getCitiesOfState(selectedCompanyCountry, stateCode);
    setCompanyCities(cities);
  };

  // Handle state change for Branch form
  const handleBranchStateChange = (stateCode: string) => {
    setSelectedBranchState(stateCode);
    const cities = City.getCitiesOfState("IN", stateCode); // Default to India
    setBranchCities(cities);
  };

  // Handle city change for Company form
  const handleCompanyCityChange = (cityName: string) => {
    setSelectedCompanyCity(cityName);
    if (selectedCompanyCountry === "IN") {
      // Only for India
      try {
        const pincodeData = safeSearchByCity(cityName);
        setCompanyPincodes(pincodeData || []);
      } catch (error) {
        console.log("No pincode data found for city:", cityName);
        setCompanyPincodes([]);
      }
    }
  };

  // Handle city change for Branch form
  const handleBranchCityChange = (cityName: string) => {
    setSelectedBranchCity(cityName);
    // Default to India for branches
    try {
      const pincodeData = safeSearchByCity(cityName);
      setBranchPincodes(pincodeData || []);
    } catch (error) {
      console.log("No pincode data found for city:", cityName);
      setBranchPincodes([]);
    }
  };

  // Handle pincode change (auto-fill location data from API)
  const handlePincodeChange = async (
    pincode: string,
    isCompany: boolean = true
  ) => {
    if (pincode.length === 6) {
      try {
        // Fetch data from postal pincode API
        const pincodeData = await fetchPincodeData(pincode);

        if (pincodeData && pincodeData.length > 0) {
          const location = pincodeData[0];

          console.log("API Response for pincode", pincode, ":", location); // Debug log

          // Auto-populate location fields based on API response
          if (isCompany) {
            // For company form
            const state = location.State;
            const district = location.District;
            const city = location.Name || location.Block;

            console.log(
              "Extracted values - State:",
              state,
              "District:",
              district,
              "City:",
              city
            ); // Debug log

            // Set district
            setSelectedCompanyDistrict(district);

            // Find and set country (India)
            const indiaCountry = countries.find(
              (c) => c.name === "India" || c.isoCode === "IN"
            );
            if (indiaCountry) {
              setSelectedCompanyCountry(indiaCountry.isoCode);
              setCurrencyByCountry(indiaCountry.isoCode);

              // Set states for India
              const indianStates = State.getStatesOfCountry("IN");
              setCompanyStates(indianStates);

              console.log(
                "Available states:",
                indianStates.map((s) => s.name)
              ); // Debug log

              // Find and set state - improved matching
              const foundState = indianStates.find((s) => {
                const stateName = s.name.toLowerCase().trim();
                const apiState = state.toLowerCase().trim();

                // Exact match
                if (stateName === apiState) return true;

                // Contains match (both ways)
                if (
                  stateName.includes(apiState) ||
                  apiState.includes(stateName)
                )
                  return true;

                // Handle common variations
                const stateVariations = {
                  "uttar pradesh": ["up", "u.p.", "uttar pradesh"],
                  "west bengal": ["wb", "w.b.", "west bengal", "bengal"],
                  "tamil nadu": ["tn", "t.n.", "tamil nadu", "tamilnadu"],
                  "andhra pradesh": ["ap", "a.p.", "andhra pradesh"],
                  "himachal pradesh": ["hp", "h.p.", "himachal pradesh"],
                  "madhya pradesh": ["mp", "m.p.", "madhya pradesh"],
                  "jammu and kashmir": [
                    "j&k",
                    "jk",
                    "jammu & kashmir",
                    "jammu and kashmir",
                  ],
                  "dadra and nagar haveli": ["dadra & nagar haveli", "dnhdd"],
                  "daman and diu": ["daman & diu", "dd"],
                };

                // Check variations
                for (const [fullName, variations] of Object.entries(
                  stateVariations
                )) {
                  if (
                    stateName.includes(fullName) ||
                    variations.some(
                      (v) => apiState.includes(v) || stateName.includes(v)
                    )
                  ) {
                    return true;
                  }
                }

                return false;
              });

              console.log("Found state:", foundState); // Debug log

              if (foundState) {
                setSelectedCompanyState(foundState.isoCode);

                // Set cities for the state
                const stateCities = City.getCitiesOfState(
                  "IN",
                  foundState.isoCode
                );
                setCompanyCities(stateCities);

                console.log(
                  "Available cities for state:",
                  stateCities.map((c) => c.name)
                ); // Debug log

                // Find and set city - improved matching
                const foundCity = stateCities.find((c) => {
                  const cityName = c.name.toLowerCase().trim();
                  const apiCity = city.toLowerCase().trim();

                  // Exact match
                  if (cityName === apiCity) return true;

                  // Contains match (both ways)
                  if (cityName.includes(apiCity) || apiCity.includes(cityName))
                    return true;

                  // Remove common suffixes/prefixes for better matching
                  const cleanCity = apiCity
                    .replace(/\s+(city|town|rural|urban)$/i, "")
                    .trim();
                  const cleanCityName = cityName
                    .replace(/\s+(city|town|rural|urban)$/i, "")
                    .trim();

                  if (cleanCityName === cleanCity) return true;
                  if (
                    cleanCityName.includes(cleanCity) ||
                    cleanCity.includes(cleanCityName)
                  )
                    return true;

                  return false;
                });

                console.log("Found city:", foundCity); // Debug log

                if (foundCity) {
                  setSelectedCompanyCity(foundCity.name);
                } else {
                  // If city not found in the list, use the API response directly
                  setSelectedCompanyCity(city);
                  console.log(
                    "City not found in dropdown, using API value:",
                    city
                  );
                }
              } else {
                console.log(
                  "State not found, available states:",
                  indianStates.map((s) => s.name)
                );
                // Even if state not found, still set the district
                setSelectedCompanyDistrict(district);
              }
            }

            // Clear any previous errors
            setCompanyPincodeError("");
          } else {
            // For branch form
            const state = location.State;
            const district = location.District;
            const city = location.Name || location.Block;

            console.log(
              "Branch form - State:",
              state,
              "District:",
              district,
              "City:",
              city
            ); // Debug log

            // Set district
            setSelectedBranchDistrict(district);

            // Set states for India (branches default to India)
            const indianStates = State.getStatesOfCountry("IN");
            setBranchStates(indianStates);

            // Find and set state - improved matching (same logic as company)
            const foundState = indianStates.find((s) => {
              const stateName = s.name.toLowerCase().trim();
              const apiState = state.toLowerCase().trim();

              // Exact match
              if (stateName === apiState) return true;

              // Contains match (both ways)
              if (stateName.includes(apiState) || apiState.includes(stateName))
                return true;

              // Handle common variations
              const stateVariations = {
                "uttar pradesh": ["up", "u.p.", "uttar pradesh"],
                "west bengal": ["wb", "w.b.", "west bengal", "bengal"],
                "tamil nadu": ["tn", "t.n.", "tamil nadu", "tamilnadu"],
                "andhra pradesh": ["ap", "a.p.", "andhra pradesh"],
                "himachal pradesh": ["hp", "h.p.", "himachal pradesh"],
                "madhya pradesh": ["mp", "m.p.", "madhya pradesh"],
                "jammu and kashmir": [
                  "j&k",
                  "jk",
                  "jammu & kashmir",
                  "jammu and kashmir",
                ],
                "dadra and nagar haveli": ["dadra & nagar haveli", "dnhdd"],
                "daman and diu": ["daman & diu", "dd"],
              };

              // Check variations
              for (const [fullName, variations] of Object.entries(
                stateVariations
              )) {
                if (
                  stateName.includes(fullName) ||
                  variations.some(
                    (v) => apiState.includes(v) || stateName.includes(v)
                  )
                ) {
                  return true;
                }
              }

              return false;
            });

            if (foundState) {
              setSelectedBranchState(foundState.isoCode);

              // Set cities for the state
              const stateCities = City.getCitiesOfState(
                "IN",
                foundState.isoCode
              );
              setBranchCities(stateCities);

              // Find and set city - improved matching (same logic as company)
              const foundCity = stateCities.find((c) => {
                const cityName = c.name.toLowerCase().trim();
                const apiCity = city.toLowerCase().trim();

                // Exact match
                if (cityName === apiCity) return true;

                // Contains match (both ways)
                if (cityName.includes(apiCity) || apiCity.includes(cityName))
                  return true;

                // Remove common suffixes/prefixes for better matching
                const cleanCity = apiCity
                  .replace(/\s+(city|town|rural|urban)$/i, "")
                  .trim();
                const cleanCityName = cityName
                  .replace(/\s+(city|town|rural|urban)$/i, "")
                  .trim();

                if (cleanCityName === cleanCity) return true;
                if (
                  cleanCityName.includes(cleanCity) ||
                  cleanCity.includes(cleanCityName)
                )
                  return true;

                return false;
              });

              if (foundCity) {
                setSelectedBranchCity(foundCity.name);
              } else {
                // If city not found in the list, use the API response directly
                setSelectedBranchCity(city);
              }
            }

            // Clear any previous errors
            setBranchPincodeError("");
          }

          // Show success message
          toast.success(`Location auto-filled for pincode ${pincode}`);
        } else {
          // Pincode not found
          const errorMsg = `No location data found for pincode ${pincode}`;
          if (isCompany) {
            setCompanyPincodeError(errorMsg);
          } else {
            setBranchPincodeError(errorMsg);
          }
        }
      } catch (error) {
        console.log("Error fetching pincode data:", error);

        // Fallback to basic validation
        if (!/^\d{6}$/.test(pincode)) {
          const errorMsg = "Please enter a valid 6-digit pincode";
          if (isCompany) {
            setCompanyPincodeError(errorMsg);
          } else {
            setBranchPincodeError(errorMsg);
          }
        } else {
          const errorMsg =
            "Unable to fetch location data. Please fill manually.";
          if (isCompany) {
            setCompanyPincodeError(errorMsg);
          } else {
            setBranchPincodeError(errorMsg);
          }
        }
      }
    } else if (pincode.length > 0 && pincode.length < 6) {
      // Clear errors for incomplete pincode
      if (isCompany) {
        setCompanyPincodeError("");
      } else {
        setBranchPincodeError("");
      }
    }
  };

  // Validate if pincode belongs to selected city
  const validatePincode = (
    pincode: string,
    selectedCity: string,
    isCompany: boolean = true
  ): boolean => {
    if (!pincode || !selectedCity || pincode.length !== 6) {
      return true; // Don't validate incomplete input
    }

    try {
      const locationData = safeSearchByPincode(pincode);
      console.log("Pincode validation:", {
        pincode,
        selectedCity,
        locationData,
      }); // Debug log

      if (locationData && locationData.length > 0) {
        // Check if any of the locations match the selected city
        const isValid = locationData.some((location) => {
          const cityMatches =
            location.circle?.toLowerCase() === selectedCity.toLowerCase() ||
            location.area?.toLowerCase() === selectedCity.toLowerCase() ||
            location.district?.toLowerCase() === selectedCity.toLowerCase() ||
            location.taluk?.toLowerCase() === selectedCity.toLowerCase() ||
            location.circle
              ?.toLowerCase()
              .includes(selectedCity.toLowerCase()) ||
            location.area?.toLowerCase().includes(selectedCity.toLowerCase());

          console.log("Checking location:", {
            location,
            selectedCity,
            cityMatches,
          }); // Debug log

          return cityMatches;
        });

        return isValid;
      } else {
        // Pincode not found in database
        return false;
      }
    } catch (error) {
      console.log("Error validating pincode:", error);
      return true; // Allow if validation fails due to error
    }
  };

  // Handle manual pincode input with validation
  const handleManualPincodeInput = async (
    pincode: string,
    isCompany: boolean = true
  ) => {
    if (pincode.length === 6) {
      // Automatically trigger the pincode change handler for 6-digit pincodes
      await handlePincodeChange(pincode, isCompany);
    } else if (pincode.length > 0 && pincode.length < 6) {
      // For incomplete pincodes, just validate format
      if (!/^\d+$/.test(pincode)) {
        const errorMsg = "Pincode should contain only numbers";
        if (isCompany) {
          setCompanyPincodeError(errorMsg);
        } else {
          setBranchPincodeError(errorMsg);
        }
      } else {
        // Clear errors for valid partial input
        if (isCompany) {
          setCompanyPincodeError("");
        } else {
          setBranchPincodeError("");
        }
      }
    } else {
      // Clear all errors for empty pincode
      if (isCompany) {
        setCompanyPincodeError("");
      } else {
        setBranchPincodeError("");
      }
    }
  };

  // Helper function to get country code from country object
  const getCountryCode = (countryCode: string) => {
    const country = countries.find((c) => c.isoCode === countryCode);
    return country ? `+${country.phonecode}` : "+1";
  };

  // Reset form data when dialogs open/close
  const resetFormData = () => {
    setSelectedCompanyCountry("");
    setSelectedCompanyState("");
    setSelectedBranchState("");
    setSelectedCompanyCity("");
    setSelectedBranchCity("");
    setSelectedCompanyDistrict("");
    setSelectedBranchDistrict("");
    setCompanyStates([]);
    setCompanyCities([]);
    // Keep Indian states loaded for branches
    const indianStates = State.getStatesOfCountry("IN");
    setBranchStates(indianStates);
    setBranchCities([]);
    setCompanyPincodes([]);
    setBranchPincodes([]);
    setCompanyPincode("");
    setBranchPincode("");
    setCompanyPincodeError("");
    setBranchPincodeError("");
    setMailingName("");
    setCompanyEmail("");
    setBranchEmail("");
    setIsViewMode(false);
    setViewingItem(null);
    setFinancialYearDate("");
    setBookBeginningDate("");
    setIsEditMode(false);
    setEditingItem(null);
    setEnableBranchPincodeAutofill("no");
    setEnableCompanyPincodeAutofill("no");
    setAdditionalBaseCurrency("no");
    // Reset currency states
    setBaseCurrencySymbol("₹");
    setFormalName("INR");
    setShowInMillions("no");
    setSuffixSymbolToAmount("yes");
    setSpaceBetweenAmountAndSymbol("no");

    // Reset branch name validation
    setBranchNameValidation({ isValid: true, message: "" });

    // Reset financial year warning states
    setIsFinancialYearWarningOpen(false);
    setIsBooksBeginningWarningOpen(false);
    setPendingFinancialYearChange("");
    setPendingBooksBeginningChange("");
    setHasExistingTransactions(false);
    setHasExistingMasters(false);

    // Reset features form states
    setEnableLoanManagement("no");
    setSelectedLoanTypes([]);
    setEnableRecurringDepositManagement("no");
    setAutoCalculateLoanTenure("no");
    setEnableFixedDepositManagement("no");
    setAutoCalculateLoanTenureForFD("no");

    console.log("Form data reset"); // Debug log
  };

  // Handle company name change to auto-fill mailing name
  const handleCompanyNameChange = (value: string) => {
    setMailingName(value);
  };

  // Handle email validation and lowercase conversion
  const handleEmailChange = (value: string, isCompany: boolean = true) => {
    // Convert to lowercase and validate email format
    const lowercaseEmail = value.toLowerCase();

    if (isCompany) {
      setCompanyEmail(lowercaseEmail);
    } else {
      setBranchEmail(lowercaseEmail);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditMode(true);
    setIsViewMode(false);

    if (activeTab === "company") {
      // Pre-populate company form states with existing data
      if (item.mailingName) {
        setMailingName(item.mailingName);
      }
      setCompanyEmail(pickField(item, ["email", "Email"], ""));

      // Date fields (if present on the entity)
      setFinancialYearDate(
        formatDateInput(
          item.financialYear ||
            item.financialYearBeginning ||
            item.financial_year_beginning_from
        )
      );
      setBookBeginningDate(
        formatDateInput(
          item.bookBeginning || item.booksBeginning || item.book_beginning_from
        )
      );

      // Check for existing data when editing
      const companyId = getEntityId(item);
      if (companyId) {
        checkExistingData(companyId);
      }

      // Currency fields - properly handle existing values
      setBaseCurrencySymbol(
        item.baseCurrencySymbol || item.base_currency_symbol || "₹"
      );
      setFormalName(item.formalName || item.formal_name || "INR");
      setAdditionalBaseCurrency(
        item.additionalBaseCurrency || item.additional_base_currency || "no"
      );
      setShowInMillions(item.showInMillions || item.show_in_millions || "no");
      setSuffixSymbolToAmount(
        item.suffixSymbolToAmount || item.suffix_symbol_to_amount || "yes"
      );
      setSpaceBetweenAmountAndSymbol(
        item.spaceBetweenAmountAndSymbol ||
          item.space_between_amount_and_symbol ||
          "no"
      );

      // Location prefill for company selects
      try {
        const countryRaw = pickField(item, ["country", "Country"], "");
        const stateRaw = pickField(item, ["state", "State"], "");
        const cityRaw = pickField(item, ["city", "City"], "");
        const districtRaw = pickField(item, ["district", "District"], "");

        setSelectedCompanyDistrict(districtRaw);

        const cIso = resolveCountryIso(countries, countryRaw);
        setSelectedCompanyCountry(cIso);

        // Set currency based on country when editing
        if (cIso) {
          setCurrencyByCountry(cIso);
        }

        const st = State.getStatesOfCountry(cIso);
        setCompanyStates(st);
        const sIso = resolveStateIso(st, stateRaw);
        setSelectedCompanyState(sIso);
        const cities = City.getCitiesOfState(cIso, sIso);
        setCompanyCities(cities);
        setSelectedCompanyCity(resolveCityName(cities, cityRaw));
      } catch (e) {
        console.warn("Company prefill error", e);
      }
    } else {
      // Pre-populate branch form states with existing data
      setBranchEmail(pickField(item, ["email", "Email"], ""));

      // Location prefill for branch selects
      try {
        const stateRaw = pickField(item, ["state", "State", "branchState"], "");
        const cityRaw = pickField(item, ["city", "City", "branchCity"], "");
        const districtRaw = pickField(
          item,
          ["district", "District", "branchDistrict"],
          ""
        );

        setSelectedBranchDistrict(districtRaw);

        // Default to India for branches
        const st = State.getStatesOfCountry("IN");
        setBranchStates(st);
        const sIso = resolveStateIso(st, stateRaw);
        setSelectedBranchState(sIso);
        const cities = City.getCitiesOfState("IN", sIso);
        setBranchCities(cities);
        setSelectedBranchCity(resolveCityName(cities, cityRaw));
      } catch (e) {
        console.warn("Branch prefill error", e);
      }
    }

    setIsAddDialogOpen(true);
  };

  const handleView = (item: any) => {
    setViewingItem(item);
    // Prefill like edit, but set view mode
    setIsViewMode(true);
    setIsEditMode(false);
    // Pre-populate shared fields
    if (item.mailingName) setMailingName(item.mailingName);
    const emailVal = pickField(item, ["email", "Email"], "");
    if (activeTab === "company") setCompanyEmail(emailVal);
    else setBranchEmail(emailVal);
    // Location prefill
    try {
      if (activeTab === "company") {
        const countryRaw = pickField(item, ["country", "Country"], "");
        const stateRaw = pickField(item, ["state", "State"], "");
        const cityRaw = pickField(item, ["city", "City"], "");
        const districtRaw = pickField(item, ["district", "District"], "");

        setSelectedCompanyDistrict(districtRaw);

        const cIso = resolveCountryIso(countries, countryRaw);
        setSelectedCompanyCountry(cIso);

        // Set currency based on country when viewing
        if (cIso) {
          setCurrencyByCountry(cIso);
        }

        const st = State.getStatesOfCountry(cIso);
        setCompanyStates(st);
        const sIso = resolveStateIso(st, stateRaw);
        setSelectedCompanyState(sIso);
        const cities = City.getCitiesOfState(cIso, sIso);
        setCompanyCities(cities);
        setSelectedCompanyCity(resolveCityName(cities, cityRaw));
      } else {
        const stateRaw = pickField(item, ["state", "State", "branchState"], "");
        const cityRaw = pickField(item, ["city", "City", "branchCity"], "");
        const districtRaw = pickField(
          item,
          ["district", "District", "branchDistrict"],
          ""
        );

        setSelectedBranchDistrict(districtRaw);

        // Default to India for branches
        const st = State.getStatesOfCountry("IN");
        setBranchStates(st);
        const sIso = resolveStateIso(st, stateRaw);
        setSelectedBranchState(sIso);
        const cities = City.getCitiesOfState("IN", sIso);
        setBranchCities(cities);
        setSelectedBranchCity(resolveCityName(cities, cityRaw));
      }
    } catch (e) {
      console.warn("Prefill error", e);
    }
    // Dates
    if (activeTab === "company") {
      setFinancialYearDate(
        formatDateInput(
          item.financialYear ||
            item.financialYearBeginning ||
            item.financial_year_beginning_from
        )
      );
      setBookBeginningDate(
        formatDateInput(
          item.bookBeginning || item.booksBeginning || item.book_beginning_from
        )
      );

      // Currency fields for view mode - properly handle existing values
      setBaseCurrencySymbol(
        item.baseCurrencySymbol || item.base_currency_symbol || "₹"
      );
      setFormalName(item.formalName || item.formal_name || "INR");
      setAdditionalBaseCurrency(
        item.additionalBaseCurrency || item.additional_base_currency || "no"
      );
      setShowInMillions(item.showInMillions || item.show_in_millions || "no");
      setSuffixSymbolToAmount(
        item.suffixSymbolToAmount || item.suffix_symbol_to_amount || "yes"
      );
      setSpaceBetweenAmountAndSymbol(
        item.spaceBetweenAmountAndSymbol ||
          item.space_between_amount_and_symbol ||
          "no"
      );
    }
    setIsAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      if (activeTab === "company") {
        await companyApi.deleteCompany(getEntityId(deletingItem));
        await fetchCompanies(); // Refresh the list
        toast.success("Company deleted successfully");
      } else if (activeTab === "branch") {
        await branchApi.deleteBranch(getEntityId(deletingItem));
        await fetchBranches(); // Refresh the list
        toast.success("Branch deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Branch name validation for branch tab
    if (activeTab === "branch") {
      const name = (formData.get("branchname") as string) || "";
      if (
        !validateBranchName(
          name,
          activeItem ? getEntityId(activeItem) : undefined
        )
      ) {
        return; // Stop submission if validation fails
      }
    }

    try {
      if (isEditMode) {
        // Handle edit mode
        if (activeTab === "company" && editingItem) {
          const updatedData = {
            companyName: formData.get("companyName") as string,
            mailingName: formData.get("mailingName") as string,
            address: formData.get("address") as string,
            district:
              selectedCompanyDistrict ||
              (formData.get("district") as string) ||
              "",
            state: selectedCompanyState,
            country: selectedCompanyCountry,
            city: selectedCompanyCity,
            pincode: (formData.get("pincode") as string) || "",
            telephone: (formData.get("telephone") as string) || "",
            mobile: (formData.get("mobile") as string) || "",
            fax: (formData.get("fax") as string) || "",
            email: formData.get("email") as string,
            website: (formData.get("website") as string) || "",
            financialYear: financialYearDate,
            bookBeginning: bookBeginningDate,
            // Currency-related fields
            baseCurrencySymbol: baseCurrencySymbol,
            formalName: formalName,
            additionalBaseCurrency: additionalBaseCurrency,
            showInMillions: showInMillions,
            decimalPlaces: (formData.get("decimal-places") as string) || "2",
            afterDecimalWord:
              (formData.get("after-decimal-word") as string) || "paise",
            decimalPlacesInWords:
              (formData.get("decimal-places-in-words") as string) || "2",
            suffixSymbolToAmount: suffixSymbolToAmount,
            spaceBetweenAmountAndSymbol: spaceBetweenAmountAndSymbol,
          };
          await companyApi.updateCompany(getEntityId(editingItem), updatedData);
          await fetchCompanies(); // Refresh the list
          toast.success("Company updated successfully");
        } else if (activeTab === "branch" && editingItem) {
          const updatedData = {
            branchname: formData.get("branchname") as string,
            address: formData.get("address") as string,
            district:
              selectedBranchDistrict ||
              (formData.get("district") as string) ||
              "",
            state: selectedBranchState,
            city: selectedBranchCity,
            branchPincode:
              (formData.get("branchPincode") as string) ||
              (formData.get("pincode") as string) ||
              "",
            telephone:
              (formData.get("Telephone") as string) ||
              (formData.get("telephone") as string) ||
              "",
            mobile:
              (formData.get("Mobile") as string) ||
              (formData.get("mobile") as string) ||
              "",
            email: formData.get("email") as string,
            fax:
              (formData.get("Fax") as string) ||
              (formData.get("fax") as string) ||
              "",
          };
          await branchApi.updateBranch(getEntityId(editingItem), updatedData);
          await fetchBranches(); // Refresh the list
          toast.success("Branch updated successfully");
        }
        setIsEditMode(false);
        setEditingItem(null);
      } else {
        // Handle add mode
        if (activeTab === "company") {
          const companyData = {
            companyName: formData.get("companyName") as string,
            mailingName: formData.get("mailingName") as string,
            address: formData.get("address") as string,
            district:
              selectedCompanyDistrict ||
              (formData.get("district") as string) ||
              "",
            state: selectedCompanyState,
            country: selectedCompanyCountry,
            city: selectedCompanyCity,
            pincode: (formData.get("pincode") as string) || "",
            telephone: (formData.get("telephone") as string) || "",
            mobile: (formData.get("mobile") as string) || "",
            fax: (formData.get("fax") as string) || "",
            email: formData.get("email") as string,
            website: (formData.get("website") as string) || "",
            parentCompanyId: (formData.get("parentCompanyId") as string) || "",
            financialYear: financialYearDate,
            bookBeginning: bookBeginningDate,
            // Currency-related fields
            baseCurrencySymbol: baseCurrencySymbol,
            formalName: formalName,
            additionalBaseCurrency: additionalBaseCurrency,
            showInMillions: showInMillions,
            decimalPlaces: (formData.get("decimal-places") as string) || "2",
            afterDecimalWord:
              (formData.get("after-decimal-word") as string) || "paise",
            decimalPlacesInWords:
              (formData.get("decimal-places-in-words") as string) || "2",
            suffixSymbolToAmount: suffixSymbolToAmount,
            spaceBetweenAmountAndSymbol: spaceBetweenAmountAndSymbol,
          };
          await companyApi.createCompany(companyData);
          await fetchCompanies(); // Refresh the list
          toast.success("Company added successfully");
        } else if (activeTab === "branch") {
          const branchData = {
            branchname: formData.get("branchname") as string,
            address: formData.get("address") as string,
            district:
              selectedBranchDistrict ||
              (formData.get("district") as string) ||
              "",
            state: selectedBranchState,
            city: selectedBranchCity,
            branchPincode: (formData.get("branchPincode") as string) || "",
            telephone: (formData.get("Telephone") as string) || "",
            mobile: (formData.get("Mobile") as string) || "",
            fax: (formData.get("Fax") as string) || "",
            email: formData.get("email") as string,
          };
          await branchApi.createBranch(branchData);
          await fetchBranches(); // Refresh the list
          toast.success("Branch added successfully");
        }
      }

      setIsAddDialogOpen(false);
      resetFormData();
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Failed to save");
    }
  };

  // Filtered lists
  const filteredCompanies = searchTerm?.trim()
    ? companies.filter((c) => {
        const q = searchTerm.toLowerCase();
        return (
          (c.companyName ?? "").toLowerCase().includes(q) ||
          (c.mailingName ?? "").toLowerCase().includes(q) ||
          (c.address ?? "").toLowerCase().includes(q) ||
          (c.state ?? "").toLowerCase().includes(q) ||
          (c.country ?? "").toLowerCase().includes(q)
        );
      })
    : companies;

  const filteredBranches = branchSearchTerm?.trim()
    ? branches.filter((b) => {
        const q = branchSearchTerm.toLowerCase();
        return (
          (b.branchname ?? "").toLowerCase().includes(q) ||
          (b.city ?? "").toLowerCase().includes(q) ||
          (b.state ?? "").toLowerCase().includes(q) ||
          (b.address ?? "").toLowerCase().includes(q)
        );
      })
    : branches;

  // --- Branch Name Uniqueness Validation ---
  const [branchNameValidation, setBranchNameValidation] = useState({
    isValid: true,
    message: "",
  });

  // Financial Year Change Warning System
  const [isFinancialYearWarningOpen, setIsFinancialYearWarningOpen] =
    useState(false);
  const [isBooksBeginningWarningOpen, setIsBooksBeginningWarningOpen] =
    useState(false);
  const [pendingFinancialYearChange, setPendingFinancialYearChange] =
    useState("");
  const [pendingBooksBeginningChange, setPendingBooksBeginningChange] =
    useState("");
  const [hasExistingTransactions, setHasExistingTransactions] = useState(false);
  const [hasExistingMasters, setHasExistingMasters] = useState(false);

  // Check if company has existing data (transactions or masters)
  const checkExistingData = async (companyId?: string) => {
    if (!companyId) return;

    try {
      // Check for existing transactions (you'll need to implement these API calls)
      // const transactions = await transactionApi.getTransactionsByCompany(companyId);
      // const masters = await masterApi.getMastersByCompany(companyId);

      // For testing: simulate having existing data - set to true to test warnings
      const hasTransactions = true; // Change this to true to test the warning
      const hasMasters = true; // Change this to true to test the warning

      setHasExistingTransactions(hasTransactions);
      setHasExistingMasters(hasMasters);

      return hasTransactions || hasMasters;
    } catch (error) {
      console.error("Error checking existing data:", error);
      return false;
    }
  };

  // Handle financial year change with warning
  const handleFinancialYearChange = async (newDate: string) => {
    const currentCompanyId = editingItem ? getEntityId(editingItem) : null;

    // If editing existing company and dates are already set, check for existing data
    if (
      currentCompanyId &&
      financialYearDate &&
      newDate !== financialYearDate
    ) {
      const hasData = await checkExistingData(currentCompanyId);

      if (hasData || hasExistingTransactions || hasExistingMasters) {
        setPendingFinancialYearChange(newDate);
        setIsFinancialYearWarningOpen(true);
        return;
      }
    }

    // If no existing data or new company, allow change
    setFinancialYearDate(newDate);
  };

  // Handle books beginning change with warning
  const handleBooksBeginningChange = async (newDate: string) => {
    const currentCompanyId = editingItem ? getEntityId(editingItem) : null;

    // If editing existing company and dates are already set, check for existing data
    if (
      currentCompanyId &&
      bookBeginningDate &&
      newDate !== bookBeginningDate
    ) {
      const hasData = await checkExistingData(currentCompanyId);

      if (hasData || hasExistingTransactions || hasExistingMasters) {
        setPendingBooksBeginningChange(newDate);
        setIsBooksBeginningWarningOpen(true);
        return;
      }
    }

    // If no existing data or new company, allow change
    setBookBeginningDate(newDate);
  };

  console.log(featureloandata, "dskfjkdjfk sdf");

  // Confirm financial year change and reset data
  const confirmFinancialYearChange = async () => {
    try {
      const currentCompanyId = editingItem ? getEntityId(editingItem) : null;

      if (currentCompanyId) {
        // Reset all company data - implement these API calls as needed
        // await transactionApi.deleteAllTransactionsByCompany(currentCompanyId);
        // await masterApi.deleteAllMastersByCompany(currentCompanyId);
        // await ledgerApi.resetAllLedgerBalances(currentCompanyId);

        toast.success(
          "Financial year updated. All transaction and master data has been reset."
        );
      }

      setFinancialYearDate(pendingFinancialYearChange);
      setHasExistingTransactions(false);
      setHasExistingMasters(false);
    } catch (error) {
      console.error("Error resetting company data:", error);
      toast.error("Failed to reset company data. Please try again.");
    } finally {
      setIsFinancialYearWarningOpen(false);
      setPendingFinancialYearChange("");
    }
  };

  // Confirm books beginning change and reset data
  const confirmBooksBeginningChange = async () => {
    try {
      const currentCompanyId = editingItem ? getEntityId(editingItem) : null;

      if (currentCompanyId) {
        // Reset all company data - implement these API calls as needed
        // await transactionApi.deleteAllTransactionsByCompany(currentCompanyId);
        // await masterApi.deleteAllMastersByCompany(currentCompanyId);
        // await ledgerApi.resetAllLedgerBalances(currentCompanyId);

        toast.success(
          "Books beginning date updated. All transaction and master data has been reset."
        );
      }

      setBookBeginningDate(pendingBooksBeginningChange);
      setHasExistingTransactions(false);
      setHasExistingMasters(false);
    } catch (error) {
      console.error("Error resetting company data:", error);
      toast.error("Failed to reset company data. Please try again.");
    } finally {
      setIsBooksBeginningWarningOpen(false);
      setPendingBooksBeginningChange("");
    }
  };

  // Validate branch name uniqueness (case-insensitive, trimmed)
  const validateBranchName = (name: string, excludeId?: string | number) => {
    const trimmed = (name || "").trim();
    if (!trimmed) {
      setBranchNameValidation({
        isValid: false,
        message: "Branch name is required",
      });
      return false;
    }
    const exists = branches?.some(
      (b) =>
        (b.branchname || "").trim().toLowerCase() === trimmed.toLowerCase() &&
        (excludeId ? getEntityId(b) !== excludeId : true)
    );
    if (exists) {
      setBranchNameValidation({
        isValid: false,
        message: "A branch with this name already exists",
      });
      return false;
    }
    setBranchNameValidation({ isValid: true, message: "" });
    return true;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Structure
          </h1>
          <p className="text-gray-600 mt-2">Manage organizational hierarchy</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          // Ensure Indian states are loaded when switching to branch tab
          if (value === "branch") {
            const indianStates = State.getStatesOfCountry("IN");
            setBranchStates(indianStates);
          }
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="branch" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Branch</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Features</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Companies</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center w-64 h-9 rounded-md border border-input bg-background px-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
                    />
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open);
                      if (!open) resetFormData();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[99vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {isEditMode ? "Edit Company" : "Add New Company"}
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        key={`${activeTab}-${
                          activeItem ? getEntityId(activeItem) : "new"
                        }-${isViewMode ? "view" : isEditMode ? "edit" : "add"}`}
                        onSubmit={handleAddSubmit}
                        onKeyDown={createFormKeyDownHandler()}
                        className="space-y-4"
                      >
                        <fieldset disabled={isViewMode} className="contents">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4">
                            {/* Company Identifiers - Full Width */}
                            <div className="md:col-span-2">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 pt-1">
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="companyId"
                                    className="text-xs w-28 text-right"
                                  >
                                    Company ID:
                                  </Label>
                                  <Input
                                    id="companyId"
                                    name="companyId"
                                    className="h-6 text-xs flex-1"
                                    defaultValue={activeItem?.companyId || ""}
                                    ref={(el) => setFieldRef("companyId", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "companyId")
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="masterId"
                                    className="text-xs w-28 text-right"
                                  >
                                    Master ID:
                                  </Label>
                                  <Input
                                    id="masterId"
                                    name="masterId"
                                    className="h-6 text-xs flex-1"
                                    defaultValue={activeItem?.masterId || ""}
                                    ref={(el) => setFieldRef("masterId", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "masterId")
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="alterId"
                                    className="text-xs w-28 text-right"
                                  >
                                    Alter ID:
                                  </Label>
                                  <Input
                                    id="alterId"
                                    name="alterId"
                                    className="h-6 text-xs flex-1"
                                    defaultValue={activeItem?.alterId || ""}
                                    ref={(el) => setFieldRef("alterId", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "alterId")
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Basic Info - Full Width */}
                            <div className="md:col-span-2">
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center border-t border-b border-gray-200 py-3">
                                Basic Info
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="companyName"
                                    className="text-xs w-28 text-right"
                                  >
                                    Company Name:
                                  </Label>
                                  <Input
                                    id="companyName"
                                    name="companyName"
                                    className="h-6 text-xs flex-1"
                                    defaultValue={activeItem?.companyName || ""}
                                    required
                                    ref={(el) => setFieldRef("companyName", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "companyName")
                                    }
                                    onChange={(e) => {
                                      handleCompanyNameChange(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mailingName"
                                    className="text-xs w-28 text-right"
                                  >
                                    Mailing Name:
                                  </Label>
                                  <Input
                                    id="mailingName"
                                    name="mailingName"
                                    className="h-6 text-xs flex-1"
                                    required
                                    value={
                                      isEditMode
                                        ? editingItem?.mailingName || ""
                                        : mailingName
                                    }
                                    onChange={(e) =>
                                      setMailingName(e.target.value)
                                    }
                                    ref={(el) => setFieldRef("mailingName", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "mailingName")
                                    }
                                  />
                                </div>
                                <div className="md:col-span-2 flex items-start gap-2">
                                  <Label
                                    htmlFor="address"
                                    className="text-xs w-28 text-right pt-1"
                                  >
                                    Address:
                                  </Label>
                                  <Textarea
                                    id="address"
                                    name="address"
                                    className="text-xs flex-1 min-h-[60px]"
                                    defaultValue={activeItem?.address || ""}
                                    required
                                    ref={(el) => setFieldRef("address", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "address", true)
                                    }
                                  />
                                </div>
                                {/* Pincode Autofill Section with Toggle */}
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs w-28 text-right">
                                    Autofill by Pincode:
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">No</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={
                                          enableCompanyPincodeAutofill === "yes"
                                        }
                                        onChange={(e) =>
                                          setEnableCompanyPincodeAutofill(
                                            e.target.checked ? "yes" : "no"
                                          )
                                        }
                                        className="sr-only peer"
                                      />
                                      <div
                                        className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                                          enableCompanyPincodeAutofill === "yes"
                                            ? "bg-blue-600"
                                            : "bg-gray-200"
                                        } relative`}
                                      >
                                        <div
                                          className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                                            enableCompanyPincodeAutofill ===
                                            "yes"
                                              ? "translate-x-5"
                                              : "translate-x-0"
                                          }`}
                                        ></div>
                                      </div>
                                    </label>
                                    <span className="text-xs">Yes</span>
                                  </div>
                                  {enableCompanyPincodeAutofill === "yes" && (
                                    <Input
                                      id="pincode-autofill"
                                      name="pincode-autofill"
                                      className="h-6 text-xs flex-1"
                                      maxLength={6}
                                      pattern="[0-9]{6}"
                                      placeholder="Enter 6-digit pincode"
                                      onChange={async (e) => {
                                        const value = e.target.value;
                                        if (
                                          value.length === 6 &&
                                          /^\d{6}$/.test(value)
                                        ) {
                                          await handlePincodeChange(
                                            value,
                                            true
                                          );
                                          setCompanyPincode(value);
                                          setCompanyPincodeError("");
                                        } else if (value.length === 0) {
                                          setSelectedCompanyState("");
                                          setSelectedCompanyCity("");
                                          setSelectedCompanyDistrict("");
                                          setCompanyStates([]);
                                          setCompanyCities([]);
                                          setCompanyPincodes([]);
                                          setCompanyPincode("");
                                          setCompanyPincodeError("");
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                                {/* Country Field */}
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="country"
                                    className="text-xs w-28 text-right"
                                  >
                                    Country:
                                  </Label>
                                  <div ref={(el) => setFieldRef("country", el)}>
                                    <Select
                                      name="country"
                                      value={selectedCompanyCountry}
                                      onValueChange={(value) => {
                                        handleCompanyCountryChange(value);
                                        setTimeout(
                                          () => focusNextField("country"),
                                          100
                                        );
                                      }}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(
                                            e,
                                            "country",
                                            false,
                                            true
                                          )
                                        }
                                      >
                                        <SelectValue placeholder="Select Country" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[200px] overflow-y-auto">
                                        <div className="sticky top-0 bg-white p-2 border-b z-10">
                                          <Input
                                            placeholder="Search countries..."
                                            className="h-8 text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              const searchTerm =
                                                e.target.value.toLowerCase();
                                              // Use a more direct approach with setTimeout to ensure DOM is ready
                                              setTimeout(() => {
                                                const selectItems =
                                                  document.querySelectorAll(
                                                    '[role="option"]'
                                                  );
                                                selectItems.forEach((item) => {
                                                  const text =
                                                    item.textContent?.toLowerCase() ||
                                                    "";
                                                  const shouldShow =
                                                    text.includes(searchTerm);
                                                  (
                                                    item as HTMLElement
                                                  ).style.display = shouldShow
                                                    ? "flex"
                                                    : "none";
                                                });
                                              }, 10);
                                            }}
                                          />
                                        </div>
                                        {countries.map((country) => (
                                          <SelectItem
                                            key={country.isoCode}
                                            value={country.isoCode}
                                          >
                                            {country.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="state"
                                    className="text-xs w-28 text-right"
                                  >
                                    State:
                                  </Label>
                                  <div ref={(el) => setFieldRef("state", el)}>
                                    <Select
                                      name="state"
                                      value={selectedCompanyState}
                                      onValueChange={(value) => {
                                        handleCompanyStateChange(value);
                                        setTimeout(
                                          () => focusNextField("state"),
                                          100
                                        );
                                      }}
                                      disabled={!selectedCompanyCountry}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(e, "state", false, true)
                                        }
                                      >
                                        <SelectValue placeholder="Select State" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[200px] overflow-y-auto">
                                        <div className="sticky top-0 bg-white p-2 border-b z-10">
                                          <Input
                                            placeholder="Search states..."
                                            className="h-8 text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              const searchTerm =
                                                e.target.value.toLowerCase();
                                              setTimeout(() => {
                                                const selectItems =
                                                  document.querySelectorAll(
                                                    '[role="option"]'
                                                  );
                                                selectItems.forEach((item) => {
                                                  const text =
                                                    item.textContent?.toLowerCase() ||
                                                    "";
                                                  const shouldShow =
                                                    text.includes(searchTerm);
                                                  (
                                                    item as HTMLElement
                                                  ).style.display = shouldShow
                                                    ? "flex"
                                                    : "none";
                                                });
                                              }, 10);
                                            }}
                                          />
                                        </div>
                                        {companyStates.map((state) => (
                                          <SelectItem
                                            key={state.isoCode}
                                            value={state.isoCode}
                                          >
                                            {state.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="district"
                                    className="text-xs w-28 text-right"
                                  >
                                    District:
                                  </Label>
                                  <Input
                                    id="district"
                                    name="district"
                                    className="h-6 text-xs flex-1"
                                    value={
                                      selectedCompanyDistrict ||
                                      activeItem?.district ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedCompanyDistrict(e.target.value)
                                    }
                                    ref={(el) => setFieldRef("district", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "district")
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="city"
                                    className="text-xs w-28 text-right"
                                  >
                                    City:
                                  </Label>
                                  <div ref={(el) => setFieldRef("city", el)}>
                                    <Select
                                      name="city"
                                      value={selectedCompanyCity}
                                      onValueChange={(value) => {
                                        handleCompanyCityChange(value);
                                        setTimeout(
                                          () => focusNextField("city"),
                                          100
                                        );
                                      }}
                                      disabled={!selectedCompanyState}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(e, "city", false, true)
                                        }
                                      >
                                        <SelectValue placeholder="Select City" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[200px] overflow-y-auto">
                                        <div className="sticky top-0 bg-white p-2 border-b z-10">
                                          <Input
                                            placeholder="Search cities..."
                                            className="h-8 text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              const searchTerm =
                                                e.target.value.toLowerCase();
                                              setTimeout(() => {
                                                const selectItems =
                                                  document.querySelectorAll(
                                                    '[role="option"]'
                                                  );
                                                selectItems.forEach((item) => {
                                                  const text =
                                                    item.textContent?.toLowerCase() ||
                                                    "";
                                                  const shouldShow =
                                                    text.includes(searchTerm);
                                                  (
                                                    item as HTMLElement
                                                  ).style.display = shouldShow
                                                    ? "flex"
                                                    : "none";
                                                });
                                              }, 10);
                                            }}
                                          />
                                        </div>
                                        {companyCities.map((city) => (
                                          <SelectItem
                                            key={city.name}
                                            value={city.name}
                                          >
                                            {city.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="pincode"
                                    className="text-xs w-28 text-right"
                                  >
                                    Pincode:
                                  </Label>
                                  <div className="flex-1">
                                    {companyPincodes.length > 0 ? (
                                      <div
                                        ref={(el) => setFieldRef("pincode", el)}
                                      >
                                        <Select
                                          name="pincode"
                                          value={companyPincode || undefined}
                                          onValueChange={(value) => {
                                            setCompanyPincode(value);
                                            setTimeout(
                                              () => focusNextField("pincode"),
                                              100
                                            );
                                          }}
                                        >
                                          <SelectTrigger
                                            className="h-6 text-xs flex-1"
                                            onKeyDown={(e) =>
                                              handleKeyDown(
                                                e,
                                                "pincode",
                                                false,
                                                true
                                              )
                                            }
                                          >
                                            <SelectValue placeholder="Select Pincode" />
                                          </SelectTrigger>
                                          <SelectContent className="max-h-[200px] overflow-y-auto">
                                            <div className="sticky top-0 bg-white p-2 border-b z-10">
                                              <Input
                                                placeholder="Search pincodes..."
                                                className="h-8 text-xs"
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                onKeyDown={(e) =>
                                                  e.stopPropagation()
                                                }
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  const searchTerm =
                                                    e.target.value.toLowerCase();
                                                  setTimeout(() => {
                                                    const selectItems =
                                                      document.querySelectorAll(
                                                        '[role="option"]'
                                                      );
                                                    selectItems.forEach(
                                                      (item) => {
                                                        const text =
                                                          item.textContent?.toLowerCase() ||
                                                          "";
                                                        const shouldShow =
                                                          text.includes(
                                                            searchTerm
                                                          );
                                                        (
                                                          item as HTMLElement
                                                        ).style.display =
                                                          shouldShow
                                                            ? "flex"
                                                            : "none";
                                                      }
                                                    );
                                                  }, 10);
                                                }}
                                              />
                                            </div>
                                            {companyPincodes.map(
                                              (pincode, index) => (
                                                <SelectItem
                                                  key={index}
                                                  value={pincode.pincode}
                                                >
                                                  {pincode.pincode} -{" "}
                                                  {pincode.area}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                        {/* Hidden input to ensure pincode is submitted */}
                                        <input
                                          type="hidden"
                                          name="pincode"
                                          value={companyPincode || ""}
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <Input
                                          id="pincode"
                                          name="pincode"
                                          className={`h-6 text-xs w-full ${
                                            companyPincodeError
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                          required
                                          maxLength={6}
                                          pattern="[0-9]{6}"
                                          placeholder="Enter 6-digit pincode"
                                          value={
                                            companyPincode ||
                                            activeItem?.pincode ||
                                            ""
                                          }
                                          ref={(el) =>
                                            setFieldRef("pincode", el)
                                          }
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, "pincode")
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setCompanyPincode(value);
                                            handleManualPincodeInput(
                                              value,
                                              true
                                            );
                                          }}
                                        />
                                        {companyPincodeError && (
                                          <p className="text-xs text-red-500 mt-1">
                                            {companyPincodeError}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {/* <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="fax"
                                    className="text-xs w-28 text-right"
                                  >
                                    Fax:
                                  </Label>
                                  <Input
                                    id="fax"
                                    name="fax"
                                    className="h-6 text-xs flex-1"
                                    required
                                    defaultValue={activeItem?.fax || ""}
                                    ref={(el) => setFieldRef("fax", el)}
                                    onKeyDown={(e) => handleKeyDown(e, "fax")}
                                  />
                                </div> */}
                              </div>
                            </div>

                            {/* Communication Info - Full Width */}
                            <div className="md:col-span-2">
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center border-t border-b border-gray-200 py-3">
                                Communication Info
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="telephone"
                                    className="text-xs w-28 text-right"
                                  >
                                    Telephone:
                                  </Label>
                                  <div className="flex flex-1 gap-1">
                                    <div className="w-16">
                                      <Input
                                        value={
                                          selectedCompanyCountry
                                            ? getCountryCode(
                                                selectedCompanyCountry
                                              )
                                            : "+1"
                                        }
                                        className="h-6 text-xs text-center bg-gray-50"
                                        readOnly
                                      />
                                    </div>
                                    <Input
                                      id="telephone"
                                      name="telephone"
                                      className="h-6 text-xs flex-1"
                                      placeholder="Enter phone number"
                                      required
                                      defaultValue={activeItem?.telephone || ""}
                                      ref={(el) => setFieldRef("telephone", el)}
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, "telephone")
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="mobile"
                                    className="text-xs w-28 text-right"
                                  >
                                    Mobile:
                                  </Label>
                                  <div className="flex flex-1 gap-1">
                                    <div className="w-16">
                                      <Input
                                        value={
                                          selectedCompanyCountry
                                            ? getCountryCode(
                                                selectedCompanyCountry
                                              )
                                            : "+1"
                                        }
                                        className="h-6 text-xs text-center bg-gray-50"
                                        readOnly
                                      />
                                    </div>
                                    <Input
                                      id="mobile"
                                      name="mobile"
                                      className="h-6 text-xs flex-1"
                                      placeholder="Enter mobile number"
                                      required
                                      defaultValue={activeItem?.mobile || ""}
                                      ref={(el) => setFieldRef("mobile", el)}
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, "mobile")
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="email"
                                    className="text-xs w-28 text-right"
                                  >
                                    Email:
                                  </Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="h-6 text-xs flex-1"
                                    value={companyEmail}
                                    onChange={(e) =>
                                      handleEmailChange(e.target.value, true)
                                    }
                                    required
                                    ref={(el) => setFieldRef("email", el)}
                                    onKeyDown={(e) => handleKeyDown(e, "email")}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="website"
                                    className="text-xs w-28 text-right"
                                  >
                                    Website:
                                  </Label>
                                  <Input
                                    id="website"
                                    name="website"
                                    className="h-6 text-xs flex-1"
                                    defaultValue={activeItem?.website || ""}
                                    ref={(el) => setFieldRef("website", el)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "website")
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Accounting Info - Full Width */}
                            <div className="md:col-span-2">
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center border-t border-b border-gray-200 py-3">
                                Accounting Info
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="financial-year-beginning-from"
                                    className="text-xs w-28 text-right"
                                  >
                                    Financial Year:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="financial-year-beginning-from"
                                    name="financial-year-beginning-from"
                                    className="h-6 text-xs flex-1"
                                    required
                                    value={financialYearDate}
                                    onChange={(e) =>
                                      handleFinancialYearChange(e.target.value)
                                    }
                                    ref={(el) =>
                                      setFieldRef(
                                        "financial-year-beginning-from",
                                        el
                                      )
                                    }
                                    onKeyDown={(e) =>
                                      handleKeyDown(
                                        e,
                                        "financial-year-beginning-from"
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="book-beginning-from"
                                    className="text-xs w-28 text-right"
                                  >
                                    Books Beginning:
                                  </Label>
                                  <Input
                                    type="date"
                                    id="book-beginning-from"
                                    name="book-beginning-from"
                                    className="h-6 text-xs flex-1"
                                    required
                                    value={bookBeginningDate}
                                    onChange={(e) =>
                                      handleBooksBeginningChange(e.target.value)
                                    }
                                    ref={(el) =>
                                      setFieldRef("book-beginning-from", el)
                                    }
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "book-beginning-from")
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Currency Section - Full Width */}
                            <div className="md:col-span-2">
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center border-t border-b border-gray-200 py-3">
                                Currency
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="base-currency-symbol"
                                    className="text-xs w-28 text-right"
                                  >
                                    Currency Symbol:
                                  </Label>
                                  <div
                                    ref={(el) =>
                                      setFieldRef("base-currency-symbol", el)
                                    }
                                  >
                                    <Select
                                      name="base-currency-symbol"
                                      value={baseCurrencySymbol}
                                      defaultValue={
                                        activeItem?.baseCurrencySymbol ||
                                        activeItem?.base_currency_symbol ||
                                        "₹"
                                      }
                                      onValueChange={(value) => {
                                        setBaseCurrencySymbol(value);
                                        setTimeout(
                                          () =>
                                            focusNextField(
                                              "base-currency-symbol"
                                            ),
                                          100
                                        );
                                      }}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(
                                            e,
                                            "base-currency-symbol",
                                            false,
                                            true
                                          )
                                        }
                                      >
                                        <SelectValue placeholder="Select option" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="₹">
                                          ₹ - Indian Rupee
                                        </SelectItem>
                                        <SelectItem value="$">
                                          $ - US Dollar
                                        </SelectItem>
                                        <SelectItem value="€">
                                          € - Euro
                                        </SelectItem>
                                        <SelectItem value="£">
                                          £ - British Pound
                                        </SelectItem>
                                        <SelectItem value="¥">
                                          ¥ - Japanese Yen
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor="formal-name"
                                    className="text-xs w-28 text-right"
                                  >
                                    Formal Name:
                                  </Label>
                                  <div
                                    ref={(el) => setFieldRef("formal-name", el)}
                                  >
                                    <Select
                                      name="formal-name"
                                      value={formalName}
                                      defaultValue={
                                        activeItem?.formalName ||
                                        activeItem?.formal_name ||
                                        "INR"
                                      }
                                      onValueChange={(value) => {
                                        setFormalName(value);
                                        setTimeout(
                                          () => focusNextField("formal-name"),
                                          100
                                        );
                                      }}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(
                                            e,
                                            "formal-name",
                                            false,
                                            true
                                          )
                                        }
                                      >
                                        <SelectValue placeholder="Select option" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="INR">
                                          INR - Indian Rupee
                                        </SelectItem>
                                        <SelectItem value="USD">
                                          USD - US Dollar
                                        </SelectItem>
                                        <SelectItem value="EUR">
                                          EUR - Euro
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Currency Details - Full Width */}
                              <div className="mt-4">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="show-more-currency"
                                    checked={additionalBaseCurrency === "yes"}
                                    onChange={(e) =>
                                      setAdditionalBaseCurrency(
                                        e.target.checked ? "yes" : "no"
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <input
                                    type="hidden"
                                    name="additional-base-currency"
                                    value={additionalBaseCurrency}
                                  />
                                  <Label
                                    htmlFor="show-more-currency"
                                    className="text-xs cursor-pointer"
                                  >
                                    Show More Currency Details
                                  </Label>
                                </div>
                              </div>

                              {additionalBaseCurrency === "yes" && (
                                <div className="mt-4 space-y-2 pl-4 border-l-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="show-in-millions"
                                        className="text-xs w-40 text-right"
                                      >
                                        Show amount in millions:
                                      </Label>
                                      <div
                                        ref={(el) =>
                                          setFieldRef("show-in-millions", el)
                                        }
                                      >
                                        <Select
                                          name="show-in-millions"
                                          value={showInMillions}
                                          onValueChange={(value) => {
                                            setShowInMillions(value);
                                            setTimeout(
                                              () =>
                                                focusNextField(
                                                  "show-in-millions"
                                                ),
                                              100
                                            );
                                          }}
                                        >
                                          <SelectTrigger
                                            className="h-6 text-xs flex-1"
                                            onKeyDown={(e) =>
                                              handleKeyDown(
                                                e,
                                                "show-in-millions",
                                                false,
                                                true
                                              )
                                            }
                                          >
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="yes">
                                              Yes
                                            </SelectItem>
                                            <SelectItem value="no">
                                              No
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="decimal-places"
                                        className="text-xs w-40 text-right"
                                      >
                                        Number of decimal places:
                                      </Label>
                                      <Input
                                        id="decimal-places"
                                        name="decimal-places"
                                        type="number"
                                        min={0}
                                        max={6}
                                        defaultValue={2}
                                        className="h-6 text-xs flex-1"
                                        ref={(el) =>
                                          setFieldRef("decimal-places", el)
                                        }
                                        onKeyDown={(e) =>
                                          handleKeyDown(e, "decimal-places")
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="after-decimal-word"
                                        className="text-xs w-40 text-right"
                                      >
                                        Word after decimal:
                                      </Label>
                                      <Input
                                        id="after-decimal-word"
                                        name="after-decimal-word"
                                        defaultValue="paise"
                                        className="h-6 text-xs flex-1"
                                        ref={(el) =>
                                          setFieldRef("after-decimal-word", el)
                                        }
                                        onKeyDown={(e) =>
                                          handleKeyDown(e, "after-decimal-word")
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="decimal-places-in-words"
                                        className="text-xs w-40 text-right"
                                      >
                                        Decimal places in words:
                                      </Label>
                                      <Input
                                        id="decimal-places-in-words"
                                        name="decimal-places-in-words"
                                        type="number"
                                        min={0}
                                        max={6}
                                        defaultValue={2}
                                        className="h-6 text-xs flex-1"
                                        ref={(el) =>
                                          setFieldRef(
                                            "decimal-places-in-words",
                                            el
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleKeyDown(
                                            e,
                                            "decimal-places-in-words"
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="suffix-symbol-to-amount"
                                        className="text-xs w-40 text-right"
                                      >
                                        Suffix symbol to amount:
                                      </Label>
                                      <div
                                        ref={(el) =>
                                          setFieldRef(
                                            "suffix-symbol-to-amount",
                                            el
                                          )
                                        }
                                      >
                                        <Select
                                          name="suffix-symbol-to-amount"
                                          value={suffixSymbolToAmount}
                                          onValueChange={(value) => {
                                            setSuffixSymbolToAmount(value);
                                            setTimeout(
                                              () =>
                                                focusNextField(
                                                  "suffix-symbol-to-amount"
                                                ),
                                              100
                                            );
                                          }}
                                        >
                                          <SelectTrigger
                                            className="h-6 text-xs flex-1"
                                            onKeyDown={(e) =>
                                              handleKeyDown(
                                                e,
                                                "suffix-symbol-to-amount",
                                                false,
                                                true
                                              )
                                            }
                                          >
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="yes">
                                              Yes
                                            </SelectItem>
                                            <SelectItem value="no">
                                              No
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="space-between-amount-and-symbol"
                                        className="text-xs w-40 text-right"
                                      >
                                        Space b/w amount & symbol:
                                      </Label>
                                      <div
                                        ref={(el) =>
                                          setFieldRef(
                                            "space-between-amount-and-symbol",
                                            el
                                          )
                                        }
                                      >
                                        <Select
                                          name="space-between-amount-and-symbol"
                                          value={spaceBetweenAmountAndSymbol}
                                          onValueChange={(value) => {
                                            setSpaceBetweenAmountAndSymbol(
                                              value
                                            );
                                            setTimeout(
                                              () =>
                                                focusNextField(
                                                  "space-between-amount-and-symbol"
                                                ),
                                              100
                                            );
                                          }}
                                        >
                                          <SelectTrigger
                                            className="h-6 text-xs flex-1"
                                            onKeyDown={(e) =>
                                              handleKeyDown(
                                                e,
                                                "space-between-amount-and-symbol",
                                                false,
                                                true
                                              )
                                            }
                                          >
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="yes">
                                              Yes
                                            </SelectItem>
                                            <SelectItem value="no">
                                              No
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </fieldset>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          {!isViewMode && (
                            <Button type="submit">
                              {isEditMode ? "Update Company" : "Add Company"}
                            </Button>
                          )}
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Mailing Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={getEntityId(company)}>
                      <TableCell className="font-medium">
                        {company.companyName}
                      </TableCell>
                      <TableCell>{company.mailingName}</TableCell>
                      <TableCell>{company.address}</TableCell>
                      <TableCell>{company.state}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(company)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openDeleteDialog(company)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle>Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {/* Enable Loan Management Toggle */}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="enableLoanManagement"
                      className="text-xs w-40 text-right"
                    >
                      Enable Loan Management:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">No</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="enableLoanManagement"
                          checked={
                            featureloandata.enableloanmanagement === "yes"
                          }
                          onChange={(e) => {
                            const value = e.target.checked ? "yes" : "no";
                            featureloandata.enableloanmanagement = value;
                            setEnableLoanManagement(value);
                            if (value === "no") {
                              setSelectedLoanTypes([]);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                            featureloandata.enableloanmanagement === "yes"
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          } relative`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                              featureloandata.enableloanmanagement === "yes"
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                      <span className="text-xs">Yes</span>
                    </div>
                  </div>

                  {/* Loan Types - Show only when Enable Loan Management is Yes */}
                  {featureloandata.enableloanmanagement === "yes" && (
                    <div className="ml-8 mt-2">
                      <Label className="text-xs font-medium mb-2 block">
                        Applicable Loan Types:
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {loantype.map((loanType) => (
                          <div
                            key={loanType._id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`loan-${loanType._id
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`}
                              checked={selectedLoanTypes.includes(loanType._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLoanTypes((prev) => [
                                    ...prev,
                                    loanType._id,
                                  ]);
                                } else {
                                  setSelectedLoanTypes((prev) =>
                                    prev.filter((type) => type !== loanType._id)
                                  );
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                              htmlFor={`loan-${loanType._id
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`}
                              className="text-xs cursor-pointer"
                            >
                              {loanType.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enable Recurring Deposit Management Toggle */}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="enableRecurringDepositManagement"
                      className="text-xs w-40 text-right"
                    >
                      Enable Recurring Deposit Management:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">No</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="enableRecurringDepositManagement"
                          checked={
                            featureloandata.enablerecurringdeposit === "yes"
                          }
                          onChange={(e) => {
                            const value = e.target.checked ? "yes" : "no";
                            featureloandata.enablerecurringdeposit = value;
                            setEnableRecurringDepositManagement(value);
                            if (value === "no") {
                              setAutoCalculateLoanTenure("no");
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                            featureloandata.enablerecurringdeposit === "yes"
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          } relative`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                              featureloandata.enablerecurringdeposit === "yes"
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                      <span className="text-xs">Yes</span>
                    </div>
                  </div>

                  {/* Auto Calculate Loan Tenure - Show only when Enable Recurring Deposit Management is Yes */}
                  {featureloandata.enablerecurringdeposit === "yes" && (
                    <div className="flex items-center gap-2 ml-8 mt-2">
                      <Label className="text-xs w-32 text-right">
                        Auto Calculate Loan Tenure as Per RD:
                      </Label>
                      <div className="w-20">
                        <Select
                          value={featureloandata.autocalculateloanrd}
                          onValueChange={(value: "yes" | "no") => {
                            featureloandata.autocalculateloanrd = value;
                            setAutoCalculateLoanTenure(value);
                          }}
                        >
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Enable Fixed Deposit Management Toggle */}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="enableFixedDepositManagement"
                      className="text-xs w-40 text-right"
                    >
                      Enable Fixed Deposit Management:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">No</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="enableFixedDepositManagement"
                          checked={featureloandata.enablefixedloan === "yes"}
                          onChange={(e) => {
                            const value = e.target.checked ? "yes" : "no";
                            featureloandata.enablefixedloan = value;
                            setEnableFixedDepositManagement(value);
                            if (value === "no") {
                              setAutoCalculateLoanTenureForFD("no");
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                            featureloandata.enablefixedloan === "yes"
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          } relative`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                              featureloandata.enablefixedloan === "yes"
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                      <span className="text-xs">Yes</span>
                    </div>
                  </div>

                  {/* Auto Calculate Loan Tenure for FD - Show only when Enable Fixed Deposit Management is Yes */}
                  {featureloandata.enablefixedloan === "yes" && (
                    <div className="flex items-center gap-2 ml-8 mt-2">
                      <Label className="text-xs w-32 text-right">
                        Auto Calculate Loan Tenure as Per FD:
                      </Label>
                      <div className="w-20">
                        <Select
                          value={featureloandata.autocalculateloanfd}
                          onValueChange={(value: "yes" | "no") => {
                            featureloandata.autocalculateloanfd = value;
                            setAutoCalculateLoanTenureForFD(value);
                          }}
                        >
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Member ID Config */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="MemberIdConfig"
                        className="text-xs w-40 text-right"
                      >
                        Member ID Config:
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">No</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="MemberIdConfig"
                            checked={featureloandata.memberidconfig === "yes"}
                            onChange={(e) => {
                              const value: "yes" | "no" = e.target.checked
                                ? "yes"
                                : "no";
                              setfeatureloandata({
                                ...featureloandata,
                                memberidconfig: value,
                              });
                            }}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                              featureloandata.memberidconfig === "yes"
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            } relative`}
                          >
                            <div
                              className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                                featureloandata.memberidconfig === "yes"
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                        </label>
                        <span className="text-xs">Yes</span>
                      </div>
                    </div>

                    {featureloandata.memberidconfig === "yes" && (
                      <div className="ml-8 mt-3 space-y-4">
                        <h3 className="text-sm font-semibold text-center border-y border-gray-200 py-2">
                          Member ID Configuration
                        </h3>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-40 text-right">
                            Format Type
                          </Label>
                          <div className="w-48">
                            <Select
                              value={featureloandata.memberidformat}
                              onValueChange={(
                                v: "auto" | "branchwise" | "manual"
                              ) =>
                                setfeatureloandata({
                                  ...featureloandata,
                                  memberidformat: v as any,
                                })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Format Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto</SelectItem>
                                <SelectItem value="branchwise">
                                  Branchwise
                                </SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {featureloandata.memberidformat === "manual" && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs w-40 text-right">
                              Display last ID?
                            </Label>
                            <div className="w-24">
                              <Select
                                value={featureloandata.memberiddisplaylastid}
                                onValueChange={(v: "yes" | "no") =>
                                  setfeatureloandata({
                                    ...featureloandata,
                                    memberiddisplaylastid: v,
                                  })
                                }
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="yes">Yes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Table for prefix and numeric part (multi-row) */}
                        <div className="rounded-md border bg-white">
                          <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                            <span className="text-xs text-gray-600">
                              Press Enter in any field to add a new row
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                const rows = [
                                  ...(featureloandata.memberidrows || []),
                                ];
                                rows.push({
                                  applicableFrom: "",
                                  prefix: "",
                                  starting: "0",
                                  width: "0",
                                });
                                setfeatureloandata({
                                  ...featureloandata,
                                  memberidrows: rows,
                                });
                                // focus first field of the newly added row
                                setTimeout(
                                  () =>
                                    focusMemberIdField(rows.length - 1, "date"),
                                  0
                                );
                              }}
                            >
                              Add Row
                            </Button>
                          </div>
                          <div className="grid grid-cols-12 text-[11px] font-medium px-3 py-2 border-b bg-gray-50">
                            <div className="col-span-3">Applicable From</div>
                            <div className="col-span-3">Prefix</div>
                            <div className="col-span-2">Starting Number</div>
                            <div className="col-span-2">
                              Width Of Numerical Part
                            </div>
                            <div className="col-span-1 text-right pr-2">
                              Format
                            </div>
                            <div className="col-span-1 text-center">Action</div>
                          </div>
                          {(featureloandata.memberidrows || []).map(
                            (row: any, idx: number) => (
                              <div
                                key={idx}
                                className="grid grid-cols-12 items-center text-xs px-3 py-2 border-b last:border-b-0 hover:bg-gray-50"
                              >
                                <div className="col-span-3 pr-2">
                                  <Input
                                    className="h-7 text-xs"
                                    type="date"
                                    id={`memberid-${idx}-date`}
                                    value={row.applicableFrom || ""}
                                    onChange={(e) => {
                                      const rows = [
                                        ...(featureloandata.memberidrows || []),
                                      ];
                                      rows[idx] = {
                                        ...rows[idx],
                                        applicableFrom: e.target.value,
                                      };
                                      setfeatureloandata({
                                        ...featureloandata,
                                        memberidrows: rows,
                                      });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        focusMemberIdField(idx, "prefix");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-span-3 pr-2">
                                  <Input
                                    className="h-7 text-xs"
                                    placeholder="e.g. MEM/"
                                    id={`memberid-${idx}-prefix`}
                                    value={row.prefix}
                                    onChange={(e) => {
                                      const rows = [
                                        ...(featureloandata.memberidrows || []),
                                      ];
                                      rows[idx] = {
                                        ...rows[idx],
                                        prefix: e.target.value,
                                      };
                                      setfeatureloandata({
                                        ...featureloandata,
                                        memberidrows: rows,
                                      });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        focusMemberIdField(idx, "starting");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-span-2 pr-2">
                                  <Input
                                    className="h-7 text-xs"
                                    type="number"
                                    placeholder="0"
                                    id={`memberid-${idx}-starting`}
                                    value={row.starting}
                                    onChange={(e) => {
                                      const rows = [
                                        ...(featureloandata.memberidrows || []),
                                      ];
                                      rows[idx] = {
                                        ...rows[idx],
                                        starting: e.target.value,
                                      };
                                      setfeatureloandata({
                                        ...featureloandata,
                                        memberidrows: rows,
                                      });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        focusMemberIdField(idx, "width");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-span-2 pr-2">
                                  <Input
                                    className="h-7 text-xs"
                                    type="number"
                                    placeholder="0"
                                    id={`memberid-${idx}-width`}
                                    value={row.width}
                                    onChange={(e) => {
                                      const rows = [
                                        ...(featureloandata.memberidrows || []),
                                      ];
                                      rows[idx] = {
                                        ...rows[idx],
                                        width: e.target.value,
                                      };
                                      setfeatureloandata({
                                        ...featureloandata,
                                        memberidrows: rows,
                                      });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const rows = [
                                          ...(featureloandata.memberidrows ||
                                            []),
                                        ];
                                        const complete = isMemberRowComplete(
                                          rows[idx]
                                        );
                                        if (complete) {
                                          rows.push({
                                            applicableFrom: "",
                                            prefix: "",
                                            starting: "0",
                                            width: "",
                                          });
                                          setfeatureloandata({
                                            ...featureloandata,
                                            memberidrows: rows,
                                          });
                                          setTimeout(
                                            () =>
                                              focusMemberIdField(
                                                rows.length - 1,
                                                "date"
                                              ),
                                            0
                                          );
                                        } else {
                                          const r = rows[idx];
                                          if (!r.applicableFrom)
                                            return focusMemberIdField(
                                              idx,
                                              "date"
                                            );
                                          if (
                                            !r.prefix ||
                                            r.prefix.trim() === ""
                                          )
                                            return focusMemberIdField(
                                              idx,
                                              "prefix"
                                            );
                                          if (
                                            r.starting === "" ||
                                            r.starting === undefined
                                          )
                                            return focusMemberIdField(
                                              idx,
                                              "starting"
                                            );
                                          if (
                                            r.width === "" ||
                                            r.width === undefined
                                          )
                                            return focusMemberIdField(
                                              idx,
                                              "width"
                                            );
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-span-1 text-right pr-2">
                                  <span className="text-gray-700">
                                    {featureloandata.memberidformat ===
                                    "branchwise"
                                      ? `<BranchCode>/${
                                          row.prefix || ""
                                        }${String(
                                          Number(row.starting || 0)
                                        ).padStart(
                                          Number(row.width || 0),
                                          "0"
                                        )}`
                                      : `${row.prefix || ""}${String(
                                          Number(row.starting || 0)
                                        ).padStart(
                                          Number(row.width || 0),
                                          "0"
                                        )}`}
                                  </span>
                                </div>
                                <div className="col-span-1 text-center">
                                  <button
                                    type="button"
                                    className="text-[11px] text-red-600 hover:underline"
                                    onClick={() => {
                                      const rows = [
                                        ...(featureloandata.memberidrows || []),
                                      ];
                                      rows.splice(idx, 1);
                                      setfeatureloandata({
                                        ...featureloandata,
                                        memberidrows: rows.length
                                          ? rows
                                          : [
                                              {
                                                applicableFrom: "",
                                                prefix: "",
                                                starting: "0",
                                                width: "0",
                                              },
                                            ],
                                      });
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      savefeaturedata();
                    }}
                  >
                    Save Features
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branch">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Branches</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center w-64 h-9 rounded-md border border-input bg-background px-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search branches..."
                      value={branchSearchTerm}
                      onChange={(e) => setBranchSearchTerm(e.target.value)}
                      className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
                    />
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open);
                      if (!open) {
                        resetFormData();
                      } else if (activeTab === "branch") {
                        // Ensure Indian states are loaded when opening branch dialog
                        const indianStates = State.getStatesOfCountry("IN");
                        setBranchStates(indianStates);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[99vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {isEditMode ? "Edit Branch" : "Add New Branch"}
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        key={`${activeTab}-${
                          activeItem ? getEntityId(activeItem) : "new"
                        }-${isViewMode ? "view" : isEditMode ? "edit" : "add"}`}
                        onSubmit={handleAddSubmit}
                        onKeyDown={createFormKeyDownHandler()}
                        className="space-y-4"
                      >
                        <fieldset disabled={isViewMode} className="contents">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="companyId"
                                className="text-xs w-40 text-right"
                              >
                                Company ID:
                              </Label>
                              <Input
                                id="companyId"
                                name="companyId"
                                className="h-6 text-xs flex-1"
                                ref={(el) => setFieldRef("companyId", el)}
                                onKeyDown={(e) => handleKeyDown(e, "companyId")}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="masterId"
                                className="text-xs w-40 text-right"
                              >
                                Master ID:
                              </Label>
                              <Input
                                id="masterId"
                                name="masterId"
                                className="h-6 text-xs flex-1"
                                ref={(el) => setFieldRef("masterId", el)}
                                onKeyDown={(e) => handleKeyDown(e, "masterId")}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="alterId"
                                className="text-xs w-40 text-right"
                              >
                                Alter ID:
                              </Label>
                              <Input
                                id="alterId"
                                name="alterId"
                                className="h-6 text-xs flex-1"
                                ref={(el) => setFieldRef("alterId", el)}
                                onKeyDown={(e) => handleKeyDown(e, "alterId")}
                              />
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor="branchname"
                                  className="text-xs w-40 text-right"
                                >
                                  Branch Name:
                                </Label>
                                <Input
                                  id="branchname"
                                  name="branchname"
                                  className={`h-6 text-xs flex-1 ${
                                    !branchNameValidation.isValid
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  required
                                  defaultValue={activeItem?.branchname || ""}
                                  ref={(el) => setFieldRef("branchname", el)}
                                  onBlur={(e) =>
                                    validateBranchName(
                                      e.target.value,
                                      activeItem
                                        ? getEntityId(activeItem)
                                        : undefined
                                    )
                                  }
                                  onChange={(e) => {
                                    if (!branchNameValidation.isValid)
                                      validateBranchName(
                                        e.target.value,
                                        activeItem
                                          ? getEntityId(activeItem)
                                          : undefined
                                      );
                                  }}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, "branchname")
                                  }
                                />
                              </div>
                              {!branchNameValidation.isValid && (
                                <span className="text-xs text-red-500 ml-40">
                                  {branchNameValidation.message}
                                </span>
                              )}
                            </div>

                            <div className="flex items-start gap-2">
                              <Label
                                htmlFor="address"
                                className="text-xs w-40 text-right pt-1"
                              >
                                Address:
                              </Label>
                              <Textarea
                                id="address"
                                name="address"
                                className="text-xs flex-1 min-h-[40px]"
                                required
                                defaultValue={activeItem?.address || ""}
                                ref={(el) => setFieldRef("address", el)}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, "address", true)
                                }
                              />
                            </div>
                            {/* Toggle + Autofill by Pincode */}
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-40 text-right">
                                Autofill by Pincode:
                              </Label>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">No</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={
                                      enableBranchPincodeAutofill === "yes"
                                    }
                                    onChange={(e) =>
                                      setEnableBranchPincodeAutofill(
                                        e.target.checked ? "yes" : "no"
                                      )
                                    }
                                    className="sr-only peer"
                                  />
                                  <div
                                    className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                                      enableBranchPincodeAutofill === "yes"
                                        ? "bg-blue-600"
                                        : "bg-gray-200"
                                    } relative`}
                                  >
                                    <div
                                      className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                                        enableBranchPincodeAutofill === "yes"
                                          ? "translate-x-5"
                                          : "translate-x-0"
                                      }`}
                                    ></div>
                                  </div>
                                </label>
                                <span className="text-xs">Yes</span>
                              </div>
                              {enableBranchPincodeAutofill === "yes" && (
                                <Input
                                  id="branch-pincode-autofill"
                                  name="branch-pincode-autofill"
                                  className="h-6 text-xs flex-1"
                                  maxLength={6}
                                  pattern="[0-9]{6}"
                                  placeholder="Enter 6-digit pincode"
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    if (
                                      value.length === 6 &&
                                      /^\d{6}$/.test(value)
                                    ) {
                                      // Fetch location data for branch pincode
                                      await handlePincodeChange(value, false);
                                      // Also set the primary Pincode field value so it auto-fills too
                                      setBranchPincode(value);
                                      // Ensure any error is cleared
                                      setBranchPincodeError("");
                                    } else if (value.length === 0) {
                                      setSelectedBranchState("");
                                      setSelectedBranchCity("");
                                      setSelectedBranchDistrict("");
                                      setBranchCities([]);
                                      setBranchPincodes([]);
                                      setBranchPincode("");
                                      setBranchPincodeError("");
                                    }
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="state"
                                className="text-xs w-40 text-right"
                              >
                                State:
                              </Label>
                              <div ref={(el) => setFieldRef("state", el)}>
                                <Select
                                  name="state"
                                  value={selectedBranchState}
                                  onValueChange={(value) => {
                                    handleBranchStateChange(value);
                                    setTimeout(
                                      () => focusNextField("district"), // Move focus to district after state selection
                                      100
                                    );
                                  }}
                                >
                                  <SelectTrigger
                                    className="h-6 text-xs flex-1"
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "state", false, true)
                                    }
                                  >
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[200px] overflow-y-auto">
                                    <div className="sticky top-0 bg-white p-2 border-b z-10">
                                      <Input
                                        placeholder="Search states..."
                                        className="h-8 text-xs"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          const searchTerm =
                                            e.target.value.toLowerCase();
                                          setTimeout(() => {
                                            const selectItems =
                                              document.querySelectorAll(
                                                '[role="option"]'
                                              );
                                            selectItems.forEach((item) => {
                                              const text =
                                                item.textContent?.toLowerCase() ||
                                                "";
                                              const shouldShow =
                                                text.includes(searchTerm);
                                              (
                                                item as HTMLElement
                                              ).style.display = shouldShow
                                                ? "flex"
                                                : "none";
                                            });
                                          }, 10);
                                        }}
                                      />
                                    </div>
                                    {branchStates.map((state) => (
                                      <SelectItem
                                        key={state.isoCode}
                                        value={state.isoCode}
                                      >
                                        {state.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {/* District field */}
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="district"
                                className="text-xs w-40 text-right"
                              >
                                District:
                              </Label>
                              <Input
                                id="district"
                                name="district"
                                className="h-6 text-xs flex-1"
                                value={
                                  selectedBranchDistrict ||
                                  activeItem?.district ||
                                  ""
                                }
                                onChange={(e) =>
                                  setSelectedBranchDistrict(e.target.value)
                                }
                                ref={(el) => setFieldRef("district", el)}
                                onKeyDown={(e) => handleKeyDown(e, "district")}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="city"
                                className="text-xs w-40 text-right"
                              >
                                City:
                              </Label>
                              <div ref={(el) => setFieldRef("city", el)}>
                                <Select
                                  name="city"
                                  value={selectedBranchCity}
                                  onValueChange={(value) => {
                                    handleBranchCityChange(value);
                                    setTimeout(
                                      () => focusNextField("city"),
                                      100
                                    );
                                  }}
                                  disabled={!selectedBranchState}
                                >
                                  <SelectTrigger
                                    className="h-6 text-xs flex-1"
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, "city", false, true)
                                    }
                                  >
                                    <SelectValue placeholder="Select City" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[200px] overflow-y-auto">
                                    <div className="sticky top-0 bg-white p-2 border-b z-10">
                                      <Input
                                        placeholder="Search cities..."
                                        className="h-8 text-xs"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          const searchTerm =
                                            e.target.value.toLowerCase();
                                          setTimeout(() => {
                                            const selectItems =
                                              document.querySelectorAll(
                                                '[role="option"]'
                                              );
                                            selectItems.forEach((item) => {
                                              const text =
                                                item.textContent?.toLowerCase() ||
                                                "";
                                              const shouldShow =
                                                text.includes(searchTerm);
                                              (
                                                item as HTMLElement
                                              ).style.display = shouldShow
                                                ? "flex"
                                                : "none";
                                            });
                                          }, 10);
                                        }}
                                      />
                                    </div>
                                    {branchCities.map((city) => (
                                      <SelectItem
                                        key={city.name}
                                        value={city.name}
                                      >
                                        {city.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="branchPincode"
                                className="text-xs w-40 text-right"
                              >
                                Pincode:
                              </Label>
                              <div className="flex-1">
                                {branchPincodes.length > 0 ? (
                                  <div
                                    ref={(el) =>
                                      setFieldRef("branchPincode", el)
                                    }
                                  >
                                    <Select
                                      name="branchPincode"
                                      value={branchPincode || undefined}
                                      onValueChange={(value) => {
                                        setBranchPincode(value);
                                        setTimeout(
                                          () => focusNextField("branchPincode"),
                                          100
                                        );
                                      }}
                                    >
                                      <SelectTrigger
                                        className="h-6 text-xs flex-1"
                                        onKeyDown={(e) =>
                                          handleKeyDown(
                                            e,
                                            "branchPincode",
                                            false,
                                            true
                                          )
                                        }
                                      >
                                        <SelectValue placeholder="Select Pincode" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[200px] overflow-y-auto">
                                        <div className="sticky top-0 bg-white p-2 border-b z-10">
                                          <Input
                                            placeholder="Search pincodes..."
                                            className="h-8 text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              const searchTerm =
                                                e.target.value.toLowerCase();
                                              setTimeout(() => {
                                                const selectItems =
                                                  document.querySelectorAll(
                                                    '[role="option"]'
                                                  );
                                                selectItems.forEach((item) => {
                                                  const text =
                                                    item.textContent?.toLowerCase() ||
                                                    "";
                                                  const shouldShow =
                                                    text.includes(searchTerm);
                                                  (
                                                    item as HTMLElement
                                                  ).style.display = shouldShow
                                                    ? "flex"
                                                    : "none";
                                                });
                                              }, 10);
                                            }}
                                          />
                                        </div>
                                        {branchPincodes.map(
                                          (pincode, index) => (
                                            <SelectItem
                                              key={index}
                                              value={pincode.pincode}
                                            >
                                              {pincode.pincode} - {pincode.area}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    {/* Hidden input to submit selected pincode with the form */}
                                    <input
                                      type="hidden"
                                      name="branchPincode"
                                      value={branchPincode || ""}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <Input
                                      id="branchPincode"
                                      name="branchPincode"
                                      className={`h-6 text-xs w-full ${
                                        branchPincodeError
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                      maxLength={6}
                                      pattern="[0-9]{6}"
                                      placeholder="Enter 6-digit pincode"
                                      value={
                                        branchPincode ||
                                        activeItem?.branchPincode ||
                                        activeItem?.pincode ||
                                        ""
                                      }
                                      ref={(el) =>
                                        setFieldRef("branchPincode", el)
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, "branchPincode")
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setBranchPincode(value);
                                        handleManualPincodeInput(value, false);
                                      }}
                                    />
                                    {branchPincodeError && (
                                      <p className="text-xs text-red-500 mt-1">
                                        {branchPincodeError}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="Telephone"
                                className="text-xs w-40 text-right"
                              >
                                Telephone:
                              </Label>
                              <div className="flex flex-1 gap-1">
                                <div className="w-16">
                                  <Input
                                    value="+91"
                                    className="h-6 text-xs text-center bg-gray-50"
                                    readOnly
                                  />
                                </div>
                                <Input
                                  id="Telephone"
                                  name="Telephone"
                                  className="h-6 text-xs flex-1"
                                  placeholder="Enter phone number"
                                  defaultValue={
                                    activeItem?.telephone ||
                                    activeItem?.phone ||
                                    ""
                                  }
                                  ref={(el) => setFieldRef("Telephone", el)}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, "Telephone")
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="Mobile"
                                className="text-xs w-40 text-right"
                              >
                                Mobile:
                              </Label>
                              <div className="flex flex-1 gap-1">
                                <div className="w-16">
                                  <Input
                                    value="+91"
                                    className="h-6 text-xs text-center bg-gray-50"
                                    readOnly
                                  />
                                </div>
                                <Input
                                  id="Mobile"
                                  name="Mobile"
                                  className="h-6 text-xs flex-1"
                                  placeholder="Enter mobile number"
                                  defaultValue={activeItem?.mobile || ""}
                                  ref={(el) => setFieldRef("Mobile", el)}
                                  onKeyDown={(e) => handleKeyDown(e, "Mobile")}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="Fax"
                                className="text-xs w-40 text-right"
                              >
                                Fax:
                              </Label>
                              <Input
                                id="Fax"
                                name="Fax"
                                className="h-6 text-xs flex-1"
                                defaultValue={activeItem?.fax || ""}
                                ref={(el) => setFieldRef("Fax", el)}
                                onKeyDown={(e) => handleKeyDown(e, "Fax")}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="email"
                                className="text-xs w-40 text-right"
                              >
                                Email:
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                className="h-6 text-xs flex-1"
                                value={branchEmail}
                                onChange={(e) =>
                                  handleEmailChange(e.target.value, false)
                                }
                                ref={(el) => setFieldRef("email", el)}
                                onKeyDown={(e) => handleKeyDown(e, "email")}
                              />
                            </div>
                          </div>
                        </fieldset>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          {!isViewMode && (
                            <Button type="submit">
                              {isEditMode ? "Update Branch" : "Add Branch"}
                            </Button>
                          )}
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Parent Company</TableHead> */}
                    {/* <TableHead>Code</TableHead> */}
                    <TableHead>Branch Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      {/* <TableCell>{branch.parentCompany}</TableCell>
                      <TableCell className="font-medium">
                        {branch.code}
                      </TableCell> */}
                      <TableCell>{branch.branchname}</TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell>{branch.state}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(branch)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(branch)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openDeleteDialog(branch)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Using the same Add/Edit dialog for View by disabling fields; legacy view dialog removed */}
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-t border-gray-200 pt-4">
            <DialogTitle className="border-b border-gray-200 pb-4">
              Delete Confirmation
            </DialogTitle>
          </DialogHeader>
          {deletingItem && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {activeTab === "branch"
                    ? deletingItem.branchname
                    : deletingItem.companyName || deletingItem.mailingName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Financial Year Change Warning Dialog */}
      <Dialog
        open={isFinancialYearWarningOpen}
        onOpenChange={setIsFinancialYearWarningOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              ⚠️ Warning: Data Loss
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Changing the Financial Year will result in complete data loss!
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• All transactions will be permanently deleted</li>
                <li>• All master data entries will be removed</li>
                <li>• All ledger balances will be reset to zero</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            <p className="text-sm text-gray-700">
              Are you sure you want to change the Financial Year from{" "}
              <span className="font-semibold">{financialYearDate}</span> to{" "}
              <span className="font-semibold">
                {pendingFinancialYearChange}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFinancialYearWarningOpen(false);
                  setPendingFinancialYearChange("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmFinancialYearChange}
              >
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Books Beginning Change Warning Dialog */}
      <Dialog
        open={isBooksBeginningWarningOpen}
        onOpenChange={setIsBooksBeginningWarningOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              ⚠️ Warning: Data Loss
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Changing the Books Beginning date will result in complete data
                loss!
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• All transactions will be permanently deleted</li>
                <li>• All master data entries will be removed</li>
                <li>• All ledger balances will be reset to zero</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            <p className="text-sm text-gray-700">
              Are you sure you want to change the Books Beginning date from{" "}
              <span className="font-semibold">{bookBeginningDate}</span> to{" "}
              <span className="font-semibold">
                {pendingBooksBeginningChange}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsBooksBeginningWarningOpen(false);
                  setPendingBooksBeginningChange("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmBooksBeginningChange}
              >
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationStructure;
