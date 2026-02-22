
const TextDisplay = ({ text, userInput }) => {
  return (
    <div className="text-display">
      {text.split("").map((char, index) => {
        let className = "";

        if (index < userInput.length) {
          if (char === userInput[index]) {
            className = "correct";
          } else {
            className = "incorrect";
          }
        }

        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default TextDisplay;
