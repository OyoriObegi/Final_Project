import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/User';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('candidates')
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  async searchCandidates(
    @Query('q') query: string
  ) {
    const candidates = await this.searchService.searchCandidates(query);
    return {
      success: true,
      data: candidates.map(candidate => ({
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        skills: candidate.skills.map(skill => skill.name),
        experience: candidate.experience,
        education: candidate.education
      }))
    };
  }

  @Get('skills/related')
  async getRelatedSkills(
    @Query('skills') skills: string
  ) {
    const skillList = skills.split(',').map(s => s.trim());
    const relatedSkills = await this.searchService.suggestRelatedSkills(skillList);
    return {
      success: true,
      data: relatedSkills
    };
  }

  @Get('skills/popular-combinations')
  async getPopularSkillCombinations() {
    const combinations = await this.searchService.getPopularSkillCombinations();
    return {
      success: true,
      data: combinations
    };
  }
} 