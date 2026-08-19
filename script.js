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

        'text-tools': {
          type: 'folder',
          date: 'Aug 20 14:00',
          contents: {
            'encoding-tools.txt': {
              type: 'file',
              date: 'Aug 20 14:05',
              content: `ENCODING & WEB UTILITIES (encoding.js integration)
============================================================
• urlencode / urldecode     : Percent-encoding (%xx) for URIs (UTF-8, SJIS, EUC-JP)
• base64 / b64              : Base64 encoding & decoding (base64 -d to decode)
• detect-encoding / chardet : Detect character encoding (UTF-8, SJIS, EUC-JP, JIS, ASCII, UTF-16)
• iconv / reencode          : Convert character encoding between formats (iconv -t SJIS)
• zenkaku / hankaku / kana  : Full-width / half-width and Hiragana / Katakana conversion
• punycode / idn            : International Domain Name & Punycode (RFC 3492/5891) converter`
            },
            'README.txt': {
              type: 'file',
              date: 'Aug 20 14:00',
              content: `TEXT MANIPULATION & UTILITY SUITE
============================================================
All 27 text-manipulation utilities are integrated into rsh.
You can run them directly as shell commands, pipe them together,
or launch the interactive visual workbench with 'textmanip ui'.

Quick Commands:
• count       : Character, word, sentence, line & frequency analysis
• replace     : Find and replace with regex / literal support
• case        : Letter case converter (upper, lower, title, camel, snake, etc.)
• unaccent    : Strip diacritics and accents
• trim        : Remove unwanted and duplicate spaces
• prefix/sfx  : Add prefix and/or suffix to each line
• wrap        : Add or remove line breaks, word wrap at width
• join        : Join lines with custom delimiter / merge columns
• uniq        : Deduplicate lines
• compact     : Remove empty and whitespace-only lines
• filter      : Remove lines containing or not containing patterns
• sort        : Sort lines (alphabetical, natural, length, random, column)
• seq         : Generate number sequences
• nl          : Number each line
• binary      : 8-bit binary text encoder / decoder
• disemvowel  : Remove vowels and lookup word roots
• encrypt     : TEA 128-bit encryption / decryption
• rev         : Reverse characters, words, letters, or upside-down text
• rot13       : ROT13 and Caesar cipher
• scramble    : Scramble and descramble words
• comb        : Mathematical combination generator
• perm        : Mathematical permutation generator
• rng         : Random number generator
• randstr     : Random string generator
• shuffle     : Randomize string or delimited elements
• cut         : Extract delimited columns
• unicode     : Unicode entity encoder (HTML, Hex, UTF-16, C-escapes)
• textmanip   : Master utility suite & Workbench launcher ('textmanip ui')`
            },
            'ciphers.txt': {
              type: 'file',
              date: 'Aug 20 14:00',
              content: `CIPHERS & OBFUSCATION TOOLS
============================================================
• rot13 [text]                     : ROT13 cipher
• caesar -n 7 [text]               : Caesar shift cipher (shift N)
• binary -e "Hello"                : Text to 8-bit binary
• binary -d "01001000 01101001"    : Binary to text
• encrypt -p secret "My Data"      : TEA 128-bit Base64 encryption
• decrypt -p secret "<ciphertext>" : TEA decryption
• disemvowel "Hello World"         : Strip vowels
• scramble "Computer Science"      : Internal word letter scrambler`
            },
            'generators.txt': {
              type: 'file',
              date: 'Aug 20 14:00',
              content: `GENERATORS & RANDOMIZERS
============================================================
• seq 1 100                        : Generate sequence 1 to 100
• seq 1 10 2 --pad                 : Stepped zero-padded sequence
• rng -n 5 -min 10 -max 99         : Generate 5 random numbers
• randstr -n 3 -l 16               : Generate 3 random 16-char strings
• comb -k 2 a b c d                : Combinations of size 2
• perm a b c                       : Permutations of items
• shuffle "apple banana orange"    : Randomize list items`
            },
            'line-tools.txt': {
              type: 'file',
              date: 'Aug 20 14:00',
              content: `LINE PROCESSING & FILTERS
============================================================
• sort -n file.txt                 : Natural numeric sort
• sort -l file.txt                 : Sort lines by length
• uniq file.txt                    : Deduplicate lines
• filter -v "error" file.txt       : Exclude lines with "error"
• nl -w 3 -s ". " file.txt         : Number each line
• prefix "> " file.txt             : Prefix lines with blockquote
• join -d ", " file.txt            : Join lines with comma
• wrap --width 60 file.txt         : Word-wrap lines at 60 chars`
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

  function extractTextInput(args, stdin, options = {}) {
    if (stdin !== undefined && stdin !== null && stdin !== '') {
      return { text: String(stdin), isPipe: true };
    }
    const positional = [];
    const flags = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a.startsWith('-')) {
        flags.push(a);
      } else {
        positional.push(a);
      }
    }

    if (positional.length === 1 && !options.treatSingleAsText) {
      const candidatePath = positional[0];
      const resolved = resolvePath(pathStack, candidatePath);
      if (resolved && resolved.node.type === 'file') {
        return { text: resolved.node.content, isFile: true, fileName: candidatePath };
      }
    }

    if (positional.length > 0) {
      return { text: positional.join(' '), isInline: true };
    }

    return { text: '', isEmpty: true };
  }

  const textManipWorkbench = {
    modalEl: null,
    activeToolId: 'count',
    history: [],
    historyIndex: -1,
    wrapMode: 'off',

    init() {
      this.modalEl = document.getElementById('textmanip-workbench');
      if (!this.modalEl || this.modalEl.dataset.initialized) return;
      this.modalEl.dataset.initialized = 'true';

      const categories = {};
      if (window.TextEngine && window.TextEngine.toolsCatalog) {
        window.TextEngine.toolsCatalog.forEach(tool => {
          if (!categories[tool.category]) categories[tool.category] = [];
          categories[tool.category].push(tool);
        });
      }

      let sidebarHtml = '';
      for (const [catName, tools] of Object.entries(categories)) {
        sidebarHtml += `<div class="tm-cat-title">${escapeHTML(catName)}</div>`;
        for (const t of tools) {
          sidebarHtml += `<button type="button" class="tm-tool-item ${t.id === this.activeToolId ? 'active' : ''}" data-tool-id="${escapeHTML(t.id)}"><span>${escapeHTML(t.name)}</span></button>`;
        }
      }

      this.modalEl.innerHTML = `
        <div class="tm-window" role="dialog" aria-label="text manipulation workbench">
          <div class="tm-header">
            <div class="tm-title">
              <span>text manipulation workbench</span>
              <span class="tm-badge" id="tm-active-tool-badge">count characters words sentences lines</span>
            </div>
            <button type="button" class="tm-close-btn" id="tm-close-btn" title="close workbench (esc)">✕ close [esc]</button>
          </div>
          <div class="tm-body">
            <div class="tm-sidebar" id="tm-sidebar">
              ${sidebarHtml}
            </div>
            <div class="tm-main">
              <div class="tm-toolbar">
                <div class="tm-toolbar-group">
                  <label class="tm-btn" style="cursor:pointer;">
                    load file
                    <input type="file" id="tm-file-input" style="display:none;">
                  </label>
                  <button type="button" class="tm-btn" id="tm-save-btn">save file</button>
                  <button type="button" class="tm-btn" id="tm-copy-btn">copy</button>
                  <button type="button" class="tm-btn" id="tm-undo-btn">undo</button>
                  <button type="button" class="tm-btn" id="tm-clear-btn">clear</button>
                </div>
                <div class="tm-toolbar-group">
                  <button type="button" class="tm-btn" id="tm-wrap-btn">wrap: off</button>
                  <button type="button" class="tm-btn tm-btn-primary" id="tm-run-btn">▶ run tool</button>
                </div>
              </div>
              <div class="tm-editor-area">
                <textarea class="tm-line-counter" id="tm-line-counter" readonly wrap="off" tabindex="-1">1.</textarea>
                <textarea class="tm-textarea" id="tm-textarea" placeholder="Enter or paste text here, or load a file..." wrap="off" spellcheck="false"></textarea>
              </div>
              <div class="tm-controls-pane" id="tm-controls-pane">
                <div id="tm-controls-content"></div>
              </div>
              <div class="tm-stats-bar">
                <div class="tm-stats-items">
                  <div class="tm-stats-item">Chars: <span id="tm-stat-chars">0</span></div>
                  <div class="tm-stats-item">Words: <span id="tm-stat-words">0</span></div>
                  <div class="tm-stats-item">Sentences: <span id="tm-stat-sent">0</span></div>
                  <div class="tm-stats-item">Lines: <span id="tm-stat-lines">0</span></div>
                  <div class="tm-stats-item">Bytes: <span id="tm-stat-bytes">0</span></div>
                </div>
                <div id="tm-status-msg" style="color: var(--accent-color);">Ready</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const closeBtn = document.getElementById('tm-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      const sidebar = document.getElementById('tm-sidebar');
      if (sidebar) {
        sidebar.addEventListener('click', (e) => {
          const item = e.target.closest('.tm-tool-item');
          if (item && item.dataset.toolId) {
            this.selectTool(item.dataset.toolId);
          }
        });
      }

      const textarea = document.getElementById('tm-textarea');
      const lineCounter = document.getElementById('tm-line-counter');
      if (textarea && lineCounter) {
        textarea.addEventListener('input', () => {
          this.updateLineCounter();
          this.updateStats();
        });
        textarea.addEventListener('scroll', () => {
          lineCounter.scrollTop = textarea.scrollTop;
        });
      }

      const runBtn = document.getElementById('tm-run-btn');
      if (runBtn) runBtn.addEventListener('click', () => this.runActiveTool());

      const undoBtn = document.getElementById('tm-undo-btn');
      if (undoBtn) undoBtn.addEventListener('click', () => this.undo());

      const clearBtn = document.getElementById('tm-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (textarea && textarea.value) {
            this.saveHistory();
            textarea.value = '';
            this.updateLineCounter();
            this.updateStats();
          }
        });
      }

      const copyBtn = document.getElementById('tm-copy-btn');
      if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(textarea.value).then(() => {
            this.setStatus('Text copied to clipboard!');
          }).catch(() => {
            textarea.select();
            document.execCommand('copy');
            this.setStatus('Text copied!');
          });
        });
      }

      const wrapBtn = document.getElementById('tm-wrap-btn');
      if (wrapBtn && textarea) {
        wrapBtn.addEventListener('click', () => {
          if (this.wrapMode === 'off') {
            this.wrapMode = 'on';
            textarea.setAttribute('wrap', 'soft');
            wrapBtn.textContent = 'Wrap: ON';
          } else {
            this.wrapMode = 'off';
            textarea.setAttribute('wrap', 'off');
            wrapBtn.textContent = 'Wrap: OFF';
          }
          this.updateLineCounter();
        });
      }

      const fileInput = document.getElementById('tm-file-input');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              if (textarea) {
                this.saveHistory();
                textarea.value = ev.target.result;
                this.updateLineCounter();
                this.updateStats();
                this.setStatus(`Loaded ${file.name} (${file.size} bytes)`);
              }
            };
            reader.readAsText(file);
          }
        });
      }

      const saveBtn = document.getElementById('tm-save-btn');
      if (saveBtn && textarea) {
        saveBtn.addEventListener('click', () => {
          const blob = new Blob([textarea.value], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'manipulated_text.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.setStatus('Saved as manipulated_text.txt');
        });
      }

      this.selectTool(this.activeToolId);
    },

    open(toolId = 'count', initialText = '') {
      this.init();
      if (!this.modalEl) return;
      this.modalEl.style.display = 'flex';
      this.modalEl.setAttribute('aria-hidden', 'false');
      activeInteractiveMode = 'textmanip';

      const textarea = document.getElementById('tm-textarea');
      if (textarea && initialText) {
        textarea.value = initialText;
      }
      if (toolId) {
        this.selectTool(toolId);
      }
      this.updateLineCounter();
      this.updateStats();
      if (textarea) textarea.focus();
    },

    close() {
      if (this.modalEl) {
        this.modalEl.style.display = 'none';
        this.modalEl.setAttribute('aria-hidden', 'true');
      }
      activeInteractiveMode = null;
      focusInput();
    },

    setStatus(msg) {
      const el = document.getElementById('tm-status-msg');
      if (el) {
        el.textContent = msg;
        setTimeout(() => {
          if (el.textContent === msg) el.textContent = 'Ready';
        }, 4000);
      }
    },

    saveHistory() {
      const textarea = document.getElementById('tm-textarea');
      if (!textarea) return;
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(textarea.value);
      if (this.history.length > 30) this.history.shift();
      this.historyIndex = this.history.length - 1;
    },

    undo() {
      const textarea = document.getElementById('tm-textarea');
      if (!textarea) return;
      if (this.historyIndex >= 0 && this.history[this.historyIndex] !== undefined) {
        textarea.value = this.history[this.historyIndex];
        this.historyIndex--;
        this.updateLineCounter();
        this.updateStats();
        this.setStatus('Undo applied');
      } else {
        this.setStatus('No more undo history');
      }
    },

    selectTool(toolId) {
      this.activeToolId = toolId;
      const items = document.querySelectorAll('.tm-tool-item');
      items.forEach(el => {
        if (el.dataset.toolId === toolId) {
          el.classList.add('active');
          const badge = document.getElementById('tm-active-tool-badge');
          if (badge) badge.textContent = el.textContent.trim();
        } else {
          el.classList.remove('active');
        }
      });

      this.renderToolControls(toolId);
    },

    updateLineCounter() {
      const textarea = document.getElementById('tm-textarea');
      const counter = document.getElementById('tm-line-counter');
      if (!textarea || !counter) return;

      if (this.wrapMode === 'on') {
        counter.value = '';
        return;
      }

      const lines = textarea.value.split('\n').length;
      const numbers = [];
      for (let i = 1; i <= lines; i++) {
        numbers.push(i + '.');
      }
      counter.value = numbers.join('\n');
      counter.scrollTop = textarea.scrollTop;
    },

    updateStats() {
      const textarea = document.getElementById('tm-textarea');
      if (!textarea || !window.TextEngine) return;
      const stats = window.TextEngine.count(textarea.value);
      const charsEl = document.getElementById('tm-stat-chars');
      const wordsEl = document.getElementById('tm-stat-words');
      const sentEl = document.getElementById('tm-stat-sent');
      const linesEl = document.getElementById('tm-stat-lines');
      const bytesEl = document.getElementById('tm-stat-bytes');
      if (charsEl) charsEl.textContent = stats.characters;
      if (wordsEl) wordsEl.textContent = stats.words;
      if (sentEl) sentEl.textContent = stats.sentences;
      if (linesEl) linesEl.textContent = stats.lines;
      if (bytesEl) bytesEl.textContent = stats.bytes;
    },

    renderToolControls(toolId) {
      const pane = document.getElementById('tm-controls-content');
      if (!pane) return;

      let html = '';
      switch (toolId) {
        case 'count':
          html = `
            <div class="tm-control-row">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-cnt-no-space"> exclude spaces</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-cnt-skip-html"> skip HTML tags</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-cnt-freq" checked> calculate word frequency</label>
            </div>
            <div class="tm-control-row">
              <span>Custom search query:</span>
              <input type="text" class="tm-input" id="tm-cnt-query" placeholder="enter word or phrase to count" style="width: 260px;">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-cnt-case"> case sensitive</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-cnt-regex"> regex</label>
            </div>
          `;
          break;
        case 'replace':
          html = `
            <div class="tm-control-row">
              <span>find:</span>
              <input type="text" class="tm-input" id="tm-rep-find" placeholder="Text or regex to find" style="flex:1; min-width:180px;">
              <span>replace with:</span>
              <input type="text" class="tm-input" id="tm-rep-with" placeholder="Replacement string" style="flex:1; min-width:180px;">
            </div>
            <div class="tm-control-row">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-rep-global" checked> global</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-rep-case"> case sensitive</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-rep-regex"> regex</label>
            </div>
          `;
          break;
        case 'case':
          html = `
            <div class="tm-control-row">
              <span>Target case format:</span>
              <select class="tm-select" id="tm-case-mode">
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
                <option value="title">Title Case (First Letter Each Word)</option>
                <option value="sentence">Sentence case (First letter each sentence)</option>
                <option value="camel">camelCase</option>
                <option value="snake">snake_case</option>
                <option value="kebab">kebab-case</option>
                <option value="random">rAnDoM cAsE</option>
                <option value="inverse">iNVERT cASE</option>
              </select>
            </div>
          `;
          break;
        case 'unaccent':
          html = `
            <div class="tm-control-row">
              <span>strip accents and diacritics from text (e.g. é → e, ñ → n, ü → u, ç → c, ø → o).</span>
            </div>
          `;
          break;
        case 'trim':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-spc-mode" value="unwanted" checked> remove unwanted / collapse multiple spaces</label>
              <label class="tm-radio-label"><input type="radio" name="tm-spc-mode" value="trim"> trim leading & trailing whitespace</label>
              <label class="tm-radio-label"><input type="radio" name="tm-spc-mode" value="all"> remove all spaces</label>
            </div>
          `;
          break;
        case 'prefix':
          html = `
            <div class="tm-control-row">
              <span>prefix into each line:</span>
              <input type="text" class="tm-input" id="tm-pfx-val" placeholder="prefix string..." style="flex:1;">
              <span>suffix into each line:</span>
              <input type="text" class="tm-input" id="tm-sfx-val" placeholder="suffix string..." style="flex:1;">
            </div>
          `;
          break;
        case 'wrap':
          html = `
            <div class="tm-control-row">
              <span>action:</span>
              <select class="tm-select" id="tm-wrap-action">
                <option value="wrap">word wrap / chunk at width</option>
                <option value="remove">remove all line breaks</option>
                <option value="add_match">add line break before/after match</option>
              </select>
              <span id="tm-wrap-width-lbl">width:</span>
              <input type="number" class="tm-input" id="tm-wrap-width" value="80" style="width:70px;">
              <label class="tm-checkbox-label" id="tm-wrap-word-lbl"><input type="checkbox" id="tm-wrap-word" checked> word wrap</label>
            </div>
            <div class="tm-control-row" id="tm-wrap-extra-row">
              <span>replace line breaks with:</span>
              <input type="text" class="tm-input" id="tm-wrap-replace" placeholder="space or delimiter (default blank)" style="width:180px;">
            </div>
          `;
          break;
        case 'join':
          html = `
            <div class="tm-control-row">
              <span>join lines with delimiter:</span>
              <input type="text" class="tm-input" id="tm-join-delim" value=", " style="width:120px;">
              <span>prefix:</span>
              <input type="text" class="tm-input" id="tm-join-pfx" placeholder="optional prefix" style="width:100px;">
              <span>suffix:</span>
              <input type="text" class="tm-input" id="tm-join-sfx" placeholder="optional suffix" style="width:100px;">
            </div>
          `;
          break;
        case 'uniq':
          html = `
            <div class="tm-control-row">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-uniq-case"> case sensitive</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-uniq-empty" checked> remove empty lines</label>
            </div>
          `;
          break;
        case 'compact':
          html = `
            <div class="tm-control-row">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-compact-ws" checked> remove lines containing only whitespace</label>
            </div>
          `;
          break;
        case 'filter':
          html = `
            <div class="tm-control-row">
              <span>filter pattern:</span>
              <input type="text" class="tm-input" id="tm-flt-pattern" placeholder="search string or regex pattern" style="flex:1;">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-flt-invert"> invert match (remove matching lines)</label>
            </div>
            <div class="tm-control-row">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-flt-case"> case sensitive</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-flt-regex"> regex pattern</label>
            </div>
          `;
          break;
        case 'sort':
          html = `
            <div class="tm-control-row">
              <span>sort algorithm:</span>
              <select class="tm-select" id="tm-sort-mode">
                <option value="alpha">alphabetical</option>
                <option value="natural">natural (numeric, e.g. 1, 2, 10)</option>
                <option value="length">line length</option>
                <option value="random">random shuffle</option>
                <option value="reverse_order">reverse order</option>
              </select>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-sort-rev"> descending / invert</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-sort-case"> case sensitive</label>
            </div>
            <div class="tm-control-row">
              <span>column sort: delimiter:</span>
              <input type="text" class="tm-input" id="tm-sort-delim" placeholder="e.g. comma or tab" style="width:100px;">
              <span>column #:</span>
              <input type="number" class="tm-input" id="tm-sort-col" value="1" min="1" style="width:60px;">
            </div>
          `;
          break;
        case 'seq':
          html = `
            <div class="tm-control-row">
              <span>start:</span>
              <input type="number" class="tm-input" id="tm-seq-start" value="1" style="width:80px;">
              <span>end:</span>
              <input type="number" class="tm-input" id="tm-seq-end" value="100" style="width:80px;">
              <span>step:</span>
              <input type="number" class="tm-input" id="tm-seq-step" value="1" style="width:70px;">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-seq-pad"> zero-pad (e.g. 001..100)</label>
            </div>
            <div class="tm-control-row">
              <span>prefix:</span>
              <input type="text" class="tm-input" id="tm-seq-pfx" style="width:80px;">
              <span>suffix:</span>
              <input type="text" class="tm-input" id="tm-seq-sfx" style="width:80px;">
              <span>delimiter:</span>
              <input type="text" class="tm-input" id="tm-seq-delim" value="\\n" style="width:80px;">
            </div>
          `;
          break;
        case 'nl':
          html = `
            <div class="tm-control-row">
              <span>starting number:</span>
              <input type="number" class="tm-input" id="tm-nl-start" value="1" style="width:70px;">
              <span>position:</span>
              <select class="tm-select" id="tm-nl-pos">
                <option value="left">left (e.g. 1. line)</option>
                <option value="right">right (e.g. line [1])</option>
              </select>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-nl-pad"> pad numbers</label>
            </div>
            <div class="tm-control-row">
              <span>prefix:</span>
              <input type="text" class="tm-input" id="tm-nl-pfx" placeholder="#" style="width:80px;">
              <span>suffix:</span>
              <input type="text" class="tm-input" id="tm-nl-sfx" value=". " style="width:80px;">
            </div>
          `;
          break;
        case 'binary':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-bin-mode" value="encode" checked> text to 8-bit binary</label>
              <label class="tm-radio-label"><input type="radio" name="tm-bin-mode" value="decode"> binary to text</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-bin-space" checked> space between bytes</label>
            </div>
          `;
          break;
        case 'disemvowel':
          html = `
            <div class="tm-control-row">
              <span>letters / vowels to remove:</span>
              <input type="text" class="tm-input" id="tm-dis-vowels" value="aeiouAEIOU" style="width:160px;">
              <span>reconstruct disemvoweled word:</span>
              <input type="text" class="tm-input" id="tm-dis-rev-in" placeholder="e.g. prgrmmng" style="width:140px;">
              <button type="button" class="tm-btn" id="tm-dis-rev-btn">lookup</button>
              <span id="tm-dis-rev-out" style="color:var(--accent-color);"></span>
            </div>
          `;
          break;
        case 'encrypt':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-enc-mode" value="encrypt" checked> encrypt (TEA + base64)</label>
              <label class="tm-radio-label"><input type="radio" name="tm-enc-mode" value="decrypt"> decrypt</label>
            </div>
            <div class="tm-control-row">
              <span>password (up to 16 chars):</span>
              <input type="text" class="tm-input" id="tm-enc-pass" placeholder="Enter encryption password" style="width:200px;">
              <button type="button" class="tm-btn" id="tm-enc-genpass">generate random password</button>
            </div>
          `;
          break;
        case 'rev':
          html = `
            <div class="tm-control-row">
              <span>transformation:</span>
              <select class="tm-select" id="tm-rev-mode">
                <option value="reverse">reverse entire text</option>
                <option value="words">reverse word order per line</option>
                <option value="letters">reverse letters inside each word</option>
                <option value="flip">flip / mirror characters</option>
                <option value="upsidedown">upside down (Unicode)</option>
              </select>
            </div>
          `;
          break;
        case 'rot13':
          html = `
            <div class="tm-control-row">
              <span>caesar cipher shift:</span>
              <input type="number" class="tm-input" id="tm-rot-shift" value="13" min="1" max="25" style="width:70px;">
              <span style="color:var(--dim-color);">(default is 13 for standard ROT13 symmetric cipher)</span>
            </div>
          `;
          break;
        case 'scramble':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-scram-mode" value="scramble" checked> scramble internal word letters</label>
              <label class="tm-radio-label"><input type="radio" name="tm-scram-mode" value="descramble"> descramble using english dictionary</label>
            </div>
          `;
          break;
        case 'comb':
          html = `
            <div class="tm-control-row">
              <span>combination length (k):</span>
              <input type="number" class="tm-input" id="tm-comb-k" value="2" min="1" style="width:70px;">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-comb-repeat">allow repetition</label>
              <span>object delimiter:</span>
              <input type="text" class="tm-input" id="tm-comb-delim" value="" style="width:60px;">
              <span>set delimiter:</span>
              <input type="text" class="tm-input" id="tm-comb-join" value="\\n" style="width:60px;">
            </div>
          `;
          break;
        case 'perm':
          html = `
            <div class="tm-control-row">
              <span>object delimiter:</span>
              <input type="text" class="tm-input" id="tm-perm-delim" value="" style="width:60px;">
              <span>prefix:</span>
              <input type="text" class="tm-input" id="tm-perm-pfx" value="" style="width:60px;">
              <span>suffix:</span>
              <input type="text" class="tm-input" id="tm-perm-sfx" value="" style="width:60px;">
            </div>
          `;
          break;
        case 'rng':
          html = `
            <div class="tm-control-row">
              <span>count:</span>
              <input type="number" class="tm-input" id="tm-rng-count" value="10" min="1" style="width:70px;">
              <span>min:</span>
              <input type="number" class="tm-input" id="tm-rng-min" value="1" style="width:80px;">
              <span>max:</span>
              <input type="number" class="tm-input" id="tm-rng-max" value="1000" style="width:80px;">
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-rng-pad">zero-pad</label>
            </div>
          `;
          break;
        case 'randstr':
          html = `
            <div class="tm-control-row">
              <span>count:</span>
              <input type="number" class="tm-input" id="tm-rsg-count" value="10" min="1" style="width:70px;">
              <span>length:</span>
              <input type="number" class="tm-input" id="tm-rsg-len" value="14" min="1" style="width:70px;">
              <span>charset:</span>
              <input type="text" class="tm-input" id="tm-rsg-chars" value="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" style="flex:1; min-width:180px;">
            </div>
          `;
          break;
        case 'shuffle':
          html = `
            <div class="tm-control-row">
              <span>delimiter for randomizing chunks:</span>
              <input type="text" class="tm-input" id="tm-shuf-delim" placeholder="Blank for characters, space for words, \\n for lines" style="width:260px;">
            </div>
          `;
          break;
        case 'cut':
          html = `
            <div class="tm-control-row">
              <span>column delimiter:</span>
              <input type="text" class="tm-input" id="tm-cut-delim" value="," style="width:70px;">
              <span>extract column #:</span>
              <input type="number" class="tm-input" id="tm-cut-col" value="1" min="1" style="width:60px;">
            </div>
          `;
          break;
        case 'unicode':
          html = `
            <div class="tm-control-row">
              <span>format:</span>
              <select class="tm-select" id="tm-uni-format">
                <option value="html_dec">HTML decimal (&#123;)</option>
                <option value="html_hex">HTML hex (&#x7B;)</option>
                <option value="utf16_hex">UTF-16 hex (\\u007B)</option>
                <option value="utf16_dec">UTF-16 decimal</option>
                <option value="c_source">C/C++ source (\\x7B)</option>
                <option value="codepoint">code point (U+007B)</option>
              </select>
              <span>skip characters:</span>
              <input type="text" class="tm-input" id="tm-uni-skip" placeholder="characters to not encode" style="width:160px;">
            </div>
          `;
          break;
        case 'url':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-url-mode" value="encode" checked> URL encode (percent-encoding %xx)</label>
              <label class="tm-radio-label"><input type="radio" name="tm-url-mode" value="decode"> URL decode</label>
              <span>charset:</span>
              <select class="tm-select" id="tm-url-charset">
                <option value="UTF8">UTF-8</option>
                <option value="SJIS">Shift_JIS</option>
                <option value="EUCJP">EUC-JP</option>
                <option value="JIS">ISO-2022-JP</option>
              </select>
            </div>
          `;
          break;
        case 'base64':
          html = `
            <div class="tm-control-row">
              <span>mode:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-b64-mode" value="encode" checked> base64 encode</label>
              <label class="tm-radio-label"><input type="radio" name="tm-b64-mode" value="decode"> base64 decode</label>
              <span>charset:</span>
              <select class="tm-select" id="tm-b64-charset">
                <option value="UTF8">UTF-8</option>
                <option value="SJIS">Shift_JIS</option>
                <option value="EUCJP">EUC-JP</option>
              </select>
            </div>
          `;
          break;
        case 'iconv':
          html = `
            <div class="tm-control-row">
              <span>action:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-iconv-act" value="detect" checked> detect character encoding</label>
              <label class="tm-radio-label"><input type="radio" name="tm-iconv-act" value="convert"> convert character encoding</label>
            </div>
            <div class="tm-control-row" id="tm-iconv-convert-row">
              <span>convert to:</span>
              <select class="tm-select" id="tm-iconv-to">
                <option value="UTF8">UTF-8</option>
                <option value="SJIS">Shift_JIS</option>
                <option value="EUCJP">EUC-JP</option>
                <option value="JIS">ISO-2022-JP</option>
                <option value="UTF16">UTF-16</option>
                <option value="UNICODE">Unicode String</option>
              </select>
              <span>from:</span>
              <select class="tm-select" id="tm-iconv-from">
                <option value="AUTO">auto detect</option>
                <option value="UTF8">UTF-8</option>
                <option value="SJIS">Shift_JIS</option>
                <option value="EUCJP">EUC-JP</option>
                <option value="JIS">ISO-2022-JP</option>
                <option value="UTF16">UTF-16</option>
              </select>
              <span>format:</span>
              <select class="tm-select" id="tm-iconv-fmt">
                <option value="string">text / string</option>
                <option value="hex">byte hex</option>
                <option value="url">URL percent</option>
                <option value="base64">base64</option>
              </select>
            </div>
          `;
          break;
        case 'zenkaku':
          html = `
            <div class="tm-control-row">
              <span>conversion mode:</span>
              <select class="tm-select" id="tm-zen-mode">
                <option value="hankaku">full-width to half-width (zenkaku → hankaku)</option>
                <option value="zenkaku">half-width to full-width (hankaku → zenkaku)</option>
                <option value="hiragana">katakana to hiragana</option>
                <option value="katakana">hiragana to katakana</option>
                <option value="hankana">full-width katakana to half-width katakana</option>
                <option value="zenkana">half-width katakana to full-width katakana</option>
                <option value="space_hankaku">full-width space (U+3000) to ASCII space</option>
                <option value="space_zenkaku">ASCII space to full-width space (U+3000)</option>
              </select>
            </div>
          `;
          break;
        case 'punycode':
          html = `
            <div class="tm-control-row">
              <span>conversion mode:</span>
              <select class="tm-select" id="tm-puny-mode">
                <option value="to_ascii">domain / email to ASCII punycode (toASCII - xn--)</option>
                <option value="to_unicode">punycode to domain / email (toUnicode)</option>
                <option value="encode">raw punycode encode</option>
                <option value="decode">raw punycode decode</option>
                <option value="ucs2_decode">ucs-2 to code points (U+XXXX)</option>
                <option value="ucs2_encode">code points to Unicode string</option>
              </select>
            </div>
          `;
          break;
      }

      pane.innerHTML = html;

      if (toolId === 'encrypt') {
        const genBtn = document.getElementById('tm-enc-genpass');
        const passIn = document.getElementById('tm-enc-pass');
        if (genBtn && passIn && window.TextEngine) {
          genBtn.addEventListener('click', () => {
            passIn.value = window.TextEngine.generatePassword(16);
          });
        }
      } else if (toolId === 'disemvowel') {
        const revBtn = document.getElementById('tm-dis-rev-btn');
        const revIn = document.getElementById('tm-dis-rev-in');
        const revOut = document.getElementById('tm-dis-rev-out');
        if (revBtn && revIn && revOut && window.TextEngine) {
          revBtn.addEventListener('click', () => {
            const matches = window.TextEngine.revowel(revIn.value);
            revOut.textContent = matches.length ? 'Matches: ' + matches.join(', ') : 'No matches found';
          });
        }
      }
    },

    runActiveTool() {
      const textarea = document.getElementById('tm-textarea');
      if (!textarea || !window.TextEngine) return;
      const text = textarea.value;
      this.saveHistory();

      try {
        switch (this.activeToolId) {
          case 'count': {
            const noSpaces = document.getElementById('tm-cnt-no-space')?.checked;
            const skipHtml = document.getElementById('tm-cnt-skip-html')?.checked;
            const freq = document.getElementById('tm-cnt-freq')?.checked;
            const query = document.getElementById('tm-cnt-query')?.value || '';
            const caseSen = document.getElementById('tm-cnt-case')?.checked;
            const regex = document.getElementById('tm-cnt-regex')?.checked;

            const stats = window.TextEngine.count(text, { noSpaces, skipHtml, frequency: freq, query, caseSensitive: caseSen, regex });
            let freqStr = '';
            if (stats.frequency && stats.frequency.length) {
              freqStr = '\n\n--- word frequency (top 25) ---\n' + stats.frequency.slice(0, 25).map(f => `${f.word.padEnd(16)} : ${String(f.count).padStart(5)} (${f.percent}%)`).join('\n');
            }
            const queryStr = query ? `\noccurrences of "${query}": ${stats.customQueryCount}` : '';
            this.setStatus(`Count: ${stats.characters} chars, ${stats.words} words, ${stats.sentences} sentences, ${stats.lines} lines`);
            textarea.value = `=== text statistics ===
characters : ${stats.characters}
words      : ${stats.words}
sentences  : ${stats.sentences}
lines      : ${stats.lines}
bytes      : ${stats.bytes}${queryStr}${freqStr}\n\n=== original text ===\n` + text;
            break;
          }
          case 'replace': {
            const find = document.getElementById('tm-rep-find')?.value || '';
            const withVal = document.getElementById('tm-rep-with')?.value || '';
            const global = document.getElementById('tm-rep-global')?.checked;
            const caseSen = document.getElementById('tm-rep-case')?.checked;
            const regex = document.getElementById('tm-rep-regex')?.checked;
            const res = window.TextEngine.findAndReplace(text, find, withVal, { global, caseSensitive: caseSen, regex });
            textarea.value = res.text;
            this.setStatus(`replaced ${res.matches} occurrence(s)`);
            break;
          }
          case 'case': {
            const mode = document.getElementById('tm-case-mode')?.value || 'upper';
            textarea.value = window.TextEngine.changeCase(text, mode);
            this.setStatus(`converted to ${mode}`);
            break;
          }
          case 'unaccent': {
            const res = window.TextEngine.removeAccents(text);
            textarea.value = res.text;
            this.setStatus(`removed ${res.removedCount} accent(s)`);
            break;
          }
          case 'trim': {
            const mode = document.querySelector('input[name="tm-spc-mode"]:checked')?.value || 'unwanted';
            const res = window.TextEngine.removeSpaces(text, mode);
            textarea.value = res.text;
            this.setStatus(`spaces processed (${mode})`);
            break;
          }
          case 'prefix': {
            const pfx = document.getElementById('tm-pfx-val')?.value || '';
            const sfx = document.getElementById('tm-sfx-val')?.value || '';
            textarea.value = window.TextEngine.addPrefixSuffix(text, pfx, sfx);
            this.setStatus('added prefix / suffix to each line');
            break;
          }
          case 'wrap': {
            const action = document.getElementById('tm-wrap-action')?.value || 'wrap';
            const width = document.getElementById('tm-wrap-width')?.value || 80;
            const wordWrap = document.getElementById('tm-wrap-word')?.checked;
            const repWith = (document.getElementById('tm-wrap-replace')?.value || '').replace(/\\n/g, '\n');
            textarea.value = window.TextEngine.lineBreaks(text, action, { width, wordWrap, replaceWith: repWith });
            this.setStatus(`line breaks processed (${action})`);
            break;
          }
          case 'join': {
            const delim = (document.getElementById('tm-join-delim')?.value || ', ').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            const pfx = document.getElementById('tm-join-pfx')?.value || '';
            const sfx = document.getElementById('tm-join-sfx')?.value || '';
            textarea.value = window.TextEngine.joinLines(text, { delimiter: delim, prefix: pfx, suffix: sfx });
            this.setStatus('lines joined');
            break;
          }
          case 'uniq': {
            const caseSen = document.getElementById('tm-uniq-case')?.checked;
            const remEmpty = document.getElementById('tm-uniq-empty')?.checked;
            const res = window.TextEngine.removeDuplicates(text, { caseSensitive: caseSen, removeEmpty: remEmpty });
            textarea.value = res.text;
            this.setStatus(`removed ${res.removedCount} duplicate line(s)`);
            break;
          }
          case 'compact': {
            const ws = document.getElementById('tm-compact-ws')?.checked;
            const res = window.TextEngine.removeEmptyLines(text, { whitespaceOnly: ws });
            textarea.value = res.text;
            this.setStatus(`removed ${res.removedCount} empty line(s)`);
            break;
          }
          case 'filter': {
            const pattern = document.getElementById('tm-flt-pattern')?.value || '';
            const invert = document.getElementById('tm-flt-invert')?.checked;
            const caseSen = document.getElementById('tm-flt-case')?.checked;
            const regex = document.getElementById('tm-flt-regex')?.checked;
            const res = window.TextEngine.filterLines(text, pattern, { invert, caseSensitive: caseSen, regex });
            textarea.value = res.text;
            this.setStatus(`kept ${res.keptCount} lines, removed ${res.removedCount}`);
            break;
          }
          case 'sort': {
            const mode = document.getElementById('tm-sort-mode')?.value || 'alpha';
            const reverse = document.getElementById('tm-sort-rev')?.checked;
            const caseSen = document.getElementById('tm-sort-case')?.checked;
            const delim = document.getElementById('tm-sort-delim')?.value || '';
            const col = document.getElementById('tm-sort-col')?.value || 1;
            textarea.value = window.TextEngine.sortLines(text, { mode, reverse, caseSensitive: caseSen, delimiter: delim, column: col });
            this.setStatus(`sorted lines (${mode})`);
            break;
          }
          case 'seq': {
            const start = document.getElementById('tm-seq-start')?.value || 1;
            const end = document.getElementById('tm-seq-end')?.value || 100;
            const step = document.getElementById('tm-seq-step')?.value || 1;
            const pad = document.getElementById('tm-seq-pad')?.checked;
            const pfx = document.getElementById('tm-seq-pfx')?.value || '';
            const sfx = document.getElementById('tm-seq-sfx')?.value || '';
            const delim = (document.getElementById('tm-seq-delim')?.value || '\\n').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            textarea.value = window.TextEngine.generateNumbers(start, end, { step, pad, prefix: pfx, suffix: sfx, delimiter: delim });
            this.setStatus('generated number sequence');
            break;
          }
          case 'nl': {
            const start = document.getElementById('tm-nl-start')?.value || 1;
            const pos = document.getElementById('tm-nl-pos')?.value || 'left';
            const pad = document.getElementById('tm-nl-pad')?.checked;
            const pfx = document.getElementById('tm-nl-pfx')?.value || '';
            const sfx = document.getElementById('tm-nl-sfx')?.value !== undefined ? document.getElementById('tm-nl-sfx').value : '. ';
            textarea.value = window.TextEngine.numberLines(text, { start, position: pos, pad, prefix: pfx, suffix: sfx });
            this.setStatus('numbered each line');
            break;
          }
          case 'binary': {
            const mode = document.querySelector('input[name="tm-bin-mode"]:checked')?.value || 'encode';
            const spaces = document.getElementById('tm-bin-space')?.checked;
            textarea.value = window.TextEngine.binaryCode(text, mode, { spaces });
            this.setStatus(`binary conversion (${mode}) complete`);
            break;
          }
          case 'disemvowel': {
            const vowels = document.getElementById('tm-dis-vowels')?.value || 'aeiouAEIOU';
            textarea.value = window.TextEngine.disemvowel(text, { vowels });
            this.setStatus('disemvoweled text');
            break;
          }
          case 'encrypt': {
            const mode = document.querySelector('input[name="tm-enc-mode"]:checked')?.value || 'encrypt';
            const pass = document.getElementById('tm-enc-pass')?.value || '';
            if (!pass) {
              alert('Please specify an encryption password');
              return;
            }
            if (mode === 'encrypt') {
              textarea.value = window.TextEngine.encryptTEA(text, pass);
              this.setStatus('text encrypted with TEA');
            } else {
              textarea.value = window.TextEngine.decryptTEA(text, pass);
              this.setStatus('text decrypted');
            }
            break;
          }
          case 'rev': {
            const mode = document.getElementById('tm-rev-mode')?.value || 'reverse';
            textarea.value = window.TextEngine.reverseFlip(text, mode);
            this.setStatus(`reverse / flip (${mode}) applied`);
            break;
          }
          case 'rot13': {
            const shift = parseInt(document.getElementById('tm-rot-shift')?.value || 13, 10);
            textarea.value = window.TextEngine.rot13(text, shift);
            this.setStatus(`caesar cipher (shift ${shift}) applied`);
            break;
          }
          case 'scramble': {
            const mode = document.querySelector('input[name="tm-scram-mode"]:checked')?.value || 'scramble';
            if (mode === 'scramble') {
              textarea.value = window.TextEngine.scrambleWords(text);
              this.setStatus('words scrambled');
            } else {
              textarea.value = window.TextEngine.descrambleWords(text);
              this.setStatus('words descrambled using lexicon');
            }
            break;
          }
          case 'comb': {
            const k = document.getElementById('tm-comb-k')?.value || 2;
            const repeat = document.getElementById('tm-comb-repeat')?.checked;
            const delim = document.getElementById('tm-comb-delim')?.value || '';
            const joinSets = (document.getElementById('tm-comb-join')?.value || '\\n').replace(/\\n/g, '\n');
            const items = text.split('\n').filter(Boolean);
            textarea.value = window.TextEngine.combinations(items, k, { repeat, delimiter: delim, joinSets });
            this.setStatus('combinations generated');
            break;
          }
          case 'perm': {
            const delim = document.getElementById('tm-perm-delim')?.value || '';
            const pfx = document.getElementById('tm-perm-pfx')?.value || '';
            const sfx = document.getElementById('tm-perm-sfx')?.value || '';
            const items = text.split('\n').filter(Boolean);
            textarea.value = window.TextEngine.permutations(items, { delimiter: delim, prefix: pfx, suffix: sfx });
            this.setStatus('permutations generated');
            break;
          }
          case 'rng': {
            const count = document.getElementById('tm-rng-count')?.value || 10;
            const min = document.getElementById('tm-rng-min')?.value || 1;
            const max = document.getElementById('tm-rng-max')?.value || 1000;
            const pad = document.getElementById('tm-rng-pad')?.checked;
            textarea.value = window.TextEngine.randomNumbers(count, min, max, { pad });
            this.setStatus('random numbers generated');
            break;
          }
          case 'randstr': {
            const count = document.getElementById('tm-rsg-count')?.value || 10;
            const len = document.getElementById('tm-rsg-len')?.value || 14;
            const charset = document.getElementById('tm-rsg-chars')?.value || '';
            textarea.value = window.TextEngine.randomStrings(count, len, charset);
            this.setStatus('random strings generated');
            break;
          }
          case 'shuffle': {
            const delim = (document.getElementById('tm-shuf-delim')?.value || '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            textarea.value = window.TextEngine.randomizeString(text, delim);
            this.setStatus('text randomized / shuffled');
            break;
          }
          case 'cut': {
            const delim = document.getElementById('tm-cut-delim')?.value || ',';
            const col = document.getElementById('tm-cut-col')?.value || 1;
            textarea.value = window.TextEngine.extractColumn(text, delim, col);
            this.setStatus(`extracted column ${col}`);
            break;
          }
          case 'unicode': {
            const format = document.getElementById('tm-uni-format')?.value || 'html_dec';
            const skip = document.getElementById('tm-uni-skip')?.value || '';
            textarea.value = window.TextEngine.unicodeConvert(text, format, { skipChars: skip });
            this.setStatus(`converted to Unicode (${format})`);
            break;
          }
          case 'url': {
            const mode = document.querySelector('input[name="tm-url-mode"]:checked')?.value || 'encode';
            const charset = document.getElementById('tm-url-charset')?.value || 'UTF8';
            if (mode === 'encode') {
              textarea.value = window.TextEngine.urlEncode(text, { encoding: charset });
              this.setStatus(`URL encoded (${charset})`);
            } else {
              textarea.value = window.TextEngine.urlDecode(text, { encoding: charset });
              this.setStatus(`URL decoded (${charset})`);
            }
            break;
          }
          case 'base64': {
            const mode = document.querySelector('input[name="tm-b64-mode"]:checked')?.value || 'encode';
            const charset = document.getElementById('tm-b64-charset')?.value || 'UTF8';
            if (mode === 'encode') {
              textarea.value = window.TextEngine.base64Encode(text, { encoding: charset });
              this.setStatus(`base64 encoded (${charset})`);
            } else {
              textarea.value = window.TextEngine.base64Decode(text, { encoding: charset });
              this.setStatus(`base64 decoded (${charset})`);
            }
            break;
          }
          case 'iconv': {
            const act = document.querySelector('input[name="tm-iconv-act"]:checked')?.value || 'detect';
            if (act === 'detect') {
              const detected = window.TextEngine.detectEncoding(text);
              this.setStatus(`detected encoding: ${detected}`);
              textarea.value = `=== character encoding detection ===\ndetected encoding: ${detected}\n\n=== text content ===\n` + text;
            } else {
              const to = document.getElementById('tm-iconv-to')?.value || 'UTF8';
              const from = document.getElementById('tm-iconv-from')?.value || 'AUTO';
              const format = document.getElementById('tm-iconv-fmt')?.value || 'string';
              textarea.value = window.TextEngine.convertEncoding(text, to, from, { format });
              this.setStatus(`converted encoding ${from} -> ${to}`);
            }
            break;
          }
          case 'zenkaku': {
            const mode = document.getElementById('tm-zen-mode')?.value || 'hankaku';
            textarea.value = window.TextEngine.zenkakuHankaku(text, mode);
            this.setStatus(`converted zenkaku/hankaku (${mode})`);
            break;
          }
          case 'punycode': {
            const mode = document.getElementById('tm-puny-mode')?.value || 'to_ascii';
            if (mode === 'to_ascii') {
              textarea.value = window.TextEngine.punycodeEncode(text, { mode: 'domain' });
              this.setStatus('converted to ASCII punycode (toascii)');
            } else if (mode === 'to_unicode') {
              textarea.value = window.TextEngine.punycodeDecode(text, { mode: 'domain' });
              this.setStatus('converted to unicode (tounicode)');
            } else if (mode === 'encode') {
              textarea.value = window.TextEngine.punycodeEncode(text, { mode: 'raw' });
              this.setStatus('punycode raw encoded');
            } else if (mode === 'decode') {
              textarea.value = window.TextEngine.punycodeDecode(text, { mode: 'raw' });
              this.setStatus('punycode raw decoded');
            } else if (mode === 'ucs2_decode') {
              const pts = window.TextEngine.ucs2Decode(text);
              textarea.value = pts.map(p => 'U+' + p.toString(16).toUpperCase()).join(' ');
              this.setStatus('decoded UCS-2 code points');
            } else if (mode === 'ucs2_encode') {
              const tokens = text.trim().split(/\s+/).map(tok => {
                tok = tok.replace(/^U\+/i, '').replace(/^0x/i, '');
                return parseInt(tok, 16);
              }).filter(n => !isNaN(n));
              textarea.value = window.TextEngine.ucs2Encode(tokens);
              this.setStatus('encoded code points to string');
            }
            break;
          }
        }

        this.updateLineCounter();
        this.updateStats();
      } catch (err) {
        alert('error running tool: ' + err.message);
      }
    }
  };

  const commands = {
    textmanip: {
      desc: 'master text manipulation utility suite and interactive workbench',
      usage: 'textmanip [ui | list | <tool_name> [args...]]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'textmanip: text engine not loaded';
        if (args.length === 0 || args[0] === 'list' || args[0] === 'help') {
          let out = '<div class="tool-result-box">';
          out += '<div class="tool-result-header">text manipulation suite</div>';
          out += '<div class="c-dim" style="margin-bottom:8px;">type <span class="c-accent">textmanip ui</span> or <span class="c-accent">text-tools</span> to launch the interactive workbench.<br>all tools can be used directly as CLI commands and in pipelines (<span class="c-user">|</span>).</div>';

          const cats = {};
          window.TextEngine.toolsCatalog.forEach(t => {
            if (!cats[t.category]) cats[t.category] = [];
            cats[t.category].push(t);
          });

          for (const [cat, tools] of Object.entries(cats)) {
            out += `<div class="c-user ansi-bold" style="margin-top:6px;">${escapeHTML(cat)}:</div>`;
            tools.forEach(t => {
              out += `<div>  <span class="c-accent ansi-bold">${t.id.padEnd(12, ' ')}</span> <span class="c-file">${escapeHTML(t.name)}</span> - <span class="c-dim">${escapeHTML(t.desc)}</span></div>`;
            });
          }

          out += '<div class="c-dim" style="margin-top:8px;">example: <span class="c-accent">echo "hello world" | rot13 | rev</span> &bull; <span class="c-accent">seq 1 10 | sort -r | nl</span></div>';
          out += '</div>';
          return out;
        }

        const subCmd = args[0].toLowerCase();
        if (subCmd === 'ui' || subCmd === 'gui' || subCmd === 'open' || subCmd === 'workbench') {
          const initialTool = args[1] || 'count';
          textManipWorkbench.open(initialTool, stdin || '');
          return '<span class="c-accent">opened text manipulation workbench. press [esc] or click close to exit.</span>';
        }

        if (commands[subCmd]) {
          return commands[subCmd].exec(args.slice(1), stdin);
        }

        return `textmanip: unknown sub-command '${escapeHTML(subCmd)}'. type 'textmanip' for list of tools or 'textmanip ui' for workbench.`;
      }
    },

    tm: {
      desc: 'alias for textmanip',
      usage: 'tm [ui | <tool> [args...]]',
      exec(args, stdin) {
        return commands.textmanip.exec(args, stdin);
      }
    },

    'text-tools': {
      desc: 'launch text manipulation workbench or list tools',
      usage: 'text-tools [ui | <tool>]',
      exec(args, stdin) {
        if (args.length === 0) {
          textManipWorkbench.open('count', stdin || '');
          return '<span class="c-accent">opened text manipulation workbench. press [esc] or click close to exit.</span>';
        }
        return commands.textmanip.exec(args, stdin);
      }
    },

    tools: {
      desc: 'alias for text-tools',
      usage: 'tools [ui | <tool>]',
      exec(args, stdin) {
        return commands['text-tools'].exec(args, stdin);
      }
    },

    count: {
      desc: 'count characters, words, sentences, lines, bytes and frequency',
      usage: 'count [-c|-w|-s|-l|-b|--freq] [-q query] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'count: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'count: missing input text or file';

        const flags = args.filter(a => a.startsWith('-'));
        const noSpaces = flags.includes('--no-spaces') || flags.includes('-S');
        const skipHtml = flags.includes('--skip-html');
        const freq = flags.includes('--freq') || flags.includes('-f');
        const caseSen = flags.includes('-i') ? false : true;

        let query = '';
        const qIdx = args.indexOf('-q');
        if (qIdx !== -1 && args[qIdx + 1]) query = args[qIdx + 1];

        const stats = window.TextEngine.count(input.text, { noSpaces, skipHtml, frequency: freq, query, caseSensitive: caseSen });

        if (flags.includes('-l') && !flags.includes('-w') && !flags.includes('-c')) return String(stats.lines);
        if (flags.includes('-w') && !flags.includes('-l') && !flags.includes('-c')) return String(stats.words);
        if (flags.includes('-c') && !flags.includes('-l') && !flags.includes('-w')) return String(stats.characters);
        if (flags.includes('-b') && !flags.includes('-l') && !flags.includes('-w')) return String(stats.bytes);
        if (flags.includes('-s') && !flags.includes('-l') && !flags.includes('-w')) return String(stats.sentences);

        let out = `<div class="tool-result-box">
<div class="tool-result-header">Text Count Statistics</div>
<div><span class="c-dim">Lines      :</span> <span class="c-accent">${stats.lines}</span></div>
<div><span class="c-dim">Words      :</span> <span class="c-accent">${stats.words}</span></div>
<div><span class="c-dim">Characters :</span> <span class="c-accent">${stats.characters}</span></div>
<div><span class="c-dim">Sentences  :</span> <span class="c-accent">${stats.sentences}</span></div>
<div><span class="c-dim">Bytes      :</span> <span class="c-accent">${stats.bytes}</span></div>`;

        if (query) {
          out += `<div><span class="c-dim">Occurrences of '${escapeHTML(query)}':</span> <span class="c-user ansi-bold">${stats.customQueryCount}</span></div>`;
        }

        if (stats.frequency && stats.frequency.length > 0) {
          out += '<div class="c-user ansi-bold" style="margin-top:6px;">Word Frequency (Top 10):</div>';
          stats.frequency.slice(0, 10).forEach(item => {
            out += `<div class="c-dim">  ${escapeHTML(item.word).padEnd(16, ' ')} : <span class="c-file">${item.count}</span> (${item.percent}%)</div>`;
          });
        }
        out += '</div>';
        return out;
      }
    },

    ccwsl: {
      desc: 'alias for count',
      usage: 'ccwsl [file/text...]',
      exec(args, stdin) {
        return commands.count.exec(args, stdin);
      }
    },

    replace: {
      desc: 'find and replace text or regex matches',
      usage: 'replace [-i] [-g] [-r] <find> <replace_with> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'replace: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const nonFlags = args.filter(a => !a.startsWith('-'));

        if (nonFlags.length < 2) return 'replace: requires <find> and <replace_with> arguments';
        const find = nonFlags[0];
        const replaceWith = nonFlags[1];
        const textArgs = nonFlags.slice(2);

        let input = stdin;
        if (input === undefined || input === null || input === '') {
          if (textArgs.length === 1) {
            const resolved = resolvePath(pathStack, textArgs[0]);
            if (resolved && resolved.node.type === 'file') input = resolved.node.content;
          }
          if (input === undefined || input === null || input === '') {
            input = textArgs.join(' ');
          }
        }

        if (input === undefined || input === null || input === '') return 'replace: missing input text or file';

        const isRegex = flags.includes('-r') || flags.includes('-E');
        const caseSensitive = !flags.includes('-i');
        const global = !flags.includes('-1');

        const res = window.TextEngine.findAndReplace(input, find, replaceWith, { regex: isRegex, caseSensitive, global });
        if (res.error) return `replace: error: ${escapeHTML(res.error)}`;
        return res.text;
      }
    },

    sed: {
      desc: 'stream editor for filtering and transforming text',
      usage: 'sed <s/find/replace/flags> [file/text...] or sed <find> <replace>',
      exec(args, stdin) {
        if (args.length >= 1 && args[0].startsWith('s/')) {
          const parts = args[0].split('/');
          if (parts.length >= 3) {
            const find = parts[1];
            const replaceWith = parts[2];
            const flagsStr = parts[3] || 'g';
            const passArgs = [
              ...(flagsStr.includes('i') ? ['-i'] : []),
              ...(flagsStr.includes('g') ? [] : ['-1']),
              '-r',
              find,
              replaceWith,
              ...args.slice(1)
            ];
            return commands.replace.exec(passArgs, stdin);
          }
        }
        return commands.replace.exec(args, stdin);
      }
    },

    far: {
      desc: 'alias for replace',
      usage: 'far <find> <replace> [file/text...]',
      exec(args, stdin) {
        return commands.replace.exec(args, stdin);
      }
    },

    case: {
      desc: 'convert letter case (upper, lower, title, sentence, random, camel, snake, kebab)',
      usage: 'case <upper|lower|title|sentence|random|camel|snake|kebab> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'case: text engine not loaded';
        if (args.length === 0 && (stdin === undefined || stdin === null)) {
          return 'case: mode required (e.g. case upper, case lower, case title, case camel)';
        }

        let mode = 'upper';
        let textArgs = args;
        const validModes = ['upper', 'uppercase', 'lower', 'lowercase', 'title', 'word', 'capitalize', 'sentence', 'random', 'randomcase', 'mock', 'camel', 'camelcase', 'snake', 'snakecase', 'kebab', 'kebabcase', 'inverse', 'invert'];

        if (args.length > 0 && validModes.includes(args[0].toLowerCase())) {
          mode = args[0].toLowerCase();
          textArgs = args.slice(1);
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'case: missing input text or file';

        return window.TextEngine.changeCase(input.text, mode);
      }
    },

    tr: {
      desc: 'translate or delete characters / change case',
      usage: 'tr <upper|lower|title> [file/text...]',
      exec(args, stdin) {
        return commands.case.exec(args, stdin);
      }
    },

    upper: {
      desc: 'convert text to UPPERCASE',
      usage: 'upper [file/text...]',
      exec(args, stdin) {
        return commands.case.exec(['upper', ...args], stdin);
      }
    },

    lower: {
      desc: 'convert text to lowercase',
      usage: 'lower [file/text...]',
      exec(args, stdin) {
        return commands.case.exec(['lower', ...args], stdin);
      }
    },

    titlecase: {
      desc: 'convert text to Title Case',
      usage: 'titlecase [file/text...]',
      exec(args, stdin) {
        return commands.case.exec(['title', ...args], stdin);
      }
    },

    unaccent: {
      desc: 'strip accents and diacritics from text',
      usage: 'unaccent [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'unaccent: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'unaccent: missing input text or file';
        const res = window.TextEngine.removeAccents(input.text);
        return res.text;
      }
    },

    deaccent: {
      desc: 'alias for unaccent',
      usage: 'deaccent [file/text...]',
      exec(args, stdin) {
        return commands.unaccent.exec(args, stdin);
      }
    },

    rla: {
      desc: 'alias for unaccent',
      usage: 'rla [file/text...]',
      exec(args, stdin) {
        return commands.unaccent.exec(args, stdin);
      }
    },

    trim: {
      desc: 'remove unwanted spaces and trim whitespace',
      usage: 'trim [--all|--trim|--collapse] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'trim: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'trim: missing input text or file';

        let mode = 'unwanted';
        if (flags.includes('--all') || flags.includes('-a')) mode = 'all';
        else if (flags.includes('--trim') || flags.includes('-t')) mode = 'trim';

        const res = window.TextEngine.removeSpaces(input.text, mode);
        return res.text;
      }
    },

    rmspace: {
      desc: 'alias for trim',
      usage: 'rmspace [file/text...]',
      exec(args, stdin) {
        return commands.trim.exec(args, stdin);
      }
    },

    rus: {
      desc: 'alias for trim',
      usage: 'rus [file/text...]',
      exec(args, stdin) {
        return commands.trim.exec(args, stdin);
      }
    },

    prefix: {
      desc: 'add prefix to the start of each line',
      usage: 'prefix <prefix_string> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'prefix: text engine not loaded';
        if (args.length === 0) return 'prefix: requires prefix argument';
        const pfx = args[0];
        const input = extractTextInput(args.slice(1), stdin);
        if (!input.text && input.isEmpty) return 'prefix: missing input text or file';
        return window.TextEngine.addPrefixSuffix(input.text, pfx, '');
      }
    },

    suffix: {
      desc: 'add suffix to the end of each line',
      usage: 'suffix <suffix_string> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'suffix: text engine not loaded';
        if (args.length === 0) return 'suffix: requires suffix argument';
        const sfx = args[0];
        const input = extractTextInput(args.slice(1), stdin);
        if (!input.text && input.isEmpty) return 'suffix: missing input text or file';
        return window.TextEngine.addPrefixSuffix(input.text, '', sfx);
      }
    },

    affix: {
      desc: 'add prefix and suffix to each line',
      usage: 'affix -p <prefix> -s <suffix> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'affix: text engine not loaded';
        let pfx = '', sfx = '';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-p' && args[i + 1]) { pfx = args[i + 1]; i++; }
          else if (args[i] === '-s' && args[i + 1]) { sfx = args[i + 1]; i++; }
        }
        const textArgs = args.filter((a, idx) => a !== '-p' && a !== '-s' && args[idx - 1] !== '-p' && args[idx - 1] !== '-s');
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'affix: missing input text or file';
        return window.TextEngine.addPrefixSuffix(input.text, pfx, sfx);
      }
    },

    wrap: {
      desc: 'word wrap or manipulate line breaks in text',
      usage: 'wrap [--remove [-r replace]] [--width N] [--word] [--before text] [--after text] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'wrap: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = [];
        let width = 80;
        let replaceWith = '';
        let matchText = '';
        let position = 'after';
        let action = 'wrap';

        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if (a === '--width' || a === '-w') {
            if (args[i + 1]) { width = parseInt(args[i + 1], 10); i++; }
          } else if (a === '--remove' || a === '-r') {
            action = 'remove';
            if (args[i + 1] && !args[i + 1].startsWith('-')) { replaceWith = args[i + 1]; i++; }
          } else if (a === '--before') {
            action = 'add_match';
            position = 'before';
            if (args[i + 1]) { matchText = args[i + 1]; i++; }
          } else if (a === '--after') {
            action = 'add_match';
            position = 'after';
            if (args[i + 1]) { matchText = args[i + 1]; i++; }
          } else if (!a.startsWith('-')) {
            textArgs.push(a);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'wrap: missing input text or file';

        const wordWrap = !flags.includes('--no-word') && !flags.includes('-c');
        return window.TextEngine.lineBreaks(input.text, action, { width, wordWrap, replaceWith, matchText, position });
      }
    },

    fold: {
      desc: 'wrap each input line to fit in specified width',
      usage: 'fold [-w width] [-s] [file/text...]',
      exec(args, stdin) {
        return commands.wrap.exec(args, stdin);
      }
    },

    join: {
      desc: 'join lines with a delimiter or merge columns',
      usage: 'join [-d delim] [-p prefix] [-s suffix] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'join: text engine not loaded';
        let delim = ', ';
        let pfx = '', sfx = '';
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-d' && args[i + 1] !== undefined) {
            delim = args[i + 1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            i++;
          } else if (args[i] === '-p' && args[i + 1]) {
            pfx = args[i + 1];
            i++;
          } else if (args[i] === '-s' && args[i + 1]) {
            sfx = args[i + 1];
            i++;
          } else if (!args[i].startsWith('-')) {
            textArgs.push(args[i]);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'join: missing input text or file';
        return window.TextEngine.joinLines(input.text, { delimiter: delim, prefix: pfx, suffix: sfx });
      }
    },

    paste: {
      desc: 'alias for join',
      usage: 'paste [-d delim] [file/text...]',
      exec(args, stdin) {
        return commands.join.exec(args, stdin);
      }
    },

    uniq: {
      desc: 'report or omit repeated duplicate lines',
      usage: 'uniq [-i] [-e] [-c] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'uniq: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'uniq: missing input text or file';

        const caseSensitive = !flags.includes('-i');
        const removeEmpty = flags.includes('-e');
        const res = window.TextEngine.removeDuplicates(input.text, { caseSensitive, removeEmpty });
        return res.text;
      }
    },

    dedup: {
      desc: 'alias for uniq',
      usage: 'dedup [file/text...]',
      exec(args, stdin) {
        return commands.uniq.exec(args, stdin);
      }
    },

    compact: {
      desc: 'remove empty and whitespace-only lines',
      usage: 'compact [--whitespace] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'compact: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'compact: missing input text or file';

        const whitespaceOnly = !flags.includes('--keep-whitespace');
        const res = window.TextEngine.removeEmptyLines(input.text, { whitespaceOnly });
        return res.text;
      }
    },

    rmempty: {
      desc: 'alias for compact',
      usage: 'rmempty [file/text...]',
      exec(args, stdin) {
        return commands.compact.exec(args, stdin);
      }
    },

    filter: {
      desc: 'filter lines matching or not matching pattern',
      usage: 'filter [-v] [-i] [-E] <pattern> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'filter: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const nonFlags = args.filter(a => !a.startsWith('-'));

        if (nonFlags.length === 0) return 'filter: requires pattern argument';
        const pattern = nonFlags[0];
        const textArgs = nonFlags.slice(1);

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'filter: missing input text or file';

        const invert = flags.includes('-v') || flags.includes('--not');
        const caseSensitive = !flags.includes('-i');
        const isRegex = flags.includes('-E') || flags.includes('-r');

        const res = window.TextEngine.filterLines(input.text, pattern, { invert, caseSensitive, regex: isRegex });
        return res.text;
      }
    },

    sort: {
      desc: 'sort lines of text files or piped input',
      usage: 'sort [-n] [-r] [-l] [-R] [-i] [-k col] [-d delim] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'sort: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = [];
        let column = 1;
        let delimiter = '';

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-k' && args[i + 1]) {
            column = parseInt(args[i + 1], 10);
            i++;
          } else if (args[i] === '-d' && args[i + 1]) {
            delimiter = args[i + 1];
            i++;
          } else if (!args[i].startsWith('-')) {
            textArgs.push(args[i]);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'sort: missing input text or file';

        let mode = 'alpha';
        if (flags.includes('-n') || flags.includes('--numeric-sort')) mode = 'natural';
        else if (flags.includes('-l') || flags.includes('--length')) mode = 'length';
        else if (flags.includes('-R') || flags.includes('--random-sort')) mode = 'random';

        const reverse = flags.includes('-r') || flags.includes('--reverse');
        const caseSensitive = !flags.includes('-i') && !flags.includes('--ignore-case');

        return window.TextEngine.sortLines(input.text, { mode, reverse, caseSensitive, column, delimiter });
      }
    },

    seq: {
      desc: 'print a sequence of numbers',
      usage: 'seq <start> <end> [step] [--pad] [-p prefix] [-s suffix] [-d delim]',
      exec(args) {
        if (!window.TextEngine) return 'seq: text engine not loaded';
        if (args.length === 0) return 'seq: missing operand (e.g. seq 1 100)';

        const flags = args.filter(a => a.startsWith('-'));
        const nonFlags = args.filter(a => !a.startsWith('-'));

        let start = 1, end = 10, step = 1;
        if (nonFlags.length === 1) {
          end = parseInt(nonFlags[0], 10);
        } else if (nonFlags.length === 2) {
          start = parseInt(nonFlags[0], 10);
          end = parseInt(nonFlags[1], 10);
        } else if (nonFlags.length >= 3) {
          start = parseInt(nonFlags[0], 10);
          step = parseInt(nonFlags[1], 10);
          end = parseInt(nonFlags[2], 10);
        }

        let pfx = '', sfx = '', delim = '\n';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-p' && args[i + 1]) { pfx = args[i + 1]; i++; }
          else if (args[i] === '-s' && args[i + 1]) { sfx = args[i + 1]; i++; }
          else if (args[i] === '-d' && args[i + 1]) { delim = args[i + 1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'); i++; }
        }

        const pad = flags.includes('--pad') || flags.includes('-w');
        return window.TextEngine.generateNumbers(start, end, { step, pad, prefix: pfx, suffix: sfx, delimiter: delim });
      }
    },

    gennum: {
      desc: 'alias for seq',
      usage: 'gennum <start> <end> [step]',
      exec(args) {
        return commands.seq.exec(args);
      }
    },

    nl: {
      desc: 'number lines of files or piped input',
      usage: 'nl [-w width] [-p prefix] [-s suffix] [-r] [--start N] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'nl: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        let start = 1, pfx = '', sfx = '. ', pos = 'left', pad = false;
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '--start' && args[i + 1]) { start = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '-p' && args[i + 1]) { pfx = args[i + 1]; i++; }
          else if (args[i] === '-s' && args[i + 1]) { sfx = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        if (flags.includes('-r')) pos = 'right';
        if (flags.includes('-w') || flags.includes('--pad')) pad = true;

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'nl: missing input text or file';

        return window.TextEngine.numberLines(input.text, { start, position: pos, pad, prefix: pfx, suffix: sfx });
      }
    },

    binary: {
      desc: 'convert text to 8-bit binary or binary back to text',
      usage: 'binary [-e|-d] [--no-spaces] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'binary: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'binary: missing input text or file';

        let mode = 'encode';
        if (flags.includes('-d') || flags.includes('--decode')) mode = 'decode';

        const spaces = !flags.includes('--no-spaces');
        return window.TextEngine.binaryCode(input.text, mode, { spaces });
      }
    },

    bin: {
      desc: 'alias for binary',
      usage: 'bin [-e|-d] [file/text...]',
      exec(args, stdin) {
        return commands.binary.exec(args, stdin);
      }
    },

    disemvowel: {
      desc: 'remove vowels from text or reconstruct word roots',
      usage: 'disemvowel [-v vowels] [file/text...] or revowel <word>',
      exec(args, stdin) {
        if (!window.TextEngine) return 'disemvowel: text engine not loaded';
        let vowels = 'aeiouAEIOU';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-v' && args[i + 1]) { vowels = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'disemvowel: missing input text or file';
        return window.TextEngine.disemvowel(input.text, { vowels });
      }
    },

    revowel: {
      desc: 'lookup dictionary matches for a disemvoweled word',
      usage: 'revowel <word>',
      exec(args) {
        if (!window.TextEngine) return 'revowel: text engine not loaded';
        if (args.length === 0) return 'revowel: requires disemvoweled word (e.g. revowel prgrmmng)';
        const matches = window.TextEngine.revowel(args[0]);
        if (!matches.length) return `revowel: no dictionary matches for '${escapeHTML(args[0])}'`;
        return `<span class="c-accent">Matches for '${escapeHTML(args[0])}':</span> ${matches.map(m => `<span class="c-file">${escapeHTML(m)}</span>`).join(', ')}`;
      }
    },

    encrypt: {
      desc: 'encrypt text using Tiny Encryption Algorithm (TEA) and Base64',
      usage: 'encrypt -p <password> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'encrypt: text engine not loaded';
        let pass = '';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-p' && args[i + 1]) { pass = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        if (!pass) return 'encrypt: password required (-p <password>)';
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'encrypt: missing input text or file';

        try {
          return window.TextEngine.encryptTEA(input.text, pass);
        } catch (err) {
          return `encrypt: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    decrypt: {
      desc: 'decrypt TEA ciphertext with password',
      usage: 'decrypt -p <password> [file/ciphertext...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'decrypt: text engine not loaded';
        let pass = '';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-p' && args[i + 1]) { pass = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        if (!pass) return 'decrypt: password required (-p <password>)';
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'decrypt: missing ciphertext input or file';

        try {
          return window.TextEngine.decryptTEA(input.text, pass);
        } catch (err) {
          return `decrypt: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    genpass: {
      desc: 'generate a cryptographically random password',
      usage: 'genpass [length]',
      exec(args) {
        if (!window.TextEngine) return 'genpass: text engine not loaded';
        const len = parseInt(args[0], 10) || 16;
        const pass = window.TextEngine.generatePassword(len);
        return `<span class="c-accent">Generated Password (${len} chars):</span> <span class="c-file ansi-bold">${escapeHTML(pass)}</span>`;
      }
    },

    rev: {
      desc: 'reverse lines characterwise, wordwise, or flip upside down',
      usage: 'rev [--words|--letters|--flip|--upsidedown] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'rev: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'rev: missing input text or file';

        let mode = 'reverse';
        if (flags.includes('--words') || flags.includes('-w')) mode = 'words';
        else if (flags.includes('--letters') || flags.includes('-l')) mode = 'letters';
        else if (flags.includes('--flip') || flags.includes('-f')) mode = 'flip';
        else if (flags.includes('--upsidedown') || flags.includes('-u')) mode = 'upsidedown';

        return window.TextEngine.reverseFlip(input.text, mode);
      }
    },

    flip: {
      desc: 'flip / mirror characters horizontally',
      usage: 'flip [file/text...]',
      exec(args, stdin) {
        return commands.rev.exec(['--flip', ...args], stdin);
      }
    },

    upsidedown: {
      desc: 'convert text into upside-down Unicode glyphs',
      usage: 'upsidedown [file/text...]',
      exec(args, stdin) {
        return commands.rev.exec(['--upsidedown', ...args], stdin);
      }
    },

    rot13: {
      desc: 'encode or decode text using ROT13 cipher',
      usage: 'rot13 [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'rot13: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'rot13: missing input text or file';
        return window.TextEngine.rot13(input.text, 13);
      }
    },

    caesar: {
      desc: 'encode or decode text with N-shift Caesar cipher',
      usage: 'caesar -n <shift> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'caesar: text engine not loaded';
        let shift = 13;
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-n' || args[i] === '-s') && args[i + 1]) {
            shift = parseInt(args[i + 1], 10);
            i++;
          } else if (!args[i].startsWith('-')) {
            textArgs.push(args[i]);
          }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'caesar: missing input text or file';
        return window.TextEngine.rot13(input.text, shift);
      }
    },

    scramble: {
      desc: 'scramble internal letters of each word',
      usage: 'scramble [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'scramble: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'scramble: missing input text or file';
        return window.TextEngine.scrambleWords(input.text);
      }
    },

    descramble: {
      desc: 'descramble anagrammed words using lexicon dictionary',
      usage: 'descramble [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'descramble: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'descramble: missing input text or file';
        return window.TextEngine.descrambleWords(input.text);
      }
    },

    comb: {
      desc: 'generate combinations of objects of size K',
      usage: 'comb -k <size> [--repeat] [-d delim] [-j join] [items...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'comb: text engine not loaded';
        let k = 2;
        let repeat = false;
        let delim = '';
        let joinSets = '\n';
        const items = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-k' && args[i + 1]) { k = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '--repeat' || args[i] === '-r') { repeat = true; }
          else if (args[i] === '-d' && args[i + 1] !== undefined) { delim = args[i + 1]; i++; }
          else if (args[i] === '-j' && args[i + 1] !== undefined) { joinSets = args[i + 1].replace(/\\n/g, '\n'); i++; }
          else if (!args[i].startsWith('-')) { items.push(args[i]); }
        }

        let inputItems = items;
        if (stdin !== undefined && stdin !== null && stdin !== '') {
          inputItems = String(stdin).replace(/\r/g, '').split('\n').filter(Boolean);
        } else if (items.length === 1) {
          const resolved = resolvePath(pathStack, items[0]);
          if (resolved && resolved.node.type === 'file') {
            inputItems = resolved.node.content.replace(/\r/g, '').split('\n').filter(Boolean);
          }
        }

        if (!inputItems.length) return 'comb: missing items (e.g. comb -k 2 a b c d)';
        return window.TextEngine.combinations(inputItems, k, { repeat, delimiter: delim, joinSets });
      }
    },

    perm: {
      desc: 'generate all permutations of input objects',
      usage: 'perm [-d delim] [-j join] [-p prefix] [-s suffix] [items...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'perm: text engine not loaded';
        let delim = '';
        let joinSets = '\n';
        let pfx = '', sfx = '';
        const items = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-d' && args[i + 1] !== undefined) { delim = args[i + 1]; i++; }
          else if (args[i] === '-j' && args[i + 1] !== undefined) { joinSets = args[i + 1].replace(/\\n/g, '\n'); i++; }
          else if (args[i] === '-p' && args[i + 1]) { pfx = args[i + 1]; i++; }
          else if (args[i] === '-s' && args[i + 1]) { sfx = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { items.push(args[i]); }
        }

        let inputItems = items;
        if (stdin !== undefined && stdin !== null && stdin !== '') {
          inputItems = String(stdin).replace(/\r/g, '').split('\n').filter(Boolean);
        } else if (items.length === 1) {
          const resolved = resolvePath(pathStack, items[0]);
          if (resolved && resolved.node.type === 'file') {
            inputItems = resolved.node.content.replace(/\r/g, '').split('\n').filter(Boolean);
          }
        }

        if (!inputItems.length) return 'perm: missing items (e.g. perm a b c)';
        return window.TextEngine.permutations(inputItems, { delimiter: delim, joinSets, prefix: pfx, suffix: sfx });
      }
    },

    rng: {
      desc: 'generate random numbers in a specified range',
      usage: 'rng [-n count] [-min low] [-max high] [--pad] [-d delim]',
      exec(args) {
        if (!window.TextEngine) return 'rng: text engine not loaded';
        let count = 10, min = 1, max = 1000, pad = false, delim = '\n';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) { count = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '-min' && args[i + 1]) { min = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '-max' && args[i + 1]) { max = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '--pad' || args[i] === '-w') { pad = true; }
          else if (args[i] === '-d' && args[i + 1] !== undefined) { delim = args[i + 1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'); i++; }
        }
        return window.TextEngine.randomNumbers(count, min, max, { pad, delimiter: delim });
      }
    },

    randint: {
      desc: 'alias for rng',
      usage: 'randint [-n count] [-min low] [-max high]',
      exec(args) {
        return commands.rng.exec(args);
      }
    },

    randstr: {
      desc: 'generate random strings from character sets',
      usage: 'randstr [-n count] [-l length] [-c charset] [-d delim]',
      exec(args) {
        if (!window.TextEngine) return 'randstr: text engine not loaded';
        let count = 10, len = 14, charset = '', delim = '\n';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) { count = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '-l' && args[i + 1]) { len = parseInt(args[i + 1], 10); i++; }
          else if (args[i] === '-c' && args[i + 1]) { charset = args[i + 1]; i++; }
          else if (args[i] === '-d' && args[i + 1] !== undefined) { delim = args[i + 1].replace(/\\n/g, '\n'); i++; }
        }
        return window.TextEngine.randomStrings(count, len, charset, { setDelim: delim });
      }
    },

    shuffle: {
      desc: 'randomize order of characters, words or lines',
      usage: 'shuffle [-d delim] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'shuffle: text engine not loaded';
        let delim = '';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-d' && args[i + 1] !== undefined) {
            delim = args[i + 1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            i++;
          } else if (!args[i].startsWith('-')) {
            textArgs.push(args[i]);
          }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'shuffle: missing input text or file';
        return window.TextEngine.randomizeString(input.text, delim);
      }
    },

    cut: {
      desc: 'extract delimited column from lines',
      usage: 'cut -d <delim> -f <col_number> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'cut: text engine not loaded';
        let delim = ',';
        let col = 1;
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-d' && args[i + 1] !== undefined) {
            delim = args[i + 1];
            i++;
          } else if (args[i] === '-f' && args[i + 1]) {
            col = parseInt(args[i + 1], 10);
            i++;
          } else if (!args[i].startsWith('-')) {
            textArgs.push(args[i]);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'cut: missing input text or file';
        return window.TextEngine.extractColumn(input.text, delim, col);
      }
    },

    column: {
      desc: 'alias for cut',
      usage: 'column -d <delim> -f <col_number> [file/text...]',
      exec(args, stdin) {
        return commands.cut.exec(args, stdin);
      }
    },

    unicode: {
      desc: 'convert text to HTML entities, hex, UTF-16, or C/C++ escapes',
      usage: 'unicode [-f html_dec|html_hex|utf16_hex|utf16_dec|c_source|codepoint] [-s skip] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'unicode: text engine not loaded';
        let format = 'html_dec';
        let skip = '';
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-f' && args[i + 1]) { format = args[i + 1]; i++; }
          else if (args[i] === '-s' && args[i + 1]) { skip = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'unicode: missing input text or file';
        return window.TextEngine.unicodeConvert(input.text, format, { skipChars: skip });
      }
    },

    unicvr: {
      desc: 'alias for unicode',
      usage: 'unicvr [file/text...]',
      exec(args, stdin) {
        return commands.unicode.exec(args, stdin);
      }
    },
    urlencode: {
      desc: 'encode text to percent-encoded URI component (%xx format)',
      usage: 'urlencode [-e UTF8|SJIS|EUCJP|JIS] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'urlencode: text engine not loaded';
        let encoding = 'UTF8';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-e' || args[i] === '--encoding') && args[i + 1]) { encoding = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'urlencode: missing input text or file';
        return window.TextEngine.urlEncode(input.text, { encoding });
      }
    },

    urldecode: {
      desc: 'decode percent-encoded URI string (%xx format)',
      usage: 'urldecode [-e UTF8|SJIS|EUCJP|JIS] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'urldecode: text engine not loaded';
        let encoding = 'UTF8';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-e' || args[i] === '--encoding') && args[i + 1]) { encoding = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'urldecode: missing input text or file';
        try {
          return window.TextEngine.urlDecode(input.text, { encoding });
        } catch (err) {
          return `urldecode: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    url: {
      desc: 'URL percent-encode or decode text',
      usage: 'url <encode|decode> [-e encoding] [file/text...]',
      exec(args, stdin) {
        if (args[0] === 'decode' || args[0] === '-d') return commands.urldecode.exec(args.slice(1), stdin);
        if (args[0] === 'encode' || args[0] === '-e') return commands.urlencode.exec(args.slice(1), stdin);
        return commands.urlencode.exec(args, stdin);
      }
    },

    base64: {
      desc: 'encode or decode standard Base64 formatted string',
      usage: 'base64 [-d|--decode] [-e UTF8|SJIS|EUCJP] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'base64: text engine not loaded';
        const isDecode = args.includes('-d') || args.includes('--decode');
        let encoding = 'UTF8';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-e' || args[i] === '--encoding') && args[i + 1]) { encoding = args[i + 1]; i++; }
          else if (args[i] !== '-d' && args[i] !== '--decode' && !args[i].startsWith('-')) { textArgs.push(args[i]); }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'base64: missing input text or file';
        try {
          if (isDecode) {
            return window.TextEngine.base64Decode(input.text, { encoding });
          } else {
            return window.TextEngine.base64Encode(input.text, { encoding });
          }
        } catch (err) {
          return `base64: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    b64: {
      desc: 'alias for base64',
      usage: 'b64 [-d] [file/text...]',
      exec(args, stdin) {
        return commands.base64.exec(args, stdin);
      }
    },

    base64encode: {
      desc: 'encode string to Base64',
      usage: 'base64encode [file/text...]',
      exec(args, stdin) {
        return commands.base64.exec(args, stdin);
      }
    },

    base64decode: {
      desc: 'decode Base64 string',
      usage: 'base64decode [file/text...]',
      exec(args, stdin) {
        return commands.base64.exec(['-d', ...args], stdin);
      }
    },

    'detect-encoding': {
      desc: 'detect character encoding of text or file (UTF-8, Shift_JIS, EUC-JP, ISO-2022-JP, UTF-16, ASCII)',
      usage: 'detect-encoding [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'detect-encoding: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'detect-encoding: missing input text or file';
        const enc = window.TextEngine.detectEncoding(input.text);
        return `<span class="c-accent">Detected Encoding:</span> <span class="c-file ansi-bold">${escapeHTML(enc)}</span>`;
      }
    },

    chardet: {
      desc: 'alias for detect-encoding',
      usage: 'chardet [file/text...]',
      exec(args, stdin) {
        return commands['detect-encoding'].exec(args, stdin);
      }
    },

    iconv: {
      desc: 'convert character encoding between UTF-8, Shift_JIS, EUC-JP, ISO-2022-JP, UTF-16, UNICODE',
      usage: 'iconv -t <to_encoding> [-f <from_encoding>] [--hex|--url|--base64] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'iconv: text engine not loaded';
        let to = 'UTF8';
        let from = 'AUTO';
        let format = 'string';
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-t' || args[i] === '--to-code') && args[i + 1]) { to = args[i + 1]; i++; }
          else if ((args[i] === '-f' || args[i] === '--from-code') && args[i + 1]) { from = args[i + 1]; i++; }
          else if (args[i] === '--hex') { format = 'hex'; }
          else if (args[i] === '--url') { format = 'url'; }
          else if (args[i] === '--base64') { format = 'base64'; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'iconv: missing input text or file';
        try {
          return window.TextEngine.convertEncoding(input.text, to, from, { format });
        } catch (err) {
          return `iconv: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    reencode: {
      desc: 'alias for iconv',
      usage: 'reencode -t <to_encoding> [file/text...]',
      exec(args, stdin) {
        return commands.iconv.exec(args, stdin);
      }
    },

    zenkaku: {
      desc: 'convert half-width (hankaku) alphanumeric and symbols to full-width (zenkaku)',
      usage: 'zenkaku [--space] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'zenkaku: text engine not loaded';
        const isSpace = args.includes('--space');
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'zenkaku: missing input text or file';
        return window.TextEngine.zenkakuHankaku(input.text, isSpace ? 'space_zenkaku' : 'zenkaku');
      }
    },

    hankaku: {
      desc: 'convert full-width (zenkaku) alphanumeric and symbols to half-width (hankaku)',
      usage: 'hankaku [--space] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'hankaku: text engine not loaded';
        const isSpace = args.includes('--space');
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'hankaku: missing input text or file';
        return window.TextEngine.zenkakuHankaku(input.text, isSpace ? 'space_hankaku' : 'hankaku');
      }
    },

    kana: {
      desc: 'convert Japanese kana (hiragana, katakana, hankana, zenkana)',
      usage: 'kana <hiragana|katakana|hankana|zenkana> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'kana: text engine not loaded';
        if (args.length === 0 && (stdin === undefined || stdin === null)) {
          return 'kana: mode required (e.g. kana hiragana, kana katakana, kana hankana, kana zenkana)';
        }
        let mode = 'hiragana';
        let textArgs = args;
        const valid = ['hiragana', 'katakana', 'hankana', 'zenkana'];
        if (args.length > 0 && valid.includes(args[0].toLowerCase())) {
          mode = args[0].toLowerCase();
          textArgs = args.slice(1);
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'kana: missing input text or file';
        return window.TextEngine.zenkakuHankaku(input.text, mode);
      }
    },
    punycode: {
      desc: 'encode or decode strings and domain names to/from Punycode (RFC 3492/5891)',
      usage: 'punycode [-e|-d|-a|-u|--ucs2] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'punycode: text engine not loaded';
        const flags = args.filter(a => a.startsWith('-'));
        const textArgs = args.filter(a => !a.startsWith('-'));
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'punycode: missing input text or file';

        if (flags.includes('--ucs2')) {
          if (flags.includes('-d') || flags.includes('--decode')) {
            const tokens = input.text.trim().split(/\s+/).map(tok => {
              tok = tok.replace(/^U\+/i, '').replace(/^0x/i, '');
              return parseInt(tok, 16);
            }).filter(n => !isNaN(n));
            return window.TextEngine.ucs2Encode(tokens);
          } else {
            const pts = window.TextEngine.ucs2Decode(input.text);
            return pts.map(p => 'U+' + p.toString(16).toUpperCase()).join(' ');
          }
        }

        if (flags.includes('-d') || flags.includes('--decode') || flags.includes('-u') || flags.includes('--unicode')) {
          return window.TextEngine.punycodeDecode(input.text);
        }

        if (flags.includes('-a') || flags.includes('--ascii') || flags.includes('--domain') || flags.includes('--idn')) {
          return window.TextEngine.punycodeEncode(input.text, { mode: 'domain' });
        }

        return window.TextEngine.punycodeEncode(input.text);
      }
    },

    idn: {
      desc: 'convert Internationalized Domain Names (IDN) or emails to/from ASCII Punycode',
      usage: 'idn <encode|decode> <domain/email...>',
      exec(args, stdin) {
        if (!window.TextEngine) return 'idn: text engine not loaded';
        if (args.length === 0 && (stdin === undefined || stdin === null)) {
          return 'idn: usage: idn <encode|decode> <domain/email...>';
        }
        let mode = 'encode';
        let textArgs = args;
        if (args[0] === 'decode' || args[0] === '-d') {
          mode = 'decode';
          textArgs = args.slice(1);
        } else if (args[0] === 'encode' || args[0] === '-e') {
          mode = 'encode';
          textArgs = args.slice(1);
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'idn: missing domain or email argument';

        if (mode === 'decode') {
          return window.TextEngine.punycodeDecode(input.text, { mode: 'domain' });
        }
        return window.TextEngine.punycodeEncode(input.text, { mode: 'domain' });
      }
    },

    'to-ascii': {
      desc: 'alias for idn encode (convert domain/email to ASCII Punycode)',
      usage: 'to-ascii <domain/email...>',
      exec(args, stdin) {
        return commands.idn.exec(['encode', ...args], stdin);
      }
    },

    'to-unicode': {
      desc: 'alias for idn decode (convert ASCII Punycode domain/email to Unicode)',
      usage: 'to-unicode <domain/email...>',
      exec(args, stdin) {
        return commands.idn.exec(['decode', ...args], stdin);
      }
    },

    help: {
      desc: 'display available shell commands and usage info',
      usage: 'help [command]',
      exec(args) {
        if (args.length > 0) {
          const cmdName = args[0].toLowerCase();
          const target = commands[cmdName];
          if (target) {
            return `<span class="c-accent ansi-bold">${escapeHTML(cmdName)}</span>: ${escapeHTML(target.desc)}
<span class="c-dim">usage:</span> ${escapeHTML(target.usage || cmdName)}`;
          }
          return `help: no help topic found for '${escapeHTML(cmdName)}'`;
        }

        const categories = {
          'profile & CV': ['about', 'experience', 'projects', 'works', 'skills', 'languages', 'education', 'contact', 'references', 'resume'],
          'navigation & files': ['ls', 'll', 'cd', 'pwd', 'tree', 'cat', 'head', 'tail', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'find', 'open'],
          'system & specs': ['neofetch', 'whoami', 'uname', 'uptime', 'date', 'cal', 'top', 'ps', 'free', 'df', 'env', 'hostname'],
          'network & web': ['ping', 'curl', 'wget', 'weather', 'ifconfig', 'nslookup'],
          'text manipulation & utilities': ['textmanip', 'text-tools', 'tools', 'count', 'replace', 'case', 'unaccent', 'trim', 'prefix', 'suffix', 'wrap', 'join', 'uniq', 'compact', 'filter', 'sort', 'seq', 'nl', 'binary', 'disemvowel', 'encrypt', 'decrypt', 'rev', 'rot13', 'scramble', 'comb', 'perm', 'rng', 'randstr', 'shuffle', 'cut', 'unicode', 'urlencode', 'urldecode', 'base64', 'iconv', 'detect-encoding', 'zenkaku', 'hankaku', 'kana', 'punycode', 'idn', 'to-ascii', 'to-unicode'],
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

        if (target === 'textmanip' || target === 'text-manipulation' || target === 'workbench' || target === 'text-tools' || target === 'tools') {
          textManipWorkbench.open('count');
          return `<span class="c-accent">Opened Text Manipulation Workbench.</span>`;
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
          return `current theme: <span class="c-accent">${env.THEME}</span>\navailable themes: ${valid.join(', ')}\nusage: 'theme &lt;name&gt;'`;
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
          return `current font: <span class="c-accent">${env.FONT}</span>\navailable fonts: ${valid.join(', ')}\nusage: 'font &lt;name&gt;'`;
        }
        const name = args[0].toLowerCase();
        if (applyFont(name)) {
          return `font family switched to: <span class="c-accent">${name}</span>`;
        }
        return `font: invalid font '${name}'. available: ${valid.join(', ')}`;
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
        return `music: unknown action '${sub}'. usage: 'music [play|pause|stop|status|vol <0-100>]'`;
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

    if (activeInteractiveMode === 'textmanip') {
      if (e.key === 'Escape') {
        textManipWorkbench.close();
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
