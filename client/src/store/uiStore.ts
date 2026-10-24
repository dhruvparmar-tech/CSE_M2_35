import { create } from 'zustand';

interface UiState {
  theme: 'dark' | 'light' | 'system';
  sidebarOpen: boolean;
  notifications: any[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  notifications: [],
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
