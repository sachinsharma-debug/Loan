export interface User {
  id: string;
  _id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
  status: "active" | "inactive";
  workingMode: "online" | "offline";
  lastActive: string;
  createdAt: string;
  permissions: string[];
}

export interface Member {
  id: string;
  memberConfigId: string;
  // Basic Information
  enrollmentDate: string;
  memberId: string;
  memberName: string;
  name: string;
  branch: string;
  accountType: string;
  memberGroup: string;
  uploadPhotoSign: string;

  // Personal Information
  fathersName: string;
  mothersName: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female" | "other";
  maritalStatus: string;
  spouseName?: string;
  religion: string;

  // Contact Information
  phone: string;
  mobileNo: string;
  telephoneNo: string;
  email: string;

  // Address Information
  address: string;
  communicationAddress: string;
  landmark: string;
  postOffice: string;
  policeStation: string;
  pincode: string;
  cityDistrict: string;
  stateProvince: string;
  permanentAddress: string;
  area2: string;
  pincode2: string;
  cityDistrict2: string;
  stateProvince2: string;
  officeAddress: string;

  // Document Information
  panNo: string;
  aadharCardNo: string;
  gstin: string;
  passportNo: string;
  cibilScore: number;

  // Classification
  kyc: string;
  areaCode: string;
  areaName: string;
  occupation: string;
  education: string;
  casteCategory: string;
  caste: string;
  relationship: string;

  // Status
  dateJoined: string;
  status: "active" | "inactive" | "suspended";

  // Additional Fields
  typeOfAccommodation?: string;
  residenceStatus?: string;
  applicantStay?: string;
}

export interface Loan {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  duration: number;
  objective: string;
  penaltyMode: string;
  reasonForCancellation?: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "completed"
    | "defaulted";
  appliedDate: string;
  applicationDate?: string;
  approvedDate?: string;
  approvalDate?: string;
  dueDate?: string;
  remainingAmount: number;
  currentStep: number;
  statusOfDisbursement?: string;
  repaidStatus?: string;
  closedDate?: string;
  viewDetails?: string;
}

export interface LoanTransaction {
  id: string;
  loanId: string;
  step: number;
  type:
    | "application"
    | "approval"
    | "disbursement"
    | "emi_receipt"
    | "charges_receipt"
    | "pre_closure_receipt"
    | "write_off"
    | "topup"
    | "interest_generation"
    | "dealer_receivable"
    | "dealer_receivable_auto"
    | "vehicle_seizure"
    | "registration_certificates"
    | "vehicle_insurance";
  status: "pending" | "completed" | "failed";
  amount?: number;
  date: string;
  notes?: string;
  completedBy?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeLoans: number;
  totalLoanAmount: number;
  pendingApplications: number;
  collectionsDue: number;
  defaultedLoans: number;
}

export interface WorkingModeSettings {
  mode: "online" | "offline";
  syncInterval: number;
  autoBackup: boolean;
  lastSync: string;
}

// Organizational Structure Types

export interface Company {
  id: string;
  companyName: string;
  mailingName: string;
  address: string;
  district?: string;
  state: string;
  country: string;
  city?: string;
  pincode: string;
  telephone: string;
  mobile: string;
  fax?: string;
  email?: string;
  website?: string;
  parentCompanyId?: string;
  financialYear?: string;
  bookBeginning?: string;
  // Currency-related fields
  baseCurrencySymbol?: string;
  formalName?: string;
  additionalBaseCurrency?: string;
  showInMillions?: string;
  decimalPlaces?: string;
  afterDecimalWord?: string;
  decimalPlacesInWords?: string;
  suffixSymbolToAmount?: string;
  spaceBetweenAmountAndSymbol?: string;
}

export interface Branch {
  id: string;
  branchname: string;

  address: string;

  state: string;
  city: string;
  branchPincode: string;
  telephone: string;
  mobile: string;
  fax?: string;
  email?: string;
  isActive?: boolean;
}

export interface SalesMan {
  id: string;
  empCode: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  isActive: boolean;
}

// Dedicated Reference type (initially same shape as SalesMan for compatibility)
export interface Reference {
  id: string;
  empCode: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  isActive: boolean;
}

export interface TransactionType {
  id: string;
  typeCode: string;
  typeName: string;
  category: "loan" | "payment" | "charges" | "other";
  description: string;
  isActive: boolean;
}

