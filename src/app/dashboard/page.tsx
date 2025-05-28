
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PRD } from '@/types'
import { Button } from '@/components/ui/button'
import { PRDGrid } from '@/components/dashboard/prd-grid'
import { Plus, FileText, LogOut } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const [prds, setPrds] = useState<PRD[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      fetchPRDs()
    }

    checkAuth()
  }, [router])

  const fetchPRDs = async () => {
    try {
      const response = await fetch('/api/prds')
      
      if (!response.ok) {
        throw new Error('Failed to fetch PRDs')
      }
      
      const data = await response.json()
      setPrds(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load PRDs',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p>Loading your PRDs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">PRD Generator</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your PRDs
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your Product Requirements Documents
            </p>
          </div>
          
          <Button asChild>
            <Link href="/generate">
              <Plus className="h-4 w-4 mr-2" />
              Generate New PRD
            </Link>
          </Button>
        </div>

        <PRDGrid prds={prds} />
      </main>
    </div>
  )
}
