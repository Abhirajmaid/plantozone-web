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
import { ArrowLeft, Users, Image as ImageIcon, ImagePlus, X } from "lucide-react";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    order: 0,
    publish: false,
  });
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [clearImage, setClearImage] = useState(false);

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await adminAction.getTeamMemberById(id, token);
      const member = response.data?.data;
      if (!member) {
        toast.error("Team member not found");
        router.push("/admin/team");
        return;
      }
      const attrs = member.attributes || {};
      const img = attrs.image?.data;
      if (img?.attributes?.url) {
        setExistingImage({
          id: img.id,
          url: img.attributes.url.startsWith("http") ? img.attributes.url : `${STRAPI_BASE_URL}${img.attributes.url}`,
        });
      }
      setFormData({
        name: attrs.name || "",
        role: attrs.role || "",
        bio: attrs.bio || "",
        order: attrs.order ?? 0,
        publish: !!attrs.publishedAt,
      });
    } catch (error) {
      console.error("Error fetching team member:", error);
      toast.error("Failed to load team member");
      router.push("/admin/team");
    } finally {
      setFetching(false);
    }
  };

  const buildPayload = () => {
    const data = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio || undefined,
      order: Number(formData.order) || 0,
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
      await adminAction.updateTeamMember(id, data, token);
      toast.success("Team member updated!");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error(error.response?.data?.error?.message || "Failed to update team member");
      setLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const token = getToken();
    if (!token) return;
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
        href="/admin/team"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Team
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Team Member Details</CardTitle>
                <CardDescription>Name, role, and bio (shown on About Us)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Jane Smith"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Founder & CEO"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="order">Display order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: e.target.value }))}
                  placeholder="0"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">Lower numbers appear first on the About Us page.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md border-input"
                  value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  disabled={loading}
                  placeholder="Short description..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="publish"
                    checked={!!formData.publish}
                    onCheckedChange={(c) => setFormData((p) => ({ ...p, publish: !!c }))}
                    disabled={loading}
                  />
                  <Label htmlFor="publish" className="cursor-pointer">Published (show on About Us page)</Label>
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
                <CardTitle className="text-xl">Photo</CardTitle>
                <CardDescription>Team photo (shown on About Us)</CardDescription>
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

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/team")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Saving..." : "Update Team Member"}
          </Button>
        </div>
      </form>
    </div>
  );
}
