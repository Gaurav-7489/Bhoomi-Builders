import { Fragment, type ReactNode } from "react";

/** Splits "Built for _living_" into segments; underscored parts render as <em>. */
export function parseEm(text: string): { text: string; em: boolean }[] {
  return text
    .split(/(_[^_]+_)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("_") && part.endsWith("_")
        ? { text: part.slice(1, -1), em: true }
        : { text: part, em: false },
    );
}

export function renderEm(text: string): ReactNode {
  return parseEm(text).map((seg, i) =>
    seg.em ? <em key={i}>{seg.text}</em> : <Fragment key={i}>{seg.text}</Fragment>,
  );
}

export function plainText(text: string) {
  return text.replace(/_/g, "");
}
