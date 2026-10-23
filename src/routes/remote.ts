import { form, getRequestEvent, query, command } from "$app/server";
import * as v from "valibot";
import { db } from "../prisma/db";
import { redirect } from "@sveltejs/kit";

export const getAll = query(async () => {
  // get all items + the top bid
  return await db.orm.public.Motion.all();
});
export const create = form(
  v.object({
    text: v.pipe(v.string(), v.nonEmpty())
  }),
  async ({ text }) => {
    await db.orm.public.Motion.create({ text });
  },
);
export const logout = command(() => {
  const { cookies } = getRequestEvent()
  cookies.delete("sessionid", { path: '/' })
})