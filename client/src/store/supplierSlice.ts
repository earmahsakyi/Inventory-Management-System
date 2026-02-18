import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Type Definitions

interface Supplier {
    supplier_id: number;
    name: string;
    email: string;
    phone: string;
    address?: string | null;
}

interface Product {
    product_id: number;
    name: string;
    description?: string | null;
    price: number;
    stock_quantity: number;
    supplier_id: number;
    category_id: number;
    category_name?: string;
}

interface SupplierState {
    loading: boolean;
    suppliers: Supplier[];
    supplier: Supplier | null;
    supplierProducts: Product[];
    error: string | null;
    message: string | null;
}

interface SupplierResponse {
    success: boolean;
    message: string;
    data: Supplier | null;
}

interface AllSuppliersResponse {
    success: boolean;
    page: number;
    limit: number;
    data: Supplier[];
}

interface SupplierProductsResponse {
    success: boolean;
    page: number;
    limit: number;
    data: Product[];
}

interface CreateSupplierData {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

interface UpdateSupplierData {
    supplier_id: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
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
const initialState: SupplierState = {
    loading: false,
    suppliers: [],
    supplier: null,
    supplierProducts: [],
    error: null,
    message: null,
};

// Async Thunks

// Create Supplier
export const createSupplier = createAsyncThunk<
    SupplierResponse,
    CreateSupplierData,
    { rejectValue: string }
>(
    'supplier/createSupplier',
    async (supplierData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.post<SupplierResponse>(
                '/api/suppliers',
                supplierData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get All Suppliers
export const getAllSuppliers = createAsyncThunk<
    AllSuppliersResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
>(
    'supplier/getAllSuppliers',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllSuppliersResponse>(
                `/api/suppliers?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Supplier By ID
export const getSupplierById = createAsyncThunk<
    SupplierResponse,
    number,
    { rejectValue: string }
>(
    'supplier/getSupplierById',
    async (supplier_id, { rejectWithValue }) => {
        try {
            const res = await axios.get<SupplierResponse>(
                `/api/suppliers/${supplier_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Update Supplier
export const updateSupplier = createAsyncThunk<
    SupplierResponse,
    UpdateSupplierData,
    { rejectValue: string }
>(
    'supplier/updateSupplier',
    async ({ supplier_id, ...updateData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.put<SupplierResponse>(
                `/api/suppliers/${supplier_id}`,
                updateData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Delete Supplier
export const deleteSupplier = createAsyncThunk<
    SupplierResponse,
    number,
    { rejectValue: string }
>(
    'supplier/deleteSupplier',
    async (supplier_id, { rejectWithValue }) => {
        try {
            const res = await axios.delete<SupplierResponse>(
                `/api/suppliers/${supplier_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Products By Supplier
export const getProductsBySupplier = createAsyncThunk<
    SupplierProductsResponse,
    { supplier_id: number; page?: number; limit?: number },
    { rejectValue: string }
>(
    'supplier/getProductsBySupplier',
    async ({ supplier_id, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axios.get<SupplierProductsResponse>(
                `/api/suppliers/${supplier_id}/products?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Slice
const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearSupplier: (state) => {
            state.supplier = null;
        },
        clearSupplierProducts: (state) => {
            state.supplierProducts = [];
        },
    },
    extraReducers: (builder) => {
        builder

            // Create Supplier
            .addCase(createSupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createSupplier.fulfilled, (state, action: PayloadAction<SupplierResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create supplier';
            })

            // Get All Suppliers
            .addCase(getAllSuppliers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSuppliers.fulfilled, (state, action: PayloadAction<AllSuppliersResponse>) => {
                state.loading = false;
                state.suppliers = action.payload.data;
            })
            .addCase(getAllSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch suppliers';
            })

            // Get Supplier By ID
            .addCase(getSupplierById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSupplierById.fulfilled, (state, action: PayloadAction<SupplierResponse>) => {
                state.loading = false;
                state.supplier = action.payload.data;
            })
            .addCase(getSupplierById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch supplier';
            })

            // Update Supplier
            .addCase(updateSupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateSupplier.fulfilled, (state, action: PayloadAction<SupplierResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateSupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update supplier';
            })

            // Delete Supplier
            .addCase(deleteSupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteSupplier.fulfilled, (state, action: PayloadAction<SupplierResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteSupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete supplier';
            })

            // Get Products By Supplier
            .addCase(getProductsBySupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsBySupplier.fulfilled, (state, action: PayloadAction<SupplierProductsResponse>) => {
                state.loading = false;
                state.supplierProducts = action.payload.data;
            })
            .addCase(getProductsBySupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch supplier products';
            });
    },
});

export const { clearError, clearMessage, clearSupplier, clearSupplierProducts } = supplierSlice.actions;
export default supplierSlice.reducer;