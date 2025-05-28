import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PRD } from '@/types'

export function usePRDs() {
  const [prds, setPrds] = useState<PRD[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPRDs() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        if (!user) throw new Error('You must be logged in to view PRDs')

        const { data, error: fetchError } = await supabase
          .from('prds')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setPrds(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch PRDs'))
      } finally {
        setLoading(false)
      }
    }

    fetchPRDs()
  }, [])

  return { prds, loading, error }
} 