"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutGrid,
  Users,
  ClipboardList,
  Calendar,
  FileText,
  Bot,
  PlusCircle,
  Settings,
  User,
  MessageSquare,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  href: string;
  subItems?: {
    id: string;
    name: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
    { id: 'dashboard', name: 'לוח בקרה', icon: Home, href: '/dashboard' },
    { id: 'posts', name: 'היצירות שלי', icon: LayoutGrid, href: '/posts' }, 
    { 
        id: 'leads', 
        name: 'לידים', 
        icon: Users, 
        href: '/dashboard/leads',
        subItems: [
            { id: 'leads-list', name: 'רשימת לידים', href: '/dashboard/leads' },
            { id: 'comments', name: 'תגובות', href: '/dashboard/comments' }
        ]
    },
    { id: 'tasks', name: 'משימות', icon: ClipboardList, href: '/dashboard/tasks' },
    { id: 'events', name: 'אירועים', icon: Calendar, href: '/dashboard/events' },
    { id: 'articles', name: 'מאמרים', icon: FileText, href: '/dashboard/articles' },
    { id: 'aiAutomations', name: 'אוטומציות AI', icon: Bot, href: '/dashboard/ai-automations' },
    { id: 'postCreation', name: 'יצירת פוסט', icon: PlusCircle, href: '/post-creation' },
    { id: 'settings', name: 'הגדרות', icon: Settings, href: '/settings' },
    { id: 'profile', name: 'פרופיל', icon: User, href: '/profile' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2">
          <span className="text-lg font-semibold">Rona CRM</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || item.subItems?.some(subItem => pathname === subItem.href)}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              {item.subItems && (
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === subItem.href}
                      >
                        <Link href={subItem.href}>
                          <span>{subItem.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip="הגדרות"
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>הגדרות</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/profile'}
              tooltip="פרופיל"
            >
              <Link href="/profile">
                <User className="h-4 w-4" />
                <span>פרופיל</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 