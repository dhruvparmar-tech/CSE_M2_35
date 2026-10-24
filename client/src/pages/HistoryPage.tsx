import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { toast } from '../components/ui/Toast';
import { interviewApi } from '../services/api/interviewApi';
import { mockInterviews } from '../data/mockData';
import { formatDate, getDifficultyColor, getScoreColor, getStatusColor } from '../utils/formatters';
import { Calendar, Clock, ChevronRight, Filter } from 'lucide-react';
import type { Interview } from '../types';

export function HistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [roleFilter, setRoleFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const list = await interviewApi.getInterviews();
        if (list && list.length > 0) {
          setInterviews(list);
        }
      } catch (err: any) {
        toast('info', 'Showing local session history fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const uniqueRoles = ['all', ...Array.from(new Set(interviews.map((i) => i.config.role)))];

  const filtered = interviews.filter((i) => {
    const matchesRole = roleFilter === 'all' || i.config.role === roleFilter;
    const matchesDifficulty = difficultyFilter === 'all' || i.config.difficulty === difficultyFilter;
    return matchesRole && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-50">Interview Session History</h2>
          <p className="text-sm text-slate-400">Track scores, reviews, and progression over time.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/interview/new')}>
          Start New Interview
        </Button>
      </div>

      {/* Filters row bar */}
      <Card className="flex flex-col sm:flex-row gap-4 p-4 border-slate-900 bg-slate-900/30">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="h-4 w-4 text-indigo-400" /> Filter Sessions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <Select
            options={uniqueRoles.map((r) => ({ value: r, label: r === 'all' ? 'All Roles' : r }))}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
              { value: 'Expert', label: 'Expert' },
            ]}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* History table lists */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 border-slate-900">
          No matches found for current filter settings.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              onClick={() => item.status === 'completed' && navigate(`/interview/${item.id}/results`)}
              className={`hover:border-indigo-500/30 transition-all duration-300 ${
                item.status === 'completed' ? 'cursor-pointer' : 'opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-200">{item.config.role}</h3>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-500" /> {formatDate(item.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-500" /> {item.config.duration} minutes</span>
                    <span>•</span>
                    <span>{item.config.interviewType}</span>
                    <span>•</span>
                    <Badge variant="outline" className={getDifficultyColor(item.config.difficulty)}>
                      {item.config.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {item.score !== undefined && (
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Overall Score</span>
                      <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                        {item.score}/100
                      </span>
                    </div>
                  )}
                  {item.status === 'completed' && (
                    <ChevronRight className="h-5 w-5 text-slate-500 hover:text-slate-300 transition-colors" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default HistoryPage;
