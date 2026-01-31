const { default: axios } = require("axios");

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
// Development: use localhost:1337. Override with NEXT_PUBLIC_STRAPI_URL or NEXT_PUBLIC_API_URL for production.
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Create axios instance with token (user token or API token)
const axiosClient = (token) => {
  // Use API token if available, otherwise use user token
  const authToken = API_TOKEN || token;
  
  return axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    }
  });
};

// Admin Authentication
const adminLogin = (data) => {
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: { "Content-Type": 'application/json' }
  });
  return client.post('/auth/local', {
    identifier: data.email,
    password: data.password,
  });
};

const getAdminUser = (token) => {
  const client = axiosClient(token);
  return client.get('/users/me');
};

// Plants CRUD
const getPlants = (token, params = {}) => {
  // Prefer user token first (for authenticated admin), fallback to API token
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    }
  });
  
  const queryParams = new URLSearchParams({
    populate: "*",
    "pagination[pageSize]": params.pageSize || 100,
    ...(params.page && { "pagination[page]": params.page }),
    ...(params.search && { "filters[title][$containsi]": params.search }),
    ...(params.sort && { sort: params.sort }),
    ...(params.categoryId && { "filters[categories][id][$eq]": params.categoryId }),
  });
  if (params.inStock || params.stockFilter === "in") queryParams.set("filters[stock][$gt]", 0);
  if (params.outOfStock || params.stockFilter === "out") queryParams.set("filters[stock][$lte]", 0);
  return client.get(`/plants?${queryParams}`);
};

const getPlantById = (id, token) => {
  // Prefer user token first, fallback to API token
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    }
  });
  return client.get(`/plants/${id}?populate=*`);
};

const uploadImages = (files, token) => {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("files", f));
  const authToken = token || API_TOKEN;
  return axios.post(`${STRAPI_BASE_URL}/api/upload`, form, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

const createPlant = (data, token) => {
  const client = axiosClient(token);
  return client.post("/plants", { data });
};

const updatePlant = (id, data, token) => {
  const client = axiosClient(token);
  return client.put(`/plants/${id}`, { data });
};

const deletePlant = (id, token) => {
  const client = axiosClient(token);
  return client.delete(`/plants/${id}`);
};

// Categories CRUD
const getCategories = (token, params = {}) => {
  // Prefer user token first, fallback to API token
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    }
  });
  
  const queryParams = new URLSearchParams({
    'populate': '*',
    'pagination[pageSize]': params.pageSize || 100,
    ...(params.page && { 'pagination[page]': params.page }),
    ...(params.search && { 'filters[title][$containsi]': params.search }),
    ...(params.sort && { sort: params.sort }),
  });
  if (params.hasDescription === 'yes') queryParams.set('filters[description][$notNull]', 'true');
  if (params.hasDescription === 'no') queryParams.set('filters[description][$null]', 'true');
  return client.get(`/categories?${queryParams}`);
};

const getCategoryById = (id, token) => {
  // Prefer user token first, fallback to API token
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    }
  });
  return client.get(`/categories/${id}?populate=*`);
};

const createCategory = (data, token) => {
  const client = axiosClient(token);
  const payload = {
    title: data.name ?? data.title,
    description: data.description,
    slug: data.slug || (String(data.name || data.title || '')).toLowerCase().replace(/\s+/g, '-'),
  };
  if (data.image !== undefined) payload.image = data.image;
  return client.post('/categories', { data: payload });
};

const updateCategory = (id, data, token) => {
  const client = axiosClient(token);
  const payload = {
    title: data.name ?? data.title,
    description: data.description,
    slug: data.slug || (String(data.name || data.title || '')).toLowerCase().replace(/\s+/g, '-'),
  };
  if (data.image !== undefined) payload.image = data.image;
  return client.put(`/categories/${id}`, { data: payload });
};

const deleteCategory = (id, token) => {
  const client = axiosClient(token);
  return client.delete(`/categories/${id}`);
};

