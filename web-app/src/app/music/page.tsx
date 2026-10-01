"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";

type Song = {
  id: string;
  title: string;
  artist: string;
  votes: number;
  voted: boolean;
  albumColor: string;
};

const initialSongs: Song[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", votes: 47, voted: false, albumColor: "from-rose-900 to-red-950" },
  { id: "2", title: "Levitating", artist: "Dua Lipa", votes: 38, voted: false, albumColor: "from-violet-900 to-indigo-950" },
  { id: "3", title: "Save Your Tears", artist: "The Weeknd", votes: 31, voted: false, albumColor: "from-slate-800 to-zinc-950" },
  { id: "4", title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", votes: 24, voted: false, albumColor: "from-amber-900 to-orange-950" },
  { id: "5", title: "Stay", artist: "The Kid LAROI & Justin Bieber", votes: 19, voted: false, albumColor: "from-teal-900 to-cyan-950" },
  { id: "6", title: "Industry Baby", artist: "Lil Nas X & Jack Harlow", votes: 16, voted: false, albumColor: "from-yellow-900 to-amber-950" },
  { id: "7", title: "Bad Habits", artist: "Ed Sheeran", votes: 14, voted: true, albumColor: "from-red-900 to-rose-950" },
  { id: "8", title: "MONTERO", artist: "Lil Nas X", votes: 12, voted: false, albumColor: "from-fuchsia-900 to-purple-950" },
];

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const sorted = [...songs].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes ?? 1;

  function toggleVote(id: string) {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, voted: !s.voted, votes: s.voted ? s.votes - 1 : s.votes + 1 } : s
      )
    );
  }

  function handleSuggest(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSubmitted(true);
    setSuggestion("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activePage="music" />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Now Playing */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">Şu An Çalıyor</p>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            {/* waveform bg decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 12px)" }}
            />
            <div className="relative flex items-center gap-4 p-5">
              {/* Album art */}
              <div className="shrink-0 size-16 rounded-xl bg-gradient-to-br from-primary/60 to-rose-950 flex items-center justify-center shadow-lg shadow-primary/20">
                <iconify-icon icon="solar:music-note-2-bold" width="28" height="28" className="text-white/80"></iconify-icon>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-xl font-bold tracking-wide text-foreground truncate">Blinding Lights</div>
                <div className="text-sm text-muted-foreground">The Weeknd</div>
                {/* progress bar */}
                <div className="mt-2.5 h-1 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "62%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                  <span>2:08</span>
                  <span>3:20</span>
                </div>
              </div>
              {/* playing indicator */}
              <div className="shrink-0 flex items-end gap-0.5 h-8">
                {[3, 6, 4, 7, 3].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{ height: `${h * 3}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Voting list */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Sıradaki Çalma Listesi</p>
            <span className="text-[10px] font-mono text-muted-foreground">{songs.filter((s) => s.voted).length} oyunuz kullanıldı</span>
          </div>

          <div className="space-y-2">
            {sorted.map((song, idx) => (
              <div
                key={song.id}
                className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  song.voted
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                {/* Vote bar bg */}
                <div
                  className="absolute inset-y-0 left-0 rounded-xl bg-primary/5 transition-all duration-500"
                  style={{ width: `${(song.votes / maxVotes) * 100}%` }}
                />

                {/* Rank */}
                <span className="relative shrink-0 w-5 text-center text-[11px] font-mono font-bold text-muted-foreground">
                  {idx + 1}
                </span>

                {/* Album thumb */}
                <div className={`relative shrink-0 size-10 rounded-lg bg-gradient-to-br ${song.albumColor} flex items-center justify-center`}>
                  <iconify-icon icon="solar:music-note-bold" width="14" height="14" className="text-white/60"></iconify-icon>
                </div>

                {/* Info */}
                <div className="relative flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{song.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{song.artist}</div>
                </div>

                {/* Votes */}
                <div className="relative shrink-0 flex items-center gap-2.5">
                  <span className={`text-sm font-mono font-bold ${song.voted ? "text-primary" : "text-muted-foreground"}`}>
                    {song.votes}
                  </span>
                  <button
                    onClick={() => toggleVote(song.id)}
                    className={`flex size-8 items-center justify-center rounded-lg border transition-all ${
                      song.voted
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-primary"
                    }`}
                    aria-label={song.voted ? "Oyu geri al" : "Oy ver"}
                  >
                    <iconify-icon
                      icon={song.voted ? "solar:heart-bold" : "solar:heart-outline"}
                      width="14"
                      height="14"
                    ></iconify-icon>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Song suggestion */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">Şarkı Öner</p>
          <form onSubmit={handleSuggest} className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Şarkı adı veya sanatçı..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="submit"
                disabled={!suggestion.trim()}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <iconify-icon icon="solar:arrow-up-bold" width="14" height="14"></iconify-icon>
                Öner
              </button>
            </div>
            {submitted && (
              <p className="text-xs text-primary font-mono">
                ✓ Öneriniz iletildi — barmenimiz listeyi güncelleyecek.
              </p>
            )}
          </form>
        </section>

      </main>
    </div>
  );
}
