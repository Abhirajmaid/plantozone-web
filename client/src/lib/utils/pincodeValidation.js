// Serviceable pin codes for Plantozone
export const SERVICEABLE_PINCODES = [
    500004, 500045, 500007, 500043, 500101, 501102, 500010, 500044,
    500013, 500047, 500004, 500101, 500044, 501301, 501301, 500015,
    500091, 500040, 500020, 500058, 500043, 500064, 500037, 500034,
    500027, 500004, 500012, 500003, 500016, 500075, 500078, 500092,
    501301, 500010, 500010, 500011, 500075, 500022, 500050, 501301
];

// Remove duplicates and sort
export const UNIQUE_SERVICEABLE_PINCODES = [...new Set(SERVICEABLE_PINCODES)].sort();

/**
 * Validates if a pin code is serviceable
 * @param {string|number} pincode - The pin code to validate
 * @returns {boolean} - True if serviceable, false otherwise
 */
export const isPincodeServiceable = (pincode) => {
    const pin = parseInt(pincode);
    return UNIQUE_SERVICEABLE_PINCODES.includes(pin);
};

/**
 * Gets a formatted list of serviceable pin codes for display
 * @returns {string} - Comma-separated list of pin codes
 */
export const getServiceablePincodesList = () => {
    return UNIQUE_SERVICEABLE_PINCODES.join(', ');
};

/**
 * Validates pin code format (6 digits)
 * @param {string} pincode - The pin code to validate
 * @returns {boolean} - True if valid format, false otherwise
 */
export const isValidPincodeFormat = (pincode) => {
    return /^\d{6}$/.test(pincode);
};
