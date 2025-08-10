import React, { useState, useEffect, useRef } from 'react';
import { executeCommand, commandList } from './commands';
import { useStore } from './useStore';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { username, theme } = useStore();
  const host = 'estebanh.me';
  const promptRef = useRef<HTMLSpanElement>(null); 

  useEffect(() => {
    if (promptRef.current) {

      document.documentElement.style.setProperty(
        '--prompt-width',
        `${promptRef.current.offsetWidth}px`
      );
    }
  }, [username]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim()) {
      const filteredSuggestions = commandList.filter(cmd =>
        cmd.startsWith(value.trim().toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const currentInput = input.trim();
        const filteredSuggestions = commandList.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));
        if (filteredSuggestions.length === 1) {
            setInput(filteredSuggestions[0] + ' ');
            setSuggestions([]);
        }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'Enter') {
      const prompt = `${username}@${host}:~$`;
      const fullCommand = input.trim();

      if (fullCommand) {
        const newCommandHistory = [...commandHistory, fullCommand];
        setCommandHistory(newCommandHistory);
      }
      setHistoryIndex(-1);
      setSuggestions([]);


      if (fullCommand.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const newHistory = [...history, `${prompt} ${fullCommand}`];
      const output = executeCommand(fullCommand);
      const outputLines = output.split('\n');
      newHistory.push(...outputLines);

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="terminal" data-theme={theme}>
      <div className="terminal-output">
        <p>Welcome to my Terminal Portfolio!</p>
        <p>Type 'help' to see available commands.</p>
        {history.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="terminal-input">
        <span className="prompt" ref={promptRef}>{`${username}@${host}:~$`}</span>
        <input
          type="text"
          autoFocus
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <span key={i} className="suggestion-item">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Terminal;
