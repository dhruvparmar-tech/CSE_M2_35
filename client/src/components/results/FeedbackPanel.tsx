import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface FeedbackPanelProps {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function FeedbackPanel({ strengths, weaknesses, recommendations }: FeedbackPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/10 pb-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold text-emerald-400 text-sm uppercase tracking-wider">Strengths</h3>
        </div>
        <ul className="space-y-2.5">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-amber-500/10 bg-amber-500/5 hover:border-amber-500/20 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 border-b border-amber-500/10 pb-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold text-amber-400 text-sm uppercase tracking-wider">Weaknesses</h3>
        </div>
        <ul className="space-y-2.5">
          {weaknesses.map((weak, idx) => (
            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-indigo-500/10 bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 border-b border-indigo-500/10 pb-2">
          <Lightbulb className="h-5 w-5 text-indigo-400" />
          <h3 className="font-semibold text-indigo-400 text-sm uppercase tracking-wider">Recommendations</h3>
        </div>
        <ul className="space-y-2.5">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-indigo-400 mt-1 flex-shrink-0">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
export default FeedbackPanel;
