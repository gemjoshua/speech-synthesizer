// alert('Hello World');
// speechSynthesis api
const synth = window.speechSynthesis;
// get DOM element
const textForm = document.querySelector("#getTextForm");
const text = document.getElementById("text");
const pitch = document.getElementById("pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.getElementById("rate");
const rateValue = document.querySelector(".rate-value");
const selectVoice = document.querySelector("#selectVoice");
const btn_submit = document.getElementById("btn-submit");
const Animated = document.querySelector(".animated");

/*
========================================
GET AVAILABLE VOICES AND POPULATED THE SELECT OPTION
========================================
*/
const getVoices = () => {
  // get list of voices
  const voiceLists = synth.getVoices();
  voiceLists.forEach((voice) => {
    // create option element;
    let value = `${voice.name}${voice.lang}`;
    const option = document.createElement("option");
    option.textContent = value;
    // set data and lang attr on option
    option.setAttribute("data-length", voice.lang);
    option.setAttribute("data-name", voice.name);
    option.setAttribute("value", value);
    selectVoice.appendChild(option);
  });
};

// check for onvoicesChange event;
if (synth.onvoiceschanged !== "undefined") {
  synth.onvoiceschanged = getVoices;
}
// you need to invoke the function  again,
// so it works on firefox
getVoices();

/*
==============================
CALLED UTTER SPEACH IF ANY
==============================
*/
textForm.addEventListener("submit", (e) => {
  // prevent default behaviour;
  e.preventDefault();
  // validate text field
  if (!text.value) {
    return alert("Can't Speak, Text Field Is Empty");
  }

  // create instance of speechUtterance;
  const speechUtterance = new SpeechSynthesisUtterance(text.value);

  const selectedOption =
    selectVoice.selectedOptions[0].getAttribute("data-name");

  // loop on voice list
  const voices = synth.getVoices();
  const isMatch = voices.filter((voice) => voice.name == selectedOption);

  speechUtterance.voice = isMatch[0];

  // console.log(speechUtterance.voice);
  /*
  =========================
  FIRES WHILE SPEAKING
  =========================
  */
  speechUtterance.onstart = () => {
    console.log("speaking");
    btn_submit.innerText = "Speaking...";
    Animated.classList.remove("hidden");
    rate.setAttribute("disabled", "disabled");
    pitch.setAttribute("disabled", "disabled");
    text.setAttribute("disabled", "disabled");
    btn_submit.setAttribute("disabled", "disabled");
    selectVoice.setAttribute("disabled", "disabled");
  };

  /*
===========================
CALLED IF DONE SPEAKING
==========================
  */
  // speak ends
  speechUtterance.onend = () => {
    Animated.classList.add("hidden");
    console.log("done speaking");
    text.removeAttribute("disabled", "disabled");
    pitch.removeAttribute("disabled", "disabled");
    rate.removeAttribute("disabled", "disabled");
    btn_submit.removeAttribute("disabled", "disabled");
    selectVoice.removeAttribute("disabled", "disabled");
    btn_submit.innerText = "Speak";
  };

  // set pitch and rate
  speechUtterance.pitch = pitch.value;
  speechUtterance.rate = rate.value;
  // speak
  synth.speak(speechUtterance);
  speechUtterance.onerror = (err) => {
    alert("Something went wrong:\n", err.message);
  };
});

/*
=====================
INIT PITCH VALUE
=====================
*/
const trackPitchValue = () => {
  pitchValue.innerText = pitch.value;
};

const trackRateValue = () => {
  rateValue.innerText = rate.value;
};
// invoke pitch&rate tracker
trackPitchValue();
trackRateValue();

/*
============================
UPDATE PITCH VALUE
============================
*/
pitch.addEventListener("change", (e) => {
  pitchValue.innerText = e.target.value;
});

rate.addEventListener("change", (e) => {
  rateValue.innerText = e.target.value;
});
