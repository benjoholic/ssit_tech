import { createAdminClient } from "@/lib/supabase/admin";

type ListUsersResponse = Awaited<ReturnType<ReturnType<typeof createAdminClient>["auth"]["admin"]["listUsers"]>>;
type UserItem = NonNullable<ListUsersResponse["data"]>["users"][number];

async function getDealers() {
  const supabase = createAdminClient();
  const perPage = 100;
  let page = 1;
  const all: UserItem[] = [];

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;
    const users = data?.users ?? [];
    all.push(...users);

    if (users.length < perPage) break;
    page += 1;
  }

  return all
    .filter((u) => !u.user_metadata?.is_admin)
    .filter((u) => u.email_confirmed_at != null);
}

export default async function AdminDealersPage() {
  const dealers = await getDealers();
  const fullName = (u: { user_metadata?: Record<string, unknown> }) =>
    (u.user_metadata?.full_name as string) || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All dealers</h1>
        <p className="text-sm text-muted-foreground">
          Registered users (verified, non-admin). {dealers.length} dealer{dealers.length !== 1 ? "s" : ""} found.
        </p>
      </div>

      {dealers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
          No verified dealers yet. Unverified and admin users are hidden.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 font-medium text-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-foreground">Email</th>
                <th className="px-4 py-3 font-medium text-foreground">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{fullName(user)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
