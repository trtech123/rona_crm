"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const QuickActionsPanel = () => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4">
            <CardTitle className="text-base">פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
             {/* Add onClick handlers later */}
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> פוסט חדש</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> מאמר חדש</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> משימה חדשה</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> אירוע חדש</Button>
        </CardContent>
    </Card>
);

export default QuickActionsPanel; 