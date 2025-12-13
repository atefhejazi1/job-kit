export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generateCoverLetterHF } from "@/lib/huggingface";
import { coverLetterPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.company || !data.position) {
      return NextResponse.json(
        { error: "Company and position are required" },
        { status: 400 }
      );
    }

    if (!data.resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    const prompt = coverLetterPrompt(data);
    const letter = await generateCoverLetterHF(prompt);

    if (letter.startsWith("Error:")) {
      return NextResponse.json({ error: letter }, { status: 500 });
    }

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
