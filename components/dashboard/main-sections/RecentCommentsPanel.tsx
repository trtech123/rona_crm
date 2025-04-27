"use client";

import React from 'react';
import { DashboardSection } from '../layout/DashboardLayout'; // Assuming DashboardSection is in layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface RecentCommentsPanelProps {
    setActiveSection: (section: DashboardSection) => void;
}

const RecentCommentsPanel: React.FC<RecentCommentsPanelProps> = ({ setActiveSection }) => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base">תגובות אחרונות</CardTitle>
             <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-600 hover:text-orange-800 h-7 px-2 rounded text-xs font-medium"
                onClick={() => setActiveSection('comments')}
            >
                הצג הכל <ArrowLeft className="h-3 w-3 mr-1"/>
            </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
             {/* Placeholder Comments - Replace with dynamic data later */}
             <ul className="space-y-3 mb-4">
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">משה לוי: "...מחיר?"</span>
                    {/* Add onClick handler for replying */}
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800 h-7 px-1.5 rounded">הגב <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                 <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">שרה כהן: "אפשר עוד..."</span>
                     <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800 h-7 px-1.5 rounded">הגב <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                {/* ... more comments ... */}
            </ul>
             <Button 
                className="w-full h-9 text-sm rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 hover:text-orange-700 flex items-center justify-center"
                onClick={() => setActiveSection('comments')}
            >
                 <MessageSquare className="h-4 w-4 ml-1.5" />
                 צפה בכל התגובות
            </Button>
        </CardContent>
    </Card>
);

export default RecentCommentsPanel; 