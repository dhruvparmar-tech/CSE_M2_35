import { useEffect, useState, useCallback, useRef } from 'react';

interface ScreenLockState {
  isLocked: boolean;
  tabSwitchCount: number;
  warnings: string[];
  isFullscreen: boolean;
}

interface UseScreenLockOptions {
  enabled: boolean;
  maxTabSwitchWarnings?: number;
  onMaxViolations?: () => void;
}

export function useScreenLock({
  enabled,
  maxTabSwitchWarnings = 3,
  onMaxViolations,
}: UseScreenLockOptions) {
  const [state, setState] = useState<ScreenLockState>({
    isLocked: false,
    tabSwitchCount: 0,
    warnings: [],
    isFullscreen: false,
  });

  const [showWarningOverlay, setShowWarningOverlay] = useState(false);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabSwitchCountRef = useRef(0);

  // ── Enter fullscreen ──────────────────────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        await (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        await (el as any).msRequestFullscreen();
      }
      setState((s) => ({ ...s, isFullscreen: true }));
    } catch {
      // User may deny fullscreen; we still lock other features
    }
  }, []);

  // ── Exit fullscreen ───────────────────────────────────────────────
  const exitFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setState((s) => ({ ...s, isFullscreen: false }));
    } catch {
      // ignore
    }
  }, []);

  // ── Activate lock ─────────────────────────────────────────────────
  const activateLock = useCallback(() => {
    setState((s) => ({ ...s, isLocked: true, tabSwitchCount: 0, warnings: [] }));
    tabSwitchCountRef.current = 0;
    enterFullscreen();
  }, [enterFullscreen]);

  // ── Deactivate lock ───────────────────────────────────────────────
  const deactivateLock = useCallback(() => {
    setState((s) => ({ ...s, isLocked: false }));
    setShowWarningOverlay(false);
    exitFullscreen();

    // Restore defaults
    document.oncontextmenu = null;
    document.oncopy = null;
    document.oncut = null;
  }, [exitFullscreen]);

  // ── Tab‑switch / visibility change handler ────────────────────────
  useEffect(() => {
    if (!enabled || !state.isLocked) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current += 1;
        const count = tabSwitchCountRef.current;

        const warningMsg =
          count >= maxTabSwitchWarnings
            ? `⚠️ Final warning! Tab switch #${count}. Your interview may be auto-submitted.`
            : `⚠️ Warning ${count}/${maxTabSwitchWarnings}: You switched away from the interview tab. This activity is being recorded.`;

        setState((s) => ({
          ...s,
          tabSwitchCount: count,
          warnings: [...s.warnings, warningMsg],
        }));

        setShowWarningOverlay(true);

        // Auto-dismiss overlay after 4 seconds
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = setTimeout(() => setShowWarningOverlay(false), 4000);

        if (count >= maxTabSwitchWarnings) {
          onMaxViolations?.();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, state.isLocked, maxTabSwitchWarnings, onMaxViolations]);

  // ── Block right-click, copy, cut, common shortcuts ────────────────
  useEffect(() => {
    if (!enabled || !state.isLocked) return;

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const blockCopyCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const blockKeyboard = (e: KeyboardEvent) => {
      // Block Ctrl/Cmd + C/V/X/P/S/U/Shift+I/F12
      const blocked =
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'p', 's', 'u', 'i'].includes(e.key.toLowerCase());
      const f12 = e.key === 'F12';
      const devTools = (e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase());

      if (blocked || f12 || devTools) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu, true);
    document.addEventListener('copy', blockCopyCut, true);
    document.addEventListener('cut', blockCopyCut, true);
    document.addEventListener('keydown', blockKeyboard, true);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu, true);
      document.removeEventListener('copy', blockCopyCut, true);
      document.removeEventListener('cut', blockCopyCut, true);
      document.removeEventListener('keydown', blockKeyboard, true);
    };
  }, [enabled, state.isLocked]);

  // ── Block browser back / forward navigation ───────────────────────
  useEffect(() => {
    if (!enabled || !state.isLocked) return;

    const handlePopState = (e: PopStateEvent) => {
      // Push state back to prevent navigation
      window.history.pushState(null, '', window.location.href);
    };

    // Push an initial state entry so pressing Back stays on the page
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled, state.isLocked]);

  // ── Warn before page close / refresh ──────────────────────────────
  useEffect(() => {
    if (!enabled || !state.isLocked) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your interview is in progress. Leaving will end your session. Are you sure?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, state.isLocked]);

  // ── Re-enter fullscreen if user exits it ──────────────────────────
  useEffect(() => {
    if (!enabled || !state.isLocked) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && state.isLocked) {
        setState((s) => ({ ...s, isFullscreen: false }));
        // Re-request fullscreen after a short delay
        setTimeout(() => {
          if (state.isLocked) enterFullscreen();
        }, 500);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [enabled, state.isLocked, enterFullscreen]);

  // ── Cleanup on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      deactivateLock();
    };
  }, []);

  return {
    isLocked: state.isLocked,
    isFullscreen: state.isFullscreen,
    tabSwitchCount: state.tabSwitchCount,
    warnings: state.warnings,
    showWarningOverlay,
    dismissWarning: () => setShowWarningOverlay(false),
    activateLock,
    deactivateLock,
    enterFullscreen,
  };
}
