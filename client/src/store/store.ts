import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
import supplierReducer from './supplierSlice';
import productReducer from './productSlice';
import saleReducer from './saleSlice';
import reportReducer from './reportSlice';





import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    supplier: supplierReducer,
    product: productReducer,
    sale: saleReducer,
    report: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store
export type AppDispatch = typeof store.dispatch;


// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;