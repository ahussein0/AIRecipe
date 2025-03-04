import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { RecipeType } from "@/lib/types"

// Define the recipe schema for validation
const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  servings: z.string().optional(),
  tags: z.array(z.string()),
  nutritionalInfo: z
    .object({
      calories: z.string().optional(),
      protein: z.string().optional(),
      carbs: z.string().optional(),
      fat: z.string().optional(),
    })
    .optional(),
  tips: z.array(z.string()).optional(),
  image: z.string().optional(),
})

// Use the new route segment config
export const maxDuration = 30;

// Create a default fallback recipe when all else fails
const createFallbackRecipe = (ingredients: string, cuisineType?: string) => {
  return {
    name: "Simple Recipe",
    description: `A simple recipe using ${ingredients}.`,
    ingredients: ingredients ? ingredients.split(',').map((i: string) => i.trim()) : ["Ingredients not specified"],
    instructions: ["Combine all ingredients and cook to your preference."],
    prepTime: "15 mins",
    cookTime: "20 mins",
    servings: "2",
    tags: [cuisineType || "custom"],
    nutritionalInfo: { calories: "Varies" },
    tips: ["Adjust seasoning to taste."],
    image: "/placeholder.svg"
  };
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return NextResponse.json({ 
        recipe: createFallbackRecipe("unknown ingredients") 
      });
    }

    const { ingredients, dietaryPreference, cuisineType, mealType, additionalPreferences, quickMeal } = requestBody;

    // Validate required fields
    if (!ingredients) {
      return NextResponse.json({ 
        recipe: createFallbackRecipe("unknown ingredients", cuisineType) 
      });
    }

    // Build the prompt based on user inputs
    let prompt = `Create a detailed recipe using these ingredients: ${ingredients}.`;

    if (dietaryPreference && dietaryPreference !== "none") {
      prompt += ` The recipe should be ${dietaryPreference}.`;
    }

    if (cuisineType && cuisineType !== "any") {
      prompt += ` It should be ${cuisineType} cuisine.`;
    }

    if (mealType && mealType !== "any") {
      prompt += ` This is for a ${mealType} meal.`;
    }

    if (quickMeal) {
      prompt += ` It should be a quick meal that can be prepared in 30 minutes or less.`;
    }

    if (additionalPreferences) {
      prompt += ` Additional preferences: ${additionalPreferences}.`;
    }

    prompt += ` Include a name, description, ingredients with measurements, step-by-step instructions, preparation and cooking time, servings, tags, and estimated nutritional information. Also provide some cooking tips.`;

    prompt += ` Format the response as a valid JSON object matching this structure: 
    {
      "name": "Recipe Name",
      "description": "Description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": "X mins",
      "cookTime": "Y mins",
      "servings": "Z",
      "tags": ["tag1", "tag2"],
      "nutritionalInfo": {
        "calories": "X",
        "protein": "Y",
        "carbs": "Z",
        "fat": "W"
      },
      "tips": ["tip 1", "tip 2"]
    }`;

    // Generate the recipe using OpenAI
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Using a faster model
          messages: [
            {
              role: "system",
              content: "You are a professional chef who creates recipes based on available ingredients and preferences. Always respond with valid JSON. Keep your response concise."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000, // Limit token count for faster response
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", response.status, errorText);
        return NextResponse.json({ 
          recipe: createFallbackRecipe(ingredients, cuisineType) 
        });
      }

      const data = await response.json();
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response from OpenAI:", data);
        return NextResponse.json({ 
          recipe: createFallbackRecipe(ingredients, cuisineType) 
        });
      }
      
      // Parse the JSON response
      try {
        const responseText = data.choices[0].message.content || "";
        console.log("Raw response from OpenAI:", responseText);
        
        // Extract JSON if it's wrapped in backticks
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;
        
        try {
          const recipeData = JSON.parse(jsonString);
          
          // Validate the recipe data
          if (!recipeData.name || !recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
            console.error("Invalid recipe data structure:", recipeData);
            
            // Create a fallback recipe with default values if the structure is invalid
            const fallbackRecipe = {
              name: recipeData.name || "Custom Recipe",
              description: recipeData.description || "A custom recipe based on your ingredients.",
              ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : ingredients.split(',').map((i: string) => i.trim()),
              instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : ["Cook the ingredients to your preference."],
              prepTime: recipeData.prepTime || "15 mins",
              cookTime: recipeData.cookTime || "20 mins",
              servings: recipeData.servings || "2",
              tags: Array.isArray(recipeData.tags) ? recipeData.tags : [cuisineType || "custom"],
              nutritionalInfo: recipeData.nutritionalInfo || { calories: "Varies" },
              tips: Array.isArray(recipeData.tips) ? recipeData.tips : ["Adjust seasoning to taste."],
              image: "/placeholder.svg"
            };
            
            return NextResponse.json({ recipe: fallbackRecipe });
          }
          
          // Ensure all arrays are properly initialized
          recipeData.ingredients = Array.isArray(recipeData.ingredients) ? recipeData.ingredients : ingredients.split(',').map((i: string) => i.trim());
          recipeData.instructions = Array.isArray(recipeData.instructions) ? recipeData.instructions : ["Cook the ingredients to your preference."];
          recipeData.tags = Array.isArray(recipeData.tags) ? recipeData.tags : [cuisineType || "custom"];
          recipeData.tips = Array.isArray(recipeData.tips) ? recipeData.tips : ["Adjust seasoning to taste."];
          
          // Use a placeholder image
          recipeData.image = "/placeholder.svg";
          
          // Log successful recipe generation
          console.log("Recipe generated successfully:", recipeData.name);
          
          // Return the recipe
          return NextResponse.json({ recipe: recipeData });
        } catch (parseError) {
          console.error("Error parsing recipe JSON:", parseError);
          console.error("Raw JSON string:", jsonString);
          
          // Create a fallback recipe if JSON parsing fails
          return NextResponse.json({ 
            recipe: createFallbackRecipe(ingredients, cuisineType) 
          });
        }
      } catch (error) {
        console.error("Error processing OpenAI response:", error);
        return NextResponse.json({ 
          recipe: createFallbackRecipe(ingredients, cuisineType) 
        });
      }
    } catch (fetchError) {
      console.error("Error fetching from OpenAI:", fetchError);
      return NextResponse.json({ 
        recipe: createFallbackRecipe(ingredients, cuisineType) 
      });
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json({ 
      recipe: createFallbackRecipe("unknown ingredients") 
    });
  }
}

