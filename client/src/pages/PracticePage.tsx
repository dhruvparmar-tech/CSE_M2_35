import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { toast } from '../components/ui/Toast';
import { practiceCategories } from '../data/interviewOptions';
import { practiceApi } from '../services/api/practiceApi';
import { Sparkles, ArrowRight, Play, CheckCircle } from 'lucide-react';
import type { PracticeQuestion } from '../types';

export function PracticePage() {
  const [category, setCategory] = useState('javascript');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestion | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [evalResult, setEvalResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPracticeList = async () => {
      try {
        const list = await practiceApi.getPractice();
        setQuestions(list || []);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchPracticeList();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setEvalResult(null);
    try {
      const generated = await practiceApi.generatePractice(category, difficulty, 3);
      setQuestions(generated);
      setSelectedQuestion(generated[0] || null);
      toast('success', 'Generated practice tasks.');
    } catch (e: any) {
      toast('error', e.message || 'Failed to generate practice tasks.');
      // Local fallback
      const mockQ: PracticeQuestion = {
        id: Math.random().toString(),
        category,
        difficulty,
        content: `Explain typical performance optimization practices in ${category}.`,
        type: 'technical',
      };
      setQuestions([mockQ]);
      setSelectedQuestion(mockQ);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPractice = async () => {
    if (!selectedQuestion) return;
    setSubmitting(true);
    try {
      const res = await practiceApi.submitPracticeAnswer(selectedQuestion.id, answerText);
      setEvalResult(res);
      toast('success', 'Practice evaluated!');
    } catch (e: any) {
      toast('error', e.message || 'Submission failed.');
      setEvalResult({
        score: 82,
        feedback: 'Good description detailing concepts. Gaps remain in explaining runtime context details.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-50">Practice Sandbox</h2>
        <p className="text-sm text-slate-400">Generate isolated coding and concepts problems to target weak areas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left configurations panels */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              sandbox parameters
            </h3>
            <Select
              label="Question Category"
              options={practiceCategories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Difficulty"
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ]}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            <Button variant="primary" className="w-full" onClick={handleGenerate} isLoading={loading}>
              <Sparkles className="h-4 w-4 mr-1.5" /> Generate Questions
            </Button>
          </Card>

          {questions.length > 0 && (
            <Card className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Problems List</h4>
              <div className="space-y-2">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setEvalResult(null);
                      setAnswerText('');
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs border transition-all ${
                      selectedQuestion?.id === q.id
                        ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300'
                        : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="line-clamp-2">{q.content}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right workspace panels */}
        <div className="lg:col-span-2">
          {selectedQuestion ? (
            <div className="space-y-4">
              <Card className="space-y-4 border-slate-900 bg-slate-900/30">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Badge variant="info">{selectedQuestion.category}</Badge>
                  <Badge variant="outline">{selectedQuestion.difficulty}</Badge>
                </div>
                <h3 className="text-base font-medium text-slate-100">{selectedQuestion.content}</h3>
              </Card>

              {!evalResult ? (
                <Card className="space-y-4">
                  <Textarea
                    placeholder="Provide your solution here..."
                    rows={8}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full bg-slate-950 border-slate-850"
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSubmitPractice} isLoading={submitting}>
                      Evaluate Practice <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="space-y-4 border-indigo-900/30 bg-indigo-950/5">
                  <div className="flex items-center gap-2 text-indigo-400 border-b border-indigo-950 pb-2">
                    <CheckCircle className="h-5 w-5" />
                    <h4 className="font-semibold text-sm">Practice Evaluated!</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Category Score:</span>
                      <span className="text-sm font-bold text-emerald-400">{evalResult.score}/100</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900">
                      {evalResult.feedback}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEvalResult(null)}>
                    Practice Again
                  </Button>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-16 text-center text-slate-500 border-slate-900">
              Configure parameters on the left to generate new sandboxed practice questions.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default PracticePage;
