export async function generateCoverLetterHF(prompt: string) {
  try {
    const res = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-72B-Instruct",
          messages: [
            {
              role: "system",
              content: "You are a professional cover letter writer. Write clear, concise, and persuasive cover letters."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      }
    );

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text.substring(0, 300));

    if (!res.ok) {
      console.error("API Error:", text);
      
      try {
        const errorData = JSON.parse(text);
        if (errorData.error) {
          return `Error: ${errorData.error}`;
        }
      } catch {}
      
      return `Error: API returned ${res.status}`;
    }

    try {
      const data = JSON.parse(text);
      
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }

      console.error("Unexpected format:", JSON.stringify(data).substring(0, 200));
      return "Error: Unexpected response format";
      
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return `Error: Could not parse response - ${text.substring(0, 100)}`;
    }
    
  } catch (err: any) {
    console.error("Network error:", err);
    return `Error: ${err.message || "Network request failed"}`;
  }
}