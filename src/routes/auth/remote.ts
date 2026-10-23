import { form, getRequestEvent } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export const register = form(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ name, password }) => {
    let user = await db.orm.public.User.where({ name }).first();
    if (!user) {
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 64).toString("hex");
      await db.orm.public.User.create({ name, salt, hash });
    }
  },
);
