"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/app/(routes)/(auth)/components/button-signout";
import { getServerSession } from "@/lib/auth/get-session";

export function MainNav({ session }: { session: Awaited<ReturnType<typeof getServerSession>> | null }) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Accueil",
      active: pathname === "/",
    },
    {
      href: "/proposer-un-besoin",
      label: "Proposer un besoin",
      active: pathname === "/proposer-un-besoin",
      authRequired: true,
    },
    {
      href: "/mon-espace",
      label: "Mon Espace",
      active: pathname === "/mon-espace",
      authRequired: true,
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 px-6 h-16 border-b">
      <Link href="/" className="mr-6 text-lg font-bold">
        Entraide
      </Link>
      <div className="flex items-center space-x-4">
        {routes.map((route) => {
          if (route.authRequired && !session?.user) {
            return null;
          }
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active
                  ? "text-primary dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          );
        })}
      </div>
      <div className="ml-auto flex items-center space-x-4">
        {session?.user ? (
          <SignOutButton />
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">S'inscrire</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

