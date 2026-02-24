"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  User,
  Settings,
  CheckCircle2,
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product, CategoryEntry } from "@/lib/products";

type Props = {
  products: Product[];
  categories: CategoryEntry[];
  email: string;
  fullName: string;
  avatarUrl: string;
  emailVerified: boolean;
  createdAt: string;
};

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function ClientDashboard({
  products,
  categories,
  email,
  fullName,
  avatarUrl,
  emailVerified,
  createdAt,
}: Props) {
  const displayName = fullName?.trim() || email?.split("@")[0] || "User";
  const recentProducts = products.slice(-6).reverse();

  const initials = fullName
    ? fullName
        .trim()
        .split(/\s+/)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email
      ? email[0]?.toUpperCase()
      : "U";

  const totalStock = products.reduce(
    (sum, p) => sum + (typeof p.stocks === "number" ? p.stocks : 0),
    0,
  );

  const quickLinks = [
    {
      href: "/client/products",
      label: "Browse Products",
      description: "View full product catalog",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      href: "/client/orders",
      label: "Order Inquiry",
      description: "Submit a new order request",
      icon: ShoppingCart,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      href: "/client/profile",
      label: "My Profile",
      description: "Update your personal info",
      icon: User,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      href: "/client/settings",
      label: "Settings",
      description: "Manage preferences",
      icon: Settings,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <main className="min-h-full bg-muted/30 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s an overview of your account and the latest products.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {emailVerified ? (
              <Badge className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Pending Verification
              </Badge>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-xl font-bold">{categories.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Total Stock</p>
                <p className="text-xl font-bold">
                  {totalStock.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-semibold truncate">
                  {formatDate(createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Recent Products + Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base">Latest Products</CardTitle>
                  <CardDescription>
                    Recently added to the catalog
                  </CardDescription>
                </div>
                <Link
                  href="/client/products"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {recentProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No products available yet.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentProducts.map((product) => (
                      <li key={product.id}>
                        <Link
                          href="/client/products"
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                            {product.image && product.image.trim() ? (
                              <img
                                src={product.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.description || "No description"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">
                              ₱
                              {typeof product.price === "number"
                                ? product.price.toFixed(2)
                                : "0.00"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {typeof product.stocks === "number"
                                ? product.stocks
                                : 0}{" "}
                              in stock
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-3 grid-cols-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${link.bg}`}
                      >
                        <link.icon className={`h-5 w-5 ${link.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{link.label}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {link.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Right sidebar: Account Overview */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary shadow-sm ring-2 ring-background">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-primary-foreground">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    {emailVerified ? (
                      <Badge variant="default" className="text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Clock className="h-3 w-3" /> Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium text-xs">
                      {formatDate(createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/client/profile"
                    className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Categories Overview */}
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base">Categories</CardTitle>
                <CardDescription>Product categories available</CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No categories yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((cat) => {
                      const count = products.filter(
                        (p) => p.category === cat.name,
                      ).length;
                      return (
                        <li
                          key={cat.id}
                          className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                        >
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {count} {count === 1 ? "product" : "products"}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
