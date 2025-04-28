import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Use the standard client for server-side API routes

// Initialize Supabase client for server-side operations
// Ensure these environment variables are set in your deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Use the public URL variable
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use the secure, non-public service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL (NEXT_PUBLIC_SUPABASE_URL) or Service Role Key (SUPABASE_SERVICE_ROLE_KEY) is missing in environment variables.');
  // Optionally throw an error or handle appropriately
}

// Create a single Supabase client instance
// We assert non-null with '!' because we checked above, but handle appropriately if initialization can fail
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

/**
 * API endpoint to receive webhook data from Make.com
 * Logs the data and updates the post_id in the database based on the received uuid.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received webhook data from Make.com:', JSON.stringify(data, null, 2));

    // Extract uuid and the platform-specific post_id
    const postUuid = data.uuid; // The original UUID of our post
    const platformPostId = data.post_id; // The ID returned from the platform (e.g., Facebook)

    if (!postUuid || !platformPostId) {
      console.warn('Webhook data missing required fields: uuid or post_id');
      return NextResponse.json(
        { success: false, message: 'Missing uuid or post_id in webhook data' },
        { status: 400 }
      );
    }

    console.log(`Attempting to update post with UUID: ${postUuid} with platform_post_id: ${platformPostId}`);

    // Update the post in the Supabase 'posts' table
    const { data: updateData, error: updateError } = await supabase
      .from('posts')
      .update({ 
        platform_post_id: platformPostId, // Assuming you have a column named 'platform_post_id'
        // published: true, // Optionally update published status here as well if Make confirms success
        // published_at: new Date().toISOString(), // Optionally set publish time
        updated_at: new Date().toISOString(), // Always update the timestamp
      })
      .eq('id', postUuid) // Match the post by its original UUID
      .select() // Select the updated row to confirm
      .single(); // Expect only one row to be updated

    if (updateError) {
      console.error(`Supabase update error for UUID ${postUuid}:`, updateError);
      // Check for specific errors, e.g., post not found (PGRST116 might indicate this if .single() fails)
      if (updateError.code === 'PGRST116') { // Example error code check
        return NextResponse.json(
          { success: false, message: `Post with UUID ${postUuid} not found.` },
          { status: 404 }
        );
      }
      throw updateError; // Re-throw other errors to be caught by the outer catch block
    }

    if (!updateData) {
        console.warn(`No post found or update failed for UUID: ${postUuid}`);
        return NextResponse.json(
            { success: false, message: `Post with UUID ${postUuid} not found or update failed.` },
            { status: 404 }
        );
    }

    console.log(`Successfully updated post ${postUuid} with platform_post_id ${platformPostId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook data received and post updated successfully'
    });

  } catch (error) {
    console.error('--- ERROR PROCESSING WEBHOOK DATA ---');
    console.error('Timestamp:', new Date().toISOString());
    
    // Log the error object itself
    console.error('Caught Error Object:', error);
    
    // Attempt to log specific properties if it's an Error instance
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      if (error.stack) {
        console.error('Error Stack:', error.stack);
      }
    }
    
    // Log as stringified JSON for potentially more details
    try {
      console.error('Error Stringified:', JSON.stringify(error, null, 2));
    } catch (stringifyError) {
      console.error('Could not stringify the error object.');
    }
    console.error('--- END ERROR --- ');

    // Return an error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing webhook data',
        // Keep the original error message reporting for the response
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests to the webhook endpoint
 * This can be useful for testing or verification
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint is active',
    message: 'Send POST requests to this endpoint with your data'
  });
} 