// components/ClientProvider.tsx
"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface ReduxProvider {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProvider) {
  return <Provider store={store}>{children}</Provider>;
}