// Orders – use order-details Content-Type (checkout writes here)
const getOrders = (token, params = {}) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  const queryParams = new URLSearchParams({
    populate: "*",
    "pagination[pageSize]": params.pageSize || 100,
    ...(params.page && { "pagination[page]": params.page }),
    sort: params.sort || "createdAt:desc",
    publicationState: "preview",
  });
  if (params.status) queryParams.set("filters[status][$eq]", params.status);
  if (params.search && params.search.trim()) {
    queryParams.set("filters[$or][0][orderId][$containsi]", params.search.trim());
    queryParams.set("filters[$or][1][userName][$containsi]", params.search.trim());
  }
  return client.get(`/order-details?${queryParams}`);
};

const getOrderById = (id, token) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  return client.get(`/order-details/${id}?populate=*&publicationState=preview`);
};

// Blogs CRUD (draftAndPublish: use publicationState=preview for both)
const getBlogs = (token, params = {}) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  const queryParams = new URLSearchParams({
    populate: "*",
    "pagination[pageSize]": params.pageSize || 100,
    ...(params.page && { "pagination[page]": params.page }),
    ...(params.search && { "filters[title][$containsi]": params.search }),
    ...(params.sort && { sort: params.sort }),
    publicationState: "preview",
  });
  if (params.statusFilter === "published") queryParams.set("filters[publishedAt][$notNull]", "true");
  if (params.statusFilter === "draft") queryParams.set("filters[publishedAt][$null]", "true");
  return client.get(`/blogs?${queryParams}`);
};

const getBlogById = (id, token) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  return client.get(`/blogs/${id}?populate=*&publicationState=preview`);
};

const createBlog = (data, token) => {
  const client = axiosClient(token);
  return client.post("/blogs", { data });
};

const updateBlog = (id, data, token) => {
  const client = axiosClient(token);
  return client.put(`/blogs/${id}`, { data });
};

const deleteBlog = (id, token) => {
  const client = axiosClient(token);
  return client.delete(`/blogs/${id}`);
};

// Team Members CRUD (About Us page)
const getTeamMembers = (token, params = {}) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  const queryParams = new URLSearchParams({
    populate: "image",
    "pagination[pageSize]": params.pageSize || 100,
    ...(params.page && { "pagination[page]": params.page }),
    ...(params.search && { "filters[name][$containsi]": params.search }),
    sort: params.sort || "order:asc",
    publicationState: "preview",
  });
  if (params.statusFilter === "published") queryParams.set("filters[publishedAt][$notNull]", "true");
  if (params.statusFilter === "draft") queryParams.set("filters[publishedAt][$null]", "true");
  return client.get(`/team-members?${queryParams}`);
};

const getTeamMemberById = (id, token) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  return client.get(`/team-members/${id}?populate=image&publicationState=preview`);
};

const createTeamMember = (data, token) => {
  const client = axiosClient(token);
  return client.post("/team-members", { data });
};

const updateTeamMember = (id, data, token) => {
  const client = axiosClient(token);
  return client.put(`/team-members/${id}`, { data });
};

const deleteTeamMember = (id, token) => {
  const client = axiosClient(token);
  return client.delete(`/team-members/${id}`);
};

const updateOrderStatus = (id, status, token) => {
  const client = axiosClient(token);
  return client.put(`/order-details/${id}`, { data: { status } });
};

// Stats/Dashboard
// Uses Promise.allSettled so one failing request (e.g. /api/users 403) doesn't break the whole dashboard
const getDashboardStats = (token) => {
  const authToken = token || API_TOKEN;
  const client = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  return Promise.allSettled([
    client.get("/plants?pagination[pageSize]=1"),
    client.get("/categories?pagination[pageSize]=1"),
    client.get("/order-details?pagination[pageSize]=1&publicationState=preview"),
    client.get("/users?pagination[pageSize]=1"),
  ]).then(([plants, categories, orderDetails, users]) => ({
    totalPlants: plants.status === "fulfilled" ? (plants.value.data?.meta?.pagination?.total ?? 0) : 0,
    totalCategories: categories.status === "fulfilled" ? (categories.value.data?.meta?.pagination?.total ?? 0) : 0,
    totalOrders: orderDetails.status === "fulfilled" ? (orderDetails.value.data?.meta?.pagination?.total ?? 0) : 0,
    totalUsers: users.status === "fulfilled" ? (users.value.data?.meta?.pagination?.total ?? 0) : 0,
  }));
};

export default {
  adminLogin,
  getAdminUser,
  uploadImages,
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats,
};
