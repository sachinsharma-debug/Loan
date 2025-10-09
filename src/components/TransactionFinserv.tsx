import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UserCheck,
  DollarSign,
  Receipt,
  TrendingUp,
  Building,
  Settings,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const TransactionFinserv = () => {
  const navigate = useNavigate();

  const transactionItems = [
    {
      id: "application",
      title: "Application",
      description: "Manage loan applications and submission process",
      icon: FileText,
      color:
        "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150",
      iconColor: "text-blue-600",
      path: "/application",
      status: "active",
      priority: "high",
    },
    {
      id: "approval",
      title: "Approval",
      description: "Review and approve loan applications",
      icon: UserCheck,
      color:
        "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150",
      iconColor: "text-green-600",
      path: "/approval",
      status: "active",
      priority: "high",
    },
    {
      id: "disbursement",
      title: "Disbursement",
      description: "Process loan disbursements and fund transfers",
      icon: DollarSign,
      color:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150",
      iconColor: "text-yellow-600",
      path: "/disbursement",
      status: "active",
      priority: "high",
    },
    {
      id: "emi-receipt",
      title: "EMI Receipt",
      description: "Record and manage EMI payments",
      icon: Receipt,
      color:
        "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150",
      iconColor: "text-purple-600",
      path: "/emi-receipt",
      status: "active",
      priority: "high",
    },
    {
      id: "charges-receipt",
      title: "Charges Receipt",
      description: "Manage service charges and fees collection",
      icon: Receipt,
      color:
        "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-150",
      iconColor: "text-indigo-600",
      path: "/charges-receipt",
      status: "active",
      priority: "medium",
    },
    {
      id: "pre-closure-receipt",
      title: "Pre-Closure Receipt",
      description: "Handle pre-closure settlements and receipts",
      icon: Receipt,
      color:
        "bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-150",
      iconColor: "text-pink-600",
      path: "/pre-closure-receipt",
      status: "active",
      priority: "medium",
    },
    {
      id: "write-off",
      title: "Write Off",
      description: "Process loan write-offs and adjustments",
      icon: AlertCircle,
      color:
        "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-150",
      iconColor: "text-red-600",
      path: "/write-off",
      status: "restricted",
      priority: "low",
    },
    {
      id: "top-up",
      title: "Top-Up",
      description: "Manage loan top-up requests and processing",
      icon: TrendingUp,
      color:
        "bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-150",
      iconColor: "text-teal-600",
      path: "/top-up",
      status: "active",
      priority: "medium",
    },
    {
      id: "interest-generation",
      title: "Interest Generation",
      description: "Calculate and generate interest charges",
      icon: Activity,
      color:
        "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150",
      iconColor: "text-orange-600",
      path: "/interest-generation",
      status: "active",
      priority: "medium",
    },
    {
      id: "dealer-receivable",
      title: "Dealer Receivable",
      description: "Manage dealer receivables and settlements",
      icon: Building,
      color:
        "bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-150",
      iconColor: "text-cyan-600",
      path: "/dealer-receivable",
      status: "active",
      priority: "medium",
    },
    {
      id: "dealer-receivable-auto",
      title: "Dealer Receivable (Auto)",
      description: "Automated dealer receivable processing",
      icon: Building,
      color:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-150",
      iconColor: "text-emerald-600",
      path: "/dealer-receivable-auto",
      status: "active",
      priority: "low",
    },
    {
      id: "vehicle-seizure",
      title: "Vehicle Seizure",
      description: "Manage vehicle seizure processes",
      icon: Settings,
      color:
        "bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150",
      iconColor: "text-slate-600",
      path: "/vehicle-seizure",
      status: "restricted",
      priority: "low",
    },
    {
      id: "registration-certificate",
      title: "Registration Certificate",
      description: "Handle vehicle registration certificates",
      icon: FileText,
      color:
        "bg-gradient-to-br from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-150",
      iconColor: "text-violet-600",
      path: "/registration-certificate",
      status: "active",
      priority: "medium",
    },
    {
      id: "vehicle-insurance",
      title: "Vehicle Insurance",
      description: "Manage vehicle insurance documentation",
      icon: Settings,
      color:
        "bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-150",
      iconColor: "text-rose-600",
      path: "/vehicle-insurance",
      status: "active",
      priority: "medium",
    },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "restricted":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Group items by priority for better organization
  const highPriorityItems = transactionItems.filter(
    (item) => item.priority === "high"
  );
  const mediumPriorityItems = transactionItems.filter(
    (item) => item.priority === "medium"
  );
  const lowPriorityItems = transactionItems.filter(
    (item) => item.priority === "low"
  );

  const renderItemGrid = (items: any[], title: string, description: string) => (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.id}
              className={`${item.color} border-0 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group relative overflow-hidden`}
              onClick={() => handleItemClick(item.path)}
            >
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <div
                  className={`w-2 h-2 rounded-full ${getPriorityColor(
                    item.priority
                  )}`}
                ></div>
              </div>

              <CardHeader className="pb-3 relative">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon
                      className={`h-6 w-6 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-white group-hover:shadow-md transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Create</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Transaction Financial Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive transaction management and financial services portal for
          all your banking operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Modules</p>
                <p className="text-2xl font-bold">
                  {
                    transactionItems.filter((item) => item.status === "active")
                      .length
                  }
                </p>
              </div>
              <Activity className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">High Priority</p>
                <p className="text-2xl font-bold">{highPriorityItems.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Medium Priority</p>
                <p className="text-2xl font-bold">
                  {mediumPriorityItems.length}
                </p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Services</p>
                <p className="text-2xl font-bold">{transactionItems.length}</p>
              </div>
              <Building className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Services */}
      {renderItemGrid(
        highPriorityItems,
        "🎯 Essential Services",
        "Core transaction services for daily operations"
      )}

      {/* Medium Priority Services */}
      {renderItemGrid(
        mediumPriorityItems,
        "⚙️ Management Services",
        "Advanced transaction management and reporting tools"
      )}

      {/* Low Priority Services */}
      {renderItemGrid(
        lowPriorityItems,
        "🔧 Administrative Services",
        "Specialized services for administrative tasks"
      )}

      {/* Quick Actions Section */}
      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            🚀 Quick Actions
          </h3>
          <p className="text-white/80 mb-6 text-lg">
            Access frequently used transaction services instantly
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="secondary"
              onClick={() => handleItemClick("/application")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 text-base font-medium backdrop-blur-sm"
            >
              <FileText className="mr-2 h-5 w-5" />
              New Application
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleItemClick("/emi-receipt")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 text-base font-medium backdrop-blur-sm"
            >
              <Receipt className="mr-2 h-5 w-5" />
              EMI Payment
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleItemClick("/disbursement")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 text-base font-medium backdrop-blur-sm"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Process Disbursement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFinserv;
