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
    `do not track   : ${
      navigator.doNotTrack === '1'
        ? 'Yes'
        : navigator.doNotTrack === '0'
        ? 'No'
        : 'Unknown'
    }`,
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

let pathStack = ['~']; // Represents the current path segments, starting with '~' for home
let currentIP = 'user';

// Fetch IP and initialize prompt
fetch('https://api.ipify.org?format=json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    currentIP = data.ip;
    updatePrompt();
  })
  .catch(error => {
    console.error("Failed to fetch IP:", error);
    currentIP = '0.0.0.0'; // Fallback IP
    updatePrompt();
  });

// Prompt generator
function getPrompt() {
  let displayedPath = '';
  if (pathStack.length === 1 && pathStack[0] === '~') {
    displayedPath = '~'; // When in home, show ~
  } else if (pathStack[0] === '~') { // For paths under home
    displayedPath = '~/' + pathStack.slice(1).join('/');
  } else { // For absolute paths starting from root (if implemented later beyond this scope)
    displayedPath = '/' + pathStack.join('/');
  }
  return `${currentIP}@syzarn:${displayedPath}$`;
}

function updatePrompt() {
  promptSpan.textContent = getPrompt();
}

// File system
const fileSystem = {
  '~': { // Representing the root of the user's simulated file system (which is their home)
    type: 'folder',
    contents: {
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
            content: 'mailto:syzarn@outlook.com'
          },
          'linkedin.url': {
            type: 'file',
            content: 'https://www.linkedin.com/in/shoaib-islam-antor'
          },
          'github.url': {
            type: 'file',
            content: 'https://github.com/syzarn'
          }
        }
      },
      'cv.pdf': {
        type: 'file',
        content: '' 
      },
      // Easter egg file
      '‎': {
        type: 'file',
        content: ''
      }
    }
  }
};

// --- START: Radical Path & Directory Resolution Refactor ---

/**
 * Resolves a given path (absolute or relative) against the fileSystem.
 * Returns the target node (file or folder contents) and its name, or null if not found.
 * @param {string[]} currentPathStack The current directory path (e.g., ['~', 'projects'])
 * @param {string} targetPath The path to resolve (e.g., 'about', '../', '/projects/cli-ui.txt', '~/contacts')
 * @returns {{node: object, name: string} | null} The target node (file or folder contents) and its name, or null.
 */
function resolvePath(currentPathStack, targetPath) {
  let resolvedSegments = [];
  if (targetPath === '~' || targetPath === '/') {
    resolvedSegments = ['~'];
  } else if (targetPath.startsWith('/')) {
    // For simplicity, treating / as ~/ in this simulated FS
    // If you had a true root that wasn't home, this would need more logic.
    resolvedSegments = ['~', ...targetPath.substring(1).split('/').filter(s => s !== '')];
  } else if (targetPath.startsWith('~/')) {
    resolvedSegments = ['~', ...targetPath.substring(2).split('/').filter(s => s !== '')];
  } else {
    resolvedSegments = [...currentPathStack]; // Start from current path
    const targetSegments = targetPath.split('/').filter(s => s !== '');

    for (const segment of targetSegments) {
      if (segment === '..') {
        if (resolvedSegments.length > 1) { // Cannot go above '~'
          resolvedSegments.pop();
        }
      } else if (segment === '.') {
        // Do nothing, stay in current segment
      } else {
        resolvedSegments.push(segment);
      }
    }
  }

  let current = fileSystem;
  let node = null;
  let currentSegmentName = resolvedSegments[0]; // For "~"
  let pathIsValid = true;

  for (let i = 0; i < resolvedSegments.length; i++) {
    const segment = resolvedSegments[i];

    if (!current[segment]) {
      pathIsValid = false;
      break;
    }

    node = current[segment];
    currentSegmentName = segment;

    if (node.type === 'folder') {
      if (i < resolvedSegments.length - 1) { // If it's a folder and not the last segment, dive in
        current = node.contents;
      } else { // It's the target folder
        return { node: node, name: currentSegmentName, path: resolvedSegments };
      }
    } else { // It's a file
      if (i < resolvedSegments.length - 1) { // A file encountered mid-path means invalid path
        pathIsValid = false;
        break;
      } else { // It's the target file
        return { node: node, name: currentSegmentName, path: resolvedSegments };
      }
    }
  }

  if (!pathIsValid) {
    return null;
  }
  // This case handles resolving a path to a folder where we reached the end of segments
  // and 'current' holds the contents of the last resolved folder.
  // The 'node' variable holds the actual folder node.
  return { node: node, name: currentSegmentName, path: resolvedSegments };
}


