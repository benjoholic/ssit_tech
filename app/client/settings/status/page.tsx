import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, Mail, Calendar, Shield, CheckCircle2, Clock, Building2, Phone } from "lucide-react";

function Avatar({ name, email, imageSrc }: { name?: string; email?: string; imageSrc?: string }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email
    ? email[0].toUpperCase()
    : "U";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg ring-4 ring-background">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name || "Profile picture"}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <span className="text-4xl font-semibold text-primary-foreground">{initials}</span>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/50 p-5 transition-colors hover:bg-muted/70">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function LogoPattern() {
  const watermark = (
    <div className="flex flex-col items-center justify-center gap-0.5 whitespace-nowrap text-primary/[0.035]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-7 shrink-0"
        aria-hidden
      >
        <path
          d="M2 12l4-9 14 6-8 2-6 8-4-7z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-tight">SSIT TECH</span>
    </div>
  );
  const positions = [
    { top: "0%", left: "-2%" },
    { top: "8%", left: "22%" },
    { top: "0%", left: "46%" },
    { top: "8%", left: "70%" },
    { top: "0%", left: "94%" },
    { top: "38%", left: "-8%" },
    { top: "46%", left: "16%" },
    { top: "38%", left: "40%" },
    { top: "46%", left: "64%" },
    { top: "38%", left: "88%" },
    { top: "76%", left: "-2%" },
    { top: "84%", left: "22%" },
    { top: "76%", left: "46%" },
    { top: "84%", left: "70%" },
    { top: "76%", left: "94%" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute watermark-item"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          {watermark}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ verified }: { verified: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        verified
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      }`}
    >
      {verified ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verified
        </>
      ) : (
        <>
          <Clock className="h-3.5 w-3.5" />
          Pending
        </>
      )}
    </div>
  );
}

export default async function ClientSettingsStatusPage() {
  const supabase = await createClient();
  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Error getting user from auth server
    user = null;
  }

  if (!user) {
    redirect("/unauthenticated");
  }
  const userMetadata = user.user_metadata || {};
  const fullName = userMetadata.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "No email";
  const emailVerified = user.email_confirmed_at !== null;
  const createdAt = user.created_at ? new Date(user.created_at) : null;
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Account Status</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage your account information
            </p>
          </div>
          <StatusBadge verified={emailVerified} />
        </div>

        {/* Profile Section */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm">
          <LogoPattern />
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Profile Picture */}
            <div className="flex shrink-0 justify-center">
              <Avatar 
                name={fullName} 
                email={email} 
                imageSrc="/images/Formal_Attire_Benj.png"
              />
            </div>

            {/* Profile Details */}
            <div className="w-full space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{fullName}</h2>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-muted-foreground">{email}</p>
                  {emailVerified && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={User}
                  label="Full Name"
                  value={fullName}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={
                    <span className="flex items-center gap-2">
                      {email}
                      {emailVerified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </span>
                  }
                />
                <InfoCard
                  icon={Calendar}
                  label="Account Created"
                  value={
                    createdAt
                      ? createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"
                  }
                />
                <InfoCard
                  icon={Clock}
                  label="Last Sign In"
                  value={
                    lastSignIn
                      ? lastSignIn.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Account Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <StatusBadge verified={emailVerified} />
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <span className="text-sm font-medium">
                  {emailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">
                  {createdAt
                    ? createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Activity Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <span className="text-sm font-medium">
                  {lastSignIn ? "Active" : "New Account"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Last Activity</span>
                <span className="text-sm font-medium">
                  {lastSignIn
                    ? lastSignIn.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Never"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Account Age</span>
                <span className="text-sm font-medium">
                  {createdAt
                    ? `${Math.floor(
                        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
                      )} days`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium capitalize">
                  {user.app_metadata?.provider || "Email"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
