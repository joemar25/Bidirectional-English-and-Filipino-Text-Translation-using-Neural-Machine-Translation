const fromLanguageSelect = document.getElementById('from-language');
const toLanguageSelect = document.getElementById('to-language');
const translateButton = document.getElementById('translate-button');
const fromTextArea = document.getElementById('from-text');
const toTextArea = document.getElementById('to-text');

function toggleLanguages() {
    const fromLanguageSelect = document.getElementById('from-language');
    const toLanguageSelect = document.getElementById('to-language');
    const fromLanguage = fromLanguageSelect.value;
    const toLanguage = toLanguageSelect.value;

    // Swap the selected languages
    fromLanguageSelect.value = toLanguage;
    toLanguageSelect.value = fromLanguage;
}

// Translate the text when the translateButton is clicked
translateButton.addEventListener('click', () => {
    const fromLanguage = fromLanguageSelect.value;
    const toLanguage = toLanguageSelect.value;
    const textToTranslate = fromTextArea.value;

    fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fromLanguage,
            toLanguage,
            textToTranslate
        })
    })
        .then(response => response.json())
        .then(data => {
            // Update the toTextArea element with the translated text
            toTextArea.value = data.translatedText;
        })
        .catch(error => console.error(error));
});