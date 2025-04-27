import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link';
import { Button } from "@/components/ui/button"; // Assuming Button is here
import { ArrowRight } from "lucide-react"; // Assuming icon is here
import { Post } from '@/types/post'; // Assuming Post type definition exists
import { PostActions } from '@/components/post-actions'; // Import the new client component

// Function to fetch a single post
async function getPostById(postId: string): Promise<Post | null> {
  // In Server Components, cookies() returns the store synchronously.
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Define the required 'get', 'set', and 'remove' methods
        // These methods interact with the synchronous cookieStore instance
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
             cookieStore.set(name, value, options);
          } catch (error) {
             // The `set` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing
             // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
           try {
             cookieStore.set({ name, value: '', ...options });
           } catch (error) {
             // The `delete` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing
             // user sessions.
           }
        },
      },
    }
  );

  // Now, use await for Supabase async operations
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[Post Detail] Error getting user or user not found:", userError);
    // Decide if unauthorized should be a 404 or maybe redirect to login
    // For now, treating as "not found" from the user's perspective
    return null;
  }

  // Fetch the post data
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    // Only fetch posts belonging to the authenticated user
    .eq('user_id', user.id)
    .single(); // Use single() since ID should be unique

  if (error) {
     // Log the error but treat as not found
     console.error(`[Post Detail] Error fetching post ${postId} for user ${user.id}:`, error);
     return null; // Post not found or error occurred
  }

  console.log(`[Post Detail] Post found:`, data?.content?.substring(0, 50) + '...');
  return data as Post; // Type assertion might be needed depending on Post type
}

// Define the props for the Server Component
interface PostDetailPageProps {
  params: {
    id: string;
  };
}

// Make the component async to fetch data
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = params.id;
  const post = await getPostById(postId);

  // If post not found or user not authorized, show 404
  if (!post) {
    notFound();
  }

  // Use first ~15 words as a title placeholder if no title field exists
  const titlePlaceholder = post.content?.split(' ').slice(0, 15).join(' ') + (post.content?.split(' ').length > 15 ? '...' : '');

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2"> {/* Flex container for back button and actions */}
        {/* Back Button */}
        <Link href="/posts">
           <Button variant="outline" size="sm" className="flex items-center gap-2">
               <ArrowRight className="h-4 w-4" />
               חזרה לרשימת הפוסטים
            </Button>
        </Link>

        {/* Post Actions (Client Component) */}
        <PostActions post={post} />
      </div>

      {/* Post Content Area */}
      <div className="bg-card p-6 rounded-lg shadow border text-card-foreground"> {/* Use theme variables */}
        {/* Use placeholder title */}
        <h1 className="text-2xl font-bold mb-4 break-words">{titlePlaceholder}</h1>

        {/* Display the full post content */}
        {/* Use whitespace-pre-wrap to preserve line breaks from textarea */}
        <p className="text-foreground leading-relaxed whitespace-pre-wrap"> {/* Use theme variable */}
          {post.content}
        </p>

        {/* Optional: Display other post details like creation date */}
        <p className="text-sm text-muted-foreground mt-4"> {/* Use theme variable */}
          נוצר בתאריך: {new Date(post.createdAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}