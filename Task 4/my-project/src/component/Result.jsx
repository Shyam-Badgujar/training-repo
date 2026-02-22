
const Result = ({ wpm, accuracy, time, onRestart }) => {
  return (
    <div className="result">
      <h2>Results</h2>
      <p><strong>Time Taken:</strong> {time} seconds</p>
      <p><strong>WPM:</strong> {wpm}</p>
      <p><strong>Accuracy:</strong> {accuracy}%</p>
      <button onClick={onRestart}>Restart Test</button>
    </div>
  );
};

export default Result;
