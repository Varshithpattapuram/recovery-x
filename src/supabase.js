import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uyoqhxizledylmnginld.supabase.co";

const supabaseKey =
  "sb_publishable_j3QpEYfCl2FbxxAcgqMkpw_vWIOK4ey";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);