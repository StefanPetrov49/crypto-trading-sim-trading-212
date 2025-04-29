import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage for web
import reducer from './reducer';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // key in localStorage
  storage,
  whitelist: ['transactions', 'user'], // only persist these slices
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
export default store;