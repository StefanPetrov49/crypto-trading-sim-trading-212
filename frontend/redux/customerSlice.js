import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createUser: {
        data: {},
        isLoading: false,
        error: null,
    },
    customerDetails: {
        data: {},
        isLoading: false,
        error: false,
    },
    resetCustomer: {
        data: {},
        isLoading: false,
        error: false,
    },
    
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        fetchCustomerDetailsStart: (state) => {
            state.customerDetails.isLoading = true;
            state.customerDetails.error = null;
        },
        fetchCustomerDetailsSuccess: (state, action) => {
            state.customerDetails.isLoading = false;
            state.customerDetails.data = action.payload;
        },
        fetchCustomerDetailsFailure: (state, action) => {
            state.customerDetails.isLoading = false;
            state.customerDetails.error = action.payload;
        },

        resetCustomerStart: (state) => {
            state.resetCustomer.isLoading = true;
            state.resetCustomer.error = null;
        },
        resetCustomerSuccess: (state, action) => {      
            state.resetCustomer.isLoading = false;
            state.customerDetails.data = action.payload;
        },
        resetCustomerFailure: (state, action) => {
            state.resetCustomer.isLoading = false;
            state.resetCustomer.error = action.payload;
        },
        
    },
});

export const {
    fetchCustomerDetailsStart,
    fetchCustomerDetailsSuccess,
    fetchCustomerDetailsFailure,
    resetCustomerStart,
    resetCustomerSuccess,
    resetCustomerFailure,
} = customerSlice.actions;

export default customerSlice.reducer;
