import { AIService, QuestionContext, FollowUpContext, EvaluationContext, CodingEvaluationContext, ResultContext, PracticeContext, PracticeQuestionResponse } from './AIService.js';
import { InterviewQuestion, AnswerEvaluation, FollowUpResponse, CodingEvaluation, InterviewResultResponse } from '../types/index.js';

export class MockAIService implements AIService {
  private async delay(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateInterviewQuestion(context: QuestionContext): Promise<InterviewQuestion> {
    await this.delay();
    return {
      question: `Explain event loop in Node.js for a ${context.role} role.`,
      type: 'technical',
      topic: context.topic,
      difficulty: context.difficulty,
      expectedSkills: ['nodejs', 'event-loop'],
      codeTemplate: '',
      testCases: []
    };
  }

  async generateFollowUpQuestion(context: FollowUpContext): Promise<FollowUpResponse> {
    await this.delay();
    return {
      shouldAskFollowUp: true,
      followUpQuestion: 'Can you give an example of macro vs micro tasks?',
      reason: 'Dig deeper into task queues.'
    };
  }

  async evaluateAnswer(context: EvaluationContext): Promise<AnswerEvaluation> {
    await this.delay();
    return {
      score: 85,
      technicalAccuracy: 90,
      depth: 80,
      problemSolving: 85,
      communication: 90,
      feedback: 'Good overview of the concept.',
      strengths: ['Clear explanation'],
      weaknesses: ['Missed microtasks'],
      shouldAskFollowUp: false
    };
  }

  async evaluateCodingAnswer(context: CodingEvaluationContext): Promise<CodingEvaluation> {
    await this.delay();
    return {
      score: 95,
      correctness: 100,
      algorithm: 90,
      codeQuality: 95,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      feedback: 'Excellent solution.',
      strengths: ['Optimal complexity'],
      improvements: ['Add more comments']
    };
  }

  async generateInterviewResult(context: ResultContext): Promise<InterviewResultResponse> {
    await this.delay();
    return {
      overallScore: 88,
      technicalKnowledge: 90,
      problemSolving: 85,
      coding: 90,
      communication: 85,
      accuracy: 90,
      strengths: ['Strong fundamentals'],
      weaknesses: ['System design depth'],
      recommendations: ['Practice scalable architecture'],
      summary: 'Strong candidate with good potential.'
    };
  }

  async generatePracticeQuestions(context: PracticeContext): Promise<PracticeQuestionResponse[]> {
    await this.delay();
    return Array(context.count).fill({
      question: `Mock practice question for ${context.category}`,
      hints: ['Mock hint 1'],
      solution: 'Mock solution'
    });
  }
}
