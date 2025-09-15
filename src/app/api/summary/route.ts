import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize this job posting in 2-3 sentences, make it concise: ${text}`
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
