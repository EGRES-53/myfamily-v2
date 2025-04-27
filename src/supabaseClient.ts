import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aannojzbaxhrwfzopwxw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbm5vanpiYXhocndmem9wd3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTQ2NTQsImV4cCI6MjA2MDg3MDY1NH0.2HR-M6K6i_m1KxHD6gthdzxUctJHKIWVh6zere1bkvI";

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;