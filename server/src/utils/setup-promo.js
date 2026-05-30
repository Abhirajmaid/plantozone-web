"use strict";

const PROMO_UID = "api::promo-code.promo-code";

const ROLE_ACTIONS = {
  public: ["find", "findOne"],
  authenticated: ["find", "findOne", "create", "update", "delete"],
};

async function enablePermission(strapi, roleId, action) {
  const actionName = `${PROMO_UID}.${action}`;
  const existing = await strapi.db
    .query("plugin::users-permissions.permission")
    .findOne({
      where: { action: actionName, role: roleId },
    });

  if (existing) {
    if (existing.enabled === false) {
      await strapi.db.query("plugin::users-permissions.permission").update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
    return;
  }

  await strapi.db.query("plugin::users-permissions.permission").create({
    data: {
      action: actionName,
      role: roleId,
      enabled: true,
    },
  });
}

async function setupPromoPermissions(strapi) {
  for (const [roleType, actions] of Object.entries(ROLE_ACTIONS)) {
    const role = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: roleType } });

    if (!role) continue;

    for (const action of actions) {
      await enablePermission(strapi, role.id, action);
    }
  }

  strapi.log.info("[promo] Users-permissions enabled for promo-code");
}

async function seedDefaultPromoCodes(strapi) {
  const defaults = [
    {
      code: "FIRST125",
      discountPercent: 25,
      description: "25% off your first order",
      isActive: true,
      firstOrderOnly: true,
      showInBanner: true,
      usedCount: 0,
      minOrderAmount: 0,
    },
    {
      code: "OXY30",
      discountPercent: 30,
      description: "30% seasonal discount",
      isActive: true,
      firstOrderOnly: false,
      showInBanner: false,
      usedCount: 0,
      minOrderAmount: 0,
    },
  ];

  for (const data of defaults) {
    const existing = await strapi.db.query(PROMO_UID).findOne({
      where: { code: data.code },
    });
    if (!existing) {
      await strapi.entityService.create(PROMO_UID, { data });
      strapi.log.info(`[promo] Seeded promo code ${data.code}`);
    }
  }
}

const ORDER_UID = "api::order-detail.order-detail";

async function setupOrderPermissions(strapi) {
  const roleTypes = {
    public: ["find", "findOne"],
    authenticated: ["find", "findOne", "create", "update"],
  };

  for (const [roleType, actions] of Object.entries(roleTypes)) {
    const role = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: roleType } });

    if (!role) continue;

    for (const action of actions) {
      const actionName = `${ORDER_UID}.${action}`;
      const existing = await strapi.db
        .query("plugin::users-permissions.permission")
        .findOne({
          where: { action: actionName, role: role.id },
        });

      if (existing) {
        if (existing.enabled === false) {
          await strapi.db.query("plugin::users-permissions.permission").update({
            where: { id: existing.id },
            data: { enabled: true },
          });
        }
        continue;
      }

      await strapi.db.query("plugin::users-permissions.permission").create({
        data: { action: actionName, role: role.id, enabled: true },
      });
    }
  }

  strapi.log.info("[orders] Users-permissions enabled for order-detail");
}

module.exports = {
  setupPromoPermissions,
  seedDefaultPromoCodes,
  setupOrderPermissions,
};
