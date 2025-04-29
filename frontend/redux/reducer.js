import { combineReducers } from 'redux';
import customerReducer from './customerSlice';
import userReducer from './userSlice';
import cryptoPricesReducer from './cryptoPricesSlice';
import transactionsReducer from './transactionsSlice';

const rootReducer = combineReducers({
  customer: customerReducer,
  user: userReducer,
  cryptoPrices: cryptoPricesReducer,
  transactions: transactionsReducer
});

export default rootReducer;