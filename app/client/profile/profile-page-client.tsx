"use client";

import type { ElementType, ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  IdCard,
  MapPin,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ProfileFormState = {
  fullName: string;
  avatarUrl: string;
  company: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
};

function formatDate(value: string) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateTime(value: string) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeWebsite(value: string) {
  const v = value.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function Avatar({
  name,
  email,
  imageSrc,
}: {
  name?: string;
  email?: string;
  imageSrc?: string;
}) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email
    ? email[0]?.toUpperCase()
    : "U";

  return (
    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary shadow-sm ring-4 ring-background">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name || "Profile picture"}
          fill
          className="object-cover"
          sizes="112px"
          priority
        />
      ) : (
        <span className="text-3xl font-semibold text-primary-foreground">{initials}</span>
      )}
    </div>
  );
}

function Field({
  label,
  id,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  id: string;
  icon?: ElementType;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold">
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" aria-hidden /> : null}
        <span>{label}</span>
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

export default function ClientProfilePage({
  userId,
  email,
  emailVerified,
  createdAt,
  provider,
  initialProfile,
}: {
  userId: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  provider: string;
  initialProfile: ProfileFormState;
}) {
  const [baseline, setBaseline] = useState<ProfileFormState>(initialProfile);
  const [form, setForm] = useState<ProfileFormState>(initialProfile);
  const [saving, setSaving] = useState(false);

  const displayName = form.fullName?.trim() || email?.split("@")[0] || "User";

  const dirty = useMemo(() => {
    return (
      form.fullName !== baseline.fullName ||
      form.avatarUrl !== baseline.avatarUrl ||
      form.company !== baseline.company ||
      form.phone !== baseline.phone ||
      form.location !== baseline.location ||
      normalizeWebsite(form.website) !== normalizeWebsite(baseline.website) ||
      form.bio !== baseline.bio
    );
  }, [form, baseline]);

  const canSave = dirty && !saving;

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const payload: ProfileFormState = {
        ...form,
        website: normalizeWebsite(form.website),
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: payload.fullName,
          avatar_url: payload.avatarUrl,
          company: payload.company,
          phone: payload.phone,
          location: payload.location,
          website: payload.website,
          bio: payload.bio,
        },
      });

      if (error) {
        toast.error("Could not save profile", { description: error.message });
        return;
      }

      setBaseline(payload);
      setForm(payload);
      toast.success("Profile saved");
    } catch (e) {
      toast.error("Could not save profile", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    setForm(baseline);
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal info and how it appears across the client portal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              {emailVerified ? "Verified account" : "Verification pending"}
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Member since {formatDate(createdAt)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" aria-hidden />
                  Overview
                </CardTitle>
                <CardDescription>Your public-facing profile summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar name={displayName} email={email} imageSrc={form.avatarUrl || undefined} />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{displayName}</p>
                    <p className="truncate text-sm text-muted-foreground">{email || "No email"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {emailVerified ? (
                        <Badge className="gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          Pending
                        </Badge>
                      )}
                      {form.company ? (
                        <Badge variant="secondary" className="gap-1.5">
                          <Building2 className="h-3.5 w-3.5" aria-hidden />
                          {form.company}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                {form.bio ? (
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-sm leading-relaxed text-foreground">{form.bio}</p>
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>Add a short bio</AlertTitle>
                    <AlertDescription>
                      A short bio helps support understand your context faster.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-primary" aria-hidden />
                  Account
                </CardTitle>
                <CardDescription>Helpful details about your sign-in.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs font-medium text-foreground">
                    {userId ? `${userId.slice(0, 8)}...` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="text-sm font-medium capitalize">{provider || "email"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{formatDateTime(createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email status</span>
                  <span className="text-sm font-medium">{emailVerified ? "Verified" : "Pending"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-primary" aria-hidden />
                  Edit profile
                </CardTitle>
                <CardDescription>
                  Updates are saved to your Supabase user metadata.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="fullName" icon={User}>
                    <input
                      id="fullName"
                      className={inputClassName}
                      value={form.fullName}
                      onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Jane Doe"
                      autoComplete="name"
                    />
                  </Field>

                  <Field label="Email" id="email" icon={Mail} hint="Email is managed by your login provider.">
                    <input
                      id="email"
                      className={cn(inputClassName, "bg-muted/40")}
                      value={email}
                      disabled
                      readOnly
                    />
                  </Field>

                  <Field label="Company" id="company" icon={Building2}>
                    <input
                      id="company"
                      className={inputClassName}
                      value={form.company}
                      onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                      placeholder="e.g. SSIT Tech"
                      autoComplete="organization"
                    />
                  </Field>

                  <Field label="Phone" id="phone" icon={Phone}>
                    <input
                      id="phone"
                      className={inputClassName}
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="e.g. +1 555 123 4567"
                      autoComplete="tel"
                    />
                  </Field>

                  <Field label="Location" id="location" icon={MapPin}>
                    <input
                      id="location"
                      className={inputClassName}
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. New York, NY"
                      autoComplete="address-level2"
                    />
                  </Field>

                  <Field label="Website" id="website" icon={Globe} hint="We’ll automatically add https:// if needed.">
                    <input
                      id="website"
                      className={inputClassName}
                      value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      placeholder="e.g. ssit-tech.com"
                      inputMode="url"
                      autoComplete="url"
                    />
                  </Field>
                </div>

                <Field label="Bio" id="bio" hint="Optional. Keep it short and helpful for support." icon={User}>
                  <textarea
                    id="bio"
                    className={textareaClassName}
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell us a little about yourself…"
                    maxLength={280}
                  />
                </Field>

                <Field
                  label="Avatar URL"
                  id="avatarUrl"
                  hint="Optional. Paste a public image URL."
                  icon={User}
                >
                  <input
                    id="avatarUrl"
                    className={inputClassName}
                    value={form.avatarUrl}
                    onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                    placeholder="https://…"
                    inputMode="url"
                    autoComplete="photo"
                  />
                </Field>
              </CardContent>

              <CardFooter className="border-t justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {dirty ? "You have unsaved changes." : "All changes saved."}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    disabled={!dirty || saving}
                  >
                    Reset
                  </Button>
                  <Button type="button" onClick={onSave} disabled={!canSave}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

