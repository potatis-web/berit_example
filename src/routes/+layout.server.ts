import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "../prisma/db";

export const load = (async ({ cookies, url }) => {
  let session_id = cookies.get("session_id");
  if (!session_id && url.pathname != "/login" && url.pathname != "/register") {
    redirect(307, "/login");
  }

  let session = await db.orm.public.Session.where({ id: session_id }).first();

  if (!session && url.pathname != "/login" && url.pathname != "/register") {
    redirect(307, "/login");
  }

  return {};
}) satisfies LayoutServerLoad;
