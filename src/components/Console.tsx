"use client";

import { useEffect } from "react";

export default function ConsoleProvider() {
  useEffect(() => {
    let timeoutId: number | undefined;
    let idleCallbackId: number | undefined;

    const loadConsole = () => {
      void import("@/lib/utils/consoleUtil").then(({ consoleUtil }) => {
        consoleUtil.init();
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      idleCallbackId = window.requestIdleCallback(loadConsole, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(loadConsole, 1200);
    }

    return () => {
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
