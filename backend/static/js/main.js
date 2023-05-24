const fromLanguageSelect = document.getElementById("from-language");
const toLanguageSelect = document.getElementById("to-language");
const fromTextArea = document.getElementById("from-text");
const toTextArea = document.getElementById("to-text");
const secondsElement = document.getElementById("seconds");
const toggleButton = document.getElementById("toggle-languages");

// Set the initial selected values for the language dropdowns
fromLanguageSelect.value = "en";
toLanguageSelect.value = "tl";

function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Add a change event listener to the fromLanguageSelect
fromLanguageSelect.addEventListener("change", () => {
  const fromLanguageValue = fromLanguageSelect.value;
  const toLanguageValue = toLanguageSelect.value;

  // If the toLanguage is the same as the fromLanguage, change the toLanguage
  if (fromLanguageValue === toLanguageValue) {
    toLanguageSelect.value = fromLanguageSelect.options[
      fromLanguageSelect.selectedIndex === 0 ? 1 : 0
    ].value;
  }
});

// Add a change event listener to the toLanguageSelect
toLanguageSelect.addEventListener("change", () => {
  const fromLanguageValue = fromLanguageSelect.value;
  const toLanguageValue = toLanguageSelect.value;

  // If the toLanguage is the same as the fromLanguage, change the fromLanguage
  if (fromLanguageValue === toLanguageValue) {
    fromLanguageSelect.value = toLanguageSelect.options[
      toLanguageSelect.selectedIndex === 0 ? 1 : 0
    ].value;
  }
});

// Add a click event listener to the toggle button
toggleButton.addEventListener("click", () => {
  const fromLanguageValue = fromLanguageSelect.value;
  const toLanguageValue = toLanguageSelect.value;

  // Swap the selected values
  fromLanguageSelect.value = toLanguageValue;
  toLanguageSelect.value = fromLanguageValue;

  // Swap the textarea values
  const temp = fromTextArea.value;
  fromTextArea.value = toTextArea.value;
  toTextArea.value = temp;
});

// Add an input event listener to the fromTextArea for automatic translation
fromTextArea.addEventListener(
  "input",
  throttle(() => {
    const fromLanguage = fromLanguageSelect.value;
    const toLanguage = toLanguageSelect.value;
    const textToTranslate = fromTextArea.value;

    if (textToTranslate === "") {
      toTextArea.value = "";
      return;
    }

    // Measure the start time
    const startTime = performance.now();

    fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromLanguage,
        toLanguage,
        textToTranslate,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toTextArea.value = data.translatedText;

        // Measure the end time and calculate the runtime
        const endTime = performance.now();
        const runtime = (endTime - startTime) / 1000;

        // Update the seconds element with the runtime
        secondsElement.textContent = `About (${runtime.toFixed(
          2
        )} seconds to translate)`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, 500)
);