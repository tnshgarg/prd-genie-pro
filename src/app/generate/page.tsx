
import { PRDGeneratorForm } from '@/components/prd/prd-generator-form'

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate PRD with AI
          </h1>
          <p className="text-gray-600">
            Transform your product idea into a comprehensive Product Requirements Document
          </p>
        </div>
        
        <PRDGeneratorForm />
      </div>
    </div>
  )
}
