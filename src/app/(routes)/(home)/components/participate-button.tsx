"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { participateInNeed } from "../../actions/needs";
import { toast } from "sonner";

interface ParticipateButtonProps {
  needId: string;
  disabled?: boolean;
}

export function ParticipateButton({ needId, disabled }: ParticipateButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleParticipate() {
    startTransition(async () => {
      try {
        await participateInNeed(needId);
        toast.success("Vous participez maintenant à ce besoin !");
      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    });
  }

  return (
    <Button
      onClick={handleParticipate}
      className="w-full"
      disabled={disabled || isPending}
    >
      {isPending ? "En cours..." : "Je participe"}
    </Button>
  );
}
