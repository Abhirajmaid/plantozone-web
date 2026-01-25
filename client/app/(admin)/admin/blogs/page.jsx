"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, FileText, CheckCircle, FileEdit } from "lucide-react";
import Image from "next/image";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "title:asc", label: "Title A–Z" },
  { value: "title:desc", label: "Title Z–A" },
  { value: "date:desc", label: "Date: Newest" },
  { value: "date:asc", label: "Date: Oldest" },
];

export default function BlogsPage() {
  const { getToken } = useAdminAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ pageCount: 1, total: 0 });
  const [sort, setSort] = useState("createdAt:desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  const fetchBlogs = async (pageOverride = null) => {
    const p = pageOverride ?? page;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getBlogs(token, {
        search: searchTerm || undefined,
        page: p,
        pageSize: PAGE_SIZE,
        sort,
        statusFilter: statusFilter !== "all" ? statusFilter : undefined,
      });
      setBlogs(response.data.data || []);
      setPaginationMeta(response.data.meta?.pagination || { pageCount: 1, total: 0 });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [totalRes, publishedRes, draftRes] = await Promise.all([
        adminAction.getBlogs(token, { pageSize: 1 }),
        adminAction.getBlogs(token, { pageSize: 1, statusFilter: "published" }),
        adminAction.getBlogs(token, { pageSize: 1, statusFilter: "draft" }),
      ]);
      setStats({
        total: totalRes.data.meta?.pagination?.total ?? 0,
        published: publishedRes.data.meta?.pagination?.total ?? 0,
        draft: draftRes.data.meta?.pagination?.total ?? 0,
      });
    } catch (e) {
      console.error("Error fetching blog stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchBlogs(1);
  }, [sort, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchBlogs(1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchBlogs(nextPage);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const token = getToken();
      if (!token) return;

      await adminAction.deleteBlog(id, token);
      toast.success("Blog deleted successfully!");
      fetchBlogs(page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const getImageUrl = (image) => {
    if (!image?.data?.attributes?.url) return null;
    const url = image.data.attributes.url;
    return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-2">Manage blog posts</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/blogs/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Blog
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-green-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Blogs</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
                  <p className="mt-0.5 text-xs text-gray-400">in catalog</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-blue-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Published</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.published}</p>
                  <p className="mt-0.5 text-xs text-gray-400">live</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-amber-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Drafts</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.draft}</p>
                  <p className="mt-0.5 text-xs text-gray-400">unpublished</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <FileEdit className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search, filters, sort */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No blogs found
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => {
                const attrs = blog.attributes || {};
                const imgUrl = getImageUrl(attrs.image);
                const isPublished = !!attrs.publishedAt;
                return (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={attrs.title || "Blog"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attrs.title || "-"}</TableCell>
                    <TableCell className="text-gray-500">{attrs.slug || "-"}</TableCell>
                    <TableCell className="text-gray-500">{formatDate(attrs.date || attrs.createdAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          isPublished ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginationMeta.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, paginationMeta.total)} of {paginationMeta.total} blogs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-2">
              Page {page} of {paginationMeta.pageCount || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= (paginationMeta.pageCount || 1) || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
