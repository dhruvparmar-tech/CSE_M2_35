export function AITypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-800/80 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-slate-500">AI is thinking...</span>
    </div>
  );
}
