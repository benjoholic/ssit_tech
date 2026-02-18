"use client";

import { useState, useMemo, useTransition } from "react";
import { Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientDigitalIdModal } from "@/components/admin/client-digital-id-modal";

type ListUsersResponse = Awaited<ReturnType<ReturnType<typeof createAdminClient>["auth"]["admin"]["listUsers"]>>;
type UserItem = NonNullable<ListUsersResponse["data"]>["users"][number];

interface AdminClientsContentProps {
  clients: UserItem[];
}

export function AdminClientsContent({ clients: initialClients }: AdminClientsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, startFiltering] = useTransition();
  const [selectedClient, setSelectedClient] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return initialClients.filter((user) => {
      const fullName = (user.user_metadata?.full_name as string) || "";
      const email = user.email || "";
      return (
        fullName.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)
      );
    });
  }, [initialClients, searchQuery]);

  const fullName = (u: { user_metadata?: Record<string, unknown> }) =>
    (u.user_metadata?.full_name as string) || "—";

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-3">
      <div className="sticky -top-6 z-20 flex flex-col gap-3 border-b-2 border-border bg-muted/80 px-3 py-2 backdrop-blur sm:gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-2">
        <div>
          <h1 className="text-2xl lg:text-lg font-semibold tracking-tight">All Clients</h1>
          <p className="text-sm lg:text-xs text-muted-foreground">
            Registered users awaiting approval. {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} found.
          </p>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md">
          <label htmlFor="clients-search" className="sr-only">
            Search clients
          </label>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 sm:left-3 lg:left-2.5 top-1/2 h-3.5 sm:h-4 lg:h-3 w-3.5 sm:w-4 lg:w-3 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="clients-search"
              type="search"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                startFiltering(() => setSearchQuery(value));
              }}
              className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 pl-8 sm:pl-9 lg:pl-8 pr-14 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  startFiltering(() => setSearchQuery(""));
                }}
                className="absolute right-2.5 sm:right-3 lg:right-2.5 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] sm:text-xs lg:text-[10px] font-medium text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
          {initialClients.length === 0 ? "No registered clients." : "No clients match your search."}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 lg:px-3 lg:py-2 font-medium text-foreground text-sm lg:text-xs">Name</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 font-medium text-foreground text-sm lg:text-xs">Email</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 font-medium text-foreground text-sm lg:text-xs">Type</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 font-medium text-foreground text-sm lg:text-xs">Status</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 font-medium text-foreground text-sm lg:text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 lg:px-3 lg:py-2 text-foreground text-sm lg:text-xs">{fullName(user)}</td>
                    <td className="px-4 py-3 lg:px-3 lg:py-2 text-muted-foreground text-sm lg:text-xs">{user.email ?? "—"}</td>
                    <td className="px-4 py-3 lg:px-3 lg:py-2 text-sm lg:text-xs">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {((user.user_metadata?.type as string) || "retailer").charAt(0).toUpperCase() + ((user.user_metadata?.type as string) || "retailer").slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 lg:px-3 lg:py-2 text-sm lg:text-xs">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        !user.email_confirmed_at
                          ? "bg-red-100 text-red-800"
                          : user.user_metadata?.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {!user.email_confirmed_at
                          ? "Email not confirmed"
                          : user.user_metadata?.verified
                          ? "Verified"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 lg:px-3 lg:py-2 text-sm lg:text-xs">
                      <button 
                        onClick={() => {
                          setSelectedClient(user);
                          setIsModalOpen(true);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {filteredClients.map((user) => (
              <div 
                key={user.id} 
                onClick={() => {
                  setSelectedClient(user);
                  setIsModalOpen(true);
                }}
                className="rounded-lg border border-border bg-card p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{fullName(user)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email ?? "—"}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap ml-2 ${
                    !user.email_confirmed_at
                      ? "bg-red-100 text-red-800"
                      : user.user_metadata?.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {!user.email_confirmed_at
                      ? "Unconfirmed"
                      : user.user_metadata?.verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium bg-blue-100 text-blue-800">
                    {((user.user_metadata?.type as string) || "retailer").charAt(0).toUpperCase() + ((user.user_metadata?.type as string) || "retailer").slice(1)}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClient(user);
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <ClientDigitalIdModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </div>
  );
}
