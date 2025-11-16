import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    allCategory: [],
    loadingCategory: false,
    allSubCategory: [],
    loadingSubCategory: false,
    product: []
};

const productSlice = createSlice({
    name: 'product',
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = Array.isArray(action.payload) ? [...action.payload] : [];
        },
        setLoadingCategory: (state, action) => {
            state.loadingCategory = action.payload;
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = Array.isArray(action.payload) ? [...action.payload] : [];
        },
        setLoadingSubCategory: (state, action) => {
            state.loadingSubCategory = action.payload;
        },
        setProduct: (state, action) => {
            state.product = Array.isArray(action.payload) ? [...action.payload] : [];
        }
    }
});

export const { 
    setAllCategory, 
    setAllSubCategory, 
    setLoadingCategory, 
    setLoadingSubCategory,
    setProduct 
} = productSlice.actions;

export default productSlice.reducer;
