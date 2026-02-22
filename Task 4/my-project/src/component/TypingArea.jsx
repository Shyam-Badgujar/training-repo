

const TypingArea = ({ value, onChange, disabled }) => {
  return (
    <textarea
      className="typing-area"
      placeholder="Start typing here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default TypingArea;
