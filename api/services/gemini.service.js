import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateRecommendationReason = async (
  currentListing,
  recommendedListing
) => {
  try {
    const prompt = `
Current Property:
Name: ${currentListing.name}
Type: ${currentListing.type}
Price: ${currentListing.regularPrice}
Bedrooms: ${currentListing.bedrooms}
Bathrooms: ${currentListing.bathrooms}
Furnished: ${currentListing.furnished}
Parking: ${currentListing.parking}

Recommended Property:
Name: ${recommendedListing.name}
Type: ${recommendedListing.type}
Price: ${recommendedListing.regularPrice}
Bedrooms: ${recommendedListing.bedrooms}
Bathrooms: ${recommendedListing.bathrooms}
Furnished: ${recommendedListing.furnished}
Parking: ${recommendedListing.parking}

Explain in exactly 2 short bullet points why this property is recommended.
Maximum 12 words per bullet.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);

    return `• Similar property features
• Comparable budget range`;
  }
};