// --- END: Radical Path & Directory Resolution Refactor ---


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
  outputDiv.textContent = text; // Use textContent for safety and correct display of newlines
  terminal.insertBefore(outputDiv, input.parentElement);
}

// Command handler
function handleCommand(cmdLine) {
  const [command, ...args] = cmdLine.trim().split(' ');
  const arg = args.join(' ');

  // Special check: If pathStack currently points to a file (not a folder's contents)
  // this state should ideally be prevented by cd not allowing it.
  // However, for robustness, check if the current path leads to a file.
  const currentNode = resolvePath(pathStack, '.'); // Resolve current path
  if (currentNode && currentNode.node.type === 'file') {
    // This state should not be reachable if cd logic is robust
    return `you are currently viewing a file. use 'cd ..' to return to its parent directory.`;
  }

  switch (command) {
    case 'help': {
      const builtins = [
        'about',
        'cal',
        'cat',
        'cd',
        'clear',
        'date',
        'exit',
        'help',
        'ls',
        'whoami'
      ];

      if (!arg) {
        return `rsh v1.0
these shell commands are defined internally.
type 'help <name>' for more info.
type 'cat cv.pdf' to download the cv.
a star (*) next to a name means that the command is disabled.

${formatCommandsInColumns(builtins, 3)}`;
      }

      switch (arg) {
        case 'about':
          return `about
displays information about this system.`;
        case 'cal':
          return `cal
displays a simple calendar.`;
        case 'cat':
          return `cat <file>
concatenate files and print on the standard output. use 'cat cv.pdf' to download the cv.`;
        case 'cd':
          return `cd <dir>
changes the current directory. use '..' to go up. supports relative and absolute paths.`;
        case 'clear':
          return `clear
clears the terminal screen.`;
        case 'date':
          return `date
displays date and time in the given format.`;
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

    case 'ls': {
      const currentDirNode = resolvePath(pathStack, '.');
      if (!currentDirNode || currentDirNode.node.type !== 'folder') {
        // This case should ideally not be reached if cd works correctly
        return `ls: cannot access current directory`;
      }
      return Object.keys(currentDirNode.node.contents).join('  ') || '';
    }

    case 'cd': {
      if (!arg) return 'cd: directory name required';

      const resolved = resolvePath(pathStack, arg);

      if (!resolved) {
        return `cd: no such file or directory: ${arg}`;
      }

      if (resolved.node.type === 'file') {
        return `cd: ${arg}: not a directory`;
      }

      // If it's a folder, update pathStack to the resolved path
      pathStack = resolved.path;
      break;
    }

    case 'cat': {
      if (!arg) return 'cat: file name required';

      const targetNode = resolvePath(pathStack, arg);

      if (!targetNode || targetNode.node.type !== 'file') {
        return `cat: ${arg}: no such file`;
      }

      // Handle special file types
      if (arg.endsWith('.pdf')) {
        const link = document.createElement('a');
        link.href = '/files/cv.pdf'; // Assumes cv.pdf is in /files/ on your web server
        link.download = 'cv.pdf';
        link.click();
        return `opening: cv.pdf`;
      } else if (arg.endsWith('.url')) {
        window.open(targetNode.node.content, '_blank');
        return `opening: ${targetNode.node.content}`;
      } else if (arg.trim() === 'tumi nai') { // Easter egg for specific filename
        const link = document.createElement('a');
        link.href = '/files/tumi nai.flac'; // Assumes tumi nai.flac is in /files/ on your web server
        link.download = 'tumi nai.flac';
        link.click();
        return `tobu acho ghire`;
      }
      return targetNode.node.content; // Regular text file content
    }

    case 'date': {
      // Very basic date formatting, not a full `date` command emulation
      const now = new Date();
      if (args.length > 0 && args[0].startsWith('+')) {
        try {
          const formatString = args[0].substring(1);
          let result = formatString;

          // Replace common format specifiers (simple implementation)
          result = result.replace(/%Y/g, now.getFullYear());
          result = result.replace(/%m/g, (now.getMonth() + 1).toString().padStart(2, '0'));
          result = result.replace(/%d/g, now.getDate().toString().padStart(2, '0'));
          result = result.replace(/%H/g, now.getHours().toString().padStart(2, '0'));
          result = result.replace(/%M/g, now.getMinutes().toString().padStart(2, '0'));
          result = result.replace(/%S/g, now.getSeconds().toString().padStart(2, '0'));
          result = result.replace(/%A/g, now.toLocaleString('default', { weekday: 'long' }));
          result = result.replace(/%B/g, now.toLocaleString('default', { month: 'long' }));
          result = result.replace(/%Z/g, Intl.DateTimeFormat().resolvedOptions().timeZone);

          // Fallback for unrecognized %x or literal %
          result = result.replace(/%%/g, '%'); // Handle escaped %

          return result;
        } catch (e) {
          console.error("Date formatting error:", e);
          return 'date: invalid format';
        }
      } else {
        return now.toString(); // Default date output
      }
    }

    case 'cal': {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0); // Last day of current month

      const monthName = now.toLocaleString('default', { month: 'long' });
      const monthYearStr = `${monthName} ${year}`;

      // Calculate padding to center the month/year string (assuming 20 chars wide for days)
      const daysHeaderWidth = 20; // "Su Mo Tu We Th Fr Sa" is 20 chars
      const paddingSpaces = Math.floor((daysHeaderWidth - monthYearStr.length) / 2);
      let output = ' '.repeat(Math.max(0, paddingSpaces)) + monthYearStr + '\n';
      output += 'Su Mo Tu We Th Fr Sa\n';

      const offset = start.getDay(); // Day of week for 1st of month (0 for Sunday)
      output += '   '.repeat(offset); // Indent for the first day

      for (let i = 1; i <= end.getDate(); i++) {
        output += (i < 10 ? ' ' : '') + i + ' '; // Single digit padding

        if ((i + offset) % 7 === 0) {
          output += '\n'; // Newline at end of week
        }
      }
      return output.trim();
    }

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
    if (!command) { // If command is empty, just print a new prompt
      const emptyLine = document.createElement('div');
      emptyLine.innerHTML = `<span class="printed-prompt">${getPrompt()}&nbsp;</span>`;
      terminal.insertBefore(emptyLine, input.parentElement);
      input.innerText = '';
      updatePrompt();
      updateCursor();
      setTimeout(() => input.focus(), 0);
      return;
    }

    const commandLine = document.createElement('div');
    // Using innerHTML here is fine as getPrompt() is controlled and command is user input (displayed as is)
    commandLine.innerHTML = `<span class="printed-prompt">${getPrompt()}&nbsp;</span>${command}`;
    terminal.insertBefore(commandLine, input.parentElement);

    const output = handleCommand(command);
    if (typeof output === 'string' && output.trim() !== '') { // Only print if there's actual output
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
  temp.style.font = getComputedStyle(input).font; // Ensure font matches for accurate width
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
