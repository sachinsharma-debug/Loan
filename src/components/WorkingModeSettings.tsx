
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Cloud, HardDrive, RefreshCw, Settings, Save, Edit, Check, X } from 'lucide-react';
import { WorkingModeSettings } from '@/types';

interface WorkingModeSettingsProps {
  settings: WorkingModeSettings;
  onUpdateSettings: (settings: Partial<WorkingModeSettings>) => void;
}

const WorkingModeSettingsComponent = ({ settings, onUpdateSettings }: WorkingModeSettingsProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSettingChange = (key: keyof WorkingModeSettings, value: any) => {
    setLocalSettings({ ...localSettings, [key]: value });
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setLocalSettings(settings);
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    onUpdateSettings({ lastSync: new Date().toISOString() });
    setIsSyncing(false);
  };

  const getModeIcon = (mode: string) => {
    return mode === 'online' ? 
      <Wifi className="w-5 h-5 text-green-600" /> : 
      <WifiOff className="w-5 h-5 text-gray-600" />;
  };

  const getConnectionStatus = () => {
    return localSettings.mode === 'online' ? (
      <Badge className="bg-green-100 text-green-800">
        <Wifi className="w-3 h-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">
        <WifiOff className="w-3 h-3 mr-1" />
        Offline
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Working Mode Settings</h1>
          <p className="text-gray-600 mt-2">Configure online/offline mode and synchronization</p>
        </div>
        <div className="flex items-center space-x-2">
          {getConnectionStatus()}
          <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {showSaveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Working Mode Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Mode Configuration</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveSettings}
                      disabled={!hasChanges}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Working Mode</Label>
                  <p className="text-sm text-gray-600">
                    Choose between online and offline working mode
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Offline</span>
                  <Switch
                    checked={localSettings.mode === 'online'}
                    onCheckedChange={(checked) => 
                      handleSettingChange('mode', checked ? 'online' : 'offline')
                    }
                    disabled={!isEditing}
                  />
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                <Input
                  id="syncInterval"
                  type="number"
                  value={localSettings.syncInterval}
                  onChange={(e) => handleSettingChange('syncInterval', Number(e.target.value))}
                  min="1"
                  max="60"
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500">
                  How often to sync data when in online mode
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auto Backup</Label>
                  <p className="text-sm text-gray-600">
                    Automatically backup data locally
                  </p>
                </div>
                <Switch
                  checked={localSettings.autoBackup}
                  onCheckedChange={(checked) => 
                    handleSettingChange('autoBackup', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            {hasChanges && isEditing && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  You have unsaved changes. Click "Save" to apply them or "Cancel" to discard.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Mode</span>
                <div className="flex items-center space-x-2">
                  {getModeIcon(settings.mode)}
                  <span className="capitalize">{settings.mode}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Sync</span>
                <span className="text-sm text-gray-600">
                  {new Date(settings.lastSync).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sync Interval</span>
                <span className="text-sm text-gray-600">
                  {settings.syncInterval} min
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Backup</span>
                <Badge variant={settings.autoBackup ? 'default' : 'secondary'}>
                  {settings.autoBackup ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mode Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span>Online Mode Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Real-time data synchronization</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Collaborative work environment</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Automatic backups</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Latest features and updates</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-gray-600" />
              <span>Offline Mode Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Work without internet connection</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Faster data access</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Reduced bandwidth usage</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Data privacy and security</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingModeSettingsComponent;
