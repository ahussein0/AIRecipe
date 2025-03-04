import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Configure for Vercel serverless function
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { recipeName, description } = await req.json()

    if (!recipeName) {
      return NextResponse.json({ error: "Recipe name is required" }, { status: 400 })
    }

    // Create a prompt for the image generation
    const prompt = `A professional food photography style image of ${recipeName}. ${description || ''}. Top-down view, on a beautiful plate, with garnish, high resolution, photorealistic.`

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI");
      }

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