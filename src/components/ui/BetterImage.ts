"use client";

import * as React from "react";
import * as BetterThings from "@/index";
import { jsx } from "react/jsx-runtime";
import { pras } from "@/lib/utils";
import Loader from "./svg/Loader";

const BetterVersion = React.forwardRef<
  React.ComponentRef<typeof BetterThings.Root>,
  React.ComponentPropsWithoutRef<typeof BetterThings.Root>
>(({ className, ...props }, ref) => {
  return jsx(BetterThings.Root, {
    ...props,
    ref,
    className: pras("relative flex h-full w-full", className),
  });
});

BetterVersion.displayName = BetterThings.Root.displayName;

const Img = React.forwardRef<
  React.ComponentRef<typeof BetterThings.Image>,
  React.ComponentPropsWithoutRef<typeof BetterThings.Image>
>(({ className, ...props }, ref) => {
  return jsx(BetterThings.Image, {
    ...props,
    ref,
    className: pras("h-full w-full", className),
  });
});

Img.displayName = BetterThings.Image.displayName;

const Fallback = React.forwardRef<
  React.ComponentRef<typeof BetterThings.Fallback>,
  React.ComponentPropsWithoutRef<typeof BetterThings.Fallback>
>(({ className, ...props }, ref) => {
  return jsx(BetterThings.Fallback, {
    ...props,
    ref,
    className: pras(
      "flex h-full w-full items-center justify-center",
      className
    ),
    children: jsx(Loader, { className: "h-4 w-4 animate-spin", size: 24 }),
  });
});

Fallback.displayName = BetterThings.Fallback.displayName;

type BetterImageProps = React.ComponentPropsWithoutRef<
  typeof BetterThings.Image
> & {
  onFailString?: string;
  delay?: number;
};

const BetterImage = React.forwardRef<
  React.ComponentRef<typeof BetterThings.Image>,
  BetterImageProps
>(({ src, alt, className, onFailString, delay, ...props }, ref) => {
  return jsx(BetterVersion, {
    ref,
    children: [
      jsx(Img, { src, alt, className, ...props }, "image"),
      jsx(Fallback, { onFailString, delay }, "fallback"),
    ],
  });
});
BetterImage.displayName = "BetterImage";

export { BetterVersion, Img, Fallback, BetterImage };
