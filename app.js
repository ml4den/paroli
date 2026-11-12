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
  const separatorModes = [...document.querySelectorAll('[name="separator-mode"]')];
  const fixedSeparatorControl = document.querySelector("#fixed-separator-control");
  const randomSeparatorControl = document.querySelector("#random-separator-control");
  const numberLengthControl = document.querySelector("#number-length-control");
  const capitalizationSummary = document.querySelector("#capitalization-summary");
  const includeNumberInput = document.querySelector("#include-number");
  const numberLengthInput = document.querySelector("#number-length");
  const numberOptionNote = document.querySelector("#number-option-note");
  const separatorCharactersInput = document.querySelector("#separator-characters");
  const capitalizationInput = document.querySelector("#capitalization");
  const advancedOptions = document.querySelector(".advanced-options");
  const passphrase = document.querySelector("#passphrase");
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
  let separatorMode = "fixed";
  let generationError = "";
  let preferenceStorageUnavailable = false;
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
    themeColor.content = theme === "dark" ? "#111813" : "#f5f3ed";
  }

  themeToggle.addEventListener("click", () => {
    if (themeMode === "system") {
      themeMode = themeMedia.matches ? "light" : "dark";
    } else {
      themeMode = themeMode === "light" ? "dark" : "system";
    }
    try {
      localStorage.setItem("bulgarian-passphrase-theme", themeMode);
    } catch {
      preferenceStorageUnavailable = true;
      showStatus();
    }
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
    if (generationError || chosenWords.length === 0) {
      if (generationError) passphrase.textContent = "Unable to generate";
      copyButton.disabled = true;
      return;
    }
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
    copyButton.disabled = chosenWords.length === 0;
    copyButton.querySelector("span").textContent = "Copy";
  }

  function validNumberLength(value) {
    return (typeof value === "number" || typeof value === "string") &&
      String(value).trim() !== "" &&
      Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 12;
  }

  function validateSettings() {
    const invalidLength = includeNumberInput.checked && !validNumberLength(numberLengthInput.value);
    const emptyPool = separatorMode === "random" && Array.from(separatorCharactersInput.value).length === 0;
    numberLengthInput.setAttribute("aria-invalid", String(invalidLength));
    separatorCharactersInput.setAttribute("aria-invalid", String(emptyPool));
    if (invalidLength) {
      throw new Error("Choose a random number length from 1 to 12 digits.");
    }
    if (emptyPool) {
      throw new Error("Add at least one character to the random separator list.");
    }
  }

  function randomNumber() {
    const requestedLength = Number(numberLengthInput.value);
    const firstDigit = String(1 + secureIndex(9));
    const remainingDigits = Array.from(
      { length: requestedLength - 1 },
      () => String(secureIndex(10))
    );
    return firstDigit + remainingDigits.join("");
  }

  function refreshGeneratedSeparators() {
    validateSettings();
    // Recover coherently if another active setting was corrected after an error.
    if (!includeNumberInput.checked) generatedNumber = "";
    else if (generatedNumber.length !== Number(numberLengthInput.value)) generatedNumber = randomNumber();
    const partCount = chosenWords.length + (generatedNumber ? 1 : 0);
    const separatorCount = Math.max(0, partCount - 1);
    if (separatorMode === "random") {
      const characters = Array.from(separatorCharactersInput.value);
      generatedSeparators = Array.from(
        { length: separatorCount },
        () => characters[secureIndex(characters.length)]
      );
      return;
    }
    generatedSeparators = Array(separatorCount).fill(separatorInput.value);
  }

  function updateNumberNote() {
    const digits = Number(numberLengthInput.value);
    numberOptionNote.textContent = Number.isInteger(digits) && digits >= 1 && digits <= 12
      ? `${digits} ${digits === 1 ? "digit" : "digits"}`
      : "Choose 1–12 digits";
  }

  function syncSettingsControls() {
    fixedSeparatorControl.hidden = separatorMode !== "fixed";
    separatorInput.disabled = separatorMode !== "fixed";
    randomSeparatorControl.hidden = separatorMode !== "random";
    separatorCharactersInput.disabled = separatorMode !== "random";
    separatorModes.forEach((input) => { input.checked = input.value === separatorMode; });
    numberLengthControl.hidden = !includeNumberInput.checked;
    numberLengthInput.disabled = !includeNumberInput.checked;
    capitalizationSummary.textContent = capitalizationInput.selectedOptions[0].textContent;
    updateNumberNote();
  }

  function showStatus(message = "", isError = false) {
    statusMessage.textContent = message + (preferenceStorageUnavailable
      ? `${message ? " " : ""}${storageWarning}` : "");
    statusMessage.classList.toggle("is-error", isError || preferenceStorageUnavailable);
  }

  function showGenerationError(error) {
    generationError = error.message;
    renderPassphrase();
    showStatus(generationError, true);
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
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;

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
      numberLengthInput.value = validNumberLength(saved.numberLength)
        ? String(Number(saved.numberLength)) : "2";
      if (
        typeof saved.separatorCharacters === "string" &&
        Array.from(saved.separatorCharacters).length <= 256
      ) {
        separatorCharactersInput.value = saved.separatorCharacters;
      }
      if (["title", "lower", "first", "upper"].includes(saved.capitalization)) {
        capitalizationInput.value = saved.capitalization;
      }
      separatorMode = ["fixed", "random"].includes(saved.separatorMode)
        ? saved.separatorMode : (saved.advancedOpen === true ? "random" : "fixed");
      advancedOptions.open = saved.moreOptionsOpen === true;
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
      separatorMode,
      moreOptionsOpen: advancedOptions.open,
      view: activeView,
    };
    try {
      localStorage.setItem(preferencesKey, JSON.stringify(settings));
      preferenceStorageUnavailable = false;
      showStatus(generationError, Boolean(generationError));
    } catch {
      preferenceStorageUnavailable = true;
      showStatus(generationError, Boolean(generationError));
    }
  }

  function generate() {
    if (words.length === 0) return;
    try {
      const count = Number(wordCountInput.value);
      validateSettings();
      chosenWords = Array.from({ length: count }, () => words[secureIndex(words.length)]);
      generatedNumber = includeNumberInput.checked
        ? randomNumber()
        : "";
      refreshGeneratedSeparators();
      generationError = "";
      wordCountValue.value = String(count);
      wordCountChip.textContent = `${count} ${count === 1 ? "word" : "words"}`;
      renderPassphrase();
      showStatus();
    } catch (error) {
      showGenerationError(error);
    }
  }

  function updateRandomNumber() {
    if (chosenWords.length !== Number(wordCountInput.value)) {
      generate();
      return;
    }
    try {
      validateSettings();
      generatedNumber = includeNumberInput.checked
        ? randomNumber()
        : "";
      refreshGeneratedSeparators();
      generationError = "";
      renderPassphrase();
      showStatus();
    } catch (error) {
      showGenerationError(error);
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
    if (!chosenWords.length || generationError) return;
    try {
      await navigator.clipboard.writeText(passphrase.textContent);
      copyButton.querySelector("span").textContent = "Copied";
      showStatus("Passphrase copied to clipboard.");
    } catch {
      showStatus("Clipboard access is unavailable in this browser.", true);
    }
  }

  function selectView(tab, focus = false) {
    activeView = tab.dataset.view;
    syncViewTabs();
    if (focus) tab.focus();
    renderPassphrase();
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
  function updateSeparators() {
    if (chosenWords.length !== Number(wordCountInput.value)) {
      generate();
      return;
    }
    try {
      refreshGeneratedSeparators();
      generationError = "";
      renderPassphrase();
      showStatus();
    } catch (error) {
      showGenerationError(error);
    }
  }
  separatorModes.forEach((input) => input.addEventListener("change", () => {
    separatorMode = input.value;
    syncSettingsControls();
    updateSeparators();
    savePreferences();
  }));
  separatorInput.addEventListener("change", () => {
    if (separatorMode === "fixed") updateSeparators();
    savePreferences();
  });
  includeNumberInput.addEventListener("change", () => {
    syncSettingsControls();
    updateRandomNumber();
    savePreferences();
  });
  numberLengthInput.addEventListener("input", () => {
    updateNumberNote();
    if (includeNumberInput.checked) updateRandomNumber();
    savePreferences();
  });
  separatorCharactersInput.addEventListener("input", () => {
    if (separatorMode === "random") updateSeparators();
    savePreferences();
  });
  capitalizationInput.addEventListener("change", () => {
    syncSettingsControls();
    renderPassphrase();
    savePreferences();
  });
  advancedOptions.addEventListener("toggle", () => {
    savePreferences();
  });
  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", copyCurrentPhrase);

  restorePreferences();
  syncSettingsControls();
  // Persist the migrated explicit mode so the legacy disclosure no longer controls it.
  savePreferences();
  loadDictionary();
})();
