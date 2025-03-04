import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
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

// Use the new route segment config syntax
export const maxDuration = 60;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { ingredients, dietaryPreference, cuisineType, mealType, additionalPreferences, quickMeal } = await req.json()

    // Build the prompt based on user inputs
    let prompt = `Create a detailed recipe using these ingredients: ${ingredients}.`

    if (dietaryPreference && dietaryPreference !== "none") {
      prompt += ` The recipe should be ${dietaryPreference}.`
    }

    if (cuisineType && cuisineType !== "any") {
      prompt += ` It should be ${cuisineType} cuisine.`
    }

    if (mealType && mealType !== "any") {
      prompt += ` This is for a ${mealType} meal.`
    }

    if (quickMeal) {
      prompt += ` It should be a quick meal that can be prepared in 30 minutes or less.`
    }

    if (additionalPreferences) {
      prompt += ` Additional preferences: ${additionalPreferences}.`
    }

    prompt += ` Include a name, description, ingredients with measurements, step-by-step instructions, preparation and cooking time, servings, tags, and estimated nutritional information. Also provide some cooking tips.`

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
    }`

    // Generate the recipe using OpenAI
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse the JSON response
      try {
        const responseText = data.choices[0].message.content || "";
        // Extract JSON if it's wrapped in backticks
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;
        
        try {
          const recipeData = JSON.parse(jsonString) as RecipeType;
          
          // Validate the recipe data
          if (!recipeData.name || !recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
            console.error("Invalid recipe data structure:", recipeData);
            return NextResponse.json({ error: "Invalid recipe data structure" }, { status: 500 });
          }
          
          // Clean up ingredients to handle undefined values
          if (Array.isArray(recipeData.ingredients)) {
            recipeData.ingredients = recipeData.ingredients.map(ingredient => {
              if (typeof ingredient === 'object' && ingredient !== null) {
                // If amount is undefined or the string "undefined", just return the ingredient name
                if (!ingredient.amount || ingredient.amount === "undefined") {
                  return ingredient.ingredient || "";
                }
                // Otherwise return the object with both properties
                return {
                  ingredient: ingredient.ingredient || "",
                  amount: ingredient.amount
                };
              }
              return ingredient;
            });
          }
          
          // Generate image in parallel
          try {
            // Create a prompt for the image generation
            const imagePrompt = `A professional food photography style image of ${recipeData.name}. ${recipeData.description || ''}. Top-down view, on a beautiful plate, with garnish, high resolution, photorealistic.`;
            
            const imageResponse = await openai.images.generate({
              model: "dall-e-3",
              prompt: imagePrompt,
              n: 1,
              size: "1024x1024",
              quality: "standard",
            });
            
            const imageUrl = imageResponse.data[0]?.url;
            
            if (imageUrl) {
              recipeData.image = imageUrl;
            } else {
              // Fallback to placeholder if image generation fails
              recipeData.image = "/placeholder.svg";
            }
          } catch (imageError) {
            console.error("Error generating image:", imageError);
            // If image generation fails, use placeholder
            recipeData.image = "/placeholder.svg";
          }
          
          // Log successful recipe generation
          console.log("Recipe generated successfully:", recipeData.name);
          
          // Return the recipe with image
          return NextResponse.json({ recipe: recipeData });
        } catch (parseError) {
          console.error("Error parsing recipe JSON:", parseError);
          // Log the problematic JSON string
          console.error("Raw JSON string:", jsonString);
          return NextResponse.json({ error: "Failed to parse recipe data" }, { status: 500 });
        }
      } catch (fetchError) {
        console.error("Error fetching from OpenAI:", fetchError);
        return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

