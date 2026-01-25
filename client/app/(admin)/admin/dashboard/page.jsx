"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Package, FolderTree, ShoppingCart, Users, FileText } from "lucide-react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { getToken } = useAdminAuth();
  const [stats, setStats] = useState({
    totalPlants: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await adminAction.getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to Plantozone Admin Panel</p>
      </div>

      {/* Stats - same card style as Orders, Plants, Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-green-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Plants</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.totalPlants}</p>
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Categories</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.totalCategories}</p>
                  <p className="mt-0.5 text-xs text-gray-400">in catalog</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <FolderTree className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-violet-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.totalOrders}</p>
                  <p className="mt-0.5 text-xs text-gray-400">all time</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <ShoppingCart className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-orange-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.totalUsers}</p>
                  <p className="mt-0.5 text-xs text-gray-400">registered</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity - same card style as Orders/Plants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <Link
              href="/admin/plants"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600" />
                <span className="font-medium">Manage Plants</span>
              </div>
            </Link>
            <Link
              href="/admin/categories"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderTree className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Manage Categories</span>
              </div>
            </Link>
            <Link
              href="/admin/blogs"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Manage Blogs</span>
              </div>
            </Link>
            <Link
              href="/admin/orders"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-violet-600" />
                <span className="font-medium">View Orders</span>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System is running smoothly</p>
                  <p className="text-xs text-gray-500 mt-1">All services operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
