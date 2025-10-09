import GoldPage from "./pages/GoldPage";
import PasswordPoliciesPage from "./pages/PasswordPoliciesPage";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import MembersPage from "./pages/MembersPage";
import LoansPage from "./pages/LoansPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import TransactionsPage from "./pages/TransactionsPage";
import UsersPage from "./pages/UsersPage";
import WorkingModePage from "./pages/WorkingModePage";
import ChartAccountsPage from "./pages/ChartAccountsPage";
import SalesManPage from "./pages/SalesManPage";
import LoanProductPage from "./pages/LoanProductPage";
import LoanSettingsPage from "./pages/LoanSettingsPage";
import PenaltyPage from "./pages/PenaltyPage";
import ObjectiveOfLoanPage from "./pages/ObjectiveOfLoanPage";
import LoanCancellationReasonsPage from "./pages/LoanCancellationReasonsPage";
import TransactionTypePage from "./pages/TransactionTypePage";
import MemberManagementsPage from "./pages/MemberManagementsPage";
import TransactionFinservPage from "./pages/TransactionFinservPage";
import NotFound from "./pages/NotFound";
// Transaction submenu pages
import ApplicationPage from "./pages/ApplicationPage";
import ApprovalPage from "./pages/ApprovalPage";
import DisbursementPage from "./pages/DisbursementPage";
import EmiReceiptPage from "./pages/EmiReceiptPage";
import ChargesReceiptPage from "./pages/ChargesReceiptPage";
import PreClosureReceiptPage from "./pages/PreClosureReceiptPage";
import WriteOffPage from "./pages/WriteOffPage";
import TopUpPage from "./pages/TopUpPage";
import InterestGenerationPage from "./pages/InterestGenerationPage";
import DealerReceivablePage from "./pages/DealerReceivablePage";
import DealerReceivableAutoPage from "./pages/DealerReceivableAutoPage";
import VehicleSeizurePage from "./pages/VehicleSeizurePage";
import RegistrationCertificatePage from "./pages/RegistrationCertificatePage";
import VehicleInsurancePage from "./pages/VehicleInsurancePage";
import SettingsPage from "./pages/SettingsPage";
import ExpensesPage from "./pages/ExpensesPage";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import GuarantorPage from "./pages/GuarantorPage";
import ReferencePage from "./pages/ReferencePage";
import "react-toastify/dist/ReactToastify.css";
import OrganizationStructure from "./components/OrganizationStructure";

