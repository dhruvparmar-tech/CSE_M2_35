import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Play, Send, RotateCcw } from 'lucide-react';
import { codingLanguages } from '../../data/interviewOptions';

interface CodingEditorProps {
  initialCode?: string;
  defaultLanguage?: string;
  onRun?: (code: string, language: string) => Promise<any>;
  onSubmit?: (code: string, language: string) => Promise<any>;
  isLoading?: boolean;
}

export function CodingEditor({
  initialCode = '',
  defaultLanguage = 'javascript',
  onRun,
  onSubmit,
  isLoading = false,
}: CodingEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState<string | null>(null);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  const handleRun = async () => {
    if (!onRun) return;
    setRunLoading(true);
    try {
      const res = await onRun(code, language);
      setOutput(res.output || 'Code executed successfully with no output.');
    } catch (e: any) {
      setOutput(`Error: ${e.message || 'Unknown execution error'}`);
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setSubmitLoading(true);
    try {
      const res = await onSubmit(code, language);
      setOutput(`Submission completed.\nEvaluation Score: ${res.score}/100\nFeedback: ${res.feedback}`);
    } catch (e: any) {
      setOutput(`Error submitting code: ${e.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="w-40">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={codingLanguages}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} title="Reset code">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRun} isLoading={runLoading}>
            <Play className="h-4 w-4 mr-1.5" /> Run
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={submitLoading || isLoading}>
            <Send className="h-4 w-4 mr-1.5" /> Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[350px]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            automaticLayout: true,
          }}
        />
      </div>

      <div className="h-40 border-t border-slate-800 bg-slate-950 p-4 font-mono text-sm overflow-auto text-slate-300">
        <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Output / Execution Terminal</div>
        <pre className="whitespace-pre-wrap">{output || 'No output. Click "Run" to execute your solution.'}</pre>
      </div>
    </div>
  );
}
export default CodingEditor;
