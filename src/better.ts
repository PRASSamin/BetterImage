"use client";
import React from "react";
import Image from "next/image";
import { jsx } from "react/jsx-runtime";
import { useBetter, ImageLoadingStatus, BetterContext } from "./context";

type RProps = React.ComponentPropsWithoutRef<"div">;

const R = React.forwardRef<HTMLDivElement, RProps>(({ ...props }, ref) => {
  const [imageStatus, setImageStatus] =
    React.useState<ImageLoadingStatus>("idle");

  return jsx(BetterContext.Provider, {
    value: { imageStatus, setImageStatus },
    children: jsx("div", { ...props, ref }),
  });
});
R.displayName = "BetterVersion";

type IProps = React.ComponentPropsWithoutRef<typeof Image>;

const I = React.forwardRef<HTMLImageElement, IProps>(({ ...props }, ref) => {
  const imageStatus = useImageStatus(props.src as string);

  return (
    imageStatus === "loaded" &&
    jsx(Image, {
      ...props,
      ref,
    })
  );
});
I.displayName = "Image";

type FProps = React.ComponentPropsWithoutRef<"div"> & {
  delay?: number;
  onFailString?: string;
};

const F = React.forwardRef<HTMLDivElement, FProps>(
  ({ delay, onFailString, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(delay === undefined);
    const { imageStatus } = useBetter();

    React.useEffect(() => {
      if (delay !== undefined) {
        const timeout = setTimeout(() => {
          setCanRender(true);
        }, delay);
        return () => clearTimeout(timeout);
      }
    }, [delay]);

    return canRender && imageStatus === "error"
      ? jsx("div", { ...props, ref, children: onFailString || "" })
      : canRender && imageStatus !== "loaded"
      ? jsx("div", { ...props, ref })
      : null;
  }
);
F.displayName = "Fallback";

const useImageStatus = (src: string) => {
  const { imageStatus, setImageStatus } = useBetter();

  React.useEffect(() => {
    if (!src) {
      setImageStatus("error");
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (isMounted) {
        setImageStatus(status);
      }
    };

    setImageStatus("loading");
    image.crossOrigin = "anonymous";
    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("loaded");
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src, setImageStatus]);

  return imageStatus;
};

export { R, I, F, type RProps, type IProps, type FProps };
