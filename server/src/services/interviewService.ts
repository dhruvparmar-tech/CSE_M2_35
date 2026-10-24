import { db } from '../database/index.js';
import { aiService } from '../ai/index.js';

export const interviewService = {
  async createInterview(userId: string, config: any) {
    const data = {
      userId,
      role: config.role,
      experienceLevel: config.experienceLevel,
      difficulty: config.difficulty,
      interviewType: config.interviewType,
      technologies: config.technologies,
      topics: config.topics || config.technologies,
      duration: Number(config.duration || 45),
      questionCount: Number(config.questionCount || 10),
      status: 'pending',
    };
    return db.interview.create({ data });
  },

  async getInterviews(userId: string) {
    const list = await db.interview.findMany({ where: { userId } });
    return list.map((item: any) => this.injectConfigFallback(item));
  },

  async getInterview(id: string, userId: string) {
    const item = await db.interview.findUnique({ where: { id, userId } });
    if (!item) return null;

    // Fetch all existing questions
    const questions = await db.interviewQuestion.findMany({ where: { interviewId: id } });

    // If the interview is active and we don't have the question for the current index, generate it!
    if (item.status === 'active' && questions.length <= item.currentQuestion && item.currentQuestion < item.questionCount) {
      const topicIndex = item.currentQuestion % (item.topics.length || 1);
      const nextTopic = item.topics[topicIndex] || 'general';

      const question = await aiService.generateInterviewQuestion({
        role: item.role,
        experienceLevel: item.experienceLevel,
        difficulty: item.difficulty,
        technologies: item.technologies,
        topic: nextTopic
      });

      const createdQuestion = await db.interviewQuestion.create({
        data: {
          interviewId: id,
          questionNumber: item.currentQuestion,
          question: question.question,
          type: question.type,
          topic: question.topic,
          difficulty: question.difficulty,
          expectedSkills: question.expectedSkills,
          codeTemplate: question.codeTemplate || '',
          constraints: '',
          examples: ''
        }
      });

      questions.push({
        id: createdQuestion.id,
        interviewId: id,
        questionNumber: item.currentQuestion,
        question: question.question,
        type: question.type,
        topic: question.topic,
        difficulty: question.difficulty,
        expectedSkills: question.expectedSkills,
        codeTemplate: question.codeTemplate || ''
      } as any);
    }

    // Map database structures to client-expected structure (including content field)
    const mappedQuestions = questions.map((q: any) => ({
      ...q,
      content: q.question
    }));

    const currentQuestionDetail = mappedQuestions.find((q: any) => q.questionNumber === item.currentQuestion);

    // Fetch candidate answers
    const questionIds = mappedQuestions.map((q: any) => q.id);
    const answers = questionIds.length > 0 
      ? await db.candidateAnswer.findMany({ where: { questionId: { in: questionIds } } })
      : [];

    return this.injectConfigFallback({
      ...item,
      questions: mappedQuestions,
      answers,
      currentQuestionDetail
    });
  },

  async startInterview(id: string) {
    const interview = await db.interview.findUnique({ where: { id } });
    if (!interview) throw new Error('Interview session not found');

    const updated = await db.interview.update({
      where: { id },
      data: { status: 'active', startedAt: new Date() }
    });

    return this.getInterview(id, interview.userId);
  },

  async submitAnswer(id: string, payload: any) {
    const interview = await db.interview.findUnique({ where: { id } });
    if (!interview) throw new Error('Interview not found');

    const questionRecord = await db.interviewQuestion.findUnique({ where: { id: payload.questionId } });
    const questionText = questionRecord ? questionRecord.question : payload.questionId;
    const expectedSkills = questionRecord ? questionRecord.expectedSkills : [];
    const isCoding = questionRecord?.type === 'coding' || !!payload.code;

    // Fetch existing answers to this specific question to build conversation history/context
    const existingAnswers = await db.candidateAnswer.findMany({ where: { questionId: payload.questionId } });
    const answerCount = existingAnswers.length;

    const context: { role: 'ai' | 'candidate'; content: string }[] = [];
    if (answerCount > 0) {
      const sortedAnswers = [...existingAnswers].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      for (const ans of sortedAnswers) {
        context.push({ role: 'candidate', content: ans.answer || ans.code || '' });
        const fbStr = ans.feedback || '';
        const followUpIndex = fbStr.indexOf('\n\n[FOLLOW_UP]: ');
        if (followUpIndex !== -1) {
          const followUpText = fbStr.substring(followUpIndex + 14).trim();
          context.push({ role: 'ai', content: followUpText });
        }
      }
    }

    let evaluation;
    if (isCoding) {
      const codingEval = await aiService.evaluateCodingAnswer({
        problem: questionText,
        language: payload.language || 'javascript',
        code: payload.code || payload.content || '',
        testResults: []
      });
      evaluation = {
        score: codingEval.score ?? 0,
        technicalAccuracy: codingEval.correctness ?? 0,
        depth: codingEval.codeQuality ?? 0,
        problemSolving: codingEval.algorithm ?? 0,
        communication: 80,
        feedback: `${codingEval.feedback ?? 'Code evaluation completed.'}\n\nTime Complexity: ${codingEval.timeComplexity ?? 'N/A'}\nSpace Complexity: ${codingEval.spaceComplexity ?? 'N/A'}`,
        strengths: codingEval.strengths ?? [],
        weaknesses: codingEval.improvements ?? [],
        shouldAskFollowUp: false
      };
    } else {
      evaluation = await aiService.evaluateAnswer({
        question: questionText,
        answer: payload.content || '',
        expectedSkills: expectedSkills,
        context: context
      });
    }

    // Determine follow-up status (only allow at most 1 follow-up question per main question)
    const isLastQuestion = interview.currentQuestion + 1 >= interview.questionCount;
    let shouldAskFollowUp = evaluation.shouldAskFollowUp && !isLastQuestion && (answerCount === 0);
    let followUpQuestionText = '';

    if (shouldAskFollowUp) {
      try {
        const followUpRes = await aiService.generateFollowUpQuestion({
          originalQuestion: questionText,
          candidateAnswer: payload.content || '',
          interviewContext: context
        });
        shouldAskFollowUp = followUpRes.shouldAskFollowUp;
        followUpQuestionText = followUpRes.followUpQuestion || '';
      } catch (err) {
        shouldAskFollowUp = true;
        followUpQuestionText = "Can you elaborate on the potential tradeoffs or alternative approaches for this solution?";
      }
      if (shouldAskFollowUp && !followUpQuestionText) {
        followUpQuestionText = "Can you elaborate on the potential tradeoffs or alternative approaches for this solution?";
      }
    }

    // Save candidate answer to database
    // Append the follow-up question text to the feedback so we can extract it in the next context check
    const finalFeedback = shouldAskFollowUp 
      ? `${evaluation.feedback}\n\n[FOLLOW_UP]: ${followUpQuestionText}`
      : evaluation.feedback;

    await db.candidateAnswer.create({
      data: {
        questionId: payload.questionId,
        answer: payload.content || '',
        code: payload.code || '',
        language: payload.language || '',
        score: evaluation.score,
        technicalAccuracy: evaluation.technicalAccuracy,
        depth: evaluation.depth,
        problemSolving: evaluation.problemSolving,
        communication: evaluation.communication,
        feedback: finalFeedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses
      }
    });

    // Advance index ONLY if not asking a follow-up
    if (!shouldAskFollowUp) {
      const nextIndex = interview.currentQuestion + 1;
      const isCompleted = nextIndex >= interview.questionCount;

      if (isCompleted) {
        await db.interview.update({
          where: { id },
          data: { status: 'completed', completedAt: new Date() }
        });
      } else {
        await db.interview.update({
          where: { id },
          data: { currentQuestion: nextIndex }
        });
      }
    }

    return {
      score: evaluation.score,
      feedback: evaluation.feedback,
      shouldAskFollowUp,
      followUpQuestion: shouldAskFollowUp ? followUpQuestionText : undefined
    };
  },

  async getFollowUp(id: string) {
    return {
      shouldAskFollowUp: false,
      reason: 'Standard progress'
    };
  },

  async completeInterview(id: string) {
    await db.interview.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() }
    });
    return this.getResults(id);
  },

  async getResults(id: string) {
    // Check if result already exists in the database
    const existingResult = await db.interviewResult.findUnique({ where: { interviewId: id } });
    if (existingResult) {
      return {
        ...existingResult,
        skillScores: [
          { skill: 'Technical Knowledge', score: existingResult.technicalKnowledge },
          { skill: 'Problem Solving', score: existingResult.problemSolving },
          { skill: 'Coding Skills', score: existingResult.coding },
          { skill: 'Communication', score: existingResult.communication },
          { skill: 'Accuracy', score: existingResult.accuracy }
        ]
      };
    }

    const interview = await db.interview.findUnique({ where: { id } });
    if (!interview) throw new Error('Interview not found');

    const questions = await db.interviewQuestion.findMany({ where: { interviewId: id } });
    const questionIds = questions.map((q: any) => q.id);
    const answers = questionIds.length > 0 
      ? await db.candidateAnswer.findMany({ where: { questionId: { in: questionIds } } })
      : [];

    let overallScore = 0;
    let technicalKnowledge = 0;
    let problemSolving = 0;
    let coding = 0;
    let communication = 0;
    let accuracy = 0;

    if (answers.length > 0) {
      let totalScore = 0;
      let totalTech = 0;
      let totalProb = 0;
      let totalCod = 0;
      let totalComm = 0;
      let totalAcc = 0;

      for (const ans of answers) {
        totalScore += ans.score || 0;
        totalTech += ans.technicalAccuracy || 0;
        totalProb += ans.problemSolving || 0;
        totalComm += ans.communication || 0;
        
        if (ans.code) {
          totalCod += ans.score || 0;
        } else {
          totalCod += ans.technicalAccuracy || 0;
        }
        totalAcc += ans.technicalAccuracy || 0;
      }

      const count = answers.length;
      overallScore = Math.round(totalScore / count);
      technicalKnowledge = Math.round(totalTech / count);
      problemSolving = Math.round(totalProb / count);
      coding = Math.round(totalCod / count);
      communication = Math.round(totalComm / count);
      accuracy = Math.round(totalAcc / count);
    } else {
      overallScore = 60;
      technicalKnowledge = 60;
      problemSolving = 60;
      coding = 60;
      communication = 60;
      accuracy = 60;
    }

    // Prepare evaluation history for Gemini
    const history = questions.map((q: any) => {
      const qAns = answers.filter((a: any) => a.questionId === q.id);
      return {
        question: q.question,
        answers: qAns.map((a: any) => ({
          answer: a.answer,
          code: a.code,
          score: a.score,
          feedback: a.feedback
        }))
      };
    });

    let aiResult;
    try {
      aiResult = await aiService.generateInterviewResult({ history });
    } catch (e) {
      // fallback
      aiResult = {
        overallScore,
        technicalKnowledge,
        problemSolving,
        coding,
        communication,
        accuracy,
        strengths: ['Analytical reasoning', 'Clear description of core conceptual frameworks.'],
        weaknesses: ['Could specify concurrency/performance tradeoff characteristics.'],
        recommendations: ['Practice explaining algorithmic complexity and system design tradeoffs.'],
        summary: 'Solid performance demonstrated across the interview questions.'
      };
    }

    const createdResult = await db.interviewResult.create({
      data: {
        interviewId: id,
        overallScore: aiResult.overallScore ?? overallScore,
        technicalKnowledge: aiResult.technicalKnowledge ?? technicalKnowledge,
        problemSolving: aiResult.problemSolving ?? problemSolving,
        coding: aiResult.coding ?? coding,
        communication: aiResult.communication ?? communication,
        accuracy: aiResult.accuracy ?? accuracy,
        strengths: aiResult.strengths ?? [],
        weaknesses: aiResult.weaknesses ?? [],
        recommendations: aiResult.recommendations ?? [],
        summary: aiResult.summary ?? 'Evaluation completed successfully.'
      }
    });

    return {
      ...createdResult,
      skillScores: [
        { skill: 'Technical Knowledge', score: createdResult.technicalKnowledge },
        { skill: 'Problem Solving', score: createdResult.problemSolving },
        { skill: 'Coding Skills', score: createdResult.coding },
        { skill: 'Communication', score: createdResult.communication },
        { skill: 'Accuracy', score: createdResult.accuracy }
      ]
    };
  },

  // Injects config fallback so old frontend style interview.config.role doesn't crash
  injectConfigFallback(item: any) {
    if (!item) return item;
    return {
      ...item,
      config: {
        role: item.role,
        experienceLevel: item.experienceLevel,
        difficulty: item.difficulty,
        interviewType: item.interviewType,
        technologies: item.technologies,
        topics: item.topics,
        duration: item.duration,
        questionCount: item.questionCount
      }
    };
  }
};
