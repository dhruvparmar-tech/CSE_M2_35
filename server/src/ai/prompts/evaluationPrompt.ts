export const evaluationPrompt = (context: any) => {
  let prompt = `
You are a senior technical interviewer evaluating a candidate's answer.

Question asked: ${context.question}
Candidate's answer: ${context.answer}
Expected skills: ${Array.isArray(context.expectedSkills) ? context.expectedSkills.join(', ') : 'general technical skills'}
`;

  if (context.context && context.context.length > 0) {
    prompt += `\nPrevious conversation context for this question:\n`;
    for (const msg of context.context) {
      const roleName = msg.role === 'ai' ? 'Interviewer' : 'Candidate';
      prompt += `${roleName}: ${msg.content}\n`;
    }
    prompt += `Candidate's latest response above is an answer/follow-up in this context. Please evaluate it considering this conversation flow.\n`;
  }

  prompt += `
You MUST respond with ONLY a valid JSON object (no markdown, no explanation) with EXACTLY these fields:
{
  "score": <integer 0-100>,
  "technicalAccuracy": <integer 0-100>,
  "depth": <integer 0-100>,
  "problemSolving": <integer 0-100>,
  "communication": <integer 0-100>,
  "feedback": "<constructive feedback paragraph>",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "shouldAskFollowUp": <true or false>
}
`;
  return prompt;
};
