export const followupPrompt = (context: any) => `
You are a technical interviewer deciding whether to ask a follow-up question.

Original question: ${context.originalQuestion}
Candidate's answer: ${context.candidateAnswer}

You MUST respond with ONLY a valid JSON object (no markdown, no explanation) with EXACTLY these fields:
{
  "shouldAskFollowUp": <true or false>,
  "followUpQuestion": "<the follow-up question if shouldAskFollowUp is true, otherwise empty string>",
  "reason": "<one sentence explaining your decision>"
}
`;
