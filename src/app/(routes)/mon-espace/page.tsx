import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { needs, participations } from "@/db/schema";
import { eq,  sql } from "drizzle-orm";

import Header from "./components/header";
import MesDemandes from "./components/mes-demandes";
import MesEngagements from "./components/mes-engagements";

export default async function MonEspacePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/signin");
    }

    const mesDemandes = await db
        .select()
        .from(needs)
        .where(eq(needs.userId, session.user.id));

    const mesEngagements = await db
        .select()
        .from(participations)
        .where(eq(participations.userId, session.user.id));

    return (
        <main className="container mx-auto max-w-5xl space-y-8 py-10 px-4">
            <Header />

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <MesDemandes demandes={mesDemandes} />
                </div>
                <div className="space-y-6">
                    <MesEngagements engagements={mesEngagements} />
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                <p>Ensemble pour le Maroc 🇲🇦 </p>
            </div>
        </main>
    );
}
