(function () {
  'use strict';

  const startTime = Date.now();
  let currentIP = 'user';
  let pathStack = ['~'];
  let previousPathStack = ['~'];
  let commandHistory = [];
  let historyIndex = -1;
  let currentInputBuffer = '';
  let cursorPosition = 0;
  let activeInteractiveMode = null;

  const env = {
    USER: 'syzarn',
    NAME: 'Soaib Islam Antar',
    HOSTNAME: 'syzarn',
    SHELL: '/bin/rsh',
    TERM: 'xterm-256color',
    HOME: '/home/syzarn',
    PATH: '/bin:/usr/bin:/home/syzarn/bin',
    THEME: 'matrix',
    FONT: 'tx02',
    LANG: 'en_US.UTF-8'
  };

  try {
    const savedTheme = localStorage.getItem('syzarn_theme');
    if (savedTheme) env.THEME = savedTheme;
    const savedFont = localStorage.getItem('syzarn_font');
    if (savedFont) env.FONT = savedFont;
    const savedHistory = localStorage.getItem('syzarn_history');
    if (savedHistory) commandHistory = JSON.parse(savedHistory);
  } catch (e) {
    console.warn('LocalStorage unavailable:', e);
  }

  const terminalContainer = document.getElementById('terminal-container');
  const terminal = document.getElementById('terminal');
  const terminalHistory = document.getElementById('terminal-history');
  const bannerEl = document.getElementById('banner');
  const promptSpan = document.getElementById('prompt');
  const cliText = document.getElementById('cli-text');
  const cliCursor = document.getElementById('cli-cursor');
  const hiddenInput = document.getElementById('cli-hidden-input');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const audioElement = document.getElementById('terminal-audio');

  const defaultFileSystem = {
    '~': {
      type: 'folder',
      date: 'Nov 23 14:20',
      contents: {
        'about': {
          type: 'folder',
          date: 'Nov 23 14:20',
          contents: {
            'bio.txt': {
              type: 'file',
              date: 'Jul 30 12:15',
              content: `SOAIB ISLAM ANTAR
============================================================
Interdisciplinary professional bridging editorial research, historical linguistics, data operations, and business strategy.

Location : Mirpur, Dhaka, Bangladesh
Email    : soaibislamantar@gmail.com
Phone    : +880 1887-454935
LinkedIn : https://www.linkedin.com/in/shoaib-islam-antor

I excel at synthesizing complex information, ranging from classical philology and political history to real-time global news, into clear, actionable insights. A multilingual communicator with a meticulous eye for detail, I leverage programmatic workflows and rigorous analysis to transform intricate datasets into persuasive, high-impact narratives.`
            },
            'interests.txt': {
              type: 'file',
              date: 'Mar 30 15:35',
              content: `Research & Professional Focus:
- Historical Linguistics & Classical Philology (Indo-Aryan, Semitic, Ancient Near Eastern)
- Data Operations, Workflow Automation & Web Systems
- Political History & Archival Editorial Research
- Environmental Sciences & Ecological Modeling
- Audio Engineering, Sound Synthesis & Machine Learning`
            },
            'education.txt': {
              type: 'file',
              date: 'Dec 15 21:00',
              content: `EDUCATION & ACADEMIC BACKGROUND
============================================================
• Jahangirnagar University (Savar, Dhaka)
  Bachelor of Science (Honours) – Environmental Sciences
  Duration: 2022 – 2027 (expected)

• Agargaon Taltola Government Colony High School & College (Dhaka)
  Higher Secondary Certificate (HSC) – Science
  Result: GPA 5.00 / 5.00 | Duration: 2019 – 2022

• Monipur High School & College (Dhaka)
  Secondary School Certificate (SSC) – Science
  Result: GPA 4.89 / 5.00 | Duration: 2009 – 2019`
            },
            'languages.txt': {
              type: 'file',
              date: 'Sep 21 14:55',
              content: `LINGUISTIC CAPABILITIES & CLASSICAL PHILOLOGY
============================================================
• Bengali (স)                   : Native [Reading, Writing, Speaking, Listening]
• English (W)                   : Fluent [Reading, Writing, Speaking, Listening]
• Hindustani (खڑ)               : Fluent [Reading, Writing, Speaking, Listening]
• Sanskrit (𑀱 - Vedic/Classical) : Reading & Writing [R/W]
• Arabic (ض - Classical)        : Reading & Writing [R/W]
• Hebrew (ש - Biblical)         : Reading & Writing [R/W]
• Persian (ژ)                   : Reading [R]
• German / Deutsche (Ü)         : Elementary [A1]
• Sumerian (𒀳)                 : Cuneiform Philological Reading [R]`
            }
          }
        },
        'experience': {
          type: 'folder',
          date: 'Oct 27 09:15',
          contents: {
            'sarangsho.txt': {
              type: 'file',
              date: 'Oct 25 11:10',
              content: `Sarangsho (Dhaka)
Role     : Research Intern
Duration : June 2026 – August 2026
------------------------------------------------------------
- Monitored 2,000+ global sources to rapidly publish exclusive Bengali-language news summaries within hours of breaking events.
- Synthesized comprehensive, 360-degree general knowledge modules on current affairs.
- Awarded internal "Researcher of the Month" for three consecutive months.`
            },
            'aditto-prokash.txt': {
              type: 'file',
              date: 'Sep 28 09:30',
              content: `Aditto Prokash (Dhaka)
Role     : Intern → Research & Development Officer
Duration : June 2025 – May 2026
------------------------------------------------------------
- Conducted cross-disciplinary research and contributed to the translation of major academic works.
- Developed internal tools and streamlined digital workflows to optimize editorial operations and drive unprecedented audience growth.`
            },
            'panjeree.txt': {
              type: 'file',
              date: 'Jan 12 10:14',
              content: `Panjeree Publications Limited (Dhaka)
Role     : Writer (Bengali) [Freelance]
Duration : September 2025 – December 2025
------------------------------------------------------------
- Authored, refined, and meticulously copy-edited articles to ensure strict linguistic precision, factual consistency, and alignment with the publication's overarching tone and editorial standards.`
            },
            'synergy.txt': {
              type: 'file',
              date: 'Jan 28 16:45',
              content: `Synergy Business Solutions (Dhaka)
Role     : Outbound Sales Specialist (Night Shift)
Duration : June 2025 – June 2025
------------------------------------------------------------
- Consistently achieved weekly sales targets by executing high-volume outbound calls to qualify leads.
- Leveraged CRM tools to track client interactions and optimize conversion strategies.`
            }
          }
        },
        'projects': {
          type: 'folder',
          date: 'Dec  9 18:30',
          contents: {
            'reform-guide.txt': {
              type: 'file',
              date: 'Feb  4 11:20',
              content: `Project  : Reform Commission Reports Guide
Role     : Project Lead (Technical)
Duration : July 2025 – September 2025
URL      : https://reform.gov.bd
Supervisor: Professor Ali Riaz
------------------------------------------------------------
- Led the design and development of the chatbot, executing the core work that enabled the Commission’s digitalisation and improved public access to archival reports.
- Directed research, content structuring, and system implementation, ensuring the tool’s accuracy, usability, and reliability across the Commission’s reform reports.`
            },
            'ocr-engine.txt': {
              type: 'file',
              date: 'Feb 19 15:30',
              content: `Project  : Bengali OCR Engine & Pipeline
Stack    : Python, PyTorch, OpenCV, Flask, ML Pipelines
------------------------------------------------------------
- High-accuracy optical character recognition model tailored for Bengali script document parsing and text extraction.`
            },
            'cli-ui.txt': {
              type: 'file',
              date: 'Apr  8 09:40',
              content: `Project  : Pseudo Linux Shell Portfolio (rsh)
Stack    : Vanilla JavaScript, HTML5, CSS3 Custom Properties
------------------------------------------------------------
- A feature-rich browser shell emulating UNIX environments with VFS, pipes, redirections, and interactive modules.
Source   : https://github.com/syzarn/syzarn.github.io`
            },
            'neuro-synth.txt': {
              type: 'file',
              date: 'Apr 22 17:15',
              content: `Project  : NeuroSynth Web Audio Experiment
Stack    : Web Audio API, WebAssembly, HTML5 Canvas
------------------------------------------------------------
- Experimental browser-based additive synthesizer and audio spectrum visualizer.`
            }
          }
        },
        'works': {
          type: 'folder',
          date: 'Oct 20 11:45',
          contents: {
            'political-history.txt': {
              type: 'file',
              date: 'May  5 14:50',
              content: `Book Title : বাংলাদেশ: স্বাধীনতা-উত্তর রাজনীতির ইতিহাস
Original   : Bangladesh: A Political History Since Independence (by Ali Riaz)
Role       : Co-Translator [EN → BN]
Date       : January 2025`
            },
            'july-national-charter.txt': {
              type: 'file',
              date: 'May 18 10:25',
              content: `Document   : July National Charter 2025: Pathway to the Future
Original   : জুলাই জাতীয় সনদ ২০২৫: ভবিষ্যতের পথরেখা (by NCC)
Role       : Co-Translator [BN → EN]
Date       : October 2025`
            },
            'looking-back.txt': {
              type: 'file',
              date: 'Jun 11 16:35',
              content: `Book Title : Looking Back
Original   : ফিরে দেখা (by Nurjahan Begum)
Role       : Co-Translator [BN → EN]
Date       : January 2026`
            }
          }
        },
        'skills': {
          type: 'folder',
          date: 'Mar 17 08:22',
          contents: {
            'technical.txt': {
              type: 'file',
              date: 'Jun 24 12:40',
              content: `TECHNICAL & PROGRAMMING SKILLS
============================================================
• Programming Languages : Python, HTML, CSS, JavaScript
• Frameworks            : React, Node.js, PyTorch
• Libraries             : NumPy, OpenCV
• DevOps & Tools        : Git, GitHub, Docker, MS Office, AI/ML Tooling`
            },
            'research.txt': {
              type: 'file',
              date: 'Aug  3 08:55',
              content: `RESEARCH & ANALYTICAL EXPERTISE
============================================================
• Data Analysis & Processing
• Historical & Linguistic Analysis
• Archival Research & Document Synthesis
• Research Design & Epistemological Frameworks
• Financial Modelling & Workflow Digitalization`
            },
            'professional.txt': {
              type: 'file',
              date: 'Aug 29 19:10',
              content: `PROFESSIONAL & SOFT SKILLS
============================================================
• Critical Thinking & Complex Problem Solving
• Academic & Cross-Disciplinary Writing
• Multilingual Translation & Copy-Editing
• Graphic Design & Media Presentation
• Effective Technical & Stakeholder Communication`
            }
          }
        },
        'contacts': {
          type: 'folder',
          date: 'Sep 25 16:10',
          contents: {
            'email.url': {
              type: 'file',
              date: 'Nov  7 13:20',
              content: 'mailto:soaibislamantar@gmail.com'
            },
            'linkedin.url': {
              type: 'file',
              date: 'Nov 14 15:45',
              content: 'https://www.linkedin.com/in/shoaib-islam-antor'
            },
            'github.url': {
              type: 'file',
              date: 'Feb 26 18:05',
              content: 'https://github.com/syzarn'
            },
            'phone.txt': {
              type: 'file',
              date: 'Apr 14 11:30',
              content: '+880 1887-454935'
            },
            'location.txt': {
              type: 'file',
              date: 'May 29 14:15',
              content: 'Mirpur, Dhaka, Bangladesh'
            },
            'reference.txt': {
              type: 'file',
              date: 'Jun  5 09:50',
              content: `ACADEMIC & PROFESSIONAL REFERENCE
============================================================
Ali Riaz, PhD
Distinguished Professor of Political Science
Department of Politics and Government
Illinois State University, USA
E-mail : ariaz@ilstu.edu
Mobile : +1 (309) 438-8145`
            }
          }
        },
        'media': {
          type: 'folder',
          date: 'Jul  2 13:05',
          contents: {
            'tumi-nai.flac': {
              type: 'file',
              date: 'Aug 22 20:30',
              content: '/files/tumi nai.flac'
            },
            'cv.pdf': {
              type: 'file',
              date: 'Jan 19 16:00',
              content: '/files/cv.pdf'
            }
          }
        },
        'cv.pdf': {
          type: 'file',
          date: 'Aug 16 10:40',
          content: '/files/cv.pdf'
        },
        'README.md': {
          type: 'file',
          date: 'Oct 30 17:50',
          content: `Type 'help' for commands. Quick: 'cv', 'experience', 'works', 'languages', 'projects', 'skills'`
        },
        // Easter egg
        '‎': {
          type: 'file',
          date: 'Jul 17 19:25',
          content: 'tobu acho ghire...'
        }
      }
    }
  };

  let fileSystem = JSON.parse(JSON.stringify(defaultFileSystem));

  fetch('https://api.ipify.org?format=json')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      currentIP = data.ip || 'user';
      updatePrompt();
    })
    .catch(() => {
      currentIP = 'user';
      updatePrompt();
    });

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function linkify(text) {
    const urlPattern = /(https?:\/\/[^\s<]+)/g;
    const emailPattern = /(mailto:[^\s<]+)/g;
    return escapeHTML(text)
      .replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="term-link">$1</a>')
      .replace(emailPattern, '<a href="$1" class="term-link">$1</a>');
  }

  function formatColumns(items, colWidth = 18) {
    let result = '';
    const cols = Math.max(1, Math.floor((window.innerWidth > 600 ? 70 : 35) / colWidth));
    for (let i = 0; i < items.length; i++) {
      result += items[i].padEnd(colWidth, ' ');
      if ((i + 1) % cols === 0 || i === items.length - 1) {
        result += '\n';
      }
    }
    return result.trimEnd();
  }

  function getPrompt() {
    let displayedPath = '';
    if (pathStack.length === 1 && pathStack[0] === '~') {
      displayedPath = '~';
    } else if (pathStack[0] === '~') {
      displayedPath = '~/' + pathStack.slice(1).join('/');
    } else {
      displayedPath = '/' + pathStack.join('/');
    }
    return `${currentIP}@syzarn:${displayedPath}$`;
  }

  function updatePrompt() {
    let displayedPath = '';
    if (pathStack.length === 1 && pathStack[0] === '~') {
      displayedPath = '~';
    } else if (pathStack[0] === '~') {
      displayedPath = '~/' + pathStack.slice(1).join('/');
    } else {
      displayedPath = '/' + pathStack.join('/');
    }
    promptSpan.innerHTML = `<span class="prompt-host">${escapeHTML(currentIP)}@syzarn</span>:<span class="prompt-path">${escapeHTML(displayedPath)}</span><span class="prompt-symbol">$</span>`;
    document.title = `${currentIP}@syzarn:${displayedPath}`;
  }

  function applyTheme(themeName) {
    const validThemes = ['matrix', 'catppuccin', 'nord', 'dracula', 'gruvbox', 'cyberpunk', 'amber', 'monokai', 'light'];
    if (!validThemes.includes(themeName)) {
      return false;
    }
    document.body.className = document.body.className.replace(/theme-[a-z0-9-]+/g, '');
    document.body.classList.add(`theme-${themeName}`);
    env.THEME = themeName;
    try {
      localStorage.setItem('syzarn_theme', themeName);
    } catch (e) { }
    return true;
  }

  function applyFont(fontName) {
    const validFonts = {
      'tx02': 'font-tx02',
      'tx-02': 'font-tx02',
      'jetbrains': 'font-jetbrains',
      'cartograph': 'font-cartograph',
      'system': 'font-system'
    };
    if (!validFonts[fontName]) return false;
    document.body.className = document.body.className.replace(/font-[a-z0-9-]+/g, '');
    document.body.classList.add(validFonts[fontName]);
    env.FONT = fontName;
    try {
      localStorage.setItem('syzarn_font', fontName);
    } catch (e) { }
    return true;
  }

  applyTheme(env.THEME);
  applyFont(env.FONT);

  function resolvePath(currentStack, targetPath) {
    if (!targetPath) return { node: fileSystem['~'], name: '~', path: ['~'] };

    let resolvedSegments = [];
    if (targetPath === '~' || targetPath === '/') {
      resolvedSegments = ['~'];
    } else if (targetPath === '-') {
      resolvedSegments = [...previousPathStack];
    } else if (targetPath.startsWith('~/')) {
      resolvedSegments = ['~', ...targetPath.substring(2).split('/').filter(Boolean)];
    } else if (targetPath.startsWith('/')) {
      resolvedSegments = ['~', ...targetPath.substring(1).split('/').filter(Boolean)];
    } else {
      resolvedSegments = [...currentStack];
      const targetSegments = targetPath.split('/').filter(Boolean);
      for (const segment of targetSegments) {
        if (segment === '..') {
          if (resolvedSegments.length > 1) resolvedSegments.pop();
        } else if (segment === '.') {
        } else {
          resolvedSegments.push(segment);
        }
      }
    }

    let current = fileSystem;
    let node = null;
    let currentSegmentName = resolvedSegments[0];

    for (let i = 0; i < resolvedSegments.length; i++) {
      const seg = resolvedSegments[i];
      if (!current[seg]) {
        return null;
      }
      node = current[seg];
      currentSegmentName = seg;

      if (node.type === 'folder') {
        if (i < resolvedSegments.length - 1) {
          current = node.contents;
        } else {
          return { node, name: currentSegmentName, path: resolvedSegments, parent: current };
        }
      } else {
        if (i < resolvedSegments.length - 1) {
          return null;
        } else {
          return { node, name: currentSegmentName, path: resolvedSegments, parent: current };
        }
      }
    }

    return { node, name: currentSegmentName, path: resolvedSegments, parent: current };
  }

  function getParentNode(pathSegments) {
    if (pathSegments.length <= 1) return fileSystem['~'];
    let current = fileSystem['~'];
    for (let i = 1; i < pathSegments.length - 1; i++) {
      const seg = pathSegments[i];
      if (!current.contents || !current.contents[seg] || current.contents[seg].type !== 'folder') {
        return null;
      }
      current = current.contents[seg];
    }
    return current;
  }

  function printOutput(htmlContent, isHTML = false) {
    const outDiv = document.createElement('div');
    outDiv.className = 'output';
    if (isHTML) {
      outDiv.innerHTML = htmlContent;
    } else {
      outDiv.innerHTML = linkify(htmlContent);
    }
    terminalHistory.appendChild(outDiv);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function printCommandLine(cmd) {
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'history-line';
    cmdDiv.innerHTML = `<span class="printed-prompt">${escapeHTML(getPrompt())}&nbsp;</span><span>${escapeHTML(cmd)}</span>`;
    terminalHistory.appendChild(cmdDiv);
    terminal.scrollTop = terminal.scrollHeight;
  }

  const audioModule = {
    currentTrack: 'tumi nai.flac',
    audioPath: './files/tumi nai.flac',
    isPlaying: false,

    play(track) {
      if (track) {
        this.currentTrack = track;
      }
      audioElement.src = this.audioPath;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
          })
          .catch(err => {
            console.warn('Audio play restricted:', err);
          });
      }
      return `<div class="audio-player-box">
  <div class="audio-title">♫ audio player: now playing</div>
  <div class="c-link">Track: ${escapeHTML(this.currentTrack)}</div>
  <div class="audio-progress">[▶] playing audio stream... use 'music pause' or 'music stop'</div>
</div>`;
    },

    pause() {
      if (!audioElement.paused) {
        audioElement.pause();
        this.isPlaying = false;
        return `[⏸] audio paused. Type 'music play' to resume.`;
      }
      return `[ℹ] audio is not currently playing.`;
    },

    stop() {
      audioElement.pause();
      audioElement.currentTime = 0;
      this.isPlaying = false;
      return `[■] audio stopped.`;
    },

    status() {
      const state = !audioElement.paused ? 'playing' : 'stopped / paused';
      const cur = Math.floor(audioElement.currentTime || 0);
      const dur = Math.floor(audioElement.duration || 0);
      const vol = Math.round((audioElement.volume || 1) * 100);
      return `audio player status:
Track   : ${this.currentTrack}
State   : ${state}
Time    : ${Math.floor(cur / 60)}:${String(cur % 60).padStart(2, '0')} / ${dur ? Math.floor(dur / 60) + ':' + String(dur % 60).padStart(2, '0') : '--:--'}
Volume  : ${vol}%`;
    },

    setVolume(val) {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0 || num > 100) return `music: volume must be between 0 and 100`;
      audioElement.volume = num / 100;
      return `volume set to ${num}%`;
    }
  };

  const matrixModule = {
    intervalId: null,
    start() {
      activeInteractiveMode = 'matrix';
      matrixCanvas.style.display = 'block';
      const ctx = matrixCanvas.getContext('2d');

      const width = matrixCanvas.width = window.innerWidth;
      const height = matrixCanvas.height = window.innerHeight;

      const letters = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜש𑀱<ctrl42>';
      const fontSize = 16;
      const columns = Math.floor(width / fontSize);
      const drops = Array.from({ length: columns }).fill(1);

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      this.intervalId = setInterval(draw, 33);
      printOutput(`[matrix digital rain running. click screen or press any key / ctrl+c to exit]`);
    },

    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      matrixCanvas.style.display = 'none';
      activeInteractiveMode = null;
      focusInput();
    }
  };

  matrixCanvas.addEventListener('click', () => matrixModule.stop());

  const snakeModule = {
    gameInterval: null,
    boardWidth: 20,
    boardHeight: 12,
    snake: [{ x: 5, y: 5 }],
    direction: { x: 1, y: 0 },
    food: { x: 10, y: 5 },
    score: 0,

    start() {
      activeInteractiveMode = 'snake';
      this.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
      this.direction = { x: 1, y: 0 };
      this.score = 0;
      this.spawnFood();

      printOutput(`<div id="snake-game-wrapper" class="game-container">
  <div class="c-accent ansi-bold">snake</div>
  <div class="c-dim">use arrow keys / wasd to steer. press 'q' or ctrl+c to quit.</div>
  <pre id="snake-screen" style="line-height:1.1; margin:6px 0; font-family:monospace;"></pre>
  <div id="snake-status">score: <span id="snake-score">0</span></div>
</div>`, true);

      this.render();
      this.gameInterval = setInterval(() => this.tick(), 150);
    },

    spawnFood() {
      this.food = {
        x: Math.floor(Math.random() * this.boardWidth),
        y: Math.floor(Math.random() * this.boardHeight)
      };
    },

    tick() {
      const head = {
        x: this.snake[0].x + this.direction.x,
        y: this.snake[0].y + this.direction.y
      };

      if (head.x < 0) head.x = this.boardWidth - 1;
      if (head.x >= this.boardWidth) head.x = 0;
      if (head.y < 0) head.y = this.boardHeight - 1;
      if (head.y >= this.boardHeight) head.y = 0;

      if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        this.stop(`game over! final score: ${this.score}`);
        return;
      }

      this.snake.unshift(head);

      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.spawnFood();
        const scoreEl = document.getElementById('snake-score');
        if (scoreEl) scoreEl.textContent = this.score;
      } else {
        this.snake.pop();
      }

      this.render();
    },

    render() {
      const screenEl = document.getElementById('snake-screen');
      if (!screenEl) return;

      let frame = '┌' + '─'.repeat(this.boardWidth) + '┐\n';
      for (let y = 0; y < this.boardHeight; y++) {
        frame += '│';
        for (let x = 0; x < this.boardWidth; x++) {
          if (this.snake[0].x === x && this.snake[0].y === y) {
            frame += '◆';
          } else if (this.snake.some(seg => seg.x === x && seg.y === y)) {
            frame += '■';
          } else if (this.food.x === x && this.food.y === y) {
            frame += '★';
          } else {
            frame += ' ';
          }
        }
        frame += '│\n';
      }
      frame += '└' + '─'.repeat(this.boardWidth) + '┘';
      screenEl.textContent = frame;
    },

    handleKey(e) {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
      } else if (e.key === 'q' || (e.ctrlKey && e.key === 'c')) {
        this.stop(`snake session quit. score: ${this.score}`);
      }
    },

    stop(msg) {
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
      }
      activeInteractiveMode = null;
      if (msg) printOutput(msg);
      focusInput();
    }
  };

  const commands = {
    help: {
      desc: 'display available shell commands and usage info',
      usage: 'help [command]',
      exec(args) {
        if (args.length > 0) {
          const cmdName = args[0].toLowerCase();
          const target = commands[cmdName];
          if (target) {
            return `<span class="c-accent ansi-bold">${escapeHTML(cmdName)}</span>: ${escapeHTML(target.desc)}
<span class="c-dim">Usage:</span> ${escapeHTML(target.usage || cmdName)}`;
          }
          return `help: no help topic found for '${escapeHTML(cmdName)}'`;
        }

        const categories = {
          'profile & CV': ['about', 'experience', 'projects', 'works', 'skills', 'languages', 'education', 'contact', 'references', 'resume'],
          'navigation & files': ['ls', 'll', 'cd', 'pwd', 'tree', 'cat', 'head', 'tail', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'find', 'open'],
          'system & specs': ['neofetch', 'whoami', 'uname', 'uptime', 'date', 'cal', 'top', 'ps', 'free', 'df', 'env', 'hostname'],
          'network & web': ['ping', 'curl', 'wget', 'weather', 'ifconfig', 'nslookup'],
          'customization & misc.': ['theme', 'font', 'music', 'matrix', 'snake', 'cowsay', 'fortune', 'sl', 'figlet', 'clear', 'history', 'reset', 'exit']
        };

        let out = `<div class="help-container">`;
        out += `<div class="help-header">`;
        out += `<div class="c-accent ansi-bold">rsh v2.7</div>`;
        out += `<div class="c-dim">type 'help &lt;cmd&gt;' or 'man &lt;cmd&gt;' for detailed command usage.<br>pipe (|) and output redirection (&gt;, &gt;&gt;) are supported.</div>`;
        out += `</div>`;

        for (const [cat, list] of Object.entries(categories)) {
          out += `<div class="help-section">`;
          out += `<div class="help-category c-user ansi-bold">${escapeHTML(cat)}:</div>`;
          out += `<div class="help-grid">`;
          for (const cmd of list) {
            out += `<span class="help-cmd">${escapeHTML(cmd)}</span>`;
          }
          out += `</div>`;
          out += `</div>`;
        }

        out += `<div class="help-footer c-dim">quick tip: use ⇥tab for auto-completion, ↑ / ↓ for history, ctrl+l to clear screen.</div>`;
        out += `</div>`;
        return out;
      }
    },

    man: {
      desc: 'display manual page for a command',
      usage: 'man <command>',
      exec(args) {
        if (!args[0]) return `What manual page do you want? (e.g. 'man experience')`;
        return commands.help.exec(args);
      }
    },

    tldr: {
      desc: 'display simplified command cheat sheet',
      usage: 'tldr <command>',
      exec(args) {
        return commands.help.exec(args);
      }
    },

    whoami: {
      desc: 'print profile credentials, client system environment and browser details',
      usage: 'whoami',
      exec() {
        const specs = [
          ['name', env.NAME],
          ['user', `${currentIP}@syzarn`],
          ['email', 'soaibislamantar@gmail.com'],
          ['location', 'Mirpur, Dhaka, Bangladesh'],
          ['education', 'Jahangirnagar University (B.Sc. Environmental Sciences)'],
          ['ip address', currentIP],
          ['platform', navigator.platform || 'Unknown'],
          ['cpu threads', navigator.hardwareConcurrency || 'Unknown'],
          ['device memory', (navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown')],
          ['screen res', `${window.screen.width}x${window.screen.height} @ ${window.devicePixelRatio || 1}x`],
          ['timezone', Intl.DateTimeFormat().resolvedOptions().timeZone],
          ['online status', navigator.onLine ? 'Online' : 'Offline']
        ];

        return specs.map(([k, v]) => `<span class="c-dim">${k.padEnd(16, ' ')}:</span> <span class="c-file">${escapeHTML(v)}</span>`).join('\n');
      }
    },

    about: {
      desc: 'display background, bio, and portfolio summary of Antar',
      usage: 'about',
      exec() {
        return `<span class="c-accent ansi-bold">SOAIB ISLAM ANTAR (syzarn)</span>
============================================================
<span class="c-user ansi-bold">Location:</span> Mirpur, Dhaka, Bangladesh
<span class="c-user ansi-bold">Contact :</span> <a href="mailto:soaibislamantar@gmail.com" class="term-link">soaibislamantar@gmail.com</a> | +880 1887-454935
<span class="c-user ansi-bold">LinkedIn:</span> <a href="https://www.linkedin.com/in/shoaib-islam-antor" target="_blank" rel="noopener" class="term-link">shoaib-islam-antor</a>

<span class="c-file">Interdisciplinary professional bridging editorial research, historical linguistics, data operations, and business strategy. I excel at synthesizing complex information, ranging from classical philology and political history to real-time global news, into clear, actionable insights. A multilingual communicator with a meticulous eye for detail, I leverage programmatic workflows and rigorous analysis to transform intricate datasets into persuasive, high-impact narratives.</span>

<span class="c-dim">type 'experience', 'works', 'languages', 'education', or 'skills' for more.</span>`;
      }
    },

    experience: {
      desc: 'display professional, editorial, and research experience',
      usage: 'experience',
      exec() {
        return `<span class="c-accent ansi-bold">PROFESSIONAL & RESEARCH EXPERIENCE</span>
============================================================
<span class="c-user ansi-bold">1. Sarangsho (Dhaka)</span> | <span class="c-path">Research Intern</span> [June 2026 – August 2026]
   • Monitored 2,000+ global sources to rapidly publish exclusive Bengali-language news summaries within hours of breaking events.
   • Synthesized comprehensive, 360-degree general knowledge modules on current affairs.
   • Awarded internal <span class="c-accent">"Researcher of the Month"</span> for three consecutive months.

<span class="c-user ansi-bold">2. Aditto Prokash (Dhaka)</span> | <span class="c-path">Intern → Research & Development Officer</span> [June 2025 – May 2026]
   • Conducted cross-disciplinary research and contributed to the translation of major academic works.
   • Developed internal tools and streamlined digital workflows to optimize editorial operations and drive unprecedented audience growth.

<span class="c-user ansi-bold">3. Panjeree Publications Limited (Dhaka)</span> | <span class="c-path">Writer (Bengali) [Freelance]</span> [Sept 2025 – Dec 2025]
   • Authored, refined, and meticulously copy-edited articles to ensure strict linguistic precision, factual consistency, and alignment with overarching publication standards.

<span class="c-user ansi-bold">4. Synergy Business Solutions (Dhaka)</span> | <span class="c-path">Outbound Sales Specialist</span> [June 2025 – June 2025]
   • Consistently achieved weekly sales targets by executing high-volume outbound calls to qualify leads and utilizing CRM tools to optimize conversion.`;
      }
    },

    exp: {
      desc: 'alias for experience',
      usage: 'exp',
      exec() {
        return commands.experience.exec();
      }
    },

    education: {
      desc: 'display academic credentials and educational qualifications',
      usage: 'education',
      exec() {
        return `<span class="c-accent ansi-bold">EDUCATION & ACADEMIC CREDENTIALS</span>
============================================================
<span class="c-user ansi-bold">• Jahangirnagar University (Savar, Dhaka)</span>
  <span class="c-path">Bachelor of Science (Honours) – Environmental Sciences</span>
  Duration: 2022 – 2027 (expected)

<span class="c-user ansi-bold">• Agargaon Taltola Government Colony High School & College (Dhaka)</span>
  <span class="c-path">Higher Secondary Certificate (HSC) – Science</span>
  Result: <span class="c-accent">GPA 5.00 / 5.00</span> | Duration: 2019 – 2022

<span class="c-user ansi-bold">• Monipur High School & College (Dhaka)</span>
  <span class="c-path">Secondary School Certificate (SSC) – Science</span>
  Result: <span class="c-accent">GPA 4.89 / 5.00</span> | Duration: 2009 – 2019`;
      }
    },

    edu: {
      desc: 'alias for education',
      usage: 'edu',
      exec() {
        return commands.education.exec();
      }
    },

    works: {
      desc: 'display published translations, editorial works, and national charters',
      usage: 'works',
      exec() {
        return `<span class="c-accent ansi-bold">BODY OF WORKS & ACADEMIC TRANSLATIONS</span>
============================================================
<span class="c-user ansi-bold">1. বাংলাদেশ: স্বাধীনতা-উত্তর রাজনীতির ইতিহাস</span> (by Ali Riaz)
   <span class="c-path">Co-Translator</span> [Translation of 'Bangladesh: A Political History Since Independence']
   Direction: <span class="c-doc">[EN → BN]</span> | Published: January 2025

<span class="c-user ansi-bold">2. July National Charter 2025: Pathway to the Future</span> (by NCC)
   <span class="c-path">Co-Translator</span> [Translation of 'জুলাই জাতীয় সনদ ২০২৫: ভবিষ্যতের পথরেখা']
   Direction: <span class="c-doc">[BN → EN]</span> | Published: October 2025

<span class="c-user ansi-bold">3. Looking Back</span> (by Nurjahan Begum)
   <span class="c-path">Co-Translator</span> [Translation of 'ফিরে দেখা']
   Direction: <span class="c-doc">[BN → EN]</span> | Published: January 2026`;
      }
    },

    publications: {
      desc: 'alias for works',
      usage: 'publications',
      exec() {
        return commands.works.exec();
      }
    },

    translations: {
      desc: 'alias for works',
      usage: 'translations',
      exec() {
        return commands.works.exec();
      }
    },

    languages: {
      desc: 'display multilingual proficiency matrix & classical philology languages',
      usage: 'languages',
      exec() {
        return `<span class="c-accent ansi-bold">LINGUISTIC MATRIX & CLASSICAL PHILOLOGY</span>
========================================================================
<span class="c-user ansi-bold">Glyph  Language                    Proficiency Level</span>
------------------------------------------------------------------------
<span class="c-accent">  স  </span>  Bengali                     Native [Reading, Writing, Speaking, Listening]
<span class="c-accent">  W  </span>  English                     Fluent [Reading, Writing, Speaking, Listening]
<span class="c-accent"> खڑ </span>  Hindustani                  Fluent [Reading, Writing, Speaking, Listening]
<span class="c-accent"> 𑀱 </span>  Sanskrit (Vedic/Classical)  Literary Philology [Reading, Writing]
<span class="c-accent">  ض  </span>  Arabic (Classical)          Literary Philology [Reading, Writing]
<span class="c-accent">  ש  </span>  Hebrew (Biblical)           Literary Philology [Reading, Writing]
<span class="c-accent">  ژ  </span>  Persian                     Textual Reading [Reading]
<span class="c-accent">  Ü  </span>  Deutsche (German)           Elementary [A1]
<span class="c-accent"> 𒀳 </span>  Sumerian                    Cuneiform Inscriptions [Reading]
------------------------------------------------------------------------
<span class="c-dim">*Self-assessed philological & linguistic competence.</span>`;
      }
    },

    lang: {
      desc: 'alias for languages',
      usage: 'lang',
      exec() {
        return commands.languages.exec();
      }
    },

    projects: {
      desc: 'list technical and institutional projects lead by Antar',
      usage: 'projects',
      exec() {
        return `<span class="c-accent ansi-bold">KEY PROJECTS & TECHNICAL SYSTEMS</span>
============================================================
<span class="c-user ansi-bold">1. Reform Commission Reports Guide</span> | <a href="https://reform.gov.bd" target="_blank" rel="noopener" class="term-link">https://reform.gov.bd</a>
   <span class="c-path">Role: Project Lead (Technical)</span> [July 2025 – September 2025]
   Supervisor: <span class="c-accent">Professor Ali Riaz</span>
   • Led the design and development of the chatbot, executing the core work that enabled the Commission’s digitalisation and improved public access to archival reports.
   • Directed research, content structuring, and system implementation, ensuring accuracy, usability, and reliability across reform reports.

<span class="c-user ansi-bold">2. Bengali OCR Engine & ML Pipeline</span>
   Stack: Python, PyTorch, OpenCV, Flask, ML Pipelines
   • Deep learning model pipeline for optical character recognition in Bengali manuscripts and historical archives.

<span class="c-user ansi-bold">3. Pseudo Linux Shell Portfolio (This Shell)</span>
   Stack: Vanilla JS, CSS3 Variables, Semantic HTML5
   • High-speed browser operating environment with virtual filesystem & rich UNIX toolchain.

<span class="c-user ansi-bold">4. NeuroSynth Audio Synthesizer</span>
   Stack: Web Audio API, WebAssembly, HTML5 Canvas
   • Real-time procedural audio synthesis, DSP filters, and visualizer suite.`;
      }
    },

    skills: {
      desc: 'show technical, analytical, research, and soft skills',
      usage: 'skills',
      exec() {
        return `<span class="c-accent ansi-bold">COMPREHENSIVE SKILLS PROFILE</span>
============================================================
<span class="c-user ansi-bold">• Programming Languages :</span> Python, HTML, CSS, JavaScript
<span class="c-user ansi-bold">• Frameworks & Libs     :</span> React, Node.js, PyTorch, NumPy, OpenCV
<span class="c-user ansi-bold">• DevOps & Tools        :</span> Git, GitHub, Docker, MS Office, AI/ML Tooling
<span class="c-user ansi-bold">• Research & Analytics  :</span> Data Analysis, Linguistic Analysis, Archival Research, Research Design
<span class="c-user ansi-bold">• Professional & Soft   :</span> Graphic Design, Financial Modelling, Data Entry, Critical Thinking, Academic Writing, Multilingual Translation`;
      }
    },

    contact: {
      desc: 'show contact details, email, phone, location, and profiles',
      usage: 'contact',
      exec() {
        return `<span class="c-accent ansi-bold">CONNECT WITH SOAIB ISLAM ANTAR (syzarn)</span>
============================================================
Location : Mirpur, Dhaka, Bangladesh
Email    : <a href="mailto:soaibislamantar@gmail.com" class="term-link">soaibislamantar@gmail.com</a>
Phone    : <span class="c-file">+880 1887-454935</span>
LinkedIn : <a href="https://www.linkedin.com/in/shoaib-islam-antor" target="_blank" rel="noopener" class="term-link">https://www.linkedin.com/in/shoaib-islam-antor</a>
GitHub   : <a href="https://github.com/syzarn" target="_blank" rel="noopener" class="term-link">https://github.com/syzarn</a>`;
      }
    },

    references: {
      desc: 'display academic and professional reference details',
      usage: 'references',
      exec() {
        return `<span class="c-accent ansi-bold">ACADEMIC & PROFESSIONAL REFERENCE</span>
============================================================
<span class="c-user ansi-bold">Ali Riaz, PhD</span>
Distinguished Professor of Political Science
Department of Politics and Government
<span class="c-path">Illinois State University, USA</span>
E-mail : <a href="mailto:ariaz@ilstu.edu" class="term-link">ariaz@ilstu.edu</a>
Mobile : <span class="c-file">+1 (309) 438-8145</span>`;
      }
    },

    reference: {
      desc: 'alias for references',
      usage: 'reference',
      exec() {
        return commands.references.exec();
      }
    },

    resume: {
      desc: 'download or view CV / resumé',
      usage: 'resume',
      exec() {
        const link = document.createElement('a');
        link.href = './files/cv.pdf';
        link.download = 'cv.pdf';
        link.target = '_blank';
        link.click();
        return `Initiating download: <a href="./files/cv.pdf" target="_blank" class="term-link">cv.pdf</a>`;
      }
    },

    cv: {
      desc: 'alias for resumé',
      usage: 'cv',
      exec() {
        return commands.resume.exec();
      }
    },

    neofetch: {
      desc: 'display stylish system specifications and ASCII branding',
      usage: 'neofetch',
      exec() {
        const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(uptimeSec / 60);
        const secs = uptimeSec % 60;
        const uptimeStr = `${mins} mins, ${secs} secs`;

        const asciiLogo = `
   <span class="c-user">/\_/\</span>  
  <span class="c-user">( o.o )</span> 
   <span class="c-user">&gt; ^ &lt;</span>  
 <span class="c-path">/  -  \\</span> 
<span class="c-path">|  rsh  |</span>
<span class="c-path"> \\_____/</span> `;

        const info = `
<span class="c-accent ansi-bold">${escapeHTML(env.NAME)}</span> [<span class="c-user">${escapeHTML(currentIP)}@syzarn</span>]
-----------------------------------------------
<span class="c-user ansi-bold">Role</span>      : Interdisciplinary Researcher & Developer
<span class="c-user ansi-bold">Location</span>  : Mirpur, Dhaka, Bangladesh
<span class="c-user ansi-bold">Education</span> : Jahangirnagar University (B.Sc. Env Sci)
<span class="c-user ansi-bold">OS</span>        : GNU/Linux (Web-x86_64)
<span class="c-user ansi-bold">Kernel</span>    : 9.12.2-rsh
<span class="c-user ansi-bold">Uptime</span>    : ${uptimeStr}
<span class="c-user ansi-bold">Shell</span>     : ${env.SHELL} (rsh v2.5)
<span class="c-user ansi-bold">Theme</span>     : ${env.THEME}
<span class="c-user ansi-bold">Languages</span> : BN, EN, HI, SA, AR, HE, FA, DE, SUX

<span style="color:#000000;background:#000000">██</span><span style="color:#ff5555;background:#ff5555">██</span><span style="color:#50fa7b;background:#50fa7b">██</span><span style="color:#f1fa8c;background:#f1fa8c">██</span><span style="color:#bd93f9;background:#bd93f9">██</span><span style="color:#ff79c6;background:#ff79c6">██</span><span style="color:#8be9fd;background:#8be9fd">██</span><span style="color:#f8f8f2;background:#f8f8f2">██</span>`;

        return `<div class="neofetch-container">
  <pre class="neofetch-logo">${asciiLogo}</pre>
  <div class="neofetch-info">${info}</div>
</div>`;
      }
    },

    fastfetch: {
      desc: 'alias for neofetch',
      usage: 'fastfetch',
      exec() {
        return commands.neofetch.exec();
      }
    },

    uname: {
      desc: 'print system information and kernel architecture',
      usage: 'uname [-a|-r|-m|-s|-n]',
      exec(args) {
        const flag = args[0] || '-s';
        if (flag === '-a') {
          return `Linux rsh 9.12.2-rsh #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`;
        } else if (flag === '-r') {
          return `9.12.2-rsh`;
        } else if (flag === '-m') {
          return `x86_64`;
        } else if (flag === '-n') {
          return 'syzarn';
        }
        return `Linux`;
      }
    },

    uptime: {
      desc: 'tell how long the system has been running',
      usage: 'uptime',
      exec() {
        const totalSecs = Math.floor((Date.now() - startTime) / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        const now = new Date().toTimeString().split(' ')[0];
        return ` ${now} up ${hrs > 0 ? hrs + ' hr, ' : ''}${mins} min, ${secs} sec,  1 user,  load average: 0.08, 0.03, 0.01`;
      }
    },

    date: {
      desc: 'display current date and time with format options',
      usage: 'date [+FORMAT]',
      exec(args) {
        const now = new Date();
        if (args.length > 0 && args[0].startsWith('+')) {
          let fmt = args[0].substring(1);
          fmt = fmt.replace(/%Y/g, now.getFullYear());
          fmt = fmt.replace(/%m/g, String(now.getMonth() + 1).padStart(2, '0'));
          fmt = fmt.replace(/%d/g, String(now.getDate()).padStart(2, '0'));
          fmt = fmt.replace(/%H/g, String(now.getHours()).padStart(2, '0'));
          fmt = fmt.replace(/%M/g, String(now.getMinutes()).padStart(2, '0'));
          fmt = fmt.replace(/%S/g, String(now.getSeconds()).padStart(2, '0'));
          fmt = fmt.replace(/%A/g, now.toLocaleString('default', { weekday: 'long' }));
          fmt = fmt.replace(/%B/g, now.toLocaleString('default', { month: 'long' }));
          fmt = fmt.replace(/%Z/g, Intl.DateTimeFormat().resolvedOptions().timeZone);
          fmt = fmt.replace(/%%/g, '%');
          return fmt;
        }
        return now.toString();
      }
    },

    cal: {
      desc: 'display a formatted calendar with current day highlighted',
      usage: 'cal [month] [year]',
      exec(args) {
        const now = new Date();
        let month = now.getMonth();
        let year = now.getFullYear();

        if (args.length === 1 && !isNaN(parseInt(args[0], 10))) {
          year = parseInt(args[0], 10);
        } else if (args.length >= 2) {
          const m = parseInt(args[0], 10);
          const y = parseInt(args[1], 10);
          if (!isNaN(m) && m >= 1 && m <= 12) month = m - 1;
          if (!isNaN(y)) year = y;
        }

        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        const monthName = start.toLocaleString('default', { month: 'long' });
        const title = `${monthName} ${year}`;
        const pad = Math.max(0, Math.floor((20 - title.length) / 2));

        let out = ' '.repeat(pad) + `<span class="c-accent ansi-bold">${escapeHTML(title)}</span>\n`;
        out += `<span class="c-dim">Su Mo Tu We Th Fr Sa</span>\n`;

        const offset = start.getDay();
        out += '   '.repeat(offset);

        const today = now.getDate();
        const isCurrentMonth = (month === now.getMonth() && year === now.getFullYear());

        for (let day = 1; day <= end.getDate(); day++) {
          const dayStr = String(day).padStart(2, ' ');
          if (isCurrentMonth && day === today) {
            out += `<span style="background:var(--prompt-user);color:var(--bg-color);font-weight:bold;">${dayStr}</span> `;
          } else {
            out += `${dayStr} `;
          }
          if ((day + offset) % 7 === 0) {
            out += '\n';
          }
        }
        return out.trimEnd();
      }
    },

    ls: {
      desc: 'list directory contents with metadata and flags',
      usage: 'ls [-a|-l|-la|-lh] [path]',
      exec(args) {
        let showAll = false;
        let longFormat = false;
        let targetPath = '.';

        for (const arg of args) {
          if (arg.startsWith('-')) {
            if (arg.includes('a')) showAll = true;
            if (arg.includes('l')) longFormat = true;
          } else {
            targetPath = arg;
          }
        }

        const resolved = resolvePath(pathStack, targetPath);
        if (!resolved) return `ls: cannot access '${targetPath}': no such file or directory`;
        if (resolved.node.type === 'file') {
          return resolved.name;
        }

        const entries = Object.keys(resolved.node.contents);
        const filtered = showAll ? ['.', '..', ...entries] : entries.filter(name => name.trim() !== '' && !name.startsWith('.'));

        if (filtered.length === 0) return '';

        if (longFormat) {
          let out = `<span class="c-dim">total ${filtered.length * 4}</span>\n`;
          for (const item of filtered) {
            let node = null;
            let isDir = false;
            let size = 4096;

            if (item === '.' || item === '..') {
              isDir = true;
            } else {
              node = resolved.node.contents[item];
              isDir = node && node.type === 'folder';
              size = isDir ? 4096 : (node.content ? node.content.length : 0);
            }

            const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const sizeStr = String(size).padStart(6, ' ');
            const dateStr = (node && node.date) ? node.date : (item === '.' ? (resolved.node.date || 'Nov 23 14:20') : 'Nov 23 14:20');

            let coloredName = item;
            if (isDir) {
              coloredName = `<span class="c-dir">${escapeHTML(item)}/</span>`;
            } else if (item.endsWith('.pdf')) {
              coloredName = `<span class="c-doc">${escapeHTML(item)}</span>`;
            } else if (item.endsWith('.url')) {
              coloredName = `<span class="c-link">${escapeHTML(item)}</span>`;
            } else if (item.endsWith('.flac') || item.endsWith('.mp3')) {
              coloredName = `<span class="c-accent">${escapeHTML(item)}</span>`;
            } else {
              coloredName = `<span class="c-file">${escapeHTML(item)}</span>`;
            }

            out += `<span class="c-dim">${perms} 1 ${env.USER} staff ${sizeStr} ${dateStr}</span> ${coloredName}\n`;
          }
          return out.trimEnd();
        }

        return filtered.map(item => {
          if (item === '.' || item === '..') return `<span class="c-dir">${item}</span>`;
          const node = resolved.node.contents[item];
          if (node && node.type === 'folder') return `<span class="c-dir">${escapeHTML(item)}/</span>`;
          if (item.endsWith('.pdf')) return `<span class="c-doc">${escapeHTML(item)}</span>`;
          if (item.endsWith('.url')) return `<span class="c-link">${escapeHTML(item)}</span>`;
          if (item.endsWith('.flac')) return `<span class="c-accent">${escapeHTML(item)}</span>`;
          return `<span class="c-file">${escapeHTML(item)}</span>`;
        }).join('  ');
      }
    },

    ll: {
      desc: 'alias for ls -la',
      usage: 'll [path]',
      exec(args) {
        return commands.ls.exec(['-la', ...args]);
      }
    },

    cd: {
      desc: 'change the current working directory',
      usage: 'cd [directory]',
      exec(args) {
        const target = args[0] || '~';
        const resolved = resolvePath(pathStack, target);

        if (!resolved) {
          return `cd: no such file or directory: ${target}`;
        }
        if (resolved.node.type === 'file') {
          return `cd: ${target}: not a directory`;
        }

        previousPathStack = [...pathStack];
        pathStack = resolved.path;
        updatePrompt();
        return '';
      }
    },

    pwd: {
      desc: 'print the current working directory',
      usage: 'pwd',
      exec() {
        if (pathStack.length === 1 && pathStack[0] === '~') {
          return `/home/${env.USER}`;
        }
        return `/home/${env.USER}/${pathStack.slice(1).join('/')}`;
      }
    },

    tree: {
      desc: 'list contents of directories in a tree-like format',
      usage: 'tree [path]',
      exec(args) {
        const target = args[0] || '.';
        const resolved = resolvePath(pathStack, target);
        if (!resolved || resolved.node.type !== 'folder') {
          return `tree: '${target}': no such directory`;
        }

        let totalDirs = 0;
        let totalFiles = 0;

        function buildTree(folderNode, prefix = '') {
          let str = '';
          const keys = Object.keys(folderNode.contents).filter(k => k.trim() !== '');
          keys.forEach((key, index) => {
            const isLast = index === keys.length - 1;
            const pointer = isLast ? '└── ' : '├── ';
            const childNode = folderNode.contents[key];

            if (childNode.type === 'folder') {
              totalDirs++;
              str += `${prefix}${pointer}<span class="c-dir">${escapeHTML(key)}/</span>\n`;
              str += buildTree(childNode, prefix + (isLast ? '    ' : '│   '));
            } else {
              totalFiles++;
              str += `${prefix}${pointer}<span class="c-file">${escapeHTML(key)}</span>\n`;
            }
          });
          return str;
        }

        let out = `<span class="c-dir">${escapeHTML(resolved.name)}</span>\n`;
        out += buildTree(resolved.node);
        out += `\n<span class="c-dim">${totalDirs} directories, ${totalFiles} files</span>`;
        return out;
      }
    },

    cat: {
      desc: 'concatenate files and print on standard output',
      usage: 'cat <file...>',
      exec(args, stdin) {
        if (args.length === 0 && stdin) return stdin;
        if (args.length === 0) return `cat: file name required`;

        const outputs = [];
        for (const fileName of args) {
          const resolved = resolvePath(pathStack, fileName);
          if (!resolved || resolved.node.type !== 'file') {
            outputs.push(`cat: ${fileName}: no such file`);
            continue;
          }

          if (fileName.endsWith('.pdf')) {
            const link = document.createElement('a');
            link.href = resolved.node.content || './files/cv.pdf';
            link.download = fileName;
            link.target = '_blank';
            link.click();
            outputs.push(`opening PDF: <a href="${link.href}" target="_blank" class="term-link">${fileName}</a>`);
          } else if (fileName.endsWith('.url')) {
            window.open(resolved.node.content, '_blank', 'noopener,noreferrer');
            outputs.push(`opening URL: <a href="${resolved.node.content}" target="_blank" class="term-link">${resolved.node.content}</a>`);
          } else if (fileName.endsWith('.flac') || fileName === 'tumi nai' || fileName.includes('tumi-nai')) {
            outputs.push(audioModule.play('tumi nai.flac'));
          } else {
            outputs.push(escapeHTML(resolved.node.content));
          }
        }
        return outputs.join('\n');
      }
    },

    head: {
      desc: 'output the first part of files',
      usage: 'head [-n lines] <file>',
      exec(args, stdin) {
        let count = 10;
        let fileName = '';

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) {
            count = parseInt(args[i + 1], 10) || 10;
            i++;
          } else if (args[i].startsWith('-') && !isNaN(parseInt(args[i].substring(1), 10))) {
            count = parseInt(args[i].substring(1), 10);
          } else {
            fileName = args[i];
          }
        }

        let content = stdin;
        if (fileName) {
          const resolved = resolvePath(pathStack, fileName);
          if (!resolved || resolved.node.type !== 'file') return `head: cannot open '${fileName}': No such file`;
          content = resolved.node.content;
        }

        if (!content) return '';
        const lines = content.split('\n');
        return lines.slice(0, count).join('\n');
      }
    },

    tail: {
      desc: 'output the last part of files',
      usage: 'tail [-n lines] <file>',
      exec(args, stdin) {
        let count = 10;
        let fileName = '';

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) {
            count = parseInt(args[i + 1], 10) || 10;
            i++;
          } else if (args[i].startsWith('-') && !isNaN(parseInt(args[i].substring(1), 10))) {
            count = parseInt(args[i].substring(1), 10);
          } else {
            fileName = args[i];
          }
        }

        let content = stdin;
        if (fileName) {
          const resolved = resolvePath(pathStack, fileName);
          if (!resolved || resolved.node.type !== 'file') return `tail: cannot open '${fileName}': no such file`;
          content = resolved.node.content;
        }

        if (!content) return '';
        const lines = content.split('\n');
        return lines.slice(-count).join('\n');
      }
    },

    touch: {
      desc: 'change file timestamps or create an empty file',
      usage: 'touch <file>',
      exec(args) {
        if (!args[0]) return `touch: missing file operand`;
        const fileName = args[0];
        const dir = resolvePath(pathStack, '.');
        if (!dir || dir.node.type !== 'folder') return `touch: cannot access current directory`;

        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[now.getMonth()];
        const d = String(now.getDate()).padStart(2, ' ');
        const t = now.toTimeString().substring(0, 5);
        const formattedDate = `${m} ${d} ${t}`;

        if (!dir.node.contents[fileName]) {
          dir.node.contents[fileName] = {
            type: 'file',
            content: '',
            date: formattedDate
          };
        } else {
          dir.node.contents[fileName].date = formattedDate;
        }
        return '';
      }
    },

    mkdir: {
      desc: 'create directories if they do not already exist',
      usage: 'mkdir [-p] <directory>',
      exec(args) {
        const dirName = args.filter(a => !a.startsWith('-'))[0];
        if (!dirName) return `mkdir: missing operand`;

        const dir = resolvePath(pathStack, '.');
        if (!dir || dir.node.type !== 'folder') return `mkdir: cannot access current directory`;

        if (dir.node.contents[dirName]) {
          return `mkdir: cannot create directory '${dirName}': File exists`;
        }

        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[now.getMonth()];
        const d = String(now.getDate()).padStart(2, ' ');
        const t = now.toTimeString().substring(0, 5);

        dir.node.contents[dirName] = {
          type: 'folder',
          contents: {},
          date: `${m} ${d} ${t}`
        };
        return '';
      }
    },

    rm: {
      desc: 'remove files or directories',
      usage: 'rm [-r|-f] <target>',
      exec(args) {
        const recursive = args.some(a => a.includes('r'));
        const target = args.filter(a => !a.startsWith('-'))[0];
        if (!target) return `rm: missing operand`;

        const resolved = resolvePath(pathStack, target);
        if (!resolved) return `rm: cannot remove '${target}': no such file or directory`;

        if (resolved.node.type === 'folder' && !recursive) {
          return `rm: cannot remove '${target}': is a directory (use -r)`;
        }

        const parent = getParentNode(resolved.path);
        if (parent && parent.contents) {
          delete parent.contents[resolved.name];
        }
        return '';
      }
    },

    cp: {
      desc: 'copy source file or directory to destination',
      usage: 'cp [-r] <source> <dest>',
      exec(args) {
        const cleanArgs = args.filter(a => !a.startsWith('-'));
        if (cleanArgs.length < 2) return `cp: missing file operand`;
        const [src, dest] = cleanArgs;

        const srcNode = resolvePath(pathStack, src);
        if (!srcNode) return `cp: cannot stat '${src}': no such file or directory`;

        const destDir = resolvePath(pathStack, dest);
        if (destDir && destDir.node.type === 'folder') {
          destDir.node.contents[srcNode.name] = JSON.parse(JSON.stringify(srcNode.node));
          return '';
        }

        const currentDir = resolvePath(pathStack, '.');
        currentDir.node.contents[dest] = JSON.parse(JSON.stringify(srcNode.node));
        return '';
      }
    },

    mv: {
      desc: 'move or rename files and directories',
      usage: 'mv <source> <dest>',
      exec(args) {
        const [src, dest] = args;
        if (!src || !dest) return `mv: missing operand`;

        const srcResolved = resolvePath(pathStack, src);
        if (!srcResolved) return `mv: cannot stat '${src}': no such file or directory`;

        const parent = getParentNode(srcResolved.path);
        if (parent && parent.contents) {
          delete parent.contents[srcResolved.name];
        }

        const currentDir = resolvePath(pathStack, '.');
        currentDir.node.contents[dest] = srcResolved.node;
        return '';
      }
    },

    echo: {
      desc: 'write arguments to standard output',
      usage: 'echo [text...]',
      exec(args, stdin) {
        let text = args.join(' ');
        text = text.replace(/\$([A-Z0-9_]+)/g, (_, key) => env[key] || '');
        return text;
      }
    },

    grep: {
      desc: 'search for patterns in file contents or piped text',
      usage: 'grep [-i|-v|-n] <pattern> [file]',
      exec(args, stdin) {
        let ignoreCase = false;
        let invert = false;
        let showLineNum = false;
        let pattern = '';
        let fileName = '';

        for (const arg of args) {
          if (arg.startsWith('-')) {
            if (arg.includes('i')) ignoreCase = true;
            if (arg.includes('v')) invert = true;
            if (arg.includes('n')) showLineNum = true;
          } else if (!pattern) {
            pattern = arg;
          } else {
            fileName = arg;
          }
        }

        if (!pattern) return `grep: pattern required`;

        let content = stdin;
        if (fileName) {
          const resolved = resolvePath(pathStack, fileName);
          if (!resolved || resolved.node.type !== 'file') return `grep: ${fileName}: no such file`;
          content = resolved.node.content;
        }

        if (!content) return '';

        const lines = content.split('\n');
        const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
        const matched = [];

        lines.forEach((line, idx) => {
          const match = regex.test(line);
          if ((match && !invert) || (!match && invert)) {
            matched.push(showLineNum ? `${idx + 1}:${line}` : line);
          }
        });

        return matched.join('\n');
      }
    },

    wc: {
      desc: 'print newline, word, and byte counts',
      usage: 'wc [-l|-w|-c] [file]',
      exec(args, stdin) {
        const fileName = args.filter(a => !a.startsWith('-'))[0];
        let content = stdin;

        if (fileName) {
          const resolved = resolvePath(pathStack, fileName);
          if (!resolved || resolved.node.type !== 'file') return `wc: ${fileName}: No such file`;
          content = resolved.node.content;
        }

        if (content === undefined || content === null) return `wc: missing input`;

        const lines = content === '' ? 0 : content.split('\n').length;
        const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        const bytes = content.length;

        return `  ${lines}  ${words}  ${bytes} ${fileName || ''}`;
      }
    },

    find: {
      desc: 'search for files in a directory hierarchy',
      usage: 'find [path] [-name pattern]',
      exec(args) {
        let target = '.';
        let pattern = '';

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-name' && args[i + 1]) {
            pattern = args[i + 1].replace(/\*/g, '.*');
            i++;
          } else if (!args[i].startsWith('-')) {
            target = args[i];
          }
        }

        const resolved = resolvePath(pathStack, target);
        if (!resolved) return `find: '${target}': no such file or directory`;

        const results = [];
        const regex = pattern ? new RegExp(pattern) : null;

        function traverse(node, currentPath) {
          if (!regex || regex.test(node.name || '')) {
            results.push(currentPath);
          }
          if (node.type === 'folder' && node.contents) {
            for (const childName of Object.keys(node.contents)) {
              if (childName.trim() === '') continue;
              traverse({ ...node.contents[childName], name: childName }, `${currentPath}/${childName}`);
            }
          }
        }

        traverse({ ...resolved.node, name: resolved.name }, target);
        return results.join('\n');
      }
    },

    open: {
      desc: 'open a URL, file, or downloadable document',
      usage: 'open <target>',
      exec(args) {
        if (!args[0]) return `open: target required`;
        const target = args[0];

        if (target.startsWith('http://') || target.startsWith('https://')) {
          window.open(target, '_blank', 'noopener,noreferrer');
          return `Opening: <a href="${escapeHTML(target)}" target="_blank" class="term-link">${escapeHTML(target)}</a>`;
        }

        const resolved = resolvePath(pathStack, target);
        if (resolved && resolved.node.type === 'file') {
          return commands.cat.exec([target]);
        }
        return `open: cannot open '${target}'`;
      }
    },

    top: {
      desc: 'display simulated Linux processes and CPU utilization',
      usage: 'top',
      exec() {
        return `<span class="c-accent ansi-bold">Tasks: 42 total, 1 running, 41 sleeping, 0 stopped</span>
%Cpu(s): <span class="c-user">3.2 us</span>, <span class="c-path">1.1 sy</span>, <span class="c-dim">0.0 ni, 95.7 id</span>
MiB Mem : <span class="c-user">16384.0 total</span>, <span class="c-path">11240.2 free</span>, <span class="c-accent">5143.8 used</span>

<span class="c-dim">  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND</span>
    1 root      20   0  168540  12480   8420 S   0.0   0.1   0:01.42 systemd
  128 syzarn    20   0  784120  42100  28400 S   1.8   0.4   0:04.12 rsh-server
  256 syzarn    20   0  512400  68900  38120 S   2.4   0.6   0:12.30 web-engine
  480 syzarn    20   0   48200   6420   4100 R   0.8   0.1   0:00.08 top
 1024 syzarn    20   0  240180  32100  18400 S   0.0   0.3   0:02.15 ocr-worker`;
      }
    },

    htop: {
      desc: 'alias for top',
      usage: 'htop',
      exec() {
        return commands.top.exec();
      }
    },

    ps: {
      desc: 'report a snapshot of the current processes',
      usage: 'ps [aux]',
      exec() {
        return `<span class="c-dim">USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND</span>
root         1  0.0  0.1 168540 12480 ?        Ss   12:00   0:01 /sbin/init
syzarn     128  0.2  0.4 784120 42100 pts/0    Ss   12:00   0:04 -rsh
syzarn     256  0.4  0.6 512400 68900 pts/0    S    12:00   0:12 node server.js
syzarn     780  0.0  0.1  18400  3200 pts/0    R+   12:05   0:00 ps aux`;
      }
    },

    free: {
      desc: 'display amount of free and used memory in the system',
      usage: 'free [-m|-h]',
      exec() {
        return `               total        used        free      shared  buff/cache   available
Mem:        16384000     5143800    11240200      124000     2840000    11000000
Swap:        4194304           0     4194304`;
      }
    },

    df: {
      desc: 'report file system disk space usage',
      usage: 'df [-h]',
      exec() {
        return `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2  468G   42G  403G  10% /
/dev/nvme0n1p1  512M   16M  496M   4% /boot/efi
tmpfs           7.8G  1.2M  7.8G   1% /run`;
      }
    },

    env: {
      desc: 'display environment variables',
      usage: 'env',
      exec() {
        return Object.entries(env)
          .map(([k, v]) => `<span class="c-user">${escapeHTML(k)}</span>=<span class="c-file">${escapeHTML(v)}</span>`)
          .join('\n');
      }
    },

    export: {
      desc: 'set or update an environment variable',
      usage: 'export KEY=VALUE',
      exec(args) {
        if (!args[0]) return commands.env.exec();
        const pair = args.join(' ');
        const idx = pair.indexOf('=');
        if (idx === -1) return `export: usage: export KEY=VALUE`;

        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        env[key] = val;
        if (key === 'THEME') applyTheme(val);
        if (key === 'FONT') applyFont(val);
        updatePrompt();
        return '';
      }
    },

    hostname: {
      desc: 'show or change system hostname',
      usage: 'hostname [new-name]',
      exec(args) {
        if (args[0]) {
          env.HOSTNAME = args[0];
          updatePrompt();
          return '';
        }
        return env.HOSTNAME;
      }
    },

    ping: {
      desc: 'send simulated ICMP ECHO_REQUEST to network hosts',
      usage: 'ping <host>',
      exec(args) {
        const host = args[0] || 'github.com';
        const ip = (host === 'localhost' || host === '127.0.0.1') ? '127.0.0.1' : '140.82.121.4';

        let out = `PING ${host} (${ip}) 56(84) bytes of data.\n`;
        const latencies = [18.4, 21.2, 19.8, 20.5];
        latencies.forEach((ms, i) => {
          out += `64 bytes from ${ip}: icmp_seq=${i + 1} ttl=116 time=${ms} ms\n`;
        });
        out += `\n--- ${host} ping statistics ---\n`;
        out += `4 packets transmitted, 4 received, 0% packet loss, time 3004ms\n`;
        out += `rtt min/avg/max/mdev = 18.400/19.975/21.200/1.020 ms`;
        return out;
      }
    },

    curl: {
      desc: 'transfer data from or to a server / simulate web request',
      usage: 'curl [-I|-s] <url>',
      exec(args) {
        if (!args[0]) return `curl: try 'curl --help' or 'curl <url>'`;
        const url = args.filter(a => !a.startsWith('-'))[0];

        if (url.includes('ipify')) return JSON.stringify({ ip: currentIP });
        if (url.includes('wttr.in')) return commands.weather.exec([]);
        if (url.includes('github.com')) {
          return JSON.stringify({
            login: 'syzarn',
            name: 'Soaib Islam Antar',
            bio: 'Interdisciplinary Researcher & Developer',
            location: 'Mirpur, Dhaka, Bangladesh',
            public_repos: 18,
            status: 'online'
          }, null, 2);
        }

        return `HTTP/2 200 \ncontent-type: text/plain; charset=utf-8\nstatus: connected to ${escapeHTML(url)}`;
      }
    },

    wget: {
      desc: 'simulate downloading files through HTTP/HTTPS',
      usage: 'wget <url>',
      exec(args) {
        if (!args[0]) return `wget: missing URL`;
        const url = args[0];
        const filename = url.split('/').pop() || 'index.html';
        return `--2026-08-19 12:00:00--  ${escapeHTML(url)}
Resolving host... connected.
HTTP request sent, awaiting response... 200 OK
Length: 24300837 (23M) [application/octet-stream]
Saving to: '${escapeHTML(filename)}'

[================================================>] 100%  --.-KB/s  in 0.2s

Saved '${escapeHTML(filename)}'.`;
      }
    },

    weather: {
      desc: 'display weather forecast report for current or target city',
      usage: 'weather [city]',
      exec(args) {
        const city = args[0] || 'Dhaka';
        return `<span class="c-accent ansi-bold">Weather Forecast: ${escapeHTML(city)}</span>
┌──────────────┬──────────────┬──────────────┐
│   Morning    │     Noon     │   Evening    │
├──────────────┼──────────────┼──────────────┤
│  <span class="c-warn">☀ Sunny</span>     │  <span class="c-warn">☀ Clear</span>     │  <span class="c-path">☁ Light Breeze</span>│
│   28 °C      │   32 °C      │   27 °C      │
│  Humidity:65%│  Humidity:58%│  Humidity:72%│
└──────────────┴──────────────┴──────────────┘
<span class="c-dim">Wind: 12 km/h SW · Precipitation: 0% · UV Index: Moderate</span>`;
      }
    },

    wttr: {
      desc: 'alias for weather',
      usage: 'wttr [city]',
      exec(args) {
        return commands.weather.exec(args);
      }
    },

    ifconfig: {
      desc: 'display network interface configuration',
      usage: 'ifconfig',
      exec() {
        return `<span class="c-user">eth0:</span> flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet ${currentIP}  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 02:42:ac:11:00:02  txqueuelen 1000  (Ethernet)
        RX packets 142802  bytes 98124021 (98.1 MB)
        TX packets 112040  bytes 42109840 (42.1 MB)

<span class="c-user">lo:</span> flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`;
      }
    },

    ip: {
      desc: 'show IP routing and network addresses',
      usage: 'ip a',
      exec() {
        return commands.ifconfig.exec();
      }
    },

    nslookup: {
      desc: 'query Internet name servers interactively',
      usage: 'nslookup <domain>',
      exec(args) {
        const domain = args[0] || 'reform.gov.bd';
        return `Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   ${escapeHTML(domain)}
Address: 103.48.16.12`;
      }
    },

    theme: {
      desc: 'switch terminal color scheme (matrix, catppuccin, nord, dracula, gruvbox, cyberpunk, amber, monokai, light)',
      usage: 'theme [name]',
      exec(args) {
        const valid = ['matrix', 'catppuccin', 'nord', 'dracula', 'gruvbox', 'cyberpunk', 'amber', 'monokai', 'light'];
        if (!args[0]) {
          return `Current theme: <span class="c-accent">${env.THEME}</span>\nAvailable themes: ${valid.join(', ')}\nUsage: 'theme &lt;name&gt;'`;
        }
        const name = args[0].toLowerCase();
        if (applyTheme(name)) {
          return `Theme switched to: <span class="c-accent">${name}</span>`;
        }
        return `theme: invalid theme '${name}'. Available: ${valid.join(', ')}`;
      }
    },

    font: {
      desc: 'switch terminal font (tx02, jetbrains, cartograph, system)',
      usage: 'font [name]',
      exec(args) {
        const valid = ['tx02', 'jetbrains', 'cartograph', 'system'];
        if (!args[0]) {
          return `Current font: <span class="c-accent">${env.FONT}</span>\nAvailable fonts: ${valid.join(', ')}\nUsage: 'font &lt;name&gt;'`;
        }
        const name = args[0].toLowerCase();
        if (applyFont(name)) {
          return `Font family switched to: <span class="c-accent">${name}</span>`;
        }
        return `font: invalid font '${name}'. Available: ${valid.join(', ')}`;
      }
    },

    music: {
      desc: 'terminal audio music player (play, pause, stop, status, vol)',
      usage: 'music [play|pause|stop|status|vol <0-100>]',
      exec(args) {
        const sub = args[0] ? args[0].toLowerCase() : 'play';
        if (sub === 'play') {
          return audioModule.play(args[1] || 'tumi nai.flac');
        } else if (sub === 'pause') {
          return audioModule.pause();
        } else if (sub === 'stop') {
          return audioModule.stop();
        } else if (sub === 'status') {
          return audioModule.status();
        } else if (sub === 'vol' || sub === 'volume') {
          return audioModule.setVolume(args[1]);
        }
        return `music: unknown action '${sub}'. Usage: 'music [play|pause|stop|status|vol <0-100>]'`;
      }
    },

    play: {
      desc: 'alias for music play',
      usage: 'play [file]',
      exec(args) {
        return commands.music.exec(['play', ...args]);
      }
    },

    matrix: {
      desc: 'start digital matrix rain animation',
      usage: 'matrix',
      exec() {
        matrixModule.start();
        return '';
      }
    },

    snake: {
      desc: 'play ASCII snake game',
      usage: 'snake',
      exec() {
        snakeModule.start();
        return '';
      }
    },

    cowsay: {
      desc: 'an ASCII cow that speaks your mind',
      usage: 'cowsay [message...]',
      exec(args, stdin) {
        const msg = (args.length > 0 ? args.join(' ') : (stdin || "I'm not a donkey.")).trim();
        const len = msg.length;
        const border = '-'.repeat(len + 2);

        return ` ${border}
< ${escapeHTML(msg)} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
      }
    },

    fortune: {
      desc: 'print a random quote or aphorism',
      usage: 'fortune',
      exec() {
        const quotes = [
          `[work in progress...]`,
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
      }
    },

    sl: {
      desc: 'steam locomotive ASCII train animation',
      usage: 'sl',
      exec() {
        return `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ _____ \\   (|) |         |
   /     |  |   H  |  |   | |   | |       |_________|
  |      |  |   H  |__--------------------| [ANTAR] |
  | ________|___H__/__|_____/[][]~\\_______|_________|
  |/ |   |_____I_____I_____/_____\\_____I_____I_____I
__(@)(@)--------------------------------------(@)(@)__`;
      }
    },

    figlet: {
      desc: 'generate large ASCII banner text',
      usage: 'figlet [text...]',
      exec(args) {
        const text = args.join(' ') || 'ANTAR';
        return `
  ____  _   _ _____   _    ____  _   _ 
 / ___|| | | |__  /  / \\  |  _ \\| \\ | |
 \\___ \\| |_| | / /  / _ \\ | |_) |  \\| |
  ___) |  _  |/ /_ / ___ \\|  _ <| |\\  |
 |____/|_| |_/____/_/   \\_\\_| \\_\\_| \\_|
 >> Output for: ${escapeHTML(text)}`;
      }
    },

    sudo: {
      desc: 'execute a command with superuser privileges',
      usage: 'sudo <command>',
      exec(args) {
        const cmd = args.join(' ');
        if (!cmd) return `sudo: a command is required`;
        return `<span class="c-err">[sudo] password for ${env.USER}: </span>\n${env.USER} is not in the sudoers file. This incident will be reported.`;
      }
    },

    history: {
      desc: 'display the command history list',
      usage: 'history [-c]',
      exec(args) {
        if (args[0] === '-c') {
          commandHistory = [];
          try {
            localStorage.removeItem('syzarn_history');
          } catch (e) { }
          return `Command history cleared.`;
        }

        if (commandHistory.length === 0) return `History is empty.`;
        return commandHistory.map((cmd, i) => `<span class="c-dim">${String(i + 1).padStart(4, ' ')}</span>  ${escapeHTML(cmd)}`).join('\n');
      }
    },

    clear: {
      desc: 'clear the terminal screen',
      usage: 'clear',
      exec() {
        terminalHistory.innerHTML = '';
        return '';
      }
    },

    cls: {
      desc: 'alias for clear',
      usage: 'cls',
      exec() {
        return commands.clear.exec();
      }
    },

    reset: {
      desc: 'reset terminal state and restore default virtual filesystem',
      usage: 'reset',
      exec() {
        fileSystem = JSON.parse(JSON.stringify(defaultFileSystem));
        pathStack = ['~'];
        terminalHistory.innerHTML = '';
        updatePrompt();
        return `System reset. Virtual filesystem restored to factory state.`;
      }
    },

    reboot: {
      desc: 'reboot the web machine session',
      usage: 'reboot',
      exec() {
        terminalHistory.innerHTML = '<span class="c-accent">Rebooting pseudo machine...</span>';
        setTimeout(() => {
          commands.reset.exec();
          renderWelcomeBanner();
        }, 600);
        return '';
      }
    },

    exit: {
      desc: 'terminate the current shell session',
      usage: 'exit',
      exec() {
        terminalHistory.innerHTML += `<div class="output"><span class="c-err">Session terminated. Type 'reboot' or refresh page to restart.</span></div>`;
        hiddenInput.disabled = true;
        return '';
      }
    }
  };

  function parseCommandLine(rawInput) {
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(rawInput)) !== null) {
      tokens.push(match[1] || match[2] || match[0]);
    }
    return tokens;
  }

  function executePipeline(pipelineString) {
    let redirectMode = null;
    let redirectFile = null;
    let commandPart = pipelineString;

    if (pipelineString.includes('>>')) {
      redirectMode = '>>';
      const parts = pipelineString.split('>>');
      commandPart = parts[0];
      redirectFile = parts[1].trim();
    } else if (pipelineString.includes('>')) {
      redirectMode = '>';
      const parts = pipelineString.split('>');
      commandPart = parts[0];
      redirectFile = parts[1].trim();
    }

    const pipeStages = commandPart.split('|').map(s => s.trim()).filter(Boolean);
    let stageInput = null;

    for (let i = 0; i < pipeStages.length; i++) {
      const stageStr = pipeStages[i];
      const tokens = parseCommandLine(stageStr);
      if (tokens.length === 0) continue;

      const cmdName = tokens[0].toLowerCase();
      const args = tokens.slice(1);

      const cmdObj = commands[cmdName];
      if (!cmdObj) {
        return `<span class="c-err">${escapeHTML(cmdName)}: command not found. type 'help' for commands.</span>`;
      }

      try {
        stageInput = cmdObj.exec(args, stageInput);
      } catch (err) {
        console.error(err);
        return `<span class="c-err">${escapeHTML(cmdName)}: execution error: ${escapeHTML(err.message)}</span>`;
      }
    }

    if (redirectFile && stageInput !== null && stageInput !== undefined) {
      const currentDir = resolvePath(pathStack, '.');
      if (currentDir && currentDir.node.type === 'folder') {
        const plainOutput = String(stageInput).replace(/<[^>]*>/g, '');
        if (redirectMode === '>>' && currentDir.node.contents[redirectFile]) {
          currentDir.node.contents[redirectFile].content += '\n' + plainOutput;
        } else {
          currentDir.node.contents[redirectFile] = {
            type: 'file',
            content: plainOutput
          };
        }
        return '';
      }
    }

    return stageInput;
  }

  function updateInputDisplay() {
    cliText.textContent = currentInputBuffer;
    hiddenInput.value = currentInputBuffer;
  }

  function focusInput() {
    if (!hiddenInput.disabled) {
      hiddenInput.focus();
    }
  }

  function handleTabCompletion() {
    const text = currentInputBuffer;
    const tokens = text.split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';

    if (tokens.length <= 1) {
      const allCmds = Object.keys(commands);
      const matches = allCmds.filter(c => c.startsWith(lastToken.toLowerCase()));

      if (matches.length === 1) {
        currentInputBuffer = matches[0] + ' ';
        cursorPosition = currentInputBuffer.length;
        updateInputDisplay();
      } else if (matches.length > 1) {
        printCommandLine(currentInputBuffer);
        printOutput(formatColumns(matches, 14));
      }
    } else {
      let dirPath = '.';
      let filePrefix = lastToken;

      if (lastToken.includes('/')) {
        const lastSlash = lastToken.lastIndexOf('/');
        dirPath = lastToken.substring(0, lastSlash) || '/';
        filePrefix = lastToken.substring(lastSlash + 1);
      }

      const resolved = resolvePath(pathStack, dirPath);
      if (resolved && resolved.node.type === 'folder') {
        const entries = Object.keys(resolved.node.contents).filter(k => k.trim() !== '');
        const matches = entries.filter(e => e.startsWith(filePrefix));

        if (matches.length === 1) {
          const matchedName = matches[0];
          const isDir = resolved.node.contents[matchedName].type === 'folder';
          const completion = (dirPath === '.' ? '' : dirPath + '/') + matchedName + (isDir ? '/' : ' ');
          tokens[tokens.length - 1] = completion;
          currentInputBuffer = tokens.join(' ');
          cursorPosition = currentInputBuffer.length;
          updateInputDisplay();
        } else if (matches.length > 1) {
          printCommandLine(currentInputBuffer);
          printOutput(formatColumns(matches, 16));
        }
      }
    }
  }

  hiddenInput.addEventListener('input', (e) => {
    currentInputBuffer = hiddenInput.value;
    cursorPosition = hiddenInput.selectionStart || currentInputBuffer.length;
    updateInputDisplay();
  });

  window.addEventListener('keydown', (e) => {
    if (activeInteractiveMode === 'snake') {
      snakeModule.handleKey(e);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      return;
    }

    if (activeInteractiveMode === 'matrix') {
      matrixModule.stop();
      e.preventDefault();
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      commands.clear.exec();
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      printCommandLine(currentInputBuffer + '^C');
      currentInputBuffer = '';
      historyIndex = -1;
      updateInputDisplay();
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      currentInputBuffer = '';
      updateInputDisplay();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const rawCmd = currentInputBuffer.trim();

      printCommandLine(currentInputBuffer);

      if (rawCmd) {
        commandHistory.push(rawCmd);
        if (commandHistory.length > 200) commandHistory.shift();
        try {
          localStorage.setItem('syzarn_history', JSON.stringify(commandHistory));
        } catch (err) { }
        historyIndex = -1;

        const output = executePipeline(rawCmd);
        if (output !== undefined && output !== null && String(output).trim() !== '') {
          printOutput(output, true);
        }
      }

      currentInputBuffer = '';
      updateInputDisplay();
      focusInput();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
          historyIndex--;
        }
        currentInputBuffer = commandHistory[historyIndex] || '';
        updateInputDisplay();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          currentInputBuffer = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          currentInputBuffer = '';
        }
        updateInputDisplay();
      }
      return;
    }

    focusInput();
  });

  terminalContainer.addEventListener('click', (e) => {
    if (activeInteractiveMode) return;
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      focusInput();
    }
  });

  // Mobile toolbar
  const mobileBar = document.getElementById('mobile-bar');
  if (mobileBar) {
    mobileBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.mob-btn');
      if (!btn) return;

      const key = btn.dataset.key;
      const cmd = btn.dataset.cmd;

      if (key === 'Tab') {
        handleTabCompletion();
      } else if (key === 'ArrowUp') {
        if (commandHistory.length > 0) {
          if (historyIndex === -1) historyIndex = commandHistory.length - 1;
          else if (historyIndex > 0) historyIndex--;
          currentInputBuffer = commandHistory[historyIndex] || '';
          updateInputDisplay();
        }
      } else if (key === 'ArrowDown') {
        if (historyIndex !== -1) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentInputBuffer = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            currentInputBuffer = '';
          }
          updateInputDisplay();
        }
      } else if (cmd) {
        currentInputBuffer = cmd;
        printCommandLine(cmd);
        commandHistory.push(cmd);
        const output = executePipeline(cmd);
        if (output !== undefined && output !== null && String(output).trim() !== '') {
          printOutput(output, true);
        }
        currentInputBuffer = '';
        updateInputDisplay();
      }
      focusInput();
    });
  }

  function renderWelcomeBanner() {
    bannerEl.innerHTML = `type 'help' for commands. quick: 'cv', 'experience', 'works', 'languages', 'projects', 'skills'`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderWelcomeBanner();
    updatePrompt();
    updateInputDisplay();
    focusInput();
  });

  window.addEventListener('load', () => {
    focusInput();
  });

})();
