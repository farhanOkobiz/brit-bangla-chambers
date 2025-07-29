"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function TopLoader() {
  const pathname = usePathname();
  const loadingRef = useRef(false);

  useEffect(() => {
    // Start the progress bar on pathname change
    if (!loadingRef.current) {
      loadingRef.current = true;
      NProgress.start();
    }

    // Simulate page load complete after small delay (you can adjust)
    const timer = setTimeout(() => {
      NProgress.done();
      loadingRef.current = false;
    }, 300); // 300ms delay or tune based on your app's average load time

    return () => {
      clearTimeout(timer);
      NProgress.done();
      loadingRef.current = false;
    };
  }, [pathname]);

  return null;
}
