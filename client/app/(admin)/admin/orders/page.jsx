"use client";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "react-toastify";
import { Eye, Search, ChevronLeft, ChevronRight, ShoppingCart, CheckCircle, Clock, XCircle } from "lucide-react";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "total:desc", label: "Total: High to Low" },
  { value: "total:asc", label: "Total: Low to High" },
];

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
];

export default function OrdersPage() {
  const { getToken } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ pageCount: 1, total: 0 });
  const [sort, setSort] = useState("createdAt:desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, failed: 0 });

  const fetchOrders = async (pageOverride = null) => {
    const p = pageOverride ?? page;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getOrders(token, {
        search: searchTerm || undefined,
        page: p,
        pageSize: PAGE_SIZE,
        sort,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setOrders(response.data.data || []);
      setPaginationMeta(response.data.meta?.pagination || { pageCount: 1, total: 0 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [totalRes, paidRes, pendingRes, failedRes] = await Promise.all([
        adminAction.getOrders(token, { pageSize: 1 }),
        adminAction.getOrders(token, { pageSize: 1, status: "paid" }),
        adminAction.getOrders(token, { pageSize: 1, status: "pending" }),
        adminAction.getOrders(token, { pageSize: 1, status: "failed" }),
      ]);
      setStats({
        total: totalRes.data.meta?.pagination?.total ?? 0,
        paid: paidRes.data.meta?.pagination?.total ?? 0,
        pending: pendingRes.data.meta?.pagination?.total ?? 0,
        failed: failedRes.data.meta?.pagination?.total ?? 0,
      });
    } catch (e) {
      console.error("Error fetching order stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [sort, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders(1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchOrders(nextPage);
  };

  const handleViewOrder = async (orderId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await adminAction.getOrderById(orderId, token);
      setSelectedOrder(response.data.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = getToken();
      if (!token) return;

      await adminAction.updateOrderStatus(orderId, newStatus, token);
      toast.success("Order status updated successfully!");
      fetchOrders(page);
      fetchStats();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, attributes: { ...selectedOrder.attributes, status: newStatus } });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusObj = orderStatuses.find((s) => s.value === status) || orderStatuses[0];
    return (
      <Badge className={statusObj.color}>{statusObj.label}</Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-2">Manage and track customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-violet-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
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
            <div className="w-1 bg-green-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Paid</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.paid}</p>
                  <p className="mt-0.5 text-xs text-gray-400">completed</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.pending}</p>
                  <p className="mt-0.5 text-xs text-gray-400">awaiting payment</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-stretch">
            <div className="w-1 bg-red-500 flex-shrink-0" />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Failed</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.failed}</p>
                  <p className="mt-0.5 text-xs text-gray-400">unsuccessful</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
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
            placeholder="Search by order ID or name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {orderStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
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
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const attrs = order.attributes || {};
                const items = Array.isArray(attrs.items) ? attrs.items : [];
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{attrs.orderId || order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{attrs.userName || attrs.name || "Guest"}</div>
                        <div className="text-sm text-gray-500">{attrs.userEmail || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell>{items.length} item(s)</TableCell>
                    <TableCell className="font-medium">₹{attrs.total || 0}</TableCell>
                    <TableCell>
                      <select
                        value={attrs.status || "pending"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          orderStatuses.find((s) => s.value === (attrs.status || "pending"))?.color || ""
                        }`}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(attrs.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, paginationMeta.total)} of {paginationMeta.total} orders
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

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information and customer details
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Order ID:</span>{" "}
                      <span className="font-medium">#{selectedOrder.attributes?.orderId || selectedOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      {getStatusBadge(selectedOrder.attributes?.status || "pending")}
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>{" "}
                      <span className="font-medium">
                        {formatDate(selectedOrder.attributes?.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>{" "}
                      <span className="font-medium text-lg">
                        ₹{selectedOrder.attributes?.total || 0}
                      </span>
                    </div>
                    {selectedOrder.attributes?.paymentId && (
                      <div>
                        <span className="text-gray-500">Payment ID:</span>{" "}
                        <span className="font-medium">{selectedOrder.attributes.paymentId}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>{" "}
                      <span className="font-medium">
                        {selectedOrder.attributes?.userName || selectedOrder.attributes?.name || "Guest"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>{" "}
                      <span className="font-medium">
                        {selectedOrder.attributes?.userEmail || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>{" "}
                      <span className="font-medium">
                        {selectedOrder.attributes?.userPhone || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedOrder.attributes?.address ? (
                    <div>
                      <div>{selectedOrder.attributes.address}</div>
                      {selectedOrder.attributes.city && (
                        <div>
                          {selectedOrder.attributes.city}, {selectedOrder.attributes.state || ""}{" "}
                          {selectedOrder.attributes.pincode || ""}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400">No shipping address provided</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(selectedOrder.attributes?.items) && selectedOrder.attributes.items.length > 0 ? (
                        selectedOrder.attributes.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.name || item.title || item.plantName || "Product"}
                            </TableCell>
                            <TableCell>{item.quantity || 1}</TableCell>
                            <TableCell className="text-right">₹{item.price || 0}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{(item.price || 0) * (item.quantity || 1)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
