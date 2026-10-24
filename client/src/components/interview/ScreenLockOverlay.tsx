import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, CheckCircle, Maximize } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScreenLockOverlayProps {
  isLocked: boolean;
  isFullscreen: boolean;
  tabSwitchCount: number;
  maxTabSwitchWarnings?: number;
  showWarningOverlay: boolean;
  onDismissWarning: () => void;
  onRequestFullscreen: () => void;
}

export const ScreenLockOverlay: React.FC<ScreenLockOverlayProps> = ({
  isLocked,
  isFullscreen,
  tabSwitchCount,
  maxTabSwitchWarnings = 3,
  showWarningOverlay,
  onDismissWarning,
  onRequestFullscreen,
}) => {
  return (
    <>
      {/* Top Proctored Status Badge */}
      {isLocked && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Lock className="w-3.5 h-3.5" />
          <span className="font-medium">Secure Session Locked</span>
          {tabSwitchCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
              {tabSwitchCount}/{maxTabSwitchWarnings} warnings
            </span>
          )}
        </div>
      )}

      {/* Fullscreen restore prompt if user exits fullscreen while locked */}
      {isLocked && !isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <Maximize className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Fullscreen Required</h3>
            <p className="text-sm text-slate-300">
              This interview session requires fullscreen mode to maintain security and focus. Please re-enable fullscreen to continue.
            </p>
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500"
              onClick={onRequestFullscreen}
            >
              <Maximize className="w-4 h-4" /> Return to Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Tab Switch Warning Overlay */}
      {showWarningOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-400">Security Warning: Tab Switch Detected</h3>
              <p className="text-xs text-slate-400 mt-1">
                Warning {tabSwitchCount} of {maxTabSwitchWarnings}
              </p>
            </div>
            <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              You navigated away from the active interview window. All window blur and tab-switching events are recorded for proctoring.
            </p>
            {tabSwitchCount >= maxTabSwitchWarnings ? (
              <p className="text-xs font-semibold text-rose-400">
                Maximum violation limit reached. Your interview may be automatically submitted.
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Please remain on this screen until your interview is finished.
              </p>
            )}
            <Button
              variant="outline"
              className="w-full border-slate-700 hover:bg-slate-800 text-slate-200"
              onClick={onDismissWarning}
            >
              I Understand, Continue Interview
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
