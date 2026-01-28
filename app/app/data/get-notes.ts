"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const getNotes = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, user_id, title, content, created_at, updated_at");

  return { notes, error };
};
