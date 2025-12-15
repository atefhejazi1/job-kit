export type TemplateType = "modern" | "classic" | "minimal" | "creative"|"executive"|
"technical"|"simple"|"professional";

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  thumbnail: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  features: string[];
}

export const TEMPLATES: Record<TemplateType, TemplateConfig> = {
  modern: {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design with accent colors",
    thumbnail: "/templates/modern.svg",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#f59e0b",
      text: "#1e293b",
      background: "#ffffff",
    },
    features: ["Two-column layout", "Icon highlights", "Progress bars for skills"],
  },
  classic: {
    id: "classic",
    name: "Classic Elegance",
    description: "Traditional and timeless resume format",
    thumbnail: "/templates/classic.svg",
    colors: {
      primary: "#1e293b", // slate-800
      secondary: "#64748b", // slate-500
      accent: "#0f172a", // slate-900
      text: "#334155", // slate-700
      background: "#ffffff",
    },
    features: ["Single-column layout", "Traditional sections", "Serif typography"],
  },
  minimal: {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and focused design with maximum readability",
    thumbnail: "/templates/minimal.svg",
    colors: {
      primary: "#171717", // neutral-900
      secondary: "#737373", // neutral-500
      accent: "#404040", // neutral-700
      text: "#262626", // neutral-800
      background: "#ffffff",
    },
    features: ["Ultra-clean layout", "Plenty of whitespace", "Sans-serif typography"],
  },
  creative: {
    id: "creative",
    name: "Creative Bold",
    description: "Eye-catching design for creative professionals",
    thumbnail: "/templates/creative.svg",
    colors: {
      primary: "#7c3aed",
      secondary: "#ec4899", 
      accent: "#06b6d4",
      text: "#1e1b4b",
      background: "#fefce8",
    },
    features: ["Bold colors", "Unique layout", "Creative sections"],
  },

  executive: {
    id: "executive",
    name: "Executive Formal",
    description: "High-level, structured, and formal design.",
    thumbnail: "/templates/executive.svg",
    colors: { primary: "#0f172a", secondary: "#475569", accent: "#ef4444", text: "#1e293b", background: "#f8fafc" },
    features: ["Formal header", "Single-column structure", "Detailed experience focus"],
  },
  technical: {
    id: "technical",
    name: "Technical/Engineering",
    description: "Focus on hard skills and project details.",
    thumbnail: "/templates/technical.svg",
    colors: { primary: "#0284c7", secondary: "#1e293b", accent: "#a3e635", text: "#0f172a", background: "#f0f9ff" },
    features: ["Skills section emphasis", "Project summaries", "Code-like typography"],
  },
  simple: {
    id: "simple",
    name: "Simple Default",
    description: "Bare-bones structure for quick editing.",
    thumbnail: "/templates/simple.svg",
    colors: { primary: "#3f3f46", secondary: "#71717a", accent: "#fbbf24", text: "#18181b", background: "#ffffff" },
    features: ["Clean text-based design", "No complex formatting", "Highly ATS compliant"],
  },
  professional: {
    id: "professional",
    name: "Standard Professional",
    description: "Balanced design, widely accepted for most fields.",
    thumbnail: "/templates/professional.svg",
    colors: { primary: "#166534", secondary: "#4b5563", accent: "#f97316", text: "#1f2937", background: "#f9fafb" },
    features: ["Clear section headers", "Good use of bullet points", "Standard font choices"],
  },
};
