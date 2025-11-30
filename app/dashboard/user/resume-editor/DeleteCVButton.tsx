"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";
import { Trash2 } from "lucide-react";

export default function DeleteCVButton() {
  const router = useRouter();
  const { setResumeData } = useResume();

  const handleDelete = async () => {
    if (!confirm(" Permanent delete? This cannot be undone.")) return;

    const userData = localStorage.getItem("user");
   if (!userData) {
  toast.error(" User not logged in!"); 
  return;
}

    const userObj = JSON.parse(userData);
    const userId = userObj.id;

    try {
       const loadingToast = toast.loading(" Deleting resume..."); 
      const res = await fetch("/api/resume", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Reset resume data in context
      setResumeData({
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

      router.push("/dashboard/user");
router.refresh();
toast.success(" Resume deleted successfully!"); 
toast.dismiss(loadingToast);
  } catch (err) {
  console.error("Error deleting resume:", err);
  toast.error(" Error deleting resume!"); 
}
  };

  return (
    <button 
      onClick={handleDelete} 
      className="flex items-center gap-2 bg-error hover:bg-red-700 shadow-sm hover:shadow-md px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
    >
      <Trash2 className="w-4 h-4" />
      Delete Resume
    </button>
  );
}