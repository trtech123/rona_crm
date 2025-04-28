import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Service Role Key for backend access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: API Key environment variable and check removed as requested.

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('API Route Error: Supabase URL or Service Role Key missing.');
  // Handle missing Supabase config more gracefully if needed
}

// Create client only if config is present
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

/**
 * Public API endpoint to retrieve all post UUIDs and their associated platform post IDs.
 * NOTE: This endpoint is publicly accessible.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[${new Date(startTime).toISOString()}] Public Posts Sync API: Received GET request.`);

  // Check if Supabase client was initialized
  if (!supabase) {
    console.error(`[${new Date().toISOString()}] Public Posts Sync API: Error - Supabase client not initialized (missing env vars?).`);
    return NextResponse.json(
        { success: false, message: 'Server configuration error: Supabase client not initialized.' }, 
        { status: 500 }
    );
  }

  // --- Fetch Data ---  
  try {
    console.log(`[${new Date().toISOString()}] Public Posts Sync API: Attempting to fetch posts from Supabase...`);
    const { data, error, status } = await supabase
      .from('posts')
      .select('id, post_id'); // Select only the necessary columns

    if (error) {
      console.error(`[${new Date().toISOString()}] Public Posts Sync API: Supabase fetch error. Status: ${status}. Error:`, error);
      throw error; // Let the main catch block handle it
    }

    // Map the data to the desired format (uuid, post_id)
    const responseData = data?.map(post => ({
      uuid: post.id,
      post_id: post.post_id // This will be null if not set
    })) || [];

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Public Posts Sync API: Successfully fetched ${responseData.length} posts in ${duration}ms.`);
    
    // Optionally log the first few results for verification if needed (be careful with large datasets)
    // if (responseData.length > 0) {
    //   console.log('[DEBUG] First post data:', responseData[0]);
    // }

    return NextResponse.json({ success: true, posts: responseData });

  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] --- Public Posts Sync API: ERROR after ${errorDuration}ms ---`);
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
        message: 'Error fetching post data',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 