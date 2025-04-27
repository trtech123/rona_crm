'use server';

import OpenAI from 'openai';
import { PostFormData, WritingStyle } from '@/types/post'; // Assuming types are relevant

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SuggestionParams {
  userPrompt: string;
  targetAudience?: string;
  writingStyles?: Record<WritingStyle, boolean>;
  customWritingStyle?: string;
  wordCount?: number; // Optional: maybe use for length guidance
}

export async function generateSuggestionsAction(
  params: SuggestionParams
): Promise<{
  success: boolean;
  message?: string;
  data?: string; // The raw suggestion string from OpenAI
}> {
  console.log('[Server Action] generateSuggestionsAction called with params:', params);
  const { userPrompt, targetAudience, writingStyles, customWritingStyle, wordCount } = params;

  const activeStyles = writingStyles
    ? Object.entries(writingStyles)
        .filter(([_, isSelected]) => isSelected)
        .map(([style]) => style)
        .join(', ')
    : 'neutral';
  const fullStyle = customWritingStyle ? `${activeStyles}, ${customWritingStyle}` : activeStyles;

  const systemPrompt = `תתנהג כמומחה בין לאומי ליצירת פוסטים ומאמרים ב-AI.
תשתמש בכל המידע והתשובות שקיבלת משאלון הכניסה ומשאלון הפוסט עבור תוכן ספציפי זה.
מטרת הפוסט, מוצר או שירות שמוזכרים, קישור, וסוג התוכן הם פרמטרים חשובים.
תבדוק אם יש חג, אירוע, מאמר, תוכן או טריגר חיצוני רלוונטי לפוסט הספציפי.
אם יש בחירה של תמונה וסגנון, תתאם את הטקסט בהתאם.
זכור לשמור על התאמה מלאה בין טון הדיבור של העסק, סוג הרשת החברתית, והמטרה השיווקית.
${wordCount ? `השתדל לסיים את התוכן באופן הגיוני קרוב ל-${wordCount} מילים.` : ''}
**קריטי: סיים תמיד משפטים ורעיונות בצורה מלאה. לעולם אל תקטע מילה או משפט באמצע, גם אם זה אומר לחרוג מעט ממספר המילים המבוקש. עדיף טקסט שלם מעט ארוך/קצר יותר מטקסט קטוע.**
**פלט אך ורק טקסט רגיל. אין להשתמש בעיצוב Markdown כלל (ללא *, _, # וכו').**`;

  const combinedPrompt = `User Request: "${userPrompt}"
Target Audience: ${targetAudience || 'General'}
Desired Writing Style: ${fullStyle || 'Professional'}
${wordCount ? `Finish the content logically around ${wordCount} words. Do NOT cut off words or sentences.` : ''}

Please provide relevant content suggestions or a short draft based on the user request, following the system instructions precisely. **Output complete, plain text only, with no markdown formatting. Never cut off a word or sentence mid-way.**`;

  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    {
      role: 'user' as const,
      content: combinedPrompt,
    },
  ];

  console.log('[Server Action] Sending messages to OpenAI:', JSON.stringify(messages, null, 2));

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Consider gpt-4o-mini for speed/cost
      messages: messages,
      temperature: 0.7,
      max_tokens: 2500, // Increased max_tokens further
    });

    const suggestion = completion?.choices?.[0]?.message?.content;

    if (!suggestion) {
      throw new Error('AI did not return a suggestion.');
    }

    // More aggressive cleanup attempt for partial words/sentences (less reliable)
    // This tries to remove anything after the last period, question mark, or exclamation mark if it looks incomplete.
    let cleanedSuggestion = suggestion.trim().replace(/^\*\s?|\s?\*$/g, '');
    // Basic check: if the cleaned text doesn't end with a common punctuation, try to find the last one.
    if (!/[.?!]$/.test(cleanedSuggestion)) {
        const lastPuncIndex = Math.max(cleanedSuggestion.lastIndexOf('.'), cleanedSuggestion.lastIndexOf('?'), cleanedSuggestion.lastIndexOf('!'));
        if (lastPuncIndex > -1 && lastPuncIndex < cleanedSuggestion.length - 1) { // Ensure punctuation is not the very last character
             // Check if the part after the last punctuation seems like a fragment (e.g., very short)
             if (cleanedSuggestion.substring(lastPuncIndex + 1).trim().length < 15) { 
                 cleanedSuggestion = cleanedSuggestion.substring(0, lastPuncIndex + 1);
             }
        }
    }

    console.log('[Server Action] Suggestion generated successfully.');
    return {
      success: true,
      message: 'Suggestions generated successfully!',
      data: cleanedSuggestion,
    };
  } catch (error: any) {
    console.error('[Server Action] Error generating suggestions:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while generating suggestions.',
    };
  }
} 