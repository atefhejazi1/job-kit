export interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  experience?: string;
  expectedSalary?: number;
  availableFrom?: Date | string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  job?: {
    id: string;
    title: string;
    location: string;
    workType: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
  };
}

export type ApplicationStatus = 
  | "PENDING"
  | "REVIEWED" 
  | "SHORTLISTED"
  | "INTERVIEWING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface CreateApplicationData {
  jobId: string;
  applicantName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  experience?: string;
  expectedSalary?: number;
  availableFrom?: Date | string;
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  notes?: string;
}