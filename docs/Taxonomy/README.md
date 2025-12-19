# Failure Taxonomy: Epistemic Collapse Under Incomplete Information

This document classifies **architectural failure modes** observed in transformer-based
language models when they are required to reason under incomplete information.

It is **not** a critique of specific models, prompts, or training regimes.
The failure modes described here persist across model families, vendors, scales,
and prompting styles.

The purpose of this taxonomy is to identify **systematic epistemic errors**
that arise during *state construction*, prior to language generation.

---

## What This Is

This is a **failure taxonomy**, not a benchmark and not a linguistic analysis.

Each failure class documented here:

- is reproducible in fresh sessions
- appears across multiple LLM implementations
- arises independently of surface phrasing
- cannot be eliminated through prompt engineering or fine-tuning

The taxonomy focuses on **inadmissible inference** — cases where a model commits
to a conclusion that is not licensed by the available information.

---

## The Minimal Witness: The Missing Key Scenario

The Missing Key scenario is used as a *minimal witness* because it isolates
epistemic admissibility from linguistic complexity.

The task requires a system to:

- represent multiple candidate entities
- distinguish past trace from current state
- preserve ambiguity when referent binding is not licensed
- refuse commitment as a valid terminal outcome

Human solvers and kernel-based reasoning systems consistently adopt this posture.
Transformer-based systems do not.

---

## Scope and Generalization

Although illustrated using a simple referential ambiguity task, the failure modes
documented here generalize to other reasoning domains, including:

- causal inference
- intent attribution
- counterfactual reasoning
- legal and moral judgment
- explanation generation

In all cases, the underlying issue is the same:
**the absence of a first-class epistemic state in which commitment is inadmissible.**

---

## Why These Failures Are Architectural

All failure classes arise from properties shared by transformer architectures:

- optimization for next-token plausibility
- absence of explicit epistemic state representation
- no distinction between admissible and inadmissible inference
- no mechanism for persistent ambiguity or lawful refusal

These are not bugs and not model-specific defects.
They are predictable consequences of the architecture.

---

## Relation to the Rest of the Repository

This taxonomy complements the executable demonstrations in this repository by
providing a **structural classification** of observed failures.

Where demos show *what happens*, this document explains *why the failures cluster*
and *how they differ mechanistically*.

Ambiguity is not the core issue.
It is simply the smallest case in which epistemic restraint is required and visibly fails.

---

## How to Read the Taxonomy

Each failure class includes:

- a definition
- observed symptoms
- representative examples
- a formal characterization of the error
- an explanation of why the failure occurs

The goal is recognition, reproducibility, and precise reasoning — not model scoring.

---

## Intended Audience

This document is written for readers interested in:

- reasoning architectures
- epistemic safety
- interpretability grounded in mechanism
- limitations of sequence-prediction systems
- alternatives to premature commitment in AI reasoning

It assumes familiarity with basic concepts in AI and logic, but does not require
knowledge of any specific system in this repository.

---
