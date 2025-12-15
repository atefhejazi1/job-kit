export interface Company {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
  contactPhone?: string;
  contactEmail?: string;
  establishedYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyFormData {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  description: string;
  logo: string;
  contactPhone: string;
  contactEmail: string;
  establishedYear: number | null;
}

export interface CompanyResponse {
  message: string;
  company: Company;
}

export type CompanySize = 
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';