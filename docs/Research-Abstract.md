# Research Abstract — Aurora + PEF Reasoning Architecture

Transformer-based language models exhibit a set of reproducible,
architecture-independent failure modes that arise directly from the
probabilistic and embedding-centric structure of the transformer
mechanism. Across multiple systems (GPT-4, Claude, Gemini, Grok), we
observe consistent patterns of (1) premature ambiguity collapse,
(2) invented grammatical or semantic rules, (3) irreversible narrative
reinterpretation, (4) input mutation, and (5) loss of conceptual
identity across context. These behaviours persist regardless of scale,
training method, or guardrails, suggesting structural—not experiential—
limitations.

Aurora + PEF introduces a compositional alternative designed to operate
adjacent to transformer models rather than replace them. **Aurora** is an
explicit reasoning layer based on Roles, Domains, Spans, conceptual
kernels, parallel interpretations, and constraint-based pruning. It
maintains reversible interpretive states and preserves ambiguity until
it is legitimately resolvable, eliminating a major source of LLM
hallucination and drift.

The **Persistent Existence Frame (PEF)** provides a substrate for
non-temporal continuity, stable identity, reconstructable past states,
and cross-sentence interpretive coherence. PEF serves as a reasoning
world-model in which entities and relations persist independently of
surface language, enabling long-horizon reasoning without representational
drift.

Aurora + PEF integrates with existing LLMs through a hybrid pipeline:
**Aurora Interpretation → LLM Expression → Aurora Verification**. This
architecture positions transformers as expressive surface-form
generators while delegating meaning construction and verification to a
transparent, deterministic system with explicit reasoning traces.

Empirical results across Appendices A–D demonstrate that Aurora + PEF
resolves all documented ambiguity and identity-collapse cases cleanly
and without heuristic inference. The architecture offers a path toward
reliable, auditable reasoning; stable multi-agent communication; and
safety-critical deployment without requiring retraining of existing LLMs.

Aurora + PEF represents a substrate-level alternative for machine
reasoning, compatible with current generative models and suitable for
applications where interpretive fidelity, long-term coherence, and
hallucination immunity are required.
