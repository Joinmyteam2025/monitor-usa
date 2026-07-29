import { useEffect } from "react";

/**
 * Sets the browser tab title for each page.
 * Appends " — MonitorUSA.ai" suffix automatically.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — MonitorUSA.ai` : "MonitorUSA.ai — AI-Powered Home Security Monitoring";
    return () => { document.title = prev; };
  }, [title]);
}
