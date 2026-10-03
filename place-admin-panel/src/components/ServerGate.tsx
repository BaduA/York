"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

type Status = "checking" | "success" | "dismissed" | "error";

export function ServerGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");

  const check = async () => {
    setStatus("checking");
    const [fetchResult] = await Promise.allSettled([
      fetch(`${API_URL}/menu`, { cache: "no-store", signal: AbortSignal.timeout(4000) }),
      new Promise(r => setTimeout(r, 1200)),
    ]);
    const ok = fetchResult.status === "fulfilled" && (fetchResult.value as Response).ok;
    if (ok) {
      setStatus("success");
      setTimeout(() => setStatus("dismissed"), 500);
    } else {
      setStatus("error");
    }
  };

  useEffect(() => { check(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}

      <AnimatePresence>
        {status !== "dismissed" && (
          <motion.div
            key="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          >
            <AnimatePresence mode="wait">
              {status === "checking" && (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-4 text-muted-foreground"
                >
                  <Icon icon="solar:server-minimalistic-bold" width={40} height={40} className="text-primary animate-pulse" />
                  <p className="text-sm tracking-widest uppercase">Sunucu kontrol ediliyor…</p>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon icon="solar:check-circle-bold" width={36} height={36} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground tracking-widest uppercase">Sunucu ayakta</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-6 max-w-sm text-center px-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <Icon icon="solar:server-broken-bold" width={32} height={32} className="text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-foreground">Sunucuya Ulaşılamıyor</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Backend çalışmıyor olabilir. Sunucuyu başlatıp tekrar deneyin.
                    </p>
                    <code className="block text-xs text-muted-foreground/60 mt-1">{API_URL}</code>
                  </div>
                  <button
                    onClick={check}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Icon icon="solar:restart-bold" width={16} height={16} />
                    Tekrar Dene
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
