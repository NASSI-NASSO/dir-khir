import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./empty-state";
import { FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Define a type that matches the inferred select type from your schema
interface Need {
    id: string;
    title: string;
    status: string; // 'active' | 'resolved' but as string from DB
    createdAt: Date | null;
    userId: string;
}

interface MesDemandesProps {
    demandes: Need[];
}

export default function MesDemandes({ demandes }: MesDemandesProps) {
    if (demandes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Mes demandes</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        title="Aucune demande"
                        description="Vous n'avez pas encore publié de besoin d'aide."
                        icon={FileText}
                        actionLabel="Créer une demande"
                        actionUrl="/proposer-un-besoin"
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Mes demandes ({demandes.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {demandes.map((demande) => (
                    <div
                        key={demande.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{demande.title}</h4>
                                <Badge variant={demande.status === "active" ? "default" : "secondary"}>
                                    {demande.status === "active" ? "En cours" : "Résolu"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Publié le {demande.createdAt ? format(demande.createdAt, "d MMMM yyyy", { locale: fr }) : "-"}
                            </p>
                        </div>

                        {/* Placeholder for future actions */}
                        <div className="flex items-center gap-2">
                            {demande.status === 'active' && (
                                <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    <CheckCircle2 className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
