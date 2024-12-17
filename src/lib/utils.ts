export const pras = (...args: (string | undefined)[]): string => {
  return args.filter(Boolean).join(" ");
};

export const getNextOptimizedUrl = (
  url: string,
  width: number,
  quality: number = 75 
): string => {
  const origin = window.location.origin;
  return `${origin}/_next/image?url=${encodeURIComponent(
    url
  )}&w=${width}&q=${quality}`;
};
