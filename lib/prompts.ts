export const coverLetterPrompt = (data: any) => `[INST] You are a professional cover letter writer. Write a compelling cover letter based on the following information.

CANDIDATE INFORMATION:
Name: ${data.resumeData.name}
Email: ${data.resumeData.email}
Phone: ${data.resumeData.phone}

Professional Summary:
${data.resumeData.summary || "Experienced professional"}

Key Skills:
${data.resumeData.skills?.join(", ") || "Various professional skills"}

Work Experience:
${data.resumeData.experience
    ?.map(
      (exp: any) =>
        `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}`
    )
    .join("\n\n") || "No experience listed"}

Notable Projects:
${data.resumeData.projects
    ?.map((p: any) => `${p.title}: ${p.description}`)
    .join("\n") || "No projects listed"}

Education:
${data.resumeData.education
    ?.map((e: any) => `${e.degree} from ${e.school}`)
    .join("\n") || "No education listed"}

TARGET POSITION:
Company: ${data.company}
Position: ${data.position}

INSTRUCTIONS:
Write a professional cover letter that:
1. Opens with enthusiasm for the ${data.position} position at ${data.company}
2. Highlights 2-3 most relevant skills and experiences
3. Explains why the candidate is a good fit
4. Closes with a call to action

Keep it concise (3-4 paragraphs). Use professional but warm tone.

Write the cover letter now: [/INST]

Dear Hiring Manager,`;