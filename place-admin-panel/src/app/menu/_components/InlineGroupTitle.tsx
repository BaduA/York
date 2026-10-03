import { useEffect, useRef, useState } from "react";
import { api } from "../_lib/api";
import type { AGroup } from "../_lib/types";

export function InlineGroupTitle({ group, className, onSaved, onOverrideClick }: {
  group: AGroup;
  className: string;
  onSaved: () => void;
  onOverrideClick?: (e: React.MouseEvent) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(group.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = async () => {
    setEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === group.title) return;
    await api("PATCH", `/menu/groups/${group.id}`, { title: trimmed }).catch(() => {});
    onSaved();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") { e.preventDefault(); void commit(); }
          if (e.key === "Escape") { setValue(group.title ?? ""); setEditing(false); }
        }}
        onClick={e => e.stopPropagation()}
        className={`${className} bg-transparent border-b border-primary/60 outline-none`}
        style={{ width: `${Math.max(value.length, 4)}ch` }}
      />
    );
  }

  return (
    <span
      onClick={e => {
        if (onOverrideClick) { onOverrideClick(e); return; }
        e.stopPropagation();
        setEditing(true);
      }}
      className={`${className} ${onOverrideClick ? "cursor-pointer" : "cursor-text hover:opacity-70"} transition-opacity`}
    >
      {group.title ?? "—"}
    </span>
  );
}
