import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUiStore } from '../store/uiStore';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import { ToastContainer } from '../components/ui/Toast';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Target,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  BrainCircuit,
} from 'lucide-react';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useUiStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'New Interview', href: '/interview/new', icon: <PlusCircle className="h-5 w-5" /> },
    { name: 'Interview History', href: '/interviews', icon: <History className="h-5 w-5" /> },
    { name: 'Practice Sandbox', href: '/practice', icon: <Target className="h-5 w-5" /> },
    { name: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-50 font-sans">
      <ToastContainer />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-slate-900 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-900">
          <BrainCircuit className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-lg bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            AI Interviewer
          </span>
        </div>
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:block">
            <span className="text-sm font-medium text-slate-400">
              Technical Interview Prep Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900/80 transition-colors">
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-slate-300">
                    {user?.name || 'User'}
                  </span>
                </button>
              }
            >
              <div className="px-3.5 py-2 border-b border-slate-800">
                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <DropdownItem onClick={() => navigate('/profile')} icon={<User className="h-4 w-4" />}>
                My Profile
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/settings')} icon={<Settings className="h-4 w-4" />}>
                Settings
              </DropdownItem>
              <DropdownItem onClick={handleLogout} icon={<LogOut className="h-4 w-4" />} danger>
                Sign Out
              </DropdownItem>
            </Dropdown>
          </div>
        </header>

        {/* Nested page outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-50 flex w-72 flex-col bg-slate-950 border-r border-slate-900 p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="h-6 w-6 text-indigo-400" />
                <span className="font-bold text-lg text-slate-50">AI Interviewer</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1.5">
              {navigation.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
export default MainLayout;
