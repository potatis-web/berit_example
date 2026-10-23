import { form, getRequestEvent, query } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { EventEmitter, on } from "node:events";
import { error } from "@sveltejs/kit";
import { vote } from "./common";

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const getItem = query.live(
  v.string(),
  async function* (id) {
    let motion = await db.orm.public.Motion
      .include("votes", (vote) => vote.include("user"))
      .first({ id });
  
    if (!motion) {
      return error(404);
    }
  
    yield motion;
  
    for await (const _ of on(emitter, motion.id)) {
      let vote = await db.orm.public.Motion
        .include("votes", (vote) => vote.include("user"))
        .first({ id: motion.id });
  
      if (!vote) {
        return error(404, `Err: vote is ${vote} \nisMotionMatched: ${motion.id === id}`); // Fails here?
      }
      yield vote;
    }
});

export const getCount = query(
  v.pipe(v.string(), v.nonEmpty()),
  async (motionid) => {
    const count = await db.orm.public.Vote.where({ motionid }).all()
    let value: number = 0
    let all: number = 0;
    count.forEach((vote) => {
      value += vote.value;
      all++
    });
    return { value, all };
  }
)

export const create = form(
  v.object({
    votes: v.picklist(vote),
    id: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ id, votes }) => {
    let motion = await db.orm.public.Motion.first({ id });
    if (!motion) return; // motioncheck

    const { cookies } = getRequestEvent();

    let sessionid = cookies.get("session_id");
    if (!sessionid) return; // sessioncheck

    let user = await db.orm.public.User.first({ sessionid });
    if (!user) return; // usercheck
    /*
    try {
      await db.transaction(async (tx) => {
        await tx.orm.public.Vote.create({ id, motionid: motion.id, userid: user.id });

        await tx.orm.public.Motion.where({ id }).update({  });
      });
    } catch (error) {
      // should probably show to the user that bid wasnt created
    }
     */
    const value = votes === vote[0] ? 1 : -1;
    await db.orm.public.Vote.where({ userid: user.id }).deleteAll()
    await db.orm.public.Vote.create({ motionid: motion.id, userid: user.id, value })

    
    // bid is created, emit
    emitter.emit(motion.id);
  });
