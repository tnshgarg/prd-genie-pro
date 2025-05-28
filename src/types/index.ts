
export interface PRD {
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

export interface User {
  id: string
  email: string
  created_at: string
}

export const PRODUCT_CATEGORIES = [
  'Web Application',
  'Mobile App',
  'SaaS Platform',
  'E-commerce',
  'AI/ML Product',
  'Developer Tool',
  'Consumer App',
  'Enterprise Software',
  'API/Service',
  'Other'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]
