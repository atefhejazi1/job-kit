// src/app/api/resume/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Received data:", data);


        // TODO: Replace with actual userId from authentication system
        // const userId = "replace-with-actual-user-id";

        // حفظ البيانات في قاعدة البيانات
        const resume = await prisma.resume.create({
            data: {
                ...data,
                // تأكد أن Prisma متوقع JSON أو String
                education: data.education,
                experience: data.experience,
                projects: data.projects,
            },
        });
        console.log("resume"  , resume);
        

        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/resume:", error);
        return NextResponse.json(
            { message: "Error saving resume to database." },
            { status: 500 }
        );
    }
}
