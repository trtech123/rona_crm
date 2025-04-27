import OpenAI from "openai";
import { PostFormData } from "@/types/post";
import { supabase } from "./supabase/client"; // Ensure the correct path to the Supabase client

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generatePost(formData: PostFormData) {
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
    author_id: null, // Set this if you have user context
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertError } = await supabase
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
      model: "gpt-4-turbo-preview", // Consider using a newer model if available like gpt-4o-mini
      messages: [
        {
          role: "system",
          content:
            "You are an expert social media content creator specializing in real estate marketing. Create engaging, professional posts that resonate with the target audience while maintaining brand voice and achieving marketing goals.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      // Consider adding response_format: { type: "json_object" } if the model supports it
      // This ensures the response is valid JSON, matching your prompt request.
    });
  } catch (err: any) {
    // Catch specific OpenAI errors if possible
    console.error("❌ OpenAI API error:", err);
    throw new Error(
      "OpenAI call failed: " + (err.message || JSON.stringify(err))
    );
  }

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    console.error("❌ OpenAI returned no content:", completion);
    throw new Error("Failed to generate post content");
  }

  // Parse the response as JSON
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(content);
  } catch (err) {
    console.error("❌ Failed to parse OpenAI response as JSON:", content);
    throw new Error("OpenAI response is not valid JSON");
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error(userError?.message || "User not authenticated");
  }

  // Insert the generated post into the posts table
  const { error: postInsertError } = await supabase.from("posts").insert([
    {
      user_id: user.id,
      content: parsedResponse.content,
      platform: formData.socialNetwork,
      created_at: new Date().toISOString(),
      // scheduled_at: ... (add if you have scheduling)
    },
  ]);
  if (postInsertError) {
    console.error(
      "❌ Supabase post insert error:",
      JSON.stringify(postInsertError, null, 2)
    );
    throw new Error(`Supabase post insert failed: ${postInsertError.message}`);
  }

  // Optional: return the parsed response
  return content;
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
