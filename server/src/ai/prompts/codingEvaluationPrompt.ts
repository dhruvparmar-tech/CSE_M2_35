export const codingEvaluationPrompt = (context: any) => `
You are a senior engineer evaluating a candidate's coding solution.

Problem: ${context.problem}
Language: ${context.language}
Submitted code:
${context.code}

You MUST respond with ONLY a valid JSON object (no markdown, no explanation) with EXACTLY these fields:
{
  "score": <integer 0-100>,
  "correctness": <integer 0-100>,
  "algorithm": <integer 0-100>,
  "codeQuality": <integer 0-100>,
  "timeComplexity": "<e.g. O(n), O(n log n)>",
  "spaceComplexity": "<e.g. O(1), O(n)>",
  "feedback": "<detailed feedback paragraph>",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}
`;
