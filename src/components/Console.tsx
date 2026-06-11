"use client";

import { useEffect } from "react";
import { consoleUtil } from "@/lib/utils/consoleUtil";

export default function ConsoleProvider() {
  useEffect(() => {
    // Initialize console easter egg when component mounts
    consoleUtil.init();
  }, []);

  // This component doesn't render anything visible
  return null;
}