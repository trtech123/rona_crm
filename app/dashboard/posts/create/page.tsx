"use client"

import React, { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // Assuming you have toast configured

// Re-using the Post interface, omitting fields auto-generated or not set during creation
interface NewPostData {
    title: string;
    content?: string;
    status: string; // Default to 'Draft' perhaps?
    type: string;
    platform?: string;
    target_audience?: string;
    date?: string; // For event type
    location?: string; // For event type
    // user_id will be set based on logged-in user serverside or via session
}

// Available options (could be fetched from DB or constants)
const POST_TYPES = ['פוסט', 'מאמר', 'אירוע', 'חג', 'מערכת'];
const POST_STATUSES = ['טיוטה', 'מתוזמן', 'פורסם', 'בבדיקה']; // Exclude 'נדחה' for creation?
const PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'Blog', 'אחר'];

export default function CreatePostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<NewPostData>({
        title: '',
        content: '',
        status: 'טיוטה', // Default status
        type: 'פוסט',    // Default type
        platform: '',
        target_audience: '',
        date: '',
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof NewPostData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Basic Validation
        if (!formData.title || !formData.type || !formData.status) {
            setError("כותרת, סוג וסטטוס הם שדות חובה.");
            setIsSubmitting(false);
            return;
        }

        // TODO: Add user_id from authentication context
        const postDataToInsert = {
            ...formData,
            // user_id: 'user_id_from_auth', // Replace with actual user ID
            date: formData.type === 'אירוע' && formData.date ? formData.date : null, // Only save date if type is Event
            location: formData.type === 'אירוע' && formData.location ? formData.location : null, // Only save location if type is Event
        };

        try {
            const { error: insertError } = await supabase
                .from('posts')
                .insert([postDataToInsert]);

            if (insertError) {
                throw insertError;
            }

            toast({
                title: "הצלחה!",
                description: "הפוסט נוצר בהצלחה.",
                variant: "default", // Or use a success variant if defined
            });
            router.push('/dashboard/posts'); // Redirect back to the posts list

        } catch (err: any) {
            console.error("Error creating post:", err);
            setError(err.message || "שגיאה ביצירת הפוסט. נסה שוב.");
            toast({
                title: "שגיאה",
                description: err.message || "שגיאה ביצירת הפוסט. בדוק את הפרטים ונסה שוב.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">יצירת פוסט חדש</h1>
                <Link href="/dashboard/posts">
                    <Button variant="outline" className="flex items-center gap-1 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        חזרה לרשימת הפוסטים
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm border border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg">פרטי הפוסט</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-1">
                            <Label htmlFor="title">כותרת <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
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
                                value={formData.content}
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
                                    value={formData.type}
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
                                    value={formData.status}
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
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="border-gray-200"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="location">מיקום האירוע</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
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
                                    value={formData.platform}
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
                                    value={formData.target_audience}
                                    onChange={handleChange}
                                    placeholder="לדוגמה: לקוחות קיימים, מתעניינים חדשים"
                                    className="border-gray-200"
                                />
                            </div>
                        </div>

                        {/* Goals (Optional - Maybe a future enhancement with tags/multi-select) */}
                        {/* <div className="space-y-1">
                            <Label htmlFor="goals">מטרות (מופרד בפסיקים)</Label>
                            <Input
                                id="goals"
                                name="goals"
                                value={formData.goals?.join(', ') || ''}
                                onChange={(e) => handleSelectChange('goals', e.target.value.split(',').map(s => s.trim()))}
                                placeholder="הגברת מודעות, יצירת לידים..."
                                className="border-gray-200"
                            />
                        </div> */}

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
                                        יוצר פוסט...
                                    </>
                                ) : (
                                    'צור פוסט'
                                )}
                            </Button>
                         </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
} 