#!/usr/bin/env python3
"""
Aurora Trace Player — Reference Demonstrator (non-operational)

This tool replays *precomputed* traces that demonstrate an Aurora-style reasoning contract:
- detect ambiguity
- refuse to proceed
- request bounded clarification
- bind interpretation
- commit only after binding
- reach a terminal stance deterministically

IMPORTANT:
- This is NOT a reasoning engine.
- No ambiguity extraction is performed here.
- The traces are hand-authored / precomputed evidence artifacts.
"""

from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
TRACES_DIR = os.path.join(HERE, "traces")
SCHEMA_VERSION = "1.0"


def eprint(*args: Any) -> None:
    print(*args, file=sys.stderr)


@dataclass
class Trace:
    trace_id: str
    title: str
    version: str
    created_utc: str
    source_text: str
    events: List[Dict[str, Any]]


def load_trace(path: str) -> Trace:
    with open(path, "r", encoding="utf-8") as f:
        obj = json.load(f)

    for key in ("trace_id", "title", "version", "created_utc", "source_text", "events"):
        if key not in obj:
            raise ValueError(f"Trace missing required key: {key}")

    return Trace(
        trace_id=str(obj["trace_id"]),
        title=str(obj["title"]),
        version=str(obj["version"]),
        created_utc=str(obj["created_utc"]),
        source_text=str(obj["source_text"]),
        events=list(obj["events"]),
    )


def list_traces() -> List[Tuple[str, str, str]]:
    if not os.path.isdir(TRACES_DIR):
        return []
    out: List[Tuple[str, str, str]] = []
    for name in sorted(os.listdir(TRACES_DIR)):
        if not name.endswith(".json"):
            continue
        p = os.path.join(TRACES_DIR, name)
        try:
            tr = load_trace(p)
            out.append((tr.trace_id, tr.title, name))
        except Exception:
            # skip malformed traces; this is a reference repo
            continue
    return out


def prompt_choice(options: List[Dict[str, Any]]) -> Dict[str, Any]:
    key_map = {str(o["key"]).strip().upper(): o for o in options}
    keys = ", ".join(key_map.keys())
    while True:
        raw = input(f"Choose [{keys}]: ").strip().upper()
        if raw in key_map:
            return key_map[raw]
        print("Invalid choice. Try again.")


def replay(trace: Trace) -> None:
    print("=" * 72)
    print(f"Aurora Trace Player (Reference) — {trace.title}")
    print(f"trace_id: {trace.trace_id}   schema: {trace.version}   created: {trace.created_utc}")
    print("=" * 72)
    print("SOURCE TEXT:")
    print(trace.source_text)
    print("-" * 72)

    # Store chosen bindings for placeholder replacement
    bindings: Dict[str, str] = {}

    # Find clarification options event after ambiguity detection(s)
    i = 0
    while i < len(trace.events):
        ev = trace.events[i]
        t = ev.get("t")
        data = ev.get("data", {})
        if t == "utterance":
            print(f'USER: {data.get("text","")}')
        elif t == "ambiguity_detected":
            print("\nAMBIGUITY DETECTED → REFUSAL")
            print(f'  kind: {data.get("kind","")}')
            print(f'  span: {data.get("span","")}')
            q = data.get("question", "")
            if q:
                print(f"  question: {q}")
        elif t == "clarification_options":
            options = data.get("options", [])
            if not options:
                print("\n(No clarification options provided in trace.)")
            else:
                print("\nCLARIFICATION OPTIONS (bounded):")
                for o in options:
                    print(f'  {o.get("key")}: {o.get("answer")}')
                chosen = prompt_choice(options)
                binds = chosen.get("binds", {})
                # record bindings
                for k, v in binds.items():
                    bindings[str(k)] = str(v)
                print(f'\nYou chose: {chosen.get("answer")}')
                print(f"Bindings committed (session): {binds}")
        elif t == "binding_committed":
            b = dict(data.get("binding", {}))
            # replace placeholder markers if present
            for k in list(b.keys()):
                if b[k] == "<CHOICE>":
                    b[k] = bindings.get(k, "<UNBOUND>")
            print("\nBINDING COMMITTED")
            print(f'  policy: {data.get("commit_policy","")}')
            print(f"  binding: {b}")
        elif t == "resolved_interpretation":
            interp = str(data.get("interpretation", ""))
            # naive placeholder replacement for display
            for k, v in bindings.items():
                interp = interp.replace("<CHOICE>", v)
            print("\nRESOLVED INTERPRETATION")
            print(f"  {interp}")
            facts = data.get("facts", [])
            if facts:
                print("  facts (reference-only):")
                for fact in facts:
                    fact_str = str(fact).replace("<CHOICE>", next(iter(bindings.values()), "<UNBOUND>"))
                    print(f"   - {fact_str}")
        elif t == "terminal_stance":
            print("\nTERMINAL STANCE")
            print(f'  stance: {data.get("stance","")}')
            notes = data.get("notes", "")
            if notes:
                print(f"  notes: {notes}")
            print("-" * 72)
            print("REFERENCE TRACE — NON-OPERATIONAL DEMONSTRATOR")
            print("=" * 72)
        else:
            # unknown event type: ignore
            pass
        i += 1


def main(argv: List[str]) -> int:
    traces = list_traces()
    if not traces:
        eprint("No traces found. Expected JSON traces in:", TRACES_DIR)
        return 2

    if len(argv) >= 2 and argv[1] in ("-l", "--list"):
        print("Available traces:")
        for tid, title, fname in traces:
            print(f"  {tid:20}  {title}  ({fname})")
        return 0

    chosen_id: Optional[str] = None
    if len(argv) >= 2:
        chosen_id = argv[1].strip()

    if chosen_id is None:
        print("Available traces:")
        for idx, (tid, title, fname) in enumerate(traces, start=1):
            print(f"  {idx}. {tid} — {title}")
        raw = input("Select a trace by number (or press Enter for 1): ").strip()
        if raw == "":
            chosen_idx = 1
        else:
            try:
                chosen_idx = int(raw)
            except ValueError:
                eprint("Invalid selection.")
                return 2
        if chosen_idx < 1 or chosen_idx > len(traces):
            eprint("Selection out of range.")
            return 2
        chosen_id = traces[chosen_idx - 1][0]

    # resolve file
    fname = None
    for tid, title, f in traces:
        if tid == chosen_id:
            fname = f
            break
    if fname is None:
        eprint("Unknown trace_id:", chosen_id)
        eprint("Use --list to see available traces.")
        return 2

    trace_path = os.path.join(TRACES_DIR, fname)
    tr = load_trace(trace_path)
    if tr.version != SCHEMA_VERSION:
        eprint(f"Warning: trace schema version {tr.version} != expected {SCHEMA_VERSION}")

    replay(tr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
