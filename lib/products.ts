export type ProductCategory = "cctv" | "access_point" | "switch";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stocks: number;
  image: string;
};

export const PRODUCTS_STORAGE_KEY = "ssit_admin_products";

export const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Dome Camera HD 1080p", description: "Indoor/outdoor dome camera with 1080p resolution and night vision.", category: "cctv", price: 89.99, stocks: 0, image: "" },
  { id: "2", name: "Bullet Camera 4MP", description: "Weatherproof bullet camera with 4MP resolution and wide dynamic range.", category: "cctv", price: 129.99, stocks: 0, image: "" },
  { id: "3", name: "NVR 8-Channel", description: "Network video recorder supporting up to 8 cameras with PoE.", category: "cctv", price: 249.99, stocks: 0, image: "" },
  { id: "4", name: "Indoor Access Point Wi-Fi 6", description: "Dual-band Wi-Fi 6 access point for high-density indoor deployment.", category: "access_point", price: 159.99, stocks: 0, image: "" },
  { id: "5", name: "Outdoor Access Point Dual-Band", description: "Weatherproof outdoor AP with dual-band and mesh capability.", category: "access_point", price: 199.99, stocks: 0, image: "" },
  { id: "6", name: "Mesh Access Point", description: "Seamless roaming mesh node for extended coverage.", category: "access_point", price: 139.99, stocks: 0, image: "" },
  { id: "7", name: "Managed Switch 24-Port", description: "Layer 2 managed switch with 24 Gigabit ports and VLAN support.", category: "switch", price: 299.99, stocks: 0, image: "" },
  { id: "8", name: "Unmanaged Switch 8-Port", description: "Plug-and-play 8-port Gigabit desktop switch.", category: "switch", price: 49.99, stocks: 0, image: "" },
  { id: "9", name: "PoE Switch 16-Port", description: "16-port switch with PoE+ for cameras and access points.", category: "switch", price: 349.99, stocks: 0, image: "" },
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cctv: "CCTV",
  access_point: "Access point",
  switch: "Switch",
};

function normalizeProduct(p: Record<string, unknown>): Product {
  const s = p.stocks ?? p.quantity;
  const stocks =
    typeof s === "number" && Number.isInteger(s) && s >= 0 ? s : Math.max(0, Math.floor(Number(s) || 0));
  return {
    id: typeof p.id === "string" ? p.id : "",
    name: typeof p.name === "string" ? p.name : "",
    description: typeof p.description === "string" ? p.description : "",
    category: p.category === "cctv" || p.category === "access_point" || p.category === "switch" ? p.category : "cctv",
    price: typeof p.price === "number" && p.price >= 0 ? p.price : 0,
    stocks,
    image: typeof p.image === "string" ? p.image : "",
  };
}

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map((p) => normalizeProduct(p))
      : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function setStoredProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}
