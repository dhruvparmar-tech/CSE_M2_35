import { v4 as uuidv4 } from 'uuid';

export class InMemoryDb {
  public users = new Map<string, any>();
  public interviews = new Map<string, any>();
  public interviewQuestions = new Map<string, any>();
  public candidateAnswers = new Map<string, any>();
  public interviewResults = new Map<string, any>();
  public skillScores = new Map<string, any>();
  public practiceQuestions = new Map<string, any>();

  constructor() {}

  createUser(data: any) {
    const id = uuidv4();
    const user = { id, ...data };
    this.users.set(id, user);
    return user;
  }

  findUserById(id: string) {
    return this.users.get(id);
  }

  findUserByEmail(email: string) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  createInterview(data: any) {
    const id = uuidv4();
    const interview = { id, status: 'pending', currentQuestion: 0, ...data };
    this.interviews.set(id, interview);
    return interview;
  }

  findInterviewById(id: string) {
    return this.interviews.get(id);
  }

  findInterviewsByUserId(userId: string) {
    const results = [];
    for (const interview of this.interviews.values()) {
      if (interview.userId === userId) results.push(interview);
    }
    return results;
  }

  updateInterview(id: string, data: any) {
    const interview = this.interviews.get(id);
    if (!interview) throw new Error('Interview not found');
    const updated = { ...interview, ...data };
    this.interviews.set(id, updated);
    return updated;
  }

  createInterviewQuestion(data: any) {
    const id = uuidv4();
    const q = { id, ...data };
    this.interviewQuestions.set(id, q);
    return q;
  }

  createCandidateAnswer(data: any) {
    const id = uuidv4();
    const a = { id, ...data };
    this.candidateAnswers.set(id, a);
    return a;
  }

  createInterviewResult(data: any) {
    const id = uuidv4();
    const r = { id, ...data };
    this.interviewResults.set(id, r);
    return r;
  }

  createPracticeQuestion(data: any) {
    const id = uuidv4();
    const q = { id, ...data };
    this.practiceQuestions.set(id, q);
    return q;
  }
}

export const inMemoryDb = new InMemoryDb();
