import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { needs, participations } from "@/db/schema";

type SearchParams = {
  city?: string;
  category?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  // ✅ 1. définir filters
  const filters = [];

  if (resolvedSearchParams.city) {
    filters.push(eq(needs.city, resolvedSearchParams.city));
  }

  if (resolvedSearchParams.category) {
    filters.push(eq(needs.category, resolvedSearchParams.category));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  // ✅ 2. sous-requête pour compter les participants
  const participationsCount = db
    .select({
      needId: participations.needId,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(participations)
    .groupBy(participations.needId)
    .as("pc");

  // ✅ 3. requête principale (SANS groupBy)
  const rows = await db
    .select({
      need: needs,
      participants: sql<number>`coalesce(${participationsCount.count}, 0)`,
    })
    .from(needs)
    .leftJoin(
      participationsCount,
      eq(participationsCount.needId, needs.id)
    )
    .where(whereClause)
    .orderBy(needs.createdAt);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        L’entraide de quartier 🇲🇦
      </h1>

      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </main>
  );
}
