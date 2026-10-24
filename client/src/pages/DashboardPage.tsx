import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCards } from '../components/dashboard/StatsCards';
import { SkillRadar } from '../components/dashboard/SkillRadar';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { RecentInterviews } from '../components/dashboard/RecentInterviews';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { interviewApi } from '../services/api/interviewApi';
import { mockDashboardStats, mockInterviews } from '../data/mockData';
import { toast } from '../components/ui/Toast';
import { Play, Sparkles, BookOpen, UserCheck } from 'lucide-react';
import type { DashboardStats, Interview } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const list = await interviewApi.getInterviews();
        if (list && list.length > 0) {
          setInterviews(list);
          const completed = list.filter((i) => i.status === 'completed');
          const avgScore = completed.length > 0
            ? Math.round(completed.reduce((acc, curr) => acc + (curr.score || 0), 0) / completed.length)
            : 0;
          const bestScore = completed.length > 0
            ? Math.max(...completed.map((i) => i.score || 0))
            : 0;

          setStats({
            interviewsCompleted: completed.length,
            averageScore: avgScore,
            bestScore: bestScore,
            technicalScore: Math.round(avgScore * 1.05 > 100 ? 100 : avgScore * 1.05),
            recentScores: completed.slice(-7).map((i) => ({
              date: i.createdAt,
              score: i.score || 0,
            })),
            skillRadar: mockDashboardStats.skillRadar,
          });
        }
      } catch (err: any) {
        toast('info', 'Loaded local profile statistics fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSelectInterview = (id: string) => {
    navigate(`/interview/${id}/results`);
  };

  return (
    <div className="space-y-6">
      {/* Header welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-950 p-6 rounded-2xl border border-slate-900">
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-bold text-slate-50 flex items-center gap-2">
            Welcome back, {user?.name || 'Developer'}! <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
          </h2>
          <p className="text-sm text-slate-400">Ready for your next technical interview evaluation?</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/interview/new')}>
          <Play className="h-4 w-4 mr-1.5 fill-white" /> Start AI Interview
        </Button>
      </div>

      {/* Stats grid */}
      <StatsCards stats={stats} />

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Performance Over Time</h3>
          </div>
          <PerformanceChart data={stats.recentScores} />
        </Card>

        <Card className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Category Evaluation Breakdown</h3>
          </div>
          <SkillRadar data={stats.skillRadar} />
        </Card>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Recent Preparations</h3>
          </div>
          <RecentInterviews interviews={interviews} onSelect={handleSelectInterview} />
        </Card>

        <Card className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Targeted Practice Recommendation</h3>
          </div>
          <div className="space-y-3.5 pt-1.5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400"><BookOpen className="h-4 w-4" /></div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400">Focus Areas</h4>
                <p className="text-sm text-slate-300">Async JavaScript Promises & Event Loop</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400"><UserCheck className="h-4 w-4" /></div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400">Practice Goal</h4>
                <p className="text-sm text-slate-300">Complete 2 medium difficulty React state challenges</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/practice')}>
              Go to Sandbox
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default DashboardPage;
