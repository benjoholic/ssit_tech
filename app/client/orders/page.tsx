"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Send,
  Package,
  Clock,
  CheckCircle2,
  Eye,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductsAction } from "@/app/admin/products/actions";
import {
  submitOrderInquiry,
  getMyOrderInquiries,
  type OrderInquiry,
} from "./actions";
import type { Product } from "@/lib/products";

function formatDate(value: string) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
    case "reviewed":
      return (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Eye className="h-3 w-3" /> Reviewed
        </Badge>
      );
    case "completed":
      return (
        <Badge className="gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <XCircle className="h-3 w-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get("product") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<OrderInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedProductId, setSelectedProductId] =
    useState(preselectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([getProductsAction(), getMyOrderInquiries()]).then(
      ([prodRes, inqRes]) => {
        if (mounted) {
          if (!prodRes.error) setProducts(prodRes.data);
          if (!inqRes.error) setInquiries(inqRes.data);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  // If preselected product ID is set, update it once products load
  useEffect(() => {
    if (preselectedProductId && products.length > 0) {
      setSelectedProductId(preselectedProductId);
    }
  }, [preselectedProductId, products]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  const canSubmit =
    !submitting &&
    selectedProductId &&
    quantity >= 1 &&
    message.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const result = await submitOrderInquiry({
        productId: selectedProductId || null,
        productName: selectedProduct?.name ?? "Unknown Product",
        quantity,
        message: message.trim(),
      });

      if (result.error) {
        toast.error("Failed to submit inquiry", {
          description: result.error,
        });
      } else {
        toast.success("Order inquiry submitted!", {
          description: "We'll review your request shortly.",
        });
        // Reset form
        setSelectedProductId("");
        setQuantity(1);
        setMessage("");
        // Add to list
        if (result.data) {
          setInquiries((prev) => [result.data!, ...prev]);
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-full bg-muted/30 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Order Inquiry
          </h1>
          <p className="text-sm text-muted-foreground">
            Submit an order request for the products you&apos;re interested in.
            Our team will review and get back to you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Send className="h-4 w-4 text-primary" />
                  New Inquiry
                </CardTitle>
                <CardDescription>
                  Select a product and describe your order needs.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {/* Product selector */}
                  <div className="space-y-2">
                    <label
                      htmlFor="product-select"
                      className="text-sm font-semibold"
                    >
                      Product *
                    </label>
                    <select
                      id="product-select"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                      disabled={loading}
                    >
                      <option value="">Select a product…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₱
                          {typeof p.price === "number"
                            ? p.price.toFixed(2)
                            : "0.00"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected product preview */}
                  {selectedProduct && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {selectedProduct.image?.trim() ? (
                          <img
                            src={selectedProduct.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {selectedProduct.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₱
                          {typeof selectedProduct.price === "number"
                            ? selectedProduct.price.toFixed(2)
                            : "0.00"}{" "}
                          · {selectedProduct.stocks ?? 0} in stock
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-semibold">
                      Quantity *
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={9999}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, parseInt(e.target.value, 10) || 1),
                        )
                      }
                      className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold">
                      Message / Notes *
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your order requirements, preferred delivery date, special requests, etc."
                      maxLength={1000}
                      className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length}/1000 characters
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="border-t">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Inquiry History */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  My Inquiries
                </CardTitle>
                <CardDescription>
                  {inquiries.length}{" "}
                  {inquiries.length === 1 ? "inquiry" : "inquiries"} submitted
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="space-y-0 divide-y divide-border">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="px-4 py-4 space-y-2">
                        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-full bg-muted rounded animate-pulse" />
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No inquiries submitted yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submit your first order inquiry using the form.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {inquiries.map((inq) => (
                      <li key={inq.id} className="px-4 py-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">
                                {inq.product_name || "Unknown Product"}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                Qty: {inq.quantity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {inq.message}
                            </p>
                          </div>
                          <div className="shrink-0 text-right space-y-1">
                            <StatusBadge status={inq.status} />
                            <p className="text-[10px] text-muted-foreground">
                              {formatDate(inq.created_at)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
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
