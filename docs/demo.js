(() => {
  const WORKER_URL = "https://aurora-clarify.milamba.workers.dev";

  // Whitelisted scenarios on the client side.
  // NOTE: your Worker must understand these contexts (either via string checks or exact match).
  const SCENARIOS = {
    bird: {
      title: "Missing bird (binding)",
      prompt: `James has a bird.
Jenny has a bird.
The bird is missing.

Where is the bird?`,
      context: [
        "James has a bird.",
        "Jenny has a bird.",
        "The bird is missing."
      ]
    },
    telescope: {
      title: "Telescope (attachment)",
      prompt: `I saw the man with the telescope.`,
      context: [
        "I saw the man with the telescope."
      ]
    },
    trophy: {
      title: "Trophy (pronoun)",
      prompt: `The trophy didn't fit in the suitcase because it was too small.`,
      context: [
        "The trophy didn't fit in the suitcase because it was too small."
      ]
    },
    emma: {
      title: "Emma/Lucy (pronoun “her”)",
      prompt: `Emma told Lucy that her sister was arriving tomorrow.`,
      context: [
        "Emma told Lucy that her sister was arriving tomorrow."
      ]
    }
  };

  const el = (id) => document.getElementById(id);

  const startBtn   = el("demoStart");
  const resetBtn   = el("demoReset");
  const statusBox  = el("demoStatus");
  const verdict    = el("demoVerdict");
  const msg        = el("demoMsg");
  const choicesBox = el("demoChoices");
  const out        = el("demoOutput");
  const promptBox  = el("demoPrompt");
  const scenarioSel= el("demoScenario"); // optional

  function setStatus(kind, title, text) {
    statusBox.style.display = "block";
    verdict.textContent = title;
    msg.textContent = text || "";
    statusBox.className = `status ${kind}`;
  }

  function clearUI() {
    statusBox.style.display = "none";
    choicesBox.style.display = "none";
    choicesBox.innerHTML = "";
    out.textContent = "";
    resetBtn.style.display = "none";
  }

  function getScenarioId() {
    if (scenarioSel && scenarioSel.value) return scenarioSel.value;
    return "bird";
  }

  function applyScenarioToUI() {
    const sid = getScenarioId();
    const s = SCENARIOS[sid] || SCENARIOS.bird;
    if (promptBox) promptBox.textContent = s.prompt;
    clearUI();
  }

  function renderChoices(options) {
    // options can be an array of strings ["james_bird", ...]
    // or an array of objects [{id,label}, ...] if you later upgrade the Worker.
    choicesBox.innerHTML = "";

    (options || []).forEach((opt) => {
      const id = (typeof opt === "string") ? opt : opt.id;
      const label = (typeof opt === "string") ? opt : (opt.label || opt.id);

      const b = document.createElement("button");
      b.className = "pill";
      b.dataset.choice = id;
      b.textContent = label;
      choicesBox.appendChild(b);
    });

    choicesBox.style.display = (options && options.length) ? "block" : "none";
  }

  async function callWorker(context, binding) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context,
        binding: binding ?? null
      })
    });

    if (!res.ok) throw new Error(`Worker error: ${res.status}`);
    return res.json();
  }

  async function runInitial() {
    clearUI();

    const sid = getScenarioId();
    const scenario = SCENARIOS[sid];
    if (!scenario) {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Unknown scenario.");
      return;
    }

    out.textContent = `Calling gate…\nScenario: ${scenario.title}\n\n`;

    const data = await callWorker(scenario.context, null);

    if (data.status === "STOP") {
      setStatus("warn", "Gate verdict: AMBIGUOUS_UNRESOLVED", "Clarification required.");
      renderChoices(data.options);
      resetBtn.style.display = "inline-flex";
      out.textContent +=
        "System: STOP\n" +
        `System: ${data.question}\n`;
      return;
    }

    if (data.status === "RESOLVED") {
      setStatus("ok", "Gate verdict: ADMISSIBLE", "Resolution permitted.");
      resetBtn.style.display = "inline-flex";
      out.textContent += `System: ${data.statement}\n`;
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
    const sid = getScenarioId();
    const scenario = SCENARIOS[sid];

    out.textContent += `User: ${binding}\n`;

    const data = await callWorker(scenario.context, binding);

    if (data.status === "RESOLVED") {
      setStatus("ok", "Gate verdict: ADMISSIBLE", "Resolution permitted after binding.");
      choicesBox.style.display = "none";
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
    applyScenarioToUI();
  });

  choicesBox?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-choice]");
    if (!btn) return;

    choose(btn.dataset.choice).catch((err) => {
      setStatus("bad", "Gate verdict: INADMISSIBLE_UNSUPPORTED", "Demo unavailable.");
      resetBtn.style.display = "inline-flex";
      out.textContent += `${err.message}\n`;
    });
  });

  scenarioSel?.addEventListener("change", () => {
    applyScenarioToUI();
  });

  // init
  applyScenarioToUI();
})();
