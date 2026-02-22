import { useState, useEffect } from "react";
import TextDisplay from "./component/TextDisplay.jsx";
import TypingArea from "./component/TypingArea.jsx";
import Result from "./component/Result.jsx";
import "./App.css";

const REFERENCE_TEXT =
  "Effective communication is the lifeblood of teamwork, the channel through which ideas flow, feedback is given, and conflicts are resolved. Open, honest, and respectful communication fosters understanding, builds trust, and promotes collaboration. It allows team members to share their perspectives, clarify expectations, and coordinate their efforts towards a common goal. When communication breaks down, misunderstandings arise, conflicts escalate, and progress stalls. By fostering a culture of open communication, teams can create a positive and productive work environment where everyone feels heard and valued.";

function App() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (startTime && !isFinished) {
      timer = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  
  
  const handleChange = (value) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    if (value.length <= REFERENCE_TEXT.length) {
      setInput(value);
    }
    
    if (value === REFERENCE_TEXT) {
      setIsFinished(true);
    }
  };
  
  const calculateResults = () => {
    const minutes = timeElapsed / 60;
    const charactersTyped = input.length;
    const wpm = minutes > 0 ? ((charactersTyped / 5) / minutes).toFixed(2) : 0;
    
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === REFERENCE_TEXT[i]) {
        correctChars++;
      }
    }
    
    const accuracy =
    charactersTyped > 0
    ? ((correctChars / charactersTyped) * 100).toFixed(2)
    : 0;
    
    return { wpm, accuracy };
  };
  
  const restartTest = () => {
    setInput("");
    setStartTime(null);
    setTimeElapsed(0);
    setIsFinished(false);
  };
  
  const hasError = input.split("").some(
    (char, index) => char !== REFERENCE_TEXT[index]
  );


  return (
    <div className="app">
      <h1>Typing Speed Test</h1>

      {startTime && !isFinished && (
        <div className="timer">
          ⏱ Time: {timeElapsed.toFixed(2)} seconds
        </div>
      )}



      <TextDisplay text={REFERENCE_TEXT} userInput={input} />

      {startTime && (
        <div className={`status-light ${hasError ? "red" : "green"}`}>
          {hasError ? "🔴 Error detected" : "🟢 Typing correctly"}
        </div>
      )}


      <TypingArea
        value={input}
        onChange={handleChange}
        disabled={isFinished}
      />

      {isFinished && (
        <Result
          time={timeElapsed.toFixed(2)}
          {...calculateResults()}
          onRestart={restartTest}
        />
      )}
    </div>
  );
}

export default App;
