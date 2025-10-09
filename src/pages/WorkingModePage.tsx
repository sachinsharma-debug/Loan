import React, { useState } from "react";
import WorkingModeSettingsComponent from "@/components/WorkingModeSettings";
import { WorkingModeSettings } from "@/types";

// Demo working mode settings
const defaultSettings: WorkingModeSettings = {
  mode: "online",
  syncInterval: 300,
  autoBackup: true,
  lastSync: "2024-01-20T10:30:00Z",
};

const WorkingModePage = () => {
  const [workingModeSettings, setWorkingModeSettings] =
    useState<WorkingModeSettings>(defaultSettings);

  const handleUpdateWorkingModeSettings = (
    settingsData: Partial<WorkingModeSettings>
  ) => {
    setWorkingModeSettings({ ...workingModeSettings, ...settingsData });
  };

  return (
    <WorkingModeSettingsComponent
      settings={workingModeSettings}
      onUpdateSettings={handleUpdateWorkingModeSettings}
    />
  );
};

export default WorkingModePage;
