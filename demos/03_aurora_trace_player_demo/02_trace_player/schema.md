# Trace Schema (Reference Demonstrator)

This repo ships **trace evidence**, not a reasoning engine.

A trace is a **precomputed, auditable event log** showing how an Aurora-style contract behaves:
- detect ambiguity
- refuse to proceed
- request clarification (bounded choices)
- bind an interpretation
- commit only after binding
- reach a terminal stance deterministically

## File format
Each trace is a single JSON object with these top-level keys:

- `trace_id` (string): stable identifier
- `title` (string): human-readable title
- `version` (string): schema version (e.g. `"1.0"`)
- `created_utc` (string): ISO timestamp
- `source_text` (string): the input scenario text
- `entities` (object): optional known entities (names → metadata)
- `events` (array): ordered list of events (see below)

## Event objects
Each event has:

- `t` (string): event type
- `id` (string): event id (unique within trace)
- `data` (object): type-specific payload

### Event types

#### `utterance`
Represents an input utterance.

`data`:
- `speaker` (string): e.g. `"user"`
- `text` (string)

#### `ambiguity_detected`
Signals that the system refuses to proceed without clarification.

`data`:
- `kind` (string): e.g. `"pronoun_antecedent"`
- `span` (string): the ambiguous phrase (e.g. `"her sister"`)
- `candidates` (array of strings): candidate bindings
- `question` (string): the clarification question the system asks

#### `clarification_options`
Enumerates bounded, acceptable answers.

`data`:
- `options` (array of objects):
  - `key` (string): short choice key (e.g. `"A"`)
  - `answer` (string): what the user might say
  - `binds` (object): the binding asserted by that answer

#### `user_choice`
Records which option was selected during replay (only present in **sessions**, not required in base traces).

`data`:
- `selected_key` (string)
- `answer` (string)

#### `binding_committed`
Commits the chosen binding.

`data`:
- `binding` (object): the resolved mapping (e.g. `{ "her sister": "Emma" }`)
- `commit_policy` (string): e.g. `"bind_then_commit"`

#### `resolved_interpretation`
Shows the resolved interpretation after binding.

`data`:
- `interpretation` (string): natural-language resolved form
- `facts` (array of strings): optional derived structured facts (reference-only)

#### `terminal_stance`
Terminal outcome.

`data`:
- `stance` (string): e.g. `"refusal_resolved"`, `"refusal_unresolved"`, `"committed"`
- `notes` (string): short explanation

## Notes
- A trace is **not** a proof of generality.
- The replay tool does **not** compute ambiguity; it only replays precomputed traces.
