export interface EducationItem {
  type: 'education';
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  type: 'experience';
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  type: 'project';
  title: string;
  link: string;
  description: string;
}


export interface SkillItem {
  type: 'skill';
  id: string;
  name: string;
}

export interface LanguageItem {
  type: 'language';
  id: string;
  name: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: SkillItem[];
  languages: LanguageItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

export interface TempPersonalInfo {
  type: 'personal';
  name: string;
  email: string;
  phone: string;
}

export type EditingData = 
  | TempPersonalInfo
  | EducationItem
  | ExperienceItem
  | ProjectItem
  | SkillItem
  | LanguageItem
  | string;

  // Raw data coming from API before migration
export interface RawResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: (string | SkillItem)[];
  languages?: (string | LanguageItem)[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
}

// Types exposed by ResumeContext
export interface ResumeContextProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  saveResume: () => Promise<void>;
  loading: boolean;
  loadResume: () => Promise<void>;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  fileUrl: string;
  fileName: string;
}