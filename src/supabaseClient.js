import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://areakxvmgkwdlrfwrdwd.supabase.co'
const supabaseKey = 'sb_publishable_pXjynpvpORNMqtrmRjoMDw_vjBOwaXo'

export const supabase = createClient(supabaseUrl, supabaseKey)
