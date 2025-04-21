import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeCVContent(cvText: string) {
    const prompt = `Analyze this CV content and provide insights:
    ${cvText}
    
    Please provide:
    1. Key skills identified
    2. Years of experience
    3. Career level
    4. Strengths
    5. Areas for improvement
    6. Suggested roles`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateJobDescription(params: {
    title: string;
    requirements: string[];
    company: string;
  }) {
    const prompt = `Create a professional job description for:
    Title: ${params.title}
    Company: ${params.company}
    Requirements: ${params.requirements.join(', ')}
    
    Include:
    1. Role overview
    2. Key responsibilities
    3. Required qualifications
    4. Preferred qualifications
    5. Benefits
    6. Company culture`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async matchCandidateToJob(cvContent: string, jobDescription: string) {
    const prompt = `Compare this CV with the job description and provide a detailed match analysis:
    
    CV:
    ${cvContent}
    
    Job Description:
    ${jobDescription}
    
    Provide:
    1. Overall match percentage
    2. Matching skills
    3. Missing skills
    4. Experience match
    5. Recommendations`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
} 