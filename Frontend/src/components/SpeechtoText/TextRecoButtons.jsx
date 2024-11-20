import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
//Voice Recognition Logic
// TextRecognition Component (Speech-to-Text)
const TextRecognition = ({ setPQRData, updateField }) => {
  const handleSpeechToText = (updater) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      updater(speechToText);
    };
    recognition.start();
  };

  return (
    <button
      onClick={() =>
        handleSpeechToText((text) => setPQRData({ [updateField]: text }))
      }
      className="rounded-full border p-2 mr-3 bg-slate-100 hover:bg-slate-200"
      style={{
        position: "absolute",
        right: "35px",
        top: "68%",
        transform: "translateY(-50%)",
      }}
    >
      <FaMicrophone />
    </button>
  );
};

// SpeechtoText Component (Text-to-Speech)
const SpeechtoText = ({ pQRData, updateField }) => {
  const handleTextToSpeech = (text) => {
    const voices = window.speechSynthesis.getVoices();
    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = voices[0];
    window.speechSynthesis.speak(speech);
  };

  return (
    <button
      onClick={() => handleTextToSpeech(pQRData[updateField])}
      className="rounded-full border p-2 bg-slate-100 hover:bg-slate-200"
      style={{
        position: "absolute",
        right: "5px",
        top: "68%",
        transform: "translateY(-50%)",
      }}
    >
      <AiFillSound />
    </button>
  );
};

export { TextRecognition, SpeechtoText };
