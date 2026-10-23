"use client";

import { Children, Fragment, isValidElement, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { fx } from "./fx";
import { useReveal } from "./motion";

const STAGGER = 0.06;

/** Wrap every word (and every inline element, e.g. a MarkedWord) so it can move on its own. */
function splitWords(children: ReactNode, delay: number) {
  let n = 0;
  const word = (key: string, content: ReactNode) => {
    const i = n++;
    return <span key={key} data-word className="fx inline-block" style={fx({ y: 60, k: true, r: i % 2 ? 4 : -3, d: delay + i * STAGGER, dur: 0.8 })}>{content}</span>;
  };
  const flatten = (value: ReactNode): ReactNode[] => Children.toArray(value).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment ? flatten(child.props.children) : [child],
  );
  const nodes = flatten(children).flatMap((child, c) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child).split(/(\s+)/).filter(Boolean).map((part, w) => (/^\s+$/.test(part) ? " " : word(`${c}-${w}`, part)));
    }
    return isValidElement(child) ? [word(`${c}-el`, child)] : [];
  });
  return { nodes, count: n };
}

/**
 * Headline that rises in word by word (with a slight playful tilt), then pops the shape behind
 * any highlighted word. Plays on load (`trigger="load"`) or when scrolled into view. Pure CSS once rendered.
 */
export function AnimatedText({
  as: Tag = "h2",
  children,
  className,
  style,
  trigger = "scroll",
  delay = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  trigger?: "load" | "scroll";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const load = trigger === "load";
  useReveal(ref, "top 85%", !load);
  const { nodes, count } = splitWords(children, delay);

  return (
    <Tag
      ref={ref}
      data-words=""
      data-fx-group=""
      {...(load ? { "data-in": "" } : {})}
      className={className}
      style={{ "--fx-mark-d": `${delay + count * STAGGER + 0.45}s`, ...style } as CSSProperties}
    >
      {nodes}
    </Tag>
  );
}
