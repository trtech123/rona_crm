"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, CheckSquare, Calendar, FileText } from 'lucide-react';

const DashboardSummaryRow = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-6 md:mb-8">
        {/* Example Summary Cards - Replace with dynamic data later */}
        <Card className="shadow-sm border border-gray-100 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">לידים (היום)</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">+5</div>
                <p className="text-xs text-gray-500">סה"כ 120</p>
            </CardContent>
        </Card>
         <Card className="shadow-sm border border-gray-100 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">תגובות (היום)</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">+12</div>
                 <p className="text-xs text-gray-500">סה"כ 85</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100 rounded-xl">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">משימות להיום</CardTitle>
                <CheckSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">3</div>
                 <p className="text-xs text-gray-500">סה"כ 15 פתוחות</p>
            </CardContent>
        </Card>
         <Card className="shadow-sm border border-gray-100 rounded-xl hidden md:block">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">אירועים קרובים</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">2</div>
                 <p className="text-xs text-gray-500">החודש</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100 rounded-xl hidden lg:block">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">מאמרים פעילים</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">8</div>
                 <p className="text-xs text-gray-500">5 טיוטות</p>
            </CardContent>
        </Card>
    </div>
);

export default DashboardSummaryRow; 