export interface LoanProduct {
  id: string | number;
  Name: string;
  description: string;
  interestType?: "simple" | "compound" | string;
  interestMethod?: string;
  isActive: boolean;

  typeOfLoan?: "not-applicable" | "vehicle" | "other";
  subType?: string;

  annualRateOfInterestApplicable?: "yes" | "no";
  currentAnnualRateOfInterest?: string;
  applicableFrom?: string[];
  totalWeightage?: "yes" | "no";
  incomeSourceWeight?: number;
  cibilScoreWeight?: number;
  ageFrom?: number;
  ageTo?: number;
  validateTermsInApproval?: "yes" | "no";
  funding?: string;
  partialDisbursement?: "yes" | "no";
  accruedInterest?: "yes" | "no";
  foreclosePenalty?: string;
  interestHistory?: { date: string; rate: string }[];
  maxAmount?: number;
  minAmount?: number;
  maxDuration?: number;
  minDuration?: number;
  processingFee?: number;
  documentationFee?: number;
}

export interface KYC {
  id: string;
  document: string;
  noOfCopy: number;
  mandatory: "yes" | "no";
  requirementType: "Original" | "Photo Copy";
  documentCategory:
    | "Identity Proof"
    | "Address Proof"
    | "Income Proof"
    | "Business Documents"
    | "Other Documents";
}

export interface Area {
  id: string;
  areaName: string;
}

export interface Occupation {
  id: string;
  occupationName: string;
}

export interface Education {
  id: string;
  educationName: string;
}

export interface CasteCategory {
  id: string;
  casteCategoryName: string;
}

export interface Caste {
  id: string;
  casteName: string;
}

export interface Relationship {
  id: string;
  relationshipName: string;
}

// types/guarantor.ts
export interface Guarantor {
  id: string;
  guarantorName: string;
  branch?: string;
  date?: string;
  parent?: string;
  fathersName?: string;
  mothersName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  spouseName?: string;
  religion?: string;
  sourceOfIncome?: string;
  occupation?: string;
  mobileNo?: string;
  telephoneNo?: string;
  email?: string;
  salesman?: string;
  reference?: string;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  postOffice?: string;
  pincode?: string;
  policeStation?: string;
  landmark?: string;
  permanentAddress?: string;
  permanentDistrict?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPostOffice?: string;
  permanentPincode?: string;
  permanentPoliceStation?: string;
  permanentLandmark?: string;
  cibilScore?: number;
  panNo?: string;
  passportNo?: string;
  aadharCardNo?: string;
  // Separate file references for document images
  panFileId?: string;
  passportFileId?: string;
  aadharFileId?: string;
  photoPath?: string;
  signaturePath?: string;
  thumbImpressionPath?: string;
  kycDocuments?: boolean;
  bankDetails?: boolean;
  monthlyIncome?: number;
}

export interface EmploymentInfo {
  employmentType: string;
  employerName?: string;
  employerAddress?: string;
  position?: string;
  employmentNumber?: string;
  yearsWithEmployer?: number;
  annualSalary?: number;
  monthlySalary?: number;
  description?: string;
  name?: string;
  address?: string;
  designation?: string;
  tradeLicenseNo?: string;
  years?: number;
  annualIncome?: number;
  monthlyIncome?: number;
}

export interface Penalty {
  id: string;
  penaltyType: "percentage" | "fixed";
  value: number;
  penaltyMode: "daywise" | "monthly" | "yearly";
  penaltyApplyOn: "principal" | "interest" | "total";
}

export interface ObjectiveOfLoan {
  id: string;
  description: string;
}

export interface LoanCancellationReason {
  id: string;
  description: string;
}

// Additional interfaces for loan application forms
export interface FamilyDetails {
  id: string;
  memberId: string;
  familyMemberName: string;
  relationship: string;
  age: number;
  occupation: string;
}

export interface WitnessDetails {
  id: string;
  witnessName: string;
  place: string;
  date: string;
}

export interface ResidenceDetails {
  typeOfAccommodation:
    | "owned"
    | "rented"
    | "ancestral"
    | "companyprovided"
    | "other";
  residenceStatus: "permanent" | "temporary" | "transit" | "other";
  applicantStay: string;
  monthlyRent?: number;
  ownerName?: string;
  ownerContact?: string;
}
