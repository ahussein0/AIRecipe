"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import type { RecipeType } from "@/lib/types"

const RecipePage = () => {
  const router = useRouter()
  const { id } = router.query

  const [recipe, setRecipe] = useState<RecipeType | null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/recipes/${id}`)
        .then((response) => response.json())
        .then((data) => setRecipe(data.recipe))
        .catch((error) => console.error('Error fetching recipe:', error))
    }
  }, [id])

  if (!recipe) return <div>Loading...</div>

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      {/* Render other recipe details here */}
    </div>
  )
}

export default RecipePage; 