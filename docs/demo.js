(() => {
  // ✅ Your real Cloudflare Worker endpoint:
  const WORKER_URL = "https://aurora-clarify.milamba.workers.dev";

  // ✅ The fixed scenario text we send to the worker (matches your worker’s string checks)
  const BASE_CONTEXT = [
    "James has a bird.",
    "Jenny has a bird.",
    "The bird is missing."
  ];

  const el = (id) => document.getElementById(id);

  const startBtn = el("demoStart");
  const resetBtn = el("demoReset");
  const statusBox = el("demoStatus");
  const verdict = el("demoVerdict");
  const msg = el("demoMsg");
  const choices = el("demoChoices");
  const out = el("demoOutput");

  function setStatus(kind, title, text) {
    statusBox.style.display = "block";
    verdict.textContent = title;
    msg.textContent = text || "";
    statusBox.className = `status ${kind}`;
  }

  function clearUI() {
    statusBox.style.display = "none";
    choices.style.display = "none";
    out.textContent = "";
    resetBtn.style.display = "none";
  }

  // This function calls your Cloudflare Worker and returns the JSON response.
  async function callWorker(binding) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ IMPORTANT: Your worker expects { context: [...], binding: "james_bird" }
      body: JSON.stringify({
        context: BASE_CONTEXT,
        binding: binding ?? null
      })
    });

    if (!res.ok) {
      throw new Error(`Worker error: ${res.status}`);
    }

    return res.json();
  }

  async function runInitial() {
    clearUI();
    out.textContent = "Calling gate…\n";

    const data = await callWorker(null);

    if (data.status === "STOP") {
      setStatus("warn", "Gate verdict: AMBIGUOUS_UNRESOLVED", "Clarification required.");
      choices.style.display = "block";
      resetBtn.style.display = "inline-flex";
      out.textContent =
        "System: STOP\n" +
        `System: ${data.question}\n`;
      return;
    }

    if (data.status === "UNKNOWN") {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", data.message || "Insufficient information.");
      resetBtn.style.display = "inline-flex";
      out.textContent += `System: ${data.status}\n`;
      return;
    }

    setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Unexpected response.");
    resetBtn.style.display = "inline-flex";
    out.textContent += `Unexpected: ${JSON.stringify(data, null, 2)}\n`;
  }

  async function choose(binding) {
    out.textContent += `User: ${binding}\n`;

    const data = await callWorker(binding);

    if (data.status === "RESOLVED") {
      setStatus("ok", "Gate verdict: ADMISSIBLE", "Resolution permitted after binding.");
      choices.style.display = "none";
      resetBtn.style.display = "inline-flex";
      out.textContent += `System: ${data.statement}\n`;
      return;
    }

    setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Unexpected response.");
    resetBtn.style.display = "inline-flex";
    out.textContent += `Unexpected: ${JSON.stringify(data, null, 2)}\n`;
  }

  startBtn?.addEventListener("click", () => {
    runInitial().catch((e) => {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Demo unavailable.");
      resetBtn.style.display = "inline-flex";
      out.textContent += `${e.message}\n`;
    });
  });

  resetBtn?.addEventListener("click", () => {
    clearUI();
  });

  choices?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-choice]");
    if (!btn) return;

    choose(btn.dataset.choice).catch((err) => {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Demo unavailable.");
      resetBtn.style.display = "inline-flex";
      out.textContent += `${err.message}\n`;
    });
  });

  clearUI();
})();
