import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract the post ID and Facebook post ID from the request
    const { post_id, facebook_post_id } = body;
    
    if (!post_id || !facebook_post_id) {
      return NextResponse.json(
        { error: 'Missing required fields: post_id and facebook_post_id' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
          remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
        },
      }
    );
    
    // Update the post with the Facebook post ID
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        facebook_post_id,
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', post_id);
    
    if (updateError) {
      console.error('Error updating post with Facebook post ID:', updateError);
      return NextResponse.json(
        { error: 'Failed to update post with Facebook post ID' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated with Facebook post ID',
      post_id,
      facebook_post_id
    });
    
  } catch (error) {
    console.error('Error processing Make.com webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 