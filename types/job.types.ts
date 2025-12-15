export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  workType: WorkType;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  benefits: string[];
  skills: string[];
  experienceLevel: string;
  isActive: boolean;
  deadline?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkType = 
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'FREELANCE'
  | 'INTERNSHIP'
  | 'REMOTE';

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  workType: WorkType;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  benefits: string[];
  skills: string[];
  experienceLevel: string;
  deadline?: string;
}

export interface JobResponse {
  message: string;
  job: Job;
}

export interface JobsResponse {
  message: string;
  jobs: Job[];
  total: number;
}