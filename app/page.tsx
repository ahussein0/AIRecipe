"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RecipeCard } from "@/components/recipe-card"
import type { RecipeType } from "@/lib/types"
import { ChefHatLoading, KitchenLoadingSpinner } from "@/components/loading-animation"

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

const RecipePage = dynamic(() => import('./RecipePage'), { ssr: false })

export default RecipePage

