import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScoreDisplay } from '../components/results/ScoreDisplay';
import { FeedbackPanel } from '../components/results/FeedbackPanel';
import { QuestionReview } from '../components/results/QuestionReview';
import { SkillBreakdown } from '../components/results/SkillBreakdown';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { toast } from '../components/ui/Toast';
import { interviewApi } from '../services/api/interviewApi';
import { mockInterviewResult } from '../data/mockData';
import { LayoutDashboard, RotateCcw, Award, CheckCircle, Lightbulb } from 'lucide-react';
import type { InterviewResult, Interview } from '../types';

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchResults = async () => {
      try {
        const details = await interviewApi.getResults(id);
        setResult(details);
        const ses = await interviewApi.getInterview(id);
        setInterview(ses);
      } catch (err: any) {
        toast('info', 'Loaded mock results evaluation.');
        setResult({
          ...mockInterviewResult,
          interviewId: id,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-slate-400">
        Analyzing response metrics & compiling results...
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Evaluation Overview', icon: <Award className="h-4 w-4" /> },
    { id: 'questions', label: 'Question Review', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'feedback', label: 'Development Recommendations', icon: <Lightbulb className="h-4 w-4" /> },
  ];

  // Map result evaluations to list format for the UI review component
  const questionReviews = interview?.questions?.map((q: any) => {
    const qAnswer = (interview?.answers?.find((a: any) => a.questionId === q.id) || {}) as any;
    return {
      question: q.question,
      answer: qAnswer.answer || qAnswer.code || '',
      score: qAnswer.score || 0,
      feedback: qAnswer.feedback || 'Detailed evaluation completed.',
      expectedSkills: q.expectedSkills || [],
      strengths: qAnswer.strengths || [],
      weaknesses: qAnswer.weaknesses || [],
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top dashboard control header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-50">Evaluation Results</h2>
          <p className="text-sm text-slate-400">{interview?.config.role} session overview details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard className="h-4 w-4 mr-1.5" /> Dashboard
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/interview/new')}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> New Session
          </Button>
        </div>
      </div>

      {result && (
        <Tabs tabs={tabs} defaultTab="overview">
          {(activeTab) => (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1 flex items-center justify-center bg-slate-900/30 border-slate-900">
                    <ScoreDisplay score={result.overallScore} />
                  </Card>
                  <Card className="lg:col-span-2 space-y-4 bg-slate-900/30 border-slate-900">
                    <div className="border-b border-slate-800 pb-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Score Metrics</h3>
                    </div>
                    <SkillBreakdown data={result.skillScores} />
                  </Card>

                  <Card className="lg:col-span-3 space-y-3 bg-indigo-950/10 border-indigo-900/10">
                    <h4 className="font-semibold text-indigo-400 text-sm uppercase tracking-wider">Evaluation Executive Summary</h4>
                    <p className="text-sm leading-relaxed text-slate-300">{result.summary}</p>
                  </Card>
                </div>
              )}

              {activeTab === 'questions' && (
                <QuestionReview questions={questionReviews.length > 0 ? questionReviews : [
                  {
                    question: 'Explain the difference between Virtual DOM and Shadow DOM.',
                    answer: 'Virtual DOM is a React concept mapping DOM elements to save rendering calculations. Shadow DOM is a browser-native standard used for encapsulation in Web Components.',
                    score: 88,
                    feedback: 'Strong understanding of the conceptual architectural difference between the two terms.',
                    expectedSkills: ['DOM optimization', 'Web standard features'],
                    strengths: ['Accurate descriptions', 'Clear distinction of browser native features vs frameworks'],
                    weaknesses: ['Could specify lifecycle integration characteristics'],
                  }
                ]} />
              )}

              {activeTab === 'feedback' && (
                <FeedbackPanel
                  strengths={result.strengths}
                  weaknesses={result.weaknesses}
                  recommendations={result.recommendations}
                />
              )}
            </div>
          )}
        </Tabs>
      )}
    </div>
  );
}
export default ResultsPage;
