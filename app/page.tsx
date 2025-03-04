"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RecipeCard } from "@/components/recipe-card"
import { ChefHatLoading } from "@/components/chef-hat-loading"
import { KitchenLoadingSpinner } from "@/components/kitchen-loading-spinner"
import type { RecipeType } from "@/lib/types"

const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: "Please enter at least one ingredient.",
  }),
  dietaryPreference: z.string().optional(),
  cuisineType: z.string().optional(),
  mealType: z.string().optional(),
  quickMeal: z.boolean().default(false),
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [recipe, setRecipe] = useState<RecipeType | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      dietaryPreference: "",
      cuisineType: "",
      mealType: "",
      quickMeal: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recipe")
      }

      const data = await response.json()
      
      // Set the recipe with a placeholder image
      // The RecipeCard component will handle image generation
      setRecipe({
        ...data.recipe,
        image: "/placeholder.svg"
      })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Ingrenius</h1>
        <p className="text-muted-foreground mt-2">
          Enter ingredients you have, and I&apos;ll create a delicious recipe for you!
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. chicken, rice, bell peppers"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter ingredients separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietaryPreference"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Dietary Preference</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dietary preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                        <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="low-carb">Low Carb</SelectItem>
                        <SelectItem value="none">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuisineType"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Cuisine Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="mexican">Mexican</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="thai">Thai</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="american">American</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="vietnamese">Vietnamese</SelectItem>
                        <SelectItem value="none">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mealType"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Meal Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="soup">Soup</SelectItem>
                        <SelectItem value="salad">Salad</SelectItem>
                        <SelectItem value="side">Side Dish</SelectItem>
                        <SelectItem value="none">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quickMeal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Quick Meal</FormLabel>
                      <FormDescription>
                        Generate a recipe that can be prepared in 30 minutes or less.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <KitchenLoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  "Generate Recipe"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ChefHatLoading />
              <p className="text-muted-foreground mt-4 text-center">
                Cooking up a delicious recipe for you...
              </p>
            </div>
          ) : recipe ? (
            <RecipeCard recipe={recipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full border border-dashed rounded-lg p-10">
              <p className="text-muted-foreground text-center">
                Enter your ingredients and preferences, then click &quot;Generate Recipe&quot; to see your personalized recipe here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

