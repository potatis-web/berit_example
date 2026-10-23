import { form, getRequestEvent } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { redirect } from "@sveltejs/kit";
import { scryptSync, timingSafeEqual } from "node:crypto";

export const login = form(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ name, password }) => {
    const { cookies } = getRequestEvent();

    let user = await db.orm.public.User.first({ name });

    if (user) {
      const attempt = scryptSync(password, user.salt, 64);
      if (timingSafeEqual(Buffer.from(user.hash, "hex"), attempt)) {
        const uuid = crypto.randomUUID()
        await db.orm.public.User.where({ id: user.id }).update({ sessionid: uuid})
        cookies.set("session_id", uuid);
        redirect(307, "/");
      }
    }
  },
);
