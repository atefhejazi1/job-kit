export const coverLetterPrompt = (data: any) => `

Generate a professional cover letter based on the user's resume below.

====================
USER RESUME DATA
====================
Name: ${data.resumeData.name}
Email: ${data.resumeData.email}
Phone: ${data.resumeData.phone}

Summary:
${data.resumeData.summary || "None"}

Skills:
${data.resumeData.skills?.join(", ")}

Experience:
${data.resumeData.experience
        ?.map(
            (exp: any) =>
                `- ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
        )
        .join("\n")}

Projects:
${data.resumeData.projects
        ?.map((p: any) => `- ${p.title}: ${p.description}`)
        .join("\n")}

Education:
${data.resumeData.education
        ?.map((e: any) => `- ${e.degree} at ${e.school}`)
        .join("\n")}

====================
JOB DETAILS
====================
Company Name: ${data.company}
Position: ${data.position}

====================
INSTRUCTIONS
====================
- Write a clear, professional, and personalized cover letter.
- Highlight the user's strengths and experience relevant to the job.
- Do NOT repeat resume lines directly — rewrite them smartly.
- Max 3 paragraphs + closing.
- Output only the final formatted letter.

`;
