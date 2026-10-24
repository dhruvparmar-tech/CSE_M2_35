export interface CodeExecutionProvider {
  runCode(code: string, language: string, testCases?: any[]): Promise<any>;
  submitCode(code: string, language: string, testCases: any[]): Promise<any>;
}

export class MockExecutionProvider implements CodeExecutionProvider {
  async runCode(code: string, language: string, testCases?: any[]) {
    return { output: 'Mock execution successful', passed: true };
  }
  async submitCode(code: string, language: string, testCases: any[]) {
    return { output: 'All test cases passed', passed: true };
  }
}

export const codeExecutionService = new MockExecutionProvider();
