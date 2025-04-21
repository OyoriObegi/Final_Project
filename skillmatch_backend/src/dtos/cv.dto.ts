export interface CreateCVDTO {
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  content: string;
}

export interface UpdateCVDTO {
  originalName?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  content?: string;
  aiAnalysis?: {
    skills: string[];
    experience: string[];
    education: string[];
    summary: string;
  };
} 