import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, Trophy, BarChart2, Star } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: 'Interviews Completed',
      value: stats.interviewsCompleted,
      icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
      desc: 'Practice makes perfect',
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore}/100`,
      icon: <BarChart2 className="h-6 w-6 text-indigo-400" />,
      desc: 'Consistent execution',
    },
    {
      label: 'Best Score',
      value: `${stats.bestScore}/100`,
      icon: <Trophy className="h-6 w-6 text-amber-400" />,
      desc: 'Top performance',
    },
    {
      label: 'Technical Score',
      value: `${stats.technicalScore}/100`,
      icon: <Star className="h-6 w-6 text-violet-400" />,
      desc: 'Domain knowledge',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => (
        <Card key={idx} className="hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.label}</span>
              <p className="text-2xl font-bold text-slate-50">{item.value}</p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-2.5">{item.icon}</div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{item.desc}</p>
        </Card>
      ))}
    </div>
  );
}
