"use client";

import { useState } from "react";
import { Building2, Mail, MapPin, Phone, CheckCircle2, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserIdCardProps {
  email?: string;
  fullName?: string;
  avatar?: string;
  company?: string;
  phone?: string;
  location?: string;
  emailVerified?: boolean;
  userType?: "dealer" | "retailer" | "client";
  status?: "verified" | "pending" | "active";
  qrCodeUrl?: string;
  website?: string;
}

export function UserIdCard({
  email,
  fullName,
  avatar,
  company,
  phone,
  location,
  emailVerified = false,
  userType = "client",
  status = "pending",
  qrCodeUrl,
  website,
}: UserIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getStatusBadge = () => {
    if (status === "verified" || status === "active") {
      return (
        <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  const getUserTypeBadge = () => {
    const typeLabel = userType.charAt(0).toUpperCase() + userType.slice(1);
    return (
      <Badge variant="outline" className="gap-1.5">
        <User className="h-3 w-3" />
        {typeLabel}
      </Badge>
    );
  };

  return (
    <>
      <style jsx>{`
        .card-container {
          perspective: 1000px;
          width: 100%;
          max-width: 360px;
        }
        .card-inner {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div
        className="card-container cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front Side */}
          <div className="card-front">
            <div className="w-full h-full max-w-md space-y-4 bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl shadow-lg border border-slate-200">
              {/* Header with Avatar and Name */}
              <div className="flex items-start gap-3">
                <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                  <AvatarImage src={avatar} alt={fullName || email || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-semibold text-lg leading-none">
                    {fullName || email?.split("@")[0] || "User"}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {getUserTypeBadge()}
                    {getStatusBadge()}
                  </div>
                </div>
              </div>

              <Separator />

              {/* User Information */}
              <div className="space-y-3 text-sm">
                {email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Email</p>
                      <p className="text-foreground break-all">{email}</p>
                      {emailVerified && (
                        <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {company && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Company</p>
                      <p className="text-foreground">{company}</p>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Phone</p>
                      <p className="text-foreground">{phone}</p>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Location</p>
                      <p className="text-foreground">{location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground text-center mt-4">
                ↻ Tap to flip
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="card-back">
            <div className="w-full max-w-md bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl shadow-lg border border-primary/20 text-foreground min-h-[280px] flex flex-col justify-between">
              {/* Top Section with Company/Name */}
              <div>
                <h4 className="font-bold text-base text-foreground mb-1">
                  {fullName || "User"}
                </h4>
                {company && (
                  <p className="text-xs text-muted-foreground">{company}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 flex-1">
                {phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Phone</p>
                      <p className="text-sm text-foreground font-medium break-all">{phone}</p>
                    </div>
                  </div>
                )}

                {email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Email</p>
                      <p className="text-sm text-foreground break-all">{email}</p>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Location</p>
                      <p className="text-sm text-foreground">{location}</p>
                    </div>
                  </div>
                )}

                {website && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Website</p>
                      <p className="text-sm text-foreground break-all">{website}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code on Right Side */}
              <div className="flex justify-end">
                {qrCodeUrl ? (
                  <div className="bg-primary/10 p-2 rounded">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-primary/10 p-2 rounded">
                    <div className="w-24 h-24 bg-primary/5 rounded flex items-center justify-center">
                      <p className="text-xs text-primary/50">QR</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Text */}
              <div className="text-xs text-muted-foreground text-center mt-2">
                ← Tap to flip back
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
