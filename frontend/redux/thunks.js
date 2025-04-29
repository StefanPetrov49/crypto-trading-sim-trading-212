import { API_BASE_URL } from "@/config";
import { createUserFailure, createUserStart, createUserSuccess, loginFailure, loginStart, loginSuccess } from "./userSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { buyCryptoCurrencyFailure, buyCryptoCurrencyStart, buyCryptoCurrencySuccess, fetchTransactionsHistoryFailure, fetchTransactionsHistoryStart, fetchTransactionsHistorySuccess, sellCryptoCurrencyFailure, sellCryptoCurrencyStart, sellCryptoCurrencySuccess, updateBalance } from "./transactionsSlice";
import Cookies from "js-cookie";
import { resetCustomerFailure, resetCustomerStart, resetCustomerSuccess } from "./customerSlice";

export const createUser = createAsyncThunk(
    "user/createUser",
    async (formData, { dispatch }) => {
        try {
            dispatch(createUserStart());

            const response = await axios.post(`${API_BASE_URL}/customers`,
                formData);

            dispatch(createUserSuccess(response.data));

        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            
            if (error.response && error.response.data) {
              errorMessage = error.response.data;
            }
            dispatch(createUserFailure(errorMessage));
        }
    }
);

export const login = createAsyncThunk(
    "user/login",
    async (loginData, { dispatch }) => {
        try {
            dispatch(loginStart());

            const response = await axios.post(`${API_BASE_URL}/auth/login`,
                loginData);

            if (response.status !== 200) {
                dispatch(loginFailure());
                return;
            }

            const token = response.data.token;

            const customerResponse = await axios.get(`${API_BASE_URL}/customers`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (customerResponse.status !== 200) {
                dispatch(loginFailure());
                return;
            }

            const customer = customerResponse.data;

            const customerData = {
                customerId: customer.customerId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                username: customer.username,
                balance: customer.balance,
            };

            dispatch(updateBalance(customer.balance));

            const loginResult = {
                token,
                data: customerData,
            };

            dispatch(loginSuccess(loginResult));
        } catch (error) {
            console.error("Login error:", error);
            dispatch(loginFailure());
        }
    }
);

export const getTransactionsHistory = createAsyncThunk(
    "transactions/getTransactionsHistory",
    async (_, { dispatch }) => {


        try {
            dispatch(fetchTransactionsHistoryStart());

            const token = Cookies.get("token");

            const response = await axios.get(
                `${API_BASE_URL}/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(fetchTransactionsHistorySuccess(response.data));

        } catch (error) {
            dispatch(fetchTransactionsHistoryFailure());
        }
    }
);

export const buyCryptoCurrency = createAsyncThunk(
    "transactions/buyCryptoCurrecy",
    async (formData, { dispatch }) => {

        try {
            dispatch(buyCryptoCurrencyStart());

            const token = Cookies.get("token");

            const response = await axios.post(
                `${API_BASE_URL}/transactions/buy`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            dispatch(buyCryptoCurrencySuccess(response.data));

        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            
            if (error.response && error.response.data) {
              errorMessage = error.response.data;
            }
      
            dispatch(buyCryptoCurrencyFailure(errorMessage));
          }
    }
);

export const sellCryptoCurrecy = createAsyncThunk(
    "transactions/sellCryptoCurrecy",
    async (formData, { dispatch }) => {

        try {
            dispatch(sellCryptoCurrencyStart());

            const token = Cookies.get("token");
            
            const response = await axios.post(
                `${API_BASE_URL}/transactions/sell`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            dispatch(sellCryptoCurrencySuccess(response.data));

        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            
            if (error.response && error.response.data) {
              errorMessage = error.response.data;
            }
            dispatch(sellCryptoCurrencyFailure(errorMessage));
        }
    }
);

export const resetCustomerBalance = createAsyncThunk(
    "customers/resetCustomerBalance",
    async (_, { dispatch }) => {

        try {
            dispatch(resetCustomerStart());

            const token = Cookies.get("token");
            
            const response = await axios.put(
                `${API_BASE_URL}/transactions/reset`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            dispatch(updateBalance(response.data.balance))
            dispatch(resetCustomerSuccess(response.data));

        } catch (error) {
            dispatch(resetCustomerFailure());
        }
    }
);
