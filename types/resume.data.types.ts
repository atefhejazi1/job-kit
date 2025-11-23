export interface EducationItem {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  link: string;
  description: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;

  skills: string[];
  languages: string[];

  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];

}
