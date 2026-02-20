"use client";

import { useEffect, useRef } from "react";

type BarcodeDisplayProps = {
  /** The barcode value to render */
  value: string;
  /** Height of the barcode in pixels (default: 40) */
  height?: number;
  /** Width of each bar (default: 1.5) */
  barWidth?: number;
  /** Whether to show the text below the barcode (default: true) */
  showText?: boolean;
  /** Font size for the text below the barcode (default: 12) */
  fontSize?: number;
  /** CSS class for the container */
  className?: string;
};

export function BarcodeDisplay({
  value,
  height = 40,
  barWidth = 1.5,
  showText = true,
  fontSize = 12,
  className = "",
}: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!value || !svgRef.current) return;

    // Dynamic import to avoid SSR issues
    import("jsbarcode").then((JsBarcode) => {
      const gen = JsBarcode.default || JsBarcode;
      try {
        gen(svgRef.current, value, {
          format: "CODE128", // auto-detects most formats; CODE128 is the safest fallback
          width: barWidth,
          height,
          displayValue: showText,
          fontSize,
          margin: 4,
          background: "transparent",
          lineColor: "currentColor",
        });
      } catch {
        // If CODE128 fails (e.g. unsupported chars), try with "auto" which is CODE128 anyway
        // but clear the element so it doesn't show a broken barcode
        if (svgRef.current) {
          svgRef.current.innerHTML = "";
        }
      }
    });
  }, [value, height, barWidth, showText, fontSize]);

  if (!value) return null;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg ref={svgRef} />
    </div>
  );
}
