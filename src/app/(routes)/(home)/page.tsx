import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { needs, participations } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { CITIES, CATEGORIES } from "@/lib/needs/constants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ParticipateButton } from "./components/participate-button";

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
  const session = await getServerSession();
  // ✅ 1. définir filters
  const filters = [];

  if (resolvedSearchParams.city && resolvedSearchParams.city !== "all") {
    filters.push(eq(needs.city, resolvedSearchParams.city));
  }

  if (resolvedSearchParams.category && resolvedSearchParams.category !== "all") {
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
    .orderBy(desc(needs.createdAt));

  // ✅ 4. Get user's participations if logged in
  let userParticipatedNeedIds: string[] = [];
  if (session?.user) {
    const userParticipations = await db
      .select({ needId: participations.needId })
      .from(participations)
      .where(eq(participations.userId, session.user.id));
    userParticipatedNeedIds = userParticipations.map((p) => p.needId);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-primary/5 to-primary/10 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            L'entraide de quartier 🇲🇦
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De Tanger à Lagouira, ensemble pour notre communauté
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <form method="get" className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="city" className="block text-sm font-medium mb-2 text-muted-foreground">
                Ville
              </label>
              <select
                id="city"
                name="city"
                defaultValue={resolvedSearchParams.city || "all"}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Toutes les villes</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="category" className="block text-sm font-medium mb-2 text-muted-foreground">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                defaultValue={resolvedSearchParams.category || "all"}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Toutes les catégories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="default">
              Filtrer
            </Button>
            {(resolvedSearchParams.city || resolvedSearchParams.category) && (
              <Button type="button" variant="outline" asChild>
                <Link href="/">Réinitialiser</Link>
              </Button>
            )}
          </form>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun besoin trouvé pour ces critères.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((row) => {
              const need = row.need;
              const participantCount = Number(row.participants);
              const isFull = participantCount >= need.maxVolunteers;
              const isOpen = need.status === "open" && !isFull;
              const hasParticipated = userParticipatedNeedIds.includes(need.id);
              const isUserNeed = session?.user?.id === need.userId;

              return (
                <Card key={need.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{need.title}</CardTitle>
                      <Badge
                        variant={isOpen ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {isOpen ? "Ouvert" : "Complet"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {need.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">📍</span>
                        <span>{need.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">🏷️</span>
                        <span>{need.category}</span>
                      </div>
                      {participantCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-primary font-medium pt-2">
                          <span>🔥</span>
                          <span>
                            {participantCount} {participantCount === 1 ? "citoyen aide" : "citoyens aident"} déjà
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    {session?.user ? (
                      hasParticipated ? (
                        <Button variant="secondary" className="w-full" disabled>
                          ✓ Vous participez déjà
                        </Button>
                      ) : isUserNeed ? (
                        <Button variant="outline" className="w-full" disabled>
                          Votre besoin
                        </Button>
                      ) : isOpen ? (
                        <ParticipateButton needId={need.id} />
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Complet
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/signin">
                          Connectez-vous pour participer
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
