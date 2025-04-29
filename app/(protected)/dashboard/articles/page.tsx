"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash,
  Eye,
  Filter,
  Search,
  X,
  FileText,
  Users,
  ThumbsUp,
  BookOpen,
  BarChart,
  Star,
  Award,
  // Icons potentially relevant to platforms
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post, PostDisplayData } from "@/types/post";

// Import the extracted components
import { PostGridCard } from "@/components/post-grid-card";
import { PostListRow } from "@/components/post-list-row";

// Import Dialog components from shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose, // To close the dialog
} from "@/components/ui/dialog";

// Import the PostPublishStatus component
import { PostPublishStatus } from "@/components/post-publish-status";

// Adjusted FilterState for Posts
interface FilterState {
  searchTerm: string;
  platform: string[]; // Filter by platform instead of status/category
  sortBy: string;
  sortDirection: "asc" | "desc";
}

// Define platform mappings (customize as needed)
const platformStyleMapping: {
  [key: string]: { color: string; icon: React.ElementType };
} = {
  facebook: { color: "#1877F2", icon: Facebook },
  instagram: { color: "#E4405F", icon: Instagram },
  linkedin: { color: "#0A66C2", icon: Linkedin },
  twitter: { color: "#1DA1F2", icon: Twitter },
  general: { color: "#3498db", icon: Globe }, // Example default
  other: { color: "#7f8c8d", icon: MessageSquare }, // Example other
};

