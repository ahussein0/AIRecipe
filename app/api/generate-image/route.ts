import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Configure for Vercel serverless function
export const maxDuration = 25;

// Simple in-memory cache for image URLs
const imageCache: Record<string, string> = {};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { recipeName, description } = await req.json()

    if (!recipeName) {
      return NextResponse.json({ error: "Recipe name is required" }, { status: 400 })
    }

    // Create a cache key based on the recipe name
    const cacheKey = recipeName.toLowerCase().trim();
    
    // Check if we already have a cached image for this recipe
    if (imageCache[cacheKey]) {
      console.log("Using cached image for:", recipeName);
      return NextResponse.json({ imageUrl: imageCache[cacheKey] });
    }

    // Create a prompt for the image generation - simplified for faster generation
    const prompt = `A professional food photography style image of ${recipeName}. ${description ? description.substring(0, 100) : ''}. Top-down view, on a plate, photorealistic.`;

    try {
      // Use DALL-E 2 for faster generation
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI");
      }

      // Cache the image URL
      imageCache[cacheKey] = imageUrl;
      
      console.log("Generated new image for:", recipeName);
      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
} 