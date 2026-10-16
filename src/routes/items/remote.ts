import { form, query } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";

export const getAll = query(async () => {
  // get all items + the top bid
  return await db.orm.public.Item.all();
});

export const create = form(
  v.object({
    text: v.pipe(v.string(), v.nonEmpty()),
    cost: v.number(),
  }),
  async ({ text, cost }) => {
    await db.orm.public.Item.create({ description: text, asking_price: cost });
  },
);
