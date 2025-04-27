import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Post } from '@/types/post';
import EditPostForm from '@/components/edit-post-form'; // We will create this next
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react'; // Using Left arrow for "Back"

// Re-using or adapting the fetch function - placed here for simplicity
// Ideally, this could be in a shared lib/utils file
async function getPostForEdit(postId: string): Promise<Post | null> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }) } catch (error) {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }) } catch (error) {} },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
      console.log("No user found, redirecting to signin");
      redirect('/signin?message=Please sign in to edit posts');
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', user.id) // Important: Ensure user owns the post
    .single();

  if (error || !data) {
    console.error(`Error fetching post ${postId} for editing or post not found/not owned by user ${user.id}:`, error);
    return null; // Treat as not found if error or no data (or not owned)
  }

  return data as Post;
}

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const postId = params.id;
  const post = await getPostForEdit(postId);

  if (!post) {
    notFound(); // Show 404 if post doesn't exist or user doesn't own it
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
       <div className="mb-4">
        {/* Link back to the post detail page */}
        <Link href={`/posts/${post.id}`}>
           <Button variant="outline" size="sm" className="flex items-center gap-2">
               <ArrowLeft className="h-4 w-4" /> {/* Back arrow */}
               Cancel Edit
            </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      {/* Render the form component, passing the fetched post data */}
      <EditPostForm post={post} />
    </div>
  );
} 