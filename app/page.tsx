"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RecipeCard } from "@/components/recipe-card"
import type { RecipeType } from "@/lib/types"
import { ChefHatLoading } from "@/components/loading-animation"

const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: "Please enter at least one ingredient.",
  }),
  dietaryPreference: z.string().optional(),
  cuisineType: z.string().optional(),
  mealType: z.string().optional(),
  additionalPreferences: z.string().optional(),
  quickMeal: z.boolean().default(false),
})

export default function RecipeCreator() {
  const [recipe, setRecipe] = useState<RecipeType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      dietaryPreference: "",
      cuisineType: "",
      mealType: "",
      additionalPreferences: "",
      quickMeal: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setRecipe(null)
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
      setRecipe(data.recipe)
    } catch (error) {
      console.error("Error generating recipe:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Ingrenius</h1>
          <p className="text-muted-foreground mt-2">
            Generate custom recipes based on your ingredients and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6">
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
                            placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>List the ingredients you have available.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dietaryPreference"
                      render={({ field }) => (
                        <FormItem className="relative z-40">
                          <FormLabel>Dietary Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
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
                              <SelectItem value="none">No Restrictions</SelectItem>
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
                        <FormItem className="relative z-30">
                          <FormLabel>Cuisine Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cuisine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="mexican">Mexican</SelectItem>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="thai">Thai</SelectItem>
                              <SelectItem value="mediterranean">Mediterranean</SelectItem>
                              <SelectItem value="american">American</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="any">Any Cuisine</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mealType"
                      render={({ field }) => (
                        <FormItem className="relative z-20">
                          <FormLabel>Meal Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <SelectItem value="any">Any Meal Type</SelectItem>
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
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4 h-full">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Quick Meal</FormLabel>
                            <FormDescription>Ready in 30 minutes or less</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Preferences</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any other preferences or restrictions (e.g., spicy, no onions, kid-friendly)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 11h.01"></path>
                          <path d="M11 15h.01"></path>
                          <path d="M16 16h.01"></path>
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a10 10 0 0 1 10 10"></path>
                        </svg>
                        Cooking Up Recipe...
                      </>
                    ) : (
                      "Generate Recipe"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div>
            {recipe ? (
              <RecipeCard recipe={recipe} />
            ) : isGenerating ? (
              <div className="bg-card rounded-lg border shadow-sm p-6 h-full flex items-center justify-center">
                <ChefHatLoading />
              </div>
            ) : (
              <div className="bg-card rounded-lg border shadow-sm p-6 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                      <line x1="6" x2="18" y1="17" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">No Recipe Generated Yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form and click "Generate Recipe" to create a custom recipe based on your ingredients
                    and preferences. A beautiful image of your dish will be generated too!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

