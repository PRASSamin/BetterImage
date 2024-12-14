export const pras = (...args: (string | undefined)[]): string => {
  return args.filter(Boolean).join(" ");
};
