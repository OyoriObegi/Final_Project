import { Job } from '../entities/Job';
import { User } from '../entities/User';
import { Portfolio } from '../entities/Portfolio';
import { CV } from '../entities/CV';
import { Application } from '../entities/Application';
import { Skill } from '../entities/Skill';
import { ExperienceLevel } from '../entities/Job';

export class AIService {
  private experienceLevelWeights: Record<ExperienceLevel, number> = {
    'entry': 0,
    'junior': 1,
    'mid': 2,
    'senior': 3,
    'lead': 4,
    'executive': 5
  };

  async matchJobToCandidate(job: Job, candidate: User): Promise<{
    score: number;
    matchDetails: {
      skillMatch: number;
      experienceMatch: number;
      educationMatch: number;
      overallFit: number;
    };
    feedback: {
      strengths: string[];
      gaps: string[];
      recommendations: string[];
    };
  }> {
    // Calculate skill match
    const skillMatch = await this.calculateSkillMatch(job, candidate);
    
    // Calculate experience match
    const experienceMatch = this.calculateExperienceMatch(job, candidate);
    
    // Calculate education match
    const educationMatch = this.calculateEducationMatch(job, candidate);
    
    // Calculate overall fit
    const overallFit = this.calculateOverallFit(skillMatch, experienceMatch, educationMatch);
    
    // Generate feedback
    const feedback = this.generateFeedback(job, candidate, {
      skillMatch,
      experienceMatch,
      educationMatch
    });

    return {
      score: overallFit,
      matchDetails: {
        skillMatch,
        experienceMatch,
        educationMatch,
        overallFit
      },
      feedback
    };
  }

  private async calculateSkillMatch(job: Job, candidate: User): Promise<number> {
    const requiredSkills = job.requiredSkills || [];
    const preferredSkills = job.preferredSkills || [];
    const candidateSkills = candidate.skills || [];

    // Calculate required skills match (weighted at 70%)
    const requiredMatches = requiredSkills.filter(required =>
      candidateSkills.some(skill => skill.id === required.id)
    ).length;
    const requiredScore = requiredSkills.length > 0 
      ? (requiredMatches / requiredSkills.length) * 0.7
      : 0.7;

    // Calculate preferred skills match (weighted at 30%)
    const preferredMatches = preferredSkills.filter(preferred =>
      candidateSkills.some(skill => skill.id === preferred.id)
    ).length;
    const preferredScore = preferredSkills.length > 0
      ? (preferredMatches / preferredSkills.length) * 0.3
      : 0.3;

    return (requiredScore + preferredScore) * 100;
  }

