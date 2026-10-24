export const questionPrompt = (context: any) => `
You are a senior technical interviewer. Generate a single interview question for the following candidate profile:

Role: ${context.role}
Experience Level: ${context.experienceLevel}
Difficulty: ${context.difficulty}
Topic to cover: ${context.topic}
Technologies: ${context.technologies.join(', ')}

You MUST respond with ONLY a valid JSON object (no markdown, no explanation) with EXACTLY these fields:
{
  "question": "<the full interview question text>",
  "type": "<must be exactly one of: technical, coding, system-design>",
  "topic": "<the topic being tested>",
  "difficulty": "<easy, medium, or hard>",
  "expectedSkills": ["skill1", "skill2", "skill3"],
  "codeTemplate": "<optional starter code for coding questions, or empty string>"
}
`;
