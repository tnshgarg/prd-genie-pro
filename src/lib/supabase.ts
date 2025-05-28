
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      prds: {
        Row: {
          id: string
          user_id: string
          title: string
          original_idea: string
          generated_prd: string
          category: string | null
          status: 'draft' | 'final' | 'archived'
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          original_idea: string
          generated_prd: string
          category?: string
          status?: 'draft' | 'final' | 'archived'
          is_favorite?: boolean
        }
        Update: {
          title?: string
          generated_prd?: string
          category?: string
          status?: 'draft' | 'final' | 'archived'
          is_favorite?: boolean
        }
      }
    }
  }
}
