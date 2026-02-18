import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;

// Type Definitions

interface Category {
    category_id: number;
    name: string;
    description: string | null;
}

interface CategoryState {
    loading: boolean;
    categories: Category[];
    category: Category | null;
    error: string | null;
    message: string | null;
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category | null;
}

interface AllCategoriesResponse {
    success: boolean;
    page: number;
    limit: number;
    data: Category[];
}

interface CreateCategoryData {
    name: string;
    description?: string;
}

interface UpdateCategoryData {
    category_id: number;
    name?: string;
    description?: string;
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
const initialState: CategoryState = {
    loading: false,
    categories: [],
    category: null,
    error: null,
    message: null,
};

// Async Thunks

// Create Category
export const createCategory = createAsyncThunk<
    CategoryResponse,
    CreateCategoryData,
    { rejectValue: string }
>(
    'category/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.post<CategoryResponse>(
                '/api/categories',
                categoryData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get All Categories
export const getAllCategories = createAsyncThunk<
    AllCategoriesResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
>(
    'category/getAllCategories',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get<AllCategoriesResponse>(
                `/api/categories?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get Category By ID
export const getCategoryById = createAsyncThunk<
    CategoryResponse,
    number,
    { rejectValue: string }
>(
    'category/getCategoryById',
    async (category_id, { rejectWithValue }) => {
        try {
            const res = await axios.get<CategoryResponse>(
                `/api/categories/${category_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Update Category
export const updateCategory = createAsyncThunk<
    CategoryResponse,
    UpdateCategoryData,
    { rejectValue: string }
>(
    'category/updateCategory',
    async ({ category_id, ...updateData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const res = await axios.put<CategoryResponse>(
                `/api/categories/${category_id}`,
                updateData,
                config
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Delete Category
export const deleteCategory = createAsyncThunk<
    CategoryResponse,
    number,
    { rejectValue: string }
>(
    'category/deleteCategory',
    async (category_id, { rejectWithValue }) => {
        try {
            const res = await axios.delete<CategoryResponse>(
                `/api/categories/${category_id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Slice
const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearCategory: (state) => {
            state.category = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Create Category
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createCategory.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create category';
            })

            // Get All Categories
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<AllCategoriesResponse>) => {
                state.loading = false;
                state.categories = action.payload.data;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch categories';
            })

            // Get Category By ID
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryById.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.category = action.payload.data;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch category';
            })

            // Update Category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update category';
            })

            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete category';
            });
    },
});

export const { clearError, clearMessage, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;