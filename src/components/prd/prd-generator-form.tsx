
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { prdGenerationSchema, PRDGenerationData } from '@/lib/validations'
import { PRODUCT_CATEGORIES } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/hooks/use-toast'
import { Lightbulb, Rocket, Users } from 'lucide-react'

export function PRDGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PRDGenerationData>({
    resolver: zodResolver(prdGenerationSchema),
  })

  const category = watch('category')

  const onSubmit = async (data: PRDGenerationData) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/prds/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate PRD')
      }
      
      const result = await response.json()
      
      toast({
        title: 'PRD Generated!',
        description: 'Your Product Requirements Document has been created successfully.',
      })
      
      router.push(`/prd/${result.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PRD. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Spinner size="lg" />
            <h3 className="text-lg font-semibold">Generating Your PRD</h3>
            <p className="text-gray-600 text-center">
              Our AI is analyzing your idea and creating a comprehensive Product Requirements Document. 
              This usually takes 30-60 seconds.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-4 w-4" />
                <span>Analyzing idea</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Defining users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Rocket className="h-4 w-4" />
                <span>Planning features</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate PRD</CardTitle>
        <CardDescription>
          Transform your product idea into a comprehensive Product Requirements Document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea">Product Idea *</Label>
            <Textarea
              id="idea"
              placeholder="Describe your product idea in detail. What problem does it solve? Who is it for? What makes it unique?"
              className="min-h-[120px]"
              {...register('idea')}
            />
            {errors.idea && (
              <p className="text-sm text-red-600">{errors.idea.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Product Category *</Label>
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small business owners, Students, Developers"
              {...register('targetAudience')}
            />
            {errors.targetAudience && (
              <p className="text-sm text-red-600">{errors.targetAudience.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Generate PRD with AI
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
