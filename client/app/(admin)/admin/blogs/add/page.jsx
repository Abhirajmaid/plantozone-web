"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

export default function AddBlogPage() {
  const router = useRouter();
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    blog: "",
    publish: false,
  });
  const [imageFile, setImageFile] = useState(null); // { id, url } from upload

  const buildPayload = () => {
    const data = {
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date || undefined,
      slug: formData.slug || undefined,
      blog: formData.blog || undefined,
    };
    if (imageFile?.id) data.image = imageFile.id;
    if (formData.publish) data.publishedAt = new Date().toISOString();
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
      await adminAction.createBlog(data, token);
      toast.success("Blog created successfully!");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(error.response?.data?.error?.message || "Failed to create blog");
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
        setImageFile({
          id: first.id,
          url: first.url?.startsWith("http") ? first.url : `${STRAPI_BASE_URL}${first.url}`,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => setImageFile(null);

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
                  placeholder="Auto-generated from title if empty"
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
                  <Label htmlFor="publish" className="cursor-pointer">Publish immediately</Label>
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
              {uploading ? "Uploading..." : "Add Image"}
            </Button>
            {imageFile && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border bg-gray-100">
                <Image src={imageFile.url} alt="" fill className="object-cover" />
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
            {loading ? "Creating..." : "Create Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
}
