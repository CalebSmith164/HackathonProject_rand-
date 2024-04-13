import React, {useEffect} from 'react';
import './App.css';
import { useState } from 'react';
import imageToAdd from "./logo.png";

function getUserID() {
  // Key to store/retrieve the user ID
  const USER_ID_KEY = 'userId';

  // Try to retrieve the user ID from local storage
  let userId = localStorage.getItem(USER_ID_KEY);

  // Check if a user ID was found
  if (!userId) {
      // Generate a new unique user ID
      userId = generateUniqueId();

      // Store the new user ID in local storage
      localStorage.setItem(USER_ID_KEY, userId);
  }

  // Return the user ID
  return userId;
}

function generateUniqueId() {
  // Generate a pseudo-random unique identifier
  return 'uid_' + Math.random().toString(36).substr(2, 9);
}

interface ReadAlongProps {
  text: string;           // Specify that `text` should be a string
  baseInterval?: number;
}

const ReadAlong: React.FC<ReadAlongProps> = ({ text, baseInterval = 1000 }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || []; // Split text into sentences
  const words = sentences[currentSentenceIndex]?.split(/\s+/) || [];

  useEffect(() => {
    if (sentences.length === 0) {
      setIsFinished(true);
      return;
    }

    const handleWordRead = () => {
      if (currentWordIndex + 1 < words.length) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else if (currentSentenceIndex + 1 < sentences.length) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setCurrentWordIndex(0);
      } else {
        setIsFinished(true);
      }
    };

    const currentWord = words[currentWordIndex];
    const containsPunctuation = /[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(currentWord);
    const interval = containsPunctuation ? baseInterval + 300 : baseInterval;

    const timer = setTimeout(handleWordRead, interval);

    return () => clearTimeout(timer);
  }, [currentSentenceIndex, currentWordIndex, words, sentences, baseInterval]);

  if (isFinished) {
    return <p> </p>;
  } else {
    return (
      <p>
        {words.map((word, index) => (
          <span key={index} className={index === currentWordIndex ? 'Active-Text' : 'Static-Text'}>
            {word + ' '}
          </span>
        ))}
      </p>
    );
  }
};

function App() {
  let texts: string = "Welcome to the treadmill! Directly in front of you, you will find the safety clip. Please clip it onto your shirt now for your own safety. To the left of the clip, you will find the start button. To the right of the clip, you will find the stop button. Please find the metal grasps on the handles to your left and right. These will measure your heart rate. In front of the left heart rate sensor are the buttons for increasing and decreasing the incline. In front of the right heart rate sensor are the buttons for increasing and decreasing the speed. Please alert a member of staff if you have any issues. Have a good workout!";
  useEffect(()=>{
    console.log("Hi");
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = "Welcome to the treadmill! Directly in front of you, you will find the safety clip. Please clip it onto your shirt now for your own safety. To the left of the clip, you will find the start button. To the right of the clip, you will find the stop button. Please find the metal grasps on the handles to your left and right. These will measure your heart rate. In front of the left heart rate sensor are the buttons for increasing and decreasing the incline. In front of the right heart rate sensor are the buttons for increasing and decreasing the speed. Please alert a member of staff if you have any issues. Have a good workout!";
    msg.voice = voices[1];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }, [])

  return (
    <div className="App">
      <div className="App-header">
        <img src={imageToAdd} alt="Image" className="App-logo"/>
        EZ Repz
      </div>
      <div className="App-body">
        <ReadAlong text={texts} baseInterval={250}/>
      </div>
    </div>
  );
}

export default App;
