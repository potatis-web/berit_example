import { form, getRequestEvent } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { redirect } from "@sveltejs/kit";
import { scryptSync, timingSafeEqual } from "node:crypto";

export const login = form(
  v.object({
    phone: v.pipe(v.string(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ phone, password }) => {
    const { cookies } = getRequestEvent();

    let user = await db.orm.public.User.where({ phone }).first();

    if (user) {
      const attempt = scryptSync(password, user.salt, 64);
      if (timingSafeEqual(Buffer.from(user.hash, "hex"), attempt)) {
        let session = await db.orm.public.Session.create({ userId: user.id });
        cookies.set("session_id", session.id);
        redirect(307, "/");
      }
    }
  },
);
