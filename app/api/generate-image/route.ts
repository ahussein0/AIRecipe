import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Configure for Vercel serverless function
export const maxDuration = 15;

// Simple in-memory cache for image URLs
const imageCache: Record<string, string> = {};

// Fallback image if generation fails
const FALLBACK_IMAGE = "/placeholder.svg";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return NextResponse.json({ imageUrl: FALLBACK_IMAGE });
    }

    const { recipeName, description } = requestBody;

    if (!recipeName) {
      console.error("Recipe name is required");
      return NextResponse.json({ imageUrl: FALLBACK_IMAGE });
    }

    // Create a cache key based on the recipe name
    const cacheKey = recipeName.toLowerCase().trim();
    
    // Check if we already have a cached image for this recipe
    if (imageCache[cacheKey]) {
      console.log("Using cached image for:", recipeName);
      return NextResponse.json({ imageUrl: imageCache[cacheKey] });
    }

    // Create a very simple prompt for faster generation
    const prompt = `Food photo of ${recipeName}. Top-down view.`;

    try {
      // Use DALL-E 2 with minimal settings for faster generation
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        console.error("No image URL returned from OpenAI");
        return NextResponse.json({ imageUrl: FALLBACK_IMAGE });
      }

      // Cache the image URL
      imageCache[cacheKey] = imageUrl;
      
      console.log("Generated new image for:", recipeName);
      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      return NextResponse.json({ imageUrl: FALLBACK_IMAGE });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ imageUrl: FALLBACK_IMAGE });
  }
} 