"use client";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Package, FolderTree, ShoppingCart, Users } from "lucide-react";
import { toast } from "react-toastify";

export default function StatsPage() {
  const { getToken } = useAdminAuth();
  const [stats, setStats] = useState({
    totalPlants: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const [dashboardStats, ordersResponse] = await Promise.all([
        adminAction.getDashboardStats(token),
        adminAction.getOrders(token, { pageSize: 10 }),
      ]);

      setStats({
        ...dashboardStats,
        recentOrders: ordersResponse.data.data || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
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
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-500 mt-2">Analytics and insights for your store</p>
      </div>

      {/* Stats - same card style as Orders and Plants */}
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

      {/* Recent Orders & Performance Metrics - same card style as Orders/Plants content areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent orders
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => {
                  const attrs = order.attributes || {};
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">Order #{attrs.orderId || order.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(attrs.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{attrs.total || 0}</div>
                        <div className="text-xs text-gray-500">
                          {attrs.status || "pending"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Average Order Value</div>
                  <div className="text-sm text-gray-500">Last 30 days</div>
                </div>
                <div className="text-2xl font-bold text-green-600">₹0</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Conversion Rate</div>
                  <div className="text-sm text-gray-500">Last 30 days</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">0%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Total Revenue</div>
                  <div className="text-sm text-gray-500">All time</div>
                </div>
                <div className="text-2xl font-bold text-violet-600">₹0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
