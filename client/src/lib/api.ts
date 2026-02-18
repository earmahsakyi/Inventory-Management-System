import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Suppliers
export const suppliersApi = {
  getAll: () => api.get("/suppliers"),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post("/suppliers", data),
  update: (id: number, data: any) => api.put(`/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
  getProducts: (id: number) => api.get(`/suppliers/${id}/products`),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get("/categories"),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Products
export const productsApi = {
  getAll: () => api.get("/products"),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products", data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getBySupplier: (supplierId: number) => api.get(`/products/supplier/${supplierId}`),
  getByCategory: (categoryId: number) => api.get(`/products/category/${categoryId}`),
};

// Sales
export const salesApi = {
  getAll: () => api.get("/sales"),
  getById: (id: number) => api.get(`/sales/${id}`),
  create: (data: any) => api.post("/sales", data),
};

// Reports
export const reportsApi = {
  salesByProduct: () => api.get("/reports/sales-by-product"),
  salesByDate: () => api.get("/reports/sales-by-date"),
  lowStock: () => api.get("/reports/low-stock"),
};

export default api;
