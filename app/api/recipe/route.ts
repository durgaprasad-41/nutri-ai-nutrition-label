import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { recipeName, servingSize, ingredients } = body;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `
        Calculate nutrition values for this recipe:

        Recipe Name: ${recipeName}
        Serving Size: ${servingSize}g
        Ingredients: ${JSON.stringify(ingredients)}

        Return ONLY valid JSON in this format:
        {
          "calories": number,
          "protein": number,
          "fat": number,
          "saturatedFat": number,
          "carbohydrates": number,
          "sugar": number
        }
      `,
    });

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to analyze recipe" },
      { status: 500 }
    );
  }
}