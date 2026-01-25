"use client";

import { useState, useEffect } from "react";
import plantsAction from "@/src/lib/action/plants.action";
import categoriesAction from "@/src/lib/action/categories.action";

export default function StatsBar({ className = "", compact = false }) {
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [plantsCount, setPlantsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [plantsRes, categoriesRes] = await Promise.all([
          plantsAction.getPlants(),
          categoriesAction.getCategories(),
        ]);
        setPlantsCount(plantsRes?.data?.meta?.pagination?.total ?? 0);
        setCategoriesCount(categoriesRes?.data?.meta?.pagination?.total ?? 0);
      } catch (e) {
        console.error("StatsBar fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fmt = (n) => (loading ? "—" : n > 0 ? `${n}+` : "0");
  const sizeClass = compact ? "text-2xl sm:text-3xl" : "text-3xl";
  const labelClass = compact ? "text-green-200 text-xs sm:text-sm" : "text-green-200 text-sm";

  return (
    <div className={`bg-green-800 rounded-2xl p-4 md:p-6 ${className}`}>
      <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
        <div>
          <div className={`${sizeClass} font-bold text-white mb-1`}>{fmt(categoriesCount)}</div>
          <div className={labelClass}>Collections</div>
        </div>
        <div>
          <div className={`${sizeClass} font-bold text-white mb-1`}>{fmt(plantsCount)}</div>
          <div className={labelClass}>Products</div>
        </div>
        <div>
          <div className={`${sizeClass} font-bold text-white mb-1`}>99%</div>
          <div className={labelClass}>Satisfied Customers</div>
        </div>
      </div>
    </div>
  );
}
