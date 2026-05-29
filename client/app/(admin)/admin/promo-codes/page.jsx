"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import adminAction from "@/src/lib/action/admin.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
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
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Search, Tag, Percent, Sparkles, Wand2 } from "lucide-react";
import { generatePromoCode, GENERATOR_PRESETS } from "@/src/lib/promoCodeGenerator";

const emptyForm = {
  code: "",
  discountPercent: "",
  description: "",
  isActive: true,
  firstOrderOnly: false,
  minOrderAmount: "",
  maxUses: "",
  validFrom: "",
  validUntil: "",
  showInBanner: false,
};

export default function PromoCodesPage() {
  const { getToken } = useAdminAuth();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;
      const res = await adminAction.getPromoCodes(token, {
        search: searchTerm || undefined,
        pageSize: 100,
      });
      setPromos(res.data.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleSearch = () => fetchPromos();

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const openEdit = (promo) => {
    const a = promo.attributes || {};
    setEditing(promo);
    setFormData({
      code: a.code || "",
      discountPercent: String(a.discountPercent ?? ""),
      description: a.description || "",
      isActive: a.isActive !== false,
      firstOrderOnly: !!a.firstOrderOnly,
      minOrderAmount: a.minOrderAmount ? String(a.minOrderAmount) : "",
      maxUses: a.maxUses != null ? String(a.maxUses) : "",
      validFrom: a.validFrom ? a.validFrom.slice(0, 16) : "",
      validUntil: a.validUntil ? a.validUntil.slice(0, 16) : "",
      showInBanner: !!a.showInBanner,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const code = formData.code.trim().toUpperCase();
    const percent = Number(formData.discountPercent);
    if (!code || !percent || percent < 1 || percent > 100) {
      toast.error("Code and discount % (1–100) are required");
      return;
    }

    const payload = {
      code,
      discountPercent: percent,
      description: formData.description || null,
      isActive: formData.isActive,
      firstOrderOnly: formData.firstOrderOnly,
      minOrderAmount: formData.minOrderAmount
        ? Number(formData.minOrderAmount)
        : 0,
      maxUses: formData.maxUses ? Number(formData.maxUses) : null,
      validFrom: formData.validFrom || null,
      validUntil: formData.validUntil || null,
      showInBanner: formData.showInBanner,
    };

    try {
      if (editing) {
        await adminAction.updatePromoCode(editing.id, payload, token);
        toast.success("Promo code updated");
      } else {
        await adminAction.createPromoCode(
          { ...payload, usedCount: 0 },
          token
        );
        toast.success("Promo code created");
      }
      setIsDialogOpen(false);
      fetchPromos();
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to save promo code"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promo code?")) return;
    try {
      const token = getToken();
      await adminAction.deletePromoCode(id, token);
      toast.success("Promo code deleted");
      fetchPromos();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const activeCount = promos.filter((p) => p.attributes?.isActive !== false).length;

  const handleGenerateCode = (prefix = "PLANT") => {
    const code = generatePromoCode(prefix);
    setFormData((prev) => ({ ...prev, code }));
    setEditing(null);
    setIsDialogOpen(true);
    toast.info(`Generated: ${code}`);
  };

  const applyPreset = (preset) => {
    const code =
      preset.code || generatePromoCode(preset.prefix || "PLANT");
    setFormData({
      ...emptyForm,
      code,
      discountPercent: String(preset.percent),
      description: preset.label,
      firstOrderOnly: !!preset.firstOrderOnly,
      showInBanner: !!preset.showInBanner,
      isActive: true,
    });
    setEditing(null);
    setIsDialogOpen(true);
  };

  const generateAndSave = async (preset) => {
    const token = getToken();
    if (!token) return;
    const code =
      preset.code || generatePromoCode(preset.prefix || "PLANT");
    try {
      await adminAction.createPromoCode(
        {
          code,
          discountPercent: preset.percent,
          description: preset.label,
          isActive: true,
          firstOrderOnly: !!preset.firstOrderOnly,
          showInBanner: !!preset.showInBanner,
          usedCount: 0,
        },
        token
      );
      toast.success(`Created ${code} (${preset.percent}% off)`);
      fetchPromos();
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to create code"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-500 mt-2">
            Manage checkout discount codes (e.g. FIRST125)
          </p>
        </div>
        <Button onClick={openCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Promo Code
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total codes</p>
            <p className="text-3xl font-bold">{promos.length}</p>
          </div>
          <Tag className="h-8 w-8 text-green-600" />
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-3xl font-bold">{activeCount}</p>
          </div>
          <Percent className="h-8 w-8 text-green-600" />
        </Card>
      </div>

      <Card className="p-6 border-green-100 bg-green-50/40">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Coupon Code Generator
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate random codes or create presets. Codes work on cart & checkout
              automatically.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-green-600 text-green-700 shrink-0"
            onClick={() => handleGenerateCode("PLANT")}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Random code
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENERATOR_PRESETS.map((preset) => (
            <div
              key={preset.label}
              className="flex flex-wrap items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-800">
                {preset.label}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => applyPreset(preset)}
              >
                Edit & save
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700"
                onClick={() => generateAndSave(preset)}
              >
                Create now
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4 sm:mr-2" />
          Search
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No promo codes. Add FIRST125 (25% off, first order) to get started.
                </TableCell>
              </TableRow>
            ) : (
              promos.map((promo) => {
                const a = promo.attributes || {};
                return (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-bold">{a.code}</TableCell>
                    <TableCell>{a.discountPercent}%</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          a.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {a.usedCount ?? 0}
                      {a.maxUses ? ` / ${a.maxUses}` : ""}
                    </TableCell>
                    <TableCell>{a.showInBanner ? "Yes" : "—"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(promo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Promo Code" : "Add Promo Code"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Code *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="FIRST125"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      code: generatePromoCode("PLANT"),
                    }))
                  }
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Discount % *</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData({ ...formData, discountPercent: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="First order discount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min order (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Max uses</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUses: e.target.value })
                  }
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valid from</Label>
                <Input
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Valid until</Label>
                <Input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.firstOrderOnly}
                onChange={(e) =>
                  setFormData({ ...formData, firstOrderOnly: e.target.checked })
                }
              />
              First order only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.showInBanner}
                onChange={(e) =>
                  setFormData({ ...formData, showInBanner: e.target.checked })
                }
              />
              Show in top site banner
            </label>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
