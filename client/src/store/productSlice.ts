import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;

// Type Definitions

interface Product {
    product_id: number;
    name: string;
    description?: string | null;
    price: number;
    stock_quantity: number;
    supplier_id: number;
    category_id: number;
    supplier_name?: string;
    category_name?: string;
}

interface ProductState {
    loading: boolean;
    products: Product[];
    product: Product | null;
    error: string | null;
    message: string | null;
}

interface ProductResponse {
    success: boolean;
    message: string;
    data: Product | null;
}

interface AllProductsResponse {
    success: boolean;
    page: number;
    limit: number;
    data: Product[];
}

interface CreateProductData {
    name: string;
    price: number;
    supplier_id: number;
    category_id: number;
    description?: string;
    stock_quantity?: number;
}

interface UpdateProductData {
    product_id: number;
    name?: string;
    description?: string;
    price?: number;
    stock_quantity?: number;
    supplier_id?: number;
    category_id?: number;
}

interface GetBySupplierParams {
    supplierId: number;
    page?: number;
    limit?: number;
}

interface GetByCategoryParams {
    categoryId: number;
    page?: number;
    limit?: number;
}

// Helper to extract error messages
const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        return (
            axiosError.response?.data?.message ||
            axiosError.response?.data?.msg ||
            axiosError.response?.data?.error ||
            'An error occurred'
        );
    }
    return 'An unexpected error occurred';
};

// Initial State
const initialState: ProductState = {
    loading: false,
    products: [],
    product: null,
    error: null,
    message: null,
};

// Async Thunks

// Create Product
export const createProduct = createAsyncThunk<
    ProductResponse,
    CreateProductData,
    { rejectValue: string }
>(
    'product/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.post<ProductResponse>(
                '/api/products',
                productData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get All Products
export const getAllProducts = createAsyncThunk<
    AllProductsResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
>(
    'product/getAllProducts',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllProductsResponse>(
                `/api/products?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Product By ID
export const getProductById = createAsyncThunk<
    ProductResponse,
    number,
    { rejectValue: string }
>(
    'product/getProductById',
    async (product_id, { rejectWithValue }) => {
        try {
            const res = await axios.get<ProductResponse>(
                `/api/products/${product_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Products By Supplier
export const getProductsBySupplier = createAsyncThunk<
    AllProductsResponse,
    GetBySupplierParams,
    { rejectValue: string }
>(
    'product/getProductsBySupplier',
    async ({ supplierId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllProductsResponse>(
                `/api/products/supplier/${supplierId}?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Products By Category
export const getProductsByCategory = createAsyncThunk<
    AllProductsResponse,
    GetByCategoryParams,
    { rejectValue: string }
>(
    'product/getProductsByCategory',
    async ({ categoryId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllProductsResponse>(
                `/api/products/category/${categoryId}?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Update Product
export const updateProduct = createAsyncThunk<
    ProductResponse,
    UpdateProductData,
    { rejectValue: string }
>(
    'product/updateProduct',
    async ({ product_id, ...updateData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.put<ProductResponse>(
                `/api/products/${product_id}`,
                updateData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk<
    ProductResponse,
    number,
    { rejectValue: string }
>(
    'product/deleteProduct',
    async (product_id, { rejectWithValue }) => {
        try {
            const res = await axios.delete<ProductResponse>(
                `/api/products/${product_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Slice
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearProduct: (state) => {
            state.product = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create product';
            })

            // Get All Products
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action: PayloadAction<AllProductsResponse>) => {
                state.loading = false;
                state.products = action.payload.data;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products';
            })

            // Get Product By ID
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.product = action.payload.data;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch product';
            })

            // Get Products By Supplier
            .addCase(getProductsBySupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsBySupplier.fulfilled, (state, action: PayloadAction<AllProductsResponse>) => {
                state.loading = false;
                state.products = action.payload.data;
            })
            .addCase(getProductsBySupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products by supplier';
            })

            // Get Products By Category
            .addCase(getProductsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsByCategory.fulfilled, (state, action: PayloadAction<AllProductsResponse>) => {
                state.loading = false;
                state.products = action.payload.data;
            })
            .addCase(getProductsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products by category';
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update product';
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete product';
            });
    },
});

export const { clearError, clearMessage, clearProduct } = productSlice.actions;
export default productSlice.reducer;