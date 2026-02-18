import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Type Definitions

interface SaleItem {
    sale_item_id?: number;
    sale_id?: number;
    product_id: number;
    quantity: number;
    price?: number;
    total?: number;
    product_name?: string;
}

interface Sale {
    sale_id: number;
    created_by: string | null;
    total_amount: number;
    sale_date?: string;
    items?: SaleItem[];
}

interface SaleState {
    loading: boolean;
    sales: Sale[];
    sale: Sale | null;
    error: string | null;
    message: string | null;
}

interface CreateSaleResponse {
    success: boolean;
    message: string;
    data: {
        sale_id: number;
        total_amount: number;
    };
}

interface AllSalesResponse {
    success: boolean;
    page: number;
    limit: number;
    data: Sale[];
}

interface SaleResponse {
    success: boolean;
    data: Sale;
}

// Payload for creating a sale
interface CreateSaleData {
    items: {
        product_id: number;
        quantity: number;
    }[];
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
const initialState: SaleState = {
    loading: false,
    sales: [],
    sale: null,
    error: null,
    message: null,
};

// Async Thunks

// Create Sale
export const createSale = createAsyncThunk<
    CreateSaleResponse,
    CreateSaleData,
    { rejectValue: string }
>(
    'sale/createSale',
    async (saleData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.post<CreateSaleResponse>(
                '/api/sales',
                saleData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get All Sales
export const getAllSales = createAsyncThunk<
    AllSalesResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
>(
    'sale/getAllSales',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllSalesResponse>(
                `/api/sales?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Sale By ID
export const getSaleById = createAsyncThunk<
    SaleResponse,
    number,
    { rejectValue: string }
>(
    'sale/getSaleById',
    async (sale_id, { rejectWithValue }) => {
        try {
            const res = await axios.get<SaleResponse>(
                `/api/sales/${sale_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Slice
const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearSale: (state) => {
            state.sale = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Create Sale
            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createSale.fulfilled, (state, action: PayloadAction<CreateSaleResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to record sale';
            })

            // Get All Sales
            .addCase(getAllSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSales.fulfilled, (state, action: PayloadAction<AllSalesResponse>) => {
                state.loading = false;
                state.sales = action.payload.data;
            })
            .addCase(getAllSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch sales';
            })

            // Get Sale By ID
            .addCase(getSaleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSaleById.fulfilled, (state, action: PayloadAction<SaleResponse>) => {
                state.loading = false;
                state.sale = action.payload.data;
            })
            .addCase(getSaleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch sale';
            });
    },
});

export const { clearError, clearMessage, clearSale } = saleSlice.actions;
export default saleSlice.reducer;