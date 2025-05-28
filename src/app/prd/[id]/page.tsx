
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PRD } from '@/types'
import { PRDViewer } from '@/components/prd/prd-viewer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, LogOut } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function PRDPage({ params }: { params: { id: string } }) {
  const [prd, setPrd] = useState<PRD | null>(null)
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
      fetchPRD()
    }

    checkAuth()
  }, [router, params.id])

  const fetchPRD = async () => {
    try {
      const response = await fetch(`/api/prds/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to fetch PRD')
      }
      
      const data = await response.json()
      setPrd(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load PRD',
        variant: 'destructive',
      })
      router.push('/dashboard')
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
          <p>Loading PRD...</p>
        </div>
      </div>
    )
  }

  if (!prd) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PRD Not Found</h1>
          <p className="text-gray-600 mb-4">The PRD you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-medium">PRD Generator</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user?.email}
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
        <PRDViewer prd={prd} />
      </main>
    </div>
  )
}
