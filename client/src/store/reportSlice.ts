import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Type Definitions

interface SalesByProduct {
    product_id: number;
    product_name: string;
    total_units_sold: number;
    total_sales: number;
}

interface SalesByDate {
    sale_date: string;
    total_transactions: number;
    total_revenue: number;
}

interface ReportState {
    loading: boolean;
    salesByProduct: SalesByProduct[];
    salesByDate: SalesByDate[];
    error: string | null;
}

interface SalesByProductResponse {
    success: boolean;
    data: SalesByProduct[];
}

interface SalesByDateResponse {
    success: boolean;
    data: SalesByDate[];
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
const initialState: ReportState = {
    loading: false,
    salesByProduct: [],
    salesByDate: [],
    error: null,
};

// Async Thunks

// Get Sales By Product
export const getSalesByProduct = createAsyncThunk<
    SalesByProductResponse,
    void,
    { rejectValue: string }
>(
    'report/getSalesByProduct',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get<SalesByProductResponse>(
                '/api/reports/sales-by-product'
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Sales By Date
export const getSalesByDate = createAsyncThunk<
    SalesByDateResponse,
    void,
    { rejectValue: string }
>(
    'report/getSalesByDate',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get<SalesByDateResponse>(
                '/api/reports/sales-by-date'
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Slice
const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Get Sales By Product
            .addCase(getSalesByProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSalesByProduct.fulfilled, (state, action: PayloadAction<SalesByProductResponse>) => {
                state.loading = false;
                state.salesByProduct = action.payload.data;
            })
            .addCase(getSalesByProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch sales by product';
            })

            // Get Sales By Date
            .addCase(getSalesByDate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSalesByDate.fulfilled, (state, action: PayloadAction<SalesByDateResponse>) => {
                state.loading = false;
                state.salesByDate = action.payload.data;
            })
            .addCase(getSalesByDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch sales by date';
            });
    },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;