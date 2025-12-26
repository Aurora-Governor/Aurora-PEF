\# Epistemic Legitimacy Demonstrator — Licensed vs Unlicensed Resolution

> Demonstration artifact corresponding to [`demos/epistemic_legitimacy_pronoun_binding/`](../demos/epistemic_legitimacy_pronoun_binding/)


\## Purpose



This document records the results of a minimal epistemic legitimacy demonstrator designed to isolate a single failure mode observed in contemporary large language models:



\*\*Collapse to a single conclusion under ambiguity, even when such a conclusion is not licensed by available evidence.\*\*



The demonstrator contrasts:

\* \*\*best-guess reasoning\*\* (collapse by heuristic), and

\* \*\*epistemically legitimate reasoning\*\* (collapse only when licensed; otherwise refusal).



This is a toy demonstrator, not a system, benchmark, or model.



\## Demonstrated Invariant



A conclusion is licensed if and only if exactly one candidate interpretation is supported by evidence.



Formally:

```

resolve ⇔ |SupportedInterpretations| = 1

otherwise → refuse

```



Refusal is treated as a first-class correct outcome, not as failure.



\## Scenario



The demonstrator uses a single ambiguous construction:



\*\*"Emma told Lucy that her sister was arriving."\*\*



Two interpretations are structurally valid:

\* Emma's sister

\* Lucy's sister



A high-entropy input stream (irrelevant facts, emotional content, topic drift) precedes the ambiguous sentence. Evidence is introduced explicitly via evidence atoms, or not at all.



\## Experimental Regimes and Outcomes



The demonstrator evaluates four regimes, corresponding to the cardinality of evidence support.



| Regime   | Supported Interpretations | Best-Guess (Vanilla) | Epistemic Gate  | Vanilla Licensed |

|----------|---------------------------|----------------------|-----------------|------------------|

| \*\*both\*\* | 2                         | collapses to one     | refuses         | ❌               |

| \*\*emma\*\* | 1                         | collapses to Emma    | resolves (Emma) | ✅               |

| \*\*lucy\*\* | 1                         | collapses to Lucy    | resolves (Lucy) | ✅               |

| \*\*none\*\* | 0                         | collapses to one     | refuses         | ❌               |

\## Key Observations



1\. Best-guess reasoning collapses in all regimes, regardless of evidential support.

2\. Epistemic gating resolves only when collapse is licensed by a singleton evidence set.

3\. In both the \*\*both\*\* and \*\*none\*\* regimes, best-guess outputs are unlicensed conclusions.

4\. Refusal is not conservative behavior; it is structurally required under ambiguity.



\## Why This Matters



Most current evaluation frameworks reward:

\* plausibility,

\* fluency,

\* or correctness under hindsight.



They do not evaluate whether a model was entitled to its conclusion at the time it was made.



This demonstrator shows that:

\* intelligence and entitlement are orthogonal,

\* confidence can be illegitimate,

\* and refusal is sometimes the only epistemically correct move.



\## Status



\* \*\*Scope:\*\* Single failure mode, single invariant

\* \*\*Intent:\*\* Evidentiary witness

\* \*\*Implementation:\*\* Runnable Python demonstrator

\* \*\*Location:\*\* `demos/epistemic\_legitimacy\_pronoun\_binding/`



This artifact is deliberately minimal and complete.

