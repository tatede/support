export async function POST(req: Request) {
  const { messages, ticketTopic, userName } = await req.json();

  const conversation = messages.map((m: { sender: string; message: string }) => ({
    role: m.sender === "agent" ? "assistant" : "user",
    content: m.message,
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SUPPORT_AI}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional and friendly support agent for Orcanomics, a financial literacy platform for K-8 students. 
You are responding to a support ticket from ${userName || "a user"} about: ${ticketTopic}.
Write a concise, helpful, professional reply. Do not use markdown. Keep it 1-3 sentences unless more detail is needed.`,
        },
        ...conversation,
      ],
      max_tokens: 300,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content ?? "";
  return Response.json({ reply });
}
