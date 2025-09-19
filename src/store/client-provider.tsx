"use client";

import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import store, { persistor } from "@/store";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}