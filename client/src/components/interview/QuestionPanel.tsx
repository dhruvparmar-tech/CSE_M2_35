import React from 'react';
import { Badge } from '../ui/Badge';
import type { InterviewQuestion } from '../../types';

interface QuestionPanelProps {
  question: InterviewQuestion | null;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionPanel({ question, questionNumber, totalQuestions }: QuestionPanelProps) {
  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant={question.type === 'coding' ? 'error' : question.type === 'system-design' ? 'warning' : 'info'}>
            {question.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.difficulty}</Badge>
        </div>
      </div>
      <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
        <h3 className="text-base font-medium text-slate-100 whitespace-pre-wrap">{question.content}</h3>
      </div>
      {question.expectedSkills && question.expectedSkills.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Expected Concepts:</span>
          <div className="flex flex-wrap gap-1.5">
            {question.expectedSkills.map((skill, index) => (
              <Badge key={index} variant="outline" className="border-slate-800 bg-slate-900 text-slate-300">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
