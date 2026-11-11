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
  const separatorModeNote = document.querySelector("#separator-mode-note");
  const includeNumberInput = document.querySelector("#include-number");
  const numberLengthInput = document.querySelector("#number-length");
  const numberOptionNote = document.querySelector("#number-option-note");
  const separatorCharactersInput = document.querySelector("#separator-characters");
  const capitalizationInput = document.querySelector("#capitalization");
  const advancedOptions = document.querySelector(".advanced-options");
  const passphrase = document.querySelector("#passphrase");
  const passphrasePanel = document.querySelector("#passphrase-panel");
  const generateButton = document.querySelector("#generate-button");
  const copyButton = document.querySelector("#copy-button");
  const statusMessage = document.querySelector("#status-message");
  const rulesLink = document.querySelector("#rules-link");
  const themeToggle = document.querySelector("#theme-toggle");
  const themeModeLabel = document.querySelector("#theme-mode-label");
  const themeColor = document.querySelector("#theme-color");
  const tabs = [...document.querySelectorAll(".view-tab")];
  const preferencesKey = "bulgarian-passphrase-settings-v1";
  const storageWarning = "Browser storage is unavailable; settings cannot be saved on this device.";

  let words = [];
  let chosenWords = [];
  let generatedNumber = "";
  let generatedSeparators = [];
  let activeView = "cyrillic";
  let preferenceStorageUnavailable = false;
  let switchTimer;
  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const themeModes = ["system", "light", "dark"];
  let themeMode = themeModes.includes(document.documentElement.dataset.themeMode)
    ? document.documentElement.dataset.themeMode
    : "system";

  function applyThemeMode() {
    const theme = themeMode === "system"
      ? (themeMedia.matches ? "dark" : "light")
      : themeMode;
    document.documentElement.dataset.themeMode = themeMode;
    document.documentElement.dataset.theme = theme;
    themeModeLabel.textContent = themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
    themeToggle.setAttribute(
      "aria-label",
      `Appearance setting: ${themeMode}. Activate to switch to another mode.`
    );
    themeColor.content = theme === "dark" ? "#211927" : "#e9f2ec";
  }

  themeToggle.addEventListener("click", () => {
    if (themeMode === "system") {
      themeMode = themeMedia.matches ? "light" : "dark";
    } else {
      themeMode = themeMode === "light" ? "dark" : "system";
    }
    try {
      localStorage.setItem("bulgarian-passphrase-theme", themeMode);
    } catch {}
    applyThemeMode();
  });

  if (typeof themeMedia.addEventListener === "function") {
    themeMedia.addEventListener("change", () => {
      if (themeMode === "system") applyThemeMode();
    });
  } else if (typeof themeMedia.addListener === "function") {
    themeMedia.addListener(() => {
      if (themeMode === "system") applyThemeMode();
    });
  }
  applyThemeMode();

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

  function capitalize(word, mode) {
    if (mode === "upper") return word.toLocaleUpperCase("bg-BG");
    if (mode === "lower") return word.toLocaleLowerCase("bg-BG");
    if (mode === "first") return word.toLocaleLowerCase("bg-BG");
    return titleCase(word.toLocaleLowerCase("bg-BG"));
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
    const mode = capitalizationInput.value;
    const lowerWords = chosenWords.map((word) => word.toLocaleLowerCase("bg-BG"));
    const uncapitalizedWords = activeView === "romanized"
      ? lowerWords.map(transliterate)
      : lowerWords;
    const renderedWords = uncapitalizedWords.map((word, index) => {
      if (mode === "first") return index === 0 ? titleCase(word) : word;
      return capitalize(word, mode);
    });
    const parts = generatedNumber ? [...renderedWords, generatedNumber] : renderedWords;
    passphrase.textContent = parts.reduce((phrase, part, index) => {
      if (index === 0) return part;
      return `${phrase}${generatedSeparators[index - 1] ?? separatorInput.value}${part}`;
    }, "");
    passphrase.lang = activeView === "romanized" ? "en-Latn" : "bg";
    passphrase.classList.remove("is-loading");
    copyButton.disabled = chosenWords.length === 0;
    copyButton.querySelector("span").textContent = "Copy";
  }

  function randomNumber() {
    const requestedLength = advancedOptions.open ? Number(numberLengthInput.value) : 2;
    if (!Number.isInteger(requestedLength) || requestedLength < 1 || requestedLength > 12) {
      throw new Error("Choose a random number length from 1 to 12 digits.");
    }
    const firstDigit = String(1 + secureIndex(9));
    const remainingDigits = Array.from(
      { length: requestedLength - 1 },
      () => String(secureIndex(10))
    );
    return firstDigit + remainingDigits.join("");
  }

  function refreshGeneratedSeparators() {
    const partCount = chosenWords.length + (generatedNumber ? 1 : 0);
    const separatorCount = Math.max(0, partCount - 1);
    if (advancedOptions.open) {
      const characters = Array.from(separatorCharactersInput.value);
      if (characters.length === 0 && separatorCount > 0) {
        throw new Error("Add at least one character to the random separator list.");
      }
      generatedSeparators = Array.from(
        { length: separatorCount },
        () => characters[secureIndex(characters.length)]
      );
      return;
    }
    generatedSeparators = Array(separatorCount).fill(separatorInput.value);
  }

  function updateNumberNote() {
    if (!advancedOptions.open) {
      numberOptionNote.textContent = "Two digits, from 10 to 99";
      return;
    }
    const digits = Number(numberLengthInput.value);
    numberOptionNote.textContent = Number.isInteger(digits) && digits >= 1 && digits <= 12
      ? `${digits} ${digits === 1 ? "digit" : "digits"}`
      : "Choose 1–12 digits";
  }

  function restorePreferences() {
    let serialized;
    try {
      serialized = localStorage.getItem(preferencesKey);
    } catch {
      preferenceStorageUnavailable = true;
      return;
    }
    if (!serialized) return;

    try {
      const saved = JSON.parse(serialized);
      if (!saved || typeof saved !== "object") return;

      const wordCount = Number(saved.wordCount);
      if (Number.isInteger(wordCount) && wordCount >= 2 && wordCount <= 8) {
        wordCountInput.value = String(wordCount);
        wordCountValue.value = String(wordCount);
        wordCountChip.textContent = `${wordCount} ${wordCount === 1 ? "word" : "words"}`;
      }
      if (["-", " ", ".", "_", "!"].includes(saved.separator)) {
        separatorInput.value = saved.separator;
      }
      if (typeof saved.includeNumber === "boolean") {
        includeNumberInput.checked = saved.includeNumber;
      }
      const numberLength = Number(saved.numberLength);
      if (Number.isInteger(numberLength) && numberLength >= 1 && numberLength <= 12) {
        numberLengthInput.value = String(numberLength);
      }
      if (
        typeof saved.separatorCharacters === "string" &&
        Array.from(saved.separatorCharacters).length <= 256
      ) {
        separatorCharactersInput.value = saved.separatorCharacters;
      }
      if (["title", "lower", "first", "upper"].includes(saved.capitalization)) {
        capitalizationInput.value = saved.capitalization;
      }
      if (typeof saved.advancedOpen === "boolean") {
        advancedOptions.open = saved.advancedOpen;
      }
      if (saved.view === "cyrillic" || saved.view === "romanized") {
        activeView = saved.view;
      }
      syncViewTabs();
      updateNumberNote();
    } catch {
      // Ignore malformed or outdated preferences and use the app defaults.
    }
  }

  function savePreferences() {
    const settings = {
      wordCount: Number(wordCountInput.value),
      separator: separatorInput.value,
      includeNumber: includeNumberInput.checked,
      numberLength: numberLengthInput.value,
      separatorCharacters: separatorCharactersInput.value,
      capitalization: capitalizationInput.value,
      advancedOpen: advancedOptions.open,
      view: activeView,
    };
    try {
      localStorage.setItem(preferencesKey, JSON.stringify(settings));
      preferenceStorageUnavailable = false;
      if (statusMessage.textContent === storageWarning) {
        statusMessage.textContent = "";
        statusMessage.classList.remove("is-error");
      }
    } catch {
      preferenceStorageUnavailable = true;
      statusMessage.textContent = storageWarning;
      statusMessage.classList.add("is-error");
    }
  }

  function generate() {
    if (words.length === 0) return;
    try {
      const count = Number(wordCountInput.value);
      chosenWords = Array.from({ length: count }, () => words[secureIndex(words.length)]);
      generatedNumber = includeNumberInput.checked
        ? randomNumber()
        : "";
      refreshGeneratedSeparators();
      wordCountValue.value = String(count);
      wordCountChip.textContent = `${count} ${count === 1 ? "word" : "words"}`;
      renderPassphrase();
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
    } catch (error) {
      chosenWords = [];
      generatedNumber = "";
      generatedSeparators = [];
      passphrase.classList.remove("is-loading");
      passphrase.textContent = "Unable to generate";
      copyButton.disabled = true;
      statusMessage.textContent = error.message;
      statusMessage.classList.add("is-error");
    }
  }

  function updateRandomNumber() {
    if (chosenWords.length === 0) return;
    try {
      generatedNumber = includeNumberInput.checked
        ? randomNumber()
        : "";
      refreshGeneratedSeparators();
      renderPassphrase();
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
    } catch (error) {
      generatedNumber = "";
      generatedSeparators = [];
      passphrase.classList.remove("is-loading");
      passphrase.textContent = "Unable to generate";
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
      if (preferenceStorageUnavailable) {
        statusMessage.textContent = storageWarning;
        statusMessage.classList.add("is-error");
      }
    } catch (error) {
      passphrase.classList.remove("is-loading");
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
    syncViewTabs();
    if (focus) tab.focus();
    renderPassphrase();
    passphrase.classList.remove("is-switching");
    window.clearTimeout(switchTimer);
    requestAnimationFrame(() => passphrase.classList.add("is-switching"));
    switchTimer = window.setTimeout(() => passphrase.classList.remove("is-switching"), 180);
    savePreferences();
  }

  function syncViewTabs() {
    rulesLink.hidden = activeView !== "romanized";
    tabs.forEach((item) => {
      const selected = item.dataset.view === activeView;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    passphrasePanel.setAttribute("aria-labelledby", activeView === "romanized" ? "romanized-tab" : "cyrillic-tab");
  }

  function syncSeparatorMode() {
    const randomMode = advancedOptions.open;
    separatorInput.disabled = randomMode;
    separatorInput.setAttribute("aria-disabled", String(randomMode));
    separatorModeNote.textContent = randomMode
      ? "Random characters in Advanced options are active."
      : "Fixed between each word.";
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

  wordCountInput.addEventListener("input", () => {
    generate();
    savePreferences();
  });
  separatorInput.addEventListener("change", () => {
    try {
      refreshGeneratedSeparators();
      renderPassphrase();
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
    } catch (error) {
      statusMessage.textContent = error.message;
      statusMessage.classList.add("is-error");
    }
    savePreferences();
  });
  includeNumberInput.addEventListener("change", () => {
    updateRandomNumber();
    savePreferences();
  });
  numberLengthInput.addEventListener("input", () => {
    updateNumberNote();
    if (includeNumberInput.checked && advancedOptions.open) updateRandomNumber();
    savePreferences();
  });
  separatorCharactersInput.addEventListener("input", () => {
    if (advancedOptions.open) {
      try {
        refreshGeneratedSeparators();
        renderPassphrase();
        statusMessage.textContent = "";
        statusMessage.classList.remove("is-error");
      } catch (error) {
        statusMessage.textContent = error.message;
        statusMessage.classList.add("is-error");
      }
    }
    savePreferences();
  });
  capitalizationInput.addEventListener("change", () => {
    renderPassphrase();
    savePreferences();
  });
  advancedOptions.addEventListener("toggle", () => {
    syncSeparatorMode();
    updateNumberNote();
    if (includeNumberInput.checked) updateRandomNumber();
    else {
      try {
        refreshGeneratedSeparators();
        renderPassphrase();
      } catch (error) {
        statusMessage.textContent = error.message;
        statusMessage.classList.add("is-error");
      }
    }
    savePreferences();
  });
  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", copyCurrentPhrase);

  restorePreferences();
  syncSeparatorMode();
  loadDictionary();
})();
