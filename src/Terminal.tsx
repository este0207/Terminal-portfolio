import React, { useState, useEffect } from 'react';
import { executeCommand } from './commands';
import { useStore } from './useStore';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const { username } = useStore();
  const host = 'estebanh.me';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
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
      } else if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Enter') {
      const prompt = `${username}@${host}:~$`;
      const fullCommand = input.trim();

      if (fullCommand) {
        const newCommandHistory = [...commandHistory, fullCommand];
        setCommandHistory(newCommandHistory);
      }
      setHistoryIndex(-1);


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
    <div className="terminal">
      <div className="terminal-output">
        <p>Welcome to your Terminal Portfolio!</p>
        <p>Type 'help' to see available commands.</p>
        {history.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="terminal-input">
        <span className="prompt">{`${username}@${host}:~$`}</span>
        <input
          type="text"
          autoFocus
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    </div>
  );
};

export default Terminal;
