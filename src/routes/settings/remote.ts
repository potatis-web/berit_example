import { form, getRequestEvent, query } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";

export const getAll = query(async () => {
  // get all sessions
  const { cookies } = getRequestEvent();

  return {
    sessions: await db.orm.public.Session.all(),
    current: cookies.get("session_id"),
  };
});

export const yeet = form(
  v.object({
    id: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ id }) => {
    await db.orm.public.Session.where({ id }).delete();
  },
);
