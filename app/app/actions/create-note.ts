"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type CreateNotePayload = {
  title: string;
  content?: string;
};

export const createNote = async ({ title, content }: CreateNotePayload) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // todo: validate title and content

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.id });

  if (error) throw new Error(`Error creating a note: ${error.message}`);

  revalidatePath("/");
  return data;
};
