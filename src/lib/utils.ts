export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return inputs
    .flatMap((x) => {
      if (!x) return [];
      if (typeof x === "string") return x.split(" ").filter(Boolean);
      if (typeof x === "object") {
        return Object.entries(x)
          .filter(([, val]) => Boolean(val))
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}
