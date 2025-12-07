
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
    (section: "education" | "experience" | "projects", index: number) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;

      const updates: Partial<ResumeData> = {
        [section]: resumeData[section].filter((_, i) => i !== index),
      };

      saveToServer(updates);
    const sectionName = section === 'projects' ? 'Project' : section.charAt(0).toUpperCase() + section.slice(1);
    toast.success(`${sectionName} deleted`);
    },
    [resumeData, saveToServer]
  );

  const addNewItem = useCallback(
    (section: "education" | "experience" | "projects") => {
      const newIndex = resumeData[section].length;
      const editField = `${
        section === "education"
          ? "edu"
          : section === "experience"
          ? "exp"
          : "proj"
      }-${newIndex}` as EditingField;

      let emptyItem: EducationItem | ExperienceItem | ProjectItem;

      if (section === "education") {
        emptyItem = {
          type: "education",
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        };
      } else if (section === "experience") {
        emptyItem = {
          type: "experience",
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        };
      } else {
        emptyItem = { type: "project", title: "", link: "", description: "" };
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
    (section: "education" | "experience" | "projects", index: number) => {
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
    (section: "education" | "experience" | "projects", index: number) => {
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
      }

      saveToServer({ [section]: currentArray } as Partial<ResumeData>);
      setEditing(null);
      setEditValue(null);
     const sectionName = section === 'projects' ? 'Project' : section.charAt(0).toUpperCase() + section.slice(1);
    toast.success(`${sectionName} saved`);
    },
    [editValue, resumeData, saveToServer]
  );

  const renderSaveStatus = () => {
    if (!autoSave || !isEditable || saveStatus === "idle") return null;

    return (
      <div className="right-4 bottom-4 fixed flex items-center gap-2 bg-white shadow-lg px-4 py-2 border rounded-lg">
        {saveStatus === "saving" && (
          <>
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-gray-600 text-sm">Saving...</span>
          </>
        )}
        {saveStatus === "saved" && (
          <>
            <Save className="w-4 h-4 text-green-600" />
            <span className="text-green-600 text-sm">Saved</span>
          </>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 text-sm">Save failed</span>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`max-w-3xl mx-auto p-6 bg-white text-gray-900 shadow-md rounded-md ${className}`}
      >
        <div id="resume-preview">
          <div className="flex justify-between items-start mb-6 pb-4 border-gray-300 border-b">
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
                    className="px-3 py-2 border rounded w-full"
                    placeholder="Full Name"
                    autoFocus
                  />
                  <input
                    value={editValue.email}
                    onChange={(e) => handleObjectInputChange(e, "email")}
                    className="px-3 py-2 border rounded w-full"
                    placeholder="Email"
                  />
                  <input
                    value={editValue.phone}
                    onChange={(e) => handleObjectInputChange(e, "phone")}
                    className="px-3 py-2 border rounded w-full"
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
                  <h1 className="font-bold text-3xl">
                    {resumeData.name || "Your Name"}
                  </h1>
                  <p className="mt-2 text-gray-700 text-sm">
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
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                aria-label="Edit personal info"
              >
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </div>

          {(resumeData.summary || isEditable) && (
            <div className="mb-6 pb-4 border-gray-300 border-b">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-xl">Summary</h2>
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
                        className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        aria-label="Edit summary"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </>
                )}
              </div>
              {editing === "summary" ? (
                <textarea
                  value={editValue as string}
                  onChange={handleSimpleInputChange}
                  className="p-2 border rounded w-full"
                  rows={3}
                  placeholder="Professional summary..."
                  autoFocus
                />
              ) : (
                <p className="text-gray-700">
                  {resumeData.summary || "Click edit to add summary"}
                </p>
              )}
            </div>
          )}

          <div className="mb-6 pb-4 border-gray-300 border-b">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-xl">Skills</h2>
              {isEditable && editing !== "skills-new" && (
                <button
                  onClick={() => setEditing("skills-new")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Add new skill"
                >
                  <Plus className="w-5 h-5 text-green-600" />
                </button>
              )}
            </div>

            {editing === "skills-new" && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
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
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
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
                        className="px-2 py-1 border rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveSkillOrLanguageEdit("skills")}
                        className="text-green-600 hover:text-green-700"
                        aria-label="Save skill"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditValue(null);
                        }}
                        className="text-gray-600 hover:text-gray-700"
                        aria-label="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700">{skill.name}</span>
                      {isEditable && editing !== `skill-${skill.id}` && (
                        <>
                          <button
                            onClick={() =>
                              startEditSkillOrLanguage("skills", skill)
                            }
                            className="text-blue-600 hover:text-blue-700"
                            aria-label="Edit skill"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              deleteSkillOrLanguage("skills", skill.id)
                            }
                            className="text-red-600 hover:text-red-700"
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

          <div className="mb-6 pb-4 border-gray-300 border-b">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-xl">Languages</h2>
              {isEditable && editing !== "languages-new" && (
                <button
                  onClick={() => setEditing("languages-new")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Add new language"
                >
                  <Plus className="w-5 h-5 text-green-600" />
                </button>
              )}
            </div>

            {editing === "languages-new" && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
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
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
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
                        className="px-2 py-1 border rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveSkillOrLanguageEdit("languages")}
                        className="text-green-600 hover:text-green-700"
                        aria-label="Save language"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditValue(null);
                        }}
                        className="text-gray-600 hover:text-gray-700"
                        aria-label="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700">{lang.name}</span>
                      {isEditable && editing !== `lang-${lang.id}` && (
                        <>
                          <button
                            onClick={() =>
                              startEditSkillOrLanguage("languages", lang)
                            }
                            className="text-blue-600 hover:text-blue-700"
                            aria-label="Edit language"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              deleteSkillOrLanguage("languages", lang.id)
                            }
                            className="text-red-600 hover:text-red-700"
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
              <p className="text-gray-400 italic">No languages added yet</p>
            )}
          </div>

          <div className="mb-6 pb-4 border-gray-300 border-b">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-xl">Education</h2>
              {isEditable && (
                <button
                  onClick={() => addNewItem("education")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Add education"
                >
                  <Plus className="w-5 h-5 text-green-600" />
                </button>
              )}
            </div>
            {resumeData.education.length === 0 && !isEditable && (
              <p className="text-gray-400 italic">No education added yet</p>
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
                  className="relative mb-4 p-3 border border-gray-200 rounded"
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
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteItem("education", i)}
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
                        className="px-3 py-2 border rounded w-full"
                        placeholder="School/University"
                        autoFocus
                      />
                      <input
                        value={editValue.degree}
                        onChange={(e) => handleObjectInputChange(e, "degree")}
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Degree"
                      />
                      <div className="gap-2 grid grid-cols-2">
                        <input
                          value={editValue.startDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "startDate")
                          }
                          className="px-3 py-2 border rounded"
                          placeholder="Start Date"
                        />
                        <input
                          value={editValue.endDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "endDate")
                          }
                          className="px-3 py-2 border rounded"
                          placeholder="End Date"
                        />
                      </div>
                      <textarea
                        value={editValue.description}
                        onChange={(e) =>
                          handleObjectInputChange(e, "description")
                        }
                        className="px-3 py-2 border rounded w-full"
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
                        <>
                          <p className="font-semibold">
                            {edu.school} {edu.degree && `— ${edu.degree}`}
                          </p>
                          {(edu.startDate || edu.endDate) && (
                            <p className="text-gray-600 text-sm">
                              {edu.startDate}{" "}
                              {edu.endDate && `- ${edu.endDate}`}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-gray-700">{edu.description}</p>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-6 pb-4 border-gray-300 border-b">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-xl">Experience</h2>
              {isEditable && (
                <button
                  onClick={() => addNewItem("experience")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Add experience"
                >
                  <Plus className="w-5 h-5 text-green-600" />
                </button>
              )}
            </div>
            {resumeData.experience.length === 0 && !isEditable && (
              <p className="text-gray-400 italic">No experience added yet</p>
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
                  className="relative mb-4 p-3 border border-gray-200 rounded"
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
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteItem("experience", i)}
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
                        value={editValue.company}
                        onChange={(e) => handleObjectInputChange(e, "company")}
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Company"
                        autoFocus
                      />
                      <input
                        value={editValue.role}
                        onChange={(e) => handleObjectInputChange(e, "role")}
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Role"
                      />
                      <div className="gap-2 grid grid-cols-2">
                        <input
                          value={editValue.startDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "startDate")
                          }
                          className="px-3 py-2 border rounded"
                          placeholder="Start Date"
                        />
                        <input
                          value={editValue.endDate}
                          onChange={(e) =>
                            handleObjectInputChange(e, "endDate")
                          }
                          className="px-3 py-2 border rounded"
                          placeholder="End Date"
                        />
                      </div>
                      <textarea
                        value={editValue.description}
                        onChange={(e) =>
                          handleObjectInputChange(e, "description")
                        }
                        className="px-3 py-2 border rounded w-full"
                        rows={2}
                        placeholder="Description"
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
                        <>
                          <p className="font-semibold">
                            {exp.company} {exp.role && `— ${exp.role}`}
                          </p>
                          {(exp.startDate || exp.endDate) && (
                            <p className="text-gray-600 text-sm">
                              {exp.startDate}{" "}
                              {exp.endDate && `- ${exp.endDate}`}
                            </p>
                          )}
                          {exp.description && (
                            <p className="text-gray-700">{exp.description}</p>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-xl">Projects</h2>
              {isEditable && (
                <button
                  onClick={() => addNewItem("projects")}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Add project"
                >
                  <Plus className="w-5 h-5 text-green-600" />
                </button>
              )}
            </div>
            {resumeData.projects.length === 0 && !isEditable && (
              <p className="text-gray-400 italic">No projects added yet</p>
            )}
            {resumeData.projects.map((proj, i) => {
              if (isEditable && editing !== `proj-${i}` && !proj.title) {
                return null;
              }

              return (
                <div
                  key={i}
                  className="relative mb-4 p-3 border border-gray-200 rounded"
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
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteItem("projects", i)}
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Project Title"
                        autoFocus
                      />
                      <input
                        value={editValue.link}
                        onChange={(e) => handleObjectInputChange(e, "link")}
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Link (optional)"
                      />
                      <textarea
                        value={editValue.description}
                        onChange={(e) =>
                          handleObjectInputChange(e, "description")
                        }
                        className="px-3 py-2 border rounded w-full"
                        rows={2}
                        placeholder="Description"
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
                        <>
                          <p className="font-semibold">{proj.title}</p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              className="text-blue-600 text-sm underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {proj.link}
                            </a>
                          )}
                          {proj.description && (
                            <p className="mt-1 text-gray-700">
                              {proj.description}
                            </p>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {renderSaveStatus()}
    </>
  );
}
