import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transactionsHistory: {
        data: {},
        isLoading: false,
        error: false,
    },
    buy: {
        data: {},
        isLoading: false,
        error: false,
    },
    sell: {
        data: {},
        isLoading: false,
        error: false,
    },
    balance: 0,
};

const transactionsSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        fetchTransactionsHistoryStart: (state) => {
            state.transactionsHistory.isLoading = true;
            state.transactionsHistory.error = null;
        },
        fetchTransactionsHistorySuccess: (state, action) => {
            state.transactionsHistory.isLoading = false;
            state.transactionsHistory.data = action.payload;
        },
        fetchTransactionsHistoryFailure: (state, action) => {
            state.transactionsHistory.isLoading = false;
            state.transactionsHistory.error = action.payload;
        },
        buyCryptoCurrencyStart: (state) => {
            state.buy.isLoading = true;
            state.buy.error = null;
        },
        buyCryptoCurrencySuccess: (state, action) => {
            state.buy.isLoading = false;
            state.buy.data = action.payload;
            state.balance = action.payload.balance
        },
        buyCryptoCurrencyFailure: (state, action) => {
            state.buy.isLoading = false;
            state.buy.error = action.payload;
        },
        sellCryptoCurrencyStart: (state) => {
            state.sell.isLoading = true;
            state.sell.error = null;
        },
        sellCryptoCurrencySuccess: (state, action) => {
            state.sell.isLoading = false;
            state.sell.data = action.payload;
            state.balance = action.payload.balance
        },
        sellCryptoCurrencyFailure: (state, action) => {
            state.sell.isLoading = false;
            state.sell.error = action.payload;
        },
        updateBalance: (state, action) => {
            state.balance = action.payload;
        },
        resetBuyState: (state) => {
            state.buy.data = {};
            state.buy.error = null;
            state.buy.isLoading = false;
        },
        resetSellState: (state) => {
            state.sell.data = {};
            state.sell.error = null;
            state.sell.isLoading = false;
        },
    },
});

export const {
    fetchTransactionsHistoryStart,
    fetchTransactionsHistorySuccess,
    fetchTransactionsHistoryFailure,
    buyCryptoCurrencyStart,
    buyCryptoCurrencySuccess,
    buyCryptoCurrencyFailure,
    sellCryptoCurrencyStart,
    sellCryptoCurrencySuccess,
    sellCryptoCurrencyFailure,
    updateBalance,
    resetBuyState,
    resetSellState,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
