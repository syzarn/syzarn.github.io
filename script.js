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

// Get prompt string dynamically
function getPrompt() {
  const relativePath = '/' + pathStack.slice(1).join('/');
  return `${currentIP}@syzarn:${relativePath || '/'}` + '$';
}

// Set the visible prompt line
function updatePrompt() {
  promptSpan.textContent = getPrompt();
}

// Virtual filesystem
const fileSystem = {
  'about': {
    type: 'folder',
    contents: {
      'bio.txt': {
        type: 'file',
        content: 'I am Antar, a web developer passionate about building responsive and creative UIs.'
      }
    }
  },
  'projects': {
    type: 'folder',
    contents: {
      'cli-ui.txt': {
        type: 'file',
        content: 'CLI UI Project: A portfolio styled like Linux shell using HTML, CSS, and JavaScript.'
      },
      'ocr-engine.txt': {
        type: 'file',
        content: 'OCR Project: Bengali OCR system powered by Python and ML.'
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

// Directory logic
function getCurrentDir() {
  let dir = fileSystem;
  for (let i = 1; i < pathStack.length; i++) {
    const segment = pathStack[i];
    dir = dir[segment].contents;
  }
  return dir;
}

function printOutput(text) {
  const outputDiv = document.createElement('div');
  outputDiv.className = 'output';
  outputDiv.textContent = text;
  terminal.insertBefore(outputDiv, input.parentElement);
}

function handleCommand(cmdLine) {
  const [command, ...args] = cmdLine.trim().split(' ');
  const arg = args.join(' ');
  const dir = getCurrentDir();

  switch (command) {
    case 'help':
      return `Available commands:
ls             List directory contents
cd <dir>       Change directory
cat <file>     View or download file
about          About this system
clear          Clear screen
exit           Exit session`;

    case 'about':
      return `This portfolio is built by Antar in a custom Linux shell-styled CLI interface.`;

    case 'ls':
      return Object.keys(dir).join('  ');

    
    case 'cd':
      if (!arg) return 'Directory name required';

      // Go home
      if (arg === '~' || arg === '/') {
        pathStack = ['~'];
        break;
      }

      // Absolute path from home
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

      // cd ..
      if (arg === '..') {
        if (pathStack.length > 1) pathStack.pop();
        break;
      }

      // Relative directory
      if (dir[arg] && dir[arg].type === 'folder') {
        pathStack.push(arg);
        break;
      }

      return `cd: no such file or directory: ${arg}`;

    case 'cat':
      if (!arg) return 'File name required';
      if (dir[arg] && dir[arg].type === 'file') {
        if (arg.endsWith('.pdf')) {
          const link = document.createElement('a');
          link.href = '/cv.pdf';
          link.download = 'Antar_CV.pdf';
          link.click();
          return 'Downloading CV...';
        }
        return dir[arg].content;
      }
      return `cat: ${arg}: No such file`;

    case 'clear':
      terminal.innerHTML = '';
      terminal.appendChild(input.parentElement);
      updatePrompt();
      return '';

    case 'exit':
      printOutput('Session terminated.');
      input.setAttribute('contenteditable', 'false');
      return '';

    default:
      return `${command}: command not found`;
  }
}

// Handle Enter input
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();

    const command = input.innerText.trim();
    if (!command) return;

    // Print command with dynamic prompt
    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="printed-prompt">${getPrompt()}&nbsp;</span>${command}`;
    terminal.insertBefore(commandLine, input.parentElement);

    // Run command
    const output = handleCommand(command);
    if (typeof output === 'string' && output.trim()) {
      printOutput(output);
    }

    input.innerText = '';
    updatePrompt();
    updateCursor();
    updatePrompt();
    setTimeout(() => input.focus(), 0);
  }
});

// Cursor logic
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

// Startup
window.addEventListener('load', () => {
  input.focus();
  updatePrompt();
  updateCursor();
});

input.addEventListener('input', updateCursor);
input.addEventListener('click', updateCursor);
input.addEventListener('keyup', updateCursor);