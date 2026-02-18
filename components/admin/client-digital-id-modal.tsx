"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { User, Download, Printer, RotateCw } from "lucide-react";

type ListUsersResponse = Awaited<
  ReturnType<ReturnType<typeof import("@/lib/supabase/admin")["createAdminClient"]>["auth"]["admin"]["listUsers"]>
>;
type UserItem = NonNullable<ListUsersResponse["data"]>["users"][number];

interface ClientDigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: UserItem | null;
}

export function ClientDigitalIdModal({
  isOpen,
  onClose,
  client,
}: ClientDigitalIdModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!client) return null;

  const fullName = (client.user_metadata?.full_name as string) || "—";
  const type = ((client.user_metadata?.type as string) || "retailer").charAt(0).toUpperCase() + 
    ((client.user_metadata?.type as string) || "retailer").slice(1);
  const phone = (client.user_metadata?.phone as string) || "—";
  const address = (client.user_metadata?.address as string) || "—";
  const isVerified = client.user_metadata?.verified as boolean;
  const isEmailConfirmed = !!client.email_confirmed_at;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-xl w-full sm:max-w-2xl p-3 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Client Digital ID</DialogTitle>
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RotateCw className="h-3 w-3" />
              {isFlipped ? "Show Front" : "Show Back"}
            </button>
          </div>
        </DialogHeader>

        <div className="[perspective:1200px] mx-4 sm:mx-6">
          <div
            ref={cardRef}
            className={`relative transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <Card className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden [backface-visibility:hidden] sm:min-h-[220px]">
              {/* Logo */}
              <div className="absolute -top-4 sm:-top-3 right-2 sm:right-3 w-14 h-14 sm:w-20 sm:h-20">
                <Image
                  src="/images/ssit.png"
                  alt="System Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex px-2 sm:px-4 gap-2 sm:gap-3">
                {/* Left Section - Profile Image and ID */}
                <div className="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="w-20 h-24 sm:w-32 sm:h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 rounded flex-shrink-0">
                    <div className="w-14 h-20 sm:w-24 sm:h-28 rounded-lg bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 sm:w-10 sm:h-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] sm:text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">ID</p>
                    <p className="text-[8px] sm:text-xs font-mono font-semibold text-primary">
                      {client.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Right Section - Information */}
                <div className="flex-1 space-y-1.5 sm:space-y-2">
                  {/* Header: Name */}
                  <div className="border-b border-primary/20 pb-1.5 sm:pb-2">
                    <p className="text-[7px] sm:text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                      NAME
                    </p>
                    <p className="text-[10px] sm:text-sm font-bold text-foreground leading-tight">{fullName.toUpperCase()}</p>
                  </div>

                  {/* Grid Information */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1 sm:py-2 text-[7px] sm:text-[9px]">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-[8px] sm:text-[10px] text-foreground break-words">{client.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-[8px] sm:text-[10px] text-foreground">{phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Address</p>
                      <p className="text-[8px] sm:text-[10px] text-foreground truncate">{address}</p>
                    </div>
                  </div>

                  {/* Type and Status Row */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1 sm:py-2 border-t border-primary/20">
                    <div>
                      <p className="text-[7px] sm:text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Type</p>
                      <span className="inline-flex items-center rounded px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] font-semibold bg-blue-100 text-blue-900 leading-none">
                        {type}
                      </span>
                    </div>
                    <div>
                      <p className="text-[7px] sm:text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
                      <span className={`inline-flex items-center rounded px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] font-semibold leading-none ${
                        !isEmailConfirmed
                          ? "bg-red-100 text-red-900"
                          : isVerified
                          ? "bg-green-100 text-green-900"
                          : "bg-yellow-100 text-yellow-900"
                      }`}>
                        {!isEmailConfirmed ? "Unconfirmed" : isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[7px] sm:text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Issued</p>
                      <p className="text-[8px] sm:text-[10px] text-foreground font-mono">
                        {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Verification Footer */}
                  <div className="pt-1 sm:pt-2 border-t border-primary/20 space-y-0.5 text-[7px] sm:text-[9px] flex gap-1 sm:gap-4">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className="text-muted-foreground">Email:</span>
                      <span className={isEmailConfirmed ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {isEmailConfirmed ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className="text-muted-foreground">Account:</span>
                      <span className={isVerified ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                        {isVerified ? "✓" : "•"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="relative absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] sm:min-h-[220px]">
              {/* Logo */}
              <div className="absolute -top-4 sm:-top-3 right-2 sm:right-3 w-14 h-14 sm:w-20 sm:h-20">
                <Image
                  src="/images/ssit.png"
                  alt="System Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="h-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                    <div>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Client</p>
                      <p className="text-sm sm:text-base font-semibold text-foreground">{fullName.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Full ID</p>
                      <p className="text-[9px] sm:text-[11px] font-mono text-primary break-all">
                        {client.id.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[8px] sm:text-[10px]">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider">Email Confirmed</p>
                      <p className={isEmailConfirmed ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {isEmailConfirmed ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider">Account Verified</p>
                      <p className={isVerified ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                        {isVerified ? "Yes" : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider">Issued</p>
                      <p className="text-foreground font-mono">{new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider">Type</p>
                      <p className="text-foreground font-semibold">{type}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] sm:text-[10px] text-muted-foreground border-t border-primary/20 pt-2">
                  <p className="uppercase tracking-wider">Support</p>
                  <p className="text-foreground">For updates, contact admin support.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4">
          <button
            onClick={async () => {
              if (!cardRef.current) return;
              
              const html2pdf = (await import("html2pdf.js")).default;
              
              // Create a PDF version that matches the displayed card
              const printContent = document.createElement('div');
              printContent.innerHTML = `
                <div style="
                  width: 210mm;
                  height: 100mm;
                  padding: 20px 30px;
                  background: #f9f9f9;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                  box-sizing: border-box;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                ">
                  <!-- Header with Logo -->
                  <div style="position: relative; margin-bottom: 20px;">
                    <div style="position: absolute; top: 0; right: 0; font-weight: bold; color: #1a5f7a; font-size: 18px;">
                      SSIT
                    </div>
                    <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">CLIENT</div>
                    <div style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin-top: 4px;">${fullName.toUpperCase()}</div>
                  </div>

                  <!-- Full ID Section -->
                  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                    <div>
                      <div style="font-size: 10px; color: #999; text-transform: uppercase;">Email Confirmed</div>
                      <div style="font-size: 12px; font-weight: bold; color: ${isEmailConfirmed ? '#4caf50' : '#f44336'}; margin-top: 4px;">
                        ${isEmailConfirmed ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <div style="font-size: 10px; color: #999; text-transform: uppercase;">Account Verified</div>
                      <div style="font-size: 12px; font-weight: bold; color: ${isVerified ? '#4caf50' : '#ff9800'}; margin-top: 4px;">
                        ${isVerified ? 'Yes' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  <!-- Info Grid -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px;">
                    <div>
                      <div style="font-size: 10px; color: #999; text-transform: uppercase;">ISSUED</div>
                      <div style="font-size: 12px; color: #1a1a1a; margin-top: 4px;">${new Date(client.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style="font-size: 10px; color: #999; text-transform: uppercase;">TYPE</div>
                      <div style="font-size: 12px; color: #1a1a1a; margin-top: 4px;">${type}</div>
                    </div>
                  </div>

                  <!-- Support Section -->
                  <div style="padding-top: 15px; border-top: 1px solid #ddd;">
                    <div style="font-size: 10px; color: #999; text-transform: uppercase; margin-bottom: 4px;">SUPPORT</div>
                    <div style="font-size: 11px; color: #1a1a1a;">For updates, contact admin support.</div>
                  </div>

                  <!-- Full ID at bottom -->
                  <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <div style="font-size: 10px; color: #999; text-transform: uppercase;">FULL ID</div>
                    <div style="font-size: 11px; color: #1a5f7a; font-family: monospace; font-weight: bold; margin-top: 4px; word-break: break-all;">${client.id.toUpperCase()}</div>
                  </div>
                </div>
              `;
              
              const opt = {
                margin: 0,
                filename: `${fullName.toUpperCase()}-ID-${client.id.slice(0, 8)}.pdf`,
                image: { type: 'png' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { orientation: 'landscape' as const, unit: 'mm', format: 'a5' }
              };
              
              html2pdf().set(opt).from(printContent).save();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg border border-input bg-background hover:bg-muted transition-colors text-xs sm:text-sm font-medium"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </button>
          
          <button
            onClick={() => {
              if (!cardRef.current) return;
              
              const element = cardRef.current.cloneNode(true) as HTMLElement;
              const printWindow = window.open('', '', 'width=800,height=600');
              
              if (printWindow) {
                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Print ID</title>
                      <style>
                        body { margin: 0; padding: 20px; }
                        @media print { body { margin: 0; padding: 0; } }
                      </style>
                    </head>
                    <body>
                      ${element.outerHTML}
                    </body>
                  </html>
                `);
                printWindow.document.close();
                setTimeout(() => {
                  printWindow.print();
                }, 250);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-xs sm:text-sm font-medium text-primary-foreground"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Print</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