  private calculateExperienceMatch(job: Job, candidate: User): number {
    if (!job.experienceLevel || !candidate.experience) {
      return 50; // Default middle score if we can't determine
    }

    // Calculate years of experience
    const totalYears = candidate.experience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      return total + (end.getFullYear() - start.getFullYear());
    }, 0);

    // Map years to experience levels
    const yearsToLevel: Record<ExperienceLevel, number> = {
      entry: 0,
      junior: 1,
      mid: 3,
      senior: 5,
      lead: 8,
      executive: 10
    };

    const requiredYears = yearsToLevel[job.experienceLevel] || 0;
    const candidateLevel = (Object.entries(yearsToLevel) as [ExperienceLevel, number][])
      .find(([_, years]) => totalYears >= years)?.[0] || 'entry';

    // Calculate score based on experience level match
    const levelDiff = Math.abs(
      this.experienceLevelWeights[job.experienceLevel] - 
      this.experienceLevelWeights[candidateLevel as ExperienceLevel]
    );

    return Math.max(0, 100 - (levelDiff * 20));
  }

  private calculateEducationMatch(job: Job, candidate: User): number {
    if (!candidate.education || candidate.education.length === 0) {
      return 50; // Default middle score if no education data
    }

    // Extract education requirements from job description if available
    const educationKeywords = job.description.toLowerCase().match(
      /bachelor'?s|master'?s|phd|degree|diploma|certification/g
    ) || [];

    // Calculate match based on highest education level
    const highestEducation = candidate.education
      .sort((a, b) => {
        const levels = {
          'high school': 1,
          'associate': 2,
          'bachelor': 3,
          'master': 4,
          'phd': 5
        };
        const levelA = Object.entries(levels)
          .find(([key]) => a.degree.toLowerCase().includes(key))?.[1] || 0;
        const levelB = Object.entries(levels)
          .find(([key]) => b.degree.toLowerCase().includes(key))?.[1] || 0;
        return levelB - levelA;
      })[0];

    // Base score on highest education
    let score = 70; // Default good score for having any education

    // Bonus points for matching job requirements
    if (educationKeywords.length > 0) {
      const matches = educationKeywords.filter(keyword =>
        highestEducation.degree.toLowerCase().includes(keyword) ||
        highestEducation.field.toLowerCase().includes(keyword)
      );
      score += (matches.length / educationKeywords.length) * 30;
    }

    return score;
  }

  private calculateOverallFit(
    skillMatch: number,
    experienceMatch: number,
    educationMatch: number
  ): number {
    // Weighted average: Skills (50%), Experience (30%), Education (20%)
    return (
      (skillMatch * 0.5) +
      (experienceMatch * 0.3) +
      (educationMatch * 0.2)
    );
  }

  private generateFeedback(
    job: Job,
    candidate: User,
    scores: {
      skillMatch: number;
      experienceMatch: number;
      educationMatch: number;
    }
  ): {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  } {
    const strengths: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];

    // Analyze skill match
    if (scores.skillMatch >= 80) {
      strengths.push('Strong match with required technical skills');
    } else if (scores.skillMatch < 50) {
      gaps.push('Missing several required skills');
      // Find missing required skills
      const missingSkills = job.requiredSkills.filter(
        required => !candidate.skills.some(skill => skill.id === required.id)
      );
      if (missingSkills.length > 0) {
        recommendations.push(
          `Consider acquiring these skills: ${missingSkills.map(s => s.name).join(', ')}`
        );
      }
    }

    // Analyze experience match
    if (scores.experienceMatch >= 80) {
      strengths.push('Experience level aligns well with job requirements');
    } else if (scores.experienceMatch < 50) {
      gaps.push('Experience level may be insufficient');
      recommendations.push('Gain more experience in similar roles');
    }

    // Analyze education match
    if (scores.educationMatch >= 80) {
      strengths.push('Educational background is highly relevant');
    } else if (scores.educationMatch < 50) {
      gaps.push('Educational background may need enhancement');
      recommendations.push('Consider relevant certifications or additional education');
    }

    return {
      strengths,
      gaps,
      recommendations
    };
  }

  async analyzePortfolio(portfolio: Portfolio): Promise<{
    careerLevel: string;
    domainExpertise: string[];
    skillAnalysis: {
      skill: string;
      level: string;
      relevance: number;
    }[];
    careerPath: {
      current: string;
      suggested: string[];
      nextSteps: string[];
    };
    recommendations: {
      skills: string[];
      certifications: string[];
      projects: string[];
    };
  }> {
    // TODO: Implement AI-based portfolio analysis
    return {
      careerLevel: '',
      domainExpertise: [],
      skillAnalysis: [],
      careerPath: {
        current: '',
        suggested: [],
        nextSteps: []
      },
      recommendations: {
        skills: [],
        certifications: [],
        projects: []
      }
    };
  }

  async parseCV(cvText: string): Promise<{
    personalInfo: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    skills: string[];
    experience: {
      title: string;
      company: string;
      duration: string;
      responsibilities: string[];
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    certifications: string[];
  }> {
    // TODO: Implement AI-based CV parsing
    return {
      personalInfo: {},
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };
  }

  async generateJobDescription(input: {
    title: string;
    skills: string[];
    level: string;
    industry: string;
  }): Promise<{
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    keywords: string[];
  }> {
    // TODO: Implement AI-based job description generation
    return {
      description: '',
      requirements: [],
      responsibilities: [],
      benefits: [],
      keywords: []
    };
  }

  async suggestSkills(context: {
    jobTitle: string;
    industry: string;
    existingSkills: string[];
  }): Promise<{
    technical: string[];
    soft: string[];
    trending: string[];
    emerging: string[];
  }> {
    // TODO: Implement AI-based skill suggestions
    return {
      technical: [],
      soft: [],
      trending: [],
      emerging: []
    };
  }

  async analyzeApplication(application: Application): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    fitScore: {
      skills: number;
      experience: number;
      education: number;
      overall: number;
    };
  }> {
    // TODO: Implement AI-based application analysis
    return {
      score: 0,
      feedback: '',
      strengths: [],
      weaknesses: [],
      recommendations: [],
      fitScore: {
        skills: 0,
        experience: 0,
        education: 0,
        overall: 0
      }
    };
  }

  async generateCareerAdvice(context: {
    currentRole: string;
    experience: number;
    skills: string[];
    interests: string[];
    goals: string[];
  }): Promise<{
    suggestedPaths: string[];
    nextSteps: string[];
    skillsToAcquire: string[];
    certifications: string[];
    timelineEstimate: string;
  }> {
    // TODO: Implement AI-based career advice generation
    return {
      suggestedPaths: [],
      nextSteps: [],
      skillsToAcquire: [],
      certifications: [],
      timelineEstimate: ''
    };
  }

  async predictSkillTrends(skills: Skill[]): Promise<{
    trending: string[];
    declining: string[];
    emerging: string[];
    stable: string[];
    predictions: {
      skill: string;
      trend: 'up' | 'down' | 'stable';
      confidence: number;
      timeframe: string;
    }[];
  }> {
    // TODO: Implement AI-based skill trend prediction
    return {
      trending: [],
      declining: [],
      emerging: [],
      stable: [],
      predictions: []
    };
  }
} 