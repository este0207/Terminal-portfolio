import { getState, setUsername, setTheme } from './store';

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string | Promise<string>;
}

const commands: Record<string, Command> = {};

// Helper function to register commands
const registerCommand = (command: Command) => {
  commands[command.name] = command;
};

const availableThemes = ['dark', 'light', 'ubuntu', 'dracula', 'solarized-light', 'solarized-dark', 'monokai', 'github-light', 'github-dark', 'nord'];

// Help command
registerCommand({
  name: 'help',
  description: 'Shows this help menu.',
  execute: () => {
    let helpText = 'Terminal Help Menu:\n\n';

    const generalCommands = [
      'about', 'projects', 'contact', 'social', 'help'
    ];
    const customizationCommands = [
      'theme', 'set', 'username'
    ];
    const utilityCommands = [
      'date', 'time', 'clear'
    ];

    const formatCommands = (cmds: string[], title: string) => {
      let section = `${title}\n\n`;
      const maxLength = Math.max(...cmds.map(cmd => commands[cmd] ? commands[cmd].name.length : 0));
      cmds.forEach(cmdName => {
        const cmd = commands[cmdName];
        if (cmd) {
          const padding = ' '.repeat(maxLength - cmd.name.length + 4);
          section += `${cmd.name}${padding}- ${cmd.description}\n\n`;
        }
      });
      return section;
    };

    helpText += formatCommands(generalCommands, 'General Commands');
    helpText += formatCommands(customizationCommands, 'Customization');
    helpText += formatCommands(utilityCommands, 'Fun & Utility');

    helpText += '\nTip: Use Tab for auto-completion and arrow keys to navigate command history.';

    return helpText;
  },
});

// About command
registerCommand({
    name: 'about',
    description: 'Displays information about me.',
    execute: () => 'Développeur web de 20 ans, passionné par la création de sites modernes et fonctionnels. Après un Bac+2 incluant une année en MMi et deux ans à l’école de programmation La Plateforme à Toulon, j’ai acquis des compétences solides en développement front-end et back-end. Curieux et rigoureux, je suis toujours à la recherche de nouveaux défis pour concevoir des solutions web performantes et sur mesure.',
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
    execute: () => 'Email: esteban.h0207@gmail.com',
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

// Clear command
registerCommand({
    name: 'clear',
    description: 'Clears the terminal screen.',
    execute: () => {
        return '';
    },
});

// Username command
registerCommand({
  name: 'username',
  description: 'Displays the current username.',
  execute: () => `Current username is: ${getState().username}`,
});

// Theme command
registerCommand({
  name: 'theme',
  description: `Lists available themes. Current theme: ${getState().theme}`,
  execute: () => {
    return `Available themes: ${availableThemes.join(', ')}`;
  },
});




// Set command
registerCommand({
  name: 'set',
  description: 'Sets a new value for a property. Usage: set <property> <value>',
  execute: (args: string[]) => {
    const [property, ...value] = args;
    const joinedValue = value.join(' ');

    if (!property) {
      return 'Usage: set <property> <value>. Available properties: username, theme';
    }

    switch (property.toLowerCase()) {
      case 'username':
        if (!joinedValue) {
          return 'Usage: set username <new_username>';
        }
        setUsername(joinedValue);
        return `Username set to: ${joinedValue}`;
      case 'theme':
        if (!joinedValue) {
          return `Usage: set theme <theme_name>. Available themes: ${availableThemes.join(', ')}`;
        }
        if (!availableThemes.includes(joinedValue.toLowerCase())) {
            return `Theme not found. Available themes: ${availableThemes.join(', ')}`;
        }
        setTheme(joinedValue.toLowerCase());
        return `Theme set to: ${joinedValue}`;
      default:
        return `Unknown property: ${property}`;
    }
  },
});


export const executeCommand = async (input: string): Promise<string> => {
  const [commandName, ...args] = input.trim().toLowerCase().split(/\s+/);
  const command = commands[commandName];

  if (command) {
    try {
      const result = await command.execute(args);
      return result;
    } catch (error: any) {
      return `Error executing command: ${error.message || error}`;
    }
  } else {
    return `command not found: ${commandName}`;
  }
};

export const commandList = Object.keys(commands);
