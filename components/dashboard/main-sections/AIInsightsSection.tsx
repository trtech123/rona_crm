"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

const AIInsightsSection = () => (
     <Card className="shadow-sm border border-purple-100 rounded-xl bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <CardHeader className="p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
                 <Sparkles className="h-5 w-5 text-purple-500" />
                 <CardTitle className="text-lg text-purple-800">תובנות AI</CardTitle>
            </div>
            <CardDescription className="text-purple-700/80">המלצות חכמות לשיפור הביצועים</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-5 pt-0 space-y-2.5">
            {/* Placeholder Insight Items - Replace with dynamic data later */}
            <div className="bg-white/70 p-3 rounded-lg shadow-xs flex justify-between items-center border border-purple-100/50 hover:bg-white transition-colors">
                 <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-gray-800 mb-0.5">הפוסט "דירת גן" מצליח במיוחד!</p>
                    <p className="text-xs text-gray-500">שקול ליצור תוכן דומה בנושא גינות.</p>
                 </div>
                 {/* Add onClick handlers */}
                 <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 h-8 px-2 rounded-md">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
            </div>
             <div className="bg-white/70 p-3 rounded-lg shadow-xs flex justify-between items-center border border-purple-100/50 hover:bg-white transition-colors">
                <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-gray-800 mb-0.5">זמן טוב לפרסום - הקהל שלך פעיל כעת.</p>
                    <p className="text-xs text-gray-500">פרסום בין 18:00-20:00 מומלץ.</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 h-8 px-2 rounded-md">צור פוסט <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
             </div>
             <div className="pt-1">
                 <Button variant="link" className="text-purple-600 hover:text-purple-800 p-0 h-auto text-sm">הצג את כל התובנות</Button>
             </div>
        </CardContent>
    </Card>
);

export default AIInsightsSection; 