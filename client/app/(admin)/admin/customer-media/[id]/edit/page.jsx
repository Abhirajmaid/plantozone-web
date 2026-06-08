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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { toast } from "react-toastify";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "https://dashboard.plantozone.com";

const toMediaUrl = (url) => (url?.startsWith("http") ? url : `${STRAPI_BASE_URL}${url || ""}`);

const parseExistingImages = (imageField) => {
  const data = imageField?.data;
  if (!data) return [];
  const list = Array.isArray(data) ? data : [data];
  return list
    .filter(Boolean)
    .map((img) => ({
      id: img.id,
      url: toMediaUrl(img.attributes?.url),
    }));
};

export default function EditCustomerMediaPage() {
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
    customerName: "",
    productId: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (id) fetchMedia();
  }, [id]);

  const fetchMedia = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getCustomerMediaById(id, token);
      const item = response.data?.data;
      if (!item) {
        toast.error("Media not found");
        router.push("/admin/customer-media");
        return;
      }

      const attrs = item.attributes || {};
      const productId = attrs.product?.data?.id ?? attrs.product?.id;

      setFormData({
        title: attrs.title || "",
        description: attrs.description || "",
        customerName: attrs.customerName || "",
        productId: productId != null ? String(productId) : "",
      });
      setExistingImages(parseExistingImages(attrs.image));
    } catch (error) {
      console.error("Error fetching customer media:", error);
      toast.error(error.response?.data?.error?.message || "Failed to load media");
      router.push("/admin/customer-media");
    } finally {
      setFetching(false);
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
      const uploaded = (res.data || []).map((f) => ({
        id: f.id,
        url: toMediaUrl(f.url),
      }));
      setNewImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error?.message || "Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeExistingImage = (imgId) => setExistingImages((prev) => prev.filter((f) => f.id !== imgId));
  const removeNewImage = (imgId) => setNewImages((prev) => prev.filter((f) => f.id !== imgId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please log in");
        return;
      }
      setLoading(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        customerName: formData.customerName,
      };
      if (formData.productId) payload.product = formData.productId;
      const allIds = [...existingImages.map((f) => f.id), ...newImages.map((f) => f.id)];
      if (allIds.length) payload.image = allIds;
      await adminAction.updateCustomerMedia(id, payload, token);
      toast.success("Customer media updated");
      router.push("/admin/customer-media");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error?.message || "Failed to update media");
      setLoading(false);
    }
  };

  const allImages = [...existingImages, ...newImages];

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <Link href="/admin/customer-media" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Customer Media
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="text-xl">Edit Customer Media</CardTitle>
              <CardDescription>Update customer-submitted images or videos</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Short title"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productId">Product (optional)</Label>
                <Input
                  id="productId"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  placeholder="Product ID"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="text-xl">Media</CardTitle>
              <CardDescription>Upload or remove customer images and videos</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading || uploading}>
              <ImagePlus className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Add Media"}
            </Button>
            {allImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {existingImages.map((f) => (
                  <div key={`e-${f.id}`} className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
                    <Image src={f.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(f.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {newImages.map((f) => (
                  <div key={`n-${f.id}`} className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
                    <Image src={f.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(f.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/customer-media")} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
