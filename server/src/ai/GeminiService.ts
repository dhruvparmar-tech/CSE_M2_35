import { getGenAI } from './openai.js';
import {
  AIService, QuestionContext, FollowUpContext, EvaluationContext,
  CodingEvaluationContext, ResultContext, PracticeContext, PracticeQuestionResponse
} from './AIService.js';
import {
  InterviewQuestionSchema, InterviewQuestion,
  AnswerEvaluationSchema, AnswerEvaluation,
  FollowUpResponseSchema, FollowUpResponse,
  CodingEvaluationSchema, CodingEvaluation,
  InterviewResultSchema, InterviewResultResponse
} from '../types/index.js';
import { interviewerPrompt } from './prompts/interviewerPrompt.js';
import { questionPrompt } from './prompts/questionPrompt.js';
import { evaluationPrompt } from './prompts/evaluationPrompt.js';
import { followupPrompt } from './prompts/followupPrompt.js';
import { codingEvaluationPrompt } from './prompts/codingEvaluationPrompt.js';

const GEMINI_MODEL = 'gemini-3.5-flash';

export class GeminiService implements AIService {
  /**
   * Send a prompt to Gemini and parse the JSON response with the given Zod schema.
   * getGenAI() is called here (not at import time) so env is guaranteed to be loaded.
   */
  private async callGemini<T>(
    userPrompt: string,
    schema: { parse: (v: unknown) => T },
    systemInstruction = interviewerPrompt
  ): Promise<T> {
    const genAI = getGenAI(); // lazy — reads GEMINI_API_KEY now, not at import time

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction,
    });

    // Ask Gemini to return only JSON
    const fullPrompt = `${userPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation.`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text().trim();

    // Strip potential markdown code fences if Gemini adds them anyway
    const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

    let json: unknown;
    try {
      json = JSON.parse(jsonText);
    } catch {
      throw new Error(`Gemini returned non-JSON response: ${text.slice(0, 200)}`);
    }

    return schema.parse(json);
  }

  async generateInterviewQuestion(context: QuestionContext): Promise<InterviewQuestion> {
    return this.callGemini(questionPrompt(context), InterviewQuestionSchema);
  }

  async generateFollowUpQuestion(context: FollowUpContext): Promise<FollowUpResponse> {
    return this.callGemini(followupPrompt(context), FollowUpResponseSchema);
  }

  async evaluateAnswer(context: EvaluationContext): Promise<AnswerEvaluation> {
    return this.callGemini(evaluationPrompt(context), AnswerEvaluationSchema);
  }

  async evaluateCodingAnswer(context: CodingEvaluationContext): Promise<CodingEvaluation> {
    return this.callGemini(codingEvaluationPrompt(context), CodingEvaluationSchema);
  }

  async generateInterviewResult(context: ResultContext): Promise<InterviewResultResponse> {
    const prompt = `Generate a comprehensive interview result summary based on this interview history:\n${JSON.stringify(context.history, null, 2)}\n\nReturn a JSON object with: overallScore, technicalKnowledge, problemSolving, coding, communication, accuracy (all 0–100), strengths (string[]), weaknesses (string[]), recommendations (string[]), summary (string).`;
    return this.callGemini(prompt, InterviewResultSchema);
  }

  async generatePracticeQuestions(context: PracticeContext): Promise<PracticeQuestionResponse[]> {
    const prompt = `Generate exactly ${context.count} practice questions for the topic "${context.category}" at "${context.difficulty}" difficulty level.\n\nReturn a JSON object with key "questions" containing an array. Each element must have: question (string), hints (string[]), solution (string).`;
    const response = await this.callGemini(
      prompt,
      { parse: (val: any) => val.questions as PracticeQuestionResponse[] }
    );
    return response;
  }
}
