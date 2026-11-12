// Dependency-free browser regression checks. Run the static server first, then:
// node tests/browser-controls.mjs
// Requires Chromium (override its executable with CHROMIUM_PATH if needed).
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const profile = await mkdtemp(join(tmpdir(), "passphrase-browser-"));
const browser = spawn(process.env.CHROMIUM_PATH || "chromium", [
  "--headless", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=9222", `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });
const base = process.env.TEST_URL || (process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}/` : "http://127.0.0.1:5000/");
let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      endpoint = await (await fetch("http://127.0.0.1:9222/json/version")).json();
      break;
    } catch { await delay(100); }
  }
  assert.ok(endpoint, "Chromium must start");
  socket = new WebSocket(endpoint.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    clearTimeout(item.timeout);
    if (message.error) item.reject(new Error(JSON.stringify(message.error)));
    else item.resolve(message.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timeout = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error(`Timed out: ${method}`));
    }, 15000);
    pending.set(requestId, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  await cdp("Page.enable");
  const evaluate = async (expression) => {
    const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const load = async () => {
    await cdp("Page.navigate", { url: base });
    for (let i = 0; i < 150; i++) {
      if (await evaluate(`!!document.querySelector('#generate-button') &&
        !document.querySelector('#generate-button').disabled`)) {
        await delay(100);
        return;
      }
      await delay(100);
    }
    throw new Error("Dictionary did not load");
  };
  const state = () => evaluate(`(() => {
    const $ = s => document.querySelector(s);
    return {
      phrase: $('#passphrase').textContent,
      status: $('#status-message').textContent,
      copyDisabled: $('#copy-button').disabled,
      mode: $('[name="separator-mode"]:checked').value,
      fixedHidden: $('#fixed-separator-control').hidden,
      randomHidden: $('#random-separator-control').hidden,
      fixedDisabled: $('#separator').disabled,
      randomDisabled: $('#separator-characters').disabled,
      digits: $('#number-length').value,
      fixed: $('#separator').value,
      pool: $('#separator-characters').value,
      cap: $('#capitalization').selectedOptions[0].textContent,
      view: $('[aria-selected="true"]').dataset.view,
      wordCount: $('#word-count').value,
      theme: document.documentElement.dataset.theme,
      saved: JSON.parse(localStorage.getItem('bulgarian-passphrase-settings-v1'))
    };
  })()`);
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value, event = "input") => evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    el.value = ${JSON.stringify(value)};
    el.dispatchEvent(new Event(${JSON.stringify(event)}, { bubbles: true }));
  })()`);
  const setSaved = async (saved) => {
    await evaluate(`localStorage.setItem('bulgarian-passphrase-settings-v1', ${JSON.stringify(
      typeof saved === "string" ? saved : JSON.stringify(saved))})`);
    await load();
  };
  const fixedParts = phrase => phrase.split(/[-.!_ ]/u);

  await load();
  let s = await state();
  assert.equal(s.mode, "fixed");
  assert.ok(s.randomHidden && s.randomDisabled);
  assert.equal(s.digits, "2", "Random number defaults to 2 digits");
  assert.match(s.phrase, /-[1-9][0-9]$/u);
  assert.equal(s.wordCount, "2");
  assert.equal(await evaluate(`document.querySelector('#word-count').min`), "2");
  const original = s.phrase;
  await input("#separator-characters", "@");
  assert.equal((await state()).phrase, original, "Inactive pool must not affect output");
  await input("#number-length", "7");
  s = await state();
  assert.match(s.phrase, /-[1-9][0-9]{6}$/u);
  const withNumber = fixedParts(s.phrase);
  await click('[name="separator-mode"][value="random"]');
  s = await state();
  assert.deepEqual(s.phrase.split("@"), withNumber);
  assert.ok(s.fixedHidden && s.fixedDisabled && !s.randomHidden && !s.randomDisabled);
  await input("#separator", "_", "change");
  assert.equal((await state()).phrase, s.phrase, "Inactive fixed separator must not affect output");
  await click('[name="separator-mode"][value="fixed"]');
  assert.deepEqual((await state()).phrase.split("_"), withNumber);
  await input("#number-length", "0");
  s = await state();
  assert.doesNotMatch(s.phrase, /[0-9]/u, "Zero removes the number");
  assert.deepEqual(s.phrase.split("_").length, withNumber.length - 1);
  await input("#number-length", "12");
  assert.match((await state()).phrase, /_[1-9][0-9]{11}$/u);
  const cyrillic = (await state()).phrase;
  await click("#romanized-tab");
  assert.doesNotMatch((await state()).phrase, /[а-я]/iu);
  await click("#cyrillic-tab");
  assert.equal((await state()).phrase, cyrillic);
  await evaluate(`Object.defineProperty(navigator, 'clipboard', {
    configurable: true, value: { async writeText(text) { window.copiedText = text; } }
  })`);
  await click("#copy-button");
  assert.equal(await evaluate("window.copiedText"), cyrillic);
  await input("#capitalization", "upper", "change");
  s = await state();
  assert.equal(s.cap, "ALL CAPS");
  assert.equal(s.phrase, s.phrase.toLocaleUpperCase("bg-BG"));
  await load();
  s = await state();
  assert.equal(s.digits, "12");
  assert.equal(s.pool, "@");
  assert.equal(s.fixed, "_");
  assert.equal(s.cap, "ALL CAPS");
  assert.deepEqual(Object.keys(s.saved).sort(), [
    "wordCount", "separator", "numberLength", "separatorCharacters",
    "capitalization", "separatorMode", "view",
  ].sort(), "Persist settings only, never generated text");
  console.log("PASS independent controls, writing systems, disclosure, and refresh");

  for (const advancedOpen of [false, true]) {
    await setSaved({
      advancedOpen, wordCount: 3, separator: "!", separatorCharacters: "★",
      numberLength: "9", includeNumber: true, capitalization: "lower", view: "romanized",
    });
    s = await state();
    assert.equal(s.mode, advancedOpen ? "random" : "fixed");
    assert.equal(s.digits, "9");
    assert.equal(s.fixed, "!");
    assert.equal(s.pool, "★");
    assert.equal(s.view, "romanized");
    assert.equal(s.wordCount, "3");
    assert.equal(s.cap, "all lowercase");
    assert.match(s.phrase, new RegExp(`${advancedOpen ? "★" : "!"}[1-9][0-9]{8}$`, "u"));
    assert.equal(s.saved.separatorMode, s.mode);
  }
  for (const numberLength of [undefined, null, false, {}, "", -1, 13, 1.5, "bad"]) {
    await setSaved({ numberLength, includeNumber: true });
    assert.equal((await state()).digits, "2");
  }
  await setSaved({ numberLength: "9", includeNumber: false });
  assert.equal((await state()).digits, "0", "Legacy disabled number migrates to 0");
  await setSaved({ numberLength: "5" });
  assert.equal((await state()).digits, "5");
  for (const malformed of ["{", "null", "[]", "42"]) {
    await setSaved(malformed);
    assert.equal((await state()).mode, "fixed");
    assert.equal((await state()).digits, "2");
  }
  console.log("PASS legacy migration and malformed preferences");

  await click('[name="separator-mode"][value="random"]');
  await input("#separator-characters", "");
  assert.ok((await state()).copyDisabled);
  assert.match((await state()).status, /at least one character/u);
  await click("#romanized-tab");
  assert.equal((await state()).phrase, "Unable to generate");
  await input("#number-length", "4");
  await input("#separator-characters", "😀");
  s = await state();
  assert.ok(!s.copyDisabled);
  assert.match(s.phrase, /😀[1-9][0-9]{3}$/u);
  await input("#number-length", "1");
  assert.match((await state()).phrase, /😀[1-9]$/u);
  await input("#number-length", "0");
  assert.doesNotMatch((await state()).phrase, /[0-9]/u);
  console.log("PASS invalid active settings and recovery without stale copying");

  for (const width of [320, 390, 1280]) {
    await cdp("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: width < 640,
    });
    for (const theme of ["light", "dark"]) {
      await evaluate(`localStorage.setItem('bulgarian-passphrase-theme', '${theme}')`);
      await load();
      s = await state();
      assert.equal(s.theme, theme);
      assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), "No horizontal overflow");
      assert.ok(await evaluate(`getComputedStyle(document.querySelector('#separator-characters')).backgroundColor !== 'rgb(255, 255, 255)' || '${theme}' === 'light'`));
      if (width === 390 && theme === "dark" && process.env.TEST_SCREENSHOT_PATH) {
        const { data } = await cdp("Page.captureScreenshot", {
          format: "jpeg", quality: 75, captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height: await evaluate("document.documentElement.scrollHeight"), scale: 1 },
        });
        await writeFile(process.env.TEST_SCREENSHOT_PATH, Buffer.from(data, "base64"));
      }
    }
  }
  console.log("PASS mobile/desktop layout and saved light/dark appearance");

  await cdp("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });`,
  });
  await load();
  assert.match(await evaluate(`document.querySelector('#status-message').textContent`), /storage is unavailable/u);
  await click("#generate-button");
  await input("#number-length", "2");
  assert.match(await evaluate(`document.querySelector('#passphrase').textContent`), /-[1-9][0-9]$/u);
  assert.match(await evaluate(`document.querySelector('#status-message').textContent`), /storage is unavailable/u);
  console.log("PASS blocked browser storage still allows local generation");
} finally {
  socket?.close();
  browser.kill();
  await new Promise(resolve => browser.once("exit", resolve));
  await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
}
