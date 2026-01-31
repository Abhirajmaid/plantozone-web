"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Search, Users, CheckCircle, FileEdit } from "lucide-react";
import Image from "next/image";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function TeamPage() {
  const { getToken } = useAdminAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;
      const response = await adminAction.getTeamMembers(token, {
        search: searchTerm || undefined,
        statusFilter: statusFilter !== "all" ? statusFilter : undefined,
      });
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [totalRes, publishedRes, draftRes] = await Promise.all([
        adminAction.getTeamMembers(token, { pageSize: 1 }),
        adminAction.getTeamMembers(token, { pageSize: 1, statusFilter: "published" }),
        adminAction.getTeamMembers(token, { pageSize: 1, statusFilter: "draft" }),
      ]);
      setStats({
        total: totalRes.data.meta?.pagination?.total ?? 0,
        published: publishedRes.data.meta?.pagination?.total ?? 0,
        draft: draftRes.data.meta?.pagination?.total ?? 0,
      });
    } catch (e) {
      console.error("Error fetching team stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [statusFilter]);

  const handleSearch = () => {
    fetchTeam();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      const token = getToken();
      if (!token) return;
      await adminAction.deleteTeamMember(id, token);
      toast.success("Team member removed");
      fetchTeam();
      fetchStats();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  const getImageUrl = (image) => {
    if (!image?.data?.attributes?.url) return null;
    const url = image.data.attributes.url;
    return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
  };

  if (loading && members.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-2">Manage team members (About Us page)</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/team/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <div className="flex flex-stretch">
            <div className="w-1 bg-green-500 flex-shrink-0" />
            <div className="flex-1 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
                <p className="mt-0.5 text-xs text-gray-400">team members</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <div className="flex flex-stretch">
            <div className="w-1 bg-blue-500 flex-shrink-0" />
            <div className="flex-1 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Published</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.published}</p>
                <p className="mt-0.5 text-xs text-gray-400">on About Us</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <div className="flex flex-stretch">
            <div className="w-1 bg-amber-500 flex-shrink-0" />
            <div className="flex-1 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Drafts</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{stats.draft}</p>
                <p className="mt-0.5 text-xs text-gray-400">unpublished</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <FileEdit className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4 sm:mr-2" />
            Search
          </Button>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No team members yet. Add one to show on the About Us page.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const attrs = member.attributes || {};
                const imgUrl = getImageUrl(attrs.image);
                const isPublished = !!attrs.publishedAt;
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="w-14 h-14 relative rounded-full overflow-hidden bg-gray-100">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={attrs.name || "Team member"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attrs.name || "-"}</TableCell>
                    <TableCell className="text-gray-500">{attrs.role || "-"}</TableCell>
                    <TableCell className="text-gray-500">{attrs.order ?? 0}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          isPublished ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/team/${member.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.id)}
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
    </div>
  );
}
