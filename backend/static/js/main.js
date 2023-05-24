const fromText = document.querySelector('.from-text');
const arrowIcon = document.querySelector('.change');
const fromSelect = document.querySelector('.row.form select');
const toSelect = document.querySelector('.row.to select');
const toText = document.querySelector('.to-text');
const translateBtn = document.querySelector("button");
const selectTags = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");

const languages = {
  en: 'English',
  fil: 'Filipino',
};

selectTags.forEach((tag, id) => {
  for (let language_code in languages) {
    let selected = id === 0
      ? language_code === "en" ? "selected" : ""
      : language_code === "fil" ? "selected" : "";
    let option = `<option ${selected} value="${language_code}">${languages[language_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

arrowIcon.addEventListener('click', () => {
  const fromValue = fromSelect.value;
  const toValue = toSelect.value;
  fromSelect.value = toValue;
  toSelect.value = fromValue;

  const fromLanguage = fromSelect.options[fromSelect.selectedIndex].text;
  const toLanguage = toSelect.options[toSelect.selectedIndex].text;

  icons.forEach(icon => {
    icon.classList.toggle('fa-arrow-right-arrow-left');
    icon.classList.toggle('fa-arrow-left-arrow-right');
  });
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTags[0].value;
  let translateTo = selectTags[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  // Send the translation request to the FastAPI
  fetch("http://127.0.0.1:8080/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_text: text,
      output_language: translateTo,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Update the translation result
      toText.value = data.translation;
      toText.setAttribute("placeholder", "Translation");
    })
    .catch((error) => {
      console.error(error);
    });
});

$(document).ready(function () {
  $(window).scroll(function () {
    if (this.scrollY > 20)
      $(".navbar").addClass("sticky");
    else
      $(".navbar").removeClass("sticky");
  });
});
