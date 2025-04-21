import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GeminiService } from '../services/gemini.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

class SkillsAnalysisDto {
  skills: string[];
  jobDescription: string;
}

class CareerAdviceDto {
  currentSkills: string[];
  experience: string;
  careerGoals: string;
}

class TrendAnalysisDto {
  skills: string[];
}

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('analyze-skills')
  @ApiOperation({ summary: 'Analyze skills against job description' })
  @ApiResponse({
    status: 200,
    description: 'Returns skills analysis with match score and recommendations',
  })
  async analyzeSkills(@Body() dto: SkillsAnalysisDto) {
    return this.geminiService.analyzeSkills(dto.skills, dto.jobDescription);
  }

  @Post('career-advice')
  @ApiOperation({ summary: 'Generate personalized career advice' })
  @ApiResponse({
    status: 200,
    description: 'Returns career development roadmap and recommendations',
  })
  async generateCareerAdvice(@Body() dto: CareerAdviceDto) {
    return this.geminiService.generateCareerAdvice(
      dto.currentSkills,
      dto.experience,
      dto.careerGoals,
    );
  }

  @Post('analyze-trends')
  @ApiOperation({ summary: 'Analyze market trends for skills' })
  @ApiResponse({
    status: 200,
    description: 'Returns market trend analysis for specified skills',
  })
  async analyzeTrends(@Body() dto: TrendAnalysisDto) {
    return this.geminiService.analyzeTrends(dto.skills);
  }

  @Get('health')
  async healthCheck() {
    return { status: 'ok', message: 'AI service is running' };
  }
} 