export const QuickCopyVariants = {
  Default: "default",
  Featured: "featured",
} as const;

export type QuickCopyVariant = (typeof QuickCopyVariants)[keyof typeof QuickCopyVariants];

export const NodeFrameVariants = {
  Default: "default",
  Featured: "featured",
} as const;

export type NodeFrameVariant = (typeof NodeFrameVariants)[keyof typeof NodeFrameVariants];

export const NodePortSides = {
  Top: "top",
  Right: "right",
  Bottom: "bottom",
  Left: "left",
} as const;

export type NodePortSide = (typeof NodePortSides)[keyof typeof NodePortSides];

export const NodePortTones = {
  Active: "active",
  Muted: "muted",
} as const;

export type NodePortTone = (typeof NodePortTones)[keyof typeof NodePortTones];
