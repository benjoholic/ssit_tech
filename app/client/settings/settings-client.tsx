"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Lock,
  Mail,
  Loader2,
  LogOut,
  Trash2,
  AlertTriangle,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  CheckCircle2,
} from "lucide-react";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  localStorage.setItem("theme", theme);

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

function formatDate(value: string) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const inputClassName =
  "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

export default function SettingsContent({
  email,
  fullName,
  provider,
  createdAt,
}: {
  email: string;
  fullName: string;
  provider: string;
  createdAt: string;
}) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("system");

  // Notification prefs (stored in localStorage)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Email change
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // Delete account
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Sign out
  const [signingOut, setSigningOut] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    setTheme(getStoredTheme());

    const storedEmailNotifs = localStorage.getItem("pref_email_notifs");
    if (storedEmailNotifs !== null)
      setEmailNotifs(storedEmailNotifs === "true");

    const storedOrderNotifs = localStorage.getItem("pref_order_notifs");
    if (storedOrderNotifs !== null)
      setOrderNotifs(storedOrderNotifs === "true");
  }, []);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    toast.success(`Theme set to ${newTheme}`);
  }, []);

  const handleToggleEmailNotifs = useCallback(() => {
    setEmailNotifs((prev) => {
      const next = !prev;
      localStorage.setItem("pref_email_notifs", String(next));
      toast.success(
        next ? "Email notifications enabled" : "Email notifications disabled",
      );
      return next;
    });
  }, []);

  const handleToggleOrderNotifs = useCallback(() => {
    setOrderNotifs((prev) => {
      const next = !prev;
      localStorage.setItem("pref_order_notifs", String(next));
      toast.success(
        next ? "Order notifications enabled" : "Order notifications disabled",
      );
      return next;
    });
  }, []);

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error("Failed to change password", {
          description: error.message,
        });
      } else {
        toast.success("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleChangeEmail() {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setChangingEmail(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast.error("Failed to update email", {
          description: error.message,
        });
      } else {
        toast.success("Verification email sent to your new address", {
          description: "Please check your inbox and confirm the change.",
        });
        setNewEmail("");
        setShowEmailSection(false);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setChangingEmail(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/credentials/client/login");
    } catch {
      toast.error("Failed to sign out");
      setSigningOut(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;

    setDeleting(true);
    try {
      const supabase = createClient();
      // Sign out first — actual deletion requires admin/service role
      // which should be handled server-side. For now, sign out and show message.
      await supabase.auth.signOut();
      toast.success("Account deletion requested", {
        description: "Please contact support to complete account deletion.",
      });
      router.push("/credentials/client/login");
    } catch {
      toast.error("Something went wrong");
      setDeleting(false);
    }
  }

  const themeOptions: {
    value: Theme;
    label: string;
    icon: typeof Sun;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Use light theme",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Use dark theme",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ];

  return (
    <main className="min-h-full bg-muted/30 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            General Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your appearance, notifications, and account settings.
          </p>
        </div>

        {/* Account Summary */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">
                  {fullName || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium truncate ml-2">
                  {email}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Provider</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {provider}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Member since
                </span>
                <span className="text-sm font-medium">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sun className="h-4 w-4 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Choose how the portal looks for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleThemeChange(opt.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    theme === opt.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <opt.icon
                    className={`h-6 w-6 ${
                      theme === opt.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === opt.value ? "text-primary" : ""
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    {opt.description}
                  </span>
                  {theme === opt.value && (
                    <Badge className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control what notifications you receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleEmailNotifs}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifs ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    emailNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                {orderNotifs ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Order Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified about order inquiry status changes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleOrderNotifs}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  orderNotifs ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    orderNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security / Account Management */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" />
              Security & Account
            </CardTitle>
            <CardDescription>
              Manage your password, email, and account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPasswordSection(!showPasswordSection);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  {showPasswordSection ? "Cancel" : "Change"}
                </Button>
              </div>
              {showPasswordSection && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-xs font-semibold"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className={inputClassName}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-xs font-semibold"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className={inputClassName}
                      autoComplete="new-password"
                    />
                  </div>
                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-xs">
                          Passwords do not match.
                        </AlertDescription>
                      </Alert>
                    )}
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      changingPassword ||
                      !newPassword ||
                      newPassword.length < 6 ||
                      newPassword !== confirmPassword
                    }
                    size="sm"
                    className="gap-2"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Change Email */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEmailSection(!showEmailSection);
                    setNewEmail("");
                  }}
                >
                  {showEmailSection ? "Cancel" : "Change"}
                </Button>
              </div>
              {showEmailSection && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <label
                      htmlFor="new-email"
                      className="text-xs font-semibold"
                    >
                      New Email Address
                    </label>
                    <input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter your new email"
                      className={inputClassName}
                      autoComplete="email"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A verification email will be sent to your new address.
                  </p>
                  <Button
                    onClick={handleChangeEmail}
                    disabled={
                      changingEmail || !newEmail || !newEmail.includes("@")
                    }
                    size="sm"
                    className="gap-2"
                  >
                    {changingEmail ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5" />
                        Update Email
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sign Out</p>
                  <p className="text-xs text-muted-foreground">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="gap-2"
                >
                  {signingOut ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader className="border-b border-destructive/20">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Delete Account
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data will
              be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                You will lose access to your profile, order inquiries, and all
                account data. This cannot be reversed.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Type <span className="font-mono text-destructive">DELETE</span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className={inputClassName}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "DELETE" || deleting}
              onClick={handleDeleteAccount}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
