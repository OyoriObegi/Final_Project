import { AIService } from '../ai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mocked AI response')
        }
      })
    })
  }))
}));

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  describe('analyzeApplication', () => {
    it('should analyze application successfully', async () => {
      const result = await aiService.analyzeApplication('cover letter', 'job description');
      
      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });
  });

  describe('generateCoverLetter', () => {
    it('should generate cover letter successfully', async () => {
      const result = await aiService.generateCoverLetter('job description', ['skill1', 'skill2']);
      
      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });
  });

  describe('analyzeJobSkills', () => {
    it('should analyze job skills successfully', async () => {
      const result = await aiService.analyzeJobSkills('job description');
      
      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });
  });
}); 