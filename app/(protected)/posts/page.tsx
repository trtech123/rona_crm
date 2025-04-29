import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import React from 'react';
import MyPostsSection from '@/components/dashboard/views/MyPostsSection'; // Import the new component

// Define the Post type HERE or ensure it's importable from a central types file
// Let's define it here for now for clarity, but move it later if needed
export type Post = {
  id: string;
  content: string;
  platform?: string | null;
  hashtags?: string[] | null;
  created_at: string;
  // Add other fields from your 'posts' table as needed
  // e.g., status?: string;
  // e.g., views?: number;
  // e.g., comments?: number;
};

// Function to fetch posts for the current user
async function getUserPosts(supabase: any): Promise<Post[]> {
  console.log('[PostsPage] Attempting to get user...');
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[PostsPage] Error getting user or user not found:", userError);
    return [];
  }
  console.log(`[PostsPage] User found: ${user.id}`);

  console.log(`[PostsPage] Attempting to fetch posts for user ${user.id}...`);
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    // Explicitly select columns, including original_url
    .select(`
      id,
      content,
      platform,
      hashtags,
      created_at,
      original_url, 
      published, 
      published_at,
      scheduled_at
      // Add other required fields from PostDisplayData type if needed
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error("[PostsPage] Error fetching posts:", postsError);
    return [];
  }

  console.log(`[PostsPage] Fetched ${posts?.length ?? 0} posts.`);
  // Optionally log the first post's content if posts exist
  if (posts && posts.length > 0) {
      console.log("[PostsPage] First post content snippet:", posts[0]?.content?.substring(0, 50) + "...");
  }

  return posts || [];
}

export default async function PostsPage() {
  console.log('[PostsPage] Page component rendering...'); // Log page render start
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const posts: Post[] = await getUserPosts(supabase);
  console.log(`[PostsPage] Final posts array length: ${posts.length}`); // Log final posts count

  // Return the new component, passing the fetched posts to it
  return <MyPostsSection posts={posts} />;
} 