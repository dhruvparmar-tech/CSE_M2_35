export function compactContext(history: any[]): any[] {
  // Keep last 3 pairs intact, summarize the rest
  if (history.length <= 6) return history;
  const recent = history.slice(-6);
  const older = history.slice(0, -6);
  return [
    { role: 'system', content: `Previous context summary: ${older.length / 2} questions asked previously.` },
    ...recent
  ];
}

export function buildInterviewContext(interview: any, questions: any[], answers: any[]): any[] {
  const context = [];
  context.push({ role: 'system', content: `Interview Config: Role ${interview.role}, Experience: ${interview.experienceLevel}` });
  
  for (let i = 0; i < questions.length; i++) {
    context.push({ role: 'assistant', content: questions[i].question });
    if (answers[i]) {
      context.push({ role: 'user', content: answers[i].answer });
    }
  }
  return compactContext(context);
}
