"use client";

import React, { createContext, useContext, useState } from "react";
import { tr } from "@/locales/tr";
import { en } from "@/locales/en";
import type { Translations } from "@/locales/tr";

export type Lang = "tr" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "tr",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr");

  const dict: Translations = lang === "tr" ? tr : en;

  function t(key: string): string {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = dict;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === "string" ? val : key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
