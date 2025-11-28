// src/contexts/ResumeContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ResumeData } from "@/types/resume.data.types";

interface ResumeContextProps {
    resumeData: ResumeData;
    setResumeData: (data: ResumeData) => void;
    saveResume: () => Promise<void>;
    loading: boolean;
    loadResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
    // Initial state for Resume Data
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

     // Function to load resume data from API
    const loadResume = useCallback(async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                console.log("No user found in localStorage");
                setLoading(false);
                return;
            }

            const userObj = JSON.parse(userData); // تحويل النص لـ object
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

setResumeData({
  ...data,
  skills: data.skills || [],
  languages: data.languages || [],
  education: data.education || [],
  experience: data.experience || [],
  projects: data.projects || [],
});
  } catch (err) {
            console.error(" Error loading resume:", err);
        } finally {
            setLoading(false);
        }
    }, []); // ← EMPTY dependency array
    // Function to save resume data to the database via API route
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

    // استخدم PUT بدلاً من POST
    const res = await fetch("/api/resume", {
      method: "PUT", //  تغيير من POST إلى PUT
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
    console.log(" Resume saved successfully:", savedData);
    
    // تحديث الحالة المحلية بالبيانات المخزنة
    setResumeData(savedData);
  } catch (err) {
    console.error(" Error saving resume:", err);
    alert("Failed to save resume. Check console for details.");
  } finally {
    setLoading(false);
  }
    }, [resumeData]); //  dependency على resumeData
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