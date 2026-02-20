"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, X, ScanBarcode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeDisplay } from "@/components/barcode-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BarcodeScannerProps = {
  /** Called when a barcode is successfully scanned */
  onScan: (decodedText: string) => void;
  /** Current barcode value (for display) */
  value?: string;
  /** Called when the barcode is cleared */
  onClear?: () => void;
};

/** Play a short success beep using the Web Audio API (no external files needed). */
function playSuccessBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Two-tone rising beep
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.08); // E6
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);

    // Cleanup
    osc.onended = () => {
      gain.disconnect();
      osc.disconnect();
      ctx.close();
    };
  } catch {
    // Audio not available — silently ignore
  }
}

export function BarcodeScanner({ onScan, value, onClear }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const scannerRef = useRef<any>(null);
  const readerIdRef = useRef(`barcode-reader-${Date.now()}`);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        // State 2 = SCANNING, State 3 = PAUSED
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore errors during cleanup
      }
      try {
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    setScanning(true);
    setScanSuccess(false);

    try {
      // Dynamic import to avoid SSR issues
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      // Ensure DOM element exists
      await new Promise((r) => setTimeout(r, 150));

      const element = document.getElementById(readerIdRef.current);
      if (!element) {
        setError("Scanner element not found. Please try again.");
        setScanning(false);
        return;
      }

      const html5Qrcode = new Html5Qrcode(readerIdRef.current, {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR,
        ],
      });
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" }, // prefer back camera
        {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            // Responsive scan region — large enough on mobile, constrained on desktop
            const width = Math.floor(viewfinderWidth * 0.85);
            const height = Math.floor(viewfinderHeight * 0.5);
            return { width: Math.max(width, 150), height: Math.max(height, 100) };
          },
        } as any,
        (decodedText: string) => {
          // Play success beep
          playSuccessBeep();

          // Show success state briefly, then close
          setScanSuccess(true);
          onScan(decodedText);
          stopScanner();

          // Auto-close dialog after a brief success flash
          setTimeout(() => {
            setOpen(false);
            setScanSuccess(false);
          }, 600);
        },
        () => {
          // Scan failure (no code found in frame) — called continuously, ignore
        }
      );
    } catch (err: any) {
      setScanning(false);
      if (err?.toString?.().includes("NotAllowedError")) {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err?.toString?.().includes("NotFoundError")) {
        setError("No camera found on this device.");
      } else {
        setError(err?.message ?? "Failed to start camera. Make sure to use HTTPS.");
      }
    }
  }, [onScan, stopScanner]);

  // Cleanup on unmount or dialog close
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopScanner();
      setScanSuccess(false);
    }
    setOpen(isOpen);
  };

  const handleOpen = () => {
    // Reset reader ID to ensure fresh DOM element
    readerIdRef.current = `barcode-reader-${Date.now()}`;
    setError(null);
    setScanSuccess(false);
    setOpen(true);
  };

  // Auto-start scanner when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        startScanner();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open, startScanner]);

  return (
    <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
      <label className="text-xs lg:text-[11px] text-muted-foreground">Barcode</label>

      {/* Mobile: stack vertically | sm+: single row */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        {/* Scan / Re-scan button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleOpen}
          className="w-full sm:w-auto shrink-0 gap-1.5 rounded-full border border-input bg-muted/50 py-2 sm:py-2 lg:py-1.5 px-3 sm:px-3 lg:px-2.5 text-xs sm:text-sm lg:text-xs h-auto font-normal text-muted-foreground hover:text-foreground justify-center sm:justify-start"
        >
          <Camera className="h-3.5 w-3.5 shrink-0" />
          {value ? "Re-scan barcode" : "Scan barcode"}
        </Button>

        {/* Scanned barcode display */}
        {value ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex-1 flex items-center gap-2 min-w-0 rounded-xl border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2.5 sm:px-3 lg:px-2 overflow-hidden">
              <BarcodeDisplay value={value} height={32} barWidth={1.2} fontSize={9} className="text-foreground" />
            </div>
            {/* Clear button */}
            {onClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 sm:h-8 lg:h-7 px-1.5 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={onClear}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <span className="text-xs lg:text-[11px] text-muted-foreground italic px-1 sm:px-0">
            No barcode scanned
          </span>
        )}
      </div>

      {/* Scanner dialog — full-screen on mobile, centered card on sm+ */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 p-0 w-full max-w-[100vw] sm:max-w-md max-h-[100dvh] sm:max-h-[85vh] overflow-hidden flex flex-col fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] rounded-none sm:rounded-lg">
          <DialogHeader className="gap-0.5 border-b border-gray-400/30 bg-gray-400/10 px-4 sm:px-4 py-3 sm:py-3 dark:border-gray-500/30 dark:bg-gray-500/10 shrink-0">
            <DialogTitle className="text-sm sm:text-base font-medium text-gray-400 dark:text-gray-400">
              Scan Barcode
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-gray-400 dark:text-gray-400">
              Point your camera at a barcode to scan it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col px-3 sm:px-4 py-3 sm:py-4 overflow-hidden">
            {/* Scanner viewport — fills available space on mobile */}
            <div className="relative flex-1 min-h-0">
              {/*
                CSS overrides for html5-qrcode injected elements:
                - video must fill the container and not overflow
                - canvas/img used for scanning must stay contained
              */}
              <style>{`
                #${readerIdRef.current} video {
                  width: 100% !important;
                  height: 100% !important;
                  object-fit: cover !important;
                  border-radius: 0.5rem;
                }
                #${readerIdRef.current} img {
                  display: none !important;
                }
                #${readerIdRef.current} {
                  border: none !important;
                  width: 100% !important;
                  height: 100% !important;
                }
              `}</style>
              <div
                id={readerIdRef.current}
                className="w-full h-full overflow-hidden rounded-lg bg-black min-h-[200px] sm:min-h-[300px]"
              />

              {/* Success overlay */}
              {scanSuccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-green-500/90 text-white animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                  <p className="text-sm font-semibold">Barcode Scanned!</p>
                </div>
              )}
            </div>

            {scanning && !error && !scanSuccess && (
              <p className="mt-3 text-center text-xs text-muted-foreground animate-pulse shrink-0">
                Scanning… Point camera at a barcode
              </p>
            )}

            {error && (
              <div className="mt-3 space-y-2 shrink-0">
                <p className="text-center text-xs text-destructive">{error}</p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 px-4"
                    onClick={() => {
                      stopScanner();
                      setTimeout(startScanner, 200);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
