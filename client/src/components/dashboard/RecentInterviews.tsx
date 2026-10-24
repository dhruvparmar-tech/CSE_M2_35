import React from 'react';
import { Badge } from '../ui/Badge';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDate, getDifficultyColor, getScoreColor } from '../../utils/formatters';
import type { Interview } from '../../types';

interface RecentInterviewsProps {
  interviews: Interview[];
  onSelect: (id: string) => void;
}

export function RecentInterviews({ interviews, onSelect }: RecentInterviewsProps) {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No interview history found. Setup a new interview above to get started!
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80">
      {interviews.slice(0, 5).map((interview) => (
        <div
          key={interview.id}
          onClick={() => onSelect(interview.id)}
          className="flex items-center justify-between py-3.5 hover:bg-slate-800/20 px-3 -mx-3 rounded-lg transition-colors cursor-pointer group"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
              {interview.config.role}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(interview.createdAt)}
              </span>
              <span>•</span>
              <span>{interview.config.interviewType}</span>
              <span>•</span>
              <Badge variant="outline" className={getDifficultyColor(interview.config.difficulty)}>
                {interview.config.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {interview.score !== undefined && (
              <span className={`text-sm font-bold ${getScoreColor(interview.score)}`}>
                {interview.score}/100
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}
