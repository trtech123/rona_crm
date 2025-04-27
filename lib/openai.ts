import OpenAI from 'openai';
import { PostFormData } from '@/types/post';
import { supabase } from './supabase/client'; // Ensure the correct path to the Supabase client

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generatePost(formData: PostFormData) {
  try {
    // Insert form data into the posts_inputs table
    const { error: insertError } = await supabase
      .from('posts_inputs')
      .insert([formData]);

    if (insertError) {
      console.error('Error inserting post inputs:', insertError);
      throw new Error('Failed to insert post inputs');
    }

    const prompt = generatePrompt(formData);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert social media content creator specializing in real estate marketing. Create engaging, professional posts that resonate with the target audience while maintaining brand voice and achieving marketing goals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post content');
  }
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
${hasSpecificProperty === 'yes' ? 'This post is about a specific property.' : 'This is a general real estate post.'}
Writing Style: ${Object.entries(writingStyles)
  .filter(([_, isSelected]) => isSelected)
  .map(([style]) => style)
  .join(', ')}${customWritingStyle ? `, ${customWritingStyle}` : ''}

${postProblem !== 'no-specific-problem' ? `Address this problem: ${postProblem}` : ''}

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