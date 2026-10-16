import { form, getRequestEvent, query } from "$app/server";
import * as v from "valibot";
import { db } from "../../../prisma/db";
import { EventEmitter, on } from "node:events";
import { error } from "@sveltejs/kit";

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const getItem = query.live(v.string(), async function* (id) {
  // get item + top bid

  let item = await db.orm.public.Item.where({ id })
    .include("bids", (bid) =>
      bid
        .orderBy((bid) => bid.createdAt.desc())
        .include("creator", (creator) => creator.select("name")),
    )
    .first();

  if (!item) {
    return error(404);
  }

  yield item;

  for await (const _ of on(emitter, id)) {
    let item = await db.orm.public.Item.where({ id })
      .include("bids", (bid) =>
        bid
          .orderBy((bid) => bid.createdAt.desc())
          .include("creator", (creator) => creator.select("name")),
      )
      .first();

    if (!item) {
      return error(404);
    }
    yield item;
  }
});

export const create = form(
  v.object({
    itemId: v.pipe(v.string(), v.nonEmpty()),
    price: v.number(),
  }),
  async ({ itemId, price }) => {
    let item = await db.orm.public.Item.where({ id: itemId }).first();

    if (!item) {
      return;
    }

    let highest = item.asking_price;

    if (highest < price) {
      const { cookies } = getRequestEvent();

      let session_id = cookies.get("session_id");

      if (!session_id) {
        return;
      }

      let session = await db.orm.public.Session.where({
        id: session_id,
      })
        .include("user")
        .first();

      if (!session) {
        return;
      }

      try {
        await db.transaction(async (tx) => {
          await tx.orm.public.Bid.create({
            itemId,
            price,
            creatorId: session.userId,
          });

          await tx.orm.public.Item.where({ id: itemId }).update({
            asking_price: price,
          });
        });
      } catch (error) {
        // should probably show to the user that bid wasnt created
      }

      // bid is created, emit
      emitter.emit(itemId);
    }
  },
);
