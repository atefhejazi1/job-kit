"use client";

import { useRouter } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";

export function DeleteCVButton() {
  const router = useRouter();
  const { setResumeData } = useResume();

  const handleDelete = async () => {
    if (!confirm(" Permanent delete? This cannot be undone.")) return;

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("User not logged in");
      return;
    }

    const userObj = JSON.parse(userData);
    const userId = userObj.id;

    try {
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
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert(" Error deleting resume");
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
      Delete Resume
    </button>
  );
}