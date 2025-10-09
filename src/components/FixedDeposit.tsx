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

const FixedDepositPage = () => {
  const navigate = useNavigate();

  const transactionItems = [
    {
      id: "ac-opening",
      title: "A/C Opening",
      description: "To open a account, you need essential identity",
      icon: FileText,
      color:
        "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150",
      iconColor: "text-blue-600",
      path: "/ac-opening",
      priority: "high",
      status: "active",
    },
    {
      id: "payment",
      title: "Payment",
      description:
        "A payment is the tender of something of value, such as money or its equivalent",
      icon: Receipt,
      color:
        "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150",
      iconColor: "text-green-600",
      path: "/payment",
      priority: "high",
      status: "active",
    },
    {
      id: "disbursement",
      title: "Generate Interest",
      description:
        "When you leave money in your savings account, your account earns interest",
      icon: TrendingUp,
      color:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150",
      iconColor: "text-yellow-600",
      path: "/disbursement",
      priority: "high",
      status: "active",
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
          Fixed Deposit
        </h1>
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
        "🎯 Fixed Deposit",
        "Core transaction services for daily operations"
      )}
    </div>
  );
};

export default FixedDepositPage;
