export const tx = {
  scale: (n: number) => [{ scale: n }],
  rotate: (deg: number | string) => [
    {
      rotate: typeof deg === "number" ? `${deg}deg` : deg,
    },
  ],
  translateY: (n: number) => [{ translateY: n }],
  translateX: (n: number) => [{ translateX: n }],
};


