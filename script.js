const micButton = document.getElementById("micButton");
const transcript = document.getElementById("transcript");
const language = document.getElementById("language");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  transcript.textContent =
    "Sorry, your browser does not support speech recognition.";
} else {
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  micButton.addEventListener("click", () => {
    const selectedLanguage = language.value;

    if (selectedLanguage === "german") {
      recognition.lang = "de-DE";
    } else if (selectedLanguage === "english") {
      recognition.lang = "en-US";
    } else if (selectedLanguage === "french") {
      recognition.lang = "fr-FR";
    } else if (selectedLanguage === "spanish") {
      recognition.lang = "es-ES";
    }

    transcript.textContent = "🎤 Listening...";

    recognition.start();
  });

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;

    transcript.textContent = spokenText;
    testBackend(spokenText);
  };

  recognition.onerror = (event) => {
    transcript.textContent = "❌ Error: " + event.error;
  };
}

async function testBackend(sentence) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/test?sentence=${encodeURIComponent(sentence)}`,
    );

    const data = await response.json();

    console.log("AI Feedback:", data.feedback);

    let feedbackBox = document.getElementById("feedback");

    if (!feedbackBox) {
      feedbackBox = document.createElement("p");
      feedbackBox.id = "feedback";
      document.body.appendChild(feedbackBox);
    }

    feedbackBox.textContent = data.feedback;
    speakText(data.feedback);
  } catch (error) {
    console.error("AI connection failed:", error);
  }
}

function speakText(text) {
  const speech = new SpeechSynthesisUtterance(text);

  speech.lang =
    language.value === "german"
      ? "de-DE"
      : language.value === "french"
        ? "fr-FR"
        : language.value === "spanish"
          ? "es-ES"
          : "en-US";

  speech.rate = 0.9;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

speakButton.addEventListener("click", () => {
  const text = feedback.textContent;

  if (text && text !== "AI feedback will appear here...") {
    speakText(text);
  }
});

testBackend();
