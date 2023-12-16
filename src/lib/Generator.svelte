<script>
  import { onMount } from "svelte";
  let wordlist = [];

  onMount(async () => {
    const response = await fetch("./src/assets/wordlist.txt");
    const text = await response.text();
    wordlist = text.split(",");
    buildPassword();
  });

  let randomNum = (Math.floor(Math.random() * 90) + 10).toString();
  let wordCount = 2;
  let capitalizeFirstLetter = true;
  let dividers = "~!@#$%^&*()_-+={[}]|:'<,>.?/";

  const generateRandomNumber = () => {
    randomNum = (Math.floor(Math.random() * 90) + 10).toString();
  };

  const generateRandomWords = () => {
    let selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * wordlist.length);
      selectedWords.push(wordlist[randomIndex]);
    }
    console.log(selectedWords);
    
    if (capitalizeFirstLetter) {
      return selectedWords.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    } else {
      return selectedWords;
    }
    
  };

  let myWords = "";
  function buildPassword() {
    myWords = generateRandomWords().join(
      dividers[Math.floor(Math.random() * dividers.length)]
    );
    
    myWords += randomNum;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(myWords).then(
      () => {
        console.log("Password copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy password: ", err);
      }
    );
  }
</script>

<main>
  <div class="generated-password-container">
    <p class="generated-password">{myWords}</p>

    <button
      on:click={copyToClipboard}
      class="copy-icon-button"
      title="Copy to Clipboard"
    >
      <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  </div>

  <div class="number-generator-container">
    <form
      on:submit|preventDefault={buildPassword}
      class="number-generator-form"
    >
      <label for="sliderInput" class="number-generator-label">
        Брой думи:
        <input
          type="range"
          id="sliderInput"
          min="2"
          max="10"
          bind:value={wordCount}
          on:change={buildPassword}
          class="number-generator-slider"
        />
        <span class="character-counter">{wordCount} думи</span>
      </label>

      <label class="capitalize-checkbox">
        <input
          type="checkbox"
          bind:checked={capitalizeFirstLetter}
          on:change={buildPassword}
        />
        Главна първа буква
      </label>
      
      <label for="randomNumberInput" class="number-generator-label">
        Случайна цифра:
        <div class="flex">
          <input
            type="number"
            id="randomNumberInput"
            bind:value={randomNum}
            on:input={buildPassword}
            class="number-generator-input flex-grow"
          />
          <button
            on:click={generateRandomNumber}
            title="Refresh Random Number"
          >
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>
        <span class="character-counter">{randomNum.length} characters</span>
      </label>

      <label for="dividersInput" class="number-generator-label">
        Възможни разделители:
        <input
          type="text"
          id="dividersInput"
          bind:value={dividers}
          on:input={buildPassword}
          class="number-generator-input"
        />
        <span class="character-counter">{dividers.length} символа</span>
      </label>
    </form>
  </div>
</main>

<style>
  .number-generator-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .number-generator-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  .number-generator-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .capitalize-checkbox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .number-generator-button {
    padding: 0.5em 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f9f9f9;
    transition: background-color 0.3s ease;
  }

  .number-generator-button:hover {
    background-color: #efefef;
  }

  .number-generator-input {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 0.5rem;
    flex: 1;
  }

  .character-counter {
    font-size: 0.8rem;
    color: #666666;
  }

  .generated-password-container {
    margin-left: 28px;
  }
  .generated-password {
    background-color: #e9ecef;
    color: #495057;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .copy-icon-button {
    padding: 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.3s ease;
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .copy-icon-button:hover {
    background-color: #efefef;
  }

  .icon {
    height: 1em;
    width: auto;
  }

  @media (max-width: 600px) {
    .number-generator-label {
      width: 100%;
    }

    .number-generator-input {
      margin-right: 0;
      margin-bottom: 0.5rem;
    }
  }
</style>