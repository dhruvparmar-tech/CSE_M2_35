import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewChat } from '../components/interview/InterviewChat';
import { QuestionPanel } from '../components/interview/QuestionPanel';
import { CodingEditor } from '../components/interview/CodingEditor';
import { InterviewTimer } from '../components/interview/InterviewTimer';
import { VoiceRecorder } from '../components/voice/VoiceRecorder';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { toast } from '../components/ui/Toast';
import { useTimer } from '../hooks/useTimer';
import { useScreenLock } from '../hooks/useScreenLock';
import { ScreenLockOverlay } from '../components/interview/ScreenLockOverlay';
import { interviewApi } from '../services/api/interviewApi';
import { codeApi } from '../services/api/codeApi';
import type { Interview, InterviewMessage, InterviewQuestion } from '../types';
import { ArrowRight, LogOut, MessageSquare, Code, Volume2, Lock, ShieldCheck } from 'lucide-react';

export function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<'text' | 'coding' | 'voice'>('text');
  const [loading, setLoading] = useState(true);
  const [hasStartedLock, setHasStartedLock] = useState(false);

  const {
    isLocked,
    isFullscreen,
    tabSwitchCount,
    showWarningOverlay,
    dismissWarning,
    activateLock,
    deactivateLock,
    enterFullscreen,
  } = useScreenLock({
    enabled: hasStartedLock,
    maxTabSwitchWarnings: 3,
    onMaxViolations: () => {
      toast('error', 'Maximum tab switch violations reached! Finalizing interview session.');
      handleCompleteInterview();
    },
  });

  // Setup timer with 45 minutes default
  const { timeRemaining, isWarning, isCritical, startTimer } = useTimer({
    initialSeconds: 45 * 60,
    onExpiry: () => {
      deactivateLock();
      toast('error', 'Interview time expired! Screen unlocked.');
      handleCompleteInterview();
    },
  });

  useEffect(() => {
    if (!id) return;
    const fetchInterview = async () => {
      try {
        const item = await interviewApi.getInterview(id);
        setInterview(item);
        if (item.status === 'completed') {
          navigate(`/interview/${id}/results`);
          return;
        }

        // Start interview and generate first question
        setIsAIThinking(true);
        const started = await interviewApi.startInterview(id);
        setInterview(started);

        // Retrieve first question details
        const questionDetail = started.questions?.[0] || started.currentQuestionDetail;
        if (questionDetail) {
          setCurrentQuestion(questionDetail as any);
          const aiMsg: InterviewMessage = {
            id: Math.random().toString(),
            role: 'ai',
            content: `Let's start the interview. Here is your first question:\n\n${questionDetail.question}`,
            timestamp: new Date().toISOString(),
          };
          setMessages([aiMsg]);
          if (questionDetail.type === 'coding') {
            setWorkspaceMode('coding');
          }
        }
      } catch (err: any) {
        toast('error', err.message || 'Failed to initialize interview.');
      } finally {
        setLoading(false);
        setIsAIThinking(false);
      }
    };
    fetchInterview();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!id || !currentQuestion) return;
    if (!answerInput.trim() && workspaceMode !== 'coding') {
      toast('warning', 'Please provide an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userMsg: InterviewMessage = {
        id: Math.random().toString(),
        role: 'candidate',
        content: workspaceMode === 'coding' ? '// Submitted solution' : answerInput,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Call API to evaluate answer
      setIsAIThinking(true);
      const res = await interviewApi.submitAnswer(id, {
        questionId: currentQuestion.id,
        content: answerInput,
        code: workspaceMode === 'coding' ? answerInput : undefined,
        language: workspaceMode === 'coding' ? 'javascript' : undefined,
      });

      // Clear input
      setAnswerInput('');

      // Add feedback and check follow-up or next question
      if (res.followUpQuestion) {
        const followUpMsg: InterviewMessage = {
          id: Math.random().toString(),
          role: 'ai',
          content: `${res.feedback}\n\nFollow-up: ${res.followUpQuestion}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, followUpMsg]);
      } else {
        // Fetch next question details
        const nextInterviewState = await interviewApi.getInterview(id);
        setInterview(nextInterviewState);

        if (nextInterviewState.status === 'completed') {
          toast('success', 'You have completed all questions!');
          handleCompleteInterview();
          return;
        }

        const nextQ = nextInterviewState.questions?.[nextInterviewState.currentQuestion ?? 0] || nextInterviewState.currentQuestionDetail;
        if (nextQ) {
          setCurrentQuestion(nextQ as any);
          const nextQMsg: InterviewMessage = {
            id: Math.random().toString(),
            role: 'ai',
            content: `${res.feedback}\n\nNext question:\n\n${nextQ.question}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, nextQMsg]);
          if (nextQ.type === 'coding') {
            setWorkspaceMode('coding');
          } else {
            setWorkspaceMode('text');
          }
        } else {
          handleCompleteInterview();
        }
      }
    } catch (e: any) {
      toast('error', e.message || 'Error processing response.');
    } finally {
      setIsSubmitting(false);
      setIsAIThinking(false);
    }
  };

  const handleRunCode = async (code: string, language: string) => {
    return codeApi.runCode(code, language);
  };

  const handleSubmitCode = async (code: string, language: string) => {
    if (!id || !currentQuestion) return;
    setIsSubmitting(true);
    try {
      const userMsg: InterviewMessage = {
        id: Math.random().toString(),
        role: 'candidate',
        content: '// Submitted coding solution',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Call API to evaluate answer
      setIsAIThinking(true);
      const res = await interviewApi.submitAnswer(id, {
        questionId: currentQuestion.id,
        content: code,
        code,
        language,
      });

      // Clear input
      setAnswerInput('');

      // Add feedback and check follow-up or next question
      if (res.followUpQuestion) {
        const followUpMsg: InterviewMessage = {
          id: Math.random().toString(),
          role: 'ai',
          content: `${res.feedback}\n\nFollow-up: ${res.followUpQuestion}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, followUpMsg]);
      } else {
        // Fetch next question details
        const nextInterviewState = await interviewApi.getInterview(id);
        setInterview(nextInterviewState);

        if (nextInterviewState.status === 'completed') {
          toast('success', 'You have completed all questions!');
          handleCompleteInterview();
          return res;
        }

        const nextQ = nextInterviewState.questions?.[nextInterviewState.currentQuestion ?? 0] || nextInterviewState.currentQuestionDetail;
        if (nextQ) {
          setCurrentQuestion(nextQ as any);
          const nextQMsg: InterviewMessage = {
            id: Math.random().toString(),
            role: 'ai',
            content: `${res.feedback}\n\nNext question:\n\n${nextQ.question}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, nextQMsg]);
          if (nextQ.type === 'coding') {
            setWorkspaceMode('coding');
          } else {
            setWorkspaceMode('text');
          }
        } else {
          handleCompleteInterview();
        }
      }
      return res;
    } catch (e: any) {
      toast('error', e.message || 'Error processing response.');
      throw e;
    } finally {
      setIsSubmitting(false);
      setIsAIThinking(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!id) return;
    setIsSubmitting(true);
    // Deactivate screen lock and restore normal display
    deactivateLock();
    try {
      await interviewApi.completeInterview(id);
      toast('success', 'Interview completed! Screen unlocked.');
      navigate(`/interview/${id}/results`);
    } catch (e: any) {
      toast('error', e.message || 'Error completing interview.');
      navigate(`/dashboard`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    deactivateLock();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-slate-400">
        Loading interview session details...
      </div>
    );
  }

  // Pre-interview proctored lock entry screen
  if (!hasStartedLock) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-4">
        <Card className="max-w-xl w-full border-indigo-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Proctored Interview Session
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Role: <span className="text-indigo-400 font-semibold">{interview?.config.role || 'Software Engineer'}</span> &bull; {interview?.config.difficulty || 'medium'} difficulty
            </p>
          </div>

          <div className="text-left bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 text-xs text-slate-300">
            <div className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Screen Locking & Proctoring Guidelines:
            </div>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Your screen will be locked in <strong className="text-slate-200">Fullscreen Mode</strong> for the duration of the interview.</li>
              <li>Switching tabs, minimizing windows, or navigating away will be <strong className="text-amber-300">logged as violations</strong>.</li>
              <li>Clipboard actions and developer shortcut keys are restricted.</li>
              <li>When the <strong className="text-emerald-400">session time expires</strong> or you click <strong className="text-emerald-400">Complete Interview</strong>, the screen lock will automatically deactivate and return to normal.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="outline" onClick={handleExit} className="w-full sm:w-auto">
              Cancel & Exit
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              onClick={() => {
                setHasStartedLock(true);
                activateLock();
              }}
            >
              <Lock className="w-4 h-4" />
              Lock Screen & Begin Interview
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
      {/* Screen Lock Proctoring Overlay */}
      <ScreenLockOverlay
        isLocked={isLocked}
        isFullscreen={isFullscreen}
        tabSwitchCount={tabSwitchCount}
        maxTabSwitchWarnings={3}
        showWarningOverlay={showWarningOverlay}
        onDismissWarning={dismissWarning}
        onRequestFullscreen={enterFullscreen}
      />

      {/* Top dashboard control header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">{interview?.config.role} Session</h2>
            {isLocked && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-3 h-3" /> Locked Mode
              </span>
            )}
          </div>
          <InterviewTimer timeRemaining={timeRemaining} isWarning={isWarning} isCritical={isCritical} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExit}>
            <LogOut className="h-4 w-4 mr-1.5" /> Exit
          </Button>
          <Button variant="success" size="sm" onClick={handleCompleteInterview} isLoading={isSubmitting}>
            Complete Interview
          </Button>
        </div>
      </div>

      {/* Main split grid panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        {/* Left Side: Chat interface with AI interviewer */}
        <Card className="flex flex-col h-full border-slate-900 bg-slate-900/30 overflow-hidden">
          <div className="border-b border-slate-800 p-3 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Interview Chat</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setWorkspaceMode('text')}
                className={`p-1.5 rounded-md ${workspaceMode === 'text' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Text Mode"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setWorkspaceMode('coding')}
                className={`p-1.5 rounded-md ${workspaceMode === 'coding' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Coding Workspace"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() => setWorkspaceMode('voice')}
                className={`p-1.5 rounded-md ${workspaceMode === 'voice' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Voice Mode"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <InterviewChat messages={messages} isAIThinking={isAIThinking} className="flex-1 overflow-y-auto" />
        </Card>

        {/* Right Side: Interactive Response workspace */}
        <div className="flex flex-col h-full overflow-hidden">
          {workspaceMode === 'coding' ? (
            <div className="flex-1 overflow-hidden">
              <CodingEditor
                initialCode={currentQuestion?.codeTemplate || ''}
                onRun={handleRunCode}
                onSubmit={handleSubmitCode}
                isLoading={isSubmitting}
              />
            </div>
          ) : (
            <Card className="flex-1 flex flex-col justify-between border-slate-900 bg-slate-900/40 p-4">
              <div className="space-y-4 flex-1 overflow-y-auto">
                <QuestionPanel
                  question={currentQuestion}
                  questionNumber={(interview?.currentQuestion || 0) + 1}
                  totalQuestions={interview?.config.questionCount || 10}
                />

                {workspaceMode === 'voice' ? (
                  <VoiceRecorder
                    onTranscription={(text) => setAnswerInput(text)}
                    isProcessing={isSubmitting}
                  />
                ) : (
                  <Textarea
                    placeholder="Provide your solution details here..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 border-slate-800"
                  />
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="primary" onClick={handleSubmitAnswer} isLoading={isSubmitting || isAIThinking}>
                  Submit Answer <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default InterviewPage;
