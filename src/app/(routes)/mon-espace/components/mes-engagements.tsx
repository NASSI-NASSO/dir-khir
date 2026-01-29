import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { HandHeart } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Engagement {
    id: string;
    userId: string;
    needId: string;
    joinedAt: Date | null;
}

interface MesEngagementsProps {
    engagements: Engagement[];
}

export default function MesEngagements({ engagements }: MesEngagementsProps) {
    if (engagements.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Mes engagements</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        title="Aucun engagement"
                        description="Vous n'avez pas encore rejoint d'initiative solidaire."
                        icon={HandHeart}
                        actionLabel="Parcourir les besoins"
                        actionUrl="/"
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Mes engagements ({engagements.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {engagements.map((engagement) => (
                    <div
                        key={engagement.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                        <div className="space-y-1">
                            <h4 className="font-semibold">Participation #{engagement.needId.slice(0, 8)}...</h4>
                            <p className="text-sm text-muted-foreground">
                                Rejoint le {engagement.joinedAt ? format(engagement.joinedAt, "d MMMM yyyy", { locale: fr }) : "-"}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
