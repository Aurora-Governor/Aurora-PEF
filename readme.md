# Aurora + PEF — Meaning-First Reasoning Substrate

Aurora + PEF is a **non-token, structure-first reasoning architecture** designed to run
*alongside or beneath* transformer LLMs.

Instead of treating language as a sequence of tokens to predict, Aurora operates over:

- **Conceptual kernels** in a **Persistent Existence Frame (PEF)** substrate,
- **Roles / Domains / Spans** as explicit structural handles,
- A small set of **primitive operators** (e.g. BRANCH, HOLD, PRUNE, BIND, TRACE),
- Parallel interpretations with **constraint-based pruning** instead of probabilistic collapse.

This repo provides:

- The **Aurora + PEF whitepaper (v1.0)** with empirical evidence of transformer failure modes,
- A reference **Python implementation sketch** of the core primitives and interpreter,
- A small **demo** showing how Aurora preserves and resolves ambiguity where LLMs collapse it,
- An example **sandwich pipeline**: Aurora Interpretation → LLM Expression → Aurora Verification.

---

## Repository Structure

- `whitepaper/` — Final PDF whitepaper (v1.0) with appendices.
- `diagrams/` — Architecture diagrams used in the paper.
- `src/aurora/` — Core primitives, PEF substrate, interpreter, verifier, traces.
- `src/demo/` — CLI demo and example sentences.
- `src/integrations/` — Example adapter for plugging Aurora around an LLM.
- `tests/` — Basic tests for primitives and ambiguity handling.
- `examples/` — JSON test cases and helper scripts.
- `evidence/` — Screenshots and notes corresponding to appendices.

---

## Quickstart

```bash
git clone https://github.com/<your-username>/aurora-pef.git
cd aurora-pef
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt  # if you add one
python -m src.demo.cli_demo

The demo will:

Load a small set of ambiguous sentences (e.g. “Emma told Lucy that her sister was arriving.”),

Build multiple interpretations in Aurora,

Show which interpretations survive constraint pruning,

Optionally compare this to a baseline LLM response (if you wire in an adapter).

Architecture Overview

For a full explanation, see the whitepaper in whitepaper/.

At a high level:

PEF (src/aurora/pef.py)
Provides a persistent conceptual substrate where entities exist outside of any single sentence.

Primitives (src/aurora/primitives.py)
Implements the core operators (e.g. BRANCH, HOLD, PRUNE, BIND, TRACE, ANCHOR, LIFT, etc.)
as functions or small classes over conceptual kernels.

Interpreter (src/aurora/interpreter.py)
Converts structured input (a parsed sentence with roles/domains/spans) into parallel
interpretations, using the primitives to maintain ambiguity.

Verifier (src/aurora/verifier.py)
Applies constraints to prune impossible interpretations and produce traces of the reasoning.

Integrations (src/aurora/... + src/integrations/)
Example “sandwich” pattern:

Aurora builds structured interpretations from input.

An LLM (or any generator) turns those into natural language.

Aurora verifies and prunes outputs for consistency.

Status

This repo is a reference and demonstration implementation, not a production system.

It is intended to:

Make the architecture concrete for researchers and engineers,

Provide a testbed for ambiguity and reasoning experiments,

Serve as the basis for deeper collaborations and licensing.

Licensing & Contact

NOTE: Exact licensing terms are to be finalised and may differ from standard open-source licenses.

For collaboration, licensing, or research discussions, contact:

Name: Margaret Stokes

Email: megstokesart@gmail.com      
