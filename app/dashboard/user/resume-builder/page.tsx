"use client";

import { useState } from "react";
import ResumeForm from "../../../../components/dashboard/resumeForm/ResumeForm";
import ResumePreview from "../../../../components/dashboard/ResumePreview";
import { ResumeData } from "@/types/resume.data.types";

export default function ResumeBuilderPage() {
    const [data, setData] = useState<ResumeData>({
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

    return (
        <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
                <ResumeForm data={data} setData={setData} />
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow overflow-y-auto">
                <ResumePreview data={data} />
            </div>
        </div>
    );
}
