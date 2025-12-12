# Operator Lattice Demonstrator

This demo illustrates a core Aurora idea:

> Reasoning is not just a sequence of tokens, but a traversal over
> explicit logical operators that culminates in a *stance*.

This implementation is **intentionally hard-coded** and deterministic.
It is not intended as a final mechanism, but as a conceptual proof that:

- reasoning steps can be represented as operators (WE, THEN, BECAUSE, BUT, IF)
- operator transitions can be mined from text
- multiple reasoning policies can traverse the same operator topology
- different policies can reach different *terminal stances*
- those stances can be compared and evaluated

---

## What this demo does

Given a short corpus of natural language reasoning:

1. Operators are extracted from sentences (e.g. WE, THEN, BUT, IF).
2. A transition graph is mined between operators.
3. Two reasoning branches are executed:
   - **Conservative** (risk-averse, tension-aware)
   - **Exploratory** (conditional, possibility-preserving)
4. Each branch traverses an operator lattice.
5. Each branch ends in a final operator (*stance*).
6. Branches are scored and compared.

Example terminal stances:

- **BUT** → unresolved tension flagged
- **IF**  → conditional held open

The system does not merely produce an answer — it produces a *position
within a reasoning space*.

---

## What this demo is NOT

- It is not a trained model
- It is not a diffusion system
- It does not claim cognitive completeness
- Transition preferences and execution semantics are hard-coded
- Randomness is seeded for repeatability

This demo exists to make Aurora’s architectural claims explicit and testable.

---

## Why this matters

Current language models collapse reasoning into fluent output.
Aurora proposes preserving reasoning structure explicitly.

This demo shows that once operators are explicit, we can:
- compare reasoning strategies
- detect failure modes (e.g. conditional sinks)
- reason about safety vs exploration
- explain *why* a system ended where it did

That is the point.
