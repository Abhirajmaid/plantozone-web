"use client";
import { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, Leaf, Image as ImageIcon, IndianRupee, BadgePercent, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function AddPlantPage() {
  const router = useRouter();
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    rating: "",
    stock: "",
    enableSmall: false,
    enableMedium: false,
    enableLarge: false,
    priceSmall: "",
    priceMedium: "",
    priceLarge: "",
    discountPercent: "",
    offerStart: "",
    offerEnd: "",
  });
  const [imageFiles, setImageFiles] = useState([]); // { id, url } from upload
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setFetchingCategories(false);
        return;
      }
      try {
        const res = await adminAction.getCategories(token);
        setCategories(res.data?.data || []);
      } catch (e) {
        console.error("Error fetching categories:", e);
      } finally {
        setFetchingCategories(false);
      }
    };
    load();
  }, []);

  const buildPayload = () => {
    const catId = formData.category ? parseInt(formData.category, 10) : null;
    const base = {
      title: formData.title,
      description: formData.description,
      stock: parseInt(formData.stock) || 0,
      categories: { set: catId ? [catId] : [] },
      rating: parseFloat(formData.rating) || 0,
      enableSizeOptions: true,
      discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : undefined,
      offerStart: formData.offerStart || undefined,
      offerEnd: formData.offerEnd || undefined,
    };
    let displayPrice = 0;
    if (formData.enableSmall) {
      base.priceSmall = parseFloat(formData.priceSmall) || 0;
      if (!displayPrice) displayPrice = base.priceSmall;
    }
    if (formData.enableMedium) {
      base.priceMedium = parseFloat(formData.priceMedium) || 0;
      if (!displayPrice) displayPrice = base.priceMedium;
    }
    if (formData.enableLarge) {
      base.priceLarge = parseFloat(formData.priceLarge) || 0;
      if (!displayPrice) displayPrice = base.priceLarge;
    }
    base.price = displayPrice;
    if (imageFiles.length) base.images = imageFiles.map((f) => f.id);
    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.enableSmall && !formData.enableMedium && !formData.enableLarge) {
      toast.error("At least one size (Small, Medium, or Large) must be enabled.");
      return;
    }
    if (formData.enableSmall && (formData.priceSmall === "" || formData.priceSmall == null)) {
      toast.error("Price for Small is required when Small is enabled.");
      return;
    }
    if (formData.enableMedium && (formData.priceMedium === "" || formData.priceMedium == null)) {
      toast.error("Price for Medium is required when Medium is enabled.");
      return;
    }
    if (formData.enableLarge && (formData.priceLarge === "" || formData.priceLarge == null)) {
      toast.error("Price for Large is required when Large is enabled.");
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please log in to continue");
        return;
      }
      setLoading(true);
      const data = buildPayload();
      await adminAction.createPlant(data, token);
      toast.success("Plant created successfully!");
      router.push("/admin/plants");
    } catch (error) {
      console.error("Error creating plant:", error);
      toast.error(error.response?.data?.error?.message || "Failed to create plant");
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
      const uploaded = (res.data || []).map((f) => ({
        id: f.id,
        url: f.url?.startsWith("http") ? f.url : `${STRAPI_BASE_URL}${f.url}`,
      }));
      setImageFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error?.message || "Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (id) => setImageFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="space-y-6 w-full">
      <Link
        href="/admin/plants"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plants
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Plant Details */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Plant Details</CardTitle>
                <CardDescription>Basic information about the plant</CardDescription>
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
                  placeholder="e.g. Monstera Deliciosa"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md border-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  placeholder="Describe the plant, care tips, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={loading || fetchingCategories}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => {
                    const attrs = c.attributes || {};
                    const label = attrs.title || attrs.name || attrs.slug || c.name || c.slug || `Category #${c.id}`;
                    return <option key={c.id} value={c.id}>{label}</option>;
                  })}
                </select>
                {!fetchingCategories && categories.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No categories yet. <Link href="/admin/categories" className="text-green-600 hover:underline">Add categories</Link>.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  disabled={loading}
                  placeholder="0–5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Available quantity"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Images */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Images</CardTitle>
                <CardDescription>Upload plant images. You can add multiple.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
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
              {uploading ? "Uploading..." : "Add Images"}
            </Button>
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imageFiles.map((f) => (
                  <div key={f.id} className="relative w-24 h-24 rounded-lg overflow-hidden border bg-gray-100">
                    <Image src={f.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(f.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Pricing & Sizes */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <IndianRupee className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Pricing & Sizes</CardTitle>
                <CardDescription>Enable at least one size and set its price. You can enable Small, Medium, and/or Large.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enableSmall"
                    checked={!!formData.enableSmall}
                    onCheckedChange={(c) => setFormData({ ...formData, enableSmall: !!c })}
                    disabled={loading}
                  />
                  <Label htmlFor="enableSmall" className="font-medium cursor-pointer">Enable Small</Label>
                </div>
                <Label>Price – Small (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceSmall}
                  onChange={(e) => setFormData({ ...formData, priceSmall: e.target.value })}
                  disabled={loading || !formData.enableSmall}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enableMedium"
                    checked={!!formData.enableMedium}
                    onCheckedChange={(c) => setFormData({ ...formData, enableMedium: !!c })}
                    disabled={loading}
                  />
                  <Label htmlFor="enableMedium" className="font-medium cursor-pointer">Enable Medium</Label>
                </div>
                <Label>Price – Medium (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceMedium}
                  onChange={(e) => setFormData({ ...formData, priceMedium: e.target.value })}
                  disabled={loading || !formData.enableMedium}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enableLarge"
                    checked={!!formData.enableLarge}
                    onCheckedChange={(c) => setFormData({ ...formData, enableLarge: !!c })}
                    disabled={loading}
                  />
                  <Label htmlFor="enableLarge" className="font-medium cursor-pointer">Enable Large</Label>
                </div>
                <Label>Price – Large (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceLarge}
                  onChange={(e) => setFormData({ ...formData, priceLarge: e.target.value })}
                  disabled={loading || !formData.enableLarge}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Offers */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <BadgePercent className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Offers & Promotions</CardTitle>
                <CardDescription>Optional discount and offer period.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Discount (%)</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  disabled={loading}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerStart">Offer Start</Label>
                <Input
                  id="offerStart"
                  type="date"
                  value={formData.offerStart}
                  onChange={(e) => setFormData({ ...formData, offerStart: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerEnd">Offer End</Label>
                <Input
                  id="offerEnd"
                  type="date"
                  value={formData.offerEnd}
                  onChange={(e) => setFormData({ ...formData, offerEnd: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/plants")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Creating..." : "Create Plant"}
          </Button>
        </div>
      </form>
    </div>
  );
}
