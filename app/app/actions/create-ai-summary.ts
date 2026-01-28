"use server";
import OpenAI from "openai";
import { getNotes } from "@/app/data/get-notes";

export const createAISummary = async () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not configured");
  }

  const { notes, error } = await getNotes();

  if (error) {
    throw new Error(`Error fetching notes: ${error.message}`);
  }

  if (!notes || notes.length === 0) {
    return "You don't have any notes yet. Create some notes first to get a summary!";
  }

  const openai = new OpenAI({ apiKey });

  const notesContent = notes
    .map(
      (note) =>
        `Title: ${note.title}\nContent: ${note.content || "No content"}`,
    )
    .join("\n\n---\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes notes. Provide a clear, concise, and human-readable summary of the user's notes. Highlight key themes, important points, and any actionable items. Keep the summary organized and easy to read.",
      },
      {
        role: "user",
        content: `Please provide a summary of my ${notes.length} note(s):\n\n${notesContent}`,
      },
    ],
    max_tokens: 1000,
  });

  const summary = response.choices[0]?.message?.content;

  if (!summary) {
    throw new Error("Failed to generate summary from OpenAI");
  }

  return summary;
};
