 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Card } from "@/src/components/ui/card";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function CustomerMediaPage() {
  const { getToken } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await adminAction.getCustomerMedia(token, { pageSize: 100 });
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Error fetching customer media:", err);
      toast.error("Failed to load customer media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = async () => {
      const token = getToken();
      if (!token) return;
      await fetchItems();
    };
    t();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this media item?")) return;
    try {
      const token = getToken();
      await adminAction.deleteCustomerMedia(id, token);
      toast.success("Deleted");
      fetchItems();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "/images/plant.png";
    const url = image.attributes?.url;
    if (!url) return "/images/plant.png";
    return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
  };

  if (loading && items.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Customer Media</h1>
          <p className="text-gray-500 mt-2">User submitted photos and videos</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/customer-media/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Media
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No media found
                </TableCell>
              </TableRow>
            ) : (
              items.map((it) => {
                const attrs = it.attributes || {};
                const image = attrs.image?.data;
                return (
                  <TableRow key={it.id}>
                    <TableCell>
                      <div className="w-24 h-16 relative rounded overflow-hidden bg-gray-100">
                        {image ? (
                          <Image src={getImageUrl(image)} alt={attrs.title || ""} fill className="object-cover" />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{attrs.title || "-"}</TableCell>
                    <TableCell>{attrs.customerName || "-"}</TableCell>
                    <TableCell>{new Date(attrs.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/customer-media/${it.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(it.id)} className="text-red-600 hover:text-red-700">
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
    </div>
  );
}