export default function PostsDashboardPage() {
  // Renamed component conceptually
  const [posts, setPosts] = useState<PostDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default to list view
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    platform: [], // Initialize platform filter
    sortBy: "created_at",
    sortDirection: "desc",
  });
  const router = useRouter();

  // State for the view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPostForView, setSelectedPostForView] =
    useState<PostDisplayData | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchPosts = async () => {
      // Renamed function
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from 'posts' table
        const { data, error: dbError } = await supabase
          .from("posts")
          .select("*") // Select all columns from posts
          .order(filters.sortBy, {
            ascending: filters.sortDirection === "asc",
          });

        if (dbError) {
          // Use specific error message if available
          throw new Error(dbError.message || `Posts fetch error`);
        }

        // Add computed styles/icons based on platform
        const processedData =
          data?.map((post): PostDisplayData => {
            const platformKey = post.platform?.toLowerCase() || "other";
            const platformStyle =
              platformStyleMapping[platformKey] ||
              platformStyleMapping["other"];
            return {
              ...(post as PostDisplayData), // Cast fetched data
              platformColor: platformStyle.color,
              icon: platformStyle.icon,
            };
          }) || [];

        setPosts(processedData);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

  // --- Filtering Logic ---
  const filteredPosts = useMemo(() => {
    // Renamed variable
    return posts.filter((post) => {
      const searchTermMatch =
        filters.searchTerm === "" ||
        post.content
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) || // Search content
        post.platform?.toLowerCase().includes(filters.searchTerm.toLowerCase()); // Search platform

      // Fix: Check if post.platform exists before calling includes
      const platformMatch =
        filters.platform.length === 0 ||
        (post.platform ? filters.platform.includes(post.platform) : false);

      return searchTermMatch && platformMatch;
    });
  }, [posts, filters.searchTerm, filters.platform]);

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Updated for platform filter
  const handleCheckboxFilterChange = (value: string) => {
    setFilters((prev) => {
      const currentValues = prev.platform;
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, platform: newValues };
    });
  };

  const handleSortChange = (newSortBy: string) => {
    // Ensure sorting by valid columns: content, platform, created_at, updated_at
    const validSortColumns = [
      "content",
      "platform",
      "created_at",
      "updated_at",
    ];
    if (!validSortColumns.includes(newSortBy)) {
      console.warn(`Invalid sort column attempted: ${newSortBy}`);
      return; // Don't update state if column is invalid
    }
    setFilters((prev) => {
      const newDirection =
        prev.sortBy === newSortBy && prev.sortDirection === "desc"
          ? "asc"
          : "desc";
      return { ...prev, sortBy: newSortBy, sortDirection: newDirection };
    });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      platform: [], // Clear platform filter
      sortBy: "created_at",
      sortDirection: "desc",
    });
  };

  // Updated for platform
  const getDistinctPlatforms = (): string[] => {
    return Array.from(
      new Set(
        posts
          .map((post) => post.platform)
          .filter((value) => value != null) as string[]
      )
    );
  };

  // Function to open the view modal
  const handleViewPost = (post: PostDisplayData) => {
    setSelectedPostForView(post);
    setIsViewModalOpen(true);
  };

  // --- Render Logic ---
  const renderSortIcon = (column: string) => {
    if (filters.sortBy !== column) return null;
    return filters.sortDirection === "desc" ? (
      <ChevronDown className="h-4 w-4 ml-1" />
    ) : (
      <ChevronUp className="h-4 w-4 ml-1" />
    );
  };

  // Main component return
  return (
    <>
      {" "}
      {/* Use Fragment to wrap page content and Dialog */}
      <div className="p-4 md:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center">
          {/* Changed title to Posts */}
          <h1 className="text-2xl font-bold text-gray-800">ניהול פוסטים</h1>
          <div className="flex items-center gap-2">
            {/* Link to post creation */}
            <Link href="/post-creation">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm">
                <Plus className="ml-1 h-4 w-4" />
                צור פוסט חדש
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="flex items-center gap-1 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                חזרה לדשבורד
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי תוכן, פלטפורמה..." // Updated placeholder
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="pl-10 pr-3 py-2 text-sm border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              {/* Platform Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-sm border-gray-200">
                    פלטפורמה{" "}
                    {filters.platform.length > 0
                      ? `(${filters.platform.length})`
                      : ""}
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {getDistinctPlatforms().map(
                    (
                      platform // Use distinct platforms
                    ) => (
                      <DropdownMenuCheckboxItem
                        key={platform}
                        checked={filters.platform.includes(platform)}
                        onCheckedChange={() =>
                          handleCheckboxFilterChange(platform)
                        } // Updated handler call
                      >
                        {platform}
                      </DropdownMenuCheckboxItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Removed Status Filter Dropdown */}
              {/* Removed Category Filter Dropdown */}

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 px-2"
                >
                  תצוגת כרטיסיות
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-7 px-2"
                >
                  תצוגת רשימה
                </Button>
              </div>

              {(filters.searchTerm || filters.platform.length > 0) && ( // Check platform filter
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-700 h-8 px-2"
                >
                  <X className="ml-1 h-4 w-4" />
                  נקה פילטרים
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-3 text-purple-700">טוען פוסטים...</p>{" "}
            {/* Updated text */}
          </div>
        )}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Content Display Area */}
        {!isLoading && !error && (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>לא נמצאו פוסטים התואמים את הסינון.</p>
              </div>
            ) : viewMode === "grid" ? (
              // Grid View - Use imported PostGridCard component
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPosts.map(
                  (
                    post // Iterate over filteredPosts
                  ) => (
                    <PostGridCard key={post.id} post={post} /> // Pass each post to the component
                  )
                )}
              </div>
            ) : (
              // List View - Use imported PostListRow component
              <Card className="overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("content")}
                        >
                          <div className="flex items-center">
                            תוכן {renderSortIcon("content")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("platform")}
                        >
                          <div className="flex items-center">
                            פלטפורמה {renderSortIcon("platform")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("created_at")}
                        >
                          <div className="flex items-center">
                            תאריך יצירה {renderSortIcon("created_at")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("updated_at")}
                        >
                          <div className="flex items-center">
                            תאריך עדכון {renderSortIcon("updated_at")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          פעולות
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredPosts.map(
                        (
                          post // Iterate over filteredPosts
                        ) => (
                          <PostListRow
                            key={post.id}
                            post={post}
                            onViewPost={handleViewPost}
                          /> // Pass post and handler
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
            {/* TODO: Add Pagination if needed */}
          </>
        )}
      </div>
      {/* View Post Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              פרטי פוסט (ID: {selectedPostForView?.id?.substring(0, 8)}...)
            </DialogTitle>
            <DialogDescription>
              פלטפורמה: {selectedPostForView?.platform || "N/A"} | נוצר:{" "}
              {selectedPostForView
                ? new Date(selectedPostForView.created_at).toLocaleString(
                    "he-IL"
                  )
                : ""}
            </DialogDescription>
          </DialogHeader>

          {/* Add the PostPublishStatus component */}
          {selectedPostForView && (
            <div className="mb-4">
              <PostPublishStatus post={selectedPostForView} />
            </div>
          )}

          <div className="py-4 whitespace-pre-wrap break-words">
            {/* Display full content */}
            {selectedPostForView?.content}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                סגור
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
