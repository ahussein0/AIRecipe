import { useState } from "react"
import Image from "next/image"
import { Clock, Utensils, Users, Share2 } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RecipeType } from "@/lib/types"

interface RecipeCardProps {
  recipe: RecipeType
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false)

  // Handle image loading error
  const handleImageError = () => {
    console.error("Error loading image")
    setImageError(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: `Check out this recipe: ${recipe.name}\n\n${recipe.description}`,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      console.warn('Web Share API not supported in this browser.');
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {recipe.image && !imageError ? (
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            unoptimized={recipe.image.startsWith('https://')}
            onError={handleImageError}
          />
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
            <button onClick={handleShare} className="flex items-center gap-1">
              <Share2 className="w-4 h-4" /> Share
            </button>
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
            {recipe.ingredients.map((ingredient, index) => {
              let displayText = '';
              
              if (typeof ingredient === 'string') {
                // Clean up duplicated measurements in various formats
                displayText = ingredient
                  // Handle exact duplicates like "1 lb 1 lb ground beef"
                  .replace(/(\d+\s*[a-zA-Z]+)\s+\1/, '$1')
                  // Handle cases with same number but different unit formats like "2 tbsp 2 tablespoons"
                  .replace(/(\d+)\s+(tsp|tbsp|cup|can|oz|lb|teaspoon|tablespoon)\s+\1\s+(tsp|tbsp|cup|can|oz|lb|teaspoon|tablespoon)/i, '$1 $2')
                  // Handle cases with same measurement in different formats
                  .replace(/(\d+)\s+(tsp|teaspoon)\s+(\d+)\s+(tsp|teaspoon)/i, '$1 $2')
                  .replace(/(\d+)\s+(tbsp|tablespoon)\s+(\d+)\s+(tbsp|tablespoon)/i, '$1 $2')
                  .replace(/(\d+)\s+(oz|ounce)\s+(\d+)\s+(oz|ounce)/i, '$1 $2')
                  .replace(/(\d+)\s+(lb|pound)\s+(\d+)\s+(lb|pound)/i, '$1 $2')
                  .replace(/(\d+)\s+(cup)\s+(\d+)\s+(cup)/i, '$1 $2')
                  .replace(/(\d+)\s+(can)\s+(\d+)\s+(can)/i, '$1 $2');
              } else if (ingredient && typeof ingredient === 'object') {
                const amount = ingredient.amount || '';
                const name = ingredient.ingredient || '';
                
                if (amount && name) {
                  displayText = `${amount} ${name}`;
                } else {
                  displayText = name || amount || JSON.stringify(ingredient).replace(/[{}"]/g, '');
                }
              }
              
              return (
                <li key={index} className="text-muted-foreground">
                  {displayText}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.instructions.map((step, index) => {
              // Remove any existing numbering to prevent duplicates
              const cleanStep = step.replace(/^\s*\d+\.\s*|\s*\d+\)\s*|Step\s+\d+:\s*/i, '');
              return (
                <li key={index} className="text-muted-foreground">
                  {cleanStep}
                </li>
              );
            })}
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

