function getWhoAmI() {
  return [
    `user Agent     : ${navigator.userAgent}`,
    `platform       : ${navigator.platform}`,
    `languages      : ${navigator.languages.join(', ')}`,
    `language       : ${navigator.language}`,
    `cpu threads    : ${navigator.hardwareConcurrency || 'Unknown'}`,
    `memory (gb)    : ${navigator.deviceMemory || 'Unknown'}`,
    `touch support  : ${'ontouchstart' in window ? 'Yes' : 'No'}`,
    `screen         : ${screen.width}x${screen.height} @ ${window.devicePixelRatio}x`,
    `available size : ${screen.availWidth}x${screen.availHeight}`,
    `timezone       : ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    `do not track   : ${navigator.doNotTrack}`,
    `cookies enabled : ${navigator.cookieEnabled}`,
    `online         : ${navigator.onLine ? 'Yes' : 'No'}`,
    `clipboard api  : ${'clipboard' in navigator ? 'Yes' : 'No'}`,
    `bluetooth api  : ${'bluetooth' in navigator ? 'Yes' : 'No'}`,
    `geolocation    : ${'geolocation' in navigator ? 'Yes' : 'No'}`,
    `webusb         : ${'usb' in navigator ? 'Yes' : 'No'}`,
    `speechsynthesis: ${'speechSynthesis' in window ? 'Yes' : 'No'}`,
  ].join('\n');
}


const terminal = document.getElementById('terminal');
const input = document.getElementById('cli-input');
const promptSpan = document.getElementById('prompt');

let pathStack = ['~'];
let currentIP = 'user';

// Fetch IP and initialize prompt
fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(data => {
    currentIP = data.ip;
    updatePrompt();
  });

// Prompt generator
function getPrompt() {
  const relativePath = '/' + pathStack.slice(1).join('/');
  return `${currentIP}@syzarn:${relativePath || '/'}` + '$';
}

function updatePrompt() {
  promptSpan.textContent = getPrompt();
}

// File system
const fileSystem = {
  'about': {
    type: 'folder',
    contents: {
      'bio.txt': {
        type: 'file',
        content: 'i am antar, a web developer passionate about building responsive and creative uis.'
      }
    }
  },
  'projects': {
    type: 'folder',
    contents: {
      'cli-ui.txt': {
        type: 'file',
        content: 'cli ui project: a portfolio styled like linux shell using html, css, and javascript.'
      },
      'ocr-engine.txt': {
        type: 'file',
        content: 'ocr project: bengali ocr system powered by python and ml.'
      }
    }
  },
  'contacts': {
    type: 'folder',
    contents: {
      'email.url': {
        type: 'file',
        content: 'mailto:you@example.com'
      },
      'linkedin.url': {
        type: 'file',
        content: 'https://linkedin.com/in/antar'
      },
      'github.url': {
        type: 'file',
        content: 'https://github.com/antar'
      }
    }
  },
  'cv.pdf': {
    type: 'file',
    content: ''
  }
};

// Path & directory resolution
function getCurrentDir() {
  let dir = fileSystem;
  for (let i = 1; i < pathStack.length; i++) {
    const segment = pathStack[i];
    if (dir[segment] && dir[segment].type === 'folder') {
      dir = dir[segment].contents;
    } else {
      return null;
    }
  }
  return dir;
}

function isInFile() {
  let dir = fileSystem;
  for (let i = 1; i < pathStack.length; i++) {
    const segment = pathStack[i];
    if (!dir[segment]) return false;
    if (dir[segment].type === 'folder') {
      dir = dir[segment].contents;
    } else if (i === pathStack.length - 1) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

// Format commands into Linux-style columns
function formatCommandsInColumns(cmdArray, columns = 3) {
  const longest = Math.max(...cmdArray.map(cmd => cmd.length));
  const padded = cmdArray.map(cmd => cmd.padEnd(longest + 4, ' '));
  const rows = Math.ceil(padded.length / columns);
  let result = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const i = c * rows + r;
      if (i < padded.length) result += padded[i];
    }
    result += '\n';
  }

  return result.trimEnd();
}

// Terminal output printer
function printOutput(text) {
  const outputDiv = document.createElement('div');
  outputDiv.className = 'output';
  outputDiv.textContent = text;
  terminal.insertBefore(outputDiv, input.parentElement);
}

// Command handler
function handleCommand(cmdLine) {
  const [command, ...args] = cmdLine.trim().split(' ');
  const arg = args.join(' ');
  const dir = getCurrentDir();

  if (isInFile()) {
    return `you are currently inside a file. use 'cd ..' to return.`;
  }

  switch (command) {
    case 'help': {
      const builtins = [
        'about',
        'cat',
        'cd',
        'clear',
        'exit',
        'help',
        'ls',
        'whoami'
      ];

      if (!arg) {
        return `syzarn shell v1.0 - antar’s cli portfolio
these shell commands are defined internally. type 'help <name>' for more info.
a star (*) next to a name means that the command is disabled.

${formatCommandsInColumns(builtins, 3)}`;
      }

      switch (arg) {
        case 'about':
          return `about
displays information about this system.`;
        case 'cat':
          return `cat <file>
concatenate files and print on the standard output. use 'cat cv.pdf' to download the cv.`;
        case 'cd':
          return `cd <dir>
changes the current directory. use '..' to go up. supports relative and absolute paths.`;
        case 'clear':
          return `clear
clears the terminal screen.`;
        case 'whoami':
      return `whoami
displays information about the current user and system environment.`;
    case 'exit':
          return `exit
terminates the session and disables further input.`;
        case 'help':
          return `help [command]
displays this help message or detailed usage of a command.`;
        case 'ls':
          return `ls
lists contents of the current directory.`;
        default:
          return `help: no help topic for '${arg}'`;
      }
    }

    case 'about':
      return `this portfolio is built by antar in a custom linux shell-styled cli interface.`;

    case 'ls':
      return dir ? Object.keys(dir).join('  ') : '';

    case 'cd':
      if (!arg) return 'directory name required';

      if (arg === '~' || arg === '/') {
        pathStack = ['~'];
        break;
      }

      if (arg.startsWith('/') || arg.startsWith('~/')) {
        const parts = arg.replace(/^~?\//, '').split('/');
        let current = fileSystem;
        for (let i = 0; i < parts.length; i++) {
          if (current[parts[i]] && current[parts[i]].type === 'folder') {
            current = current[parts[i]].contents;
          } else {
            return `cd: no such file or directory: ${arg}`;
          }
        }
        pathStack = ['~', ...parts];
        break;
      }

      if (arg === '..') {
        if (pathStack.length > 1) pathStack.pop();
        break;
      }

      if (dir && dir[arg] && dir[arg].type === 'folder') {
        pathStack.push(arg);
        break;
      }

      return `cd: no such file or directory: ${arg}`;

    case 'cat':
      if (!arg) return 'file name required';
      if (dir && dir[arg] && dir[arg].type === 'file') {
        if (arg.endsWith('.pdf')) {
          const link = document.createElement('a');
          link.href = '/cv.pdf';
          link.download = 'cv.pdf';
          link.click();
          return 'downloading cv...';
        } else if (arg.endsWith('.url')) {
          window.open(dir[arg].content, '_blank');
          return `opening: ${dir[arg].content}`;
        }
        return dir[arg].content;
      }
      return `cat: ${arg}: no such file`;

    case 'clear':
      terminal.innerHTML = '';
      terminal.appendChild(input.parentElement);
      updatePrompt();
      return '';

    case 'whoami':
      return getWhoAmI();

    case 'exit':
      printOutput('session terminated.');
      input.setAttribute('contenteditable', 'false');
      return '';

    default:
      return `${command}: command not found`;
  }
}

// Enter key handling
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = input.innerText.trim();
    if (!command) return;

    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="printed-prompt">${getPrompt()}&nbsp;</span>${command}`;
    terminal.insertBefore(commandLine, input.parentElement);

    const output = handleCommand(command);
    if (typeof output === 'string' && output.trim()) {
      printOutput(output);
    }

    input.innerText = '';
    updatePrompt();
    updateCursor();
    setTimeout(() => input.focus(), 0);
  }
});

// Cursor management
function updateCursor() {
  const text = input.textContent || ' ';
  const temp = document.createElement('span');
  temp.textContent = text;
  temp.style.position = 'absolute';
  temp.style.whiteSpace = 'pre';
  temp.style.visibility = 'hidden';
  temp.style.font = getComputedStyle(input).font;
  document.body.appendChild(temp);
  const width = temp.offsetWidth;
  document.body.removeChild(temp);
  input.style.setProperty('--cursor-left', `${width}px`);
}

// Init
window.addEventListener('load', () => {
  input.focus();
  updatePrompt();
  updateCursor();
});

input.addEventListener('input', updateCursor);
input.addEventListener('click', updateCursor);
input.addEventListener('keyup', updateCursor);