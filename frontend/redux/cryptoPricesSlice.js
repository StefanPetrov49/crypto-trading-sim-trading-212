import { createSlice } from '@reduxjs/toolkit';

export const cryptoPricesSlice = createSlice({
    name: 'cryptoPrices',
    initialState: {
        prices: {},
        priceChanges: {}
    },
    reducers: {
        updatePrice(state, action) {
            const { symbol, price, direction } = action.payload;
            state.prices[symbol] = price;
            state.priceChanges[symbol] = direction;
        }
    }
});

export const { updatePrice } = cryptoPricesSlice.actions;
export default cryptoPricesSlice.reducer;