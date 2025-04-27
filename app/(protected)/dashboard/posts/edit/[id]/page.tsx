"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Post } from '../page'; // Import Post interface from the main posts page

// We can reuse the Post interface, but for the form, we might only need a subset
// or handle fields like created_at, id separately.
interface EditPostData extends Omit<Post, 'id' | 'created_at' | 'user_id' | 'effectiveness' | 'leads_count' | 'comments_count' | 'likes_count' | 'is_leading' | 'statusColor' | 'typeColor' | 'leadingColor' | 'icon'> {
    // No extra fields needed for now, using Partial<Post> effectively
}

// Use the same options as the create page
const POST_TYPES = ['פוסט', 'מאמר', 'אירוע', 'חג', 'מערכת'];
const POST_STATUSES = ['טיוטה', 'מתוזמן', 'פורסם', 'בבדיקה', 'נדחה']; // Include 'נדחה' here
const PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'Blog', 'אחר'];

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const postId = params.id;

    const [post, setPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState<Partial<EditPostData>>({}); // Start with partial data
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch post data
    const fetchPost = useCallback(async () => {
        if (!postId) return;
        setIsLoading(true);
        setFetchError(null);
        try {
            const { data, error: dbError } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single(); // Expecting a single post

            if (dbError) {
                if (dbError.code === 'PGRST116') { // PostgREST error for no rows found
                     throw new Error("פוסט לא נמצא.");
                } else {
                    throw dbError;
                }
            }

            if (!data) {
                 throw new Error("פוסט לא נמצא.");
            }

            setPost(data as Post);
            // Initialize form data - handle potential null/undefined values from DB
            setFormData({
                title: data.title ?? '',
                content: data.content ?? '',
                status: data.status ?? '',
                type: data.type ?? '',
                platform: data.platform ?? '',
                target_audience: data.target_audience ?? '',
                date: data.date ? data.date.split('T')[0] : '', // Format date for input type=date
                location: data.location ?? '',
                goals: data.goals ?? [], // Assuming goals is an array
            });
        } catch (err: any) {
            console.error("Error fetching post:", err);
            setFetchError(err.message || "שגיאה בטעינת הפוסט.");
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof EditPostData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // If type changes away from Event, clear event-specific fields
        if (name === 'type' && value !== 'אירוע') {
             setFormData(prev => ({ ...prev, date: '', location: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!post) return; // Should not happen if form is visible

        setIsSubmitting(true);
        setError(null);

        // Basic Validation
        if (!formData.title || !formData.type || !formData.status) {
            setError("כותרת, סוג וסטטוס הם שדות חובה.");
            setIsSubmitting(false);
            return;
        }

        const postDataToUpdate = {
            ...formData,
            // Ensure date/location are null if type is not Event
            date: formData.type === 'אירוע' && formData.date ? formData.date : null,
            location: formData.type === 'אירוע' && formData.location ? formData.location : null,
        };

        try {
            const { error: updateError } = await supabase
                .from('posts')
                .update(postDataToUpdate)
                .eq('id', post.id);

            if (updateError) {
                throw updateError;
            }

            toast({
                title: "הצלחה!",
                description: "הפוסט עודכן בהצלחה.",
            });
            // Optionally refresh data or just navigate back
             router.push('/dashboard/posts');
            // Or router.refresh() if staying on the page is desired

        } catch (err: any) {
            console.error("Error updating post:", err);
            setError(err.message || "שגיאה בעדכון הפוסט. נסה שוב.");
            toast({
                title: "שגיאה",
                description: err.message || "שגיאה בעדכון הפוסט. בדוק את הפרטים ונסה שוב.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64" dir="rtl">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-purple-600" />
                <p className="text-purple-700">טוען פרטי פוסט...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
             <div className="p-4 md:p-6 max-w-4xl mx-auto text-center" dir="rtl">
                 <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-700 flex items-center justify-center gap-2">
                             <AlertTriangle className="h-5 w-5"/> שגיאה בטעינת הפוסט
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-red-600">{fetchError}</p>
                    </CardContent>
                     <CardFooter className="justify-center">
                         <Link href="/dashboard/posts">
                             <Button variant="outline" className="flex items-center gap-1 text-sm">
                                 <ArrowLeft className="h-4 w-4" />
                                 חזרה לרשימת הפוסטים
                             </Button>
                         </Link>
                     </CardFooter>
                 </Card>
            </div>
        );
    }

    if (!post) {
        // This state should ideally not be reached if fetchError handles non-existence
        return <div className="p-6 text-center text-gray-500" dir="rtl">לא נמצא פוסט תואם.</div>;
    }

    // --- Main Form Render ---
    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">עריכת פוסט: {post.title}</h1>
                <Link href="/dashboard/posts">
                    <Button variant="outline" className="flex items-center gap-1 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        חזרה לרשימת הפוסטים
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm border border-gray-100">
                     {/* Keep header simple for editing */}
                    <CardHeader>
                        <CardTitle className="text-lg">עדכון פרטי הפוסט</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {/* Re-use form structure from Create page */}
                         {/* Title */}
                         <div className="space-y-1">
                             <Label htmlFor="title">כותרת <span className="text-red-500">*</span></Label>
                             <Input
                                 id="title"
                                 name="title"
                                 value={formData.title ?? ''}
                                 onChange={handleChange}
                                 placeholder="כותרת ראשית לפוסט"
                                 required
                                 className="border-gray-200"
                             />
                         </div>

                         {/* Content */}
                         <div className="space-y-1">
                             <Label htmlFor="content">תוכן הפוסט</Label>
                             <Textarea
                                 id="content"
                                 name="content"
                                 value={formData.content ?? ''}
                                 onChange={handleChange}
                                 placeholder="כתוב כאן את תוכן הפוסט..."
                                 rows={8}
                                 className="border-gray-200"
                             />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Type */}
                             <div className="space-y-1">
                                 <Label htmlFor="type">סוג <span className="text-red-500">*</span></Label>
                                 <Select
                                     name="type"
                                     value={formData.type ?? ''}
                                     onValueChange={(value) => handleSelectChange('type', value)}
                                     required
                                 >
                                     <SelectTrigger id="type" className="border-gray-200">
                                         <SelectValue placeholder="בחר סוג פוסט" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {POST_TYPES.map(type => (
                                             <SelectItem key={type} value={type}>{type}</SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                             </div>

                             {/* Status */}
                             <div className="space-y-1">
                                 <Label htmlFor="status">סטטוס <span className="text-red-500">*</span></Label>
                                 <Select
                                     name="status"
                                     value={formData.status ?? ''}
                                     onValueChange={(value) => handleSelectChange('status', value)}
                                     required
                                 >
                                     <SelectTrigger id="status" className="border-gray-200">
                                         <SelectValue placeholder="בחר סטטוס" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {POST_STATUSES.map(status => (
                                             <SelectItem key={status} value={status}>{status}</SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                             </div>
                         </div>

                         {/* Conditional Fields for Event Type */}
                         {formData.type === 'אירוע' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
                                 <div className="space-y-1">
                                     <Label htmlFor="date">תאריך האירוע</Label>
                                     <Input
                                         id="date"
                                         name="date"
                                         type="date"
                                         value={formData.date ?? ''}
                                         onChange={handleChange}
                                         className="border-gray-200"
                                     />
                                 </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="location">מיקום האירוע</Label>
                                     <Input
                                         id="location"
                                         name="location"
                                         value={formData.location ?? ''}
                                         onChange={handleChange}
                                         placeholder="לדוגמה: אונליין, תל אביב"
                                         className="border-gray-200"
                                     />
                                 </div>
                             </div>
                         )}

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Platform */}
                             <div className="space-y-1">
                                 <Label htmlFor="platform">פלטפורמה</Label>
                                 <Select
                                     name="platform"
                                     value={formData.platform ?? ''}
                                     onValueChange={(value) => handleSelectChange('platform', value)}
                                 >
                                     <SelectTrigger id="platform" className="border-gray-200">
                                         <SelectValue placeholder="בחר פלטפורמה (אופציונלי)" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="">-- ללא --</SelectItem>
                                         {PLATFORMS.map(platform => (
                                             <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                             </div>

                              {/* Target Audience */}
                             <div className="space-y-1">
                                 <Label htmlFor="target_audience">קהל יעד</Label>
                                 <Input
                                     id="target_audience"
                                     name="target_audience"
                                     value={formData.target_audience ?? ''}
                                     onChange={handleChange}
                                     placeholder="לדוגמה: לקוחות קיימים, מתעניינים חדשים"
                                     className="border-gray-200"
                                 />
                             </div>
                         </div>

                         {/* Goals Field (If implemented) */}

                     </CardContent>
                    <CardFooter className="flex flex-col items-start gap-3 border-t pt-4">
                         {error && (
                             <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 w-full">{error}</p>
                         )}
                         <div className="flex justify-end w-full">
                             <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                                 {isSubmitting ? (
                                     <>
                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                         מעדכן פוסט...
                                     </>
                                 ) : (
                                     'שמור שינויים'
                                 )}
                             </Button>
                         </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
} 