"use client";

import Sidebar from "./Sidebar";

import type { ReactNode } from "react";

import {
  Bell,
  ChevronDown,
} from "lucide-react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useNeurofit } from "@/lib/store";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const {
    currentUser,
    ready,
    authenticated,
  } = useNeurofit();

  const router = useRouter();

  /*
   * Só fazemos o redirecionamento depois
   * que o localStorage terminou de carregar.
   */
  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/login");
    }
  }, [
    ready,
    authenticated,
    router,
  ]);

  /*
   * Enquanto o estado do usuário ainda
   * está sendo carregado, não mostramos
   * conteúdo protegido.
   */
  if (!ready) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  /*
   * Usuário não autenticado:
   * aguarda o redirect para login.
   */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  return (
    <div className="mobile-app">
      <header className="mobile-header sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img
            src="/neurofit-logo.png"
            alt="NEUROFIT"
            className="mini-logo"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notificações"
            className="rounded-full border border-[#103653] bg-[#06111b] p-2.5 text-[#8bb2cd]"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#103653] bg-[#06111b] px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#18dfff] to-[#005dff] text-[11px] font-black text-black">
              {currentUser.profile.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <span className="max-w-[72px] truncate text-xs font-bold">
              {currentUser.profile.name.split(
                " "
              )[0]}
            </span>

            <ChevronDown
              size={13}
              className="text-[#6f8ba1]"
            />
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100dvh-68px)]">
        {children}
      </main>

      <Sidebar />
    </div>
  );
}