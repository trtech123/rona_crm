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

  // Check if Supabase client was initialized
  if (!supabase) {
    return NextResponse.json(
        { success: false, message: 'Server configuration error: Supabase client not initialized.' }, 
        { status: 500 }
    );
  }

  // --- Fetch Data ---  
  try {
    console.log('Public Posts Sync API: Request received. Fetching posts...'); // Updated log
    const { data, error } = await supabase
      .from('posts')
      .select('id, post_id'); // Select only the necessary columns

    if (error) {
      console.error('Public Posts Sync API: Supabase fetch error:', error); // Updated log
      throw error; // Let the main catch block handle it
    }

    // Map the data to the desired format (uuid, post_id)
    const responseData = data?.map(post => ({
      uuid: post.id,
      post_id: post.post_id // This will be null if not set
    })) || [];

    console.log(`Public Posts Sync API: Successfully fetched ${responseData.length} posts.`); // Updated log
    return NextResponse.json({ success: true, posts: responseData });

  } catch (error) {
    console.error('Public Posts Sync API: Error fetching post data:', error); // Updated log
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