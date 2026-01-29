import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function ProposerBesoinButton() {
    return (
        <Button asChild className="gap-2">
            <Link href="/proposer-un-besoin">
                <PlusCircle className="h-4 w-4" />
                Proposer un besoin
            </Link>
        </Button>
    );
}
