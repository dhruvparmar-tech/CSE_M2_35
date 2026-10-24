import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useUiStore } from '../store/uiStore';
import { toast } from '../components/ui/Toast';
import { Sliders, Bell, Eye, Database } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useUiStore();

  const handleSavePreferences = () => {
    toast('success', 'Preferences updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-50">Settings Panel</h2>
        <p className="text-sm text-slate-400">Configure layout themes, evaluation notifications, and account credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Eye className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Theme Configurations</h3>
          </div>
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="text-sm font-medium text-slate-200">Dark Mode</span>
              <p className="text-xs text-slate-500">Enable modern dark color tones</p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Bell className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Notifications</h3>
          </div>
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="text-sm font-medium text-slate-200">Email Evaluations</span>
              <p className="text-xs text-slate-500">Send PDF results post complete session</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSavePreferences}>
              Configure
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Default Interview settings</h3>
          </div>
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-400">
              Configure preferred baseline values that populate new configuration setup sessions.
            </p>
            <Button variant="primary" className="w-full" onClick={handleSavePreferences}>
              Save Default Parameters
            </Button>
          </div>
        </Card>

        <Card className="space-y-4 border-rose-900/20 bg-rose-950/5">
          <div className="flex items-center gap-2 border-b border-rose-950 pb-2 text-rose-400">
            <Database className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Storage & Accounts</h3>
          </div>
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="text-sm font-medium text-slate-200">Reset Session Records</span>
              <p className="text-xs text-slate-500">Permanently clear interview evaluations</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => toast('warning', 'Session clearing requires administrative confirmation.')}>
              Delete Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default SettingsPage;
