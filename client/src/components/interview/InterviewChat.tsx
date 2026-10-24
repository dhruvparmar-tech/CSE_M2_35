import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { Bot, User } from 'lucide-react';
import type { InterviewMessage } from '../../types';
import { AITypingIndicator } from './AITypingIndicator';

interface InterviewChatProps {
  messages: InterviewMessage[];
  isAIThinking: boolean;
  className?: string;
}

export function InterviewChat({ messages, isAIThinking, className }: InterviewChatProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIThinking]);

  return (
    <div className={cn('flex flex-col gap-4 overflow-y-auto p-4', className)}>
      {messages.map((msg) => (
        <div key={msg.id} className={cn('flex gap-3', msg.role === 'candidate' && 'flex-row-reverse')}>
          <div className={cn(
            'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
            msg.role === 'ai'
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
              : 'bg-slate-700'
          )}>
            {msg.role === 'ai' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-slate-300" />}
          </div>
          <div className={cn(
            'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
            msg.role === 'ai'
              ? 'bg-slate-800/80 text-slate-200 rounded-tl-sm'
              : 'bg-indigo-500/20 text-indigo-100 rounded-tr-sm'
          )}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
            <span className="mt-1 block text-[10px] text-slate-500">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      {isAIThinking && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <AITypingIndicator />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
