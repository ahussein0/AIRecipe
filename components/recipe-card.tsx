import Image from "next/image"
import { Clock, Utensils, Users } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RecipeType } from "@/lib/types"

interface RecipeCardProps {
  recipe: RecipeType
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            unoptimized={recipe.image.startsWith('https://')}
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

