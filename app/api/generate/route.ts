import { NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/gemini";
import { coverLetterPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const prompt = coverLetterPrompt(data);
    const letter = await generateCoverLetter(prompt);
    return NextResponse.json({ letter });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
