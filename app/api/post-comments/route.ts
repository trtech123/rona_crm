import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { URLSearchParams } from 'url'; // Import URLSearchParams

// Initialize Supabase client using Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: API Key environment variable and check removed as requested.

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('API Route Error (post-comments): Supabase URL or Service Role Key missing.');
}

// Create client only if config is present
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Define the structure for the nested "from" object
interface CommentFrom {
  name: string;
  id: string; // Platform-specific user ID
}

// Define the structure for a single comment coming in the payload
interface InputComment {
  id: string; // Platform-specific comment ID
  from: CommentFrom;
  message: string; 
}

interface CommentWebhookPayload {
  platform_post_id: string;
  comments: InputComment[]; // Array of the updated comment objects
}

/**
 * Public API endpoint for Make.com (or other services) to send post comments.
 * NOTE: This endpoint is publicly accessible.
 * Finds the internal post ID based on platform_post_id and inserts comments.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[${new Date(startTime).toISOString()}] Public Post Comments API: Received POST request.`);

  // --- Supabase Client Check ---
  if (!supabase) {
    console.error(`[${new Date().toISOString()}] Public Post Comments API: Error - Supabase client not initialized.`);
    return NextResponse.json(
      { success: false, message: 'Server configuration error: Supabase client not initialized.' },
      { status: 500 }
    );
  }

  let payload: CommentWebhookPayload | null = null;
  let rawBody = '';

  try {
    rawBody = await request.text(); // Read body as raw text first
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Received Raw Body:`, rawBody);

    // --- Attempt to Parse Body ---
    try {
      // First, try parsing directly as JSON (in case it's mostly valid)
      payload = JSON.parse(rawBody) as CommentWebhookPayload;
      console.log(`[${new Date().toISOString()}] Public Post Comments API: Successfully parsed raw body as JSON.`);
    } catch (jsonError) {
      console.warn(`[${new Date().toISOString()}] Public Post Comments API: Failed to parse body directly as JSON. Error: ${jsonError instanceof Error ? jsonError.message : jsonError}. Attempting form data parsing.`);
      
      try {
        // If direct JSON fails, try parsing as form data
        const formData = new URLSearchParams(rawBody);
        
        // *** ASSUMPTION: The actual JSON payload is in a field named 'payload' ***
        // *** You might need to change 'payload' based on the rawBody log output ***
        const jsonString = formData.get('payload'); 

        if (jsonString) {
          console.log(`[${new Date().toISOString()}] Public Post Comments API: Found form field 'payload'. Attempting to parse its value as JSON.`);
          payload = JSON.parse(jsonString) as CommentWebhookPayload;
        } else {
          // Log all form data keys if 'payload' is not found, to help identify the correct key
          const keys = Array.from(formData.keys());
          console.error(`[${new Date().toISOString()}] Public Post Comments API: Failed to find expected 'payload' field in form data. Found keys: ${keys.join(', ')}`);
          throw new Error("Could not find expected payload field in form data.");
        }
      } catch (formDataError) {
         console.error(`[${new Date().toISOString()}] Public Post Comments API: Failed to parse body as JSON or Form Data.`);
         // Throw the specific error that occurred during parsing
         throw formDataError instanceof Error ? formDataError : new Error('Failed to parse request body.');
      }
    }

    // --- Check if payload was successfully parsed ---
    if (!payload) {
        throw new Error("Failed to extract payload from request body.");
    }

    console.log(`[${new Date().toISOString()}] Public Post Comments API: Successfully Extracted Payload:`, JSON.stringify(payload, null, 2));

    // --- Payload Validation (use the extracted payload) ---
    const { platform_post_id, comments } = payload;

     if (
      !platform_post_id ||
      !comments ||
      !Array.isArray(comments) ||
      comments.length === 0 ||
      !comments.every(c =>
        c &&
        typeof c.id === 'string' &&
        c.from &&
        typeof c.from.name === 'string' &&
        // typeof c.from.id === 'string' && // Not strictly needed
        typeof c.message === 'string'
      )
    ) {
      console.warn(`[${new Date().toISOString()}] Public Post Comments API: Invalid payload structure received.`, JSON.stringify(payload, null, 2));
      return NextResponse.json(
        { success: false, message: 'Invalid payload structure after parsing.' },
        { status: 400 }
      );
    }
    
    // --- Find Internal Post ID ---
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Searching for internal post ID matching platform_post_id: ${platform_post_id}`);
    const { data: postData, error: postFetchError } = await supabase
      .from('posts')
      .select('id') // Select internal UUID
      .eq('post_id', platform_post_id) // Match using the platform's post ID
      .maybeSingle(); // Use maybeSingle as it might not exist

    if (postFetchError) {
      console.error(`[${new Date().toISOString()}] Public Post Comments API: Error fetching post by platform_post_id ${platform_post_id}:`, postFetchError);
      throw postFetchError;
    }

    if (!postData) {
      console.warn(`[${new Date().toISOString()}] Public Post Comments API: Post not found for platform_post_id: ${platform_post_id}. Cannot add comments.`);
      return NextResponse.json(
        { success: false, message: `Post not found for platform_post_id: ${platform_post_id}` },
        { status: 404 } // Not Found
      );
    }

    const internalPostId = postData.id;
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Found internal post ID: ${internalPostId} for platform_post_id: ${platform_post_id}`);

    // --- Prepare Comments for Insertion ---
     const commentsToInsert = comments.map(comment => ({
      post_id: internalPostId,
      content: comment.message,      // Map message text to 'content'
      lead_name: comment.from.name,  // Map user name to 'lead_name'
      external_id: comment.id        // Corrected: Map comment's own ID to 'external_id'
    }));

    // --- Insert Comments ---
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Attempting to insert ${commentsToInsert.length} comments for internal post ID: ${internalPostId}`, JSON.stringify(commentsToInsert, null, 2));
    const { data: insertedComments, error: insertError } = await supabase
      .from('comments') // Corrected: Target the comments table
      .insert(commentsToInsert);

    if (insertError) {
      console.error(`[${new Date().toISOString()}] Public Post Comments API: Error inserting comments for internal post ID ${internalPostId}:`, insertError);
      throw insertError;
    }
    
    // --- Success Response ---
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Successfully inserted ${commentsToInsert.length} comments for internal post ID ${internalPostId} in ${duration}ms.`);
    return NextResponse.json({ success: true, message: `Successfully added ${commentsToInsert.length} comments.` });

  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] --- Public Post Comments API: ERROR after ${errorDuration}ms ---`);
    console.error('Raw Body that caused error:', rawBody); // Log raw body on error
    console.error('Caught Error Object:', error);
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      if (error.stack) {
        console.error('Error Stack:', error.stack);
      }
    }
    try {
      console.error('Error Stringified:', JSON.stringify(error, null, 2));
    } catch (stringifyError) {
      console.error('Could not stringify the error object.');
    }
    console.error('--- END ERROR --- ');

    return NextResponse.json(
      {
        success: false,
        message: 'Error processing comments webhook',
        error: error instanceof Error ? error.message : 'Unknown processing error'
      },
      { status: 500 }
    );
  }
} 