"use client";

import { useEffect } from "react";

export default function ConsoleProvider() {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void import("@/lib/utils/consoleUtil").then(({ consoleUtil }) => {
        consoleUtil.init();
      });
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
