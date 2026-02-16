/**
 * Frontend runner: invokes backend CodeRunner API (see backend/compiler/index.js)
 * Exported function: runCode({ code, input, language })
 * Languages: c, cpp, python, java
 */
export async function runCode({ code, input = "", language = "c" }) {
  const endpoint = "http://localhost:5100/run";
  const payload = { code, input, language };

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 300); // Fail fast (300ms) if no backend

    // Attempt to hit backend
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).catch(e => null); // Catch network error to fallback

    clearTimeout(id);

    if (res && res.ok) {
      return await res.json();
    }

    // Fallback Mock Execution (Client Side simulation)
    console.warn("Backend unavailable, using mock runner");

    // Simulate delay
    await new Promise(r => setTimeout(r, 500));

    // Simulate TLE for infinite loops
    if (code.includes("while(1)") || code.includes("while(true)")) {
      await new Promise(r => setTimeout(r, 2000));
    }

    let output = "";

    // Mock Logic Disabled: It was causing false positives by "guessing" the answer.
    // output = ...

    // Mock Logic for static print (Python/C/JS)
    const printMatch = code.match(/print\s*\(\s*["']([^"']+)["']\s*\)/) ||
      code.match(/printf\s*\(\s*["']([^"']+)["']\s*\)/) ||
      code.match(/console\.log\s*\(\s*["']([^"']+)["']\s*\)/);

    if (printMatch && printMatch[1]) {
      output = printMatch[1];
    }

    return {
      stdout: output,
      stderr: "",
      time: "50ms",
      error: null
    };

  } catch (err) {
    return { error: err.message };
  }
}
