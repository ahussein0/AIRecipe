export interface RecipeType {
  name: string
  description: string
  ingredients: (string | { ingredient: string; amount: string })[]
  instructions: string[]
  prepTime?: string
  cookTime?: string
  servings?: string
  tags: string[]
  image?: string
  nutritionalInfo?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
    [key: string]: string | undefined
  }
  tips?: string[]
  id?: string
}

