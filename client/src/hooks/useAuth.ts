import { useAuthStore } from '@/store/authStore';

/**
 * Convenience hook for accessing auth state.
 * Must be used inside a component rendered within <BrowserRouter>.
 *
 * Route guarding is done declaratively via <ProtectedRoute> / <PublicRoute>
 * in AppRouter.tsx — no imperative navigate() here.
 */
export const useAuth = () => {
  const { isAuthenticated, isLoading, user, checkAuth, login, signup, logout } = useAuthStore();
  return { isAuthenticated, isLoading, user, checkAuth, login, signup, logout };
};
