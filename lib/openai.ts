import OpenAI from "openai";
import { PostFormData } from "@/types/post";
import type { SupabaseClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utility to clean markdown code block from OpenAI response
const cleanJSON = (str: string | null | undefined): string => {
    if (!str) return '';
    return str.replace(/^```json\s*|\s*```$/g, "").trim();
};

export async function generatePost(formData: PostFormData, supabaseClient: SupabaseClient): Promise<any> {
  // 1) Insert form data into the posts_inputs table
  const postInput = {
    post_type: formData.postType,
    post_problem: formData.postProblem,
    custom_post_problem: formData.customPostProblem,
    social_network: formData.socialNetwork,
    content_goal: formData.contentGoal,
    target_audience: formData.targetAudience,
    has_specific_property: formData.hasSpecificProperty === "yes",
    use_external_articles: formData.useExternalArticles === "yes",
    external_article_link: formData.externalArticleLink,
    include_cta: formData.includeCTA === "yes",
    cta_type: formData.ctaType,
    cta_text: formData.ctaText,
    cta_link: formData.ctaLink,
    cta_phone: formData.ctaPhone,
    cta_whatsapp_message: formData.ctaWhatsappMessage,
    media_type: formData.mediaType,
    images: formData.images,
    video_file: formData.videoFile,
    video_link: formData.videoLink,
    author_id: (await supabaseClient.auth.getUser()).data.user?.id ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertError } = await supabaseClient
    .from("posts_inputs")
    .insert([postInput])
    .select("id");

  if (insertError) {
    console.error(
      "❌ Supabase insert error:",
      JSON.stringify(insertError, null, 2)
    );
    throw new Error(`Supabase insert failed: ${insertError.message}`);
  }

  const postId = inserted?.[0]?.id;

  // 2) Generate the prompt
  const prompt = generatePrompt(formData);

  // 3) Generate the content with OpenAI
  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert social media content creator specializing in real estate marketing. Create engaging, professional posts that resonate with the target audience while maintaining brand voice and achieving marketing goals. **Output only a valid JSON object adhering to the requested structure.**",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });
  } catch (err: any) {
    console.error("❌ OpenAI API error:", err);
    throw new Error(
      "OpenAI call failed: " + (err.message || JSON.stringify(err))
    );
  }

  const rawContent = completion?.choices?.[0]?.message?.content;

  if (!rawContent) {
    console.error("❌ OpenAI returned no content:", completion);
    throw new Error("Failed to generate post content");
  }

  // Clean and Parse the response as JSON
  let parsedResponse;
  try {
    const cleanedContent = cleanJSON(rawContent);
    parsedResponse = JSON.parse(cleanedContent); 
    if (!parsedResponse.content || !parsedResponse.hashtags) {
        console.warn("⚠️ OpenAI JSON response missing expected fields:", parsedResponse);
    }
  } catch (err) {
    console.error("❌ Failed to parse OpenAI JSON response even after cleaning:", rawContent); 
    throw new Error("OpenAI response format error.");
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    console.error("Error getting user in generatePost:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Insert the generated post into the posts table using parsed content
  const { error: postInsertError } = await supabaseClient.from("posts").insert([
    {
      user_id: user.id,
      content: parsedResponse.content || '',
      platform: formData.socialNetwork,
      created_at: new Date().toISOString(),
      hashtags: parsedResponse.hashtags || [],
      suggested_image_prompt: parsedResponse.suggestedImagePrompt,
      suggested_cta: parsedResponse.cta,
    },
  ]);
  if (postInsertError) {
    console.error(
      "❌ Supabase post insert error:",
      JSON.stringify(postInsertError, null, 2)
    );
    throw new Error(`Supabase post insert failed: ${postInsertError.message}`);
  }

  // Return the PARSED response object
  return parsedResponse;
}

function generatePrompt(formData: PostFormData): string {
  const {
    postType,
    postProblem,
    socialNetwork,
    contentGoal,
    targetAudience,
    hasSpecificProperty,
    writingStyles,
    customWritingStyle,
  } = formData;

  return `
Create a social media post with the following specifications:

Post Type: ${postType}
Platform: ${socialNetwork}
Content Goal: ${contentGoal}
Target Audience: ${targetAudience}
${
  hasSpecificProperty === "yes"
    ? "This post is about a specific property."
    : "This is a general real estate post."
}
Writing Style: ${Object.entries(writingStyles)
    .filter(([_, isSelected]) => isSelected)
    .map(([style]) => style)
    .join(", ")}${customWritingStyle ? `, ${customWritingStyle}` : ""}

${
  postProblem !== "no-specific-problem"
    ? `Address this problem: ${postProblem}`
    : ""
}

Please create a post that:
1. Aligns with the platform's best practices
2. Achieves the specified content goal
3. Resonates with the target audience
4. Maintains the selected writing style(s)
5. Includes relevant hashtags
6. Is optimized for engagement

Format the response as a JSON object with the following structure:
{
  "content": "The main post content",
  "hashtags": ["relevant", "hashtags"],
  "suggestedImagePrompt": "A description for generating an AI image (if applicable)",
  "cta": "Call to action suggestion"
}`;
}
