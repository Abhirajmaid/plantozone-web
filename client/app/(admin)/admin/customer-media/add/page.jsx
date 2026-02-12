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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { toast } from "react-toastify";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function AddCustomerMediaPage() {
  const router = useRouter();
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customerName: "",
    productId: "",
  });
  const [imageFiles, setImageFiles] = useState([]); // { id, url }

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
        url: f.url?.startsWith("http") ? f.url : `${STRAPI_BASE_URL}${f.url}`,
      }));
      setImageFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (id) => setImageFiles((prev) => prev.filter((f) => f.id !== id));

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
      if (imageFiles.length) payload.image = imageFiles.map((f) => f.id);
      await adminAction.createCustomerMedia(payload, token);
      toast.success("Customer media added");
      router.push("/admin/customer-media");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create media");
      setLoading(false);
    }
  };

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
              <CardTitle className="text-xl">Add Customer Media</CardTitle>
              <CardDescription>Upload customer-submitted images or videos</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Short title" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" className="w-full min-h-[80px] px-3 py-2 border rounded-md" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productId">Product (optional)</Label>
                <Input id="productId" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} placeholder="Product ID" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="text-xl">Media</CardTitle>
              <CardDescription>Upload images or videos from the customer</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageSelect} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <ImagePlus className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Add Media"}
            </Button>
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imageFiles.map((f) => (
                  <div key={f.id} className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
                    <Image src={f.url} alt="" fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(f.id)} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600">
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
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}

