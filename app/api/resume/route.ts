// src/app/api/resume/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // جلب البيانات من الطلب
        const data = await req.json();
        console.log("Received data:", data);

        // التحقق من وجود userId
        if (!data.userId) {
            return NextResponse.json(
                { message: "User ID is required to save resume." },
                { status: 400 }
            );
        }

        // حفظ البيانات في قاعدة البيانات
        const resume = await prisma.resume.create({
            data: {
                userId: data.userId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                summary: data.summary,
                skills: data.skills,
                languages: data.languages,
                education: data.education,
                experience: data.experience,
                projects: data.projects,
            },
        });

        console.log("Saved resume:", resume);

        // إعادة البيانات كـ JSON
        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/resume:", error);
        return NextResponse.json(
            { message: "Error saving resume to database.", error: String(error) },
            { status: 500 }
        );
    }
}
