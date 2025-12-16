# Aurora Demo Map (Revised)

This repository contains several small, focused demos.
They are not alternatives to one another; they form a **deliberate progression**, each answering a different question about reasoning under constraint.

---

## ▶️ Start Here: Trace Player (Reference Demonstrator)

**Path:** `02_trace_player/`  
**Run:** `python 02_trace_player/trace_player.py`  
**Traces:** `02_trace_player/traces/*.json`

**Purpose:** Show the reasoning contract *in action* **without shipping an operational engine**.

This demonstrator:

* replays **precomputed, auditable traces**
* halts at ambiguity points and requires bounded clarification
* commits bindings only after explicit choice
* reaches a deterministic terminal stance
* prints a **REFERENCE TRACE** marker for provenance

**Important:** This is a trace player, not a general reasoning system. It performs no ambiguity extraction.

---

## Auditable Kernel: Ambiguity Enumeration

**Path:** `01_reasoning_kernel_ambiguity/`  
**Run:** `python demos/aurora_ambiguity_demo.py`  
**Output:** (prints to stdout; you may redirect to a file)

**Purpose:** Make reasoning outcomes explicit and inspectable.

This demo:

* enumerates all structurally valid interpretations
* evaluates them under different context conditions
* preserves ambiguity where required
* emits a machine-readable trace (stdout)

Use this demo to verify *what* the system allows, forbids, or preserves.

---

## Boundary Demo: Constraint Governance vs LLMs

**Path:** `03_constraint_governance_llm/`

**Purpose:** Show why fluent language models cannot reliably govern ambiguity.

In this demo:

* an LLM is used only as a **proposal engine**
* it may invent, drop, or distort structure
* a separate constraint layer validates and prunes the output
* the final JSON contains only ambiguities licensed by the source text

This demo illustrates why reasoning control must be external to fluency-driven models.

---

## Conceptual Demonstrator: Operator Lattice

**Path:** `operator-lattice/`

**Purpose:** Establish a core structural claim about reasoning.

This demonstrator is intentionally deterministic and hard-coded.
It exists to show that:

* reasoning can be represented as traversal over explicit operators
  (e.g. WE, THEN, BECAUSE, BUT, IF)
* different reasoning policies can traverse the same operator topology
* different policies can reach different terminal *stances*
* those stances can be compared and evaluated

This is a **conceptual proof of structure**, not a behavioral system.

---

## Historical Demos

**Path:** `historic/`

Files in this directory are retained for provenance only.
They do not represent current Aurora behavior and should not be used for evaluation.

---

### How to Use This Repo

* **Want intuition?** Run the trace player.
* **Want proof?** Inspect the kernel outputs (stdout/redirect).
* **Want comparison?** Examine the LLM constraint governance demo.
* **Want structure?** Read the operator lattice demonstrator.

Each demo is intentionally small so its guarantees remain visible.
