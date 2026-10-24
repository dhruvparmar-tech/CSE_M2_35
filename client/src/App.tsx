import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';

// Inner component — lives inside <BrowserRouter> so router hooks are safe
function AppInner() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return <AppRouter />;
}

function App() {
  const { theme } = useUiStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
