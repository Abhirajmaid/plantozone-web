"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Layers, FileText, FileX, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "title:asc", label: "Title A–Z" },
  { value: "title:desc", label: "Title Z–A" },
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
];

export default function CategoriesPage() {
  const { getToken } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ pageCount: 1, total: 0 });
  const [sort, setSort] = useState("title:asc");
  const [descFilter, setDescFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, withDescription: 0, withoutDescription: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const fileInputRef = useRef(null);
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [clearImage, setClearImage] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async (pageOverride = null) => {
    const p = pageOverride ?? page;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getCategories(token, {
        search: searchTerm || undefined,
        page: p,
        pageSize: PAGE_SIZE,
        sort,
        hasDescription: descFilter !== "all" ? descFilter : undefined,
      });
      setCategories(response.data.data || []);
      setPaginationMeta(response.data.meta?.pagination || { pageCount: 1, total: 0 });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [totalRes, withRes, withoutRes] = await Promise.all([
        adminAction.getCategories(token, { pageSize: 1 }),
        adminAction.getCategories(token, { pageSize: 1, hasDescription: "yes" }),
        adminAction.getCategories(token, { pageSize: 1, hasDescription: "no" }),
      ]);
      setStats({
        total: totalRes.data.meta?.pagination?.total ?? 0,
        withDescription: withRes.data.meta?.pagination?.total ?? 0,
        withoutDescription: withoutRes.data.meta?.pagination?.total ?? 0,
      });
    } catch (e) {
      console.error("Error fetching category stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCategories(1);
  }, [sort, descFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchCategories(1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchCategories(nextPage);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", slug: "" });
    setExistingImage(null);
    setNewImage(null);
    setClearImage(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (category) => {
    const attrs = category.attributes || {};
    setEditingCategory(category);
    setFormData({
      name: attrs.title || attrs.name || "",
      description: attrs.description || "",
      slug: attrs.slug || "",
    });
    const img = attrs.image?.data;
    if (img?.attributes?.url) {
      setExistingImage({
        id: img.id,
        url: img.attributes.url.startsWith("http") ? img.attributes.url : `${STRAPI_BASE_URL}${img.attributes.url}`,
      });
    } else {
      setExistingImage(null);
    }
    setNewImage(null);
    setClearImage(false);
    setIsDialogOpen(true);
  };

  const handleImageSelect = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const token = getToken();
    if (!token) {
      toast.error("Please log in to upload images");
      return;
    }
    setUploading(true);
    try {
      const res = await adminAction.uploadImages(files, token);
      const first = res.data?.[0];
      if (first) {
        setNewImage({
          id: first.id,
          url: first.url?.startsWith("http") ? first.url : `${STRAPI_BASE_URL}${first.url}`,
        });
        setClearImage(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setNewImage(null);
    if (editingCategory && existingImage) setClearImage(true);
  };

  const displayImage = newImage ?? (!clearImage && existingImage) ? (newImage || existingImage) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) return;

      const data = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      };
      if (newImage) data.image = newImage.id;
      else if (editingCategory && clearImage) data.image = null;

      if (editingCategory) {
        await adminAction.updateCategory(editingCategory.id, data, token);
        toast.success("Category updated successfully!");
      } else {
        await adminAction.createCategory(data, token);
        toast.success("Category created successfully!");
      }

      setIsDialogOpen(false);
      fetchCategories(page);
      fetchStats();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.error?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = getToken();
      if (!token) return;

      await adminAction.deleteCategory(id, token);
      toast.success("Category deleted successfully!");
      fetchCategories(page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (loading && categories.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-2">Manage product categories</p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Categories</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
                  <p className="mt-0.5 text-xs text-gray-400">in catalog</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Layers className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">With Description</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.withDescription}</p>
                  <p className="mt-0.5 text-xs text-gray-400">has details</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">No Description</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.withoutDescription}</p>
                  <p className="mt-0.5 text-xs text-gray-400">needs details</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <FileX className="h-6 w-6 text-amber-600" />
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
            placeholder="Search categories..."
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
            value={descFilter}
            onChange={(e) => { setDescFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="yes">With description</option>
            <option value="no">No description</option>
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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                const attrs = category.attributes || {};
                const imgUrl = attrs.image?.data?.attributes?.url
                  ? (attrs.image.data.attributes.url.startsWith("http") ? attrs.image.data.attributes.url : `${STRAPI_BASE_URL}${attrs.image.data.attributes.url}`)
                  : null;
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                        {imgUrl ? (
                          <Image src={imgUrl} alt={attrs.title || "Category"} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attrs.title || attrs.name || "-"}</TableCell>
                    <TableCell className="text-gray-500">{attrs.slug || "-"}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {attrs.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, paginationMeta.total)} of {paginationMeta.total} categories
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category information"
                : "Add a new category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Auto-generated from name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : displayImage ? "Replace Image" : "Add Image"}
              </Button>
              {displayImage && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-gray-100 mt-2">
                  <Image src={displayImage.url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
