(() => {
  "use strict";

  const letters = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
    р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
    ш: "sh", щ: "sht", ъ: "a", ь: "y", ю: "yu", я: "ya"
  };
  const alphabet = /^[абвгдежзийклмнопрстуфхцчшщъьюя]+$/i;
  const wordCountInput = document.querySelector("#word-count");
  const wordCountValue = document.querySelector("#word-count-value");
  const wordCountChip = document.querySelector("#word-count-chip");
  const separatorInput = document.querySelector("#separator");
  const passphrase = document.querySelector("#passphrase");
  const generateButton = document.querySelector("#generate-button");
  const copyButton = document.querySelector("#copy-button");
  const statusMessage = document.querySelector("#status-message");
  const rulesLink = document.querySelector("#rules-link");
  const tabs = [...document.querySelectorAll(".view-tab")];

  let words = [];
  let chosenWords = [];
  let activeView = "cyrillic";

  function secureIndex(max) {
    if (!Number.isSafeInteger(max) || max < 1) {
      throw new Error("The dictionary did not contain enough usable words.");
    }
    if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
      throw new Error("This browser does not provide secure random numbers.");
    }

    const range = 0x100000000;
    const limit = range - (range % max);
    const value = new Uint32Array(1);
    do {
      window.crypto.getRandomValues(value);
    } while (value[0] >= limit);
    return value[0] % max;
  }

  function titleCase(word) {
    return word.charAt(0).toLocaleUpperCase("bg-BG") + word.slice(1);
  }

  function transliterate(text) {
    return Array.from(text, (character) => {
      const lower = character.toLocaleLowerCase("bg-BG");
      const latin = letters[lower];
      if (!latin) return character;
      return character === lower
        ? latin
        : latin.charAt(0).toUpperCase() + latin.slice(1);
    }).join("");
  }

  function renderPassphrase() {
    const separator = separatorInput.value;
    const cyrillicWords = chosenWords.map(titleCase);
    const renderedWords = activeView === "romanized"
      ? cyrillicWords.map(transliterate)
      : cyrillicWords;

    passphrase.textContent = renderedWords.join(separator);
    passphrase.lang = activeView === "romanized" ? "en-Latn" : "bg";
    copyButton.disabled = chosenWords.length === 0;
    copyButton.querySelector("span").textContent = "Copy";
  }

  function generate() {
    if (words.length === 0) return;
    try {
      const count = Number(wordCountInput.value);
      chosenWords = Array.from({ length: count }, () => words[secureIndex(words.length)]);
      wordCountValue.value = String(count);
      wordCountChip.textContent = `${count} ${count === 1 ? "word" : "words"}`;
      renderPassphrase();
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
    } catch (error) {
      chosenWords = [];
      passphrase.textContent = "Unable to generate";
      copyButton.disabled = true;
      statusMessage.textContent = error.message;
      statusMessage.classList.add("is-error");
    }
  }

  async function loadDictionary() {
    try {
      const response = await fetch("./public/wordlist.txt");
      if (!response.ok) throw new Error(`Dictionary could not be loaded (${response.status}).`);
      const text = (await response.text()).replace(/^\uFEFF/, "");
      words = [...new Set(
        text.split(",")
          .map((word) => word.trim().normalize("NFC"))
          .filter((word) => alphabet.test(word))
      )];
      if (words.length < 100) throw new Error("The dictionary file appears to be incomplete.");
      generateButton.disabled = false;
      generate();
    } catch (error) {
      passphrase.textContent = "Dictionary unavailable";
      statusMessage.textContent = `${error.message} Please reload the page to try again.`;
      statusMessage.classList.add("is-error");
    }
  }

  async function copyCurrentPhrase() {
    if (!chosenWords.length) return;
    try {
      await navigator.clipboard.writeText(passphrase.textContent);
      copyButton.querySelector("span").textContent = "Copied";
      statusMessage.textContent = "Passphrase copied to clipboard.";
      statusMessage.classList.remove("is-error");
    } catch {
      statusMessage.textContent = "Clipboard access is unavailable in this browser.";
      statusMessage.classList.add("is-error");
    }
  }

  function selectView(tab, focus = false) {
    activeView = tab.dataset.view;
    rulesLink.hidden = activeView !== "romanized";
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    if (focus) tab.focus();
    renderPassphrase();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectView(tab));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      const next = event.key === "ArrowRight" ? (current + 1) % tabs.length
        : event.key === "ArrowLeft" ? (current - 1 + tabs.length) % tabs.length
          : event.key === "Home" ? 0
            : event.key === "End" ? tabs.length - 1
              : -1;
      if (next >= 0) {
        event.preventDefault();
        selectView(tabs[next], true);
      }
    });
  });
  tabs.forEach((tab, index) => { tab.tabIndex = index === 0 ? 0 : -1; });

  wordCountInput.addEventListener("input", generate);
  separatorInput.addEventListener("change", renderPassphrase);
  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", copyCurrentPhrase);

  loadDictionary();
})();
