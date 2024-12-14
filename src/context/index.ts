"use client";
import React from "react";

export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

interface BetterContextType {
  imageStatus: "idle" | "loading" | "loaded" | "error";
  setImageStatus: React.Dispatch<
    React.SetStateAction<"idle" | "loading" | "loaded" | "error">
  >;
}

export const BetterContext = React.createContext<BetterContextType | undefined>(
  undefined
);

export const useBetter = () => {
  const context = React.useContext(BetterContext);
  if (context === undefined) {
    throw new Error("useBetter must be used within a BetterProvider");
  }
  return context;
};
