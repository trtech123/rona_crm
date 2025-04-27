"use client";

import React from 'react';
import { DashboardSection } from '../layout/DashboardLayout'; // Assuming DashboardSection is in layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

interface LatestLeadsPanelProps {
    setActiveSection: (section: DashboardSection) => void;
}

const LatestLeadsPanel: React.FC<LatestLeadsPanelProps> = ({ setActiveSection }) => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base">לידים אחרונים</CardTitle>
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-800 h-7 px-2 rounded text-xs font-medium"
                onClick={() => setActiveSection('leads')}
            >
                הצג הכל <ArrowLeft className="h-3 w-3 mr-1"/>
            </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            {/* Placeholder Leads - Replace with dynamic data later */}
            <ul className="space-y-3 mb-4">
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">ישראל ישראלי</span>
                    {/* Add onClick handler for lead details */}
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">דנה כהן</span>
                     <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                 <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">אבי לוי</span>
                     <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
            </ul>
            <Button 
                className="w-full h-9 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 hover:text-blue-700 flex items-center justify-center"
                onClick={() => setActiveSection('leads')}
            >
                <Users className="h-4 w-4 ml-1.5" />
                הצג את כל הלידים
            </Button>
        </CardContent>
    </Card>
);

export default LatestLeadsPanel; 