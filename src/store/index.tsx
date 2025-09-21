"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


import tokenReducer from "@/store/token/token-slice";
import customerReducer from "@/store/data/customer-slice"; 
import adminReducer from "@/store/data/admin-slice";

// Persist config for token
const tokenPersistConfig = {
  key: "token",
  storage,
};

// Persist config for customer
const customerPersistConfig = {
  key: "customer",
  storage,
};

const adminPersistConfig = {
  key: "admin",
  storage,
};

const rootReducer = combineReducers({
  token: persistReducer(tokenPersistConfig, tokenReducer.reducer),
  customer: persistReducer(customerPersistConfig, customerReducer),
    admin: persistReducer(adminPersistConfig, adminReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
