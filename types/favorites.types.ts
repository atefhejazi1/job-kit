// Favorites and Search Types

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date | string;
  job?: {
    id: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
    company?: {
      id: string;
      companyName: string;
      logo?: string;
      location?: string;
    };
  };
}

export interface SavedCompany {
  id: string;
  userId: string;
  companyId: string;
  createdAt: Date | string;
  company?: {
    id: string;
    companyName: string;
    logo?: string;
    industry?: string;
    location?: string;
    description?: string;
  };
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  query: string;
  filters?: {
    location?: string;
    workType?: string;
    salaryMin?: number;
    salaryMax?: number;
    experienceLevel?: string;
    skills?: string[];
  };
  createdAt: Date | string;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  workType?: string | string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  skills?: string[];
  sortBy?: 'newest' | 'salary' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SavedJobsResponse {
  savedJobs: SavedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedCompaniesResponse {
  savedCompanies: SavedCompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchHistoryResponse {
  history: SearchHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
