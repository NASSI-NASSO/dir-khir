"use server";

import { db } from "@/db";
import { needs, participations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { createNeedSchema } from "@/lib/schemas/needs";
import { getServerSession } from "@/lib/auth/get-session";
import { z } from "zod";

export async function createNeed(input: z.infer<typeof createNeedSchema>) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("UNAUTHORIZED");

  const data = createNeedSchema.parse(input);

  const [row] = await db
    .insert(needs)
    .values({
      userId: session.user.id,
      title: data.title,
      description: data.description,
      city: data.city,
      category: data.category,
      whatsapp: data.whatsapp,
      status: "open",
    })
    .returning({ id: needs.id });

  revalidatePath("/");
  revalidatePath("/mon-espace");
  return row;
}

export async function participateInNeed(needId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("UNAUTHORIZED");

  await db
    .insert(participations)
    .values({ userId: session.user.id, needId })
    // requires unique constraint in schema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .onConflictDoNothing?.({ target: [participations.userId, participations.needId] } as any);

  revalidatePath("/");
  revalidatePath("/mon-espace");
}

export async function resolveNeed(needId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("UNAUTHORIZED");

  await db
    .update(needs)
    .set({ status: "resolved" })
    .where(and(eq(needs.id, needId), eq(needs.userId, session.user.id)));

  revalidatePath("/");
  revalidatePath("/mon-espace");
}


