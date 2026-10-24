import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { ToastContainer } from '../components/ui/Toast';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <ToastContainer />
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <BrainCircuit className="h-8 w-8 text-indigo-400" />
            <span className="font-bold text-2xl bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
              AI Interviewer
            </span>
          </Link>
          <p className="text-sm text-slate-400">
            Realistic technical screening & coding evaluations with real-time feedback.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default AuthLayout;
