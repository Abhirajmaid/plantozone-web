/**
 * Generate a random promo code for admin dashboard.
 * @param {string} prefix - e.g. PLANT, FIRST
 * @param {number} length - random suffix length
 */
export function generatePromoCode(prefix = "PLANT", length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < length; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${String(prefix).toUpperCase().replace(/[^A-Z0-9]/g, "")}${suffix}`;
}

import { defaultValidUntilDateTime } from "./promoConstants";

export const GENERATOR_PRESETS = [
  {
    label: "First order (25%)",
    code: "FIRST125",
    percent: 25,
    firstOrderOnly: true,
    showInBanner: true,
    isDefault: true,
  },
  {
    label: "Seasonal (30%)",
    code: "OXY30",
    percent: 30,
    firstOrderOnly: false,
    showInBanner: false,
    validUntilDays: 60,
  },
  {
    label: "Welcome (15%)",
    prefix: "WELCOME",
    percent: 15,
    firstOrderOnly: true,
    showInBanner: false,
    validUntilDays: 30,
  },
  {
    label: "Flash sale (20%)",
    prefix: "FLASH",
    percent: 20,
    firstOrderOnly: false,
    showInBanner: false,
    validUntilDays: 7,
  },
];

export function presetToFormFields(preset) {
  const days = preset.validUntilDays ?? 30;
  return {
    validUntil: preset.isDefault ? "" : defaultValidUntilDateTime(days),
  };
}
