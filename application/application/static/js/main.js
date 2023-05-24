const fromText = document.querySelector('.from-text');
const arrowIcon = document.querySelector('.fa-arrow-right-arrow-left');
const fromSelect = document.querySelector('.row.form select');
const toSelect = document.querySelector('.row.to select');
toText = document.querySelector('.to-text');
selectTags = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
const translateBtn = document.getElementById("translateBtn");


languages = {
    en: 'English',
    fil: 'Filipino',
};

selectTags.forEach((tag, id) => {
    for (let language_code in languages) {
        let selected = id == 0 ? language_code == "en" ? "selected" : "" : language_code == "fil" ? "selected" : "";
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
    if(!fromText.value) {
        toText.value = "";
    }
});

$('#translateBtn').click(function(){
    $('#translateBtn').click(function() {
        var sourceText = $('.from-text').val();
        var sourceLang = $('.form select').val();
        var targetLang = $('.to select').val();
        
        $.ajax({
          url: '/translate',
          type: 'POST',
          data: {sourceText: sourceText, sourceLang: sourceLang, targetLang: targetLang},
          success: function(data) {
            $('.to-text').val(data.translatedText);
          }
        });
      });
    });


$(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 20)
            $(".navbar").addClass("sticky");
        else
            $(".navbar").removeClass("sticky");
    });
});
