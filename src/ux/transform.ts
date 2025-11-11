export const t = {
  scale: (v?: number) => [{ scale: Number.isFinite(v) ? (v as number) : 1 }],
  scaleXY: (x?: number, y?: number) => [
    { scaleX: Number.isFinite(x) ? (x as number) : 1 },
    { scaleY: Number.isFinite(y) ? (y as number) : 1 },
  ],
  rotate: (deg?: number | string) => [
    { rotate: typeof deg === "number" ? `${deg}deg` : (deg ?? "0deg") },
  ],
  translate: (x?: number, y?: number) => [
    { translateX: Number.isFinite(x) ? (x as number) : 0 },
    { translateY: Number.isFinite(y) ? (y as number) : 0 },
  ],
  scaleAnimated: (v: any) => [{ scale: v }],
  translateXAnimated: (v: any) => [{ translateX: v }],
  translateYAnimated: (v: any) => [{ translateY: v }],
};


