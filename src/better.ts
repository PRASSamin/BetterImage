"use client";
import React from "react";
import { createRoot } from "react-dom/client";
import Image from "next/image";
import { jsx } from "react/jsx-runtime";
import { useBetter, ImageLoadingStatus, BetterContext } from "./context";

/**
 * This is a type for the props of the `div` element.
 * It is used as a type for the `Root` component.
 */
type RProps = React.ComponentPropsWithoutRef<"div">;

/**
 * This is the main component of the library.
 * It renders a `div` element with the `children` prop.
 * It also renders a `BetterContext.Provider` element with the `value` prop.
 * The `value` prop is an object with two properties: `imageStatus` and `setImageStatus`.
 * `imageStatus` is a state variable that can be one of the following values: "idle", "loading", "loaded", or "error".
 * `setImageStatus` is a function that sets the `imageStatus` state variable.
 * The `children` prop is a React component that is rendered inside the `div` element.
 */
const R = React.forwardRef<HTMLDivElement, RProps>(({ ...props }, ref) => {
  const [imageStatus, setImageStatus] =
    React.useState<ImageLoadingStatus>("idle");

  return jsx(BetterContext.Provider, {
    value: { imageStatus, setImageStatus },
    children: jsx("div", { ...props, ref }),
  });
});
R.displayName = "BetterVersion";

/**
 * This is a type for the props of the `Image` component.
 * It is used as a type for the `BetterImage` component.
 */
type IProps = React.ComponentPropsWithoutRef<typeof Image>;

/**
 * This component renders an `Image` element with the `src` prop.
 * It uses the `useImageStatus` hook to determine the status of the image.
 * If the status is "loaded", it renders the `Image` element.
 * Otherwise, it renders nothing.
 */
const I = React.forwardRef<HTMLImageElement, IProps>(({ ...props }, ref) => {
  const imageStatus = useImageStatus(props);

  return (
    imageStatus === "loaded" &&
    jsx(Image, {
      ...props,
      ref,
    })
  );
});

I.displayName = "Image";

/**
 * This is a type for the props of the `Fallback` component.
 * It is used as a type for the `Fallback` component.
 */
type FProps = React.ComponentPropsWithoutRef<"div"> & {
  /**
   * An optional number prop that specifies how long to wait before rendering
   * the fallback element.
   */
  delay?: number;

  /**
   * An optional string prop that specifies the content of the fallback element.
   */
  onFailString?: string;
};

/**
 * This component renders a `div` element with the `children` prop.
 * It uses the `useBetter` hook to determine the status of the image.
 * If the status is "error" and the `delay` prop is not set, it renders the `children` prop.
 * If the status is "error" and the `delay` prop is set, it renders a temporary `div` element
 * with the `onFailString` prop as its content.
 * If the status is not "error", it renders nothing.
 */
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

/**
 * This hook uses the `useBetter` hook to determine the status of the image.
 * It returns the current status of the image.
 */
const useImageStatus = (ImageProps?: IProps) => {
  const { imageStatus, setImageStatus } = useBetter();

  React.useEffect(() => {
    if (!ImageProps?.src) {
      setImageStatus("error");
      return;
    }

    setImageStatus("loading");

    const tempImageDiv = document.createElement("div");
    tempImageDiv.style.cssText =
      "position: absolute; visibility: hidden; top: -9999px; left: -9999px;";
    document.body.appendChild(tempImageDiv);

    const tempImageRoot = createRoot(tempImageDiv);

    const handleComplete = () => {
      setImageStatus("loaded");
      cleanup();
    };

    const handleError = () => {
      setImageStatus("error");
      cleanup();
    };

    const cleanup = () => {
      tempImageRoot.unmount();
      if (tempImageDiv.parentNode) {
        document.body.removeChild(tempImageDiv);
      }
    };

    tempImageRoot.render(
      jsx(Image, {
        ...ImageProps,
        alt: Math.random().toString(),
        onLoad: handleComplete,
        onError: handleError,
        priority: true,
      })
    );

    return () => {
      cleanup();
    };
  }, [ImageProps?.src, setImageStatus]);

  return imageStatus;
};

export { R, I, F, type RProps, type IProps, type FProps };
