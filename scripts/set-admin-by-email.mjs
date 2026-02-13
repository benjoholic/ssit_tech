import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createClient } from "@supabase/supabase-js";

/**
 * ENV required:
 *   SUPABASE_URL               - your project URL (e.g. https://xyz.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY  - service_role key (never expose in browser)
 *
 * Usage:
 *   # Option 1: pass email as argument
 *   node scripts/set-admin-by-email.mjs user@example.com
 *
 *   # Option 2: run and type email when prompted
 *   node scripts/set-admin-by-email.mjs
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "[ERROR] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function askForEmailIfNeeded() {
  const cliEmail = process.argv[2];
  if (cliEmail) return cliEmail.trim();

  const rl = readline.createInterface({ input, output });
  const answer = (await rl.question("Enter user email to make admin: ")).trim();
  rl.close();
  return answer;
}

async function findUserByEmail(email) {
  const target = email.toLowerCase();
  const perPage = 100;
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const match = data.users.find(
      (u) => (u.email || "").toLowerCase() === target
    );
    if (match) return match;

    if (data.users.length < perPage) {
      // no more pages
      return null;
    }

    page += 1;
  }
}

async function main() {
  try {
    const email = await askForEmailIfNeeded();
    if (!email) {
      console.error("[ERROR] Email is required.");
      process.exit(1);
    }

    console.log(`Looking up user with email: ${email} ...`);
    const user = await findUserByEmail(email);

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`Found user: id=${user.id}, email=${user.email}`);

    const currentMeta = user.user_metadata || {};
    const newMetadata = { ...currentMeta, is_admin: true };

    console.log("Updating user_metadata.is_admin to true ...");
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: newMetadata,
    });

    if (error) {
      console.error("Failed to update user:", error);
      process.exit(1);
    }

    console.log("Success! User is now an admin.");
    console.log(
      JSON.stringify(
        {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

await main();

