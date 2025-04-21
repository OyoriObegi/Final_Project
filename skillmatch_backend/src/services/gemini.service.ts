import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeSkills(skills: string[], jobDescription: string): Promise<any> {
    const prompt = `
      Analyze the following skills in relation to the job description:
      Skills: ${skills.join(', ')}
      
      Job Description:
      ${jobDescription}
      
      Please provide:
      1. A match score (0-100) for how well the skills match the job requirements
      2. Identify any missing critical skills
      3. Suggest additional relevant skills that would be beneficial
      4. Provide specific recommendations for skill improvement
      
      Format the response as a JSON object with the following structure:
      {
        "matchScore": number,
        "missingSkills": string[],
        "additionalSkills": string[],
        "recommendations": string[]
      }
    `;

    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }

  async generateCareerAdvice(currentSkills: string[], experience: string, careerGoals: string): Promise<any> {
    const prompt = `
      Based on the following information, provide career development advice:
      Current Skills: ${currentSkills.join(', ')}
      Experience: ${experience}
      Career Goals: ${careerGoals}
      
      Please provide:
      1. A career development roadmap
      2. Recommended learning paths
      3. Potential career transitions
      4. Industry-specific advice
      
      Format the response as a JSON object with the following structure:
      {
        "roadmap": string[],
        "learningPaths": string[],
        "careerTransitions": string[],
        "industryAdvice": string
      }
    `;

    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }

  async analyzeTrends(skills: string[]): Promise<any> {
    const prompt = `
      Analyze the current market trends for the following skills:
      ${skills.join(', ')}
      
      Please provide:
      1. Current demand level for each skill
      2. Future growth potential
      3. Industry sectors with highest demand
      4. Salary ranges associated with these skills
      
      Format the response as a JSON object with the following structure:
      {
        "skillAnalysis": {
          [skill: string]: {
            "currentDemand": "High" | "Medium" | "Low",
            "growthPotential": "High" | "Medium" | "Low",
            "topIndustries": string[],
            "salaryRange": {
              "min": number,
              "max": number
            }
          }
        }
      }
    `;

    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }
} 