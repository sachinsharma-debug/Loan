import { useNavigate } from "react-router-dom";

const GeneralSettingsPage = () => {
  const navigate = useNavigate(); // Ensure navigate is defined

  const usersAndRolesItems = [
    { label: "Roles", path: "/roles" },
    { label: "Users", path: "/users" },
    { label: "Login Security", path: "/login-security" },
    { label: "Password Policies", path: "/password-policies" },
  ];

  // Additional items can be added here if needed
  const generalItems = [
    { label: "SMS Configuration", path: "/sms-configuration" },
    { label: "SMS Integration", path: "/sms-integration" },
    { label: "Email Configuration", path: "/email-configuration" },
    { label: "Email Integration", path: "/email-integration" },
    { label: "Whatsapp Setting", path: "/whatsapp-setting" },
    {
      label: "Whatsapp Integration for trans",
      path: "/whatsapp-integration-trans",
    },
    { label: "Email And SMS Scheduler", path: "/email-sms-scheduler" },
    {
      label: "Email Schedule Event Status Report",
      path: "/email-schedule-event-status",
    },
    {
      label: "Transaction Type",
      path: "/transaction-type",
    },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
        General Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-3xl">
        {/* Users And Roles Section */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2">
            <h2 className="text-sm font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 opacity-80"></span>
              Users And Roles
            </h2>
          </div>
          <div className="p-2">
            {usersAndRolesItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm transition-all duration-150 border-b border-gray-50 last:border-b-0 hover:shadow-sm"
              >
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* General Section */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2">
            <h2 className="text-sm font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 opacity-80"></span>
              General
            </h2>
          </div>
          <div className="p-2">
            {generalItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm transition-all duration-150 border-b border-gray-50 last:border-b-0 hover:shadow-sm"
              >
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
