import { getState, setUsername } from './store';

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string;
}

const commands: Record<string, Command> = {};

// Helper function to register commands
const registerCommand = (command: Command) => {
  commands[command.name] = command;
};

// Help command
registerCommand({
  name: 'help',
  description: 'Shows a list of available commands.',
  execute: () => {
    return 'Available commands:\n' + Object.values(commands).map(c => `  ${c.name}: ${c.description}`).join('\n');
  },
});

// About command
registerCommand({
    name: 'about',
    description: 'Displays information about me.',
    execute: () => 'This is a placeholder for your bio. You can edit this in src/commands.ts',
});

// Projects command
registerCommand({
    name: 'projects',
    description: 'Lists major professional & personal projects.',
    execute: () => 'Project 1: Terminal Portfolio\nProject 2: Coming soon...', 
});

// Social command
registerCommand({
    name: 'social',
    description: 'Displays my social media profiles.',
    execute: () => 'GitHub: \nLinkedIn: \nTwitter: ',
});

// Contact command
registerCommand({
    name: 'contact',
    description: 'Shows my contact information.',
    execute: () => 'Email: your.email@example.com',
});

// Date command
registerCommand({
    name: 'date',
    description: 'Displays the current date.',
    execute: () => new Date().toLocaleDateString(),
});

// Time command
registerCommand({
    name: 'time',
    description: 'Displays the current time.',
    execute: () => new Date().toLocaleTimeString(),
});

// Username command
registerCommand({
  name: 'username',
  description: 'Displays the current username.',
  execute: () => `Current username is: ${getState().username}`,
});

// Set command
registerCommand({
  name: 'set',
  description: 'Sets a new value for a property. Usage: set <property> <value>',
  execute: (args: string[]) => {
    const [property, ...value] = args;
    const joinedValue = value.join(' ');

    if (!property) {
      return 'Usage: set <property> <value>. Available properties: username';
    }

    switch (property.toLowerCase()) {
      case 'username':
        if (!joinedValue) {
          return 'Usage: set username <new_username>';
        }
        setUsername(joinedValue);
        return `Username set to: ${joinedValue}`;
      default:
        return `Unknown property: ${property}`;
    }
  },
});


export const executeCommand = (input: string): string => {
  const [commandName, ...args] = input.trim().toLowerCase().split(/\s+/);
  const command = commands[commandName];

  if (command) {
    return command.execute(args);
  } else {
    return `command not found: ${commandName}`;
  }
};
