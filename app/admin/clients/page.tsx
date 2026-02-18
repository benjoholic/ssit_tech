import { createAdminClient } from "@/lib/supabase/admin";
import { AdminClientsContent } from "./clients-content";

type ListUsersResponse = Awaited<ReturnType<ReturnType<typeof createAdminClient>["auth"]["admin"]["listUsers"]>>;
type UserItem = NonNullable<ListUsersResponse["data"]>["users"][number];

async function getClients(): Promise<UserItem[]> {
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

  return all.filter((u) => !u.user_metadata?.is_admin);
}

export default async function AdminClientsPage() {
  const clients = await getClients();
  return <AdminClientsContent clients={clients} />;
}
