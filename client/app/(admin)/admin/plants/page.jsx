"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Card } from "@/src/components/ui/card";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Package, Inbox, AlertCircle } from "lucide-react";
import Image from "next/image";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "title:asc", label: "Title A–Z" },
  { value: "title:desc", label: "Title Z–A" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "stock:desc", label: "Stock: High to Low" },
  { value: "stock:asc", label: "Stock: Low to High" },
];

export default function PlantsPage() {
  const { getToken } = useAdminAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ pageCount: 1, total: 0 });
  const [sort, setSort] = useState("createdAt:desc");
  const [categoryId, setCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0 });

  const fetchPlants = async (pageOverride = null) => {
    const p = pageOverride ?? page;
    setLoading(true);
    try {
      const token = getToken();
      const params = {
        search: searchTerm || undefined,
        page: p,
        pageSize: PAGE_SIZE,
        sort,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
        stockFilter: stockFilter !== "all" ? stockFilter : undefined,
      };
      const response = await adminAction.getPlants(token, params);
      setPlants(response.data.data || []);
      setPaginationMeta(response.data.meta?.pagination || { pageCount: 1, total: 0 });
    } catch (error) {
      console.error("Error fetching plants:", error);
      const errorMessage = error.response?.data?.error?.message || error.message || "Failed to load plants";
      toast.error(errorMessage);
      if (error.response?.status === 403) {
        console.error("403 Forbidden - Check if NEXT_PUBLIC_STRAPI_API_TOKEN is set in .env file");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [totalRes, inRes, outRes] = await Promise.all([
        adminAction.getPlants(token, { pageSize: 1 }),
        adminAction.getPlants(token, { pageSize: 1, inStock: true }),
        adminAction.getPlants(token, { pageSize: 1, outOfStock: true }),
      ]);
      setStats({
        total: totalRes.data.meta?.pagination?.total ?? 0,
        inStock: inRes.data.meta?.pagination?.total ?? 0,
        outOfStock: outRes.data.meta?.pagination?.total ?? 0,
      });
    } catch (e) {
      console.error("Error fetching plant stats:", e);
    }
  };

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await adminAction.getCategories(token);
        setCategories(res.data?.data || []);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPlants(1);
  }, [sort, categoryId, stockFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchPlants(1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchPlants(nextPage);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;

    try {
      const token = getToken();
      if (!token) return;

      await adminAction.deletePlant(id, token);
      toast.success("Plant deleted successfully!");
      fetchPlants();
      fetchStats();
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast.error("Failed to delete plant");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "/images/plant.png";
    const url = image.attributes?.url;
    if (!url) return "/images/plant.png";
    return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
  };

  const formatPriceWithSizes = (attrs) => {
    const parts = [];
    const add = (label, val) => {
      const n = parseFloat(val);
      if (val != null && val !== "" && !isNaN(n) && n >= 0) parts.push(`${label}: ₹${Math.round(n).toLocaleString("en-IN")}`);
    };
    add("Small", attrs.priceSmall);
    add("Medium", attrs.priceMedium);
    add("Large", attrs.priceLarge);
    if (parts.length > 0) return parts.join(", ");
    return `₹${Number(attrs.price || 0).toLocaleString("en-IN")}`;
  };

  if (loading && plants.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Plants</h1>
          <p className="text-gray-500 mt-2">Manage your plant inventory</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/plants/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Plant
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Plants</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
                  <p className="mt-0.5 text-xs text-gray-400">in catalog</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Package className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Stock</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.inStock}</p>
                  <p className="mt-0.5 text-xs text-gray-400">available</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Inbox className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Out of Stock</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.outOfStock}</p>
                  <p className="mt-0.5 text-xs text-gray-400">need restock</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
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
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.attributes?.title || c.attributes?.name || c.attributes?.slug || `Category #${c.id}`}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
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
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No plants found
                </TableCell>
              </TableRow>
            ) : (
              plants.map((plant) => {
                const attrs = plant.attributes || {};
                const image = attrs.images?.data?.[0];
                return (
                  <TableRow key={plant.id}>
                    <TableCell>
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getImageUrl(image)}
                          alt={attrs.title || "Plant"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attrs.title}</TableCell>
                    <TableCell className="text-sm">{formatPriceWithSizes(attrs)}</TableCell>
                    <TableCell>{attrs.stock || 0}</TableCell>
                    <TableCell>{attrs.categories?.data?.[0]?.attributes?.title || attrs.categories?.data?.[0]?.attributes?.name || attrs.category || "-"}</TableCell>
                    <TableCell>{attrs.rating || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/plants/${plant.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(plant.id)}
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
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, paginationMeta.total)} of {paginationMeta.total} plants
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
