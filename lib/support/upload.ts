import { supabase } from "@/lib/supabase";

export async function uploadSupportAttachment(
  file: File,
  ticketId: string,
) {

  const path =
    `${ticketId}/${Date.now()}-${file.name}`;

  const { error } =
    await supabase.storage
      .from("support")
      .upload(path, file);

  if (error) {
    throw error;
  }

  return supabase.storage
    .from("support")
    .getPublicUrl(path);

}
