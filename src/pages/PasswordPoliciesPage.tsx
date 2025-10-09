import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PasswordPoliciesPage = () => {
  const [activatePolicy, setActivatePolicy] = useState(true);
  const [minLength, setMinLength] = useState(8);
  const [advancedStrength, setAdvancedStrength] = useState(false);
  const [expiryDays, setExpiryDays] = useState(90);
  const [notifyBeforeExpiry, setNotifyBeforeExpiry] = useState(false);
  const [restrictOldPasswords, setRestrictOldPasswords] = useState(false);
  const [changeOnFirstLogin, setChangeOnFirstLogin] = useState(false);
  const [allowUserChange, setAllowUserChange] = useState(false);
  const [minAlpha, setMinAlpha] = useState(0);
  const [minNumeric, setMinNumeric] = useState(0);
  const [minSpecial, setMinSpecial] = useState(0);
  const [notifyBeforeDays, setNotifyBeforeDays] = useState(1);
  const [numOldPasswords, setNumOldPasswords] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save logic here
    alert("Password policy saved (demo)");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Password Policy for Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2">
              <Label className="text-xs w-64 text-right">
                Activate password policy:
              </Label>
              <span className="text-xs">No</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activatePolicy}
                  onChange={(e) => setActivatePolicy(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                    activatePolicy ? "bg-blue-600" : "bg-gray-200"
                  } relative`}
                >
                  <div
                    className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                      activatePolicy ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
              <span className="text-xs">Yes</span>
            </div>
            <div className="border-t pt-4">
              <div className="font-bold mb-3 text-sm">Password Strength</div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-64 text-right">
                  Minimum password length:
                </Label>
                <input
                  type="number"
                  min={1}
                  className="border rounded px-2 py-1 w-20 text-xs"
                  value={minLength}
                  onChange={(e) => setMinLength(Number(e.target.value))}
                />
              </div>
            </div>{" "}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs w-64 text-right">
                  Specify advanced parameters for password strength:
                </Label>
                <span className="text-xs">No</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedStrength}
                    onChange={(e) => setAdvancedStrength(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                      advancedStrength ? "bg-blue-600" : "bg-gray-200"
                    } relative`}
                  >
                    <div
                      className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                        advancedStrength ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </label>
                <span className="text-xs">Yes</span>
              </div>
              {advancedStrength && (
                <div className="pl-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-72 text-right">
                      Minimum number of alphabetic characters:
                    </Label>
                    <input
                      type="number"
                      min={0}
                      className="border rounded px-2 py-1 w-20 text-xs"
                      value={minAlpha}
                      onChange={(e) => setMinAlpha(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-72 text-right">
                      Minimum number of numeric characters:
                    </Label>
                    <input
                      type="number"
                      min={0}
                      className="border rounded px-2 py-1 w-20 text-xs"
                      value={minNumeric}
                      onChange={(e) => setMinNumeric(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-72 text-right">
                      Minimum number of special characters:
                    </Label>
                    <input
                      type="number"
                      min={0}
                      className="border rounded px-2 py-1 w-20 text-xs"
                      value={minSpecial}
                      onChange={(e) => setMinSpecial(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="font-bold mb-3 text-sm">Password Expiry</div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-64 text-right">
                  Password expires after (days):
                </Label>
                <input
                  type="number"
                  min={0}
                  className="border rounded px-2 py-1 w-20 text-xs"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                />
                <span className="ml-2 text-xs text-gray-500">
                  (Set '0' to disable Password Expiry)
                </span>
              </div>{" "}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-64 text-right">
                    Notify users before password expires:
                  </Label>
                  <span className="text-xs">No</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyBeforeExpiry}
                      onChange={(e) => setNotifyBeforeExpiry(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                        notifyBeforeExpiry ? "bg-blue-600" : "bg-gray-200"
                      } relative`}
                    >
                      <div
                        className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                          notifyBeforeExpiry ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </label>
                  <span className="text-xs">Yes</span>
                </div>
                {notifyBeforeExpiry && (
                  <div className="flex items-center gap-2 pl-10">
                    <Label className="text-xs w-40 text-right">
                      Notify before:
                    </Label>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-20 text-xs"
                      value={notifyBeforeDays}
                      onChange={(e) =>
                        setNotifyBeforeDays(Number(e.target.value))
                      }
                    />
                    <span className="text-xs">Day(s)</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-64 text-right">
                    Restrict the use of old passwords:
                  </Label>
                  <span className="text-xs">No</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restrictOldPasswords}
                      onChange={(e) =>
                        setRestrictOldPasswords(e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                        restrictOldPasswords ? "bg-blue-600" : "bg-gray-200"
                      } relative`}
                    >
                      <div
                        className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                          restrictOldPasswords
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </label>
                  <span className="text-xs">Yes</span>
                </div>
                {restrictOldPasswords && (
                  <div className="flex items-center gap-2 pl-10">
                    <Label className="text-xs w-64 text-right">
                      Number of old passwords to be restricted:
                    </Label>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-20 text-xs"
                      value={numOldPasswords}
                      onChange={(e) =>
                        setNumOldPasswords(Number(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="font-bold mb-3 text-sm">Other Options</div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-64 text-right">
                  Change password on first login:
                </Label>
                <span className="text-xs">No</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changeOnFirstLogin}
                    onChange={(e) => setChangeOnFirstLogin(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                      changeOnFirstLogin ? "bg-blue-600" : "bg-gray-200"
                    } relative`}
                  >
                    <div
                      className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                        changeOnFirstLogin ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </label>
                <span className="text-xs">Yes</span>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs w-64 text-right">
                  Allow users to change password:
                </Label>
                <span className="text-xs">No</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowUserChange}
                    onChange={(e) => setAllowUserChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                      allowUserChange ? "bg-blue-600" : "bg-gray-200"
                    } relative`}
                  >
                    <div
                      className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                        allowUserChange ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </label>
                <span className="text-xs">Yes</span>
              </div>
            </div>{" "}
            <div className="flex justify-end mt-6">
              <Button type="submit">Save Policy</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordPoliciesPage;
