"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { toast } from "react-toastify";
import { ArrowLeft, FileText, Image as ImageIcon, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    date: "",
    blog: "",
    publish: false,
  });
  const [existingImage, setExistingImage] = useState(null); // { id, url }
  const [newImage, setNewImage] = useState(null); // { id, url } from upload
  const [clearImage, setClearImage] = useState(false);

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getBlogById(id, token);
      const blog = response.data?.data;
      if (!blog) {
        toast.error("Blog not found");
        router.push("/admin/blogs");
        return;
      }

      const attrs = blog.attributes || {};
      const img = attrs.image?.data;
      if (img?.attributes?.url) {
        setExistingImage({
          id: img.id,
          url: img.attributes.url.startsWith("http") ? img.attributes.url : `${STRAPI_BASE_URL}${img.attributes.url}`,
        });
      }

      const d = attrs.date || attrs.createdAt;
      setFormData({
        title: attrs.title || "",
        description: attrs.description || "",
        slug: attrs.slug || "",
        date: d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        blog: typeof attrs.blog === "string" ? attrs.blog : "",
        publish: !!attrs.publishedAt,
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error(error.response?.data?.error?.message || "Failed to load blog");
      router.push("/admin/blogs");
    } finally {
      setFetching(false);
    }
  };

  const buildPayload = () => {
    const data = {
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date || undefined,
      slug: formData.slug || undefined,
      blog: formData.blog || undefined,
      publishedAt: formData.publish ? new Date().toISOString() : null,
    };
    if (newImage?.id) data.image = newImage.id;
    else if (clearImage) data.image = null;
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please log in to continue");
        return;
      }
      setLoading(true);
      const data = buildPayload();
      await adminAction.updateBlog(id, data, token);
      toast.success("Blog updated successfully!");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(error.response?.data?.error?.message || "Failed to update blog");
      setLoading(false);
    }
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
    setClearImage(true);
  };

  const displayImage = newImage || (!clearImage && existingImage) ? (newImage || existingImage) : null;

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blogs
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Blog Details</CardTitle>
                <CardDescription>Basic information for the blog post</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="e.g. How to Care for Your Plants"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description (excerpt)</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md border-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  placeholder="Short summary for listings"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  disabled={loading}
                  placeholder="URL-friendly identifier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="publish"
                    checked={!!formData.publish}
                    onCheckedChange={(c) => setFormData({ ...formData, publish: !!c })}
                    disabled={loading}
                  />
                  <Label htmlFor="publish" className="cursor-pointer">Published</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Featured Image</CardTitle>
                <CardDescription>Single image for the blog post</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : displayImage ? "Replace Image" : "Add Image"}
            </Button>
            {displayImage && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border bg-gray-100">
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
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Content</CardTitle>
            <CardDescription>Main blog body (richtext). You can use plain text or HTML.</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              id="blog"
              className="w-full min-h-[200px] px-3 py-2 border rounded-md border-input font-mono text-sm"
              value={formData.blog}
              onChange={(e) => setFormData({ ...formData, blog: e.target.value })}
              disabled={loading}
              placeholder="Write your blog content here..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blogs")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Saving..." : "Update Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
}
