import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createNeed } from "../actions/needs";
import { createNeedSchema } from "@/lib/schemas/needs";
import { CATEGORIES, CITIES } from "@/lib/needs/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ProposerUnBesoinPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/signin");

  async function action(formData: FormData) {
    "use server";
    const raw = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      city: String(formData.get("city") ?? ""),
      category: String(formData.get("category") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
    };

    const parsed = await createNeedSchema.parseAsync(raw);
    await createNeed(parsed);
    redirect("/mon-espace");
  }

  return (
    <main className="container mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Proposer un besoin
        </h1>
        <p className="text-muted-foreground">
          Décrivez une demande concrète. La communauté pourra participer et vous
          contacter sur WhatsApp.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Nettoyage du quartier vendredi"
                required
                minLength={3}
                maxLength={80}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={2000}
                placeholder="Dites ce dont vous avez besoin, où et quand…"
                className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <select
                  id="city"
                  name="city"
                  required
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue={CITIES[0]}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue={CATEGORIES[0]}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                placeholder="Ex: 06XXXXXXXX ou +2126XXXXXXXX"
                required
              />
              <p className="text-xs text-muted-foreground">
                On enregistrera uniquement les chiffres (ex: +212…).
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="submit">Publier</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


