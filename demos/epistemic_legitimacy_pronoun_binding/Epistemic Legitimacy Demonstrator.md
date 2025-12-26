# Epistemic Legitimacy Demonstrator (Toy)

This folder contains a **minimal, runnable demonstration** of a single epistemic failure mode
observed in contemporary large language models:

> collapse to a single conclusion under ambiguity and pressure,
> even when such a conclusion is not licensed by available evidence.

## What this is
- A **toy demonstrator**
- A **posture proof**, not a system
- A **falsifiable comparison** between:
  - best-guess reasoning
  - epistemically legitimate reasoning

## What this is not
- Not Aurora
- Not a model
- Not a benchmark
- Not a claim about performance or intelligence

## The invariant demonstrated
Collapse to a single interpretation is **licensed if and only if**
exactly one interpretation is supported by evidence.

Formally:
resolve ⇔ |SupportedBindings| = 1  
otherwise → refuse

## Files
- `demo_epistemic_gate.py` — runnable script
- `demo_results.json` — captured output for audit

## How to run
```bash
python demo_epistemic_gate.py
