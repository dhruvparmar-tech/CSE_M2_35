import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getScoreColor } from '../../utils/formatters';

interface QuestionEvaluationData {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  expectedSkills: string[];
  strengths: string[];
  weaknesses: string[];
}

interface QuestionReviewProps {
  questions: QuestionEvaluationData[];
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No question evaluations available for this session.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => {
        const isExp = expanded[idx];
        return (
          <Card key={idx} className="border-slate-800 bg-slate-900/40 overflow-hidden">
            <div
              onClick={() => toggle(idx)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/20 transition-colors"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Question {idx + 1}
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(q.score)}`}>
                    Score: {q.score}/100
                  </span>
                </div>
                <h4 className="text-sm font-medium text-slate-200 line-clamp-1">{q.question}</h4>
              </div>
              <div>{isExp ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}</div>
            </div>

            {isExp && (
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 space-y-4">
                <div className="space-y-1.5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Question</h5>
                  <p className="text-sm text-slate-200 bg-slate-900/50 rounded-lg p-3 border border-slate-800">{q.question}</p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Answer</h5>
                  <p className="text-sm text-slate-200 bg-slate-900/50 rounded-lg p-3 border border-slate-800 whitespace-pre-wrap">{q.answer || '(No answer provided)'}</p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Evaluation Feedback</h5>
                  <p className="text-sm text-slate-300 leading-relaxed bg-indigo-950/10 rounded-lg p-3 border border-indigo-900/20">{q.feedback}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {q.strengths && q.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Answer Strengths</h5>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {q.strengths.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                      </ul>
                    </div>
                  )}
                  {q.weaknesses && q.weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Weaknesses / Gaps</h5>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {q.weaknesses.map((weak, wIdx) => <li key={wIdx}>{weak}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
export default QuestionReview;