import Reports from "./pages/Reports/Reports";
import Arrears from "./pages/Reports/Arrears/Arrears";
import GuaranterReport from "./pages/Reports/Guaranter Report/GuaranterReport";
import ApprovalSummary from "./pages/Reports/Approval Summary/ApprovalSummary";
import CancellationSummary from "./pages/Reports/Cancellation Summary/CancellationSummary";
import DisbursementSummary from "./pages/Reports/Disbursement Summary/DisbursementSummary";
import CollectedSummary from "./pages/Reports/Collected Summary/CollectedSummary";
import PreCloserSummary from "./pages/Reports/Pre-Closer Summary/PreCloserSummary";
import LoanSummaryReport from "./pages/Reports/Loan Summary Report/LoanSummaryReport";
import OutstandingReportBeta from "./pages/Reports/Outstanding Report/OutstandingReportBeta";
import CibilReport from "./pages/Reports/Cibil Report/CibilReport";
import SeizureList from "./pages/Reports/Seizure List/SeizureList";
import RCStatement from "./pages/Reports/RC Statement/RCStatement";
import Insurance from "./pages/Reports/Insurance/Insurance";
import WrittenOfReports from "./pages/Reports/WrittenOfReports/WrittenOfReports";
import MISReportMemberwise from "./pages/Reports/MIS Report Memberwise/MISReportMemberwise";
import MISReportBranchwise from "./pages/Reports/MIS Report Branchwise/MISReportBranchwise";
import KycComponent from "./components/kyc";
import FixedDepositPage from "./components/FixedDeposit";
import ACOpeningPage from "./components/ACOpening";
import PaymentPage from "./components/Payment";
import RecuringDepositPage from "./components/RecuringDeposit";
import RecuringACOpeningPage from "./components/RecuringACOpening";
import RecuringPaymentPage from "./components/RecuringPayment";
import RDDepositPage from "./components/RDDeposit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* <Header /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            {/* Transaction submenu routes */}
            <Route path="application" element={<ApplicationPage />} />
            <Route path="approval" element={<ApprovalPage />} />
            <Route path="disbursement" element={<DisbursementPage />} />
            <Route path="emi-receipt" element={<EmiReceiptPage />} />
            <Route path="charges-receipt" element={<ChargesReceiptPage />} />
            <Route
              path="pre-closure-receipt"
              element={<PreClosureReceiptPage />}
            />
            <Route path="write-off" element={<WriteOffPage />} />
            <Route path="top-up" element={<TopUpPage />} />
            <Route
              path="interest-generation"
              element={<InterestGenerationPage />}
            />
            <Route
              path="dealer-receivable"
              element={<DealerReceivablePage />}
            />
            <Route
              path="dealer-receivable-auto"
              element={<DealerReceivableAutoPage />}
            />
            <Route path="vehicle-seizure" element={<VehicleSeizurePage />} />
            <Route
              path="registration-certificate"
              element={<RegistrationCertificatePage />}
            />
            <Route
              path="vehicle-insurance"
              element={<VehicleInsurancePage />}
            />
            {/* End of transaction submenu routes */}
            <Route
              path="organization-structure"
              element={<OrganizationStructure />}
            />
            {/* Backward-compatible alias so /organization works */}
            <Route path="organization" element={<OrganizationStructure />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="working-mode" element={<WorkingModePage />} />
            <Route path="chart-accounts" element={<ChartAccountsPage />} />
            <Route path="salesman" element={<SalesManPage />} />
            {/* Loan settings landing and subpages */}
            <Route path="manage-loan-product" element={<LoanSettingsPage />} />
            <Route path="loan-product" element={<LoanProductPage />} />
            <Route path="penalty" element={<PenaltyPage />} />
            <Route path="gold" element={<GoldPage />} />
            <Route
              path="kyc"
              element={
                <KycComponent
                  kycs={[]}
                  onAddKYC={() => {}}
                  onUpdateKYC={() => {}}
                />
              }
            />
            <Route path="objective-of-loan" element={<ObjectiveOfLoanPage />} />
            <Route
              path="loan-cancellation-reasons"
              element={<LoanCancellationReasonsPage />}
            />
            <Route path="transaction-type" element={<TransactionTypePage />} />
            <Route
              path="member-managements/*"
              element={<MemberManagementsPage />}
            />
            <Route
              path="transaction-finserv"
              element={<TransactionFinservPage />}
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="generalsettings" element={<GeneralSettingsPage />} />
            <Route path="guarantor" element={<GuarantorPage />} />
            <Route path="reference" element={<ReferencePage />} />
            <Route
              path="password-policies"
              element={<PasswordPoliciesPage />}
            />

            {/* sachin */}
            <Route path="Reports" element={<Reports />} />
            <Route path="/written" element={<WrittenOfReports />} />
            <Route path="/Arrears" element={<Arrears />} />
            <Route path="/GuaranterReport" element={<GuaranterReport />} />
            <Route path="/ApprovalSummary" element={<ApprovalSummary />} />
            <Route
              path="/CancellationSummary"
              element={<CancellationSummary />}
            />
            <Route
              path="/DisbursementSummary"
              element={<DisbursementSummary />}
            />
            <Route path="/CollectedSummary" element={<CollectedSummary />} />
            <Route path="/PreCloserSummary" element={<PreCloserSummary />} />
            <Route path="/LoanSummaryReport" element={<LoanSummaryReport />} />
            <Route
              path="/OutstandingReportBeta"
              element={<OutstandingReportBeta />}
            />
            <Route path="/CibilReport" element={<CibilReport />} />
            <Route path="/SeizureList" element={<SeizureList />} />
            <Route path="/RCStatement" element={<RCStatement />} />
            <Route path="/Insurance" element={<Insurance />} />
            <Route path="fix-deposit" element={<FixedDepositPage />} />
            <Route path="ac-opening" element={<ACOpeningPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="recurring-deposit" element={<RecuringDepositPage />} />
            <Route
              path="recuring-AC-opening"
              element={<RecuringACOpeningPage />}
            />
            <Route path="recuring-payment" element={<RecuringPaymentPage />} />
            <Route path="rd-deposit" element={<RDDepositPage />} />

            <Route
              path="/MISReportMemberwise"
              element={<MISReportMemberwise />}
            />
            <Route
              path="/MISReportBranchwise"
              element={<MISReportBranchwise />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
