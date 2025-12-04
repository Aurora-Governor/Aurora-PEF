
You can soften or sharpen the language, but structurally this ticks all the right boxes.

---

## 3. Core stubs so the repo isn’t empty

You don’t need full code today. You just need *non-embarrassing* stubs.

### `src/aurora/primitives.py`

```python
"""
Aurora primitive operators.

These operate over conceptual kernels, roles/domains/spans,
and PEF entities. See Appendix D of the whitepaper for definitions.
"""

from dataclasses import dataclass
from typing import Any, List


@dataclass
class Kernel:
    """Minimal placeholder for a conceptual kernel."""
    id: str
    data: Any


@dataclass
class Interpretation:
    """One candidate world / reading."""
    id: str
    kernels: List[Kernel]
    notes: List[str]


def branch(base_interpretation: Interpretation, *variants: Interpretation) -> List[Interpretation]:
    """Spawn multiple interpretations from a base one."""
    return list(variants)


def hold(interpretations: List[Interpretation]) -> List[Interpretation]:
    """Maintain multiple interpretations without collapsing."""
    return interpretations


def prune(interpretations: List[Interpretation]) -> List[Interpretation]:
    """Placeholder for constraint-based pruning."""
    # TODO: implement real constraints
    return interpretations


def bind(interpretation: Interpretation, note: str) -> Interpretation:
    """Attach a binding decision (e.g. which role an attachment belongs to)."""
    interpretation.notes.append(note)
    return interpretation


def trace(interpretation: Interpretation) -> str:
    """Return a human-readable trace of the reasoning for this interpretation."""
    return f"Interpretation {interpretation.id}: " + " | ".join(interpretation.notes)
