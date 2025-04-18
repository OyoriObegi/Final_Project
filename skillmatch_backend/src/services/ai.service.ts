import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiResponse } from '../types/apiResponse';

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async analyzeApplication(coverLetter: string, jobDescription: string): Promise<ApiResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze this job application and provide feedback:
        
        Job Description:
        ${jobDescription}
        
        Cover Letter:
        ${coverLetter}
        
        Please provide:
        1. Strengths of the application
        2. Areas for improvement
        3. Suggestions for better alignment with the job requirements
        4. Overall match score (1-10)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        status: 'success',
        data: { analysis: text }
      };
    } catch (error) {
      console.error('Error analyzing application:', error);
      return {
        status: 'error',
        message: 'Failed to analyze application',
        error: {
          code: 'ANALYSIS_ERROR',
          message: 'Failed to analyze application'
        }
      };
    }
  }

  async generateCoverLetter(jobDescription: string, skills: string[]): Promise<ApiResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Generate a cover letter based on:
        
        Job Description:
        ${jobDescription}
        
        Skills:
        ${skills.join(', ')}
        
        Please write a professional cover letter that highlights these skills in relation to the job requirements.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        status: 'success',
        data: { cover_letter: text }
      };
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return {
        status: 'error',
        message: 'Failed to generate cover letter',
        error: {
          code: 'GENERATION_ERROR',
          message: 'Failed to generate cover letter'
        }
      };
    }
  }

  async analyzeJobSkills(jobDescription: string): Promise<ApiResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze this job description and identify the required skills:
        
        Job Description:
        ${jobDescription}
        
        Please provide:
        1. Required technical skills
        2. Required soft skills
        3. Optional/nice-to-have skills
        4. Experience level required
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        status: 'success',
        data: { analysis: text }
      };
    } catch (error) {
      console.error('Error analyzing job skills:', error);
      return {
        status: 'error',
        message: 'Failed to analyze job skills',
        error: {
          code: 'ANALYSIS_ERROR',
          message: 'Failed to analyze job skills'
        }
      };
    }
  }
}

export const aiService = new AIService(); 