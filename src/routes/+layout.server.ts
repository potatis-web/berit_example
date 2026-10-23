import type { LayoutServerLoad } from "./$types";
import { db } from "../prisma/db";

export const load = (async ({ cookies }) => {
  let session_id = cookies.get("session_id");
  const user  = await db.orm.public.User.first({ sessionid: session_id });
  if (!session_id || !user) {
    cookies.delete("session_id")
    return;
  }
  if (!user)
    return;

  return user;
}) satisfies LayoutServerLoad;
