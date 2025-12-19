(() => {
  // Keep the endpoint out of the HTML. Still visible in DevTools if someone digs.
  const WORKER_URL = "https://YOUR_WORKER_SUBDOMAIN.workers.dev"; // <-- set this

  // Strict allowlist: only IDs, no text prompts.
  const DEMO_ID = "bird_ambiguity_v1";

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

  async function callWorker(choice = null) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo_id: DEMO_ID, choice }),
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

    // Fallback: if your worker ever changes, don’t invent.
    setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Unexpected response.");
    out.textContent += `Unexpected: ${JSON.stringify(data, null, 2)}\n`;
  }

  async function choose(choice) {
    out.textContent += `User: ${choice}\n`;

    const data = await callWorker(choice);

    if (data.status === "RESOLVED") {
      setStatus("ok", "Gate verdict: ADMISSIBLE", "Resolution permitted after binding.");
      choices.style.display = "none";
      out.textContent += `System: ${data.statement}\n`;
      return;
    }

    setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Unexpected response.");
    out.textContent += `Unexpected: ${JSON.stringify(data, null, 2)}\n`;
  }

  startBtn?.addEventListener("click", () => {
    runInitial().catch((e) => {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Demo unavailable.");
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
      out.textContent += `${err.message}\n`;
    });
  });

  clearUI();
})();
