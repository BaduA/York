"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Ctx = createContext<{ inc: () => void; dec: () => void }>({ inc: () => {}, dec: () => {} });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const count = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inc = useCallback(() => {
    count.current++;
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    setVisible(true);
  }, []);

  const dec = useCallback(() => {
    count.current = Math.max(0, count.current - 1);
    if (count.current === 0) {
      // keep bar visible for at least 400ms so fast requests are always seen
      hideTimer.current = setTimeout(() => setVisible(false), 400);
    }
  }, []);

  return (
    <Ctx.Provider value={{ inc, dec }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="loading-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-[9998] h-[3px] overflow-hidden"
            style={{ background: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }}
          >
            <motion.div
              className="absolute top-0 h-full w-2/5 rounded-full"
              style={{ background: "var(--color-primary)", boxShadow: "0 0 8px var(--color-primary)" }}
              animate={{ x: ["-100%", "350%"] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function useLoading() {
  const { inc, dec } = useContext(Ctx);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    inc();
    try {
      return await fn();
    } finally {
      dec();
    }
  }, [inc, dec]);

  return withLoading;
}
