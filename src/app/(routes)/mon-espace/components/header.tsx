import { ProposerBesoinButton } from "./proposer-besoin-button";

export default function Header() {
    return (
        <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Mon espace</h1>
                <p className="text-muted-foreground">
                    Gérez vos demandes d'aide et vos engagements solidaires.
                </p>
            </div>
            <ProposerBesoinButton />
        </div>
    );
}
