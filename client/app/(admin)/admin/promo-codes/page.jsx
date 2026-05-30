"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import promoAdminAction from "@/src/lib/action/promoAdmin.action";
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
import {
  generatePromoCode,
  GENERATOR_PRESETS,
  presetToFormFields,
} from "@/src/lib/promoCodeGenerator";
import {
  DEFAULT_BANNER_CODE,
  defaultValidUntilDateTime,
  formatPromoExpiry,
  isDefaultPromoCode,
} from "@/src/lib/promoConstants";
import { Checkbox } from "@/src/components/ui/checkbox";

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
      const res = await promoAdminAction.getPromoCodes(token, {
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
    setFormData({
      ...emptyForm,
      validUntil: defaultValidUntilDateTime(30),
    });
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
    const isDefault = isDefaultPromoCode(code);

    if (!code || !percent || percent < 1 || percent > 100) {
      toast.error("Code and discount % (1–100) are required");
      return;
    }

    if (!isDefault && !editing && !formData.validUntil) {
      toast.error("Valid until (expiry) is required for new promo codes");
      return;
    }

    if (
      !isDefault &&
      formData.showInBanner &&
      !formData.validUntil
    ) {
      toast.error("Set expiry date before enabling top banner");
      return;
    }

    if (
      !isDefault &&
      formData.validUntil &&
      new Date(formData.validUntil).getTime() <= Date.now() &&
      !editing
    ) {
      toast.error("Expiry must be in the future");
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
        await promoAdminAction.updatePromoCode(editing.id, payload, token);
        toast.success("Promo code updated");
      } else {
        await promoAdminAction.createPromoCode(
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
      await promoAdminAction.deletePromoCode(id, token);
      toast.success("Promo code deleted");
      fetchPromos();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const sortedPromos = [...promos].sort((a, b) => {
    const ac = (a.attributes?.code || "").toUpperCase();
    const bc = (b.attributes?.code || "").toUpperCase();
    if (ac === DEFAULT_BANNER_CODE) return -1;
    if (bc === DEFAULT_BANNER_CODE) return 1;
    return ac.localeCompare(bc);
  });

  const isExpired = (attrs) =>
    attrs?.validUntil &&
    Date.now() > new Date(attrs.validUntil).getTime();

  const activeCount = promos.filter(
    (p) => p.attributes?.isActive !== false && !isExpired(p.attributes)
  ).length;

  const handleBannerToggle = async (promo, checked) => {
    const a = promo.attributes || {};
    const code = (a.code || "").toUpperCase();

    if (checked && !isDefaultPromoCode(code) && isExpired(a)) {
      toast.error("This code has expired. Extend the date or create a new code.");
      openEdit(promo);
      return;
    }

    const updatePayload = { showInBanner: checked };

    if (checked && !isDefaultPromoCode(code) && !a.validUntil) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      d.setHours(23, 59, 0, 0);
      updatePayload.validUntil = d.toISOString();
    }

    try {
      const token = getToken();
      await promoAdminAction.updatePromoCode(promo.id, updatePayload, token);
      toast.success(
        checked
          ? updatePayload.validUntil
            ? "Shown in top banner (30-day expiry set)"
            : "Shown in top banner"
          : "Removed from top banner"
      );
      fetchPromos();
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to update banner setting"
      );
    }
  };

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
      ...presetToFormFields(preset),
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
      const { validUntil } = presetToFormFields(preset);
      await promoAdminAction.createPromoCode(
        {
          code,
          discountPercent: preset.percent,
          description: preset.label,
          isActive: true,
          firstOrderOnly: !!preset.firstOrderOnly,
          showInBanner: !!preset.showInBanner,
          validUntil: validUntil || null,
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
            <strong>{DEFAULT_BANNER_CODE}</strong> is the default top-bar promo.
            Other codes auto-disable and leave the banner when their expiry time passes.
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
              <TableHead>Expires</TableHead>
              <TableHead className="text-center">Top banner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No promo codes. Add FIRST125 (25% off, first order) to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedPromos.map((promo) => {
                const a = promo.attributes || {};
                const expired = isExpired(a);
                const isDefault = isDefaultPromoCode(a.code);
                const statusActive = a.isActive !== false && !expired;
                return (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-bold">
                      <span className="flex flex-wrap items-center gap-2">
                        {a.code}
                        {isDefault && (
                          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                            Default
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{a.discountPercent}%</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusActive
                            ? "bg-green-100 text-green-800"
                            : expired
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {expired
                          ? "Expired"
                          : a.isActive !== false
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {a.usedCount ?? 0}
                      {a.maxUses ? ` / ${a.maxUses}` : ""}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[140px]">
                      {isDefault && !a.validUntil
                        ? "No expiry"
                        : formatPromoExpiry(a.validUntil)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={!!a.showInBanner}
                        disabled={expired && !isDefault}
                        onCheckedChange={(checked) =>
                          handleBannerToggle(promo, checked === true)
                        }
                        aria-label={`Show ${a.code} in top banner`}
                      />
                    </TableCell>
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
                <Label>
                  Valid until{" "}
                  {!editing && !isDefaultPromoCode(formData.code) ? "*" : ""}
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  required={
                    !editing && !isDefaultPromoCode(formData.code)
                  }
                />
                {isDefaultPromoCode(formData.code) ? (
                  <p className="text-xs text-amber-700 mt-1">
                    Default code — expiry optional; stays on banner unless you turn it off.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Required. Code auto-disables and leaves the top bar after this time.
                  </p>
                )}
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
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <Checkbox
                checked={formData.showInBanner}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showInBanner: checked === true })
                }
              />
              <span>
                Show in top site banner
                {isDefaultPromoCode(formData.code) && (
                  <span className="text-amber-700"> (recommended for default)</span>
                )}
              </span>
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
