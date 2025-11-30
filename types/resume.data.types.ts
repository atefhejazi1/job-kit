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
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

//  للمعلومات الشخصية أثناء التحرير
export interface TempPersonalInfo {
  type: 'personal';
  name: string;
  email: string;
  phone: string;
}

//   لجميع بيانات التحرير المؤقتة
export type EditingData = 
  | TempPersonalInfo
  | EducationItem
  | ExperienceItem
  | ProjectItem
  | SkillItem
  | LanguageItem
  | string;