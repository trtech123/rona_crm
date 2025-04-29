"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
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
  MessageSquare,
  User,
  Link as LinkIcon,
  ThumbsUp,
  BookOpen,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PostPublishStatus } from "@/components/post-publish-status";

// Interface for Comment data (Adapt based on actual Supabase 'comments' table)
interface Comment {
  id: string; // Assuming UUID from Supabase
  created_at: string;
  post_id?: string; // Assuming UUID foreign key
  user_id?: string; // From Supabase auth or related user table
  lead_name: string; // Correct field from table
  content: string; // Correct field from table
  source?: string; // Correct field for platform/source
  external_id?: string; // Platform-specific comment ID
  statusColor?: string; // May need to remove or derive differently
  platformColor?: string; // Derive from 'source'
  platformIcon?: React.ElementType; // Derive from 'source'
}

// Adjusted FilterState for Comments
interface FilterState {
  searchTerm: string;
  status: string[];
  platform: string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
}

// Mappings for colors (adjust as needed for comment statuses and platforms)
const commentStatusStyleMapping: { [key: string]: { color: string } } = {
  "ברירת מחדל": { color: "#bdc3c7" }, // Keep a default
};

// Update platform mapping to use potential values from 'source' column
const platformStyleMapping: {
  [key: string]: { color: string; icon: React.ElementType };
} = {
  facebook: { color: "#3b5998", icon: MessageSquare },
  instagram: { color: "#e1306c", icon: MessageSquare },
  api: { color: "#8e44ad", icon: LinkIcon }, // Example for API source
  manual: { color: "#2c3e50", icon: Edit }, // Example for manual entry
  default: { color: "#7f8c8d", icon: MessageSquare }, // Default/fallback
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    status: [],
    platform: [],
    sortBy: "created_at",
    sortDirection: "desc",
  });
  const router = useRouter();

  // --- State for Post View Modal ---
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedCommentForPostView, setSelectedCommentForPostView] =
    useState<Comment | null>(null);
  const [viewedPostDetails, setViewedPostDetails] = useState<Post | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  // ---------------------------------

  // --- Fetch Post Details ---
  const fetchPostDetails = async (postId: string) => {
    if (!postId) {
      setPostError("No Post ID provided for this comment.");
      return;
    }
    setIsPostLoading(true);
    setPostError(null);
    setViewedPostDetails(null);
    console.log(
      `[${new Date().toISOString()}] Fetching details for post ID: ${postId}`
    );
    try {
      const { data: postData, error: postDbError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (postDbError) {
        console.error(
          `[${new Date().toISOString()}] Supabase post fetch error:`,
          postDbError
        );
        throw new Error(
          `Failed to fetch post details: ${
            postDbError.message || "Post not found or access denied"
          }`
        );
      }

      if (!postData) {
        throw new Error("Post not found.");
      }

      console.log(
        `[${new Date().toISOString()}] Successfully fetched post details:`,
        postData
      );
      setViewedPostDetails(postData as Post);
    } catch (err: any) {
      console.error("Error fetching post details:", err);
      setPostError(err.message || "Failed to load post information.");
    } finally {
      setIsPostLoading(false);
    }
  };
  // -------------------------

  // --- Click/Key Handlers for Viewing Post ---
  const handleViewPost = (comment: Comment) => {
    if (!comment.post_id) {
      console.warn("Comment has no post_id to view.");
      return;
    }
    setSelectedCommentForPostView(comment);
    setIsPostModalOpen(true);
    fetchPostDetails(comment.post_id);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement | HTMLDivElement>,
    comment: Comment
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleViewPost(comment);
    }
  };
  // ----------------------------------------

  // --- Data Fetching (Comments) ---
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      console.log(
        `[${new Date().toISOString()}] Fetching comments with filters:`,
        JSON.stringify(filters)
      );
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error(
            `[${new Date().toISOString()}] Error getting session just before fetch:`,
            sessionError
          );
        } else {
          console.log(
            `[${new Date().toISOString()}] Supabase session status just before fetch:`,
            session
              ? `Authenticated (User ID: ${session.user.id})`
              : "Not Authenticated"
          );
        }

        const { data, error: dbError } = await supabase
          .from("comments")
          .select(
            "id, created_at, post_id, lead_name, content, source, external_id, user_id"
          )
          .order(filters.sortBy, {
            ascending: filters.sortDirection === "asc",
          });

        console.log(
          `[${new Date().toISOString()}] Raw data from Supabase:`,
          data
        );
        if (dbError) {
          console.error(
            `[${new Date().toISOString()}] Supabase fetch error object:`,
            dbError
          );
          throw new Error(`Comments fetch error: ${dbError.message}`);
        }

        const processedData =
          data?.map((comment) => {
            const statusStyle = commentStatusStyleMapping["ברירת מחדל"];
            const platformKey = comment.source?.toLowerCase() || "default";
            const platformStyle =
              platformStyleMapping[platformKey] ||
              platformStyleMapping["default"];
            return {
              ...comment,
              statusColor: statusStyle.color,
              platformColor: platformStyle.color,
              platformIcon: platformStyle.icon,
            } as Comment;
          }) || [];

        console.log("Processed data before setting state:", processedData);
        setComments(processedData);
      } catch (err: any) {
        console.error("Error fetching comments:", err);
        setError(err.message || "Failed to fetch comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [filters.sortBy, filters.sortDirection]);
  // -------------------------------

  // --- Filtering Logic (Comments) ---
  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const searchTermMatch =
        filters.searchTerm === "" ||
        comment.lead_name
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        comment.content
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const statusMatch =
        filters.status.length === 0 ||
        filters.status.includes(comment.source || "default");
      const platformMatch =
        filters.platform.length === 0 ||
        filters.platform.includes(comment.source || "default");

      return searchTermMatch && statusMatch && platformMatch;
    });
  }, [comments, filters.searchTerm, filters.status, filters.platform]);
  // -------------------------------

  // --- Event Handlers (Similar to Leads/Posts) ---
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxFilterChange = (
    key: "status" | "platform",
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[key];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleSortChange = (newSortBy: string) => {
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
      status: [],
      platform: [],
      sortBy: "created_at",
      sortDirection: "desc",
    });
  };

  const getDistinctValues = (key: keyof Comment): string[] => {
    return Array.from(
      new Set(
        comments
          .map((comment) => comment[key])
          .filter((value) => value != null) as string[]
      )
    );
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

  // --- Grid View Card (Adapted for Comments) ---
  const CommentGridCard = ({ comment }: { comment: Comment }) => (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4 ${
        comment.post_id ? "cursor-pointer hover:bg-gray-50" : "cursor-default"
      }`}
      style={{ borderLeftColor: comment.statusColor }}
      onClick={() => handleViewPost(comment)}
      onKeyDown={(e) => handleKeyDown(e, comment)}
      role={comment.post_id ? "button" : undefined}
      tabIndex={comment.post_id ? 0 : -1}
      aria-label={
        comment.post_id
          ? `View details for post related to comment by ${comment.lead_name}`
          : `Comment by ${comment.lead_name}`
      }
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>
              {comment.lead_name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span
                className="font-semibold text-sm text-gray-800 truncate"
                title={comment.lead_name}
              >
                {comment.lead_name}
              </span>
              {comment.platformIcon && (
                <comment.platformIcon
                  className="h-4 w-4 text-gray-400 flex-shrink-0"
                  title={comment.source}
                />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              על פוסט ID: {comment.post_id?.substring(0, 8) || "N/A"}...
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-snug max-h-20 overflow-hidden relative group">
          {comment.content}
          <span className="absolute bottom-0 right-0 bg-gradient-to-t from-white via-white to-transparent w-full h-5 group-hover:hidden"></span>
        </p>

        <div className="flex items-center justify-between pt-1">
          <Badge
            variant="secondary"
            className="text-xs py-0.5 px-1.5"
            style={{
              backgroundColor: `${comment.platformColor}20`,
              color: comment.platformColor,
            }}
          >
            {comment.source || "לא ידוע"}
          </Badge>
          <span className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleDateString("he-IL")}
          </span>
        </div>

        <div className="flex justify-end items-center gap-1 pt-1 border-t border-gray-100 mt-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full hover:bg-blue-100"
            title="השב"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full hover:bg-red-100"
            title="מחק"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // --- List View Row (Adapted for Comments) ---
  const CommentListRow = ({ comment }: { comment: Comment }) => (
    <tr
      className={`hover:bg-gray-50 border-b last:border-b-0 text-sm ${
        comment.post_id ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={() => handleViewPost(comment)}
      onKeyDown={(e) => handleKeyDown(e, comment)}
      role={comment.post_id ? "button" : undefined}
      tabIndex={comment.post_id ? 0 : -1}
      aria-label={
        comment.post_id
          ? `View details for post related to comment by ${comment.lead_name}`
          : `Comment by ${comment.lead_name}`
      }
    >
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border">
            <AvatarFallback className="text-[10px]">
              {comment.lead_name?.charAt(0)?.toUpperCase() || "-"}
            </AvatarFallback>
          </Avatar>
          <span
            className="font-medium text-gray-800 truncate"
            title={comment.lead_name}
          >
            {comment.lead_name}
          </span>
        </div>
      </td>
      <td className="px-3 py-2">
        <p className="text-gray-700 truncate max-w-xs" title={comment.content}>
          {comment.content}
        </p>
      </td>
      <td className="px-3 py-2">
        <Badge
          variant="secondary"
          className="text-xs"
          style={{
            backgroundColor: `${comment.platformColor}20`,
            color: comment.platformColor,
          }}
        >
          {comment.source || "לא ידוע"}
        </Badge>
      </td>
      <td className="px-3 py-2">
        {comment.platformIcon && (
          <comment.platformIcon
            className="h-4 w-4 inline-block mr-1"
            style={{ color: comment.platformColor }}
            title={comment.source}
          />
        )}
        {comment.source ?? "-"}
      </td>
      <td className="px-3 py-2 text-gray-600">
        {new Date(comment.created_at).toLocaleDateString("he-IL")}
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded hover:bg-blue-100"
            title="השב"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded hover:bg-red-100"
            title="מחק"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="p-4 md:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ניהול תגובות</h1>
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

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי מחבר, תוכן, פוסט..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="pl-10 pr-3 py-2 text-sm border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-sm border-gray-200">
                    סטטוס{" "}
                    {filters.status.length > 0
                      ? `(${filters.status.length})`
                      : ""}
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {getDistinctValues("source").map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() =>
                        handleCheckboxFilterChange("status", status)
                      }
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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
                  {getDistinctValues("source").map((platform) => (
                    <DropdownMenuCheckboxItem
                      key={platform}
                      checked={filters.platform.includes(platform)}
                      onCheckedChange={() =>
                        handleCheckboxFilterChange("platform", platform)
                      }
                    >
                      {platform}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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

              {(filters.searchTerm ||
                filters.status.length > 0 ||
                filters.platform.length > 0) && (
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
            <p className="ml-3 text-purple-700">טוען תגובות...</p>
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
            {filteredComments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>לא נמצאו תגובות התואמות את הסינון.</p>
              </div>
            ) : viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredComments.map((comment) => (
                  <CommentGridCard key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              // List View
              <Card className="overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("lead_name")}
                        >
                          <div className="flex items-center">
                            מחבר {renderSortIcon("lead_name")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          תוכן
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("source")}
                        >
                          <div className="flex items-center">
                            סטטוס/מקור {renderSortIcon("source")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("source")}
                        >
                          <div className="flex items-center">
                            פלטפורמה/מקור {renderSortIcon("source")}
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
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          פעולות
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredComments.map((comment) => (
                        <CommentListRow key={comment.id} comment={comment} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
            {/* TODO: Add Pagination if needed */}
          </>
        )}
      </div>

      {/* View Post Dialog - Use structure from articles page */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              פרטי פוסט מקושר (ID: {viewedPostDetails?.id?.substring(0, 8)}...)
            </DialogTitle>
            <DialogDescription>
              פלטפורמה: {(viewedPostDetails as any)?.platform || "N/A"} | נוצר:{" "}
              {viewedPostDetails
                ? new Date(viewedPostDetails.createdAt).toLocaleString("he-IL")
                : ""}
            </DialogDescription>
          </DialogHeader>

          {/* Loading and Error States for Post */}
          {isPostLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="ml-3 text-purple-700">טוען פרטי פוסט...</p>
            </div>
          )}
          {postError && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 text-center text-sm">
              <p>{postError}</p>
            </div>
          )}

          {/* Display Post Content if loaded */}
          {!isPostLoading && !postError && viewedPostDetails && (
            <>
              {/* Add the PostPublishStatus component (ensure viewedPostDetails has needed fields) */}
              <div className="mb-4">
                {/* Use viewedPostDetails here */}
                <PostPublishStatus post={viewedPostDetails as any} />
              </div>

              {/* Generate Facebook Link if applicable */}
              {(() => {
                const platform = (viewedPostDetails as any)?.platform;
                const postIdString = (viewedPostDetails as any)?.post_id;
                if (
                  platform === "facebook" &&
                  typeof postIdString === "string" &&
                  postIdString.includes("_")
                ) {
                  const parts = postIdString.split("_");
                  if (parts.length === 2) {
                    const [page_id, post_id_suffix] = parts;
                    const facebookUrl = `https://www.facebook.com/${page_id}/posts/${post_id_suffix}`;
                    return (
                      <div className="mb-3">
                        <Button
                          variant="link"
                          asChild
                          className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        >
                          <a
                            href={facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkIcon className="ml-1.5 h-3.5 w-3.5" />
                            צפה בפוסט המקורי בפייסבוק
                          </a>
                        </Button>
                      </div>
                    );
                  }
                }
                return null; // Return null if not a valid Facebook post ID
              })()}

              {/* Display post title (optional - not in screenshot but might be useful) */}
              {viewedPostDetails.title && (
                <h3 className="font-semibold mb-2 text-lg">
                  {viewedPostDetails.title}
                </h3>
              )}

              {/* Display post content */}
              <div className="py-4 whitespace-pre-wrap break-words text-sm">
                {viewedPostDetails.content}
              </div>
            </>
          )}

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
