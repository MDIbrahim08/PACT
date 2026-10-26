"use client";

import { useEffect, useState } from "react";

export type TypewriterPhase = "typing" | "holding" | "deleting" | "gap" | "idle";

export interface UseTypewriterOptions {
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  gapMs?: number;
  enabled?: boolean;
}

export function useTypewriter(
  prompts: string[],
  {
    typeMs = 48,
    deleteMs = 14,
    holdMs = 3400,
    gapMs = 900,
    enabled = true,
  }: UseTypewriterOptions = {}
) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<TypewriterPhase>("idle");

  useEffect(() => {
    if (!enabled || !prompts || prompts.length === 0) {
      setPhase("idle");
      return;
    }

    const currentPrompt = prompts[promptIndex % prompts.length] || "";
    let timer: NodeJS.Timeout;

    if (phase === "idle") {
      setPhase("typing");
      return;
    }

    if (phase === "typing") {
      if (text.length < currentPrompt.length) {
        timer = setTimeout(() => {
          setText(currentPrompt.slice(0, text.length + 1));
        }, typeMs);
      } else {
        setPhase("holding");
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => {
        setPhase("deleting");
      }, holdMs);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deleteMs);
      } else {
        setPhase("gap");
      }
    } else if (phase === "gap") {
      timer = setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        setPhase("typing");
      }, gapMs);
    }

    return () => clearTimeout(timer);
  }, [enabled, prompts, promptIndex, text, phase, typeMs, deleteMs, holdMs, gapMs]);

  return { text, phase };
}
