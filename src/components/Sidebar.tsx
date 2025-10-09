import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Settings,
  Building,
  LogOut,
  Database,
  UserCheck,
  PackageOpen,
  SquareChartGantt,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Check if we're on the settings page or any settings-related page
  const isSettingsPage =
    location.pathname === "/settings" ||
    location.pathname === "/organization" ||
    location.pathname === "/organization-structure" ||
    location.pathname === "/chart-accounts" ||
    location.pathname === "/generalsettings" ||
    location.pathname === "/users" ||
    location.pathname === "/password-policies" ||
    location.pathname === "/loan-product" ||
    location.pathname === "/manage-loan-product" ||
    location.pathname === "/penalty" ||
    location.pathname === "/kyc" ||
    location.pathname === "/gold" ||
    location.pathname === "/objective-of-loan" ||
    location.pathname === "/loan-cancellation-reasons" ||
    location.pathname === "/working-mode" ||
    location.pathname === "/transaction-type" ||
    location.pathname.startsWith("/member-managements"); // Settings menu items
  const settingsMenuItems = [
    {
      id: "organization",
      label: "Organization",
      icon: Building,
      roles: ["admin"],
      hasSubmenu: false,
      submenu: undefined,
    },
    {
      id: "generalsettings",
      label: "General Settings",
      icon: TrendingDown,
      roles: ["admin", "manager", "staff"],
      hasSubmenu: false,
      submenu: undefined,
    },

    {
      id: "chart-accounts",
      label: "Charts Of Accounts",
      icon: Database,
      roles: ["admin", "manager"],
      hasSubmenu: false,
      submenu: undefined,
    },
    {
      id: "manage-loan-product",
      label: "Loan Product",
      icon: PackageOpen,
      roles: ["admin", "manager"],
      hasSubmenu: false,
      submenu: undefined,
    },
    {
      id: "member-managements",
      label: "Member Management",
      icon: SquareChartGantt,
      roles: ["admin", "manager"],
      hasSubmenu: false,
      submenu: undefined,
    },
  ];

  // Original menu items
  const originalMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "manager", "staff"],
    },

    {
      id: "",
      label: "Transaction Fintronics",
      icon: Receipt,
      roles: ["admin", "manager", "staff"],
      hasSubmenu: true,
      submenu: [
        {
          id: "transaction-finserv",
          label: "Loan Management",
          icon: LayoutDashboard,
          roles: ["admin", "manager", "staff"],
        },
        {
          id: "fix-deposit",
          label: "Fixed Deposit",
          icon: LayoutDashboard,
          roles: ["admin", "manager", "staff"],
        },
        {
          id: "recurring-deposit",
          label: "Recurring Deposit",
          icon: LayoutDashboard,
          roles: ["admin", "manager", "staff"],
        },
      ],
    },

    {
      id: "Reports",
      label: "Reports",
      icon: Building,
      roles: ["admin"],
    },
  ];

  // Choose which menu items to use based on current page
  const menuItems = isSettingsPage ? settingsMenuItems : originalMenuItems;

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "staff")
  );

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: any) => {
    if (item.hasSubmenu) {
      toggleSubmenu(item.id);
      // Also navigate to the main page for Transaction Finserv
      if (item.id === "transaction-finserv") {
        onTabChange(item.id);
      }
    } else {
      onTabChange(item.id);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2
          className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onTabChange("dashboard")}
        >
          NBFC-Fintronix-Prudent360
        </h2>
        <p className="text-sm text-gray-600 mt-1">Financial Services</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.id);
            const hasSubmenu = item.hasSubmenu;

            return (
              <div key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {hasSubmenu && (
                    <div className="ml-auto">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </Button>

                {hasSubmenu && isExpanded && item.submenu && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu
                      .filter((subItem: any) =>
                        subItem.roles.includes(user?.role || "staff")
                      )
                      .map((subItem: any) => {
                        const SubIcon = subItem.icon;
                        return (
                          <Button
                            key={subItem.id}
                            variant={
                              activeTab === subItem.id ? "default" : "ghost"
                            }
                            className="w-full justify-start text-sm py-2"
                            onClick={() => onTabChange(subItem.id)}
                          >
                            <SubIcon className="mr-2 h-3 w-3" />
                            {subItem.label}
                          </Button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.workingMode} mode
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   FileText,
//   Receipt,
//   Settings,
//   Building,
//   LogOut,
//   Database,
//   UserCheck,
//   PackageOpen,
//   SquareChartGantt,
//   ChevronDown,
//   ChevronRight,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
// } from "lucide-react";

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

//   // Check if we're on the settings page or any settings-related page
//   const isSettingsPage =
//     location.pathname === "/settings" ||
//     location.pathname === "/organization" ||
//     location.pathname === "/organization-structure" ||
//     location.pathname === "/chart-accounts" ||
//     location.pathname === "/generalsettings" ||
//     location.pathname === "/users" ||
//     location.pathname === "/loan-product" ||
//     location.pathname === "/manage-loan-product" ||
//     location.pathname === "/penalty" ||
//     location.pathname === "/objective-of-loan" ||
//     location.pathname === "/loan-cancellation-reasons" ||
//     location.pathname === "/working-mode" ||
//     location.pathname === "/transaction-type" ||
//     location.pathname.startsWith("/member-managements"); // Settings menu items
//   const settingsMenuItems = [
//     {
//       id: "organization",
//       label: "Organization",
//       icon: Building,
//       roles: ["admin"],
//       hasSubmenu: false,
//       submenu: undefined,
//     },
//     {
//       id: "generalsettings",
//       label: "General Settings",
//       icon: TrendingDown,
//       roles: ["admin", "manager", "staff"],
//       hasSubmenu: false,
//       submenu: undefined,
//     },

//     {
//       id: "chart-accounts",
//       label: "Charts Of Accounts",
//       icon: Database,
//       roles: ["admin", "manager"],
//       hasSubmenu: false,
//       submenu: undefined,
//     },
//     {
//       id: "manage-loan-product",
//       label: "Loan Product",
//       icon: PackageOpen,
//       roles: ["admin", "manager"],
//       hasSubmenu: false,
//       submenu: undefined,
//     },
//     {
//       id: "member-managements",
//       label: "Member Management",
//       icon: SquareChartGantt,
//       roles: ["admin", "manager"],
//       hasSubmenu: false,
//       submenu: undefined,
//     },

//     // {
//     //   id: "working-mode",
//     //   label: "Working Mode",
//     //   icon: Settings,
//     //   roles: ["admin", "manager", "staff"],
//     //   hasSubmenu: false,
//     //   submenu: undefined,
//     // },
//   ];

//   // Original menu items
//   const originalMenuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       roles: ["admin", "manager", "staff"],
//     },

//     {
//       id: "",
//       label: "Transaction Fintronics",
//       icon: Receipt,
//       roles: ["admin", "manager", "staff"],
//       hasSubmenu: true,
//       submenu: [
//         {
//           id: "transaction-finserv",
//           label: "Loan Management",
//           icon: LayoutDashboard,
//           roles: ["admin", "manager", "staff"],
//         },
//         {
//           id: "fix-deposit",
//           label: "Fixed Deposit",
//           icon: LayoutDashboard,
//           roles: ["admin", "manager", "staff"],
//         },
//         {
//           id: "recurring-deposit",
//           label: "Recurring Deposit",
//           icon: LayoutDashboard,
//           roles: ["admin", "manager", "staff"],
//         },
//       ],
//     },

//     {
//       id: "Reports",
//       label: "Reports",
//       icon: Building,
//       roles: ["admin"],
//     },
//   ];

//   // Choose which menu items to use based on current page
//   const menuItems = isSettingsPage ? settingsMenuItems : originalMenuItems;

//   const filteredMenuItems = menuItems.filter((item) =>
//     item.roles.includes(user?.role || "staff")
//   );

//   const toggleSubmenu = (menuId: string) => {
//     setExpandedMenus((prev) =>
//       prev.includes(menuId)
//         ? prev.filter((id) => id !== menuId)
//         : [...prev, menuId]
//     );
//   };

//   const handleMenuClick = (item: any) => {
//     if (item.hasSubmenu) {
//       toggleSubmenu(item.id);
//       // Also navigate to the main page for Transaction Finserv
//       if (item.id === "transaction-finserv") {
//         onTabChange(item.id);
//       }
//     } else {
//       onTabChange(item.id);
//     }
//   };

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
//       <div className="p-6 border-b border-gray-200">
//         <h2
//           className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
//           onClick={() => onTabChange("dashboard")}
//         >
//           NBFC-Fintronix-Prudent360
//         </h2>
//         <p className="text-sm text-gray-600 mt-1">Financial Services</p>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <nav className="p-2 space-y-2">
//           {filteredMenuItems.map((item) => {
//             const Icon = item.icon;
//             const isExpanded = expandedMenus.includes(item.id);
//             const hasSubmenu = item.hasSubmenu;

//             return (
//               <div key={item.id}>
//                 <Button
//                   variant={activeTab === item.id ? "default" : "ghost"}
//                   className="w-full justify-start"
//                   onClick={() => handleMenuClick(item)}
//                 >
//                   <Icon className="mr-2 h-4 w-4" />
//                   {item.label}
//                   {hasSubmenu && (
//                     <div className="ml-auto">
//                       {isExpanded ? (
//                         <ChevronDown className="h-4 w-4" />
//                       ) : (
//                         <ChevronRight className="h-4 w-4" />
//                       )}
//                     </div>
//                   )}
//                 </Button>

//                 {hasSubmenu && isExpanded && item.submenu && (
//                   <div className="ml-4 mt-2 space-y-1">
//                     {item.submenu
//                       .filter((subItem: any) =>
//                         subItem.roles.includes(user?.role || "staff")
//                       )
//                       .map((subItem: any) => {
//                         const SubIcon = subItem.icon;
//                         return (
//                           <Button
//                             key={subItem.id}
//                             variant={
//                               activeTab === subItem.id ? "default" : "ghost"
//                             }
//                             className="w-full justify-start text-sm py-2"
//                             onClick={() => onTabChange(subItem.id)}
//                           >
//                             <SubIcon className="mr-2 h-3 w-3" />
//                             {subItem.label}
//                           </Button>
//                         );
//                       })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </div>

//       <div className="p-4 border-t border-gray-200">
//         <div className="mb-4">
//           <p className="text-sm font-medium text-gray-900">{user?.name}</p>
//           <p className="text-xs text-gray-500">{user?.role}</p>
//           <p className="text-xs text-gray-500 capitalize">
//             {user?.workingMode} mode
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           className="w-full justify-start"
//           onClick={logout}
//         >
//           <LogOut className="mr-2 h-4 w-4" />
//           Logout
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
