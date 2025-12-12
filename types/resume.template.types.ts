export type TemplateType = "modern" | "classic" | "minimal" | "creative";

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
};
