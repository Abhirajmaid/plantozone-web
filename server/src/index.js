'use strict';

const express = require("express");
const app = express();
app.use(express.json());
app.use("/api", require("./api/razorpay"));

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      const {
        setupPromoPermissions,
        seedDefaultPromoCodes,
        setupOrderPermissions,
      } = require("./utils/setup-promo");
      await setupPromoPermissions(strapi);
      await seedDefaultPromoCodes(strapi);
      await setupOrderPermissions(strapi);
    } catch (err) {
      strapi.log.error("[promo] Bootstrap failed:", err);
    }
  },
};
