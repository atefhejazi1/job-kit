"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ResumeData, SkillItem, LanguageItem, EducationItem, ExperienceItem, ProjectItem } from "@/types/resume.data.types";

// id generation
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Define the raw data structure from API
interface RawResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: (string | SkillItem)[];
  languages?: (string | LanguageItem)[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
}

const migrateData = (data: unknown): ResumeData => {
  // Validate data is an object
  if (!data || typeof data !== 'object') {
    return {
      name: "",
      email: "",
      phone: "",
      summary: "",
      skills: [],
      languages: [],
      education: [],
      experience: [],
      projects: [],
    };
  }

  const raw = data as RawResumeData;

  // Migrate skills
  let skills: SkillItem[] = [];
  if (Array.isArray(raw.skills)) {
    if (raw.skills.length === 0) {
      skills = [];
    } else if (typeof raw.skills[0] === 'string') {
      // Cast to string[] before mapping to fix TS error
      skills = (raw.skills as string[]).map(name => ({
        type: 'skill' as const,
        id: generateId(),
        name
      }));
    } else {
      skills = raw.skills as SkillItem[];
    }
  }

  // Migrate languages
  let languages: LanguageItem[] = [];
  if (Array.isArray(raw.languages)) {
    if (raw.languages.length === 0) {
      languages = [];
    } else if (typeof raw.languages[0] === 'string') {
      // Cast to string[] before mapping to fix TS error
      languages = (raw.languages as string[]).map(name => ({
        type: 'language' as const,
        id: generateId(),
        name
      }));
    } else {
      languages = raw.languages as LanguageItem[];
    }
  }

  return {
    name: raw.name || "",
    email: raw.email || "",
    phone: raw.phone || "",
    summary: raw.summary || "",
    skills,
    languages,
    education: raw.education || [],
    experience: raw.experience || [],
    projects: raw.projects || [],
  };
};

interface ResumeContextProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    saveResume: () => Promise<void>;
    loading: boolean;
    loadResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
    const [resumeData, setResumeData] = useState<ResumeData>({
        name: "",
        email: "",
        phone: "",
        summary: "",
        skills: [],
        languages: [],
        education: [],
        experience: [],
        projects: [],
    });

    const [loading, setLoading] = useState(false);

    const loadResume = useCallback(async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                console.log("No user found in localStorage");
                setLoading(false);
                return;
            }

            const userObj = JSON.parse(userData);
            const userId = userObj.id;

            const res = await fetch(`/api/resume?userId=${userId}`);
            if (!res.ok) {
                if (res.status === 404) {
                    console.log("No CV found");
                    setLoading(false);
                    return;
                }
                throw new Error("Failed to load resume");
            }

            const data = await res.json();
            const migratedData = migrateData(data);
            setResumeData(migratedData);
        } catch (err) {
            console.error("Error loading resume:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveResume = useCallback(async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                alert("User not logged in. Cannot save resume.");
                setLoading(false);
                return;
            }

            const userObj = JSON.parse(userData);
            const userId = userObj.id;

            const res = await fetch("/api/resume", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...resumeData,
                    userId: userId
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save resume");
            }

            const savedData = await res.json();
            console.log("Resume saved successfully:", savedData);
            const migratedData = migrateData(savedData);
            setResumeData(migratedData);
        } catch (err) {
            console.error("Error saving resume:", err);
            alert("Failed to save resume. Check console for details.");
        } finally {
            setLoading(false);
        }
    }, [resumeData]);

    return (
        <ResumeContext.Provider value={{ resumeData, setResumeData, saveResume, loading, loadResume }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) throw new Error("useResume must be used within ResumeProvider");
    return context;
};