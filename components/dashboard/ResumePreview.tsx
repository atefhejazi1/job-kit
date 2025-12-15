"use client";

import toast from "react-hot-toast";
import { useResume } from "@/contexts/ResumeContext";
import { Edit2, Trash2, Plus, Save, Loader2, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import type {
  ResumeData,
  EditingData,
  TempPersonalInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  LanguageItem,
  CertificationItem,
} from "@/types/resume.data.types";
import { generateId } from "@/contexts/ResumeContext";

interface ResumePreviewProps {
  mode?: "readonly" | "editable";
  autoSave?: boolean;
  className?: string;
}

type EditingField =
  | "personal-info"
  | "summary"
  | "skills-new"
  | `skill-${string}`
  | "languages-new"
  | `lang-${string}`
  | `edu-${number}`
  | `exp-${number}`
  | `proj-${number}`
  | `cert-${string}`
  | "cert-new"
  | null;

export default function ResumePreview({
  mode = "readonly",
  autoSave = false,
  className = "",
}: ResumePreviewProps) {
  const { resumeData, setResumeData, saveResume } = useResume();
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState<EditingData | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [pendingSave, setPendingSave] = useState(false);
  const [newCert, setNewCert] = useState<CertificationItem>({
    type: "certification",
    id: generateId(),
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    fileUrl: "",
    fileName: "",
  });

  const isEditable = mode === "editable";

  useEffect(() => {
    console.log("ResumePreview Mode:", mode);
    console.log("Is Editable:", isEditable);
  }, [mode, isEditable]);

  useEffect(() => {
    if (!autoSave || !isEditable || !pendingSave) return;

    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await saveResume();
        setSaveStatus("saved");
        setPendingSave(false);
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("error");
        toast.error("Save failed. Please try again.");
        console.error("Auto-save failed:", error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [autoSave, isEditable, pendingSave, saveResume]);

  const saveToServer = useCallback(
    (data: Partial<ResumeData>) => {
      setResumeData((prev) => ({ ...prev, ...data }));
      if (autoSave) setPendingSave(true);
    },
    [setResumeData, autoSave]
  );

  const handleSimpleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditValue(e.target.value);
    },
    []
  );

  const handleObjectInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: string
    ) => {
      const value = e.target.value;
      setEditValue((prev) => {
        if (!prev || typeof prev === "string") return prev;
        return { ...prev, [field]: value };
      });
    },
    []
  );

  const saveEdit = useCallback(
    (field: string) => {
      if (editValue === null) return;

      const updates: Partial<ResumeData> = {};

      switch (field) {
        case "summary":
          updates.summary = editValue as string;
          toast.success("Summary saved");
          break;
        case "personal-info":
          const personal = editValue as TempPersonalInfo;
          updates.name = personal.name;
          updates.email = personal.email;
          updates.phone = personal.phone;
          toast.success("Personal info saved");
          break;
      }

      saveToServer(updates);
      setEditing(null);
      setEditValue(null);
    },
    [editValue, saveToServer]
  );

  const addNewSkillOrLanguage = useCallback(
    (type: "skills" | "languages") => {
      if (!newItemName.trim()) return;

      const newItem =
        type === "skills"
          ? {
              type: "skill" as const,
              id: generateId(),
              name: newItemName.trim(),
            }
          : {
              type: "language" as const,
              id: generateId(),
              name: newItemName.trim(),
            };

      const updates = (
        type === "skills"
          ? { skills: [...resumeData.skills, newItem] }
          : { languages: [...resumeData.languages, newItem] }
      ) as Partial<ResumeData>;

      saveToServer(updates);
      setNewItemName("");
      toast.success(`${type === "skills" ? "Skill" : "Language"} added`);
    },
    [newItemName, resumeData, saveToServer]
  );

  const deleteSkillOrLanguage = useCallback(
    (type: "skills" | "languages", id: string) => {
      if (
        !window.confirm(
          `Are you sure you want to delete this ${
            type === "skills" ? "skill" : "language"
          }?`
        )
      )
        return;

      const updates =
        type === "skills"
          ? { skills: resumeData.skills.filter((item) => item.id !== id) }
          : {
              languages: resumeData.languages.filter((item) => item.id !== id),
            };

      saveToServer(updates);
      toast.success(`${type === "skills" ? "Skill" : "Language"} deleted`);
    },
    [resumeData, saveToServer]
  );

  const startEditSkillOrLanguage = useCallback(
    (type: "skills" | "languages", item: SkillItem | LanguageItem) => {
      setEditing(`${type === "skills" ? "skill" : "lang"}-${item.id}`);
      setEditValue(item);
    },
    []
  );

  const saveSkillOrLanguageEdit = useCallback(
    (type: "skills" | "languages") => {
      if (editValue === null) return;

      const item = editValue as SkillItem | LanguageItem;
      const updates = (
        type === "skills"
          ? {
              skills: resumeData.skills.map((s) =>
                s.id === item.id ? (item as SkillItem) : s
              ),
            }
          : {
              languages: resumeData.languages.map((l) =>
                l.id === item.id ? (item as LanguageItem) : l
              ),
            }
      ) as Partial<ResumeData>;

      saveToServer(updates);
      setEditing(null);
      setEditValue(null);
      const itemType = type === "skills" ? "Skill" : "Language";
      toast.success(`${itemType} saved`);
    },
    [editValue, resumeData, saveToServer]
  );

  const deleteItem = useCallback(
    (
      section: "education" | "experience" | "projects" | "certifications",
      index: number
    ) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;

      const updates: Partial<ResumeData> = {
        [section]: resumeData[section].filter((_, i) => i !== index),
      };

      saveToServer(updates);
      const sectionName =
        section === "projects"
          ? "Project"
          : section === "certifications"
          ? "Certification"
          : section.charAt(0).toUpperCase() + section.slice(1);
      toast.success(`${sectionName} deleted`);
    },
    [resumeData, saveToServer]
  );

  const addNewItem = useCallback(
    (section: "education" | "experience" | "projects" | "certifications") => {
      const newIndex = resumeData[section].length;
      let editField: EditingField;
      let emptyItem:
        | EducationItem
        | ExperienceItem
        | ProjectItem
        | CertificationItem;

      if (section === "education") {
        editField = `edu-${newIndex}` as EditingField;
        emptyItem = {
          type: "education",
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        };
      } else if (section === "experience") {
        editField = `exp-${newIndex}` as EditingField;
        emptyItem = {
          type: "experience",
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        };
      } else if (section === "projects") {
        editField = `proj-${newIndex}` as EditingField;
        emptyItem = { type: "project", title: "", link: "", description: "" };
      } else {
        // certifications
        editField = `cert-${newIndex}` as EditingField;
        emptyItem = {
          type: "certification",
          id: generateId(),
          name: "",
          issuer: "",
          issueDate: "",
          credentialId: "",
          credentialUrl: "",
          fileUrl: "",
          fileName: "",
        };
      }

      setEditing(editField);
      setEditValue(emptyItem);

      const updates: Partial<ResumeData> = {
        [section]: [...resumeData[section], emptyItem],
      };

      setResumeData((prev) => ({ ...prev, ...updates }));
    },
    [resumeData, setResumeData]
  );

  const cancelAdd = useCallback(
    (
      section: "education" | "experience" | "projects" | "certifications",
      index: number
    ) => {
      const updates: Partial<ResumeData> = {
        [section]: resumeData[section].filter((_, i) => i !== index),
      };
      setResumeData((prev) => ({ ...prev, ...updates }));
      setEditing(null);
      setEditValue(null);
    },
    [resumeData, setResumeData]
  );

  const saveArrayItemEdit = useCallback(
    (
      section: "education" | "experience" | "projects" | "certifications",
      index: number
    ) => {
      if (editValue === null) return;

      const currentArray = [...resumeData[section]];

      switch (section) {
        case "education":
          currentArray[index] = editValue as EducationItem;
          break;
        case "experience":
          currentArray[index] = editValue as ExperienceItem;
          break;
        case "projects":
          currentArray[index] = editValue as ProjectItem;
          break;
        case "certifications":
          currentArray[index] = editValue as CertificationItem;
          break;
      }

      saveToServer({ [section]: currentArray } as Partial<ResumeData>);
      setEditing(null);
      setEditValue(null);
      const sectionName =
        section === "projects"
          ? "Project"
          : section === "certifications"
          ? "Certification"
          : section.charAt(0).toUpperCase() + section.slice(1);
      toast.success(`${sectionName} saved`);
    },
    [editValue, resumeData, saveToServer]
  );

  // ----------- CERTIFICATIONS    -----------
  const addNewCertification = useCallback(() => {
    if (!newItemName.trim()) return;
    const newCert: CertificationItem = {
      type: "certification",
      id: generateId(),
      name: newItemName.trim(),
      issuer: "Unknown",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      fileUrl: "",
      fileName: "",
    };
    saveToServer({ certifications: [...resumeData.certifications, newCert] });
    setNewItemName("");
    setEditing(null);
    toast.success("Certification added");
  }, [newItemName, resumeData, saveToServer]);

  const deleteCertification = useCallback(
    (id: string) => {
      if (!window.confirm("Delete this certification?")) return;
      saveToServer({
        certifications: resumeData.certifications.filter((c) => c.id !== id),
      });
      toast.success("Certification deleted");
    },
    [resumeData, saveToServer]
  );
  // Using the generic saveArrayItemEdit for Certification edits now.

  const renderSaveStatus = () => {
    if (!autoSave || !isEditable || saveStatus === "idle") return null;

    return (
      <div
        className="right-4 bottom-4 fixed flex items-center gap-2 bg-white shadow-lg px-4 py-2 border rounded-lg
        dark:bg-gray-800 dark:border-gray-700 dark:shadow-xl"
      >
        {saveStatus === "saving" && (
          <>
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin dark:text-blue-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">
              Saving...
            </span>
          </>
        )}
        {saveStatus === "saved" && (
          <>
            <Save className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 text-sm dark:text-green-400">
              Saved
            </span>
          </>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 text-sm dark:text-red-400">
            Save failed
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`max-w-3xl mx-auto p-6 bg-white text-gray-900 shadow-md rounded-md ${className}
        dark:bg-gray-900 dark:text-white dark:shadow-2xl dark:shadow-gray-700/50`}
      >
        <div id="resume-preview">
          {/* ---------------  PERSONAL INFO  --------------- */}
          <div className="flex justify-between items-start mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
            <div className="flex-1">
              {editing === "personal-info" &&
              editValue &&
              typeof editValue === "object" &&
              "type" in editValue &&
              editValue.type === "personal" ? (
                <div className="space-y-3">
                  <input
                    value={editValue.name}
                    onChange={(e) => handleObjectInputChange(e, "name")}
                    className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Full Name"
                    autoFocus
                  />
                  <input
                    value={editValue.email}
                    onChange={(e) => handleObjectInputChange(e, "email")}
                    className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Email"
                  />
                  <input
                    value={editValue.phone}
                    onChange={(e) => handleObjectInputChange(e, "phone")}
                    className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Phone"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => saveEdit("personal-info")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditing(null);
                        setEditValue(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="font-bold text-3xl dark:text-white">
                    {resumeData.name || "Your Name"}
                  </h1>
                  <p className="mt-2 text-gray-700 text-sm dark:text-gray-400">
                    {resumeData.email || "email@example.com"} ·{" "}
                    {resumeData.phone || "Phone"}
                  </p>
                </>
              )}
            </div>

            {isEditable && editing !== "personal-info" && (
              <button
                onClick={() => {
                  setEditing("personal-info");
                  setEditValue({
                    type: "personal",
                    name: resumeData.name,
                    email: resumeData.email,
                    phone: resumeData.phone,
                  });
                }}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                aria-label="Edit personal info"
              >
                <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
            )}
          </div>

          {/* ---------------  SUMMARY  --------------- */}
          {(resumeData.summary || isEditable) && (
            <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-xl dark:text-white">
                  Summary
                </h2>
                {isEditable && (
                  <>
                    {editing === "summary" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveEdit("summary")}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditing(null);
                            setEditValue(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing("summary");
                          setEditValue(resumeData.summary || "");
                        }}
                        className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                        aria-label="Edit summary"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                  </>
                )}
              </div>
              {editing === "summary" ? (
                <textarea
                  value={editValue as string}
                  onChange={handleSimpleInputChange}
                  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Professional summary..."
                  autoFocus
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-400">
                  {resumeData.summary || "Click edit to add summary"}
                </p>
              )}
            </div>
          )}

          {/* ---------------  SKILLS  --------------- */}
          <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-xl dark:text-white">Skills</h2>
              {isEditable && editing !== "skills-new" && (
                <button
                  onClick={() => setEditing("skills-new")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                  aria-label="Add new skill"
                >
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
              )}
            </div>

            {editing === "skills-new" && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter new skill"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addNewSkillOrLanguage("skills")}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditing(null);
                    setNewItemName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <ul className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded dark:bg-gray-700"
                >
                  {editing === `skill-${skill.id}` &&
                  editValue &&
                  typeof editValue === "object" &&
                  "type" in editValue &&
                  editValue.type === "skill" ? (
                    <>
                      <input
                        value={editValue.name}
                        onChange={(e) => handleObjectInputChange(e, "name")}
                        className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveSkillOrLanguageEdit("skills")}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        aria-label="Save skill"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditValue(null);
                        }}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      {isEditable && editing !== `skill-${skill.id}` && (
                        <>
                          <button
                            onClick={() =>
                              startEditSkillOrLanguage("skills", skill)
                            }
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Edit skill"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              deleteSkillOrLanguage("skills", skill.id)
                            }
                            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                            aria-label="Delete skill"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>

            {resumeData.skills.length === 0 && !isEditable && (
              <p className="text-gray-400 italic">No skills added yet</p>
            )}
          </div>

          {/* ---------------  LANGUAGES  --------------- */}
          <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-xl dark:text-white">
                Languages
              </h2>
              {isEditable && editing !== "languages-new" && (
                <button
                  onClick={() => setEditing("languages-new")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                  aria-label="Add new language"
                >
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
              )}
            </div>

            {editing === "languages-new" && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter new language"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addNewSkillOrLanguage("languages")}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditing(null);
                    setNewItemName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <ul className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang) => (
                <li
                  key={lang.id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded dark:bg-gray-700"
                >
                  {editing === `lang-${lang.id}` &&
                  editValue &&
                  typeof editValue === "object" &&
                  "type" in editValue &&
                  editValue.type === "language" ? (
                    <>
                      <input
                        value={editValue.name}
                        onChange={(e) => handleObjectInputChange(e, "name")}
                        className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveSkillOrLanguageEdit("languages")}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        aria-label="Save language"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditValue(null);
                        }}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                      {isEditable && editing !== `lang-${lang.id}` && (
                        <>
                          <button
                            onClick={() =>
                              startEditSkillOrLanguage("languages", lang)
                            }
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Edit language"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              deleteSkillOrLanguage("languages", lang.id)
                            }
                            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                            aria-label="Delete language"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>

            {resumeData.languages.length === 0 && !isEditable && (
              <p className="text-gray-400 italic dark:text-gray-500">
                No languages added yet
              </p>
            )}
          </div>

          {/* ---------------  EDUCATION  --------------- */}
          <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-xl dark:text-white">
                Education
              </h2>
              {isEditable && (
                <button
                  onClick={() => addNewItem("education")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                  aria-label="Add education"
                >
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
              )}
            </div>
            {resumeData.education.length === 0 && !isEditable && (
              <p className="text-gray-400 italic dark:text-gray-500">
                No education added yet
              </p>
            )}
            {resumeData.education.map((edu, i) => {
              if (
                isEditable &&
                editing !== `edu-${i}` &&
                !edu.school &&
                !edu.degree
              ) {
                return null;
              }

              return (
                <div
                  key={i}
                  className="relative mb-4 p-3 border border-gray-200 rounded dark:border-gray-700 dark:bg-gray-800"
                >
                  {isEditable && editing !== `edu-${i}` && (
                    <div className="top-2 right-2 absolute flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(`edu-${i}`);
                          setEditValue({
                            type: "education",
                            school: edu.school,
                            degree: edu.degree,
                            startDate: edu.startDate,
                            endDate: edu.endDate,
                            description: edu.description,
                          });
                        }}
                        className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => deleteItem("education", i)}
                        className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                      </button>
                    </div>
                  )}
                  {editing === `edu-${i}` &&
                  editValue &&
                  typeof editValue === "object" &&
                  "type" in editValue &&
                  editValue.type === "education" ? (
                    <div className="space-y-2">
                      <input
                        value={editValue.school}
                        onChange={(e) => handleObjectInputChange(e, "school")}
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="School/University"
                        autoFocus
                      />
                      <input
                        value={editValue.degree}
                        onChange={(e) => handleObjectInputChange(e, "degree")}
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Degree"
                      />
                      <div className="gap-2 grid grid-cols-2">
                        <input
                          value={editValue.startDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "startDate")
                          }
                          className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Start Date"
                        />
                        <input
                          value={editValue.endDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "endDate")
                          }
                          className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="End Date"
                        />
                      </div>
                      <textarea
                        value={editValue.description}
                        onChange={(e) =>
                          handleObjectInputChange(e, "description")
                        }
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveArrayItemEdit("education", i)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (!edu.school && !edu.degree) {
                              cancelAdd("education", i);
                            } else {
                              setEditing(null);
                              setEditValue(null);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {edu.school || edu.degree ? (
                        <div>
                          <p className="font-semibold dark:text-white">
                            {edu.school}
                          </p>
                          <p className="text-sm italic dark:text-gray-300">
                            {edu.degree}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.description && (
                            <p className="mt-1 text-sm dark:text-gray-300">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic dark:text-gray-500">
                          Click edit to fill in details
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* ---------------  EXPERIENCE  --------------- */}
          <div className="mb-6 pb-4 border-gray-300 border-b">
            {/* ---------------  CERTIFICATIONS  --------------- */}
            <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-xl dark:text-white">
                  Certifications
                </h2>
                {isEditable && editing !== "cert-new" && (
                  <button
                    onClick={() => setEditing("cert-new")}
                    className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                    aria-label="Add certification"
                  >
                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </button>
                )}
              </div>

              {editing === "cert-new" && (
                <div className="flex gap-2 mb-3">
                  <input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter Certification Name"
                    autoFocus
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={addNewCertification}
                  >
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(null);
                      setNewItemName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {resumeData.certifications.length === 0 && !isEditable && (
                <p className="text-gray-400 italic dark:text-gray-500">
                  No certifications added yet
                </p>
              )}

              {resumeData.certifications.map((cert, i) => (
                <div
                  key={cert.id}
                  className="relative mb-4 p-3 border border-gray-200 rounded dark:border-gray-700 dark:bg-gray-800"
                >
                  {isEditable && editing !== `cert-${i}` && (
                    <div className="top-2 right-2 absolute flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(`cert-${i}`);
                          setEditValue(cert);
                        }}
                        className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => deleteItem("certifications", i)}
                        className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                      </button>
                    </div>
                  )}
                  {editing === `cert-${i}` &&
                  editValue &&
                  typeof editValue === "object" &&
                  "type" in editValue &&
                  editValue.type === "certification" ? (
                    <div className="space-y-2">
                      <input
                        value={editValue.name}
                        onChange={(e) => handleObjectInputChange(e, "name")}
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Certification Name"
                        autoFocus
                      />
                      <input
                        value={editValue.issuer}
                        onChange={(e) => handleObjectInputChange(e, "issuer")}
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Issuer"
                      />
                      <input
                        value={editValue.issueDate}
                        onChange={(e) =>
                          handleObjectInputChange(e, "issueDate")
                        }
                        className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Issue Date (e.g., Dec 2023)"
                      />
                      {/* Add other optional fields here if needed for full edit */}
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveArrayItemEdit("certifications", i)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditing(null);
                            setEditValue(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold dark:text-white">
                        {cert.name}
                      </p>
                      <p className="text-sm italic dark:text-gray-300">
                        {cert.issuer}
                      </p>
                      {cert.issueDate && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Issued: {cert.issueDate}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ---------------  EXPERIENCE  --------------- */}
            <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-xl dark:text-white">
                  Experience
                </h2>
                {isEditable && (
                  <button
                    onClick={() => addNewItem("experience")}
                    className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                    aria-label="Add experience"
                  >
                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </button>
                )}
              </div>
              {resumeData.experience.length === 0 && !isEditable && (
                <p className="text-gray-400 italic dark:text-gray-500">
                  No experience added yet
                </p>
              )}
              {resumeData.experience.map((exp, i) => {
                if (
                  isEditable &&
                  editing !== `exp-${i}` &&
                  !exp.company &&
                  !exp.role
                ) {
                  return null;
                }

                return (
                  <div
                    key={i}
                    className="relative mb-4 p-3 border border-gray-200 rounded dark:border-gray-700 dark:bg-gray-800"
                  >
                    {isEditable && editing !== `exp-${i}` && (
                      <div className="top-2 right-2 absolute flex gap-2">
                        <button
                          onClick={() => {
                            setEditing(`exp-${i}`);
                            setEditValue({
                              type: "experience",
                              company: exp.company,
                              role: exp.role,
                              startDate: exp.startDate,
                              endDate: exp.endDate,
                              description: exp.description,
                            });
                          }}
                          className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => deleteItem("experience", i)}
                          className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                        </button>
                      </div>
                    )}
                    {editing === `exp-${i}` &&
                    editValue &&
                    typeof editValue === "object" &&
                    "type" in editValue &&
                    editValue.type === "experience" ? (
                      <div className="space-y-2">
                        <input
                          value={editValue.role}
                          onChange={(e) => handleObjectInputChange(e, "role")}
                          className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Job Title"
                          autoFocus
                        />
                        <input
                          value={editValue.company}
                          onChange={(e) =>
                            handleObjectInputChange(e, "company")
                          }
                          className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Company"
                        />
                        <div className="gap-2 grid grid-cols-2">
                          <input
                            value={editValue.startDate}
                            onChange={(e) =>
                              handleObjectInputChange(e, "startDate")
                            }
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Start Date"
                          />
                          <input
                            value={editValue.endDate}
                            onChange={(e) =>
                              handleObjectInputChange(e, "endDate")
                            }
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="End Date"
                          />
                        </div>
                        <textarea
                          value={editValue.description}
                          onChange={(e) =>
                            handleObjectInputChange(e, "description")
                          }
                          className="px-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          rows={3}
                          placeholder="Description (bullet points are best)"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => saveArrayItemEdit("experience", i)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (!exp.company && !exp.role) {
                                cancelAdd("experience", i);
                              } else {
                                setEditing(null);
                                setEditValue(null);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {exp.company || exp.role ? (
                          <div>
                            <p className="font-semibold dark:text-white">
                              {exp.role}
                            </p>
                            <p className="text-sm italic dark:text-gray-300">
                              {exp.company}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {exp.startDate} - {exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="mt-1 text-sm whitespace-pre-line dark:text-gray-300">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic dark:text-gray-500">
                            Click edit to fill in details
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---------------  PROJECTS  --------------- */}
            <div className="mb-6 pb-4 border-gray-300 border-b dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-xl dark:text-white">
                  Projects
                </h2>
                {isEditable && (
                  <button
                    onClick={() => addNewItem("projects")}
                    className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
                    aria-label="Add project"
                  >
                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </button>
                )}
              </div>
              {resumeData.projects.length === 0 && !isEditable && (
                <p className="text-gray-400 italic dark:text-gray-500">
                  No projects added yet
                </p>
              )}
              {resumeData.projects.map((proj, i) => {
                if (isEditable && editing !== `proj-${i}` && !proj.title) {
                  return null;
                }

                return (
                  <div
                    key={i}
                    className="relative mb-4 p-3 border border-gray-200 rounded dark:border-gray-700 dark:bg-gray-800"
                  >
                    {isEditable && editing !== `proj-${i}` && (
                      <div className="top-2 right-2 absolute flex gap-2">
                        <button
                          onClick={() => {
                            setEditing(`proj-${i}`);
                            setEditValue({
                              type: "project",
                              title: proj.title,
                              link: proj.link,
                              description: proj.description,
                            });
                          }}
                          className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => deleteItem("projects", i)}
                          className="hover:bg-gray-100 p-1 rounded transition-colors dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                        </button>
                      </div>
                    )}
                    {editing === `proj-${i}` &&
                    editValue &&
                    typeof editValue === "object" &&
                    "type" in editValue &&
                    editValue.type === "project" ? (
                      <div className="space-y-2">
                        <input
                          value={editValue.title}
                          onChange={(e) => handleObjectInputChange(e, "title")}
                          className="px-3 py-2 border rounded w-full font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Project Title"
                          autoFocus
                        />
                        <input
                          value={editValue.link}
                          onChange={(e) => handleObjectInputChange(e, "link")}
                          className="px-3 py-2 border rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Project Link (URL)"
                        />
                        <textarea
                          value={editValue.description}
                          onChange={(e) =>
                            handleObjectInputChange(e, "description")
                          }
                          className="px-3 py-2 border rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          rows={3}
                          placeholder="Description (e.g., Technologies used, outcome)"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => saveArrayItemEdit("projects", i)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (!proj.title) {
                                cancelAdd("projects", i);
                              } else {
                                setEditing(null);
                                setEditValue(null);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {proj.title ? (
                          <div>
                            <p className="font-semibold dark:text-white">
                              {proj.title}
                            </p>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {proj.link}
                              </a>
                            )}
                            {proj.description && (
                              <p className="mt-1 text-sm whitespace-pre-line dark:text-gray-300">
                                {proj.description}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic dark:text-gray-500">
                            Click edit to fill in details
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {renderSaveStatus()}
      </div>
    </>
  );
}
