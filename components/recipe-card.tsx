import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, Utensils, Users } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RecipeType } from "@/lib/types"

interface RecipeCardProps {
  recipe: RecipeType
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(recipe.image || null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Only try to generate an image if we have a placeholder
    if (recipe.image === "/placeholder.svg" && !isLoadingImage && !imageError) {
      const generateImage = async () => {
        setIsLoadingImage(true)
        try {
          const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipeName: recipe.name,
              description: recipe.description,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to generate image")
          }

          const data = await response.json()
          if (data.imageUrl) {
            setImageUrl(data.imageUrl)
          }
        } catch (error) {
          console.error("Error generating image:", error)
          setImageError(true)
        } finally {
          setIsLoadingImage(false)
        }
      }

      generateImage()
    }
  }, [recipe, isLoadingImage, imageError])

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.name}
            fill
            className="object-cover"
            unoptimized={imageUrl.startsWith('https://')}
          />
        ) : isLoadingImage ? (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="animate-pulse flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-primary mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm text-muted-foreground">Generating image...</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <span className="text-muted-foreground">Recipe Image</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{recipe.name}</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {recipe.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime} prep</span>
              </div>
            )}
            {recipe.cookTime && (
              <div className="flex items-center gap-1">
                <Utensils className="h-4 w-4" />
                <span>{recipe.cookTime} cook</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Ingredients</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-muted-foreground">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {recipe.nutritionalInfo && (
          <div>
            <h3 className="font-medium mb-2">Nutritional Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="bg-muted rounded-md p-2 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipe.tips && recipe.tips.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="text-muted-foreground">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

