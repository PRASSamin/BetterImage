# BetterImage

**BetterImage** is a `Next.js`-focused library for building optimized image components with advanced features, including fallback animations. It enhances `Next.js`'s built-in Image component, offering seamless optimization and an improved user experience for your projects.

## Features

- **Next.js Image Optimization**: Leverages Next.js's `Image` component for automatic optimizations like lazy loading, responsive resizing, and image format selection.
- **Fallback Animations**: Provides smooth loading animations and error handling for images that fail to load.
- **Enhanced Customization**: Offers flexibility for customization, making it easy to adapt to your design system.
- **Prebuilt Component**: Quickly integrate the `BetterImage` component into your project for consistent and optimized image handling.

## Installation

Install `betterimage` using npm or yarn:

```bash
npm install @prass/betterimage
# or
yarn add @prass/betterimage
```

## Usage

`BetterImage` is designed for Next.js projects. Simply replace the Next.js `Image` component with the `BetterImage` component.

### Pre-built Component

```tsx
import { BetterImage } from "@prass/betterimage/components";

export default function Example() {
  return (
    <BetterImage
      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
      alt="Example Image"
      width={600}
      height={900}
      onFailString="Example Image"
    />
  );
}
```

### Component Props

`BetterImage` extends the Next.js `Image` component and includes additional props:

| Prop           | Type            | Description                                                                  |
| -------------- | --------------- | ---------------------------------------------------------------------------- |
| `onFailString` | `string`        | Fallback string to display if the image fails to load.                       |
| `delay`        | `number`        | Delay rendering for users with slower connections, to improve performance.   |
| `Other Props`    | `...ImageProps` | All standard Next.js Image props are supported (e.g., `src`, `alt`, `width`, etc.) |

### Build Your Own Components

`BetterImage` is highly customizable. You can create your own components based on your project needs.

```tsx
import * as BetterThings from "@prass/betterimage";
import { pras } from "@prass/betterimage/lib";

const BetterVersion = React.forwardRef(({ className, ...props }, ref) => (
  <BetterThings.Root
    ref={ref}
    className={pras("relative flex h-full w-full", className)}
    {...props}
  />
));

BetterVersion.displayName = BetterThings.Root.displayName;

const Img = React.forwardRef(({ className, ...props }, ref) => (
  <BetterThings.Image
    ref={ref}
    className={pras("h-full w-full", className)}
    {...props}
  />
));

Img.displayName = BetterThings.Image.displayName;

const Fallback = React.forwardRef(({ className, ...props }, ref) => (
  <BetterThings.Fallback
    ref={ref}
    className={pras(
      "flex h-full w-full items-center justify-center",
      className
    )}
    {...props}
  >
    <Loader className="h-4 w-4 animate-spin" />
  </BetterThings.Fallback>
));

Fallback.displayName = BetterThings.Fallback.displayName;

export { BetterVersion, Img, Fallback };
```

## Why Choose BetterImage?

BetterImage simplifies image handling in your Next.js projects with:

- **Extended API**: Enhances Next.js Image with fallback animations and optimization features.
- **Built-in Fallbacks**: Automatically handles image loading and error states.
- **Fast Development**: Prebuilt components help you integrate optimized images quickly and maintain consistency.

## Limitations

- **Next.js Only**: This package is designed exclusively for Next.js. It is not compatible with other frameworks or libraries like React without Next.js.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Contributing

Contributions are welcome! If you find any bugs or have suggestions, feel free to open an issue or submit a pull request.

---

Elevate your Next.js image components with BetterImage! 🚀
