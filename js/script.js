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
            },
            'mjcdi.txt': {
              type: 'file',
              date: 'May 12 14:10',
              content: `Project  : MJcdi - Bijoy ANSI ⇄ Unicode Engine & Converter
Stack    : Vanilla JavaScript, Regular Expressions, Bengali Linguistics
------------------------------------------------------------
- High-performance bidirectional converter between Bijoy (ANSI) typography encoding and standard Unicode with conjunct reordering and Reph handling.`
            },
            'mapdiff.txt': {
              type: 'file',
              date: 'Jun  2 16:20',
              content: `Project  : JSON Map Difference Checker (MapDiffChecker)
Stack    : JavaScript, Object Diffing, Terminal ANSI / GUI
------------------------------------------------------------
- Fast JSON map comparator detecting missing keys, extra keys, and mismatched values with structured visual reports.`
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
            'linguistics.txt': {
              type: 'file',
              date: 'Aug 20 14:08',
              content: `HISTORICAL LINGUISTICS & PHILOLOGY SUITE
============================================================
• longs / long-s              : Historical long S (ſ) typography converter (EN, FR, DE, ES, IT)
• bijoy / mjcdi               : Bijoy (ANSI) ⇄ Unicode Bengali converter
• unaccent                    : Diacritic & accent stripper
• case                        : Multi-format orthographic case converter
• unicode                     : Unicode codepoints & entity encoder`
            },
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
All 28 text-manipulation utilities are integrated into rsh.
You can run them directly as shell commands, pipe them together,
or launch the interactive visual workbench with 'textmanip ui'.

Quick Commands:
• count       : Character, word, sentence, line & frequency analysis
• replace     : Find and replace with regex / literal support
• case        : Letter case converter (upper, lower, title, camel, snake, etc.)
• unaccent    : Strip diacritics and accents
• longs       : Historical long S (ſ) typography converter (EN, FR, DE, ES, IT)
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
• bijoy       : Bijoy (ANSI) ⇄ Unicode Bengali converter
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
          content: `type 'help' for commands. quick: 'cv', 'tools', 'experience', 'works', 'languages', 'projects', 'skills'`
        },
        'manifesto.tdcy3': {
          type: 'file',
          date: 'Jul 15 12:00',
          content: 'This sentence is dying, and every time you read it you kill it a little more.'
        },
        'warning.tdcy8': {
          type: 'file',
          date: 'Jul 15 12:00',
          content: 'Digital media was never meant to be eternal. With x=8, this message will dissolve rapidly into noise.'
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
  <div class="audio-title">♫︎ audio player: now playing</div>
  <div class="c-link">Track: ${escapeHTML(this.currentTrack)}</div>
  <div class="audio-progress">playing audio stream... use 'music pause' or 'music stop'</div>
</div>`;
    },

    pause() {
      if (!audioElement.paused) {
        audioElement.pause();
        this.isPlaying = false;
        return `audio paused. Type 'music play' to resume.`;
      }
      return `audio is not currently playing.`;
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
            frame += '★\uFE0E';
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

  function buildEncodingSelectOptions(selectedVal = 'UTF-8', includeAuto = false, includeUnicode = false) {
    let out = '';
    if (includeAuto) {
      const isAuto = String(selectedVal).toUpperCase() === 'AUTO';
      out += `<option value="AUTO"${isAuto ? ' selected' : ''}>auto detect</option>`;
    }
    if (window.TextEngine && typeof window.TextEngine.getSupportedEncodings === 'function') {
      const groups = window.TextEngine.getSupportedEncodings();
      for (const grp of groups) {
        out += `<optgroup label="${escapeHTML(grp.category)}">`;
        if (grp.category === 'Unicode' && includeUnicode) {
          out += `<option value="UNICODE"${String(selectedVal).toUpperCase() === 'UNICODE' ? ' selected' : ''}>Unicode String (JavaScript text)</option>`;
        }
        for (const enc of grp.encodings) {
          const isSel = (enc.id === selectedVal || (enc.aliases && enc.aliases.includes(selectedVal)));
          out += `<option value="${escapeHTML(enc.id)}"${isSel ? ' selected' : ''}>${escapeHTML(enc.name || enc.id)}</option>`;
        }
        out += `</optgroup>`;
      }
    } else {
      out += `
        <optgroup label="Unicode">
          <option value="UTF-8">UTF-8</option>
          <option value="UTF-16LE">UTF-16LE</option>
          <option value="UTF-16BE">UTF-16BE</option>
        </optgroup>
        <optgroup label="Windows Code Pages">
          <option value="WINDOWS-1252">Windows-1252 (Western European)</option>
          <option value="WINDOWS-1250">Windows-1250 (Central European)</option>
          <option value="WINDOWS-1251">Windows-1251 (Cyrillic)</option>
        </optgroup>
        <optgroup label="ISO-8859 Standards">
          <option value="ISO-8859-1">ISO-8859-1 (Latin-1)</option>
          <option value="ISO-8859-15">ISO-8859-15 (Latin-9 with Euro)</option>
        </optgroup>
        <optgroup label="OEM / DOS">
          <option value="CP437">CP437 (IBM PC / MS-DOS US)</option>
        </optgroup>
        <optgroup label="East Asian (CJK)">
          <option value="SHIFT_JIS">Shift_JIS (Japanese)</option>
          <option value="EUC-JP">EUC-JP</option>
          <option value="GBK">GBK (Simplified Chinese)</option>
          <option value="BIG5">Big5 (Traditional Chinese)</option>
          <option value="EUC-KR">EUC-KR (Korean)</option>
        </optgroup>
        <optgroup label="ASCII">
          <option value="ASCII">US-ASCII</option>
        </optgroup>
      `;
    }
    return out;
  }

  const textManipWorkbench = {
    modalEl: null,
    activeToolId: 'count',
    history: [],
    historyIndex: -1,
    wrapMode: 'off',
    isSidebarCollapsed: false,

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
            <div class="tm-header-left">
              <button type="button" class="tm-sidebar-toggle-btn" id="tm-sidebar-toggle" title="toggle tools sidebar" aria-label="Toggle tools sidebar" aria-expanded="true">
                <span class="tm-sidebar-toggle-icon">◀︎</span>
                <span class="tm-sidebar-toggle-label">tools</span>
              </button>
              <div class="tm-title">
                <span class="tm-title-name">text manipulation workbench</span>
                <span class="tm-badge" id="tm-active-tool-badge">count characters words sentences lines</span>
              </div>
            </div>
            <button type="button" class="tm-close-btn" id="tm-close-btn" title="close workbench (esc)">✕︎ close [esc]</button>
          </div>
          <div class="tm-body">
            <div class="tm-sidebar-backdrop" id="tm-sidebar-backdrop" title="close sidebar"></div>
            <div class="tm-sidebar" id="tm-sidebar">
              <div class="tm-sidebar-header">
                <span class="tm-sidebar-heading">all tools</span>
                <button type="button" class="tm-sidebar-collapse-btn" id="tm-sidebar-collapse-btn" title="collapse sidebar" aria-label="Collapse sidebar">◀︎</button>
              </div>
              <div class="tm-sidebar-scroll">
                ${sidebarHtml}
              </div>
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
                  <button type="button" class="tm-btn tm-btn-primary" id="tm-run-btn">▶︎ run tool</button>
                </div>
              </div>
              <div class="tm-editor-area">
                <textarea class="tm-line-counter" id="tm-line-counter" readonly wrap="off" tabindex="-1">1.</textarea>
                <textarea class="tm-textarea" id="tm-textarea" placeholder="enter or paste text here, or load a file..." wrap="off" spellcheck="false"></textarea>
              </div>
              <div class="tm-controls-pane" id="tm-controls-pane">
                <div id="tm-controls-content"></div>
              </div>
              <div class="tm-stats-bar">
                <div class="tm-stats-items">
                  <div class="tm-stats-item">chars: <span id="tm-stat-chars">0</span></div>
                  <div class="tm-stats-item">words: <span id="tm-stat-words">0</span></div>
                  <div class="tm-stats-item">sentences: <span id="tm-stat-sent">0</span></div>
                  <div class="tm-stats-item">lines: <span id="tm-stat-lines">0</span></div>
                  <div class="tm-stats-item">bytes: <span id="tm-stat-bytes">0</span></div>
                </div>
                <div id="tm-status-msg" style="color: var(--accent-color);">ready</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const closeBtn = document.getElementById('tm-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      const toggleBtn = document.getElementById('tm-sidebar-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleSidebar();
        });
      }

      const sidebarCollapseBtn = document.getElementById('tm-sidebar-collapse-btn');
      if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.collapseSidebar(true);
        });
      }

      const backdrop = document.getElementById('tm-sidebar-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          this.collapseSidebar(true);
        });
      }

      const sidebar = document.getElementById('tm-sidebar');
      if (sidebar) {
        sidebar.addEventListener('click', (e) => {
          const item = e.target.closest('.tm-tool-item');
          if (item && item.dataset.toolId) {
            this.selectTool(item.dataset.toolId, true);
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
            this.setStatus('text copied to clipboard');
          }).catch(() => {
            textarea.select();
            document.execCommand('copy');
            this.setStatus('text copied');
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
                this.setStatus(`loaded ${file.name} (${file.size} bytes)`);
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
          this.setStatus('saved as manipulated_text.txt');
        });
      }

      this.selectTool(this.activeToolId, false);
      this.setSidebarCollapsed(false);
    },

    setSidebarCollapsed(collapsed) {
      this.isSidebarCollapsed = !!collapsed;
      if (!this.modalEl) return;
      const win = this.modalEl.querySelector('.tm-window');
      if (win) {
        win.classList.toggle('tm-sidebar-collapsed', this.isSidebarCollapsed);
      }
      const toggleBtn = document.getElementById('tm-sidebar-toggle');
      if (toggleBtn) {
        const icon = toggleBtn.querySelector('.tm-sidebar-toggle-icon');
        const label = toggleBtn.querySelector('.tm-sidebar-toggle-label');
        if (this.isSidebarCollapsed) {
          if (icon) icon.textContent = '▶︎';
          if (label) label.textContent = 'tools';
          toggleBtn.title = 'Expand tools sidebar';
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.classList.add('collapsed');
        } else {
          if (icon) icon.textContent = '◀︎';
          if (label) label.textContent = 'tools';
          toggleBtn.title = 'Collapse tools sidebar';
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.classList.remove('collapsed');
        }
      }
    },

    toggleSidebar() {
      this.setSidebarCollapsed(!this.isSidebarCollapsed);
    },

    collapseSidebar(collapsed = true) {
      this.setSidebarCollapsed(collapsed);
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
        this.selectTool(toolId, false);
      }
      this.setSidebarCollapsed(false);
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
        this.setStatus('undo applied');
      } else {
        this.setStatus('no more undo history');
      }
    },

    selectTool(toolId, autoCollapse = true) {
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
      if (this.modalEl) {
        const win = this.modalEl.querySelector('.tm-window');
        if (win) {
          win.classList.toggle('tm-tool-unicodemap', toolId === 'unicodemap');
          win.classList.toggle('tm-tool-invoice', toolId === 'invoice' || toolId === 'receipt' || toolId === 'inv');
          win.classList.toggle('tm-tool-prescription', toolId === 'prescription' || toolId === 'rx' || toolId === 'pad' || toolId === 'clinical');

          const isSymbology = toolId === 'qrcode' || toolId === 'qr' || toolId === 'barcode' || toolId === 'bc';
          win.classList.toggle('tm-tool-symbology', isSymbology);

          const vastTools = ['diff', 'mapdiff', 'decayfmt', 'replace', 'encrypt', 'iconv', 'filter', 'sort', 'seq', 'comb', 'perm', 'zenkaku', 'punycode'];
          const isVast = vastTools.includes(toolId);
          win.classList.toggle('tm-vast-params', isVast && !isSymbology && toolId !== 'invoice' && toolId !== 'prescription');
        }
      }

      if (autoCollapse) {
        this.collapseSidebar(true);
      }
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
              <input type="text" class="tm-input" id="tm-enc-pass" placeholder="enter encryption password" style="width:200px;">
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
                ${buildEncodingSelectOptions('UTF-8')}
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
                ${buildEncodingSelectOptions('UTF-8')}
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
            <div class="tm-control-row" id="tm-iconv-convert-row" style="display: none;">
              <span>convert to:</span>
              <select class="tm-select" id="tm-iconv-to">
                ${buildEncodingSelectOptions('UTF-8', false, true)}
              </select>
              <span>from:</span>
              <select class="tm-select" id="tm-iconv-from">
                ${buildEncodingSelectOptions('AUTO', true, false)}
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
        case 'diff':
          html = `
            <div class="tm-control-row" style="justify-content: space-between;">
              <span class="c-accent ansi-bold">Comparison Text (Text 2):</span>
              <div style="display: flex; gap: 6px;">
                <label class="tm-btn" style="cursor:pointer;">
                  load text 2
                  <input type="file" id="tm-diff-file" style="display:none;">
                </label>
                <button type="button" class="tm-btn" id="tm-diff-swap">⇄ swap text 1 & 2</button>
              </div>
            </div>
            <div class="tm-control-row" style="align-items: stretch; margin-top: 4px;">
              <textarea class="tm-map2-textarea" id="tm-diff2-val" placeholder="enter or paste text 2 (modified) to compare against editor (text 1)..." spellcheck="false" style="width: 100%; height: 90px; background: #111; color: var(--text-color); border: 1px solid #333; border-radius: 4px; padding: 8px; font-family: inherit; font-size: 0.88rem; resize: vertical;"></textarea>
            </div>
            <div class="tm-control-row" style="margin-top: 6px; gap: 14px; flex-wrap: wrap;">
              <span>mode:</span>
              <select class="tm-select" id="tm-diff-mode">
                <option value="line">line by line (unified diff)</option>
                <option value="word">word by word</option>
                <option value="char">character by character</option>
              </select>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-diff-ignore-ws"> ignore whitespace</label>
              <label class="tm-checkbox-label"><input type="checkbox" id="tm-diff-ignore-case"> ignore case</label>
            </div>
          `;
          break;
        case 'mapdiff':
          html = `
            <div class="tm-control-row" style="justify-content: space-between;">
              <span class="c-accent ansi-bold">map 2 (JSON object to compare with editor map 1):</span>
              <div style="display: flex; gap: 6px;">
                <label class="tm-btn" style="cursor:pointer;">
                  load map 2 file
                  <input type="file" id="tm-mapdiff-file" style="display:none;">
                </label>
                <button type="button" class="tm-btn" id="tm-mapdiff-swap">⇄ swap map 1 & 2</button>
              </div>
            </div>
            <div class="tm-control-row" style="align-items: stretch; margin-top: 4px;">
              <textarea class="tm-map2-textarea" id="tm-map2-val" placeholder='enter or paste map 2 JSON here, e.g.:&#10;{ "z": "a", "x": "y", "extra": "correct", "new": "value" }' spellcheck="false" style="width: 100%; height: 90px; background: #111; color: var(--text-color); border: 1px solid #333; border-radius: 4px; padding: 8px; font-family: inherit; font-size: 0.88rem; resize: vertical;">{ "z": "a", "x": "y", "extra": "correct", "new": "value" }</textarea>
            </div>
          `;
          break;
        case 'bijoy':
          html = `
            <div class="tm-control-row">
              <span>conversion direction:</span>
              <label class="tm-radio-label"><input type="radio" name="tm-bijoy-dir" value="auto" checked> auto-detect</label>
              <label class="tm-radio-label"><input type="radio" name="tm-bijoy-dir" value="ansi2uni"> bijoy (ANSI) → unicode</label>
              <label class="tm-radio-label"><input type="radio" name="tm-bijoy-dir" value="uni2ansi"> unicode → bijoy (ANSI)</label>
            </div>
          `;
          break;
        case 'longs':
        case 'long-s':
          html = `
            <div class="tm-control-row" style="flex-wrap: wrap; gap: 12px; align-items: center;">
              <span>language orthography:</span>
              <select class="tm-select" id="tm-longs-lang" style="width: 150px;">
                <option value="en" selected>english</option>
                <option value="fr">français</option>
                <option value="de">deutsch</option>
                <option value="es">español</option>
                <option value="it">italiano</option>
              </select>
              <label class="tm-checkbox-label" id="tm-longs-unknown-label" style="display: none;" title="show ambiguous/uncertain german s positions as X (otherwise replaced by long s)">
                <input type="checkbox" id="tm-longs-unknown"> keep ambiguous S as X (german)
              </label>
            </div>
            <div class="tm-control-row" style="margin-top: 4px;">
              <span class="c-dim" id="tm-longs-info" style="font-size: 0.85rem; line-height: 1.4;">
                english: replaces lowercase 's' at the start and middle of words with 'ſ' following historical printing rules (pre-1800 british & american press).
              </span>
            </div>
          `;
          break;
        case 'qrcode':
        case 'qr':
          html = `
            <div class="tm-control-row" style="align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 8px;">
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>2D type:</span>
                  <select class="tm-select" id="tm-qr-type" style="width: 140px;">
                    <option value="qr" selected>QR Code</option>
                    <option value="microqr">Micro QR Code</option>
                    <option value="rmqr">rMQR Code</option>
                    <option value="datamatrix">Data Matrix</option>
                    <option value="aztec">Aztec Code</option>
                    <option value="maxicode">MaxiCode</option>
                    <option value="dotcode">DotCode</option>
                    <option value="hanxin">Han Xin Code (汉信码)</option>
                    <option value="mailmark">Royal Mail Mailmark 2D (CMDM)</option>
                  </select>
                  <span>format:</span>
                  <select class="tm-select" id="tm-qr-fmt" style="width: 140px;">
                    <option value="preview" selected>visual & ASCII</option>
                    <option value="ascii">compact ASCII art</option>
                    <option value="full-ascii">full block ASCII</option>
                    <option value="svg">SVG code</option>
                    <option value="dataurl">data URL (PNG)</option>
                  </select>
                </div>
                <div id="tm-qr-restriction-note" class="tm-restriction-box"></div>
                <div id="tm-qr-opts-qr" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>ECC:</span>
                  <select class="tm-select" id="tm-qr-ecc" style="width: 120px;">
                    <option value="low">low (~7%)</option>
                    <option value="medium" selected>medium (~15%)</option>
                    <option value="quartile">quartile (~25%)</option>
                    <option value="high">high (~30%)</option>
                  </select>
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-qr-boost" checked> auto-boost</label>
                  <span>mask:</span>
                  <select class="tm-select" id="tm-qr-mask" style="width: 80px;">
                    <option value="-1" selected>auto</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>
                <div id="tm-qr-opts-microqr" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>version:</span>
                  <select class="tm-select" id="tm-mqr-version" style="width: 105px;" title="Micro QR version">
                    <option value="auto" selected>auto</option>
                    <option value="M1">M1 (11x11)</option>
                    <option value="M2">M2 (13x13)</option>
                    <option value="M3">M3 (15x15)</option>
                    <option value="M4">M4 (17x17)</option>
                  </select>
                  <span>ECC:</span>
                  <select class="tm-select" id="tm-mqr-ecc" style="width: 95px;" title="Micro QR error correction level">
                    <option value="auto" selected>auto</option>
                    <option value="L">L (~7%)</option>
                    <option value="M">M (~15%)</option>
                    <option value="Q">Q (~25%)</option>
                  </select>
                  <span>mask:</span>
                  <select class="tm-select" id="tm-mqr-mask" style="width: 80px;" title="Mask pattern (0-3 or auto)">
                    <option value="-1" selected>auto</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div id="tm-qr-opts-rmqr" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>size:</span>
                  <select class="tm-select" id="tm-rmqr-version" style="width: 130px;" title="rMQR rectangular dimensions">
                    <option value="auto" selected>auto (best fit)</option>
                    <optgroup label="Height R7">
                      <option value="R7x43">R7x43</option>
                      <option value="R7x59">R7x59</option>
                      <option value="R7x77">R7x77</option>
                      <option value="R7x99">R7x99</option>
                      <option value="R7x139">R7x139</option>
                    </optgroup>
                    <optgroup label="Height R9">
                      <option value="R9x43">R9x43</option>
                      <option value="R9x59">R9x59</option>
                      <option value="R9x77">R9x77</option>
                      <option value="R9x99">R9x99</option>
                      <option value="R9x139">R9x139</option>
                    </optgroup>
                    <optgroup label="Height R11">
                      <option value="R11x27">R11x27</option>
                      <option value="R11x43">R11x43</option>
                      <option value="R11x59">R11x59</option>
                      <option value="R11x77">R11x77</option>
                      <option value="R11x99">R11x99</option>
                      <option value="R11x139">R11x139</option>
                    </optgroup>
                    <optgroup label="Height R13">
                      <option value="R13x27">R13x27</option>
                      <option value="R13x43">R13x43</option>
                      <option value="R13x59">R13x59</option>
                      <option value="R13x77">R13x77</option>
                      <option value="R13x99">R13x99</option>
                      <option value="R13x139">R13x139</option>
                    </optgroup>
                    <optgroup label="Height R15">
                      <option value="R15x43">R15x43</option>
                      <option value="R15x59">R15x59</option>
                      <option value="R15x77">R15x77</option>
                      <option value="R15x99">R15x99</option>
                      <option value="R15x139">R15x139</option>
                    </optgroup>
                    <optgroup label="Height R17">
                      <option value="R17x43">R17x43</option>
                      <option value="R17x59">R17x59</option>
                      <option value="R17x77">R17x77</option>
                      <option value="R17x99">R17x99</option>
                      <option value="R17x139">R17x139</option>
                    </optgroup>
                  </select>
                  <span>ECC:</span>
                  <select class="tm-select" id="tm-rmqr-ecc" style="width: 100px;" title="rMQR error correction level">
                    <option value="M" selected>M (~15%)</option>
                    <option value="H">H (~30%)</option>
                  </select>
                </div>
                <div id="tm-qr-opts-dm" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>shape:</span>
                  <select class="tm-select" id="tm-dm-shape" style="width: 120px;">
                    <option value="auto" selected>auto</option>
                    <option value="square">square</option>
                    <option value="rect">rectangular</option>
                  </select>
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-dm-parsefnc"> parse FNC</label>
                </div>
                <div id="tm-qr-opts-aztec" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>format:</span>
                  <select class="tm-select" id="tm-aztec-fmt" style="width: 100px;">
                    <option value="auto" selected>auto</option>
                    <option value="compact">compact</option>
                    <option value="full">full-range</option>
                  </select>
                  <span>ECC %:</span>
                  <input type="number" class="tm-input" id="tm-aztec-ecc" value="23" min="5" max="95" style="width: 50px;">
                  <span>layers:</span>
                  <input type="number" class="tm-input" id="tm-aztec-layers" value="0" min="0" max="32" style="width: 50px;" title="0 for auto">
                </div>
                <div id="tm-qr-opts-maxi" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>mode:</span>
                  <select class="tm-select" id="tm-maxi-mode" style="width: 170px;">
                    <option value="4" selected>mode 4 (standard data)</option>
                    <option value="2">mode 2 (US SCM postal)</option>
                    <option value="3">mode 3 (intl. postal)</option>
                    <option value="5">mode 5 (enhanced ECC)</option>
                  </select>
                </div>
                <div id="tm-qr-opts-dotcode" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>cols:</span>
                  <input type="number" class="tm-input" id="tm-dot-cols" value="0" min="0" max="100" style="width: 50px;" title="0 for auto">
                  <span>rows:</span>
                  <input type="number" class="tm-input" id="tm-dot-rows" value="0" min="0" max="100" style="width: 50px;" title="0 for auto">
                  <span>ratio:</span>
                  <input type="number" class="tm-input" id="tm-dot-ratio" value="" min="0.1" max="10" step="0.1" style="width: 50px;" placeholder="auto">
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-dot-parsefnc"> parse FNC</label>
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-dot-fastfind"> fast find</label>
                </div>
                <div id="tm-qr-opts-hanxin" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>ECC:</span>
                  <select class="tm-select" id="tm-hx-ecc" style="width: 105px;" title="Han Xin error correction level">
                    <option value="L1">L1 (~8%)</option>
                    <option value="L2" selected>L2 (~15%)</option>
                    <option value="L3">L3 (~23%)</option>
                    <option value="L4">L4 (~30%)</option>
                  </select>
                  <span>version:</span>
                  <input type="number" class="tm-input" id="tm-hx-version" value="0" min="0" max="84" style="width: 50px;" title="0 for auto version (1 to 84)">
                  <span>mask:</span>
                  <select class="tm-select" id="tm-hx-mask" style="width: 80px;" title="Mask pattern (1-4 or auto)">
                    <option value="0" selected>auto</option>
                    <option value="1">mask 1</option>
                    <option value="2">mask 2</option>
                    <option value="3">mask 3</option>
                    <option value="4">mask 4</option>
                  </select>
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-hx-parsefnc"> parse FNC</label>
                </div>
                <div id="tm-qr-opts-mailmark" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>CMDM type:</span>
                  <select class="tm-select" id="tm-mailmark-type" style="width: 150px;">
                    <option value="auto" selected>auto (by length)</option>
                    <option value="7">Type 7 (24x24)</option>
                    <option value="9">Type 9 (32x32)</option>
                    <option value="29">Type 29 (16x48)</option>
                  </select>
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>scale:</span>
                  <input type="number" class="tm-input" id="tm-qr-scale" value="8" min="1" max="40" style="width: 50px;">
                  <span>border:</span>
                  <input type="number" class="tm-input" id="tm-qr-border" value="4" min="0" max="30" style="width: 50px;">
                  <span>colors:</span>
                  <label class="tm-color-label" title="dark module color">dark: <input type="color" id="tm-qr-color-dark" value="#000000" class="tm-color-picker"></label>
                  <label class="tm-color-label" title="light module color">light: <input type="color" id="tm-qr-color-light" value="#ffffff" class="tm-color-picker"></label>
                  <span>theme:</span>
                  <select class="tm-select" id="tm-qr-palette" style="width: 100px;">
                    <option value="custom">custom</option>
                    <option value="bw" selected>B/W</option>
                    <option value="matrix">matrix</option>
                    <option value="dracula">dracula</option>
                    <option value="nord">nord</option>
                    <option value="cyberpunk">cyberpunk</option>
                  </select>
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 6px; flex-wrap: wrap; align-items: center;">
                  <button type="button" class="tm-btn" id="tm-qr-dl-png">download PNG</button>
                  <select class="tm-select" id="tm-qr-png-size" style="width: 140px;" title="PNG download resolution (max 4000x4000 or adjusted width/height for rectangular)">
                    <option value="auto">size: auto</option>
                    <option value="512">size: 512 px</option>
                    <option value="1024">size: 1024 px</option>
                    <option value="2048">size: 2048 px</option>
                    <option value="3000">size: 3000 px</option>
                    <option value="4000" selected>size: 4000 px</option>
                    <option value="custom">size: custom...</option>
                  </select>
                  <input type="number" class="tm-input" id="tm-qr-custom-size" value="4000" min="50" max="4000" step="50" style="width: 75px; display: none;" placeholder="px (max 4000)" title="Custom max dimension in px (max 4000)">
                  <button type="button" class="tm-btn" id="tm-qr-dl-svg">download SVG</button>
                  <button type="button" class="tm-btn" id="tm-qr-copy-ascii">copy ASCII</button>
                  <button type="button" class="tm-btn" id="tm-qr-copy-svg">copy SVG</button>
                </div>
              </div>
              <div id="tm-qr-preview-box" class="tm-qr-preview-container">
                <canvas id="tm-qr-canvas" class="tm-qr-canvas" style="display:none;"></canvas>
                <div id="tm-qr-svg-wrap" class="tm-qr-svg-wrap"></div>
                <div id="tm-qr-meta" class="tm-qr-meta c-dim">type text to generate 2D code</div>
              </div>
            </div>
          `;
          break;
        case 'barcode':
        case 'bc':
          html = `
            <div class="tm-control-row" style="align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 8px;">
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>symbology:</span>
                  <select class="tm-select" id="tm-bc-format" style="width: 140px;">
                    <option value="CODE128" selected>CODE128 (auto)</option>
                    <option value="CODE128A">CODE128 A</option>
                    <option value="CODE128B">CODE128 B</option>
                    <option value="CODE128C">CODE128 C</option>
                    <option value="EAN13">EAN-13</option>
                    <option value="EAN8">EAN-8</option>
                    <option value="UPC">UPC (UPC-A)</option>
                    <option value="UPCE">UPC-E</option>
                    <option value="CODE39">CODE39</option>
                    <option value="ITF14">ITF-14</option>
                    <option value="ITF">ITF</option>
                    <option value="postnet">POSTNET (USPS)</option>
                    <option value="planet">PLANET (USPS)</option>
                    <option value="onecode">Intelligent Mail (USPS)</option>
                    <option value="rm4scc">RM4SCC (Royal Mail)</option>
                    <option value="kix">KIX Code (PostNL)</option>
                    <option value="mailmark4s">Mailmark 4-State (Royal Mail)</option>
                    <option value="mailmark2d">Mailmark 2D (Royal Mail CMDM)</option>
                    <option value="pdf417">PDF417 (stacked 2D)</option>
                    <option value="compactpdf417">Compact PDF417</option>
                    <option value="pharmacode">Pharmacode</option>
                    <option value="codabar">Codabar</option>
                    <option value="CODE93">CODE93</option>
                    <option value="MSI">MSI</option>
                    <option value="MSI10">MSI 10</option>
                    <option value="MSI11">MSI 11</option>
                  </select>
                  <span>output:</span>
                  <select class="tm-select" id="tm-bc-output" style="width: 130px;">
                    <option value="preview" selected>visual & ASCII</option>
                    <option value="ascii">raw ASCII art</option>
                    <option value="svg">SVG code</option>
                    <option value="dataurl">data URL (PNG)</option>
                  </select>
                </div>
                <div id="tm-bc-restriction-note" class="tm-restriction-box"></div>
                <div id="tm-bc-pdf-opts" class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; display: none;">
                  <span>PDF417 cols:</span>
                  <input type="number" class="tm-input" id="tm-pdf-cols" value="0" min="0" max="30" style="width: 50px;" title="0 for auto">
                  <span>rows:</span>
                  <input type="number" class="tm-input" id="tm-pdf-rows" value="0" min="0" max="90" style="width: 50px;" title="0 for auto">
                  <span>ECC (0-8):</span>
                  <input type="number" class="tm-input" id="tm-pdf-ecc" value="" min="0" max="8" style="width: 50px;" placeholder="auto">
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-pdf-compact"> compact</label>
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>bar width:</span>
                  <input type="number" class="tm-input" id="tm-bc-width" value="2" min="1" max="10" style="width: 50px;">
                  <span>height:</span>
                  <input type="number" class="tm-input" id="tm-bc-height" value="80" min="10" max="300" style="width: 60px;">
                  <span>margin:</span>
                  <input type="number" class="tm-input" id="tm-bc-margin" value="10" min="0" max="50" style="width: 50px;">
                  <label class="tm-checkbox-label"><input type="checkbox" id="tm-bc-display-val" checked> show text</label>
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>text pos:</span>
                  <select class="tm-select" id="tm-bc-textpos" style="width: 90px;">
                    <option value="bottom" selected>bottom</option>
                    <option value="top">top</option>
                  </select>
                  <span>align:</span>
                  <select class="tm-select" id="tm-bc-textalign" style="width: 90px;">
                    <option value="center" selected>center</option>
                    <option value="left">left</option>
                    <option value="right">right</option>
                  </select>
                  <span>font size:</span>
                  <input type="number" class="tm-input" id="tm-bc-fontsize" value="16" min="8" max="40" style="width: 50px;">
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap;">
                  <span>colors:</span>
                  <label class="tm-color-label" title="Bar color">bars: <input type="color" id="tm-bc-color-bar" value="#000000" class="tm-color-picker"></label>
                  <label class="tm-color-label" title="Background color">BG: <input type="color" id="tm-bc-color-bg" value="#ffffff" class="tm-color-picker"></label>
                  <span>theme:</span>
                  <select class="tm-select" id="tm-bc-palette" style="width: 110px;">
                    <option value="custom">custom</option>
                    <option value="bw" selected>classic B/W</option>
                    <option value="matrix">matrix green</option>
                    <option value="dracula">dracula</option>
                    <option value="nord">nord</option>
                    <option value="cyberpunk">cyberpunk</option>
                  </select>
                </div>
                <div class="tm-control-row" style="margin: 0; gap: 6px; flex-wrap: wrap; align-items: center;">
                  <button type="button" class="tm-btn" id="tm-bc-dl-png">download PNG</button>
                  <select class="tm-select" id="tm-bc-png-size" style="width: 140px;" title="PNG download resolution (max 4000x4000 or adjusted width/height for rectangular)">
                    <option value="auto">size: auto</option>
                    <option value="512">size: 512 px</option>
                    <option value="1024">size: 1024 px</option>
                    <option value="2048">size: 2048 px</option>
                    <option value="3000">size: 3000 px</option>
                    <option value="4000" selected>size: 4000 px</option>
                    <option value="custom">size: custom...</option>
                  </select>
                  <input type="number" class="tm-input" id="tm-bc-custom-size" value="4000" min="50" max="4000" step="50" style="width: 75px; display: none;" placeholder="px (max 4000)" title="Custom max dimension in px (max 4000)">
                  <button type="button" class="tm-btn" id="tm-bc-dl-svg">download SVG</button>
                  <button type="button" class="tm-btn" id="tm-bc-copy-ascii">copy ASCII</button>
                  <button type="button" class="tm-btn" id="tm-bc-copy-svg">copy SVG</button>
                </div>
              </div>
              <div id="tm-bc-preview-box" class="tm-barcode-preview-container">
                <div id="tm-bc-svg-wrap" class="tm-barcode-svg-wrap"></div>
                <div id="tm-bc-meta" class="tm-barcode-meta c-dim">Enter text to generate barcode</div>
              </div>
            </div>
          `;
          break;
        case 'decayfmt':
          html = `
            <div class="tm-decay-wrap">
              <div class="tm-decay-tabs">
                <button type="button" class="tm-decay-tab-btn active" id="tm-decay-tab-sim">authentic .idcy/.tdcy simulator</button>
                <button type="button" class="tm-decay-tab-btn" id="tm-decay-tab-glitch">direct file corrupter & glitcher</button>
              </div>

              <div class="tm-control-row" style="align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 290px; display: flex; flex-direction: column; gap: 8px;">

                  <!-- File Upload Dropzone -->
                  <div class="tm-decay-dropzone" id="tm-decay-dropzone" title="Drop file here or click to browse">
                    <div><span class="c-accent">drag & drop</span> an image (PNG/JPG), text file, or .idcy/.tdcy, or <span class="c-accent">browse</span></div>
                    <div class="c-dim" style="font-size:0.7rem; margin-top:2px;" id="tm-decay-dropzone-info">or type/paste text in the main editor above</div>
                    <input type="file" id="tm-decay-file-input" style="display:none;" accept="image/*,text/*,.txt,.md,.json,.csv,.idcy*,.tdcy*,*/*">
                  </div>

                  <!-- Parameters Row -->
                  <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; align-items: center;">
                    <span>instability (x):</span>
                    <input type="range" id="tm-decay-x-range" min="0.5" max="20" step="0.5" value="3.0" style="width: 110px;">
                    <input type="number" class="tm-input" id="tm-decay-x-num" value="3.0" min="0.1" max="50" step="0.1" style="width: 55px;">
                    <span class="tm-decay-stat-badge" id="tm-decay-prob-badge" title="Per-byte corruption probability p = 1 - e^(-x/10)">p ≈ 25.9% / open</span>
                  </div>

                  <!-- Specific controls for Simulator Mode -->
                  <div id="tm-decay-sim-controls" style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="tm-control-row" style="margin: 0; gap: 8px; flex-wrap: wrap; align-items: center;">
                      <span class="tm-decay-stat-badge" id="tm-decay-sim-format-badge">format: .tdcy3 (text)</span>
                      <span class="tm-decay-stat-badge" id="tm-decay-sim-opens-badge" style="color:var(--accent-color);">opens: 0 (pristine)</span>
                      <button type="button" class="tm-btn tm-btn-primary" id="tm-decay-sim-open-btn" style="padding: 4px 12px; font-weight: bold;" title="simulates opening the file on disk: permanently corrupts payload in-place before displaying">open / read file (+1 decay)</button>
                    </div>
                    <div class="tm-control-row" style="margin: 0; gap: 6px; flex-wrap: wrap; align-items: center;">
                      <button type="button" class="tm-btn" id="tm-decay-sim-dl-idcy" title="download authentic binary decayfmt file with DCYF header">download .idcy / .tdcy</button>
                      <button type="button" class="tm-btn" id="tm-decay-sim-export-clean" title="export as viewable standard file (PNG / TXT)">export viewable (PNG/TXT)</button>
                      <button type="button" class="tm-btn" id="tm-decay-sim-reset-btn" title="reset back to 0 opens">reset pristine</button>
                    </div>
                  </div>

                  <!-- Specific controls for Direct Corrupter Mode -->
                  <div id="tm-decay-glitch-controls" style="display: none; flex-direction: column; gap: 8px;">
                    <div class="tm-control-row" style="margin: 0; gap: 10px; flex-wrap: wrap; align-items: center;">
                      <span>iterations (opens):</span>
                      <input type="number" class="tm-input" id="tm-decay-iters-num" value="1" min="1" max="100" style="width: 55px;">
                      <button type="button" class="tm-btn tm-btn-primary" id="tm-decay-glitch-run-btn" style="padding: 4px 12px; font-weight: bold;">corrupt now</button>
                      <button type="button" class="tm-btn" id="tm-decay-glitch-step-btn">+1 step</button>
                      <button type="button" class="tm-btn" id="tm-decay-glitch-reset-btn">reset</button>
                    </div>
                    <div class="tm-control-row" style="margin: 0; gap: 6px; flex-wrap: wrap; align-items: center;">
                      <button type="button" class="tm-btn" id="tm-decay-glitch-dl-btn" style="font-weight: 600;">download corrupted file</button>
                      <button type="button" class="tm-btn" id="tm-decay-glitch-dl-idcy">save as .idcy / .tdcy</button>
                    </div>
                  </div>

                  <!-- Decay Entropy Meter -->
                  <div class="tm-decay-meter-wrap">
                    <span style="font-size:0.72rem; color:#888;">entropy:</span>
                    <div class="tm-decay-meter"><div class="tm-decay-meter-fill" id="tm-decay-meter-fill"></div></div>
                    <span id="tm-decay-meter-text" style="font-size:0.72rem; color:var(--accent-color); min-width:40px;">0%</span>
                  </div>

                </div>

                <!-- Preview Box (Canvas for images / payload status) -->
                <div class="tm-decay-preview-container">
                  <div class="tm-decay-canvas-wrap" id="tm-decay-canvas-wrap">
                    <canvas id="tm-decay-canvas" class="tm-decay-canvas" width="128" height="128"></canvas>
                  </div>
                  <div class="tm-control-row" style="margin: 0; gap: 4px; justify-content: center;">
                    <button type="button" class="tm-btn" id="tm-decay-toggle-view" style="font-size:0.7rem; padding:2px 6px;">view: decayed</button>
                    <span class="tm-decay-stat-badge" id="tm-decay-res-badge">text mode</span>
                  </div>
                  <div class="c-dim" style="font-size:0.68rem; text-align:center;" id="tm-decay-status-info">ready to decay</div>
                </div>

              </div>
            </div>
          `;
          break;
        case 'unicodemap':
          html = `
            <div class="tm-unimap-wrap">
              <div class="tm-unimap-top-bar">
                <div class="tm-unimap-tabs">
                  <button type="button" class="tm-unimap-tab-btn active" id="tm-unimap-tab-map" data-tab="map">⊞ character map</button>
                  <button type="button" class="tm-unimap-tab-btn" id="tm-unimap-tab-rs" data-tab="rsindex">㊎ RSIndex</button>
                </div>
                <div class="tm-unimap-nav-group" style="font-size:0.75rem;">
                  <span>font:</span>
                  <select class="tm-select" id="tm-unimap-font-select" style="width: 220px;" title="select font for character grid">
                    <optgroup label="Noto">
                      <option value="noto-auto" selected>Noto Serif</option>
                      <option value="noto-sc">Noto Serif SC (simplified)</option>
                      <option value="noto-tc">Noto Serif TC (Taiwan)</option>
                      <option value="noto-hk">Noto Serif HK (Hong Kong)</option>
                      <option value="noto-jp">Noto Serif JP (japanese mincho)</option>
                    </optgroup>
                    <optgroup label="GNU Unifont">
                      <option value="unifont">Unifont</option>
                      <option value="unifont-t">Unifont traditional (Taiwan)</option>
                      <option value="unifont-jp">Unifont japanese (JIS X 0213)</option>
                      <option value="unifont-csur">Unifont CSUR (ConScript PUA)</option>
                    </optgroup>
                    <optgroup label="system">
                      <option value="native">native / system font</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <!-- Character Map Toolbar -->
              <div class="tm-unimap-toolbar" id="tm-unimap-toolbar-map">
                <div class="tm-unimap-nav-group">
                  <span class="c-accent ansi-bold">plane:</span>
                  <select class="tm-select" id="tm-unimap-plane-select" style="max-width: 195px;"></select>

                  <span class="c-accent ansi-bold" style="margin-left:4px;">block:</span>
                  <select class="tm-select" id="tm-unimap-block-select" style="max-width: 250px;"></select>

                  <button type="button" class="tm-btn" id="tm-unimap-prev-blk" title="previous block">◀︎ blk</button>
                  <button type="button" class="tm-btn" id="tm-unimap-next-blk" title="next block">blk ▶︎</button>
                  <button type="button" class="tm-btn" id="tm-unimap-prev-page" title="previous 256 code points">◀︎ page</button>
                  <button type="button" class="tm-btn" id="tm-unimap-next-page" title="next 256 code points">page ▶︎</button>
                </div>

                <div class="tm-unimap-nav-group">
                  <span>filter:</span>
                  <select class="tm-select" id="tm-unimap-filter-select" style="width: 155px;" title="filter code points by Unicode version">
                    <option value="all">all characters</option>
                    <option value="18.0">Unicode 18.0</option>
                    <option value="17.0">Unicode 17.0</option>
                    <option value="16.0">Unicode 16.0</option>
                    <option value="15.1">Unicode 15.1</option>
                    <option value="15.0">Unicode 15.0</option>
                    <option value="14.0">Unicode 14.0</option>
                    <option value="13.0">Unicode 13.0</option>
                    <option value="12.1">Unicode 12.1</option>
                    <option value="12.0">Unicode 12.0</option>
                    <option value="11.0">Unicode 11.0</option>
                    <option value="10.0">Unicode 10.0</option>
                    <option value="9.0">Unicode 9.0</option>
                    <option value="8.0">Unicode 8.0</option>
                    <option value="7.0">Unicode 7.0</option>
                    <option value="6.3">Unicode 6.3</option>
                    <option value="6.2">Unicode 6.2</option>
                    <option value="6.1">Unicode 6.1</option>
                    <option value="6.0">Unicode 6.0</option>
                    <option value="5.2">Unicode 5.2</option>
                    <option value="5.1">Unicode 5.1</option>
                    <option value="5.0">Unicode 5.0</option>
                    <option value="4.1">Unicode 4.1</option>
                    <option value="4.0">Unicode 4.0</option>
                    <option value="3.2">Unicode 3.2</option>
                    <option value="3.1">Unicode 3.1</option>
                    <option value="3.0">Unicode 3.0</option>
                    <option value="2.1">Unicode 2.1</option>
                    <option value="2.0">Unicode 2.0</option>
                    <option value="1.1">Unicode 1.1</option>
                  </select>

                  <span>go to:</span>
                  <input type="text" class="tm-input" id="tm-unimap-goto-input" placeholder="U+XXXX" style="width: 75px;">
                  <button type="button" class="tm-btn" id="tm-unimap-goto-btn">go</button>

                  <span>search:</span>
                  <input type="text" class="tm-input" id="tm-unimap-search-input" placeholder="name, pinyin, meaning..." style="width: 145px;">
                </div>
              </div>

              <!-- RSIndex & Pedagogical Workbench Toolbar -->
              <div class="tm-unimap-toolbar" id="tm-unimap-toolbar-rs" style="display:none; flex-wrap:wrap; gap:8px;">
                <div class="tm-unimap-nav-group">
                  <span class="c-accent ansi-bold">schema:</span>
                  <select class="tm-select" id="tm-unimap-rs-schema-select" style="font-weight:600; min-width:175px;">
                    <option value="kangxi">kangxi radical-stroke (214 radicals)</option>
                    <option value="hsk">HSK 3.0 (bands 1 — 7-9)</option>
                    <option value="tocfl">TOCFL taiwan (novice — band C)</option>
                    <option value="joyo">japanese jōyō grade (grade 1-6, secondary)</option>
                    <option value="jlpt">JLPT band (N5 beginner — N1 advanced)</option>
                    <option value="zipf">spoken frequency (Zipfian scale)</option>
                  </select>
                </div>

                <!-- Kangxi Controls -->
                <div class="tm-unimap-nav-group" id="tm-unimap-rs-kangxi-controls">
                  <span class="c-accent ansi-bold">radical:</span>
                  <button type="button" class="tm-btn" id="tm-unimap-rs-prev-rad" title="previous radical">◀︎</button>
                  <select class="tm-select" id="tm-unimap-rs-rad-select" style="min-width: 200px; max-width: 290px;"></select>
                  <button type="button" class="tm-btn" id="tm-unimap-rs-next-rad" title="next radical">▶︎</button>

                  <span class="c-accent ansi-bold" style="margin-left:4px;">strokes:</span>
                  <select class="tm-select" id="tm-unimap-rs-stroke-select" style="max-width: 120px;"></select>
                </div>

                <!-- Pedagogical Group Controls -->
                <div class="tm-unimap-nav-group" id="tm-unimap-rs-ped-controls" style="display:none;">
                  <span class="c-accent ansi-bold">tier:</span>
                  <button type="button" class="tm-btn" id="tm-unimap-rs-prev-ped" title="previous tier">◀︎</button>
                  <select class="tm-select" id="tm-unimap-rs-ped-select" style="min-width: 220px;"></select>
                  <button type="button" class="tm-btn" id="tm-unimap-rs-next-ped" title="next tier">▶︎</button>
                </div>

                <div class="tm-unimap-nav-group" style="margin-left:auto;">
                  <span>find / word:</span>
                  <input type="text" class="tm-input" id="tm-unimap-rs-find-input" placeholder="char, word (e.g. 公主), or U+XXXX" style="width: 180px;">
                  <button type="button" class="tm-btn" id="tm-unimap-rs-find-btn">inspect</button>
                </div>

                <!-- Mode & Learning Controls -->
                <div class="tm-unimap-nav-group" id="tm-unimap-study-modes" style="display:none; width:100%; border-top:1px solid #222; padding-top:6px; margin-top:2px;">
                  <span class="c-accent ansi-bold">view:</span>
                  <div class="tm-btn-group">
                    <button type="button" class="tm-btn active" id="tm-unimap-mode-grid">grid</button>
                    <button type="button" class="tm-btn" id="tm-unimap-mode-deck">study deck</button>
                    <button type="button" class="tm-btn" id="tm-unimap-mode-vocab">vocabulary list</button>
                  </div>

                  <span class="c-accent ansi-bold" style="margin-left:10px;" id="tm-unimap-filter-label">status:</span>
                  <select class="tm-select" id="tm-unimap-mastery-filter" style="max-width:130px;">
                    <option value="all">all characters</option>
                    <option value="unlearned">unlearned</option>
                    <option value="learning">learning</option>
                    <option value="review">review</option>
                    <option value="mastered">mastered</option>
                    <option value="starred">starred</option>
                  </select>

                  <button type="button" class="tm-btn" id="tm-unimap-export-anki" style="margin-left:auto;" title="export current tier to Anki (.tsv)">export deck (.tsv)</button>
                </div>
              </div>

              <!-- Multi-Character Word Decomposition Drawer -->
              <div id="tm-unimap-rs-word-decomp" style="display:none; margin: 4px 0 8px 0; padding: 8px 12px; background: #121212; border: 1px solid #282828; border-radius: 4px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:0.75rem; color:#888;">word decomposition: <strong id="tm-unimap-decomp-word" class="c-accent" style="font-size:0.95rem;"></strong></span>
                  <button type="button" class="tm-btn" id="tm-unimap-decomp-close" style="padding:1px 6px; font-size:0.7rem;">✕︎ close</button>
                </div>
                <div id="tm-unimap-decomp-chips" style="display:flex; gap:8px; flex-wrap:wrap;"></div>
              </div>

              <div id="tm-unimap-search-results" style="display:none; max-height: 110px; overflow-y:auto; background:#111; border:1px solid #333; border-radius:4px; padding:4px 8px; font-size:0.75rem;"></div>

              <div class="tm-unimap-layout">
                <!-- Character Map Grid Pane -->
                <div class="tm-unimap-grid-pane" id="tm-unimap-pane-map">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; color: #888;">
                    <div>range: <span id="tm-unimap-range-lbl" class="c-accent" style="font-family:monospace; font-weight:bold;">U+0000-U+00FF</span> (<span id="tm-unimap-block-lbl">Basic Latin</span>)</div>
                    <div id="tm-unimap-filter-indicator" style="display:none; color:var(--accent-color); font-weight:bold; font-size:0.72rem;">unicode filter active</div>
                  </div>

                  <div class="tm-unimap-grid-container" id="tm-unimap-grid-container">
                    <div class="tm-unimap-grid font-noto-auto" id="tm-unimap-grid" data-schema="kangxi"></div>
                  </div>
                </div>

                <!-- RSIndex Grouped Pane & Learner Suite -->
                <div class="tm-unimap-grid-pane" id="tm-unimap-pane-rs" style="display:none;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; color: #888;">
                    <div><span id="tm-unimap-rs-schema-lbl">radical:</span> <span id="tm-unimap-rs-info-lbl" class="c-accent" style="font-weight:bold;">radical #1 (one) 一</span></div>
                    <div id="tm-unimap-rs-total-lbl" style="color:#aaa; font-size:0.72rem;">335 characters</div>
                  </div>

                  <!-- Study Progress Box -->
                  <div id="tm-unimap-study-progress-box" style="display:none; margin: 4px 0 8px 0; padding: 6px 12px; background: #0c0c0c; border: 1px solid #222; border-radius: 4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-bottom:4px;">
                      <div id="tm-unimap-progress-text"><span class="c-accent ansi-bold">progress:</span> <span id="tm-unimap-progress-stats">0 / 0 learned (0%)</span></div>
                      <div id="tm-unimap-progress-substats" style="color:#888; font-size:0.7rem;">0 mastered · 0 starred</div>
                    </div>
                    <div class="tm-unimap-progress-track">
                      <div id="tm-unimap-progress-fill" class="tm-unimap-progress-fill" style="width: 0%;"></div>
                    </div>
                  </div>

                  <!-- Grid Container (Database View) -->
                  <div class="tm-unimap-rs-container" id="tm-unimap-rs-container">
                    <div style="padding:20px; text-align:center; color:#888;">loading radical-stroke index...</div>
                  </div>

                  <!-- Flashcard Study Deck Pane -->
                  <div id="tm-unimap-rs-deck" class="tm-unimap-deck-container" style="display:none;">
                    <div class="tm-deck-header">
                      <div id="tm-deck-card-counter" class="tm-deck-counter">card 1 of 0</div>
                      <div style="display:flex; gap:8px;">
                        <button type="button" class="tm-btn tm-deck-btn" id="tm-deck-star-btn">star</button>
                        <button type="button" class="tm-btn tm-deck-btn" id="tm-deck-shuffle-btn">shuffle</button>
                      </div>
                    </div>

                    <div class="tm-deck-card" id="tm-deck-card">
                      <div class="tm-deck-front" id="tm-deck-front">
                        <div class="tm-deck-glyph-box">
                          <div class="tm-deck-glyph font-noto-auto" id="tm-deck-char" data-schema="hsk">-</div>
                        </div>
                        <div class="tm-deck-hint" id="tm-deck-hint">-</div>
                        <button type="button" class="tm-btn tm-deck-reveal-btn" id="tm-deck-reveal-btn">reveal answer (space)</button>
                      </div>

                      <div class="tm-deck-back" id="tm-deck-back" style="display:none;">
                        <div class="tm-deck-readings-box">
                          <div style="display:flex; align-items:center; gap:8px;">
                            <div class="tm-deck-pinyin c-accent" id="tm-deck-pinyin">-</div>
                            <button type="button" class="tm-btn" id="tm-deck-audio-btn" style="padding:1px 6px; font-size:0.7rem;">pronounce</button>
                          </div>
                          <div class="tm-deck-definition" id="tm-deck-definition">-</div>
                          <div class="tm-deck-kanji" id="tm-deck-kanji" style="display:none; color:#ddd; font-size:0.78rem;"></div>
                        </div>

                        <div class="tm-deck-compounds" id="tm-deck-compounds"></div>

                        <div class="tm-deck-grading-box">
                          <div class="tm-deck-grading-label">grade recall:</div>
                          <div class="tm-deck-grades">
                            <button type="button" class="tm-deck-grade grade-again" data-grade="again" id="tm-deck-grade-again">again (1)</button>
                            <button type="button" class="tm-deck-grade grade-hard" data-grade="hard" id="tm-deck-grade-hard">hard (2)</button>
                            <button type="button" class="tm-deck-grade grade-good" data-grade="good" id="tm-deck-grade-good">good (3)</button>
                            <button type="button" class="tm-deck-grade grade-easy" data-grade="easy" id="tm-deck-grade-easy">easy (4)</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="tm-deck-nav">
                      <button type="button" class="tm-btn" id="tm-deck-prev-btn">previous</button>
                      <button type="button" class="tm-btn" id="tm-deck-next-btn">next</button>
                      <button type="button" class="tm-btn" id="tm-deck-reset-btn" style="margin-left:auto;">reset deck stats</button>
                    </div>
                  </div>

                  <!-- Vocabulary List Pane -->
                  <div id="tm-unimap-rs-vocab" class="tm-unimap-vocab-pane" style="display:none;">
                    <div class="tm-vocab-toolbar">
                      <div id="tm-vocab-count-lbl" style="font-size:0.75rem; color:#888;">0 words in tier</div>
                      <input type="text" class="tm-input" id="tm-vocab-filter-input" placeholder="filter words, pīnyīn, meaning..." style="width:200px;">
                    </div>
                    <div class="tm-vocab-list-scroll" id="tm-vocab-list-scroll"></div>
                  </div>
                </div>

                <div class="tm-unimap-inspector" id="tm-unimap-inspector">
                  <div class="tm-unimap-preview-header">
                    <div class="tm-unimap-preview-box font-noto-auto" id="tm-unimap-preview-glyph" data-schema="kangxi">A</div>
                    <div class="tm-unimap-char-title">
                      <div style="display:flex; align-items:center; gap:6px;">
                        <div class="tm-unimap-cp-badge" id="tm-unimap-cp-badge">U+0041</div>
                        <span id="tm-unimap-age-pill" class="tm-unimap-tag">Unicode 1.1</span>
                      </div>
                      <div class="tm-unimap-name-badge" id="tm-unimap-name-badge">LATIN CAPITAL LETTER A</div>
                    </div>
                  </div>

                  <table class="tm-unimap-props-table">
                    <tbody>
                      <tr><td class="prop-lbl">decimal:</td><td class="prop-val" id="tm-unimap-p-dec">65</td></tr>
                      <tr><td class="prop-lbl">block:</td><td class="prop-val" id="tm-unimap-p-block">Basic Latin</td></tr>
                      <tr><td class="prop-lbl">plane:</td><td class="prop-val" id="tm-unimap-p-plane">Plane 0 (BMP)</td></tr>
                      <tr><td class="prop-lbl">script:</td><td class="prop-val" id="tm-unimap-p-script">Latin</td></tr>
                      <tr><td class="prop-lbl">category:</td><td class="prop-val" id="tm-unimap-p-cat">Lu (letter, uppercase)</td></tr>
                      <tr><td class="prop-lbl">bidi class:</td><td class="prop-val" id="tm-unimap-p-bidi">L (Left-to-Right)</td></tr>
                      <tr><td class="prop-lbl">combining:</td><td class="prop-val" id="tm-unimap-p-ccc">0 (Spacing / Base)</td></tr>
                      <tr><td class="prop-lbl">ea width:</td><td class="prop-val" id="tm-unimap-p-eaw">Na (Narrow)</td></tr>
                      <tr><td class="prop-lbl">line break:</td><td class="prop-val" id="tm-unimap-p-lb">AL (Alphabetic)</td></tr>
                      <tr id="tm-unimap-row-mirrored" style="display:none;"><td class="prop-lbl">mirrored:</td><td class="prop-val" id="tm-unimap-p-mirrored">no</td></tr>
                      <tr id="tm-unimap-row-decomp" style="display:none;"><td class="prop-lbl">decomp:</td><td class="prop-val" id="tm-unimap-p-decomp">-</td></tr>
                      <tr id="tm-unimap-row-numeric" style="display:none;"><td class="prop-lbl">numeric:</td><td class="prop-val" id="tm-unimap-p-numeric">-</td></tr>
                      <tr id="tm-unimap-row-cases" style="display:none;"><td class="prop-lbl">mappings:</td><td class="prop-val" id="tm-unimap-p-cases">-</td></tr>
                      <tr id="tm-unimap-row-indic" style="display:none;"><td class="prop-lbl">indic:</td><td class="prop-val" id="tm-unimap-p-indic">-</td></tr>
                      <tr id="tm-unimap-row-arabic" style="display:none;"><td class="prop-lbl">arabic join:</td><td class="prop-val" id="tm-unimap-p-arabic">-</td></tr>
                      <tr id="tm-unimap-row-alias" style="display:none;"><td class="prop-lbl">alias:</td><td class="prop-val" id="tm-unimap-p-alias">-</td></tr>
                    </tbody>
                  </table>

                  <!-- Specialized Cards: Pedagogical Proficiency & Curricular Benchmarks -->
                  <div id="tm-unimap-card-pedagogy" class="tm-unimap-card" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="tm-unimap-card-title">pedagogical benchmarks</div>
                      <span id="tm-unimap-ped-rs-jump" class="tm-unimap-link" style="font-size:0.7rem; cursor:pointer;" title="view in pedagogical workbench">㊎ view in workbench →</span>
                    </div>
                    <div id="tm-unimap-ped-badges" class="tm-unimap-ped-badges"></div>
                    <div id="tm-unimap-ped-meaning-row" class="tm-unimap-ped-meaning-box" style="display:none;">
                      <div id="tm-unimap-ped-pinyin-line" class="tm-unimap-ped-line" style="display:none;"><span class="tm-unimap-ped-lbl">pīnyīn:</span> <span id="tm-unimap-ped-pinyin" class="c-accent ansi-bold" style="font-size:0.88rem;"></span></div>
                      <div id="tm-unimap-ped-def-line" class="tm-unimap-ped-line" style="display:none;"><span class="tm-unimap-ped-lbl">definition:</span> <span id="tm-unimap-ped-definition" style="color:#eee;"></span></div>
                      <div id="tm-unimap-ped-kanji-line" class="tm-unimap-ped-line" style="display:none;"><span class="tm-unimap-ped-lbl">kanji:</span> <span id="tm-unimap-ped-kanji-onkun" class="c-accent"></span> <span id="tm-unimap-ped-kanji-meaning" style="color:#ddd;"></span></div>
                    </div>
                    <div id="tm-unimap-ped-ids-container" class="tm-unimap-ids-container">
                      <div class="tm-unimap-ped-lbl">structural decomposition (IDS):</div>
                      <div id="tm-unimap-ped-ids-tree" class="tm-unimap-ids-tree"></div>
                    </div>
                  </div>

                  <!-- Specialized Cards: Curriculum Vocabulary & Compounds -->
                  <div id="tm-unimap-card-compounds" class="tm-unimap-card" style="display:none;">
                    <div class="tm-unimap-card-title">curriculum vocabulary & compounds</div>
                    <div id="tm-unimap-ped-vocab-list" class="tm-unimap-vocab-list"></div>
                  </div>

                  <!-- Specialized Cards: Interactive Vector Stroke Order Player -->
                  <div id="tm-unimap-card-stroke-player" class="tm-unimap-card" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="tm-unimap-card-title">vector stroke order</div>
                      <span id="tm-unimap-stroke-count-lbl" class="tm-stroke-counter">-</span>
                    </div>
                    <div class="tm-unimap-stroke-player">
                      <div class="tm-unimap-stroke-canvas-box" id="tm-unimap-stroke-canvas-box"></div>
                      <div class="tm-stroke-controls">
                        <button type="button" class="tm-stroke-btn" id="tm-stroke-btn-prev" title="previous stroke">◀︎ step</button>
                        <button type="button" class="tm-stroke-btn" id="tm-stroke-btn-play" title="play / pause animation">▶︎ play</button>
                        <button type="button" class="tm-stroke-btn" id="tm-stroke-btn-next" title="next stroke">step ▶︎</button>
                        <button type="button" class="tm-stroke-btn" id="tm-stroke-btn-reset" title="reset view">↺︎ full</button>
                      </div>
                    </div>
                  </div>

                  <!-- Dynamic Script-Specific Cards -->
                  <div id="tm-unimap-card-cjk" class="tm-unimap-card" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="tm-unimap-card-title">unihan (CJK ideograph data)</div>
                      <span id="tm-unimap-cjk-rs-jump" class="tm-unimap-link" style="font-size:0.7rem; cursor:pointer;" title="switch to RSIndex tab and view this character">㊎ view in RSIndex →</span>
                    </div>
                    <div id="tm-unimap-cjk-content" class="tm-unimap-cjk-content"></div>
                  </div>

                  <div id="tm-unimap-card-kemet" class="tm-unimap-card" style="display:none;">
                    <div class="tm-unimap-card-title">egyptian hieroglyph (unikemet)</div>
                    <div><strong>gardiner:</strong> <span id="tm-unimap-kemet-code" class="c-accent">-</span></div>
                    <div><strong>description:</strong> <span id="tm-unimap-kemet-desc" style="color:#ddd;">-</span></div>
                    <div><strong>function:</strong> <span id="tm-unimap-kemet-func">-</span></div>
                  </div>

                  <div id="tm-unimap-card-emoji" class="tm-unimap-card" style="display:none;">
                    <div class="tm-unimap-card-title">emoji metadata</div>
                    <div><strong>group:</strong> <span id="tm-unimap-emoji-group" class="c-accent">-</span></div>
                    <div><strong>subgroup:</strong> <span id="tm-unimap-emoji-subgroup">-</span></div>
                    <div><strong>qualification:</strong> <span id="tm-unimap-emoji-status">-</span></div>
                  </div>

                  <div id="tm-unimap-card-security" class="tm-unimap-card" style="display:none;">
                    <div class="tm-unimap-card-title">security & confusables</div>
                    <div id="tm-unimap-sec-conf-row" style="display:none;"><strong>confusable with:</strong> <span id="tm-unimap-sec-target" class="tm-unimap-link">-</span> (<span id="tm-unimap-sec-type">-</span>)</div>
                    <div><strong>id status:</strong> <span id="tm-unimap-sec-idstatus">-</span></div>
                  </div>

                  <div id="tm-unimap-card-nameslist" class="tm-unimap-card" style="display:none;">
                    <div class="tm-unimap-card-title">annotations & cross-references</div>
                    <div id="tm-unimap-nl-aliases" style="display:none; color:#bbb;"></div>
                    <div id="tm-unimap-nl-notes" style="display:none; color:#bbb;"></div>
                    <div id="tm-unimap-nl-seealso" style="display:none;"></div>
                  </div>

                  <div class="tm-unimap-card-title" style="margin-top:2px;">encodings & escape sequences</div>
                  <table class="tm-unimap-props-table">
                    <tbody>
                      <tr><td class="prop-lbl">UTF-8:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-utf8" title="click to copy">41</span></td></tr>
                      <tr><td class="prop-lbl">UTF-16:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-utf16" title="click to copy">0041</span></td></tr>
                      <tr><td class="prop-lbl">UTF-32:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-utf32" title="click to copy">00000041</span></td></tr>
                      <tr><td class="prop-lbl">HTML dec:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-htmldec" title="click to copy">&#65;</span></td></tr>
                      <tr><td class="prop-lbl">HTML hex:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-htmlhex" title="click to copy">&#x0041;</span></td></tr>
                      <tr><td class="prop-lbl">HTML ent:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-htmlent" title="click to copy">-</span></td></tr>
                      <tr><td class="prop-lbl">JS escape:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-escape" title="click to copy">\\u0041</span></td></tr>
                      <tr><td class="prop-lbl">python:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-pyescape" title="click to copy">\\x41</span></td></tr>
                      <tr><td class="prop-lbl">CSS:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-cssescape" title="click to copy">\\41 </span></td></tr>
                      <tr><td class="prop-lbl">URL enc:</td><td class="prop-val"><span class="tm-unimap-copyable" id="tm-unimap-p-urlenc" title="click to copy">%41</span></td></tr>
                    </tbody>
                  </table>

                  <div class="tm-unimap-actions" style="margin-top:6px;">
                    <button type="button" class="tm-btn" id="tm-unimap-prev-char-btn" title="previous character">◀︎</button>
                    <button type="button" class="tm-btn tm-btn-primary" id="tm-unimap-insert-btn" style="flex:1;">insert</button>
                    <button type="button" class="tm-btn" id="tm-unimap-copy-char-btn">copy char</button>
                    <button type="button" class="tm-btn" id="tm-unimap-copy-cp-btn">copy U+</button>
                    <button type="button" class="tm-btn" id="tm-unimap-next-char-btn" title="next character">▶︎</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          break;
        case 'invoice':
        case 'receipt':
        case 'inv':
          html = `<div id="inv-host-container"></div>`;
          break;
        case 'prescription':
        case 'rx':
        case 'pad':
        case 'clinical':
          html = `<div id="rx-host-container"></div>`;
          break;
      }

      pane.innerHTML = html;

      if (toolId === 'invoice' || toolId === 'receipt' || toolId === 'inv') {
        if (window.InvoiceGenerator) {
          if (toolId === 'receipt') {
            window.InvoiceGenerator.setDocType('receipt');
          }
          window.InvoiceGenerator.mount(pane, this);
        }
        return;
      }

      if (toolId === 'prescription' || toolId === 'rx' || toolId === 'pad' || toolId === 'clinical') {
        if (window.PrescriptionGenerator) {
          window.PrescriptionGenerator.mount(pane, this);
        }
        return;
      }

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
            revOut.textContent = matches.length ? 'matches: ' + matches.join(', ') : 'no matches found';
          });
        }
      } else if (toolId === 'diff') {
        const fileIn = document.getElementById('tm-diff-file');
        const diff2Val = document.getElementById('tm-diff2-val');
        const swapBtn = document.getElementById('tm-diff-swap');
        const textarea = document.getElementById('tm-textarea');
        if (fileIn && diff2Val) {
          fileIn.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                diff2Val.value = ev.target.result;
                this.setStatus(`loaded text 2: ${file.name}`);
              };
              reader.readAsText(file);
            }
          });
        }
        if (swapBtn && textarea && diff2Val) {
          swapBtn.addEventListener('click', () => {
            this.saveHistory();
            const temp = textarea.value;
            textarea.value = diff2Val.value;
            diff2Val.value = temp;
            this.updateLineCounter();
            this.updateStats();
            this.setStatus('swapped text 1 and text 2');
          });
        }
      } else if (toolId === 'mapdiff') {
        const fileIn = document.getElementById('tm-mapdiff-file');
        const map2Val = document.getElementById('tm-map2-val');
        const swapBtn = document.getElementById('tm-mapdiff-swap');
        const textarea = document.getElementById('tm-textarea');
        if (fileIn && map2Val) {
          fileIn.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                map2Val.value = ev.target.result;
                this.setStatus(`loaded map 2: ${file.name}`);
              };
              reader.readAsText(file);
            }
          });
        }
        if (swapBtn && textarea && map2Val) {
          swapBtn.addEventListener('click', () => {
            this.saveHistory();
            const temp = textarea.value;
            textarea.value = map2Val.value;
            map2Val.value = temp;
            this.updateLineCounter();
            this.updateStats();
            this.setStatus('swapped map 1 and map 2');
          });
        }
      } else if (toolId === 'longs' || toolId === 'long-s') {
        const langSel = document.getElementById('tm-longs-lang');
        const infoSpan = document.getElementById('tm-longs-info');
        const unkLabel = document.getElementById('tm-longs-unknown-label');
        if (langSel && infoSpan) {
          const descriptions = {
            en: "english: replaces lowercase 's' at the start and middle of words with 'ſ' following historical printing rules (pre-1800 british & american press).",
            fr: "français: insère le s long (ſ) selon l'orthographe classique française des XVIe-XVIIIe siècles.",
            de: "deutsch: setzt das lange s (ſ) nach historischen Fraktur- und Antiqua-Regeln mit komposita- und silbenanalyse ein.",
            es: "español: aplica las reglas ortográficas históricas del siglo de oro para la ese larga (ſ).",
            it: "italiano: inserisce la s lunga (ſ) secondo le convenzioni tipografiche rinascimentali e moderne."
          };
          langSel.addEventListener('change', () => {
            const v = langSel.value;
            infoSpan.textContent = descriptions[v] || descriptions.en;
            if (unkLabel) unkLabel.style.display = v === 'de' ? 'inline-flex' : 'none';
          });
          if (unkLabel) unkLabel.style.display = langSel.value === 'de' ? 'inline-flex' : 'none';
        }
      } else if (toolId === 'iconv') {
        const actRadios = document.querySelectorAll('input[name="tm-iconv-act"]');
        const convertRow = document.getElementById('tm-iconv-convert-row');
        const updateConvertVisibility = () => {
          const act = document.querySelector('input[name="tm-iconv-act"]:checked')?.value || 'detect';
          if (convertRow) {
            convertRow.style.display = act === 'convert' ? 'flex' : 'none';
          }
        };
        actRadios.forEach(r => r.addEventListener('change', updateConvertVisibility));
        updateConvertVisibility();
      } else if (toolId === 'qrcode' || toolId === 'qr') {
        const textarea = document.getElementById('tm-textarea');
        const typeSelect = document.getElementById('tm-qr-type');
        const eccSelect = document.getElementById('tm-qr-ecc');
        const boostCheck = document.getElementById('tm-qr-boost');
        const maskSelect = document.getElementById('tm-qr-mask');
        const dmShapeSelect = document.getElementById('tm-dm-shape');
        const dmParseCheck = document.getElementById('tm-dm-parsefnc');
        const aztecFmtSelect = document.getElementById('tm-aztec-fmt');
        const aztecEccInput = document.getElementById('tm-aztec-ecc');
        const aztecLayersInput = document.getElementById('tm-aztec-layers');
        const maxiModeSelect = document.getElementById('tm-maxi-mode');
        const scaleInput = document.getElementById('tm-qr-scale');
        const borderInput = document.getElementById('tm-qr-border');
        const darkInput = document.getElementById('tm-qr-color-dark');
        const lightInput = document.getElementById('tm-qr-color-light');
        const paletteSelect = document.getElementById('tm-qr-palette');
        const svgWrap = document.getElementById('tm-qr-svg-wrap');
        const metaEl = document.getElementById('tm-qr-meta');

        const qrOptsRow = document.getElementById('tm-qr-opts-qr');
        const mqrOptsRow = document.getElementById('tm-qr-opts-microqr');
        const mqrVersionSelect = document.getElementById('tm-mqr-version');
        const mqrEccSelect = document.getElementById('tm-mqr-ecc');
        const mqrMaskSelect = document.getElementById('tm-mqr-mask');
        const rmqrOptsRow = document.getElementById('tm-qr-opts-rmqr');
        const rmqrVersionSelect = document.getElementById('tm-rmqr-version');
        const rmqrEccSelect = document.getElementById('tm-rmqr-ecc');
        const dmOptsRow = document.getElementById('tm-qr-opts-dm');
        const aztecOptsRow = document.getElementById('tm-qr-opts-aztec');
        const maxiOptsRow = document.getElementById('tm-qr-opts-maxi');
        const dotOptsRow = document.getElementById('tm-qr-opts-dotcode');
        const dotColsInput = document.getElementById('tm-dot-cols');
        const dotRowsInput = document.getElementById('tm-dot-rows');
        const dotRatioInput = document.getElementById('tm-dot-ratio');
        const dotParseCheck = document.getElementById('tm-dot-parsefnc');
        const dotFastfindCheck = document.getElementById('tm-dot-fastfind');
        const hxOptsRow = document.getElementById('tm-qr-opts-hanxin');
        const hxEccSelect = document.getElementById('tm-hx-ecc');
        const hxVersionInput = document.getElementById('tm-hx-version');
        const hxMaskSelect = document.getElementById('tm-hx-mask');
        const hxParseCheck = document.getElementById('tm-hx-parsefnc');
        const mailmarkOptsRow = document.getElementById('tm-qr-opts-mailmark');
        const mailmarkTypeSelect = document.getElementById('tm-mailmark-type');

        const updateTypeVisibility = () => {
          const type = typeSelect ? typeSelect.value : 'qr';
          if (qrOptsRow) qrOptsRow.style.display = (type === 'qr') ? 'flex' : 'none';
          if (mqrOptsRow) mqrOptsRow.style.display = (type === 'microqr') ? 'flex' : 'none';
          if (rmqrOptsRow) rmqrOptsRow.style.display = (type === 'rmqr') ? 'flex' : 'none';
          if (dmOptsRow) dmOptsRow.style.display = (type === 'datamatrix') ? 'flex' : 'none';
          if (aztecOptsRow) aztecOptsRow.style.display = (type === 'aztec') ? 'flex' : 'none';
          if (maxiOptsRow) maxiOptsRow.style.display = (type === 'maxicode') ? 'flex' : 'none';
          if (dotOptsRow) dotOptsRow.style.display = (type === 'dotcode') ? 'flex' : 'none';
          if (hxOptsRow) hxOptsRow.style.display = (type === 'hanxin') ? 'flex' : 'none';
          if (mailmarkOptsRow) mailmarkOptsRow.style.display = (type === 'mailmark') ? 'flex' : 'none';
        };

        const updateLiveQr = () => {
          if (!window.TextEngine) return;
          const type = typeSelect ? typeSelect.value : 'qr';
          updateTypeVisibility();

          const rest = window.TextEngine.getSymbologyRestriction(type);
          const noteEl = document.getElementById('tm-qr-restriction-note');
          if (noteEl && rest) {
            noteEl.innerHTML = `
              <div class="tm-restriction-title">ℹ ${escapeHTML(rest.name)} &bull; <span class="c-dim">${escapeHTML(rest.type)}</span></div>
              <div class="tm-restriction-row"><span class="tm-restriction-label">allowed:</span> <span class="tm-restriction-val">${escapeHTML(rest.allowedChars)}</span></div>
              <div class="tm-restriction-row"><span class="tm-restriction-label">capacity:</span> <span class="tm-restriction-val">${escapeHTML(rest.lengthLimit)}</span></div>
              <div class="tm-restriction-note">${escapeHTML(rest.notes)}</div>
            `;
          }

          const rawContent = (textarea && textarea.value) ? textarea.value.trim() : '';
          if (textarea && !textarea.value) {
            if (type === 'hanxin') textarea.placeholder = 'e.g. 述而不作、信而好古';
            else if (type === 'microqr') textarea.placeholder = 'e.g. 12345';
            else if (type === 'rmqr') textarea.placeholder = 'e.g. RMQR-2026';
            else if (type === 'mailmark') textarea.placeholder = 'e.g. JGB 012100123412345678AB19XY1A 0             ';
            else textarea.placeholder = 'type or paste payload text to generate 2D code...';
          }

          let content = rawContent;
          if (!content) {
            if (type === 'microqr') content = '19971123';
            else if (type === 'rmqr') content = 'EIKHI-2002';
            else if (type === 'datamatrix') content = 'Il n\'y a pas de hors-texte.';
            else if (type === 'aztec') content = 'Il n\'y a pas de hors-texte.';
            else if (type === 'maxicode') content = 'Il n\'y a pas de hors-texte.';
            else if (type === 'dotcode') content = 'Il n\'y a pas de hors-texte.';
            else if (type === 'hanxin') content = '述而不作、信而好古';
            else if (type === 'mailmark') content = 'JGB 012100123412345678AB19XY1A 0             ';
            else content = 'Il n\'y a pas de hors-texte.';
          }

          const scale = parseInt(scaleInput ? scaleInput.value : 8, 10) || 8;
          const border = parseInt(borderInput ? borderInput.value : 4, 10);
          const darkColor = darkInput ? darkInput.value : '#000000';
          const lightColor = lightInput ? lightInput.value : '#ffffff';

          const opts = {
            scale: Math.max(1, Math.min(20, Math.round(scale / 2) || 3)),
            border: Math.max(0, border !== undefined ? border : 2),
            darkColor,
            lightColor
          };

          if (type === 'qr') {
            opts.ecc = eccSelect ? eccSelect.value : 'medium';
            opts.boostEcc = boostCheck ? boostCheck.checked : true;
            opts.mask = parseInt(maskSelect ? maskSelect.value : -1, 10);
          } else if (type === 'microqr') {
            if (mqrVersionSelect && mqrVersionSelect.value !== 'auto') opts.version = mqrVersionSelect.value;
            if (mqrEccSelect && mqrEccSelect.value !== 'auto') opts.eclevel = mqrEccSelect.value;
            if (mqrMaskSelect && parseInt(mqrMaskSelect.value, 10) >= 0) opts.mask = parseInt(mqrMaskSelect.value, 10);
          } else if (type === 'rmqr') {
            if (rmqrVersionSelect && rmqrVersionSelect.value !== 'auto') opts.version = rmqrVersionSelect.value;
            if (rmqrEccSelect) opts.eclevel = rmqrEccSelect.value;
          } else if (type === 'datamatrix') {
            if (dmShapeSelect && dmShapeSelect.value !== 'auto') opts.shape = dmShapeSelect.value;
            if (dmParseCheck && dmParseCheck.checked) opts.parsefnc = true;
          } else if (type === 'aztec') {
            if (aztecFmtSelect && aztecFmtSelect.value !== 'auto') opts.format = aztecFmtSelect.value;
            if (aztecEccInput && aztecEccInput.value) opts.eclevel = parseInt(aztecEccInput.value, 10);
            if (aztecLayersInput && parseInt(aztecLayersInput.value, 10) > 0) opts.layers = parseInt(aztecLayersInput.value, 10);
          } else if (type === 'maxicode') {
            opts.mode = parseInt(maxiModeSelect ? maxiModeSelect.value : 4, 10);
          } else if (type === 'dotcode') {
            if (dotColsInput && parseInt(dotColsInput.value, 10) > 0) opts.columns = parseInt(dotColsInput.value, 10);
            if (dotRowsInput && parseInt(dotRowsInput.value, 10) > 0) opts.rows = parseInt(dotRowsInput.value, 10);
            if (dotRatioInput && dotRatioInput.value) opts.ratio = Number(dotRatioInput.value);
            if (dotParseCheck && dotParseCheck.checked) opts.parsefnc = true;
            if (dotFastfindCheck && dotFastfindCheck.checked) opts.fastfind = true;
          } else if (type === 'hanxin') {
            opts.eclevel = hxEccSelect ? hxEccSelect.value : 'L2';
            if (hxVersionInput && parseInt(hxVersionInput.value, 10) > 0) opts.version = parseInt(hxVersionInput.value, 10);
            if (hxMaskSelect && parseInt(hxMaskSelect.value, 10) > 0) opts.mask = parseInt(hxMaskSelect.value, 10);
            if (hxParseCheck && hxParseCheck.checked) opts.parsefnc = true;
          } else if (type === 'mailmark') {
            if (mailmarkTypeSelect && mailmarkTypeSelect.value !== 'auto') opts.type = mailmarkTypeSelect.value;
          }

          const res = window.TextEngine.generate2DCode(content, type, opts);

          if (res.error) {
            if (metaEl) metaEl.textContent = 'Error: ' + res.error;
            if (svgWrap) svgWrap.innerHTML = `<span style="color:#ff5555;font-size:0.8rem;padding:6px;display:block;">${escapeHTML(res.error)}</span>`;
            return;
          }

          const svgXml = window.TextEngine.generate2DCodeSvg(content, type, opts);

          if (svgWrap) {
            svgWrap.innerHTML = svgXml;
            svgWrap.style.background = lightColor;
          }
          if (metaEl) {
            if (type === 'qr') {
              metaEl.textContent = `QR Ver ${res.version} (${res.size}x${res.size}) | ${res.eccName} | Mask ${res.mask}`;
            } else if (type === 'microqr') {
              metaEl.textContent = `Micro QR (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'rmqr') {
              metaEl.textContent = `rMQR (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'datamatrix') {
              metaEl.textContent = `Data Matrix (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'aztec') {
              metaEl.textContent = `Aztec (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'maxicode') {
              metaEl.textContent = `MaxiCode (Mode ${res.mode || 4}) | ${content.length} chars`;
            } else if (type === 'dotcode') {
              metaEl.textContent = `DotCode (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'hanxin') {
              metaEl.textContent = `Han Xin Code/汉信码 (${res.width}x${res.height}) | ${content.length} chars`;
            } else if (type === 'mailmark') {
              metaEl.textContent = `Royal Mail 2D Mailmark (${res.width}x${res.height}) | ${content.length} chars`;
            }
          }
        };

        if (paletteSelect && darkInput && lightInput) {
          paletteSelect.addEventListener('change', () => {
            const p = paletteSelect.value;
            if (p === 'bw') {
              darkInput.value = '#000000';
              lightInput.value = '#ffffff';
            } else if (p === 'matrix') {
              darkInput.value = '#00ff66';
              lightInput.value = '#000000';
            } else if (p === 'dracula') {
              darkInput.value = '#990000';
              lightInput.value = '#000000';
            } else if (p === 'nord') {
              darkInput.value = '#88c0d0';
              lightInput.value = '#2e3440';
            } else if (p === 'cyberpunk') {
              darkInput.value = '#00ffff';
              lightInput.value = '#0d0221';
            }
            updateLiveQr();
          });
        }

        if (typeSelect) {
          typeSelect.addEventListener('change', () => {
            updateTypeVisibility();
            updateLiveQr();
          });
        }

        [eccSelect, boostCheck, maskSelect, mqrVersionSelect, mqrEccSelect, mqrMaskSelect, rmqrVersionSelect, rmqrEccSelect, dmShapeSelect, dmParseCheck, aztecFmtSelect, aztecEccInput, aztecLayersInput, maxiModeSelect, dotColsInput, dotRowsInput, dotRatioInput, dotParseCheck, dotFastfindCheck, hxEccSelect, hxVersionInput, hxMaskSelect, hxParseCheck, mailmarkTypeSelect, scaleInput, borderInput, darkInput, lightInput].forEach(el => {
          if (el) {
            el.addEventListener('input', updateLiveQr);
            el.addEventListener('change', updateLiveQr);
          }
        });

        if (textarea) {
          textarea.addEventListener('input', updateLiveQr);
        }

        const qrPngSizeSelect = document.getElementById('tm-qr-png-size');
        const qrCustomSizeInput = document.getElementById('tm-qr-custom-size');

        if (qrPngSizeSelect && qrCustomSizeInput) {
          qrPngSizeSelect.addEventListener('change', () => {
            if (qrPngSizeSelect.value === 'custom') {
              qrCustomSizeInput.style.display = 'inline-block';
              qrCustomSizeInput.focus();
            } else {
              qrCustomSizeInput.style.display = 'none';
            }
          });
        }

        const getContentFor2D = (t) => {
          const val = (textarea && textarea.value) ? textarea.value.trim() : '';
          if (val) return val;
          if (t === 'hanxin') return '述而不作、信而好古';
          if (t === 'microqr') return '19972311';
          if (t === 'rmqr') return 'EIKHI-2002';
          return 'Il n\'y a pas de hors-texte.';
        };

        const dlPngBtn = document.getElementById('tm-qr-dl-png');
        const dlSvgBtn = document.getElementById('tm-qr-dl-svg');
        const copyAsciiBtn = document.getElementById('tm-qr-copy-ascii');
        const copySvgBtn = document.getElementById('tm-qr-copy-svg');

        if (dlPngBtn) {
          dlPngBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'qr';
            const content = getContentFor2D(type);
            const scale = parseInt(scaleInput ? scaleInput.value : 8, 10) || 8;
            const border = parseInt(borderInput ? borderInput.value : 4, 10);
            const darkColor = darkInput ? darkInput.value : '#000000';
            const lightColor = lightInput ? lightInput.value : '#ffffff';
            const opts = { scale, border, darkColor, lightColor };
            if (type === 'qr') {
              opts.ecc = eccSelect ? eccSelect.value : 'medium';
              opts.boostEcc = boostCheck ? boostCheck.checked : true;
            } else if (type === 'microqr') {
              if (mqrVersionSelect && mqrVersionSelect.value !== 'auto') opts.version = mqrVersionSelect.value;
              if (mqrEccSelect && mqrEccSelect.value !== 'auto') opts.eclevel = mqrEccSelect.value;
              if (mqrMaskSelect && parseInt(mqrMaskSelect.value, 10) >= 0) opts.mask = parseInt(mqrMaskSelect.value, 10);
            } else if (type === 'rmqr') {
              if (rmqrVersionSelect && rmqrVersionSelect.value !== 'auto') opts.version = rmqrVersionSelect.value;
              if (rmqrEccSelect) opts.eclevel = rmqrEccSelect.value;
            } else if (type === 'datamatrix') {
              if (dmShapeSelect && dmShapeSelect.value !== 'auto') opts.shape = dmShapeSelect.value;
              if (dmParseCheck && dmParseCheck.checked) opts.parsefnc = true;
            } else if (type === 'aztec') {
              if (aztecFmtSelect && aztecFmtSelect.value !== 'auto') opts.format = aztecFmtSelect.value;
              if (aztecEccInput && aztecEccInput.value) opts.eclevel = parseInt(aztecEccInput.value, 10);
              if (aztecLayersInput && parseInt(aztecLayersInput.value, 10) > 0) opts.layers = parseInt(aztecLayersInput.value, 10);
            } else if (type === 'maxicode') {
              opts.mode = parseInt(maxiModeSelect ? maxiModeSelect.value : 4, 10);
            } else if (type === 'dotcode') {
              if (dotColsInput && parseInt(dotColsInput.value, 10) > 0) opts.columns = parseInt(dotColsInput.value, 10);
              if (dotRowsInput && parseInt(dotRowsInput.value, 10) > 0) opts.rows = parseInt(dotRowsInput.value, 10);
              if (dotRatioInput && dotRatioInput.value) opts.ratio = Number(dotRatioInput.value);
              if (dotParseCheck && dotParseCheck.checked) opts.parsefnc = true;
              if (dotFastfindCheck && dotFastfindCheck.checked) opts.fastfind = true;
            } else if (type === 'hanxin') {
              opts.eclevel = hxEccSelect ? hxEccSelect.value : 'L2';
              if (hxVersionInput && parseInt(hxVersionInput.value, 10) > 0) opts.version = parseInt(hxVersionInput.value, 10);
              if (hxMaskSelect && parseInt(hxMaskSelect.value, 10) > 0) opts.mask = parseInt(hxMaskSelect.value, 10);
              if (hxParseCheck && hxParseCheck.checked) opts.parsefnc = true;
            }

            if (qrPngSizeSelect) {
              if (qrPngSizeSelect.value === 'custom' && qrCustomSizeInput) {
                opts.targetSize = Math.min(4000, Math.max(50, parseInt(qrCustomSizeInput.value, 10) || 4000));
              } else if (qrPngSizeSelect.value !== 'auto') {
                opts.targetSize = Math.min(4000, Math.max(50, parseInt(qrPngSizeSelect.value, 10) || 4000));
              }
            }

            const canvas = window.TextEngine.generate2DCodeCanvas(content, type, opts);
            if (!canvas) return this.setStatus('failed to generate PNG image');
            const dataUrl = canvas.toDataURL ? canvas.toDataURL('image/png') : '';
            if (!dataUrl) return this.setStatus('failed to export PNG data');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${type}-code.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.setStatus(`downloaded ${type}-code.png (${canvas.width}×${canvas.height} px)`);
          });
        }

        if (dlSvgBtn) {
          dlSvgBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'qr';
            const content = getContentFor2D(type);
            const border = parseInt(borderInput ? borderInput.value : 4, 10);
            const darkColor = darkInput ? darkInput.value : '#000000';
            const lightColor = lightInput ? lightInput.value : '#ffffff';
            const opts = { border, darkColor, lightColor };
            if (type === 'qr') {
              opts.ecc = eccSelect ? eccSelect.value : 'medium';
              opts.boostEcc = boostCheck ? boostCheck.checked : true;
            } else if (type === 'microqr') {
              if (mqrVersionSelect && mqrVersionSelect.value !== 'auto') opts.version = mqrVersionSelect.value;
              if (mqrEccSelect && mqrEccSelect.value !== 'auto') opts.eclevel = mqrEccSelect.value;
              if (mqrMaskSelect && parseInt(mqrMaskSelect.value, 10) >= 0) opts.mask = parseInt(mqrMaskSelect.value, 10);
            } else if (type === 'rmqr') {
              if (rmqrVersionSelect && rmqrVersionSelect.value !== 'auto') opts.version = rmqrVersionSelect.value;
              if (rmqrEccSelect) opts.eclevel = rmqrEccSelect.value;
            } else if (type === 'datamatrix') {
              if (dmShapeSelect && dmShapeSelect.value !== 'auto') opts.shape = dmShapeSelect.value;
              if (dmParseCheck && dmParseCheck.checked) opts.parsefnc = true;
            } else if (type === 'aztec') {
              if (aztecFmtSelect && aztecFmtSelect.value !== 'auto') opts.format = aztecFmtSelect.value;
              if (aztecEccInput && aztecEccInput.value) opts.eclevel = parseInt(aztecEccInput.value, 10);
              if (aztecLayersInput && parseInt(aztecLayersInput.value, 10) > 0) opts.layers = parseInt(aztecLayersInput.value, 10);
            } else if (type === 'maxicode') {
              opts.mode = parseInt(maxiModeSelect ? maxiModeSelect.value : 4, 10);
            } else if (type === 'dotcode') {
              if (dotColsInput && parseInt(dotColsInput.value, 10) > 0) opts.columns = parseInt(dotColsInput.value, 10);
              if (dotRowsInput && parseInt(dotRowsInput.value, 10) > 0) opts.rows = parseInt(dotRowsInput.value, 10);
              if (dotRatioInput && dotRatioInput.value) opts.ratio = Number(dotRatioInput.value);
              if (dotParseCheck && dotParseCheck.checked) opts.parsefnc = true;
              if (dotFastfindCheck && dotFastfindCheck.checked) opts.fastfind = true;
            } else if (type === 'hanxin') {
              opts.eclevel = hxEccSelect ? hxEccSelect.value : 'L2';
              if (hxVersionInput && parseInt(hxVersionInput.value, 10) > 0) opts.version = parseInt(hxVersionInput.value, 10);
              if (hxMaskSelect && parseInt(hxMaskSelect.value, 10) > 0) opts.mask = parseInt(hxMaskSelect.value, 10);
              if (hxParseCheck && hxParseCheck.checked) opts.parsefnc = true;
            }

            const svgXml = window.TextEngine.generate2DCodeSvg(content, type, opts);
            const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-code.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.setStatus(`downloaded ${type}-code.svg`);
          });
        }

        if (copyAsciiBtn) {
          copyAsciiBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'qr';
            const content = getContentFor2D(type);
            const opts = { border: 1 };
            if (type === 'qr') {
              opts.ecc = eccSelect ? eccSelect.value : 'medium';
              opts.boostEcc = boostCheck ? boostCheck.checked : true;
            } else if (type === 'microqr') {
              if (mqrVersionSelect && mqrVersionSelect.value !== 'auto') opts.version = mqrVersionSelect.value;
              if (mqrEccSelect && mqrEccSelect.value !== 'auto') opts.eclevel = mqrEccSelect.value;
              if (mqrMaskSelect && parseInt(mqrMaskSelect.value, 10) >= 0) opts.mask = parseInt(mqrMaskSelect.value, 10);
            } else if (type === 'rmqr') {
              if (rmqrVersionSelect && rmqrVersionSelect.value !== 'auto') opts.version = rmqrVersionSelect.value;
              if (rmqrEccSelect) opts.eclevel = rmqrEccSelect.value;
            } else if (type === 'datamatrix') {
              if (dmShapeSelect && dmShapeSelect.value !== 'auto') opts.shape = dmShapeSelect.value;
              if (dmParseCheck && dmParseCheck.checked) opts.parsefnc = true;
            } else if (type === 'aztec') {
              if (aztecFmtSelect && aztecFmtSelect.value !== 'auto') opts.format = aztecFmtSelect.value;
              if (aztecEccInput && aztecEccInput.value) opts.eclevel = parseInt(aztecEccInput.value, 10);
              if (aztecLayersInput && parseInt(aztecLayersInput.value, 10) > 0) opts.layers = parseInt(aztecLayersInput.value, 10);
            } else if (type === 'maxicode') {
              opts.mode = parseInt(maxiModeSelect ? maxiModeSelect.value : 4, 10);
            } else if (type === 'dotcode') {
              if (dotColsInput && parseInt(dotColsInput.value, 10) > 0) opts.columns = parseInt(dotColsInput.value, 10);
              if (dotRowsInput && parseInt(dotRowsInput.value, 10) > 0) opts.rows = parseInt(dotRowsInput.value, 10);
              if (dotRatioInput && dotRatioInput.value) opts.ratio = Number(dotRatioInput.value);
              if (dotParseCheck && dotParseCheck.checked) opts.parsefnc = true;
              if (dotFastfindCheck && dotFastfindCheck.checked) opts.fastfind = true;
            } else if (type === 'hanxin') {
              opts.eclevel = hxEccSelect ? hxEccSelect.value : 'L2';
              if (hxVersionInput && parseInt(hxVersionInput.value, 10) > 0) opts.version = parseInt(hxVersionInput.value, 10);
              if (hxMaskSelect && parseInt(hxMaskSelect.value, 10) > 0) opts.mask = parseInt(hxMaskSelect.value, 10);
              if (hxParseCheck && hxParseCheck.checked) opts.parsefnc = true;
            }

            const res = window.TextEngine.generate2DCode(content, type, opts);
            if (res.error) return this.setStatus('2D code error: ' + res.error);
            const ascii = window.TextEngine.generate2DCodeAscii(res, { border: 1 });
            navigator.clipboard.writeText(ascii).then(() => {
              this.setStatus(`copied ASCII ${res.typeName || type} to clipboard`);
            }).catch(() => {
              this.setStatus(`ASCII ready`);
            });
          });
        }

        if (copySvgBtn) {
          copySvgBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'qr';
            const content = getContentFor2D(type);
            const border = parseInt(borderInput ? borderInput.value : 4, 10);
            const darkColor = darkInput ? darkInput.value : '#000000';
            const lightColor = lightInput ? lightInput.value : '#ffffff';
            const opts = { border, darkColor, lightColor };
            if (type === 'qr') {
              opts.ecc = eccSelect ? eccSelect.value : 'medium';
              opts.boostEcc = boostCheck ? boostCheck.checked : true;
            } else if (type === 'microqr') {
              if (mqrVersionSelect && mqrVersionSelect.value !== 'auto') opts.version = mqrVersionSelect.value;
              if (mqrEccSelect && mqrEccSelect.value !== 'auto') opts.eclevel = mqrEccSelect.value;
              if (mqrMaskSelect && parseInt(mqrMaskSelect.value, 10) >= 0) opts.mask = parseInt(mqrMaskSelect.value, 10);
            } else if (type === 'rmqr') {
              if (rmqrVersionSelect && rmqrVersionSelect.value !== 'auto') opts.version = rmqrVersionSelect.value;
              if (rmqrEccSelect) opts.eclevel = rmqrEccSelect.value;
            } else if (type === 'datamatrix') {
              if (dmShapeSelect && dmShapeSelect.value !== 'auto') opts.shape = dmShapeSelect.value;
              if (dmParseCheck && dmParseCheck.checked) opts.parsefnc = true;
            } else if (type === 'aztec') {
              if (aztecFmtSelect && aztecFmtSelect.value !== 'auto') opts.format = aztecFmtSelect.value;
              if (aztecEccInput && aztecEccInput.value) opts.eclevel = parseInt(aztecEccInput.value, 10);
              if (aztecLayersInput && parseInt(aztecLayersInput.value, 10) > 0) opts.layers = parseInt(aztecLayersInput.value, 10);
            } else if (type === 'maxicode') {
              opts.mode = parseInt(maxiModeSelect ? maxiModeSelect.value : 4, 10);
            } else if (type === 'dotcode') {
              if (dotColsInput && parseInt(dotColsInput.value, 10) > 0) opts.columns = parseInt(dotColsInput.value, 10);
              if (dotRowsInput && parseInt(dotRowsInput.value, 10) > 0) opts.rows = parseInt(dotRowsInput.value, 10);
              if (dotRatioInput && dotRatioInput.value) opts.ratio = Number(dotRatioInput.value);
              if (dotParseCheck && dotParseCheck.checked) opts.parsefnc = true;
              if (dotFastfindCheck && dotFastfindCheck.checked) opts.fastfind = true;
            } else if (type === 'hanxin') {
              opts.eclevel = hxEccSelect ? hxEccSelect.value : 'L2';
              if (hxVersionInput && parseInt(hxVersionInput.value, 10) > 0) opts.version = parseInt(hxVersionInput.value, 10);
              if (hxMaskSelect && parseInt(hxMaskSelect.value, 10) > 0) opts.mask = parseInt(hxMaskSelect.value, 10);
              if (hxParseCheck && hxParseCheck.checked) opts.parsefnc = true;
            }

            const svgXml = window.TextEngine.generate2DCodeSvg(content, type, opts);
            navigator.clipboard.writeText(svgXml).then(() => {
              this.setStatus('copied SVG XML to clipboard');
            }).catch(() => {
              this.setStatus('SVG XML ready');
            });
          });
        }

        updateLiveQr();
      } else if (toolId === 'barcode' || toolId === 'bc') {
        const textarea = document.getElementById('tm-textarea');
        const formatSelect = document.getElementById('tm-bc-format');
        const pdfOptsRow = document.getElementById('tm-bc-pdf-opts');
        const pdfColsInput = document.getElementById('tm-pdf-cols');
        const pdfRowsInput = document.getElementById('tm-pdf-rows');
        const pdfEccInput = document.getElementById('tm-pdf-ecc');
        const pdfCompactCheck = document.getElementById('tm-pdf-compact');
        const widthInput = document.getElementById('tm-bc-width');
        const heightInput = document.getElementById('tm-bc-height');
        const marginInput = document.getElementById('tm-bc-margin');
        const displayValCheck = document.getElementById('tm-bc-display-val');
        const textPosSelect = document.getElementById('tm-bc-textpos');
        const textAlignSelect = document.getElementById('tm-bc-textalign');
        const fontSizeInput = document.getElementById('tm-bc-fontsize');
        const barColorInput = document.getElementById('tm-bc-color-bar');
        const bgColorInput = document.getElementById('tm-bc-color-bg');
        const paletteSelect = document.getElementById('tm-bc-palette');
        const svgWrap = document.getElementById('tm-bc-svg-wrap');
        const metaEl = document.getElementById('tm-bc-meta');

        const updateBcFormatVisibility = () => {
          const fmt = formatSelect ? formatSelect.value : 'CODE128';
          const isPdf = fmt === 'pdf417' || fmt === 'compactpdf417';
          if (pdfOptsRow) pdfOptsRow.style.display = isPdf ? 'flex' : 'none';
        };

        const getBcContent = () => {
          let content = (textarea && textarea.value) ? textarea.value.trim() : '';
          if (!content) {
            const fmt = formatSelect ? formatSelect.value : 'CODE128';
            if (fmt === 'EAN13') content = '202604062336';
            else if (fmt === 'EAN8') content = '2710199';
            else if (fmt === 'UPC') content = '19971123021';
            else if (fmt === 'CODE128A') content = 'NULL';
            else if (fmt === 'CODE128C') content = '17102005';
            else if (fmt === 'UPCE') content = '20040317';
            else if (fmt === 'pharmacode') content = '3010';
            else if (fmt === 'ITF14') content = '2002120912009';
            else if (fmt === 'codabar') content = '17102005';
            else if (fmt === 'postnet') content = '11372631461';
            else if (fmt === 'planet') content = '1997112302177';
            else if (fmt === 'onecode') content = '0123456709498765432101234567891';
            else if (fmt === 'rm4scc') content = 'LE28HS9Z';
            else if (fmt === 'kix') content = '1231FZ13XHS';
            else if (fmt === 'mailmark4s') content = '11100010112345678AB19XY1A ';
            else if (fmt === 'mailmark2d') content = 'JGB 012100123412345678AB19XY1A 0             ';
            else if (fmt === 'MSI' || fmt === 'MSI10' || fmt === 'MSI11') content = '100011727819641';
            else if (fmt === 'pdf417' || fmt === 'compactpdf417') content = '100011727819641';
            else content = 'EIKHI-2002';
          }
          return content;
        };

        const updateLiveBarcode = () => {
          if (!window.TextEngine) return;
          updateBcFormatVisibility();
          const format = formatSelect ? formatSelect.value : 'CODE128';

          const rest = window.TextEngine.getSymbologyRestriction(format);
          const noteEl = document.getElementById('tm-bc-restriction-note');
          if (noteEl && rest) {
            noteEl.innerHTML = `
              <div class="tm-restriction-title">ℹ ${escapeHTML(rest.name)} &bull; <span class="c-dim">${escapeHTML(rest.type)}</span></div>
              <div class="tm-restriction-row"><span class="tm-restriction-label">allowed:</span> <span class="tm-restriction-val">${escapeHTML(rest.allowedChars)}</span></div>
              <div class="tm-restriction-row"><span class="tm-restriction-label">length:</span> <span class="tm-restriction-val">${escapeHTML(rest.lengthLimit)}</span></div>
              <div class="tm-restriction-note">${escapeHTML(rest.notes)}</div>
            `;
          }

          const content = getBcContent();

          const width = parseInt(widthInput ? widthInput.value : 2, 10) || 2;
          const height = parseInt(heightInput ? heightInput.value : 80, 10) || 80;
          const margin = parseInt(marginInput ? marginInput.value : 10, 10) || 10;
          const displayValue = displayValCheck ? displayValCheck.checked : true;
          const textPosition = textPosSelect ? textPosSelect.value : 'bottom';
          const textAlign = textAlignSelect ? textAlignSelect.value : 'center';
          const fontSize = parseInt(fontSizeInput ? fontSizeInput.value : 16, 10) || 16;
          const lineColor = barColorInput ? barColorInput.value : '#000000';
          const background = bgColorInput ? bgColorInput.value : '#ffffff';

          const bcOpts = {
            format,
            width,
            height,
            margin,
            displayValue,
            textPosition,
            textAlign,
            fontSize,
            lineColor,
            background
          };

          if (format === 'pdf417' || format === 'compactpdf417') {
            if (pdfColsInput && parseInt(pdfColsInput.value, 10) > 0) bcOpts.columns = parseInt(pdfColsInput.value, 10);
            if (pdfRowsInput && parseInt(pdfRowsInput.value, 10) > 0) bcOpts.rows = parseInt(pdfRowsInput.value, 10);
            if (pdfEccInput && pdfEccInput.value !== '') bcOpts.eclevel = parseInt(pdfEccInput.value, 10);
            if (pdfCompactCheck && pdfCompactCheck.checked) bcOpts.compact = true;
          }

          const res = window.TextEngine.generateBarcode(content, bcOpts);

          if (res.error) {
            if (metaEl) metaEl.textContent = 'error: ' + res.error;
            if (svgWrap) svgWrap.innerHTML = `<span style="color:#ff5555;font-size:0.8rem;padding:6px;display:block;">${escapeHTML(res.error)}</span>`;
            return;
          }

          const svgXml = window.TextEngine.generateBarcodeSvg(content, bcOpts);

          if (svgWrap) {
            svgWrap.innerHTML = svgXml;
            svgWrap.style.background = background;
          }
          if (metaEl) {
            metaEl.textContent = `${res.format} | ${res.totalModules} modules | ${content.length} chars`;
          }
        };

        if (paletteSelect && barColorInput && bgColorInput) {
          paletteSelect.addEventListener('change', () => {
            const p = paletteSelect.value;
            if (p === 'bw') {
              barColorInput.value = '#000000';
              bgColorInput.value = '#ffffff';
            } else if (p === 'matrix') {
              barColorInput.value = '#00ff66';
              bgColorInput.value = '#000000';
            } else if (p === 'dracula') {
              barColorInput.value = '#990000';
              bgColorInput.value = '#000000';
            } else if (p === 'nord') {
              barColorInput.value = '#88c0d0';
              bgColorInput.value = '#2e3440';
            } else if (p === 'cyberpunk') {
              barColorInput.value = '#00ffff';
              bgColorInput.value = '#0d0221';
            }
            updateLiveBarcode();
          });
        }

        if (formatSelect) {
          formatSelect.addEventListener('change', () => {
            updateBcFormatVisibility();
            updateLiveBarcode();
          });
        }

        [pdfColsInput, pdfRowsInput, pdfEccInput, pdfCompactCheck, widthInput, heightInput, marginInput, displayValCheck, textPosSelect, textAlignSelect, fontSizeInput, barColorInput, bgColorInput].forEach(el => {
          if (el) {
            el.addEventListener('input', updateLiveBarcode);
            el.addEventListener('change', updateLiveBarcode);
          }
        });

        if (textarea) {
          textarea.addEventListener('input', updateLiveBarcode);
        }

        const bcPngSizeSelect = document.getElementById('tm-bc-png-size');
        const bcCustomSizeInput = document.getElementById('tm-bc-custom-size');

        if (bcPngSizeSelect && bcCustomSizeInput) {
          bcPngSizeSelect.addEventListener('change', () => {
            if (bcPngSizeSelect.value === 'custom') {
              bcCustomSizeInput.style.display = 'inline-block';
              bcCustomSizeInput.focus();
            } else {
              bcCustomSizeInput.style.display = 'none';
            }
          });
        }

        const dlPngBtn = document.getElementById('tm-bc-dl-png');
        const dlSvgBtn = document.getElementById('tm-bc-dl-svg');
        const copyAsciiBtn = document.getElementById('tm-bc-copy-ascii');
        const copySvgBtn = document.getElementById('tm-bc-copy-svg');

        if (dlPngBtn) {
          dlPngBtn.addEventListener('click', () => {
            const content = getBcContent();
            const format = formatSelect ? formatSelect.value : 'CODE128';
            const width = parseInt(widthInput ? widthInput.value : 2, 10) || 2;
            const height = parseInt(heightInput ? heightInput.value : 80, 10) || 80;
            const margin = parseInt(marginInput ? marginInput.value : 10, 10) || 10;
            const displayValue = displayValCheck ? displayValCheck.checked : true;
            const textPosition = textPosSelect ? textPosSelect.value : 'bottom';
            const textAlign = textAlignSelect ? textAlignSelect.value : 'center';
            const fontSize = parseInt(fontSizeInput ? fontSizeInput.value : 16, 10) || 16;
            const lineColor = barColorInput ? barColorInput.value : '#000000';
            const background = bgColorInput ? bgColorInput.value : '#ffffff';

            const bcOpts = { format, width, height, margin, displayValue, textPosition, textAlign, fontSize, lineColor, background };
            if (format === 'pdf417' || format === 'compactpdf417') {
              if (pdfColsInput && parseInt(pdfColsInput.value, 10) > 0) bcOpts.columns = parseInt(pdfColsInput.value, 10);
              if (pdfRowsInput && parseInt(pdfRowsInput.value, 10) > 0) bcOpts.rows = parseInt(pdfRowsInput.value, 10);
              if (pdfEccInput && pdfEccInput.value !== '') bcOpts.eclevel = parseInt(pdfEccInput.value, 10);
              if (pdfCompactCheck && pdfCompactCheck.checked) bcOpts.compact = true;
            }

            if (bcPngSizeSelect) {
              if (bcPngSizeSelect.value === 'custom' && bcCustomSizeInput) {
                bcOpts.targetSize = Math.min(4000, Math.max(50, parseInt(bcCustomSizeInput.value, 10) || 4000));
              } else if (bcPngSizeSelect.value !== 'auto') {
                bcOpts.targetSize = Math.min(4000, Math.max(50, parseInt(bcPngSizeSelect.value, 10) || 4000));
              }
            }

            const canvas = window.TextEngine.generateBarcodeCanvas(content, bcOpts);
            if (!canvas) return this.setStatus('failed to generate PNG image');
            const dataUrl = canvas.toDataURL ? canvas.toDataURL('image/png') : '';
            if (!dataUrl) return this.setStatus('failed to export PNG data');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `barcode-${format.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.setStatus(`downloaded barcode-${format.toLowerCase()}.png (${canvas.width}×${canvas.height} px)`);
          });
        }

        if (dlSvgBtn) {
          dlSvgBtn.addEventListener('click', () => {
            const content = getBcContent();
            const format = formatSelect ? formatSelect.value : 'CODE128';
            const width = parseInt(widthInput ? widthInput.value : 2, 10) || 2;
            const height = parseInt(heightInput ? heightInput.value : 80, 10) || 80;
            const margin = parseInt(marginInput ? marginInput.value : 10, 10) || 10;
            const displayValue = displayValCheck ? displayValCheck.checked : true;
            const textPosition = textPosSelect ? textPosSelect.value : 'bottom';
            const textAlign = textAlignSelect ? textAlignSelect.value : 'center';
            const fontSize = parseInt(fontSizeInput ? fontSizeInput.value : 16, 10) || 16;
            const lineColor = barColorInput ? barColorInput.value : '#000000';
            const background = bgColorInput ? bgColorInput.value : '#ffffff';

            const bcOpts = { format, width, height, margin, displayValue, textPosition, textAlign, fontSize, lineColor, background };
            if (format === 'pdf417' || format === 'compactpdf417') {
              if (pdfColsInput && parseInt(pdfColsInput.value, 10) > 0) bcOpts.columns = parseInt(pdfColsInput.value, 10);
              if (pdfRowsInput && parseInt(pdfRowsInput.value, 10) > 0) bcOpts.rows = parseInt(pdfRowsInput.value, 10);
              if (pdfEccInput && pdfEccInput.value !== '') bcOpts.eclevel = parseInt(pdfEccInput.value, 10);
              if (pdfCompactCheck && pdfCompactCheck.checked) bcOpts.compact = true;
            }

            const res = window.TextEngine.generateBarcode(content, bcOpts);
            if (res.error) return this.setStatus('barcode error: ' + res.error);
            const svgXml = window.TextEngine.generateBarcodeSvg(content, bcOpts);
            const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `barcode-${format.toLowerCase()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.setStatus(`downloaded barcode-${format.toLowerCase()}.svg`);
          });
        }

        if (copyAsciiBtn) {
          copyAsciiBtn.addEventListener('click', () => {
            const content = getBcContent();
            const format = formatSelect ? formatSelect.value : 'CODE128';
            const displayValue = displayValCheck ? displayValCheck.checked : true;
            const textPosition = textPosSelect ? textPosSelect.value : 'bottom';
            const bcOpts = { format, displayValue, textPosition };
            if (format === 'pdf417' || format === 'compactpdf417') {
              if (pdfColsInput && parseInt(pdfColsInput.value, 10) > 0) bcOpts.columns = parseInt(pdfColsInput.value, 10);
              if (pdfRowsInput && parseInt(pdfRowsInput.value, 10) > 0) bcOpts.rows = parseInt(pdfRowsInput.value, 10);
              if (pdfEccInput && pdfEccInput.value !== '') bcOpts.eclevel = parseInt(pdfEccInput.value, 10);
              if (pdfCompactCheck && pdfCompactCheck.checked) bcOpts.compact = true;
            }
            const res = window.TextEngine.generateBarcode(content, bcOpts);
            if (res.error) return this.setStatus('Barcode Error: ' + res.error);
            const ascii = window.TextEngine.generateBarcodeAscii(res, { height: 6, margin: 2, displayValue, textPosition });
            navigator.clipboard.writeText(ascii).then(() => {
              this.setStatus('copied ASCII barcode to clipboard');
            }).catch(() => {
              this.setStatus('ASCII barcode ready');
            });
          });
        }

        if (copySvgBtn) {
          copySvgBtn.addEventListener('click', () => {
            const content = getBcContent();
            const format = formatSelect ? formatSelect.value : 'CODE128';
            const width = parseInt(widthInput ? widthInput.value : 2, 10) || 2;
            const height = parseInt(heightInput ? heightInput.value : 80, 10) || 80;
            const margin = parseInt(marginInput ? marginInput.value : 10, 10) || 10;
            const displayValue = displayValCheck ? displayValCheck.checked : true;
            const textPosition = textPosSelect ? textPosSelect.value : 'bottom';
            const textAlign = textAlignSelect ? textAlignSelect.value : 'center';
            const fontSize = parseInt(fontSizeInput ? fontSizeInput.value : 16, 10) || 16;
            const lineColor = barColorInput ? barColorInput.value : '#000000';
            const background = bgColorInput ? bgColorInput.value : '#ffffff';

            const bcOpts = { format, width, height, margin, displayValue, textPosition, textAlign, fontSize, lineColor, background };
            if (format === 'pdf417' || format === 'compactpdf417') {
              if (pdfColsInput && parseInt(pdfColsInput.value, 10) > 0) bcOpts.columns = parseInt(pdfColsInput.value, 10);
              if (pdfRowsInput && parseInt(pdfRowsInput.value, 10) > 0) bcOpts.rows = parseInt(pdfRowsInput.value, 10);
              if (pdfEccInput && pdfEccInput.value !== '') bcOpts.eclevel = parseInt(pdfEccInput.value, 10);
              if (pdfCompactCheck && pdfCompactCheck.checked) bcOpts.compact = true;
            }

            const res = window.TextEngine.generateBarcode(content, bcOpts);
            if (res.error) return this.setStatus('Barcode Error: ' + res.error);
            const svgXml = window.TextEngine.generateBarcodeSvg(content, bcOpts);
            navigator.clipboard.writeText(svgXml).then(() => {
              this.setStatus('copied barcode SVG XML to clipboard');
            }).catch(() => {
              this.setStatus('barcode SVG ready');
            });
          });
        }

        updateLiveBarcode();
      } else if (toolId === 'decayfmt') {
        const engine = window.TextEngine && window.TextEngine.decayfmt;
        if (!engine) return;

        // Elements
        const tabSim = document.getElementById('tm-decay-tab-sim');
        const tabGlitch = document.getElementById('tm-decay-tab-glitch');
        const simControls = document.getElementById('tm-decay-sim-controls');
        const glitchControls = document.getElementById('tm-decay-glitch-controls');

        const dropzone = document.getElementById('tm-decay-dropzone');
        const fileInput = document.getElementById('tm-decay-file-input');
        const dropInfo = document.getElementById('tm-decay-dropzone-info');

        const xRange = document.getElementById('tm-decay-x-range');
        const xNum = document.getElementById('tm-decay-x-num');
        const probBadge = document.getElementById('tm-decay-prob-badge');
        const formatBadge = document.getElementById('tm-decay-sim-format-badge');
        const opensBadge = document.getElementById('tm-decay-sim-opens-badge');
        const statusInfo = document.getElementById('tm-decay-status-info');
        const resBadge = document.getElementById('tm-decay-res-badge');

        const meterFill = document.getElementById('tm-decay-meter-fill');
        const meterText = document.getElementById('tm-decay-meter-text');

        const canvas = document.getElementById('tm-decay-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const toggleViewBtn = document.getElementById('tm-decay-toggle-view');

        const simOpenBtn = document.getElementById('tm-decay-sim-open-btn');
        const simDlIdcyBtn = document.getElementById('tm-decay-sim-dl-idcy');
        const simExportCleanBtn = document.getElementById('tm-decay-sim-export-clean');
        const simResetBtn = document.getElementById('tm-decay-sim-reset-btn');

        const itersNum = document.getElementById('tm-decay-iters-num');
        const glitchRunBtn = document.getElementById('tm-decay-glitch-run-btn');
        const glitchStepBtn = document.getElementById('tm-decay-glitch-step-btn');
        const glitchResetBtn = document.getElementById('tm-decay-glitch-reset-btn');
        const glitchDlBtn = document.getElementById('tm-decay-glitch-dl-btn');
        const glitchDlIdcyBtn = document.getElementById('tm-decay-glitch-dl-idcy');

        const textarea = document.getElementById('tm-textarea');

        // State for this session
        const state = {
          mode: 'simulator', // 'simulator' | 'glitcher'
          fileType: 'text', // 'image' | 'text' | 'binary'
          fileName: 'note.txt',
          width: 0,
          height: 0,
          originalBytes: null,
          currentBytes: null,
          openCount: 0,
          viewingOriginal: false,
          x: 3.0
        };

        const updateProbabilityDisplay = () => {
          state.x = Math.max(0.1, parseFloat(xNum ? xNum.value : 3.0) || 3.0);
          const prob = engine.calculateProbability(state.x);
          const probPct = (prob * 100).toFixed(1);
          if (probBadge) probBadge.textContent = `p ≈ ${probPct}% / open`;
          if (formatBadge) {
            const ext = state.fileType === 'image' ? 'idcy' : 'tdcy';
            formatBadge.textContent = `format: .${ext}${Math.round(state.x)} (${state.fileType})`;
          }
        };

        const updateEntropyMeter = () => {
          if (!meterFill || !meterText) return;
          if (state.openCount === 0 || !state.currentBytes) {
            meterFill.style.width = '0%';
            meterText.textContent = '0%';
            return;
          }
          const p = engine.calculateProbability(state.x);
          const cumEntropy = Math.min(100, Math.round((1.0 - Math.pow(1.0 - p, state.openCount)) * 100));
          meterFill.style.width = `${cumEntropy}%`;
          meterText.textContent = `${cumEntropy}%`;
        };

        const renderCanvas = (bytesToRender) => {
          if (!ctx || !canvas || state.fileType !== 'image' || !bytesToRender) return;
          const w = state.width || 128;
          const h = state.height || 128;
          canvas.width = w;
          canvas.height = h;

          try {
            const imgData = ctx.createImageData(w, h);
            imgData.data.set(bytesToRender);
            ctx.putImageData(imgData, 0, 0);
          } catch (e) {
            console.error('error rendering decay canvas:', e);
          }
        };

        const downloadBlob = (blob, filename) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.setStatus(`downloaded: ${filename}`);
        };

        // Tab Switching
        if (tabSim && tabGlitch && simControls && glitchControls) {
          tabSim.addEventListener('click', () => {
            state.mode = 'simulator';
            tabSim.classList.add('active');
            tabGlitch.classList.remove('active');
            simControls.style.display = 'flex';
            glitchControls.style.display = 'none';
          });
          tabGlitch.addEventListener('click', () => {
            state.mode = 'glitcher';
            tabGlitch.classList.add('active');
            tabSim.classList.remove('active');
            simControls.style.display = 'none';
            glitchControls.style.display = 'flex';
          });
        }

        // Instability Inputs
        if (xRange && xNum) {
          xRange.addEventListener('input', () => {
            xNum.value = xRange.value;
            updateProbabilityDisplay();
          });
          xNum.addEventListener('input', () => {
            xRange.value = xNum.value;
            updateProbabilityDisplay();
          });
        }

        // View toggle (decayed vs original)
        if (toggleViewBtn) {
          toggleViewBtn.addEventListener('click', () => {
            if (state.fileType === 'image') {
              state.viewingOriginal = !state.viewingOriginal;
              toggleViewBtn.textContent = state.viewingOriginal ? 'view: original' : 'view: decayed';
              renderCanvas(state.viewingOriginal ? state.originalBytes : state.currentBytes);
            }
          });
        }

        // File loader function
        const loadFileObject = (file) => {
          if (!file) return;
          state.fileName = file.name;
          state.openCount = 0;
          state.viewingOriginal = false;
          if (opensBadge) opensBadge.textContent = 'opens: 0';
          if (dropInfo) dropInfo.textContent = `loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

          const lowerName = file.name.toLowerCase();
          const parsed = engine.parseFilename(file.name);

          // Check if file is native .idcy or .tdcy
          if (parsed && (parsed.prefix === 'idcy' || parsed.prefix === 'tdcy')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const u8 = new Uint8Array(ev.target.result);
              const headerRes = engine.parseHeader(u8);
              if (headerRes.error) {
                alert('decayfmt: ' + headerRes.error);
                return;
              }
              state.fileType = headerRes.fileType;
              state.x = parsed.x || 3.0;
              if (xNum) xNum.value = state.x;
              if (xRange) xRange.value = state.x;
              updateProbabilityDisplay();

              state.originalBytes = new Uint8Array(headerRes.payload);
              state.currentBytes = new Uint8Array(headerRes.payload);

              if (state.fileType === 'image') {
                state.width = headerRes.width;
                state.height = headerRes.height;
                if (resBadge) resBadge.textContent = `${state.width}×${state.height} px`;
                renderCanvas(state.currentBytes);
                if (textarea) textarea.value = `[decayfmt native image: ${file.name}]\nDimensions: ${state.width} x ${state.height}\nPayload: ${state.currentBytes.length} raw RGBA bytes\nInstability: x=${state.x}\n\nClick "open / read file" to trigger decay!`;
              } else {
                if (resBadge) resBadge.textContent = 'text mode';
                const decoded = engine.decodeLossyText(state.currentBytes);
                if (textarea) textarea.value = decoded;
              }
              if (statusInfo) statusInfo.textContent = `Native .${parsed.prefix} loaded (pristine)`;
              this.setStatus(`loaded native decayfmt file: ${file.name}`);
              updateEntropyMeter();
            };
            reader.readAsArrayBuffer(file);
            return;
          }

          // Check if file is an image
          if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif)$/i.test(lowerName)) {
            state.fileType = 'image';
            if (resBadge) resBadge.textContent = 'image mode';
            updateProbabilityDisplay();

            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
              URL.revokeObjectURL(url);
              const offCanvas = document.createElement('canvas');
              offCanvas.width = img.naturalWidth;
              offCanvas.height = img.naturalHeight;
              const offCtx = offCanvas.getContext('2d');
              offCtx.drawImage(img, 0, 0);

              const imgData = offCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
              state.width = img.naturalWidth;
              state.height = img.naturalHeight;
              state.originalBytes = new Uint8Array(imgData.data.buffer);
              state.currentBytes = new Uint8Array(state.originalBytes);

              if (resBadge) resBadge.textContent = `${state.width}×${state.height} px`;
              renderCanvas(state.currentBytes);
              if (textarea) textarea.value = `[image loaded: ${file.name}]\nResolution: ${state.width} x ${state.height} px\nRaw RGBA payload: ${state.currentBytes.length} bytes\n\nReady to simulate decay or glitch.`;
              if (statusInfo) statusInfo.textContent = `Image ready: ${state.width}×${state.height}`;
              this.setStatus(`loaded image: ${file.name}`);
              updateEntropyMeter();
            };
            img.src = url;
            return;
          }

          // Text file fallback
          const reader = new FileReader();
          reader.onload = (ev) => {
            state.fileType = 'text';
            if (resBadge) resBadge.textContent = 'text mode';
            updateProbabilityDisplay();

            const text = ev.target.result;
            if (textarea) textarea.value = text;
            state.originalBytes = new TextEncoder().encode(text);
            state.currentBytes = new Uint8Array(state.originalBytes);
            if (statusInfo) statusInfo.textContent = `Text loaded (${state.originalBytes.length} bytes)`;
            this.setStatus(`loaded text file: ${file.name}`);
            updateEntropyMeter();
          };
          reader.readAsText(file);
        };

        // File dropzone clicks & drag-drop
        if (dropzone && fileInput) {
          dropzone.addEventListener('click', () => fileInput.click());
          fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
              loadFileObject(e.target.files[0]);
            }
          });
          dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
          });
          dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
          dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
              loadFileObject(e.dataTransfer.files[0]);
            }
          });
        }

        // Ensure state has payload if user typed in textarea directly
        const syncFromTextareaIfNeeded = () => {
          if (state.fileType === 'image' && state.currentBytes) return;
          const text = textarea ? textarea.value : '';
          state.fileType = 'text';
          state.originalBytes = new TextEncoder().encode(text);
          if (!state.currentBytes || state.openCount === 0) {
            state.currentBytes = new Uint8Array(state.originalBytes);
          }
        };

        // Action: Open / Read File (+1 Decay)
        if (simOpenBtn) {
          simOpenBtn.addEventListener('click', () => {
            syncFromTextareaIfNeeded();
            if (!state.currentBytes || state.currentBytes.length === 0) {
              alert('decayfmt: please enter text in editor or upload a file first.');
              return;
            }

            state.openCount++;
            engine.corruptPayload(state.currentBytes, state.fileType, state.x, 1);

            if (opensBadge) opensBadge.textContent = `opens: ${state.openCount}`;
            if (statusInfo) statusInfo.textContent = `contract paid: decayed in-place on open #${state.openCount}`;

            if (state.fileType === 'image') {
              renderCanvas(state.currentBytes);
              this.setStatus(`open #${state.openCount}: color channels mutated`);
            } else {
              const decayedText = engine.decodeLossyText(state.currentBytes);
              if (textarea) textarea.value = decayedText;
              this.setStatus(`open #${state.openCount}: printable ASCII substitutions written`);
            }

            updateEntropyMeter();
            this.updateLineCounter();
            this.updateStats();
          });
        }

        // Action: Reset Pristine (Simulator)
        if (simResetBtn) {
          simResetBtn.addEventListener('click', () => {
            if (state.originalBytes) {
              state.currentBytes = new Uint8Array(state.originalBytes);
              state.openCount = 0;
              if (opensBadge) opensBadge.textContent = 'opens: 0';
              if (statusInfo) statusInfo.textContent = 'reset to 0 opens';
              if (state.fileType === 'image') {
                renderCanvas(state.currentBytes);
              } else {
                if (textarea) textarea.value = engine.decodeLossyText(state.currentBytes);
              }
              updateEntropyMeter();
              this.setStatus('reset to pristine state');
            }
          });
        }

        // Action: Download .idcy / .tdcy (Simulator)
        const triggerIdcyDownload = () => {
          syncFromTextareaIfNeeded();
          if (!state.currentBytes) return;
          const xInt = Math.round(state.x) || 3;
          let blob = null;
          let filename = '';

          const base = state.fileName ? state.fileName.replace(/\.[^/.]+$/, "") : 'file';

          if (state.fileType === 'image') {
            const encoded = engine.encodeImage(state.width, state.height, state.currentBytes);
            blob = new Blob([encoded], { type: 'application/octet-stream' });
            filename = `${base}.idcy${xInt}`;
          } else {
            const header = engine.buildHeader('text');
            const full = new Uint8Array(header.length + state.currentBytes.length);
            full.set(header, 0);
            full.set(state.currentBytes, header.length);
            blob = new Blob([full], { type: 'application/octet-stream' });
            filename = `${base}.tdcy${xInt}`;
          }

          downloadBlob(blob, filename);
        };

        if (simDlIdcyBtn) simDlIdcyBtn.addEventListener('click', triggerIdcyDownload);
        if (glitchDlIdcyBtn) glitchDlIdcyBtn.addEventListener('click', triggerIdcyDownload);

        // Action: Export viewable PNG / TXT
        if (simExportCleanBtn) {
          simExportCleanBtn.addEventListener('click', () => {
            syncFromTextareaIfNeeded();
            const base = state.fileName ? state.fileName.replace(/\.[^/.]+$/, "") : 'decayed';
            if (state.fileType === 'image') {
              if (canvas) {
                canvas.toBlob((blob) => {
                  if (blob) downloadBlob(blob, `${base}_decayed_open${state.openCount}.png`);
                }, 'image/png');
              }
            } else {
              const text = engine.decodeLossyText(state.currentBytes || new Uint8Array());
              const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              downloadBlob(blob, `${base}_decayed_open${state.openCount}.txt`);
            }
          });
        }

        // Action: Corrupt Now (Direct Glitcher)
        if (glitchRunBtn) {
          glitchRunBtn.addEventListener('click', () => {
            syncFromTextareaIfNeeded();
            if (!state.currentBytes) return;
            const n = Math.max(1, parseInt(itersNum ? itersNum.value : 1, 10) || 1);
            state.openCount += n;

            engine.corruptPayload(state.currentBytes, state.fileType, state.x, n);
            if (statusInfo) statusInfo.textContent = `applied ${n} compound decay iteration(s)`;

            if (state.fileType === 'image') {
              renderCanvas(state.currentBytes);
            } else {
              if (textarea) textarea.value = engine.decodeLossyText(state.currentBytes);
            }

            updateEntropyMeter();
            this.setStatus(`corrupted with ${n} iterations at x=${state.x}`);
            this.updateLineCounter();
            this.updateStats();
          });
        }

        // Action: +1 Step (Glitcher)
        if (glitchStepBtn) {
          glitchStepBtn.addEventListener('click', () => {
            if (simOpenBtn) simOpenBtn.click();
          });
        }

        // Action: Reset (Glitcher)
        if (glitchResetBtn) {
          glitchResetBtn.addEventListener('click', () => {
            if (simResetBtn) simResetBtn.click();
          });
        }

        // Action: Download Corrupted File (Glitcher)
        if (glitchDlBtn) {
          glitchDlBtn.addEventListener('click', () => {
            if (simExportCleanBtn) simExportCleanBtn.click();
          });
        }

        // Initial setup
        updateProbabilityDisplay();
        updateEntropyMeter();
      } else if (toolId === 'unicodemap') {
        const engine = window.TextEngine && window.TextEngine.unicodemap;
        if (!engine) return;

        const ensureNotoSerifCJK = () => {
          if (document.getElementById('noto-serif-cjk-css')) return;
          const link = document.createElement('link');
          link.id = 'noto-serif-cjk-css';
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600&family=Noto+Serif+SC:wght@400;600&family=Noto+Serif+TC:wght@400;600&family=Noto+Serif+HK:wght@400;600&family=Noto+Serif+JP:wght@400;600&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Serif+Armenian:wght@400;600&family=Noto+Serif+Devanagari:wght@400;600&family=Noto+Serif+Bengali:wght@400;600&family=Noto+Serif+Hebrew:wght@400;600&family=Noto+Serif+Georgian:wght@400;600&family=Noto+Serif+Thai:wght@400;600&family=Noto+Serif+Khmer:wght@400;600&family=Noto+Serif+Sinhala:wght@400;600&family=Noto+Serif+Myanmar:wght@400;600&family=Noto+Serif+Lao:wght@400;600&family=Noto+Serif+Ethiopic:wght@400;600&family=Noto+Serif+Tibetan:wght@400;700&family=Noto+Serif+Gurmukhi:wght@400;600&family=Noto+Serif+Gujarati:wght@400;600&family=Noto+Serif+Tamil:wght@400;600&family=Noto+Serif+Telugu:wght@400;600&family=Noto+Serif+Kannada:wght@400;600&family=Noto+Serif+Malayalam:wght@400;600&family=Noto+Serif+Grantha&family=Noto+Serif+Tangut&display=swap';
          document.head.appendChild(link);
        };
        ensureNotoSerifCJK();

        // Pan-Unicode on-demand loader for specialized scripts without a Serif variant
        const SPECIALIZED_NOTO_FONTS = {
          'Egyptian Hieroglyph': 'Noto+Sans+Egyptian+Hieroglyphs',
          'Anatolian Hieroglyphs': 'Noto+Sans+Anatolian+Hieroglyphs',
          'Cuneiform': 'Noto+Sans+Cuneiform',
          'Linear B': 'Noto+Sans+Linear+B',
          'Linear A': 'Noto+Sans+Linear+A',
          'Ugaritic': 'Noto+Sans+Ugaritic',
          'Old Persian': 'Noto+Sans+Old+Persian',
          'Phoenician': 'Noto+Sans+Phoenician',
          'Imperial Aramaic': 'Noto+Sans+Imperial+Aramaic',
          'Runic': 'Noto+Sans+Runic',
          'Ogham': 'Noto+Sans+Ogham',
          'Gothic': 'Noto+Sans+Gothic',
          'Cherokee': 'Noto+Sans+Cherokee',
          'Canadian Aboriginal': 'Noto+Sans+Canadian+Aboriginal',
          'Mongolian': 'Noto+Sans+Mongolian',
          'Thaana': 'Noto+Sans+Thaana',
          'Tifinagh': 'Noto+Sans+Tifinagh',
          'Vai': 'Noto+Sans+Vai',
          'Bamum': 'Noto+Sans+Bamum',
          'Javanese': 'Noto+Sans+Javanese',
          'Balinese': 'Noto+Sans+Balinese',
          'Sundanese': 'Noto+Sans+Sundanese',
          'Batak': 'Noto+Sans+Batak',
          'Buginese': 'Noto+Sans+Buginese',
          'Cham': 'Noto+Sans+Cham',
          'Tai Le': 'Noto+Sans+Tai+Le',
          'New Tai Lue': 'Noto+Sans+New+Tai+Lue',
          'Tai Tham': 'Noto+Sans+Tai+Tham',
          'Tai Viet': 'Noto+Sans+Tai+Viet',
          'Meetei Mayek': 'Noto+Sans+Meetei+Mayek',
          'Lepcha': 'Noto+Sans+Lepcha',
          'Ol Chiki': 'Noto+Sans+Ol+Chiki',
          'Glagolitic': 'Noto+Sans+Glagolitic',
          'Deseret': 'Noto+Sans+Deseret',
          'Shavian': 'Noto+Sans+Shavian',
          'Osmanya': 'Noto+Sans+Osmanya',
          'Brahmi': 'Noto+Sans+Brahmi',
          'Kaithi': 'Noto+Sans+Kaithi',
          'Sharada': 'Noto+Sans+Sharada',
          'Siddham': 'Noto+Sans+Siddham',
          'Modi': 'Noto+Sans+Modi',
          'Takri': 'Noto+Sans+Takri',
          'Warang Citi': 'Noto+Sans+Warang+Citi',
          'Nandinagari': 'Noto+Sans+Nandinagari',
          'Soyombo': 'Noto+Sans+Soyombo',
          'Zanabazar Square': 'Noto+Sans+Zanabazar+Square',
          'Bhaiksuki': 'Noto+Sans+Bhaiksuki',
          'Marchen': 'Noto+Sans+Marchen',
          'Masaram Gondi': 'Noto+Sans+Masaram+Gondi',
          'Gunjala Gondi': 'Noto+Sans+Gunjala+Gondi',
          'Kawi': 'Noto+Sans+Kawi',
          'Mro': 'Noto+Sans+Mro',
          'Tangsa': 'Noto+Sans+Tangsa',
          'Bassa Vah': 'Noto+Sans+Bassa+Vah',
          'Pahawh Hmong': 'Noto+Sans+Pahawh+Hmong',
          'Medefaidrin': 'Noto+Sans+Medefaidrin',
          'Miao': 'Noto+Sans+Miao',
          'Nushu': 'Noto+Sans+Nushu',
          'Duployan': 'Noto+Sans+Duployan',
          'SignWriting': 'Noto+Sans+SignWriting',
          'Adlam': 'Noto+Sans+Adlam',
          'Wancho': 'Noto+Sans+Wancho',
          'Nag Mundari': 'Noto+Sans+Nag+Mundari',
          'Hanifi Rohingya': 'Noto+Sans+Hanifi+Rohingya',
          'Old Sogdian': 'Noto+Sans+Old+Sogdian',
          'Sogdian': 'Noto+Sans+Sogdian',
          'Chorasmian': 'Noto+Sans+Chorasmian',
          'Elymaic': 'Noto+Sans+Elymaic',
          'Nabataean': 'Noto+Sans+Nabataean',
          'Palmyrene': 'Noto+Sans+Palmyrene',
          'Hatran': 'Noto+Sans+Hatran',
          'Lydian': 'Noto+Sans+Lydian',
          'Carian': 'Noto+Sans+Carian',
          'Lycian': 'Noto+Sans+Lycian',
          'Old Italic': 'Noto+Sans+Old+Italic',
          'Old Turkic': 'Noto+Sans+Old+Turkic',
          'Old Hungarian': 'Noto+Sans+Old+Hungarian',
          'Old South Arabian': 'Noto+Sans+Old+South+Arabian',
          'Old North Arabian': 'Noto+Sans+Old+North+Arabian',
          'Manichaean': 'Noto+Sans+Manichaean',
          'Avestan': 'Noto+Sans+Avestan',
          'Inscriptional Parthian': 'Noto+Sans+Inscriptional+Parthian',
          'Inscriptional Pahlavi': 'Noto+Sans+Inscriptional+Pahlavi',
          'Psalter Pahlavi': 'Noto+Sans+Psalter+Pahlavi',
          'Tagalog': 'Noto+Sans+Tagalog',
          'Hanunoo': 'Noto+Sans+Hanunoo',
          'Buhid': 'Noto+Sans+Buhid',
          'Tagbanwa': 'Noto+Sans+Tagbanwa',
          'Limbu': 'Noto+Sans+Limbu',
          'Syloti Nagri': 'Noto+Sans+Syloti+Nagri',
          'Phags Pa': 'Noto+Sans+Phags+Pa',
          'Phags-pa': 'Noto+Sans+Phags+Pa',
          'Saurashtra': 'Noto+Sans+Saurashtra',
          'Kayah Li': 'Noto+Sans+Kayah+Li',
          'Rejang': 'Noto+Sans+Rejang',
          'Coptic': 'Noto+Sans+Coptic',
          'Samaritan': 'Noto+Sans+Samaritan',
          'NKo': 'Noto+Sans+NKo',
          'Mandaic': 'Noto+Sans+Mandaic',
          'Syriac': 'Noto+Sans+Syriac',
          'Yi': 'Noto+Sans+Yi',
          'Lisu': 'Noto+Sans+Lisu',
          'Osage': 'Noto+Sans+Osage',
          'Elbasan': 'Noto+Sans+Elbasan',
          'Caucasian Albanian': 'Noto+Sans+Caucasian+Albanian',
          'Vithkuqi': 'Noto+Sans+Vithkuqi',
          'Cypriot': 'Noto+Sans+Cypriot',
          'Meroitic': 'Noto+Sans+Meroitic',
          'Kharoshthi': 'Noto+Sans+Kharoshthi',
          'Yezidi': 'Noto+Sans+Yezidi',
          'Old Uyghur': 'Noto+Sans+Old+Uyghur',
          'Sora Sompeng': 'Noto+Sans+Sora+Sompeng',
          'Chakma': 'Noto+Sans+Chakma',
          'Mahajani': 'Noto+Sans+Mahajani',
          'Khojki': 'Noto+Sans+Khojki',
          'Multani': 'Noto+Sans+Multani',
          'Khudawadi': 'Noto+Sans+Khudawadi',
          'Newa': 'Noto+Sans+Newa',
          'Tirhuta': 'Noto+Sans+Tirhuta',
          'Ahom': 'Noto+Sans+Ahom',
          'Dogra': 'Noto+Sans+Dogra',
          'Dives Akuru': 'Noto+Sans+Dives+Akuru',
          'Pau Cin Hau': 'Noto+Sans+Pau+Cin+Hau',
          'Sunuwar': 'Noto+Sans+Sunuwar',
          'Makasar': 'Noto+Sans+Makasar',
          'Nyiakeng Puachue Hmong': 'Noto+Sans+Nyiakeng+Puachue+Hmong',
          'Toto': 'Noto+Sans+Toto',
          'Mende Kikakui': 'Noto+Sans+Mende+Kikakui',
          'Siyaq': 'Noto+Sans+Indic+Siyaq+Numbers',
          'Symbols': 'Noto+Sans+Symbols+2',
          'Arrows': 'Noto+Sans+Symbols+2',
          'Geometric': 'Noto+Sans+Symbols+2',
          'Box Drawing': 'Noto+Sans+Symbols+2',
          'Block Elements': 'Noto+Sans+Symbols+2',
          'Braille': 'Noto+Sans+Symbols+2',
          'Mahjong': 'Noto+Sans+Symbols+2',
          'Domino': 'Noto+Sans+Symbols+2',
          'Playing Cards': 'Noto+Sans+Symbols+2',
          'Mathematical': 'Noto+Sans+Math',
          'Musical': 'Noto+Music'
        };

        const loadedNotoFonts = new Set();
        const ensureNotoForBlock = (blockName) => {
          if (!blockName) return;
          let fontParam = null;
          for (const [key, param] of Object.entries(SPECIALIZED_NOTO_FONTS)) {
            if (blockName.includes(key)) {
              fontParam = param;
              break;
            }
          }
          if (!fontParam || loadedNotoFonts.has(fontParam)) return;
          loadedNotoFonts.add(fontParam);
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=' + fontParam + '&display=swap';
          document.head.appendChild(link);
        };

        let currentCp = 0x0041;
        let pageStart = 0x0000;
        let currentFontMode = 'noto-auto';
        let currentFilter = 'all';

        const planeSelect = document.getElementById('tm-unimap-plane-select');
        const blockSelect = document.getElementById('tm-unimap-block-select');
        const fontSelect = document.getElementById('tm-unimap-font-select');
        const filterSelect = document.getElementById('tm-unimap-filter-select');
        const gridEl = document.getElementById('tm-unimap-grid');
        const rangeLbl = document.getElementById('tm-unimap-range-lbl');
        const blockLbl = document.getElementById('tm-unimap-block-lbl');
        const filterIndicator = document.getElementById('tm-unimap-grid-filter-status') || document.getElementById('tm-unimap-filter-indicator');
        const prevBlkBtn = document.getElementById('tm-unimap-prev-blk');
        const nextBlkBtn = document.getElementById('tm-unimap-next-blk');
        const prevPageBtn = document.getElementById('tm-unimap-prev-page');
        const nextPageBtn = document.getElementById('tm-unimap-next-page');
        const prevCharBtn = document.getElementById('tm-unimap-prev-char-btn');
        const nextCharBtn = document.getElementById('tm-unimap-next-char-btn');
        const gotoInput = document.getElementById('tm-unimap-goto-input');
        const gotoBtn = document.getElementById('tm-unimap-goto-btn');
        const searchInput = document.getElementById('tm-unimap-search-input');
        const searchResults = document.getElementById('tm-unimap-search-results');
        const previewGlyph = document.getElementById('tm-unimap-preview-glyph');
        const insertBtn = document.getElementById('tm-unimap-insert-btn');
        const copyCharBtn = document.getElementById('tm-unimap-copy-char-btn');
        const copyCpBtn = document.getElementById('tm-unimap-copy-cp-btn');
        let activeTab = 'map';
        let currentRadicalNum = 1;
        let rsData = (engine && engine.rsIndexCache) || (typeof window !== 'undefined' && window.__UNICODE_RSINDEX__) || null;

        const tabMapBtn = document.getElementById('tm-unimap-tab-map');
        const tabRsBtn = document.getElementById('tm-unimap-tab-rs');
        const toolbarMap = document.getElementById('tm-unimap-toolbar-map');
        const toolbarRs = document.getElementById('tm-unimap-toolbar-rs');
        const paneMap = document.getElementById('tm-unimap-pane-map');
        const paneRs = document.getElementById('tm-unimap-pane-rs');
        const radSelect = document.getElementById('tm-unimap-rs-rad-select');
        const strokeSelect = document.getElementById('tm-unimap-rs-stroke-select');
        const prevRadBtn = document.getElementById('tm-unimap-rs-prev-rad');
        const nextRadBtn = document.getElementById('tm-unimap-rs-next-rad');
        const rsContainer = document.getElementById('tm-unimap-rs-container');
        const rsInfoLbl = document.getElementById('tm-unimap-rs-info-lbl');
        const rsTotalLbl = document.getElementById('tm-unimap-rs-total-lbl');
        const rsFindInput = document.getElementById('tm-unimap-rs-find-input');
        const rsFindBtn = document.getElementById('tm-unimap-rs-find-btn');
        const rsJumpBtn = document.getElementById('tm-unimap-cjk-rs-jump');

        const schemaSelect = document.getElementById('tm-unimap-rs-schema-select');
        const kangxiControls = document.getElementById('tm-unimap-rs-kangxi-controls');
        const pedControls = document.getElementById('tm-unimap-rs-ped-controls');
        const pedSelect = document.getElementById('tm-unimap-rs-ped-select');
        const prevPedBtn = document.getElementById('tm-unimap-rs-prev-ped');
        const nextPedBtn = document.getElementById('tm-unimap-rs-next-ped');
        const wordDecompBox = document.getElementById('tm-unimap-rs-word-decomp');
        const decompWordLbl = document.getElementById('tm-unimap-decomp-word');
        const decompChipsBox = document.getElementById('tm-unimap-decomp-chips');
        const decompCloseBtn = document.getElementById('tm-unimap-decomp-close');
        const pedJumpBtn = document.getElementById('tm-unimap-ped-rs-jump');

        let currentSchema = 'kangxi';
        let currentPedTier = '1';
        let pedData = (engine && engine.cjkPedagogyCache) || (typeof window !== 'undefined' && window.__CJK_PEDAGOGY__) || null;
        let strokePlayerTimer = null;
        let strokePlayerIdx = -1;
        let strokePlayerData = null;

        // Learner Suite Elements & State
        const studyModesBox = document.getElementById('tm-unimap-study-modes');
        const modeGridBtn = document.getElementById('tm-unimap-mode-grid');
        const modeDeckBtn = document.getElementById('tm-unimap-mode-deck');
        const modeVocabBtn = document.getElementById('tm-unimap-mode-vocab');
        const masteryFilterSelect = document.getElementById('tm-unimap-mastery-filter');
        const exportAnkiBtn = document.getElementById('tm-unimap-export-anki');

        const studyProgressBox = document.getElementById('tm-unimap-study-progress-box');
        const progressStatsEl = document.getElementById('tm-unimap-progress-stats');
        const progressSubstatsEl = document.getElementById('tm-unimap-progress-substats');
        const progressFillEl = document.getElementById('tm-unimap-progress-fill');

        const deckPane = document.getElementById('tm-unimap-rs-deck');
        const deckCardCounter = document.getElementById('tm-deck-card-counter');
        const deckStarBtn = document.getElementById('tm-deck-star-btn');
        const deckShuffleBtn = document.getElementById('tm-deck-shuffle-btn');
        const deckFront = document.getElementById('tm-deck-front');
        const deckChar = document.getElementById('tm-deck-char');
        const deckHint = document.getElementById('tm-deck-hint');
        const deckRevealBtn = document.getElementById('tm-deck-reveal-btn');
        const deckBack = document.getElementById('tm-deck-back');
        const deckPinyin = document.getElementById('tm-deck-pinyin');
        const deckAudioBtn = document.getElementById('tm-deck-audio-btn');
        const deckDef = document.getElementById('tm-deck-definition');
        const deckKanji = document.getElementById('tm-deck-kanji');
        const deckCompounds = document.getElementById('tm-deck-compounds');
        const deckGradeAgain = document.getElementById('tm-deck-grade-again');
        const deckGradeHard = document.getElementById('tm-deck-grade-hard');
        const deckGradeGood = document.getElementById('tm-deck-grade-good');
        const deckGradeEasy = document.getElementById('tm-deck-grade-easy');
        const deckPrevBtn = document.getElementById('tm-deck-prev-btn');
        const deckNextBtn = document.getElementById('tm-deck-next-btn');
        const deckResetBtn = document.getElementById('tm-deck-reset-btn');

        const vocabPane = document.getElementById('tm-unimap-rs-vocab');
        const vocabCountLbl = document.getElementById('tm-vocab-count-lbl');
        const vocabFilterInput = document.getElementById('tm-vocab-filter-input');
        const vocabListScroll = document.getElementById('tm-vocab-list-scroll');

        let currentViewMode = 'grid'; // 'grid' | 'deck' | 'vocab'
        let currentMasteryFilter = 'all';
        let deckCards = [];
        let deckIndex = 0;
        let deckFlipped = false;

        const MASTERY_KEY = 'tm_cjk_mastery_v1';
        const loadMasteryStore = () => {
          try {
            return JSON.parse(localStorage.getItem(MASTERY_KEY) || '{}');
          } catch (e) { return {}; }
        };
        const saveMasteryStore = (store) => {
          try {
            localStorage.setItem(MASTERY_KEY, JSON.stringify(store));
          } catch (e) { }
        };
        const getCharMastery = (cp) => {
          const store = loadMasteryStore();
          return store[cp] || { status: 'unlearned', reps: 0, starred: false };
        };
        const updateCharMastery = (cp, grade) => {
          const store = loadMasteryStore();
          const cur = store[cp] || { status: 'unlearned', reps: 0, starred: false };
          cur.last = Date.now();
          if (grade === 'again') {
            cur.status = 'learning';
            cur.reps = 0;
          } else if (grade === 'hard') {
            cur.status = 'learning';
            cur.reps = Math.max(1, cur.reps || 0);
          } else if (grade === 'good') {
            cur.status = 'review';
            cur.reps = (cur.reps || 0) + 1;
          } else if (grade === 'easy') {
            cur.status = 'mastered';
            cur.reps = (cur.reps || 0) + 2;
          }
          store[cp] = cur;
          saveMasteryStore(store);
          return cur;
        };
        const toggleCharStar = (cp) => {
          const store = loadMasteryStore();
          const cur = store[cp] || { status: 'unlearned', reps: 0, starred: false };
          cur.starred = !cur.starred;
          store[cp] = cur;
          saveMasteryStore(store);
          return cur.starred;
        };

        const speakText = (text, lang) => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = lang || (currentSchema === 'jlpt' || currentSchema === 'joyo' ? 'ja-JP' : 'zh-CN');
              u.rate = 0.85;
              window.speechSynthesis.speak(u);
            } catch (e) { }
          }
        };
        const textarea = document.getElementById('tm-textarea');

        if (planeSelect) {
          planeSelect.innerHTML = `<option value="all">All Planes (${engine.blocks.length} Blocks)</option>` + engine.planes.map(p =>
            `<option value="${p.id}">${escapeHTML(p.name)}</option>`
          ).join('');
        }

        const formatBlockRange = (start, end) => {
          const s = 'U+' + start.toString(16).toUpperCase().padStart(4, '0');
          const e = 'U+' + end.toString(16).toUpperCase().padStart(4, '0');
          return `${s}-${e}`;
        };

        const populateBlocks = (selectedPlane) => {
          if (!blockSelect) return;
          if (selectedPlane === 'all' || selectedPlane === undefined) {
            let html = '';
            engine.planes.forEach(p => {
              const pBlocks = engine.blocks.filter(b => b.plane === p.id);
              if (pBlocks.length > 0) {
                html += `<optgroup label="${escapeHTML(p.name)}">`;
                pBlocks.forEach(b => {
                  html += `<option value="${b.start}">${escapeHTML(b.name)} [${formatBlockRange(b.start, b.end)}]</option>`;
                });
                html += `</optgroup>`;
              }
            });
            blockSelect.innerHTML = html;
          } else {
            const planeNum = parseInt(selectedPlane, 10);
            const planeBlocks = engine.blocks.filter(b => b.plane === planeNum);
            blockSelect.innerHTML = planeBlocks.map(b =>
              `<option value="${b.start}">${escapeHTML(b.name)} [${formatBlockRange(b.start, b.end)}]</option>`
            ).join('');
          }
        };

        populateBlocks('all');

        const updateInspector = (cp) => {
          currentCp = cp;
          const info = engine.getUnicodeCharInfo(cp);
          if (info && info.block && info.block.name) ensureNotoForBlock(info.block.name);

          if (previewGlyph) {
            previewGlyph.textContent = info.isControl ? (info.controlLabel || '·') : (info.char || ' ');
            previewGlyph.style.fontSize = info.isControl ? '1.2rem' : '2.4rem';
            previewGlyph.setAttribute('data-schema', currentSchema);
          }

          const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
          };

          setTxt('tm-unimap-cp-badge', info.formattedHex);
          setTxt('tm-unimap-name-badge', info.name);

          const agePill = document.getElementById('tm-unimap-age-pill');
          if (agePill) {
            agePill.textContent = `Unicode ${info.age}`;
            if (info.isNewIn18) {
              agePill.className = 'tm-unimap-tag tag-new';
              agePill.title = 'New addition in Unicode 18.0 (2026)!';
            } else {
              agePill.className = 'tm-unimap-tag';
              agePill.title = `Introduced in Unicode ${info.age}`;
            }
          }

          setTxt('tm-unimap-p-dec', info.dec);
          setTxt('tm-unimap-p-block', info.block.name);
          setTxt('tm-unimap-p-plane', info.plane.name);
          setTxt('tm-unimap-p-script', info.script);
          setTxt('tm-unimap-p-cat', `${info.category.code} (${info.category.name})`);
          setTxt('tm-unimap-p-bidi', `${info.bidiClass ? `${info.bidiClass.code} (${info.bidiClass.name})` : 'L (Left-to-Right)'}`);
          setTxt('tm-unimap-p-ccc', `${info.combiningClass ? `${info.combiningClass.value} (${info.combiningClass.name})` : '0 (Spacing / Base)'}`);
          setTxt('tm-unimap-p-eaw', `${info.eastAsianWidth.code} (${info.eastAsianWidth.name})`);
          setTxt('tm-unimap-p-lb', `${info.lineBreak.code} (${info.lineBreak.name})`);

          // Mirrored
          const mirroredRow = document.getElementById('tm-unimap-row-mirrored');
          if (mirroredRow) {
            if (info.bidiMirrored && info.mirroredCp) {
              mirroredRow.style.display = '';
              const mHex = 'U+' + info.mirroredCp.toString(16).toUpperCase().padStart(4, '0');
              const elVal = document.getElementById('tm-unimap-p-mirrored');
              if (elVal) {
                elVal.innerHTML = `<span class="tm-unimap-link" data-jump-cp="${info.mirroredCp}">Yes → ${mHex} (${escapeHTML(info.mirroredChar)})</span>`;
              }
            } else {
              mirroredRow.style.display = 'none';
            }
          }

          // Indic
          const indicRow = document.getElementById('tm-unimap-row-indic');
          if (indicRow) {
            if (info.indic && (info.indic.positional || info.indic.syllabic)) {
              indicRow.style.display = '';
              setTxt('tm-unimap-p-indic', `${info.indic.syllabic || 'Base'} [Pos: ${info.indic.positional || 'None'}]`);
            } else {
              indicRow.style.display = 'none';
            }
          }

          // Arabic
          const arabicRow = document.getElementById('tm-unimap-row-arabic');
          if (arabicRow) {
            if (info.arabic) {
              arabicRow.style.display = '';
              setTxt('tm-unimap-p-arabic', `${info.arabic.joiningType} (${info.arabic.joiningGroup})`);
            } else {
              arabicRow.style.display = 'none';
            }
          }

          const decompRow = document.getElementById('tm-unimap-row-decomp');
          if (decompRow) {
            if (info.decomposition) {
              decompRow.style.display = '';
              setTxt('tm-unimap-p-decomp', info.decomposition);
            } else {
              decompRow.style.display = 'none';
            }
          }

          const numericRow = document.getElementById('tm-unimap-row-numeric');
          if (numericRow) {
            if (info.numericValue) {
              numericRow.style.display = '';
              setTxt('tm-unimap-p-numeric', info.numericValue);
            } else {
              numericRow.style.display = 'none';
            }
          }

          const casesRow = document.getElementById('tm-unimap-row-cases');
          if (casesRow) {
            if (info.caseMappings && info.caseMappings.formatted) {
              casesRow.style.display = '';
              setTxt('tm-unimap-p-cases', info.caseMappings.formatted);
            } else {
              casesRow.style.display = 'none';
            }
          }

          const aliasRow = document.getElementById('tm-unimap-row-alias');
          if (aliasRow) {
            const aliasItems = [];
            if (info.oldName) aliasItems.push(`1.0: ${info.oldName}`);
            if (info.formalAliases && info.formalAliases.length > 0) {
              info.formalAliases.forEach(a => aliasItems.push(`${a[0]} (${a[1]})`));
            }
            if (aliasItems.length > 0) {
              aliasRow.style.display = '';
              setTxt('tm-unimap-p-alias', aliasItems.join(', '));
            } else {
              aliasRow.style.display = 'none';
            }
          }

          // Specialized Cards: Pedagogical Proficiency & Curricular Benchmarks
          const pedCard = document.getElementById('tm-unimap-card-pedagogy');
          const pedBadgesEl = document.getElementById('tm-unimap-ped-badges');
          const pedIdsTreeEl = document.getElementById('tm-unimap-ped-ids-tree');
          const compCard = document.getElementById('tm-unimap-card-compounds');
          const compListEl = document.getElementById('tm-unimap-ped-vocab-list');
          const strokeCard = document.getElementById('tm-unimap-card-stroke-player');
          const strokeBoxEl = document.getElementById('tm-unimap-stroke-canvas-box');
          const strokeCountLbl = document.getElementById('tm-unimap-stroke-count-lbl');
          const strokeBtnPrev = document.getElementById('tm-stroke-btn-prev');
          const strokeBtnPlay = document.getElementById('tm-stroke-btn-play');
          const strokeBtnNext = document.getElementById('tm-stroke-btn-next');
          const strokeBtnReset = document.getElementById('tm-stroke-btn-reset');

          const isCjkChar = (cp >= 0x3400 && cp <= 0x4DBF) || (cp >= 0x4E00 && cp <= 0x9FFF) || (cp >= 0x20000 && cp <= 0x3347F);

          if (isCjkChar && pedCard) {
            engine.ensurePedagogy().then(pData => {
              if (currentCp !== cp) return;
              const charRec = pData && pData.characters && (pData.characters[cp] || pData.characters[String(cp)]);
              if (charRec) {
                pedCard.style.display = 'flex';
                let bHtml = '';
                if (charRec.hsk) bHtml += `<span class="tm-unimap-ped-badge badge-hsk">HSK 3.0: Band ${charRec.hsk}</span>`;
                if (charRec.tocfl) bHtml += `<span class="tm-unimap-ped-badge badge-tocfl">TOCFL: ${escapeHTML(charRec.tocfl)}</span>`;
                if (charRec.joyo) {
                  const jName = charRec.joyo === 8 ? 'Secondary' : `Grade ${charRec.joyo}`;
                  bHtml += `<span class="tm-unimap-ped-badge badge-joyo">Jōyō: ${jName}</span>`;
                }
                if (charRec.jlpt) bHtml += `<span class="tm-unimap-ped-badge badge-jlpt">JLPT: ${charRec.jlpt}</span>`;
                if (charRec.zipf) {
                  let zDesc = 'Low';
                  if (charRec.zipf >= 5.5) zDesc = 'Core';
                  else if (charRec.zipf >= 4.5) zDesc = 'Conversational';
                  else if (charRec.zipf >= 3.5) zDesc = 'General';
                  bHtml += `<span class="tm-unimap-ped-badge badge-zipf">Zipf: ${charRec.zipf} (${zDesc})</span>`;
                }
                if (pedBadgesEl) pedBadgesEl.innerHTML = bHtml || '<span style="color:#666; font-size:0.72rem;">No curriculum levels assigned</span>';

                // Render Character Meaning & Pīnyīn Row
                const meaningRow = document.getElementById('tm-unimap-ped-meaning-row');
                const pedPinyinLine = document.getElementById('tm-unimap-ped-pinyin-line');
                const pedPinyinEl = document.getElementById('tm-unimap-ped-pinyin');
                const pedDefLine = document.getElementById('tm-unimap-ped-def-line');
                const pedDefEl = document.getElementById('tm-unimap-ped-definition');
                const pedKanjiLine = document.getElementById('tm-unimap-ped-kanji-line');
                const pedKanjiOnKun = document.getElementById('tm-unimap-ped-kanji-onkun');
                const pedKanjiMeaning = document.getElementById('tm-unimap-ped-kanji-meaning');

                if (meaningRow) {
                  let hasMeaning = false;
                  if (charRec.pinyin) {
                    if (pedPinyinLine) pedPinyinLine.style.display = '';
                    if (pedPinyinEl) pedPinyinEl.textContent = charRec.pinyin;
                    hasMeaning = true;
                  } else if (pedPinyinLine) {
                    pedPinyinLine.style.display = 'none';
                  }

                  if (charRec.definition) {
                    if (pedDefLine) pedDefLine.style.display = '';
                    if (pedDefEl) pedDefEl.textContent = charRec.definition;
                    hasMeaning = true;
                  } else if (pedDefLine) {
                    pedDefLine.style.display = 'none';
                  }

                  if (charRec.kanji && (charRec.kanji.on || charRec.kanji.kun || charRec.kanji.m)) {
                    if (pedKanjiLine) pedKanjiLine.style.display = '';
                    const onkun = [charRec.kanji.on, charRec.kanji.kun].filter(Boolean).join(' / ');
                    if (pedKanjiOnKun) pedKanjiOnKun.textContent = onkun ? `[${onkun}]` : '';
                    if (pedKanjiMeaning) pedKanjiMeaning.textContent = charRec.kanji.m || '';
                    hasMeaning = true;
                  } else if (pedKanjiLine) {
                    pedKanjiLine.style.display = 'none';
                  }

                  meaningRow.style.display = hasMeaning ? 'block' : 'none';
                }

                // Render IDS
                if (pedIdsTreeEl) {
                  const idsStr = charRec.ids || '';
                  if (idsStr) {
                    const idcOps = {
                      '⿰': 'Left-to-Right',
                      '⿱': 'Above-to-Below',
                      '⿲': 'Left-to-Right (Ternary)',
                      '⿳': 'Above-to-Below (Ternary)',
                      '⿴': 'Full Surround',
                      '⿵': 'Surround from Above',
                      '⿶': 'Surround from Below',
                      '⿷': 'Surround from Left',
                      '⿸': 'Surround Upper-Left',
                      '⿹': 'Surround Upper-Right',
                      '⿺': 'Surround Lower-Left',
                      '⿻': 'Overlaid',
                      '⿾': 'Horizontal Reflection',
                      '⿿': 'Rotation'
                    };
                    const parts = Array.from(idsStr);
                    let treeHtml = '';
                    parts.forEach(ch => {
                      const code = ch.codePointAt(0);
                      if (idcOps[ch]) {
                        treeHtml += `<span class="tm-unimap-ids-op" title="${idcOps[ch]}"><span class="tm-unimap-ids-sym font-unifont">${escapeHTML(ch)}</span> <span class="tm-unimap-ids-text">[${idcOps[ch]}]</span></span> `;
                      } else {
                        treeHtml += `<button type="button" class="tm-unimap-ids-chip" data-jump-cp="${code}" title="Jump to constituent: ${escapeHTML(ch)} (U+${code.toString(16).toUpperCase()})">${escapeHTML(ch)}</button> `;
                      }
                    });
                    pedIdsTreeEl.innerHTML = treeHtml;
                  } else {
                    pedIdsTreeEl.innerHTML = '<span style="color:#666; font-size:0.72rem;">(Atomic ideograph)</span>';
                  }
                }

                // Render Vocabulary Compounds
                if (compCard && compListEl) {
                  if (charRec.words && charRec.words.length > 0) {
                    compCard.style.display = 'flex';
                    let vHtml = '';
                    charRec.words.forEach(wObj => {
                      const wChars = Array.from(wObj.w);
                      const wLinked = wChars.map(c => {
                        const code = c.codePointAt(0);
                        return `<span class="tm-unimap-vocab-char-link" data-jump-cp="${code}" title="Inspect '${c}' (U+${code.toString(16).toUpperCase()})">${escapeHTML(c)}</span>`;
                      }).join('');
                      const reading = wObj.r ? ` / ${escapeHTML(wObj.r)}` : (wObj.p ? ` / ${escapeHTML(wObj.p)}` : '');
                      const meaning = wObj.m ? escapeHTML(wObj.m) : '';
                      vHtml += `<div class="tm-unimap-vocab-item">
                        <div class="tm-unimap-vocab-content">
                          <div class="tm-unimap-vocab-head">
                            <span class="tm-unimap-vocab-word c-accent">${wLinked}</span>
                            <span class="tm-unimap-vocab-read">${reading}</span>
                          </div>
                          ${meaning ? `<div class="tm-unimap-vocab-meaning">${meaning}</div>` : ''}
                        </div>
                        <div class="tm-unimap-vocab-meta">
                          <span class="tm-unimap-ped-badge ${wObj.lvl.startsWith('HSK') ? 'badge-hsk' : 'badge-jlpt'}">${escapeHTML(wObj.lvl)}</span>
                        </div>
                      </div>`;
                    });
                    compListEl.innerHTML = vHtml;
                  } else {
                    compCard.style.display = 'none';
                  }
                }
              } else {
                pedCard.style.display = 'none';
                if (compCard) compCard.style.display = 'none';
              }
            });

            // Vector Stroke Order Player
            if (strokeCard && strokeBoxEl) {
              if (strokePlayerTimer) {
                clearInterval(strokePlayerTimer);
                strokePlayerTimer = null;
              }
              strokeBoxEl.innerHTML = '<div style="color:#666; font-size:0.72rem;">Loading stroke paths...</div>';
              engine.ensureStrokes(cp).then(stk => {
                if (currentCp !== cp) return;
                if (!stk || !stk.s || stk.s.length === 0) {
                  strokeCard.style.display = 'none';
                  strokePlayerData = null;
                  return;
                }
                strokeCard.style.display = 'flex';
                strokePlayerData = stk;
                const totalStrokes = stk.s.length;
                strokePlayerIdx = totalStrokes - 1;

                const isKvg = !!stk.isKvg;
                const viewBox = isKvg ? "0 0 109 109" : "0 0 1024 1024";
                const w = isKvg ? 109 : 1024;
                const half = w / 2;

                const renderSvgFrame = (activeIdx, isFull = false) => {
                  let svg = `<svg viewBox="${viewBox}" class="tm-unimap-stroke-svg">
                    <g class="tm-stroke-grid">
                      <line x1="0" y1="${half}" x2="${w}" y2="${half}" class="tm-stroke-guide-line" />
                      <line x1="${half}" y1="0" x2="${half}" y2="${w}" class="tm-stroke-guide-line" />
                      <line x1="0" y1="0" x2="${w}" y2="${w}" class="tm-stroke-guide-line" />
                      <line x1="${w}" y1="0" x2="0" y2="${w}" class="tm-stroke-guide-line" />
                    </g>`;

                  if (!isKvg) {
                    svg += `<g transform="scale(1, -1) translate(0, -900)">`;
                  } else {
                    svg += `<g style="fill:none; stroke-width:3.5; stroke-linecap:round; stroke-linejoin:round;">`;
                  }

                  stk.s.forEach((d, idx) => {
                    const isDrawn = isFull || idx <= activeIdx;
                    const isActive = !isFull && idx === activeIdx;
                    if (isKvg) {
                      const strokeColor = isActive ? 'var(--accent-color)' : (isDrawn ? '#ddd' : '#333');
                      svg += `<path d="${d}" style="stroke:${strokeColor};" class="tm-stroke-path${isDrawn ? ' drawn' : ''}${isActive ? ' active' : ''}" data-idx="${idx}" />`;
                    } else {
                      svg += `<path d="${d}" class="tm-stroke-path${isDrawn ? ' drawn' : ''}${isActive ? ' active' : ''}" data-idx="${idx}" />`;
                    }
                  });

                  svg += `</g>`;

                  if (!isKvg && stk.m) {
                    svg += `<g class="tm-stroke-numbers">`;
                    stk.m.forEach((pts, idx) => {
                      if (pts && pts[0]) {
                        const pt = pts[0];
                        const nx = pt[0];
                        const ny = 900 - pt[1] - 10;
                        const isNumActive = !isFull && idx === activeIdx;
                        svg += `<text x="${nx}" y="${ny}" class="tm-stroke-num" style="${isNumActive ? 'fill:var(--accent-color); font-weight:bold;' : ''}">${idx + 1}</text>`;
                      }
                    });
                    svg += `</g>`;
                  }

                  svg += `</svg>`;
                  strokeBoxEl.innerHTML = svg;

                  if (strokeCountLbl) {
                    if (isFull) {
                      strokeCountLbl.textContent = `${totalStrokes} strokes (complete)`;
                    } else {
                      strokeCountLbl.textContent = `stroke ${activeIdx + 1} of ${totalStrokes}`;
                    }
                  }
                };

                renderSvgFrame(strokePlayerIdx, true);

                if (strokeBtnPlay) {
                  strokeBtnPlay.onclick = () => {
                    if (strokePlayerTimer) {
                      clearInterval(strokePlayerTimer);
                      strokePlayerTimer = null;
                      strokeBtnPlay.textContent = '▶︎ play';
                      strokeBtnPlay.classList.remove('active');
                    } else {
                      strokeBtnPlay.textContent = '⏸︎ pause';
                      strokeBtnPlay.classList.add('active');
                      if (strokePlayerIdx >= totalStrokes - 1) {
                        strokePlayerIdx = -1;
                      }
                      strokePlayerTimer = setInterval(() => {
                        strokePlayerIdx++;
                        if (strokePlayerIdx >= totalStrokes) {
                          clearInterval(strokePlayerTimer);
                          strokePlayerTimer = null;
                          strokeBtnPlay.textContent = '▶︎ Play';
                          strokeBtnPlay.classList.remove('active');
                          renderSvgFrame(totalStrokes - 1, true);
                          return;
                        }
                        renderSvgFrame(strokePlayerIdx, false);
                      }, 550);
                    }
                  };
                }

                if (strokeBtnPrev) {
                  strokeBtnPrev.onclick = () => {
                    if (strokePlayerTimer) { clearInterval(strokePlayerTimer); strokePlayerTimer = null; if (strokeBtnPlay) { strokeBtnPlay.textContent = '▶︎ Play'; strokeBtnPlay.classList.remove('active'); } }
                    if (strokePlayerIdx > 0) {
                      strokePlayerIdx--;
                      renderSvgFrame(strokePlayerIdx, false);
                    }
                  };
                }

                if (strokeBtnNext) {
                  strokeBtnNext.onclick = () => {
                    if (strokePlayerTimer) { clearInterval(strokePlayerTimer); strokePlayerTimer = null; if (strokeBtnPlay) { strokeBtnPlay.textContent = '▶︎ Play'; strokeBtnPlay.classList.remove('active'); } }
                    if (strokePlayerIdx < totalStrokes - 1) {
                      strokePlayerIdx++;
                      renderSvgFrame(strokePlayerIdx, false);
                    } else {
                      renderSvgFrame(totalStrokes - 1, true);
                    }
                  };
                }

                if (strokeBtnReset) {
                  strokeBtnReset.onclick = () => {
                    if (strokePlayerTimer) { clearInterval(strokePlayerTimer); strokePlayerTimer = null; if (strokeBtnPlay) { strokeBtnPlay.textContent = '▶︎ Play'; strokeBtnPlay.classList.remove('active'); } }
                    strokePlayerIdx = totalStrokes - 1;
                    renderSvgFrame(strokePlayerIdx, true);
                  };
                }
              });
            }
          } else {
            if (pedCard) pedCard.style.display = 'none';
            if (compCard) compCard.style.display = 'none';
            if (strokeCard) strokeCard.style.display = 'none';
          }

          // Specialized Cards: CJK
          const cjkCard = document.getElementById('tm-unimap-card-cjk');
          const cjkContent = document.getElementById('tm-unimap-cjk-content');
          if (cjkCard) {
            const isCjk = (cp >= 0x3400 && cp <= 0x4DBF) || (cp >= 0x4E00 && cp <= 0x9FFF) || (cp >= 0x20000 && cp <= 0x3347F);
            if (isCjk) {
              cjkCard.style.display = 'flex';
              if (cjkContent) cjkContent.innerHTML = '<div style="color:#777; font-size:0.72rem;">Loading Unihan properties...</div>';
              engine.ensureUnihan(cp).then(han => {
                if (currentCp !== cp) return;
                if (!han) {
                  if (cjkContent) cjkContent.innerHTML = '<div style="color:#777; font-size:0.72rem;">No Unihan readings recorded for this character.</div>';
                  return;
                }

                const addRow = (label, val, isAccent = false, isQuote = false) => {
                  if (!val) return '';
                  return `<div style="line-height:1.35;"><span style="color:#888;">${escapeHTML(label)}:</span> <span class="${isAccent ? 'c-accent ansi-bold' : ''}" style="${isQuote ? 'color:#eee;' : ''}">${val}</span></div>`;
                };

                const formatVariantList = (str) => {
                  if (!str) return '';
                  const tokens = str.trim().split(/\s+/);
                  return tokens.map(tok => {
                    const m = tok.match(/^(U\+[0-9A-Fa-f]{4,6})(?:<([^>]+))?$/i);
                    if (!m) return escapeHTML(tok);
                    const hex = m[1].toUpperCase();
                    const rawSources = m[2];
                    const cp = parseInt(hex.slice(2), 16);
                    let ch = '';
                    try { ch = String.fromCodePoint(cp); } catch (e) { }

                    let out = `<span class="tm-unimap-link" data-jump-cp="${cp}">${hex}${ch ? ` (${escapeHTML(ch)})` : ''}</span>`;
                    if (rawSources) {
                      const cleanSources = rawSources.split(',').map(s => {
                        const [name, qual] = s.split(':');
                        const cleanName = name.replace(/^k/, '');
                        if (qual) return `${cleanName} (${qual})`;
                        return cleanName;
                      }).join(', ');
                      out += ` <span class="c-dim" style="font-size:0.68rem; background:#181818; border:1px solid #282828; padding:0 4px; border-radius:3px;" title="Dictionary sources: ${escapeHTML(cleanSources)}">[${escapeHTML(cleanSources)}]</span>`;
                    }
                    return out;
                  }).join(', ');
                };

                let rsFormatted = han.rs || '-';
                if (han.rs) {
                  const m = han.rs.match(/^(\d+)('?)\.(\d+)$/);
                  if (m) {
                    const radNum = parseInt(m[1], 10);
                    let radChar = '';
                    if (engine.rsIndexCache) {
                      const rObj = engine.rsIndexCache.find(r => r.num === radNum);
                      if (rObj) radChar = rObj.char;
                    }
                    rsFormatted = `${radNum}${radChar ? `(${radChar})` : ''}${m[2]}.${m[3]}`;
                  }
                }

                let html = '';
                html += addRow('standard radical-stroke count', escapeHTML(rsFormatted));
                html += addRow('total number of strokes', escapeHTML(han.s || '-'));
                html += addRow('definition', escapeHTML(han.d || '(none)'), false, true);
                html += addRow('pīnyīn reading', escapeHTML(han.m || ''), true);
                html += addRow('Cantonese reading', escapeHTML(han.c || ''));
                html += addRow('Tang dynasty pronunciation', escapeHTML(han.tang || ''));
                html += addRow('pronunciation and frequency by Xiandai Hanyu Pinlu Cidian', escapeHTML(han.pinlu || ''));
                html += addRow('Hànyǔ Pīnyīn reading in the Xiàndài Hànyǔ Cídiǎn', escapeHTML(han.xhc || ''));
                html += addRow('Hànyǔ Pīnyīn reading', escapeHTML(han.hypy || ''));
                html += addRow('Hànyǔ Pīnyīn reading in Tōngyòng Guīfàn Hànzì Zìdiǎn', escapeHTML(han.tgh || ''));
                html += addRow('Mandarin and Cantonese readings in the Soengmou San Zidin', escapeHTML(han.smszd || ''));
                html += addRow('Fanqie reading', escapeHTML(han.fq || ''));
                html += addRow('Japanese pronunciation', escapeHTML(han.ja_kun || ''));
                html += addRow('Sino-Japanese pronunciation', escapeHTML(han.ja_on || ''));
                html += addRow('Japanese reading in Kana', escapeHTML(han.ja_kana || ''));
                html += addRow('Korean pronunciation', escapeHTML(han.ko || ''));
                html += addRow('Korean pronunciation in Hangul', escapeHTML(han.ko_hangul || ''));
                html += addRow('pronunciation in Quốc ngữ', escapeHTML(han.vi || ''));
                html += addRow('Cangjie input code', escapeHTML(han.cj || ''));
                html += addRow('Four-Corner Code', escapeHTML(han.fc || ''));
                html += addRow('Hong Kong primary grade level', escapeHTML(han.gr || ''));
                html += addRow('Phonetic series', escapeHTML(han.ph || ''));
                html += addRow('Chinese numeric value', escapeHTML(han.num || ''));
                if (han.sim) html += addRow('simplified variant', formatVariantList(han.sim));
                if (han.trad) html += addRow('traditional variant', formatVariantList(han.trad));
                if (han.sem) html += addRow('semantic variant', formatVariantList(han.sem));
                if (han.zvar) html += addRow('z-variant', formatVariantList(han.zvar));

                if (cjkContent) cjkContent.innerHTML = html;
              });
            } else {
              cjkCard.style.display = 'none';
            }
          }

          // Specialized Cards: Egyptian Hieroglyphs
          const kemetCard = document.getElementById('tm-unimap-card-kemet');
          if (kemetCard) {
            const isKemet = (cp >= 0x13000 && cp <= 0x143FF);
            if (isKemet) {
              kemetCard.style.display = 'flex';
              engine.ensureUnikemet(cp).then(km => {
                if (currentCp !== cp) return;
                setTxt('tm-unimap-kemet-code', km && km.g ? km.g : '-');
                setTxt('tm-unimap-kemet-desc', km && km.desc ? km.desc : '-');
                setTxt('tm-unimap-kemet-func', km && km.func ? km.func : '-');
              });
            } else {
              kemetCard.style.display = 'none';
            }
          }

          // Specialized Cards: Emoji
          const emojiCard = document.getElementById('tm-unimap-card-emoji');
          if (emojiCard) {
            engine.ensureEmoji(cp).then(em => {
              if (currentCp !== cp) return;
              if (em) {
                emojiCard.style.display = 'flex';
                setTxt('tm-unimap-emoji-group', em[0] || '-');
                setTxt('tm-unimap-emoji-subgroup', em[1] || '-');
                setTxt('tm-unimap-emoji-status', em[2] || '-');
              } else {
                emojiCard.style.display = 'none';
              }
            });
          }

          // Specialized Cards: Security & Confusables
          const secCard = document.getElementById('tm-unimap-card-security');
          if (secCard) {
            engine.ensureSecurity(cp).then(sec => {
              if (currentCp !== cp) return;
              if (sec && (sec.confusable || (sec.idStatus && sec.idStatus !== 'Allowed'))) {
                secCard.style.display = 'flex';
                const confRow = document.getElementById('tm-unimap-sec-conf-row');
                if (confRow) {
                  if (sec.confusable) {
                    confRow.style.display = '';
                    const tgtHex = sec.confusable[0];
                    let tgtChar = '';
                    try { tgtChar = String.fromCodePoint(parseInt(tgtHex, 16)); } catch (e) { }
                    const elTgt = document.getElementById('tm-unimap-sec-target');
                    if (elTgt) {
                      elTgt.textContent = `U+${tgtHex} ${tgtChar ? `(${tgtChar})` : ''}`;
                      elTgt.dataset.jumpCp = parseInt(tgtHex, 16);
                    }
                    setTxt('tm-unimap-sec-type', sec.confusable[1]);
                  } else {
                    confRow.style.display = 'none';
                  }
                }
                setTxt('tm-unimap-sec-idstatus', sec.idStatus === 'Allowed' ? 'Allowed in identifiers (UAX #31)' : `${sec.idStatus} in identifiers`);
              } else {
                secCard.style.display = 'none';
              }
            });
          }

          // Specialized Cards: NamesList Annotations
          const nlCard = document.getElementById('tm-unimap-card-nameslist');
          if (nlCard) {
            engine.ensureNamesList(cp).then(nl => {
              if (currentCp !== cp) return;
              if (nl && (nl.a || nl.n || nl.x)) {
                nlCard.style.display = 'flex';
                const elAliases = document.getElementById('tm-unimap-nl-aliases');
                if (elAliases) {
                  if (nl.a && nl.a.length > 0) {
                    elAliases.style.display = '';
                    elAliases.innerHTML = nl.a.map(a => `<div>• = ${escapeHTML(a)}</div>`).join('');
                  } else {
                    elAliases.style.display = 'none';
                  }
                }
                const elNotes = document.getElementById('tm-unimap-nl-notes');
                if (elNotes) {
                  if (nl.n && nl.n.length > 0) {
                    elNotes.style.display = '';
                    elNotes.innerHTML = nl.n.map(n => `<div>• * ${escapeHTML(n)}</div>`).join('');
                  } else {
                    elNotes.style.display = 'none';
                  }
                }
                const elSee = document.getElementById('tm-unimap-nl-seealso');
                if (elSee) {
                  if (nl.x && nl.x.length > 0) {
                    elSee.style.display = '';
                    elSee.innerHTML = nl.x.map(xStr => {
                      const hexM = xStr.match(/([0-9A-Fa-f]{4,6})/);
                      if (hexM) {
                        const targetCp = parseInt(hexM[1], 16);
                        return `<div>→ <span class="tm-unimap-link" data-jump-cp="${targetCp}">see also ${escapeHTML(xStr)}</span></div>`;
                      }
                      return `<div>→ see also ${escapeHTML(xStr)}</div>`;
                    }).join('');
                  } else {
                    elSee.style.display = 'none';
                  }
                }
              } else {
                nlCard.style.display = 'none';
              }
            });
          }

          // Encodings
          setTxt('tm-unimap-p-utf8', info.utf8Hex || '-');
          setTxt('tm-unimap-p-utf16', info.utf16Hex || '-');
          setTxt('tm-unimap-p-utf32', info.utf32Hex || '-');
          setTxt('tm-unimap-p-htmldec', info.htmlDec);
          setTxt('tm-unimap-p-htmlhex', info.htmlHex);
          setTxt('tm-unimap-p-htmlent', info.htmlNamed || '-');
          setTxt('tm-unimap-p-escape', info.escapeJs);
          setTxt('tm-unimap-p-pyescape', info.escapePython);
          setTxt('tm-unimap-p-cssescape', info.escapeCss);
          setTxt('tm-unimap-p-urlenc', info.percentEncoded || '-');

          if (gridEl) {
            const cells = gridEl.querySelectorAll('.tm-unimap-cell');
            cells.forEach(c => {
              if (parseInt(c.dataset.cp, 10) === cp) {
                c.classList.add('active');
              } else {
                c.classList.remove('active');
              }
            });
          }
        };

        const renderGrid = () => {
          if (!gridEl) return;
          const pageEnd = Math.min(pageStart + 0xFF, 0x10FFFF);
          const startHex = 'U+' + pageStart.toString(16).toUpperCase().padStart(4, '0');
          const endHex = 'U+' + pageEnd.toString(16).toUpperCase().padStart(4, '0');
          if (rangeLbl) rangeLbl.textContent = `${startHex}-${endHex}`;

          const blk = engine.getUnicodeBlock(currentCp);
          if (blockLbl) blockLbl.textContent = blk.name;
          if (blk && blk.name) ensureNotoForBlock(blk.name);

          const planeId = pageStart >> 16;
          if (planeSelect && planeSelect.value !== 'all' && parseInt(planeSelect.value, 10) !== planeId) {
            planeSelect.value = planeId;
            populateBlocks(planeId);
          }

          if (blockSelect) {
            const opt = Array.from(blockSelect.options).find(o => parseInt(o.value, 10) === blk.start);
            if (opt) blockSelect.value = opt.value;
          }

          if (filterIndicator) {
            filterIndicator.style.display = currentFilter === 'all' ? 'none' : 'block';
            filterIndicator.textContent = `unicode ${currentFilter} filter active`;
          }

          let gridHtml = '<div class="tm-unimap-col-hdr">U+</div>';
          for (let col = 0; col < 16; col++) {
            gridHtml += `<div class="tm-unimap-col-hdr">${col.toString(16).toUpperCase()}</div>`;
          }

          for (let row = 0; row < 16; row++) {
            const rowStart = pageStart + (row * 16);
            if (rowStart > 0x10FFFF) break;
            const rowHex = rowStart.toString(16).toUpperCase().padStart(4, '0').slice(0, -1) + '_';
            gridHtml += `<div class="tm-unimap-row-hdr">${rowHex}</div>`;

            for (let col = 0; col < 16; col++) {
              const cp = rowStart + col;
              if (cp > 0x10FFFF) {
                gridHtml += `<div class="tm-unimap-cell empty"></div>`;
                continue;
              }

              const info = engine.getUnicodeCharInfo(cp);
              const isActive = (cp === currentCp);
              let cellClass = 'tm-unimap-cell';
              if (isActive) cellClass += ' active';

              let display = '';
              if (info.isControl) {
                cellClass += ' control';
                display = info.controlLabel || '·';
              } else if (!info.isAssigned) {
                cellClass += ' empty';
                display = '';
              } else {
                display = escapeHTML(info.char || '');
              }

              let badgeStyle = '';
              if (info.isNewIn18) {
                cellClass += ' new-in-18';
                badgeStyle = 'style="box-shadow: inset 0 0 0 1px #00ff66;"';
              }

              if (currentFilter !== 'all') {
                if (info.age === currentFilter) {
                  badgeStyle = 'style="box-shadow: inset 0 0 0 1px var(--accent-color);"';
                } else {
                  cellClass += ' dim';
                }
              }

              const title = `${info.formattedHex}: ${escapeHTML(info.name)} [Unicode ${info.age}]`;
              gridHtml += `<div class="${cellClass}" ${badgeStyle} data-cp="${cp}" title="${title}">${display}</div>`;
            }
          }

          gridEl.innerHTML = gridHtml;
          updateInspector(currentCp);
        };

        const jumpToCodePoint = (cp) => {
          if (typeof cp !== 'number' || isNaN(cp) || cp < 0 || cp > 0x10FFFF) return;
          currentCp = cp;
          pageStart = cp & ~0xFF;
          const planeId = pageStart >> 16;
          if (planeSelect && planeSelect.value !== 'all' && parseInt(planeSelect.value, 10) !== planeId) {
            planeSelect.value = planeId;
            populateBlocks(planeId);
          }
          renderGrid();
        };

        if (gridEl) {
          gridEl.addEventListener('click', (e) => {
            const cell = e.target.closest('.tm-unimap-cell');
            if (cell && cell.dataset.cp !== undefined) {
              const cp = parseInt(cell.dataset.cp, 10);
              updateInspector(cp);
            }
          });

          gridEl.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.tm-unimap-cell');
            if (cell && cell.dataset.cp !== undefined) {
              const cp = parseInt(cell.dataset.cp, 10);
              updateInspector(cp);
              if (insertBtn) insertBtn.click();
            }
          });
        }

        // Delegate clicks on jump links in inspector
        const inspPane = document.getElementById('tm-unimap-inspector');
        if (inspPane) {
          inspPane.addEventListener('click', (e) => {
            const link = e.target.closest('.tm-unimap-link[data-jump-cp]');
            if (link && link.dataset.jumpCp) {
              const cp = parseInt(link.dataset.jumpCp, 10);
              jumpToCodePoint(cp);
              this.setStatus(`jumped to U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
            }
          });
        }

        if (fontSelect) {
          fontSelect.addEventListener('change', () => {
            currentFontMode = fontSelect.value;
            if (currentFontMode.startsWith('noto')) {
              ensureNotoSerifCJK();
              const blk = engine.getUnicodeBlock(currentCp);
              if (blk && blk.name) ensureNotoForBlock(blk.name);
            }
            if (gridEl) {
              gridEl.className = `tm-unimap-grid font-${currentFontMode}`;
              gridEl.setAttribute('data-schema', currentSchema);
            }
            if (previewGlyph) {
              previewGlyph.className = `tm-unimap-preview-box font-${currentFontMode}`;
              previewGlyph.setAttribute('data-schema', currentSchema);
            }
            document.querySelectorAll('.tm-unimap-rs-grid').forEach(g => {
              g.className = `tm-unimap-rs-grid font-${currentFontMode}`;
              g.setAttribute('data-schema', currentSchema);
            });
            const deckCharEl = document.getElementById('tm-deck-char');
            if (deckCharEl) {
              deckCharEl.className = `tm-deck-glyph font-${currentFontMode}`;
              deckCharEl.setAttribute('data-schema', currentSchema);
            }
            this.setStatus(`font switched to ${fontSelect.options[fontSelect.selectedIndex].text}`);
          });
        }

        const versionFirstCp = {
          '18.0': 0x0558,
          '17.0': 0x088F,
          '16.0': 0x0897,
          '15.1': 0x2FFC,
          '15.0': 0x0CF3,
          '14.0': 0x061D,
          '13.0': 0x08BE,
          '12.1': 0x32FF,
          '12.0': 0x0C77,
          '11.0': 0x0560,
          '10.0': 0x0860,
          '9.0': 0x08B6,
          '8.0': 0x08B3,
          '7.0': 0x037F,
          '6.3': 0x061C,
          '6.2': 0x20BA,
          '6.1': 0x058F,
          '6.0': 0x0526,
          '5.2': 0x0524,
          '5.1': 0x0370,
          '5.0': 0x0242,
          '4.1': 0x0237,
          '4.0': 0x0221,
          '3.2': 0x0220,
          '3.1': 0x03F4,
          '3.0': 0x01F6,
          '2.1': 0x20AC,
          '2.0': 0x0591,
          '1.1': 0x0000
        };

        if (filterSelect) {
          filterSelect.addEventListener('change', () => {
            currentFilter = filterSelect.value;
            if (currentFilter !== 'all') {
              const target = versionFirstCp[currentFilter];
              if (target !== undefined) {
                jumpToCodePoint(target);
              } else {
                renderGrid();
              }
              this.setStatus(`filtered to unicode ${currentFilter} additions`);
            } else {
              renderGrid();
              this.setStatus('showing all unicode characters');
            }
          });
        }

        if (prevCharBtn) {
          prevCharBtn.addEventListener('click', () => {
            if (currentCp > 0) {
              jumpToCodePoint(currentCp - 1);
            }
          });
        }

        if (nextCharBtn) {
          nextCharBtn.addEventListener('click', () => {
            if (currentCp < 0x10FFFF) {
              jumpToCodePoint(currentCp + 1);
            }
          });
        }

        if (planeSelect) {
          planeSelect.addEventListener('change', () => {
            const val = planeSelect.value;
            populateBlocks(val);
            if (val === 'all') {
              jumpToCodePoint(0x0000);
            } else {
              const planeId = parseInt(val, 10);
              const firstBlock = engine.blocks.find(b => b.plane === planeId);
              if (firstBlock) {
                jumpToCodePoint(firstBlock.start);
              } else {
                jumpToCodePoint(planeId * 0x10000);
              }
            }
          });
        }

        if (blockSelect) {
          blockSelect.addEventListener('change', () => {
            const start = parseInt(blockSelect.value, 10);
            const blk = engine.getUnicodeBlock(start);
            if (planeSelect && planeSelect.value !== 'all') {
              planeSelect.value = blk.plane;
            }
            jumpToCodePoint(start);
          });
        }

        if (prevBlkBtn) {
          prevBlkBtn.addEventListener('click', () => {
            const curBlk = engine.getUnicodeBlock(currentCp);
            let idx = engine.blocks.findIndex(b => b.start === curBlk.start);
            if (idx > 0) {
              const targetBlk = engine.blocks[idx - 1];
              jumpToCodePoint(targetBlk.start);
              this.setStatus(`switched to block: ${targetBlk.name} [${formatBlockRange(targetBlk.start, targetBlk.end)}]`);
            } else {
              this.setStatus(`already at first block (${curBlk.name})`);
            }
          });
        }
        if (nextBlkBtn) {
          nextBlkBtn.addEventListener('click', () => {
            const curBlk = engine.getUnicodeBlock(currentCp);
            let idx = engine.blocks.findIndex(b => b.start === curBlk.start);
            if (idx >= 0 && idx < engine.blocks.length - 1) {
              const targetBlk = engine.blocks[idx + 1];
              jumpToCodePoint(targetBlk.start);
              this.setStatus(`Switched to block: ${targetBlk.name} [${formatBlockRange(targetBlk.start, targetBlk.end)}]`);
            } else {
              this.setStatus(`already at last block (${curBlk.name})`);
            }
          });
        }

        if (prevPageBtn) {
          prevPageBtn.addEventListener('click', () => {
            if (pageStart >= 0x100) {
              jumpToCodePoint(pageStart - 0x100);
              const blk = engine.getUnicodeBlock(currentCp);
              this.setStatus(`page: U+${pageStart.toString(16).toUpperCase().padStart(4, '0')}-U+${Math.min(pageStart + 0xFF, 0x10FFFF).toString(16).toUpperCase().padStart(4, '0')} (${blk.name})`);
            } else {
              this.setStatus('already at the first page (U+0000)');
            }
          });
        }
        if (nextPageBtn) {
          nextPageBtn.addEventListener('click', () => {
            if (pageStart + 0x100 <= 0x10FFFF) {
              jumpToCodePoint(pageStart + 0x100);
              const blk = engine.getUnicodeBlock(currentCp);
              this.setStatus(`Page: U+${pageStart.toString(16).toUpperCase().padStart(4, '0')}-U+${Math.min(pageStart + 0xFF, 0x10FFFF).toString(16).toUpperCase().padStart(4, '0')} (${blk.name})`);
            } else {
              this.setStatus('already at the last page (U+10FF00)');
            }
          });
        }

        const handleGoto = () => {
          if (!gotoInput || !gotoInput.value) return;
          const val = gotoInput.value.trim();
          const hexMatch = val.match(/^(?:u\+|0x)?([0-9a-f]{1,6})$/i);
          if (hexMatch) {
            const cp = parseInt(hexMatch[1], 16);
            if (cp >= 0 && cp <= 0x10FFFF) {
              jumpToCodePoint(cp);
              this.setStatus(`Jumped to U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
              return;
            }
          }
          if (val.length >= 1) {
            const cp = val.codePointAt(0);
            jumpToCodePoint(cp);
            this.setStatus(`jumped to '${val[0]}' (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`);
          }
        };
        if (gotoBtn) gotoBtn.addEventListener('click', handleGoto);
        if (gotoInput) {
          gotoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleGoto();
            }
          });
        }

        if (searchInput && searchResults) {
          searchInput.addEventListener('input', () => {
            const q = searchInput.value.trim();
            if (!q) {
              searchResults.style.display = 'none';
              searchResults.innerHTML = '';
              return;
            }

            const results = engine.searchUnicode(q, 25);
            if (results.length === 0) {
              searchResults.style.display = 'block';
              searchResults.innerHTML = '<span class="c-dim">no matches found</span>';
              return;
            }

            searchResults.style.display = 'block';
            searchResults.innerHTML = results.map(r => `
              <div class="tm-unimap-search-item" data-cp="${r.cp}" style="display:flex; align-items:center; gap:8px; padding:3px 4px; cursor:pointer; border-bottom:1px solid #222;">
                <span class="c-accent" style="font-family:monospace; min-width:65px;">${r.formattedHex}</span>
                <span style="font-size:1.1rem; min-width:24px; text-align:center;">${escapeHTML(r.char || ' ')}</span>
                <span style="color:#ddd; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(r.name)}</span>
                <span class="c-dim" style="font-size:0.7rem;">${escapeHTML(r.block.name)}</span>
                ${r.isNewIn18 ? '<span class="tm-unimap-tag tag-new" style="font-size:0.6rem;">18.0</span>' : ''}
              </div>
            `).join('');
          });

          searchResults.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-unimap-search-item');
            if (item && item.dataset.cp !== undefined) {
              const cp = parseInt(item.dataset.cp, 10);
              jumpToCodePoint(cp);
              searchResults.style.display = 'none';
            }
          });
        }

        if (insertBtn && textarea) {
          insertBtn.addEventListener('click', () => {
            const info = engine.getUnicodeCharInfo(currentCp);
            if (!info.char && info.isControl) {
              this.setStatus(`cannot insert control character (${info.formattedHex})`);
              return;
            }
            const charToInsert = info.char;
            this.saveHistory();

            const startPos = textarea.selectionStart !== undefined ? textarea.selectionStart : textarea.value.length;
            const endPos = textarea.selectionEnd !== undefined ? textarea.selectionEnd : startPos;
            const before = textarea.value.substring(0, startPos);
            const after = textarea.value.substring(endPos);
            textarea.value = before + charToInsert + after;
            textarea.selectionStart = textarea.selectionEnd = startPos + charToInsert.length;
            this.updateLineCounter();
            this.updateStats();
            this.setStatus(`inserted '${charToInsert}' (${info.formattedHex}) into editor`);
            textarea.focus();
          });
        }

        if (copyCharBtn) {
          copyCharBtn.addEventListener('click', () => {
            const info = engine.getUnicodeCharInfo(currentCp);
            if (info.char) {
              navigator.clipboard.writeText(info.char).then(() => {
                this.setStatus(`copied '${info.char}' to clipboard`);
              });
            }
          });
        }

        if (copyCpBtn) {
          copyCpBtn.addEventListener('click', () => {
            const info = engine.getUnicodeCharInfo(currentCp);
            navigator.clipboard.writeText(info.formattedHex).then(() => {
              this.setStatus(`copied ${info.formattedHex} to clipboard`);
            });
          });
        }

        const copyableIds = [
          'tm-unimap-p-utf8', 'tm-unimap-p-utf16', 'tm-unimap-p-utf32', 'tm-unimap-p-htmldec',
          'tm-unimap-p-htmlhex', 'tm-unimap-p-htmlent', 'tm-unimap-p-escape',
          'tm-unimap-p-pyescape', 'tm-unimap-p-cssescape', 'tm-unimap-p-urlenc'
        ];
        copyableIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener('click', () => {
              const textToCopy = el.textContent.trim();
              if (textToCopy && textToCopy !== '-') {
                navigator.clipboard.writeText(textToCopy).then(() => {
                  this.setStatus(`copied ${textToCopy} to clipboard`);
                });
              }
            });
          }
        });

        if (textarea && textarea.selectionStart !== undefined && textarea.selectionEnd > textarea.selectionStart) {
          const selText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
          const cp = selText.codePointAt(0);
          if (cp !== undefined) currentCp = cp;
        }

        const switchTab = (tab) => {
          activeTab = tab;
          if (tab === 'map') {
            if (tabMapBtn) tabMapBtn.classList.add('active');
            if (tabRsBtn) tabRsBtn.classList.remove('active');
            if (toolbarMap) toolbarMap.style.display = 'flex';
            if (toolbarRs) toolbarRs.style.display = 'none';
            if (paneMap) paneMap.style.display = 'flex';
            if (paneRs) paneRs.style.display = 'none';
          } else {
            if (tabMapBtn) tabMapBtn.classList.remove('active');
            if (tabRsBtn) tabRsBtn.classList.add('active');
            if (toolbarMap) toolbarMap.style.display = 'none';
            if (toolbarRs) toolbarRs.style.display = 'flex';
            if (paneMap) paneMap.style.display = 'none';
            if (paneRs) paneRs.style.display = 'flex';
            ensureRSIndexLoadedAndRender(currentRadicalNum);
          }
        };

        if (tabMapBtn) tabMapBtn.addEventListener('click', () => switchTab('map'));
        if (tabRsBtn) tabRsBtn.addEventListener('click', () => switchTab('rsindex'));

        const updateStrokeSelect = (rad) => {
          if (!strokeSelect) return;
          strokeSelect.innerHTML = `<option value="all">All strokes (${rad.groups.length} groups)</option>` +
            rad.groups.map(g => `<option value="${g.s}">${g.s} strokes (${g.cps.length})</option>`).join('');
        };

        const renderRadical = (radNum, targetCpToScroll) => {
          if (!rsData || !rsContainer) return;
          const rad = rsData.find(r => r.num === radNum) || rsData[0];
          currentRadicalNum = rad.num;
          if (radSelect && radSelect.value !== String(rad.num)) {
            radSelect.value = String(rad.num);
          }
          if (rsInfoLbl) rsInfoLbl.textContent = `Radical #${rad.num} (${rad.name}) ${rad.char}`;
          if (rsTotalLbl) rsTotalLbl.textContent = `${rad.total} characters in ${rad.groups.length} stroke groups`;
          updateStrokeSelect(rad);

          let html = '';
          rad.groups.forEach(group => {
            html += `<div class="tm-unimap-rs-section" id="tm-unimap-rs-sec-${group.s}" data-stroke="${group.s}">
              <div class="tm-unimap-rs-header">
                <span>Radical #${rad.num} (${escapeHTML(rad.name)}) ${escapeHTML(rad.char)} / ${group.s} residual strokes</span>
                <span class="tm-unimap-rs-count">${group.cps.length}</span>
              </div>
              <div class="tm-unimap-rs-grid font-${currentFontMode}" data-schema="${currentSchema}">`;
            group.cps.forEach(cp => {
              let ch = '';
              try { ch = String.fromCodePoint(cp); } catch (e) { }
              const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
              const isActive = (cp === currentCp);
              html += `<div class="tm-unimap-rs-cell${isActive ? ' active' : ''}" data-cp="${cp}" title="${hex}: ${escapeHTML(ch)}">${escapeHTML(ch)}</div>`;
            });
            html += `</div></div>`;
          });

          rsContainer.innerHTML = html;

          if (targetCpToScroll) {
            setTimeout(() => {
              const activeEl = rsContainer.querySelector(`.tm-unimap-rs-cell[data-cp="${targetCpToScroll}"]`);
              if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 50);
          }
        };

        const updatePedGroupSelect = (schemaId) => {
          if (!pedSelect || !pedData || !pedData.schemas || !pedData.schemas[schemaId]) return;
          const schemaObj = pedData.schemas[schemaId];
          const keys = Object.keys(schemaObj);
          pedSelect.innerHTML = keys.map(k => {
            const count = schemaObj[k].length;
            let label = k;
            if (schemaId === 'hsk') label = `Band ${k}`;
            return `<option value="${k}">${label} (${count} characters)</option>`;
          }).join('');
        };

        const updateStudyProgress = (cps) => {
          if (!studyProgressBox || !progressStatsEl || !progressFillEl || !cps) return;
          const total = cps.length;
          if (total === 0) return;
          let learned = 0;
          let mastered = 0;
          let starred = 0;
          const store = loadMasteryStore();
          cps.forEach(cp => {
            const m = store[cp];
            if (m) {
              if (m.status && m.status !== 'unlearned') learned++;
              if (m.status === 'mastered') mastered++;
              if (m.starred) starred++;
            }
          });
          const pct = Math.round((learned / total) * 100);
          progressStatsEl.textContent = `${learned} / ${total} learned (${pct}%)`;
          if (progressSubstatsEl) progressSubstatsEl.textContent = `${mastered} mastered · ${starred} starred`;
          progressFillEl.style.width = `${pct}%`;
        };

        const applyMasteryDecorations = () => {
          if (!rsContainer) return;
          const cells = rsContainer.querySelectorAll('.tm-unimap-rs-cell');
          cells.forEach(cell => {
            const cp = parseInt(cell.dataset.cp, 10);
            const m = getCharMastery(cp);
            cell.classList.remove('is-mastered', 'is-review', 'is-learning', 'is-starred');
            if (m.status === 'mastered') cell.classList.add('is-mastered');
            else if (m.status === 'review') cell.classList.add('is-review');
            else if (m.status === 'learning') cell.classList.add('is-learning');
            if (m.starred) cell.classList.add('is-starred');

            if (currentMasteryFilter === 'all') {
              cell.style.display = '';
            } else if (currentMasteryFilter === 'unlearned') {
              cell.style.display = (!m.status || m.status === 'unlearned') ? '' : 'none';
            } else if (currentMasteryFilter === 'learning') {
              cell.style.display = m.status === 'learning' ? '' : 'none';
            } else if (currentMasteryFilter === 'review') {
              cell.style.display = m.status === 'review' ? '' : 'none';
            } else if (currentMasteryFilter === 'mastered') {
              cell.style.display = m.status === 'mastered' ? '' : 'none';
            } else if (currentMasteryFilter === 'starred') {
              cell.style.display = m.starred ? '' : 'none';
            }
          });
        };

        const renderDeckCard = () => {
          if (!deckCardCounter || !deckChar || !deckHint) return;
          if (deckCards.length === 0) {
            deckCardCounter.textContent = 'card 0 of 0';
            deckChar.textContent = '-';
            deckHint.textContent = 'no cards match current filter in this tier';
            if (deckFront) deckFront.style.display = 'flex';
            if (deckBack) deckBack.style.display = 'none';
            return;
          }
          if (deckIndex < 0) deckIndex = 0;
          if (deckIndex >= deckCards.length) deckIndex = deckCards.length - 1;

          const cp = deckCards[deckIndex];
          const charStr = String.fromCodePoint(cp);
          const pInfo = engine.getPedagogicalInfo(cp);
          const m = getCharMastery(cp);

          deckCardCounter.textContent = `card ${deckIndex + 1} of ${deckCards.length} [${m.status}]`;
          if (deckStarBtn) {
            deckStarBtn.textContent = m.starred ? 'starred' : 'star';
            if (m.starred) deckStarBtn.classList.add('c-accent');
            else deckStarBtn.classList.remove('c-accent');
          }

          deckChar.textContent = charStr;
          deckChar.className = `tm-deck-glyph font-${currentFontMode}`;
          deckChar.setAttribute('data-schema', currentSchema);
          deckHint.textContent = `${pInfo?.ids ? 'IDS: ' + pInfo.ids : '-'} · ${pInfo?.hsk ? 'HSK ' + pInfo.hsk : (pInfo?.jlpt || '')}`;

          if (deckFront) deckFront.style.display = 'flex';
          if (deckBack) deckBack.style.display = 'none';
          deckFlipped = false;

          if (deckPinyin) deckPinyin.textContent = pInfo?.pinyin || '-';
          if (deckDef) deckDef.textContent = pInfo?.definition || '-';
          if (deckKanji) {
            if (pInfo?.kanji && (pInfo.kanji.on || pInfo.kanji.kun || pInfo.kanji.m)) {
              deckKanji.style.display = 'block';
              const onkun = [pInfo.kanji.on, pInfo.kanji.kun].filter(Boolean).join(' / ');
              deckKanji.textContent = `[${onkun}] ${pInfo.kanji.m || ''}`;
            } else {
              deckKanji.style.display = 'none';
            }
          }

          if (deckCompounds) {
            if (pInfo?.words && pInfo.words.length > 0) {
              deckCompounds.innerHTML = pInfo.words.slice(0, 3).map(w => {
                const reading = w.p ? `/ ${escapeHTML(w.p)}` : (w.r ? `/ ${escapeHTML(w.r)}` : '');
                return `<div class="tm-deck-compound-item">
                  <span><strong class="c-accent">${escapeHTML(w.w)}</strong> <span class="tm-deck-compound-read" style="color:#888;">${reading}</span></span>
                  <span class="tm-deck-compound-mean" style="color:#ddd;">${escapeHTML(w.m || '')}</span>
                </div>`;
              }).join('');
            } else {
              deckCompounds.innerHTML = '';
            }
          }

          if (deckAudioBtn) {
            deckAudioBtn.onclick = () => speakText(charStr);
          }
        };

        const initDeckForTier = (cps) => {
          if (!cps) return;
          const store = loadMasteryStore();
          if (currentMasteryFilter === 'all') {
            deckCards = [...cps];
          } else if (currentMasteryFilter === 'unlearned') {
            deckCards = cps.filter(cp => !store[cp] || store[cp].status === 'unlearned');
          } else if (currentMasteryFilter === 'learning') {
            deckCards = cps.filter(cp => store[cp] && store[cp].status === 'learning');
          } else if (currentMasteryFilter === 'review') {
            deckCards = cps.filter(cp => store[cp] && store[cp].status === 'review');
          } else if (currentMasteryFilter === 'mastered') {
            deckCards = cps.filter(cp => store[cp] && store[cp].status === 'mastered');
          } else if (currentMasteryFilter === 'starred') {
            deckCards = cps.filter(cp => store[cp] && store[cp].starred);
          }
          deckIndex = 0;
          renderDeckCard();
        };

        const renderVocabList = () => {
          if (!vocabListScroll || !pedData) return;
          let words = [];
          if (pedData.tierVocab && pedData.tierVocab[currentSchema] && pedData.tierVocab[currentSchema][currentPedTier]) {
            words = pedData.tierVocab[currentSchema][currentPedTier];
          } else if (pedData.schemas && pedData.schemas[currentSchema]) {
            const cps = pedData.schemas[currentSchema][currentPedTier] || [];
            const seen = new Set();
            cps.forEach(cp => {
              const rec = pedData.characters[cp];
              if (rec && rec.words) {
                rec.words.forEach(w => {
                  if (!seen.has(w.w)) {
                    seen.add(w.w);
                    words.push(w);
                  }
                });
              }
            });
          }

          const q = (vocabFilterInput ? vocabFilterInput.value.trim().toLowerCase() : '');
          const filtered = q ? words.filter(w => {
            return w.w.toLowerCase().includes(q) ||
              (w.p && w.p.toLowerCase().includes(q)) ||
              (w.r && w.r.toLowerCase().includes(q)) ||
              (w.m && w.m.toLowerCase().includes(q));
          }) : words;

          if (vocabCountLbl) {
            vocabCountLbl.textContent = `${filtered.length} words in ${currentSchema.toUpperCase()} ${currentPedTier} (${words.length} total)`;
          }

          let html = '';
          filtered.forEach(w => {
            const chars = Array.from(w.w);
            const linkedChars = chars.map(c => {
              const cp = c.codePointAt(0);
              return `<span class="tm-unimap-vocab-char-link" data-jump-cp="${cp}" title="Inspect '${c}'">${escapeHTML(c)}</span>`;
            }).join('');
            const reading = w.p ? `/ ${escapeHTML(w.p)}` : (w.r ? `/ ${escapeHTML(w.r)}` : '');
            html += `<div class="tm-vocab-row">
              <div>
                <div>
                  <span class="tm-vocab-term c-accent">${linkedChars}</span>
                  <span class="tm-vocab-read">${reading}</span>
                  <button type="button" class="tm-btn" style="padding:0 5px; font-size:0.68rem; margin-left:6px;" data-speak="${escapeHTML(w.w)}">audio</button>
                </div>
                <div class="tm-vocab-meaning">${escapeHTML(w.m || '')}</div>
              </div>
              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
                <span class="tm-unimap-ped-badge ${w.lvl && w.lvl.startsWith('HSK') ? 'badge-hsk' : 'badge-jlpt'}">${escapeHTML(w.lvl || '')}</span>
              </div>
            </div>`;
          });

          vocabListScroll.innerHTML = html || '<div style="color:#777; padding:20px; text-align:center;">no vocabulary matching filter</div>';
        };

        const exportDeckTSV = () => {
          if (!pedData) return;
          const cps = (pedData.schemas[currentSchema] && pedData.schemas[currentSchema][currentPedTier]) || [];
          let words = [];
          if (pedData.tierVocab && pedData.tierVocab[currentSchema] && pedData.tierVocab[currentSchema][currentPedTier]) {
            words = pedData.tierVocab[currentSchema][currentPedTier];
          }

          let tsv = '#separator:tab\n#html:true\n#tags column:5\n';
          tsv += 'Expression\tReading\tDefinition\tDetails\tTags\n';
          const tag = `${currentSchema}_${currentPedTier}`.replace(/\s+/g, '_');

          // Characters
          cps.forEach(cp => {
            const rec = pedData.characters[cp];
            if (rec) {
              const reading = rec.pinyin || (rec.kanji ? [rec.kanji.on, rec.kanji.kun].filter(Boolean).join(' / ') : '');
              const def = rec.definition || (rec.kanji ? rec.kanji.m : '');
              const details = `IDS: ${rec.ids || '-'}; Strokes: ${rec.hsk || ''}`;
              tsv += `${rec.char}\t${reading}\t${def}\t${details}\t${tag}\n`;
            }
          });

          // Words
          words.forEach(w => {
            const reading = w.p || w.r || '';
            const def = w.m || '';
            tsv += `${w.w}\t${reading}\t${def}\tCompound Vocabulary\t${tag}\n`;
          });

          const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${tag}_Deck.tsv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.setStatus(`exported ${cps.length + words.length} cards to ${tag}_deck.tsv`);
        };

        const switchViewMode = (mode) => {
          currentViewMode = mode;
          if (modeGridBtn) modeGridBtn.classList.toggle('active', mode === 'grid');
          if (modeDeckBtn) modeDeckBtn.classList.toggle('active', mode === 'deck');
          if (modeVocabBtn) modeVocabBtn.classList.toggle('active', mode === 'vocab');

          if (rsContainer) rsContainer.style.display = mode === 'grid' ? '' : 'none';
          if (deckPane) deckPane.style.display = mode === 'deck' ? '' : 'none';
          if (vocabPane) vocabPane.style.display = mode === 'vocab' ? '' : 'none';

          if (pedData && pedData.schemas && pedData.schemas[currentSchema]) {
            const cps = pedData.schemas[currentSchema][currentPedTier] || [];
            if (mode === 'deck') {
              initDeckForTier(cps);
            } else if (mode === 'vocab') {
              renderVocabList();
            } else {
              applyMasteryDecorations();
            }
          }
        };

        const renderPedagogicalGroup = (schemaId, tierKey, targetCpToScroll) => {
          if (!pedData || !rsContainer) return;
          const schemaObj = pedData.schemas[schemaId];
          if (!schemaObj) return;
          const cps = schemaObj[tierKey] || schemaObj[Object.keys(schemaObj)[0]] || [];
          currentPedTier = tierKey;

          if (pedSelect && pedSelect.value !== tierKey) {
            pedSelect.value = tierKey;
          }

          const schemaTitles = {
            hsk: 'HSK 3.0 Curriculum',
            tocfl: 'TOCFL (Taiwan) Proficiency',
            joyo: 'MEXT Jōyō Kanji Grade',
            jlpt: 'JLPT Japanese Proficiency',
            zipf: 'SUBTLEX Spoken Frequency'
          };
          const title = schemaTitles[schemaId] || schemaId.toUpperCase();
          if (rsInfoLbl) rsInfoLbl.textContent = `${title} — ${tierKey}`;
          if (rsTotalLbl) rsTotalLbl.textContent = `${cps.length} characters in benchmark tier`;

          let html = `<div class="tm-unimap-rs-section">
            <div class="tm-unimap-rs-header">
              <span>${escapeHTML(title)} / ${escapeHTML(tierKey)}</span>
              <span class="tm-unimap-rs-count">${cps.length}</span>
            </div>
            <div class="tm-unimap-rs-grid font-${currentFontMode}" data-schema="${schemaId || currentSchema}">`;

          cps.forEach(cp => {
            let ch = '';
            try { ch = String.fromCodePoint(cp); } catch (e) { }
            const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
            const isActive = (cp === currentCp);
            html += `<div class="tm-unimap-rs-cell${isActive ? ' active' : ''}" data-cp="${cp}" title="${hex}: ${escapeHTML(ch)}">${escapeHTML(ch)}</div>`;
          });
          html += `</div></div>`;

          rsContainer.innerHTML = html;
          updateStudyProgress(cps);
          applyMasteryDecorations();

          if (currentViewMode === 'deck') {
            initDeckForTier(cps);
          } else if (currentViewMode === 'vocab') {
            renderVocabList();
          }

          if (targetCpToScroll) {
            setTimeout(() => {
              const activeEl = rsContainer.querySelector(`.tm-unimap-rs-cell[data-cp="${targetCpToScroll}"]`);
              if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 50);
          }
        };

        const ensurePedagogyLoadedAndRender = (schemaId, tierKey, targetCp) => {
          if (pedData) {
            updatePedGroupSelect(schemaId);
            const activeTier = tierKey || (pedData.schemas[schemaId] ? Object.keys(pedData.schemas[schemaId])[0] : '1');
            renderPedagogicalGroup(schemaId, activeTier, targetCp);
            return Promise.resolve(pedData);
          }
          if (rsContainer) rsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">Loading Pedagogical CJK Dataset...</div>';
          return engine.ensurePedagogy().then(data => {
            pedData = data;
            updatePedGroupSelect(schemaId);
            const activeTier = tierKey || (pedData.schemas[schemaId] ? Object.keys(pedData.schemas[schemaId])[0] : '1');
            renderPedagogicalGroup(schemaId, activeTier, targetCp);
            return pedData;
          }).catch(err => {
            if (rsContainer) rsContainer.innerHTML = `<div style="padding:20px; color:#ff5555;">Failed to load pedagogy: ${escapeHTML(err.message)}</div>`;
          });
        };

        const ensureRSIndexLoadedAndRender = (targetRadNum, targetCp) => {
          if (rsData) {
            if (radSelect && radSelect.children.length === 0) {
              radSelect.innerHTML = rsData.map(r =>
                `<option value="${r.num}">Radical #${r.num} (${escapeHTML(r.name)}) ${escapeHTML(r.char)} — ${r.total} chars</option>`
              ).join('');
            }
            renderRadical(targetRadNum || currentRadicalNum, targetCp);
            return Promise.resolve(rsData);
          }
          if (rsContainer) rsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">Loading Radical-Stroke Index (102,999 CJK characters)...</div>';
          return engine.ensureRSIndex().then(data => {
            rsData = data;
            if (radSelect) {
              radSelect.innerHTML = rsData.map(r =>
                `<option value="${r.num}">Radical #${r.num} (${escapeHTML(r.name)}) ${escapeHTML(r.char)} — ${r.total} chars</option>`
              ).join('');
            }
            renderRadical(targetRadNum || currentRadicalNum, targetCp);
            return rsData;
          }).catch(err => {
            if (rsContainer) rsContainer.innerHTML = `<div style="padding:20px; color:#ff5555;">Failed to load RSIndex: ${escapeHTML(err.message)}</div>`;
          });
        };

        if (modeGridBtn) modeGridBtn.addEventListener('click', () => switchViewMode('grid'));
        if (modeDeckBtn) modeDeckBtn.addEventListener('click', () => switchViewMode('deck'));
        if (modeVocabBtn) modeVocabBtn.addEventListener('click', () => switchViewMode('vocab'));

        if (masteryFilterSelect) {
          masteryFilterSelect.addEventListener('change', () => {
            currentMasteryFilter = masteryFilterSelect.value;
            if (currentViewMode === 'grid') {
              applyMasteryDecorations();
            } else if (currentViewMode === 'deck') {
              const cps = (pedData && pedData.schemas[currentSchema] && pedData.schemas[currentSchema][currentPedTier]) || [];
              initDeckForTier(cps);
            }
          });
        }

        if (exportAnkiBtn) {
          exportAnkiBtn.addEventListener('click', exportDeckTSV);
        }

        if (deckRevealBtn) {
          deckRevealBtn.addEventListener('click', () => {
            if (deckBack) deckBack.style.display = 'flex';
            deckFlipped = true;
          });
        }

        const handleDeckGrade = (grade) => {
          if (deckCards.length === 0) return;
          const cp = deckCards[deckIndex];
          updateCharMastery(cp, grade);
          updateStudyProgress(deckCards);
          applyMasteryDecorations();
          if (deckIndex < deckCards.length - 1) {
            deckIndex++;
            renderDeckCard();
          } else {
            this.setStatus(`finished all cards in ${currentSchema.toUpperCase()} ${currentPedTier}`);
            renderDeckCard();
          }
        };

        if (deckGradeAgain) deckGradeAgain.addEventListener('click', () => handleDeckGrade('again'));
        if (deckGradeHard) deckGradeHard.addEventListener('click', () => handleDeckGrade('hard'));
        if (deckGradeGood) deckGradeGood.addEventListener('click', () => handleDeckGrade('good'));
        if (deckGradeEasy) deckGradeEasy.addEventListener('click', () => handleDeckGrade('easy'));

        if (deckPrevBtn) {
          deckPrevBtn.addEventListener('click', () => {
            if (deckIndex > 0) {
              deckIndex--;
              renderDeckCard();
            }
          });
        }

        if (deckNextBtn) {
          deckNextBtn.addEventListener('click', () => {
            if (deckIndex < deckCards.length - 1) {
              deckIndex++;
              renderDeckCard();
            }
          });
        }

        if (deckStarBtn) {
          deckStarBtn.addEventListener('click', () => {
            if (deckCards.length === 0) return;
            const cp = deckCards[deckIndex];
            const isStar = toggleCharStar(cp);
            deckStarBtn.textContent = isStar ? 'starred' : 'star';
            if (isStar) deckStarBtn.classList.add('c-accent');
            else deckStarBtn.classList.remove('c-accent');
            updateStudyProgress(deckCards);
            applyMasteryDecorations();
          });
        }

        if (deckShuffleBtn) {
          deckShuffleBtn.addEventListener('click', () => {
            for (let i = deckCards.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [deckCards[i], deckCards[j]] = [deckCards[j], deckCards[i]];
            }
            deckIndex = 0;
            renderDeckCard();
            this.setStatus('shuffled study deck');
          });
        }

        if (deckResetBtn) {
          deckResetBtn.addEventListener('click', () => {
            const store = loadMasteryStore();
            deckCards.forEach(cp => delete store[cp]);
            saveMasteryStore(store);
            updateStudyProgress(deckCards);
            applyMasteryDecorations();
            renderDeckCard();
            this.setStatus('reset mastery for cards in this tier');
          });
        }

        if (vocabFilterInput) {
          vocabFilterInput.addEventListener('input', () => {
            renderVocabList();
          });
        }

        if (vocabPane) {
          vocabPane.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-speak]');
            if (btn) {
              speakText(btn.dataset.speak);
              return;
            }
            const link = e.target.closest('.tm-unimap-vocab-char-link');
            if (link && link.dataset.jumpCp) {
              const cp = parseInt(link.dataset.jumpCp, 10);
              currentCp = cp;
              updateInspector(cp);
            }
          });
        }

        // Keyboard shortcuts for Study Deck
        window.addEventListener('keydown', (e) => {
          if (activeTab !== 'rsindex' || currentViewMode !== 'deck') return;
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

          if (e.key === ' ') {
            e.preventDefault();
            if (!deckFlipped) {
              if (deckBack) deckBack.style.display = 'flex';
              deckFlipped = true;
            }
          } else if (deckFlipped) {
            if (e.key === '1') { e.preventDefault(); handleDeckGrade('again'); }
            else if (e.key === '2') { e.preventDefault(); handleDeckGrade('hard'); }
            else if (e.key === '3') { e.preventDefault(); handleDeckGrade('good'); }
            else if (e.key === '4') { e.preventDefault(); handleDeckGrade('easy'); }
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (deckIndex > 0) { deckIndex--; renderDeckCard(); }
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (deckIndex < deckCards.length - 1) { deckIndex++; renderDeckCard(); }
          } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            if (deckStarBtn) deckStarBtn.click();
          }
        });

        if (schemaSelect) {
          schemaSelect.addEventListener('change', () => {
            currentSchema = schemaSelect.value;
            if (previewGlyph) previewGlyph.setAttribute('data-schema', currentSchema);
            if (gridEl) gridEl.setAttribute('data-schema', currentSchema);
            document.querySelectorAll('.tm-unimap-rs-grid').forEach(g => {
              g.setAttribute('data-schema', currentSchema);
            });
            const deckCharEl = document.getElementById('tm-deck-char');
            if (deckCharEl) deckCharEl.setAttribute('data-schema', currentSchema);
            if (currentSchema === 'kangxi') {
              if (kangxiControls) kangxiControls.style.display = '';
              if (pedControls) pedControls.style.display = 'none';
              if (studyModesBox) studyModesBox.style.display = 'none';
              if (studyProgressBox) studyProgressBox.style.display = 'none';
              switchViewMode('grid');
              ensureRSIndexLoadedAndRender(currentRadicalNum, currentCp);
            } else {
              if (kangxiControls) kangxiControls.style.display = 'none';
              if (pedControls) pedControls.style.display = '';
              if (studyModesBox) studyModesBox.style.display = 'flex';
              if (studyProgressBox) studyProgressBox.style.display = 'block';
              ensurePedagogyLoadedAndRender(currentSchema, null, currentCp);
            }
          });
        }

        if (pedSelect) {
          pedSelect.addEventListener('change', () => {
            renderPedagogicalGroup(currentSchema, pedSelect.value);
          });
        }

        if (prevPedBtn) {
          prevPedBtn.addEventListener('click', () => {
            if (!pedSelect || pedSelect.selectedIndex <= 0) return;
            pedSelect.selectedIndex--;
            renderPedagogicalGroup(currentSchema, pedSelect.value);
          });
        }

        if (nextPedBtn) {
          nextPedBtn.addEventListener('click', () => {
            if (!pedSelect || pedSelect.selectedIndex >= pedSelect.options.length - 1) return;
            pedSelect.selectedIndex++;
            renderPedagogicalGroup(currentSchema, pedSelect.value);
          });
        }

        if (radSelect) {
          radSelect.addEventListener('change', () => {
            const num = parseInt(radSelect.value, 10);
            renderRadical(num);
          });
        }

        if (prevRadBtn) {
          prevRadBtn.addEventListener('click', () => {
            if (currentRadicalNum > 1) {
              renderRadical(currentRadicalNum - 1);
            }
          });
        }

        if (nextRadBtn) {
          nextRadBtn.addEventListener('click', () => {
            if (currentRadicalNum < 214) {
              renderRadical(currentRadicalNum + 1);
            }
          });
        }

        if (strokeSelect) {
          strokeSelect.addEventListener('change', () => {
            const sVal = strokeSelect.value;
            if (sVal === 'all') {
              if (rsContainer) rsContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const sec = document.getElementById(`tm-unimap-rs-sec-${sVal}`);
              if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }

        if (rsContainer) {
          rsContainer.addEventListener('click', (e) => {
            const cell = e.target.closest('.tm-unimap-rs-cell');
            if (cell && cell.dataset.cp) {
              const cp = parseInt(cell.dataset.cp, 10);
              updateInspector(cp);
              rsContainer.querySelectorAll('.tm-unimap-rs-cell.active').forEach(c => c.classList.remove('active'));
              cell.classList.add('active');
            }
          });

          rsContainer.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.tm-unimap-rs-cell');
            if (cell && cell.dataset.cp) {
              const cp = parseInt(cell.dataset.cp, 10);
              updateInspector(cp);
              if (insertBtn) insertBtn.click();
            }
          });
        }

        if (decompCloseBtn && wordDecompBox) {
          decompCloseBtn.addEventListener('click', () => {
            wordDecompBox.style.display = 'none';
          });
        }

        const handleFindCJK = () => {
          if (!rsFindInput || !rsFindInput.value.trim()) return;
          const val = rsFindInput.value.trim();

          // Check if multi-character word (e.g. 学习 or 电话)
          const chars = Array.from(val);
          const isMultiWord = chars.length > 1 && chars.every(c => {
            const code = c.codePointAt(0);
            return (code >= 0x3400 && code <= 0x4DBF) || (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x20000 && code <= 0x3347F);
          });

          if (isMultiWord) {
            const decomposed = engine.decomposeWord(val);
            if (wordDecompBox && decompWordLbl && decompChipsBox) {
              decompWordLbl.textContent = val;
              let chipsHtml = '';
              decomposed.forEach(d => {
                const hsk = d.pedagogy?.hsk ? `HSK ${d.pedagogy.hsk}` : '';
                const jlpt = d.pedagogy?.jlpt ? `JLPT ${d.pedagogy.jlpt}` : '';
                const joyo = d.pedagogy?.joyo ? (d.pedagogy.joyo === 8 ? 'Jōyō Sec' : `Grade ${d.pedagogy.joyo}`) : '';
                const tags = [hsk, jlpt, joyo].filter(Boolean).join(', ');
                chipsHtml += `<button type="button" class="tm-unimap-ids-chip" data-jump-cp="${d.cp}" style="padding:4px 10px; font-size:0.85rem;" title="Inspect ${d.char} (${d.hex})">
                  <span style="font-weight:bold; font-size:1.1rem; color:var(--accent-color);">${d.char}</span>
                  ${tags ? `<span style="font-size:0.7rem; color:#888; margin-left:6px;">[${tags}]</span>` : ''}
                </button>`;
              });
              decompChipsBox.innerHTML = chipsHtml;
              wordDecompBox.style.display = '';
            }
            // Focus first character
            const firstCp = decomposed[0].cp;
            currentCp = firstCp;
            updateInspector(firstCp);
            this.setStatus(`decomposed word '${val}' into ${decomposed.length} characters`);
            return;
          }

          let targetCp = null;
          const hexM = val.match(/^(?:u\+|0x)?([0-9a-f]{4,6})$/i);
          if (hexM) {
            targetCp = parseInt(hexM[1], 16);
          } else if (val.length >= 1) {
            targetCp = val.codePointAt(0);
          }
          if (targetCp === null || isNaN(targetCp)) return;

          currentCp = targetCp;
          updateInspector(targetCp);

          if (currentSchema === 'kangxi') {
            const info = engine.findRadicalForCodePoint(targetCp);
            if (info) {
              ensureRSIndexLoadedAndRender(info.rad, targetCp);
              this.setStatus(`Found '${String.fromCodePoint(targetCp)}': Radical #${info.rad} (${info.radName}) ${info.radChar}, ${info.s} residual strokes`);
            } else {
              this.setStatus(`character U+${targetCp.toString(16).toUpperCase()} not found in kangxi radical-stroke index`);
            }
          } else {
            // Find which tier in currentSchema contains targetCp
            if (pedData && pedData.schemas && pedData.schemas[currentSchema]) {
              const schemaObj = pedData.schemas[currentSchema];
              let foundTier = null;
              for (const [tKey, list] of Object.entries(schemaObj)) {
                if (list.includes(targetCp)) {
                  foundTier = tKey;
                  break;
                }
              }
              if (foundTier) {
                renderPedagogicalGroup(currentSchema, foundTier, targetCp);
                this.setStatus(`found '${String.fromCodePoint(targetCp)}' in ${currentSchema.toUpperCase()} ${foundTier}`);
              } else {
                this.setStatus(`'${String.fromCodePoint(targetCp)}' not ranked in ${currentSchema.toUpperCase()}`);
              }
            }
          }
        };

        if (rsFindBtn) rsFindBtn.addEventListener('click', handleFindCJK);
        if (rsFindInput) {
          rsFindInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleFindCJK();
            }
          });
        }

        if (rsJumpBtn) {
          rsJumpBtn.addEventListener('click', () => {
            const info = engine.findRadicalForCodePoint(currentCp);
            if (info) {
              switchTab('rsindex');
              if (schemaSelect) schemaSelect.value = 'kangxi';
              currentSchema = 'kangxi';
              if (kangxiControls) kangxiControls.style.display = '';
              if (pedControls) pedControls.style.display = 'none';
              ensureRSIndexLoadedAndRender(info.rad, currentCp);
              this.setStatus(`switched to RSIndex for radical #${info.rad} (${info.radName}) ${info.radChar}`);
            } else {
              switchTab('rsindex');
              ensureRSIndexLoadedAndRender(1, currentCp);
            }
          });
        }

        if (pedJumpBtn) {
          pedJumpBtn.addEventListener('click', () => {
            switchTab('rsindex');
            // Check pedagogical info for current character
            const pInfo = engine.getPedagogicalInfo(currentCp);
            if (pInfo && pInfo.hsk) {
              currentSchema = 'hsk';
              if (schemaSelect) schemaSelect.value = 'hsk';
              if (kangxiControls) kangxiControls.style.display = 'none';
              if (pedControls) pedControls.style.display = '';
              ensurePedagogyLoadedAndRender('hsk', String(pInfo.hsk), currentCp);
            } else if (pInfo && pInfo.jlpt) {
              currentSchema = 'jlpt';
              if (schemaSelect) schemaSelect.value = 'jlpt';
              if (kangxiControls) kangxiControls.style.display = 'none';
              if (pedControls) pedControls.style.display = '';
              ensurePedagogyLoadedAndRender('jlpt', pInfo.jlpt, currentCp);
            } else {
              const info = engine.findRadicalForCodePoint(currentCp);
              ensureRSIndexLoadedAndRender(info ? info.rad : 1, currentCp);
            }
          });
        }

        jumpToCodePoint(currentCp);

        if (engine.ensureUnihan && !engine.unihanBmpCache) {
          engine.ensureUnihan(0x4E00);
        }

        if (engine.loadUnicodeData && !engine.unicodeDataLoaded) {
          engine.loadUnicodeData().then(() => {
            if (this.activeToolId === 'unicodemap') {
              updateInspector(currentCp);
              this.setStatus(`unicode 18.0.0 database loaded (${engine.unicodeDatabase.size} characters indexed)`);
            }
          });
        }

        window.addEventListener('unicodedata-loaded', () => {
          if (this.activeToolId === 'unicodemap') {
            updateInspector(currentCp);
          }
        }, { once: true });
      }
    },

    runActiveTool() {
      const textarea = document.getElementById('tm-textarea');
      if (!textarea || !window.TextEngine) return;
      const text = textarea.value;
      this.saveHistory();

      try {
        switch (this.activeToolId) {
          case 'invoice':
          case 'receipt':
          case 'inv': {
            if (window.InvoiceGenerator) {
              window.InvoiceGenerator.downloadPdf();
              this.setStatus('generating vector PDF');
            }
            break;
          }
          case 'prescription':
          case 'rx':
          case 'pad':
          case 'clinical': {
            if (window.PrescriptionGenerator) {
              window.PrescriptionGenerator.downloadPdf();
              this.setStatus('generating vector PDF');
            }
            break;
          }
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
            this.setStatus(`count: ${stats.characters} chars, ${stats.words} words, ${stats.sentences} sentences, ${stats.lines} lines`);
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
            const charset = document.getElementById('tm-url-charset')?.value || 'UTF-8';
            try {
              if (mode === 'encode') {
                textarea.value = window.TextEngine.urlEncode(text, { encoding: charset });
                this.setStatus(`URL encoded (${charset})`);
              } else {
                textarea.value = window.TextEngine.urlDecode(text, { encoding: charset });
                this.setStatus(`URL decoded (${charset})`);
              }
            } catch (err) {
              this.setStatus(`URL error: ${err.message}`);
            }
            break;
          }
          case 'base64': {
            const mode = document.querySelector('input[name="tm-b64-mode"]:checked')?.value || 'encode';
            const charset = document.getElementById('tm-b64-charset')?.value || 'UTF-8';
            try {
              if (mode === 'encode') {
                textarea.value = window.TextEngine.base64Encode(text, { encoding: charset });
                this.setStatus(`base64 encoded (${charset})`);
              } else {
                textarea.value = window.TextEngine.base64Decode(text, { encoding: charset });
                this.setStatus(`base64 decoded (${charset})`);
              }
            } catch (err) {
              this.setStatus(`base64 error: ${err.message}`);
            }
            break;
          }
          case 'iconv': {
            const act = document.querySelector('input[name="tm-iconv-act"]:checked')?.value || 'detect';
            if (act === 'detect') {
              try {
                const detected = window.TextEngine.detectEncoding(text);
                this.setStatus(`detected encoding: ${detected}`);
                textarea.value = `=== character encoding detection ===\ndetected encoding: ${detected}\n\n=== text content ===\n` + text;
              } catch (err) {
                this.setStatus(`detection error: ${err.message}`);
              }
            } else {
              const to = document.getElementById('tm-iconv-to')?.value || 'UTF-8';
              const from = document.getElementById('tm-iconv-from')?.value || 'AUTO';
              const format = document.getElementById('tm-iconv-fmt')?.value || 'string';
              try {
                textarea.value = window.TextEngine.convertEncoding(text, to, from, { format });
                this.setStatus(`converted encoding ${from} -> ${to} (${format})`);
              } catch (err) {
                this.setStatus(`conversion error: ${err.message}`);
              }
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
          case 'diff': {
            const text2Input = document.getElementById('tm-diff2-val')?.value || '';
            const mode = document.getElementById('tm-diff-mode')?.value || 'line';
            const ignoreWhitespace = !!document.getElementById('tm-diff-ignore-ws')?.checked;
            const ignoreCase = !!document.getElementById('tm-diff-ignore-case')?.checked;

            const res = window.TextEngine.diffText(text, text2Input, { mode, ignoreWhitespace, ignoreCase });
            if (res.identical) {
              this.setStatus('texts are identical (0 differences)');
            } else {
              this.setStatus(`diff: +${res.added} added, -${res.removed} removed`);
            }
            textarea.value = res.textReport;
            break;
          }
          case 'mapdiff': {
            const map2Input = document.getElementById('tm-map2-val')?.value || '';
            const diff = window.TextEngine.diffMaps(text, map2Input);
            if (diff.isError) {
              this.setStatus(diff.error);
              textarea.value = diff.textReport;
            } else {
              if (diff.identical) {
                this.setStatus('maps are identical (0 differences)');
              } else {
                this.setStatus(`differences found: ${diff.diffCount}`);
              }
              textarea.value = diff.textReport;
            }
            break;
          }
          case 'bijoy': {
            const dir = document.querySelector('input[name="tm-bijoy-dir"]:checked')?.value || 'auto';
            textarea.value = window.TextEngine.convertBijoy(text, dir);
            if (dir === 'ansi2uni') this.setStatus('converted Bijoy (ANSI) to Unicode');
            else if (dir === 'uni2ansi') this.setStatus('converted Unicode to Bijoy (ANSI)');
            else this.setStatus('converted text (auto-detected)');
            break;
          }
          case 'longs':
          case 'long-s': {
            const lang = document.getElementById('tm-longs-lang')?.value || 'en';
            const keepUnknown = document.getElementById('tm-longs-unknown')?.checked || false;
            textarea.value = window.TextEngine.convertLongS(text, lang, keepUnknown);
            const langNames = { en: 'english', fr: 'français', de: 'deutsch', es: 'español', it: 'italiano' };
            this.setStatus(`converted to historical long s (ſ) [${langNames[lang] || lang}]`);
            break;
          }
          case 'qrcode':
          case 'qr': {
            const type = document.getElementById('tm-qr-type')?.value || 'qr';
            const fmt = document.getElementById('tm-qr-fmt')?.value || 'preview';
            const scale = parseInt(document.getElementById('tm-qr-scale')?.value, 10) || 8;
            const border = parseInt(document.getElementById('tm-qr-border')?.value, 10) || 4;
            const darkColor = document.getElementById('tm-qr-color-dark')?.value || '#000000';
            const lightColor = document.getElementById('tm-qr-color-light')?.value || '#ffffff';

            const opts = {
              scale: Math.max(1, Math.min(20, Math.round(scale / 2) || 3)),
              border: Math.max(0, border !== undefined ? border : 2),
              darkColor,
              lightColor
            };

            if (type === 'qr') {
              opts.ecc = document.getElementById('tm-qr-ecc')?.value || 'medium';
              opts.boostEcc = document.getElementById('tm-qr-boost')?.checked !== false;
              opts.mask = parseInt(document.getElementById('tm-qr-mask')?.value, 10);
            } else if (type === 'datamatrix') {
              const shape = document.getElementById('tm-dm-shape')?.value;
              if (shape && shape !== 'auto') opts.shape = shape;
              if (document.getElementById('tm-dm-parsefnc')?.checked) opts.parsefnc = true;
            } else if (type === 'aztec') {
              const azFmt = document.getElementById('tm-aztec-fmt')?.value;
              if (azFmt && azFmt !== 'auto') opts.format = azFmt;
              const azEcc = document.getElementById('tm-aztec-ecc')?.value;
              if (azEcc) opts.eclevel = parseInt(azEcc, 10);
              const azLay = document.getElementById('tm-aztec-layers')?.value;
              if (azLay && parseInt(azLay, 10) > 0) opts.layers = parseInt(azLay, 10);
            } else if (type === 'maxicode') {
              opts.mode = parseInt(document.getElementById('tm-maxi-mode')?.value || 4, 10);
            } else if (type === 'mailmark') {
              const mmType = document.getElementById('tm-mailmark-type')?.value;
              if (mmType && mmType !== 'auto') opts.type = mmType;
            }

            const cleanText = text.trim() || ' ';
            const codeRes = window.TextEngine.generate2DCode(cleanText, type, opts);
            if (codeRes.error) {
              this.setStatus('2D Code Error: ' + codeRes.error);
              break;
            }

            const asciiArt = window.TextEngine.generate2DCodeAscii(codeRes, { border: Math.min(border, 4), mode: fmt === 'full-ascii' ? 'full' : 'half' });
            const svgXml = window.TextEngine.generate2DCodeSvg(cleanText, type, opts);
            const dataUrl = window.TextEngine.generate2DCodeDataUrl(cleanText, type, opts);

            if (fmt === 'svg') {
              textarea.value = svgXml;
              this.setStatus(`Generated ${codeRes.typeName || type} SVG`);
            } else if (fmt === 'ascii' || fmt === 'full-ascii') {
              textarea.value = asciiArt;
              this.setStatus(`Generated ASCII ${codeRes.typeName || type}`);
            } else if (fmt === 'dataurl') {
              textarea.value = dataUrl;
              this.setStatus(`Generated PNG Data URL (${codeRes.typeName || type})`);
            } else {
              let titleMeta = codeRes.typeName || type;
              if (type === 'qr') titleMeta += ` (Version ${codeRes.version}, Size ${codeRes.size}x${codeRes.size}, ECC ${codeRes.eccName}, Mask ${codeRes.mask})`;
              else if (codeRes.width && codeRes.height) titleMeta += ` (${codeRes.width}x${codeRes.height})`;
              textarea.value = `=== ${titleMeta} ===\n\n` + asciiArt + `\n\n=== Payload ===\n` + cleanText;
              this.setStatus(`Generated ${codeRes.typeName || type}`);
            }

            const svgWrap = document.getElementById('tm-qr-svg-wrap');
            if (svgWrap) {
              svgWrap.innerHTML = svgXml;
              svgWrap.style.background = lightColor;
            }
            const metaEl = document.getElementById('tm-qr-meta');
            if (metaEl) {
              if (type === 'qr') {
                metaEl.textContent = `Ver ${codeRes.version} (${codeRes.size}x${codeRes.size}) | ECC ${codeRes.eccName} | Mask ${codeRes.mask} | ${cleanText.length} chars`;
              } else if (codeRes.width && codeRes.height) {
                metaEl.textContent = `${codeRes.typeName} (${codeRes.width}x${codeRes.height}) | ${cleanText.length} chars`;
              } else {
                metaEl.textContent = `${codeRes.typeName} | ${cleanText.length} chars`;
              }
            }
            break;
          }
          case 'barcode':
          case 'bc': {
            const format = document.getElementById('tm-bc-format')?.value || 'CODE128';
            const outputFmt = document.getElementById('tm-bc-output')?.value || 'preview';
            const width = parseInt(document.getElementById('tm-bc-width')?.value, 10) || 2;
            const height = parseInt(document.getElementById('tm-bc-height')?.value, 10) || 80;
            const margin = parseInt(document.getElementById('tm-bc-margin')?.value, 10) || 10;
            const displayValue = document.getElementById('tm-bc-display-val')?.checked !== false;
            const textPosition = document.getElementById('tm-bc-textpos')?.value || 'bottom';
            const textAlign = document.getElementById('tm-bc-textalign')?.value || 'center';
            const fontSize = parseInt(document.getElementById('tm-bc-fontsize')?.value, 10) || 16;
            const lineColor = document.getElementById('tm-bc-color-bar')?.value || '#000000';
            const background = document.getElementById('tm-bc-color-bg')?.value || '#ffffff';

            const cleanText = text.trim() || ' ';
            const bcOpts = {
              format, width, height, margin, displayValue, textPosition, textAlign, fontSize, lineColor, background
            };
            if (format === 'pdf417' || format === 'compactpdf417') {
              const cols = parseInt(document.getElementById('tm-pdf-cols')?.value, 10);
              if (cols > 0) bcOpts.columns = cols;
              const rows = parseInt(document.getElementById('tm-pdf-rows')?.value, 10);
              if (rows > 0) bcOpts.rows = rows;
              const ecc = document.getElementById('tm-pdf-ecc')?.value;
              if (ecc !== '' && ecc !== undefined) bcOpts.eclevel = parseInt(ecc, 10);
              if (document.getElementById('tm-pdf-compact')?.checked) bcOpts.compact = true;
            }

            const bcRes = window.TextEngine.generateBarcode(cleanText, bcOpts);

            if (bcRes.error) {
              this.setStatus('Barcode Error: ' + bcRes.error);
              break;
            }

            const asciiArt = window.TextEngine.generateBarcodeAscii(bcRes, { height: 6, margin: 2, displayValue, textPosition });
            const svgXml = window.TextEngine.generateBarcodeSvg(cleanText, bcOpts);
            const dataUrl = window.TextEngine.generateBarcodeDataUrl(cleanText, bcOpts);

            if (outputFmt === 'svg') {
              textarea.value = svgXml;
              this.setStatus(`Generated Barcode SVG (${bcRes.format})`);
            } else if (outputFmt === 'ascii') {
              textarea.value = asciiArt;
              this.setStatus(`Generated ASCII Barcode (${bcRes.format})`);
            } else if (outputFmt === 'dataurl') {
              textarea.value = dataUrl;
              this.setStatus(`Generated PNG Data URL (${bcRes.format})`);
            } else {
              const modInfo = bcRes.totalModules ? `${bcRes.totalModules} modules` : `${bcRes.width}x${bcRes.height}`;
              textarea.value = `=== Barcode (${bcRes.format}, ${modInfo}) ===\n\n` + asciiArt + `\n\n=== Payload ===\n` + cleanText;
              this.setStatus(`Generated Barcode (${bcRes.format})`);
            }

            const svgWrap = document.getElementById('tm-bc-svg-wrap');
            if (svgWrap) {
              svgWrap.innerHTML = svgXml;
              svgWrap.style.background = background;
            }
            const metaEl = document.getElementById('tm-bc-meta');
            if (metaEl) {
              const modInfo = bcRes.totalModules ? `${bcRes.totalModules} modules` : `${bcRes.width}x${bcRes.height}`;
              metaEl.textContent = `${bcRes.format} | ${modInfo} | ${cleanText.length} chars`;
            }
            break;
          }
          case 'decayfmt': {
            const simOpenBtn = document.getElementById('tm-decay-sim-open-btn');
            const glitchRunBtn = document.getElementById('tm-decay-glitch-run-btn');
            const glitchControls = document.getElementById('tm-decay-glitch-controls');
            if (glitchControls && glitchControls.style.display !== 'none' && glitchRunBtn) {
              glitchRunBtn.click();
            } else if (simOpenBtn) {
              simOpenBtn.click();
            }
            break;
          }
          case 'unicodemap': {
            const insertBtn = document.getElementById('tm-unimap-insert-btn');
            if (insertBtn) insertBtn.click();
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
  window.textManipWorkbench = textManipWorkbench;

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

    invoice: {
      desc: 'client-side vector invoice & receipt generator with multiple templates and barcode support',
      usage: 'invoice [--ui] [modern | thermal | classic | vintage | tractor | erp | mushak | retail | supermarket] [doc_number]',
      exec(args, stdin) {
        textManipWorkbench.open('invoice', '');
        if (args && args.length > 0 && window.InvoiceGenerator) {
          const sub = args[0].toLowerCase();
          if (sub === 'thermal') window.InvoiceGenerator.setTemplate('thermal-pos');
          else if (sub === 'vintage') window.InvoiceGenerator.setTemplate('bn-vintage-ledger');
          else if (sub === 'classic') window.InvoiceGenerator.setTemplate('minimal-classic');
          else if (sub === 'modern') window.InvoiceGenerator.setTemplate('stripe-modern');
          else if (sub === 'tractor' || sub === 'dotmatrix') window.InvoiceGenerator.setTemplate('mid-century-tractor');
          else if (sub === 'erp' || sub === '90s' || sub === 'corporate') window.InvoiceGenerator.setTemplate('erp-classic-90s');
          else if (sub === 'mushak' || sub === 'retail' || sub === 'supermarket' || sub === 'shwapno') window.InvoiceGenerator.setTemplate('thermal-retail-mushak');
          else if (sub === 'receipt') window.InvoiceGenerator.setDocType('receipt');
          if (args[1]) window.InvoiceGenerator.setDocNumber(args[1]);
        }
        return '<span class="c-accent">opened invoice & receipt generator in workbench.</span>';
      }
    },

    receipt: {
      desc: 'launch invoice & receipt generator in receipt mode',
      usage: 'receipt [--ui]',
      exec(args, stdin) {
        textManipWorkbench.open('invoice', '');
        if (window.InvoiceGenerator) {
          window.InvoiceGenerator.setDocType('receipt');
        }
        return '<span class="c-accent">opened invoice & receipt generator (receipt mode).</span>';
      }
    },

    prescription: {
      desc: 'client-side medical prescription & clinical pad generator with Ibn Sina standard and vector PDF export',
      usage: 'prescription [--ui] [ibn-sina | minimal | sample | new]',
      exec(args, stdin) {
        textManipWorkbench.open('prescription', '');
        if (args && args.length > 0 && window.PrescriptionGenerator) {
          const sub = args[0].toLowerCase();
          if (sub === 'minimal' || sub === 'classic') window.PrescriptionGenerator.setTemplate('minimal-clinical');
          else if (sub === 'ibn-sina' || sub === 'standard' || sub === 'hospital') window.PrescriptionGenerator.setTemplate('ibn-sina-standard');
          else if (sub === 'sample') window.PrescriptionGenerator.loadSampleData();
          else if (sub === 'new') window.PrescriptionGenerator.resetForNewPatient();
        }
        return '<span class="c-accent">opened medical prescription & clinical pad generator in workbench.</span>';
      }
    },

    rx: {
      desc: 'shortcut for medical prescription & clinical pad generator',
      usage: 'rx [--ui] [ibn-sina | minimal | sample | new]',
      exec(args, stdin) {
        return commands.prescription.exec(args, stdin);
      }
    },

    pad: {
      desc: 'shortcut for medical prescription & clinical pad generator',
      usage: 'pad [--ui] [ibn-sina | minimal | sample | new]',
      exec(args, stdin) {
        return commands.prescription.exec(args, stdin);
      }
    },

    decayfmt: {
      desc: 'ephemeral file format (.idcy/.tdcy) simulator and multi-iteration file decayer',
      usage: 'decayfmt [--ui] [encode|open|corrupt] [-i input] [-o output] [-x instability] [-n iterations] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'decayfmt: text engine not loaded';
        const engine = window.TextEngine.decayfmt;
        if (!engine) return 'decayfmt: decayfmt engine not available';

        if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
          let out = '<div class="tool-result-box">';
          out += '<div class="tool-result-header">decayfmt — entropy as a file format</div>';
          out += '<div class="c-dim" style="margin-bottom:8px;">a file format where opening a file permanently corrupts it. every read destroys a little more.<br>two file types: <span class="c-accent">.idcy&lt;x&gt;</span> (images) and <span class="c-accent">.tdcy&lt;x&gt;</span> (text), where x is the instability parameter.<br>formula: <span class="c-accent">p = 1 - e^(-x/10)</span> per byte per open.</div>';
          out += '<div class="c-user ansi-bold" style="margin-top:6px;">usage:</div>';
          out += '<div>  <span class="c-accent">decayfmt --ui</span>                           : launch interactive workbench (simulator + file decayer)</div>';
          out += '<div>  <span class="c-accent">decayfmt open &lt;file.tdcyX&gt; [-n N]</span>       : open & corrupt decayfmt file in-place on disk</div>';
          out += '<div>  <span class="c-accent">decayfmt encode -i &lt;in&gt; -o &lt;out.tdcyX&gt;</span> : encode pristine source file into decayfmt</div>';
          out += '<div>  <span class="c-accent">decayfmt corrupt [text] [-x X] [-n N]</span>       : compound-decay text via terminal or pipeline (|)</div>';
          out += '<div class="c-user ansi-bold" style="margin-top:6px;">examples:</div>';
          out += '<div>  <span class="c-dim">decayfmt open manifesto.tdcy3</span></div>';
          out += '<div>  <span class="c-dim">decayfmt open warning.tdcy8</span></div>';
          out += '<div>  <span class="c-dim">echo "entropy in action" | decayfmt -x 5 -n 2</span></div>';
          out += '<div>  <span class="c-dim">decayfmt encode -i README.md -o readme.tdcy7</span></div>';
          out += '</div>';
          return out;
        }

        if (args.includes('--ui') || args.includes('--gui') || args.includes('-u')) {
          const nonUiArgs = args.filter(a => a !== '--ui' && a !== '--gui' && a !== '-u');
          const input = extractTextInput(nonUiArgs, stdin);
          textManipWorkbench.open('decayfmt', input.text || '');
          return '<span class="c-accent">opened decayfmt simulator & decayer in workbench.</span>';
        }

        const subCmd = args[0].toLowerCase();

        // Subcommand: open
        if (subCmd === 'open') {
          let targetFile = null;
          let iterations = 1;
          for (let i = 1; i < args.length; i++) {
            if ((args[i] === '-n' || args[i] === '--iterations') && args[i + 1]) {
              iterations = Math.max(1, parseInt(args[++i], 10) || 1);
            } else if (!args[i].startsWith('-')) {
              targetFile = args[i];
            }
          }

          if (!targetFile) return 'decayfmt open: no file specified. usage: decayfmt open <file.tdcyX>';

          const parsedName = engine.parseFilename(targetFile);
          if (!parsedName) {
            return `decayfmt open: '${escapeHTML(targetFile)}' does not match decayfmt naming convention (.idcy<x> or .tdcy<x>).`;
          }

          const resolved = resolvePath(pathStack, targetFile);
          if (!resolved || resolved.node.type !== 'file') {
            return `decayfmt open: cannot open '${escapeHTML(targetFile)}': no such file.`;
          }

          const x = parsedName.x;
          let content = resolved.node.content;

          if (parsedName.type === 'text') {
            const decayedText = engine.corruptTextString(content, x, iterations);
            resolved.node.content = decayedText;
            const probPct = (engine.calculateProbability(x) * 100).toFixed(1);
            let out = `<div class="c-dim" style="margin-bottom:4px;">[decayfmt open: permanently corrupted '${escapeHTML(targetFile)}' in place (${iterations} open(s) @ x=${x}, p=${probPct}%)]</div>`;
            out += `<div>${escapeHTML(decayedText)}</div>`;
            return out;
          } else {
            textManipWorkbench.open('decayfmt', '');
            return `<span class="c-accent">opened image file '${escapeHTML(targetFile)}' in decayfmt visual workbench.</span>`;
          }
        }

        // Subcommand: encode
        if (subCmd === 'encode') {
          let inputFile = null;
          let outputFile = null;
          for (let i = 1; i < args.length; i++) {
            if ((args[i] === '-i' || args[i] === '--input') && args[i + 1]) {
              inputFile = args[++i];
            } else if ((args[i] === '-o' || args[i] === '--output') && args[i + 1]) {
              outputFile = args[++i];
            }
          }

          if (!inputFile || !outputFile) {
            return 'decayfmt encode: missing arguments. usage: decayfmt encode -i <input> -o <output.idcyX|output.tdcyX>';
          }

          const parsedOut = engine.parseFilename(outputFile);
          if (!parsedOut) {
            return `decayfmt encode: output name '${escapeHTML(outputFile)}' must end in .idcy<x> (image) or .tdcy<x> (text) where x is positive.`;
          }

          let srcContent = '';
          const resolvedSrc = resolvePath(pathStack, inputFile);
          if (resolvedSrc && resolvedSrc.node.type === 'file') {
            srcContent = resolvedSrc.node.content;
          } else {
            srcContent = inputFile;
          }

          const currentDir = resolvePath(pathStack, '.');
          if (currentDir && currentDir.node.type === 'folder') {
            currentDir.node.contents[outputFile] = {
              type: 'file',
              date: 'Just now',
              content: srcContent
            };
            return `<span class="c-accent">encoded pristine decayfmt file '${escapeHTML(outputFile)}' (x=${parsedOut.x}, type=${parsedOut.type}). pristine on disk; opening it will permanently decay it.</span>`;
          }
          return `decayfmt encode: failed to write '${escapeHTML(outputFile)}'.`;
        }

        // Subcommand: corrupt (or direct pipeline/text decay)
        let x = 3.0;
        let iterations = 1;
        const textTokens = [];
        const startIdx = (subCmd === 'corrupt') ? 1 : 0;

        for (let i = startIdx; i < args.length; i++) {
          const a = args[i];
          if ((a === '-x' || a === '--instability') && args[i + 1]) {
            x = Math.max(0.1, parseFloat(args[++i]) || 3.0);
          } else if ((a === '-n' || a === '--iterations') && args[i + 1]) {
            iterations = Math.max(1, parseInt(args[++i], 10) || 1);
          } else {
            textTokens.push(a);
          }
        }

        let rawText = '';
        if (stdin !== undefined && stdin !== null && stdin !== '') {
          rawText = String(stdin);
        } else if (textTokens.length > 0) {
          const resolved = resolvePath(pathStack, textTokens[0]);
          if (resolved && resolved.node.type === 'file' && textTokens.length === 1) {
            rawText = resolved.node.content;
          } else {
            rawText = textTokens.join(' ');
          }
        }

        if (!rawText) {
          return 'decayfmt: no input provided. provide text, a file, pipe (|), or run decayfmt --ui.';
        }

        const corrupted = engine.corruptTextString(rawText, x, iterations);
        return corrupted;
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

    accent: {
      desc: 'alias for unaccent (strip diacritics & accents)',
      usage: 'accent [file/text...]',
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

    spaces: {
      desc: 'alias for trim (clean up unwanted whitespace)',
      usage: 'spaces [--all|--trim] [file/text...]',
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

    breaks: {
      desc: 'alias for wrap (line breaks / word wrap)',
      usage: 'breaks [flags] [file/text...]',
      exec(args, stdin) {
        return commands.wrap.exec(args, stdin);
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

    emptylines: {
      desc: 'alias for compact (remove empty lines)',
      usage: 'emptylines [file/text...]',
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

    grep: {
      desc: 'alias for filter (search pattern in lines)',
      usage: 'grep [-v] [-i] [-E] <pattern> [file/text...]',
      exec(args, stdin) {
        return commands.filter.exec(args, stdin);
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

    unicodemap: {
      desc: 'Unicode character map and inspector with Unifont glyph grid',
      usage: 'unicodemap [--ui] [codepoint/character/search-query...]',
      exec(args, stdin) {
        if (!window.TextEngine || !window.TextEngine.unicodemap) {
          return 'unicodemap: text engine not loaded';
        }
        if (args.length === 0 || args.includes('--ui') || args.includes('-u')) {
          textManipWorkbench.open('unicodemap', stdin || '');
          return '<span class="c-accent">opened Unicode character map (unimap) in workbench.</span>';
        }

        const query = args.filter(a => !a.startsWith('-')).join(' ');
        if (!query) {
          textManipWorkbench.open('unicodemap', stdin || '');
          return '<span class="c-accent">opened Unicode character map (unimap) in workbench.</span>';
        }

        let info = null;
        const hexMatch = query.match(/^(?:u\+|0x)?([0-9a-f]{1,6})$/i);
        if (hexMatch) {
          const cp = parseInt(hexMatch[1], 16);
          if (cp >= 0 && cp <= 0x10FFFF) info = window.TextEngine.unicodemap.getUnicodeCharInfo(cp);
        }

        if (!info && query.length >= 1) {
          const cp = query.codePointAt(0);
          if (query.length <= 2 || query.startsWith('\\u')) {
            info = window.TextEngine.unicodemap.getUnicodeCharInfo(cp);
          }
        }

        if (info) {
          let out = '<div class="c-accent ansi-bold" style="margin-bottom:4px;">┌─ Unicode Character Inspector ─────────────────────────────────────┐</div>';
          out += `<div>│ <span class="c-dim">Character :</span> <span style="font-size:1.2rem; font-weight:bold; color:#fff;">${escapeHTML(info.char || ' ')}</span> <span class="c-dim">(${info.formattedHex})</span></div>`;
          out += `<div>│ <span class="c-dim">Name      :</span> <span class="c-file">${escapeHTML(info.name)}</span></div>`;
          if (info.oldName) {
            out += `<div>│ <span class="c-dim">Alias     :</span> <span class="c-dim">${escapeHTML(info.oldName)}</span></div>`;
          }
          out += `<div>│ <span class="c-dim">Decimal   :</span> ${info.dec}</div>`;
          out += `<div>│ <span class="c-dim">Block     :</span> ${escapeHTML(info.block.name)} (Plane ${info.plane.id})</div>`;
          out += `<div>│ <span class="c-dim">Version   :</span> Unicode ${escapeHTML(info.age)}${info.isNewIn18 ? ' <span class="c-accent ansi-bold">[New in 18.0]</span>' : ''}</div>`;
          out += `<div>│ <span class="c-dim">Category  :</span> ${escapeHTML(info.category.code)} - ${escapeHTML(info.category.name)}</div>`;
          out += `<div>│ <span class="c-dim">Bidi Class:</span> ${escapeHTML(info.bidiClass.code)} (${escapeHTML(info.bidiClass.name)})</div>`;
          out += `<div>│ <span class="c-dim">EA Width  :</span> ${escapeHTML(info.eastAsianWidth.code)} (${escapeHTML(info.eastAsianWidth.name)})</div>`;
          out += `<div>│ <span class="c-dim">Line Break:</span> ${escapeHTML(info.lineBreak.code)} (${escapeHTML(info.lineBreak.name)})</div>`;
          if (info.combiningClass && info.combiningClass.value !== '0') {
            out += `<div>│ <span class="c-dim">Combining :</span> ${escapeHTML(info.combiningClass.value)} (${escapeHTML(info.combiningClass.name)})</div>`;
          }
          if (info.decomposition) {
            out += `<div>│ <span class="c-dim">Decomp    :</span> <span class="c-file">${escapeHTML(info.decomposition)}</span></div>`;
          }
          if (info.numericValue) {
            out += `<div>│ <span class="c-dim">Numeric   :</span> <span class="c-accent">${escapeHTML(info.numericValue)}</span></div>`;
          }
          if (info.caseMappings && info.caseMappings.formatted) {
            out += `<div>│ <span class="c-dim">Mappings  :</span> ${escapeHTML(info.caseMappings.formatted)}</div>`;
          }
          out += `<div>│ <span class="c-dim">Script    :</span> ${escapeHTML(info.script)}</div>`;
          out += `<div>│ <span class="c-dim">Mirrored  :</span> ${info.bidiMirrored ? 'Yes' : 'No'}</div>`;
          out += `<div>│ <span class="c-dim">UTF-8     :</span> <span style="font-family:monospace;">${info.utf8Hex || '-'}</span></div>`;
          out += `<div>│ <span class="c-dim">UTF-16    :</span> <span style="font-family:monospace;">${info.utf16Hex || '-'}</span></div>`;
          out += `<div>│ <span class="c-dim">HTML      :</span> ${info.htmlNamed ? escapeHTML(info.htmlNamed) + ' / ' : ''}${escapeHTML(info.htmlHex)} / ${escapeHTML(info.htmlDec)}</div>`;
          out += `<div>│ <span class="c-dim">Escape    :</span> <span style="font-family:monospace;">${escapeHTML(info.escapeJs)}</span></div>`;
          out += '<div class="c-accent ansi-bold" style="margin-top:4px;">└───────────────────────────────────────────────────────────────────┘</div>';
          return out;
        }

        const results = window.TextEngine.unicodemap.searchUnicode(query, 15);
        if (results.length === 0) {
          return `unicodemap: no matches found for '${escapeHTML(query)}'`;
        }

        let out = `<div class="c-accent ansi-bold">Unicode Map Search Results for '${escapeHTML(query)}':</div>`;
        out += '<div class="c-dim" style="margin-bottom:6px;">CodePoint  Char  Category  Name</div>';
        results.forEach(r => {
          const cpCol = r.formattedHex.padEnd(10);
          const chCol = (r.char || ' ').padEnd(4);
          const catCol = r.category.code.padEnd(8);
          out += `<div><span class="c-accent">${escapeHTML(cpCol)}</span> <span style="font-weight:bold;">${escapeHTML(chCol)}</span> <span class="c-dim">${escapeHTML(catCol)}</span> ${escapeHTML(r.name)}</div>`;
        });
        out += `<div class="c-dim" style="margin-top:6px;">Type 'unicodemap &lt;codepoint&gt;' for full properties or 'unicodemap --ui' for visual grid.</div>`;
        return out;
      }
    },

    unimap: {
      desc: 'alias for unicodemap',
      usage: 'unimap [--ui] [codepoint/character/search-query...]',
      exec(args, stdin) {
        return commands.unicodemap.exec(args, stdin);
      }
    },
    urlencode: {
      desc: 'encode text to percent-encoded URI component (%xx format) supporting 40+ charsets (UTF-8, Windows-1252, ISO-8859, Shift_JIS, etc.)',
      usage: 'urlencode [-e <encoding>] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'urlencode: text engine not loaded';
        let encoding = 'UTF-8';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          if ((args[i] === '-e' || args[i] === '--encoding') && args[i + 1]) { encoding = args[i + 1]; i++; }
          else if (!args[i].startsWith('-')) { textArgs.push(args[i]); }
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'urlencode: missing input text or file';
        try {
          return window.TextEngine.urlEncode(input.text, { encoding });
        } catch (err) {
          return `urlencode: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    urldecode: {
      desc: 'decode percent-encoded URI string (%xx format) with charset support (UTF-8, Windows-1252, Shift_JIS, etc.)',
      usage: 'urldecode [-e <encoding>] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'urldecode: text engine not loaded';
        let encoding = 'UTF-8';
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
      desc: 'encode or decode standard Base64 formatted string with charset support (UTF-8, Windows-1252, ISO-8859, Shift_JIS, etc.)',
      usage: 'base64 [-d|--decode] [-e <encoding>] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'base64: text engine not loaded';
        const isDecode = args.includes('-d') || args.includes('--decode');
        let encoding = 'UTF-8';
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

    'detect-encoding': {
      desc: 'detect character encoding of text or file (UTF-8, Windows-1252, Shift_JIS, EUC-JP, ISO-2022-JP, UTF-16, ASCII, etc.)',
      usage: 'detect-encoding [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'detect-encoding: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'detect-encoding: missing input text or file';
        try {
          const enc = window.TextEngine.detectEncoding(input.text);
          return `<span class="c-accent">Detected Encoding:</span> <span class="c-file ansi-bold">${escapeHTML(enc)}</span>`;
        } catch (err) {
          return `detect-encoding: error: ${escapeHTML(err.message)}`;
        }
      }
    },

    iconv: {
      desc: 'convert character encoding across 40+ encodings (Windows-1252, ISO-8859, CP437, Mac, KOI8, Shift_JIS, UTF-8, etc.)',
      usage: 'iconv -t <to_encoding> [-f <from_encoding>] [--hex|--url|--base64] [-l|--list] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'iconv: text engine not loaded';
        if (args.includes('-l') || args.includes('--list')) {
          const catalog = window.TextEngine.getSupportedEncodings();
          let out = '<span class="c-accent ansi-bold">Supported Encodings (40+ code pages & standards):</span>\n\n';
          for (const cat of catalog) {
            out += `<span class="c-user ansi-bold">${escapeHTML(cat.category)}:</span>\n`;
            for (const enc of cat.encodings) {
              const aliases = enc.aliases && enc.aliases.length ? ` <span class="c-dim">(${enc.aliases.join(', ')})</span>` : '';
              out += `  <span class="c-file ansi-bold">${escapeHTML(enc.id.padEnd(20))}</span> ${escapeHTML(enc.name)}${aliases}\n`;
            }
            out += '\n';
          }
          return out.trimEnd();
        }

        let to = 'UTF-8';
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
        if (!input.text && input.isEmpty) return 'iconv: missing input text or file (use -l or --list to view supported encodings)';
        try {
          return window.TextEngine.convertEncoding(input.text, to, from, { format });
        } catch (err) {
          return `iconv: error: ${escapeHTML(err.message)}`;
        }
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

    diff: {
      desc: 'compare two files, code snippets, or strings line-by-line or word-by-word',
      usage: 'diff [-w|--ignore-all-space] [-i|--ignore-case] [-W|--word] [-c|--char] <file1/text1> <file2/text2> | cat file2.txt | diff file1.txt',
      exec(args, stdin) {
        if (!window.TextEngine) return 'diff: text engine not loaded';

        if (args.includes('--ui') || args.includes('-u') || args.includes('--gui')) {
          textManipWorkbench.open('diff', stdin || '');
          return '<span class="c-accent">opened diff checker in text manipulation workbench.</span>';
        }

        const flags = args.filter(a => a.startsWith('-'));
        const nonFlags = args.filter(a => !a.startsWith('-'));

        if (nonFlags.length === 0 && (stdin === undefined || stdin === null || stdin === '')) {
          return `<div class="tool-result-box">
<div class="tool-result-header">Text Difference Checker (diff)</div>
<div><span class="c-accent ansi-bold">usage:</span></div>
<div>  diff &lt;file1/text1&gt; &lt;file2/text2&gt;</div>
<div>  cat file2.txt | diff file1.txt</div>
<div>  diff --word &lt;file1&gt; &lt;file2&gt;</div>
<div>  diff --ui</div>
<div class="c-dim" style="margin-top:6px;">options: -w (ignore whitespace), -i (ignore case), -W/--word (word diff), -c/--char (char diff)</div>
</div>`;
        }

        const ignoreWhitespace = flags.includes('-w') || flags.includes('--ignore-all-space') || flags.includes('--ignore-space-change');
        const ignoreCase = flags.includes('-i') || flags.includes('--ignore-case');
        let mode = 'line';
        if (flags.includes('-W') || flags.includes('--word') || flags.includes('-w-diff')) mode = 'word';
        else if (flags.includes('-c') || flags.includes('--char')) mode = 'char';

        let text1Str = '';
        let text2Str = '';

        if (stdin !== undefined && stdin !== null && stdin !== '') {
          text2Str = String(stdin);
          if (nonFlags.length > 0) {
            const resolved = resolvePath(pathStack, nonFlags[0]);
            if (resolved && resolved.node.type === 'file') {
              text1Str = resolved.node.content;
            } else {
              text1Str = nonFlags[0];
            }
          }
        } else if (nonFlags.length >= 2) {
          const res1 = resolvePath(pathStack, nonFlags[0]);
          text1Str = (res1 && res1.node.type === 'file') ? res1.node.content : nonFlags[0];

          const res2 = resolvePath(pathStack, nonFlags[1]);
          text2Str = (res2 && res2.node.type === 'file') ? res2.node.content : nonFlags[1];
        } else if (nonFlags.length === 1) {
          const res1 = resolvePath(pathStack, nonFlags[0]);
          text1Str = (res1 && res1.node.type === 'file') ? res1.node.content : nonFlags[0];
        }

        const diffRes = window.TextEngine.diffText(text1Str, text2Str, { mode, ignoreWhitespace, ignoreCase });
        let out = '<div class="tool-result-box">';
        out += '<div class="tool-result-header">Text Difference Checker (diff)</div>';
        out += diffRes.htmlReport;
        out += '</div>';
        return out;
      }
    },

    wdiff: {
      desc: 'word-by-word diff checker (alias for diff --word)',
      usage: 'wdiff <file1/text1> <file2/text2>',
      exec(args, stdin) {
        return commands.diff.exec(['--word', ...args], stdin);
      }
    },

    mapdiff: {
      desc: 'compare two JSON objects or key-value maps to find missing, extra, and mismatched values',
      usage: 'mapdiff <file1/json1> <file2/json2> | cat file2.json | mapdiff file1.json | mapdiff --ui',
      exec(args, stdin) {
        if (!window.TextEngine) return 'mapdiff: text engine not loaded';
        if (args.length === 0 && (stdin === undefined || stdin === null || stdin === '')) {
          return `<div class="tool-result-box">
<div class="tool-result-header">JSON Map Difference Checker</div>
<div><span class="c-accent ansi-bold">usage:</span></div>
<div>  mapdiff &lt;file1/json1&gt; &lt;file2/json2&gt;</div>
<div>  cat file2.json | mapdiff file1.json</div>
<div>  mapdiff --ui</div>
<div class="c-dim" style="margin-top:6px;">example: mapdiff '{"a": 1, "b": 2}' '{"b": 3, "c": 4}'</div>
</div>`;
        }

        if (args.includes('--ui') || args.includes('-u') || args.includes('--gui')) {
          textManipWorkbench.open('mapdiff', stdin || '');
          return '<span class="c-accent">opened mapdiff in text manipulation workbench.</span>';
        }

        let map1Str = '';
        let map2Str = '';

        if (stdin !== undefined && stdin !== null && stdin !== '') {
          map2Str = String(stdin);
          if (args.length > 0) {
            const resolved = resolvePath(pathStack, args[0]);
            if (resolved && resolved.node.type === 'file') {
              map1Str = resolved.node.content;
            } else {
              map1Str = args[0];
            }
          }
        } else if (args.length >= 2) {
          const res1 = resolvePath(pathStack, args[0]);
          map1Str = (res1 && res1.node.type === 'file') ? res1.node.content : args[0];

          const res2 = resolvePath(pathStack, args[1]);
          map2Str = (res2 && res2.node.type === 'file') ? res2.node.content : args[1];
        } else if (args.length === 1) {
          const res1 = resolvePath(pathStack, args[0]);
          map1Str = (res1 && res1.node.type === 'file') ? res1.node.content : args[0];
        }

        const diff = window.TextEngine.diffMaps(map1Str, map2Str);
        if (diff.isError) {
          return `<span class="c-err">${escapeHTML(diff.error)}</span>`;
        }

        let out = '<div class="tool-result-box">';
        out += '<div class="tool-result-header">JSON Map Difference Checker</div>';
        out += diff.htmlReport;
        out += '</div>';
        return out;
      }
    },


    bijoy: {
      desc: 'convert Bengali text between Bijoy (ANSI) and Unicode (mjcdi engine)',
      usage: 'bijoy [-a|--ansi | -u|--unicode | --auto] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'bijoy: text engine not loaded';
        let mode = 'auto';
        const textArgs = [];
        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if (a === '-u' || a === '--unicode' || a === 'ansi2uni') mode = 'ansi2uni';
          else if (a === '-a' || a === '--ansi' || a === 'uni2ansi') mode = 'uni2ansi';
          else if (a === '--auto') mode = 'auto';
          else if (!a.startsWith('-')) textArgs.push(a);
        }
        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) return 'bijoy: missing input text or file';
        return window.TextEngine.convertBijoy(input.text, mode);
      }
    },

    ansi2uni: {
      desc: 'convert Bijoy (ANSI) encoded Bengali text to standard Unicode (mjcdi)',
      usage: 'ansi2uni [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'ansi2uni: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'ansi2uni: missing input text or file';
        return window.TextEngine.bijoyToUnicode(input.text);
      }
    },

    uni2ansi: {
      desc: 'convert standard Unicode Bengali text to Bijoy (ANSI) encoding (mjcdi)',
      usage: 'uni2ansi [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'uni2ansi: text engine not loaded';
        const input = extractTextInput(args, stdin);
        if (!input.text && input.isEmpty) return 'uni2ansi: missing input text or file';
        return window.TextEngine.unicodeToBijoy(input.text);
      }
    },

    mjcdi: {
      desc: 'Bijoy ANSI ⇄ Unicode PDF/Text Converter CLI Suite',
      usage: 'mjcdi <ansi2uni|uni2ansi> [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'mjcdi: text engine not loaded';
        if (args.length === 0 && (stdin === undefined || stdin === null || stdin === '')) {
          return `<div class="tool-result-box">
<div class="tool-result-header">MJcdi - Bijoy ANSI ⇄ Unicode Converter [β]</div>
<div><span class="c-accent ansi-bold">commands:</span></div>
<div>  mjcdi ansi2uni &lt;input_file/text&gt;  - Convert Bijoy ANSI text to Unicode</div>
<div>  mjcdi uni2ansi &lt;input_file/text&gt;  - Convert Unicode Bengali to Bijoy ANSI</div>
<div class="c-dim" style="margin-top:6px;">example: echo "Avwg evsjvq Mvb MvB" | mjcdi ansi2uni</div>
</div>`;
        }
        const subCmd = (args[0] || '').toLowerCase();
        if (subCmd === 'ansi2uni' || subCmd === 'a2u') {
          return commands.ansi2uni.exec(args.slice(1), stdin);
        }
        if (subCmd === 'uni2ansi' || subCmd === 'u2a') {
          return commands.uni2ansi.exec(args.slice(1), stdin);
        }
        return commands.bijoy.exec(args, stdin);
      }
    },

    longs: {
      desc: 'insert historical long S (ſ) into English, French, German, Spanish, and Italian text',
      usage: 'longs [-l en|fr|de|es|it] [-x|--keep-unknown] [--ui] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'longs: text engine not loaded';
        if (args.includes('--ui') || args.includes('--gui') || args.includes('-u')) {
          const nonUiArgs = args.filter(a => a !== '--ui' && a !== '--gui' && a !== '-u');
          const input = extractTextInput(nonUiArgs, stdin);
          textManipWorkbench.open('longs', input.text || '');
          return '<span class="c-accent">opened long s (ſ) converter in text manipulation workbench.</span>';
        }

        let lang = 'en';
        let keepUnknown = false;
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if ((a === '-l' || a === '--lang' || a === '--language') && args[i + 1]) {
            lang = args[i + 1].toLowerCase();
            i++;
          } else if (a.startsWith('-l')) {
            lang = a.substring(2).toLowerCase();
          } else if (a === '-x' || a === '--keep-unknown') {
            keepUnknown = true;
          } else if (a === '-h' || a === '--help') {
            return `<div class="tool-result-box">
<div class="tool-result-header">Long S (ſ) Converter</div>
<div class="c-dim" style="margin-bottom:6px;">Inserts the historical long s (ſ) into text based on language-specific orthography rules.</div>
<div><span class="c-user ansi-bold">Usage:</span> longs [-l en|fr|de|es|it] [-x] [file/text...]</div>
<div><span class="c-user ansi-bold">Options:</span></div>
<div>  <span class="c-accent">-l, --lang &lt;lang&gt;</span> : Language code (en, fr, de, es, it - default: en)</div>
<div>  <span class="c-accent">-x, --keep-unknown</span>  : Mark ambiguous German S with 'X'</div>
<div>  <span class="c-accent">-u, --ui</span>            : Open interactive Visual Workbench</div>
<div class="c-user ansi-bold" style="margin-top:6px;">Examples:</div>
<div>  echo "Congress shall make no law..." | longs</div>
<div>  longs -l de "Das ist ein Schloss und eine Ausstellung"</div>
<div>  longs -l fr "Les enfants sans souci"</div>
</div>`;
          } else if (!a.startsWith('-')) {
            textArgs.push(a);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) {
          return `<div class="tool-result-box">
<div class="tool-result-header">Long S (ſ) Converter</div>
<div class="c-dim" style="margin-bottom:6px;">Inserts the historical long s (ſ) into text based on classical orthography.</div>
<div><span class="c-user ansi-bold">Usage:</span> longs [-l en|fr|de|es|it] [-x] [file/text...]</div>
<div class="c-dim" style="margin-top:6px;">example: echo "Congress shall make no law..." | longs</div>
<div class="c-dim">type <span class="c-accent">longs --help</span> for options or <span class="c-accent">longs --ui</span> to launch visual workbench.</div>
</div>`;
        }

        return window.TextEngine.convertLongS(input.text, lang, keepUnknown);
      }
    },

    qrcode: {
      desc: 'generate customizable 2D matrix (QR Code, Data Matrix, Aztec Code, MaxiCode, DotCode, Han Xin Code)',
      usage: 'qrcode [-t qr|datamatrix|aztec|maxicode|dotcode|hanxin] [-e low|med|quart|high|L1|L2|L3|L4] [-v version] [-s scale] [-b border] [-f ascii|full-ascii|svg|dataurl|raw] [flags] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'qrcode: text engine not loaded';

        if (args.includes('--ui') || args.includes('--gui') || args.includes('-u')) {
          const nonUiArgs = args.filter(a => a !== '--ui' && a !== '--gui' && a !== '-u');
          const input = extractTextInput(nonUiArgs, stdin);
          textManipWorkbench.open('qrcode', input.text || '');
          return '<span class="c-accent">opened 2D barcode generator in text manipulation workbench.</span>';
        }

        let type = 'qr';
        const textArgs = [];
        let ecc = 'medium';
        let scale = 8;
        let border = undefined;
        let mask = -1;
        let format = 'interactive';
        let boostEcc = true;
        let invert = false;
        let darkColor = '#000000';
        let lightColor = '#ffffff';
        let minVer = 1;
        let maxVer = 40;
        let dmShape = undefined;
        let dmParsefnc = false;
        let aztecFmt = undefined;
        let aztecLayers = undefined;
        let aztecEcc = undefined;
        let maxiMode = undefined;
        let dotCols = undefined;
        let dotRows = undefined;
        let dotRatio = undefined;
        let dotFastfind = false;
        let hxVersion = undefined;
        let mqrVersion = undefined;
        let rmqrSize = undefined;
        let mailmarkType = undefined;
        let targetSize = undefined;

        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if ((a === '-t' || a === '--type' || a === '--symbology') && args[i + 1]) {
            type = window.TextEngine.normalize2DType(args[i + 1]);
            i++;
          } else if ((a === '--mailmark-type' || a === '--cmdm-type') && args[i + 1]) {
            mailmarkType = args[i + 1];
            i++;
          } else if ((a === '-e' || a === '--ecc' || a === '--level') && args[i + 1]) {
            ecc = args[i + 1];
            i++;
          } else if ((a === '-s' || a === '--scale') && args[i + 1]) {
            scale = parseInt(args[i + 1], 10) || scale;
            i++;
          } else if ((a === '-v' || a === '--version') && args[i + 1]) {
            const vVal = args[i + 1];
            if (/^M[1-4]$/i.test(vVal) || ['1', '2', '3', '4'].includes(vVal)) {
              mqrVersion = vVal;
            } else if (/^R\d+x\d+$/i.test(vVal)) {
              rmqrSize = vVal;
            } else {
              hxVersion = parseInt(vVal, 10);
            }
            i++;
          } else if ((a === '--mqr-version' || a === '--mqr-ver') && args[i + 1]) {
            mqrVersion = args[i + 1];
            i++;
          } else if ((a === '--rmqr-size' || a === '--rmqr-version') && args[i + 1]) {
            rmqrSize = args[i + 1];
            i++;
          } else if ((a === '--size' || a === '--max-dim' || a === '--png-size') && args[i + 1]) {
            targetSize = Math.min(4000, Math.max(50, parseInt(args[i + 1], 10) || 4000));
            i++;
          } else if ((a === '-b' || a === '--border' || a === '-m' || a === '--margin') && args[i + 1]) {
            border = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--mask' && args[i + 1]) {
            mask = parseInt(args[i + 1], 10);
            i++;
          } else if ((a === '-f' || a === '--format' || a === '-o' || a === '--output') && args[i + 1]) {
            format = args[i + 1].toLowerCase();
            i++;
          } else if (a === '--min-version' && args[i + 1]) {
            minVer = parseInt(args[i + 1], 10) || 1;
            i++;
          } else if (a === '--max-version' && args[i + 1]) {
            maxVer = parseInt(args[i + 1], 10) || 40;
            i++;
          } else if ((a === '--dark' || a === '--color') && args[i + 1]) {
            darkColor = args[i + 1];
            i++;
          } else if ((a === '--light' || a === '--bg') && args[i + 1]) {
            lightColor = args[i + 1];
            i++;
          } else if (a === '--shape' && args[i + 1]) {
            dmShape = args[i + 1];
            i++;
          } else if (a === '--parsefnc') {
            dmParsefnc = true;
          } else if ((a === '--aztec-format' || a === '--aztec-fmt') && args[i + 1]) {
            aztecFmt = args[i + 1];
            i++;
          } else if (a === '--layers' && args[i + 1]) {
            aztecLayers = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--eclevel' && args[i + 1]) {
            aztecEcc = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--mode' && args[i + 1]) {
            maxiMode = parseInt(args[i + 1], 10);
            i++;
          } else if ((a === '--columns' || a === '--cols') && args[i + 1]) {
            dotCols = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--rows' && args[i + 1]) {
            dotRows = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--ratio' && args[i + 1]) {
            dotRatio = Number(args[i + 1]);
            i++;
          } else if (a === '--fastfind') {
            dotFastfind = true;
          } else if (a === '--no-boost') {
            boostEcc = false;
          } else if (a === '-i' || a === '--invert') {
            invert = true;
          } else if (a === '-a' || a === '--ascii') {
            format = 'ascii';
          } else if (a === '--full-ascii') {
            format = 'full-ascii';
          } else if (a === '--svg') {
            format = 'svg';
          } else if (a === '--dataurl' || a === '--base64' || a === '--png') {
            format = 'dataurl';
          } else if (a === '--raw') {
            format = 'raw';
          } else if (!a.startsWith('-')) {
            textArgs.push(a);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) {
          return `<div class="tool-result-box">
<div class="tool-result-header">2D matrix generator</div>
<div><span class="c-accent ansi-bold">usage:</span></div>
<div class="c-dim">  qrcode [-t qr|microqr|rmqr|datamatrix|aztec|maxicode|dotcode|hanxin|mailmark] [-f ascii|svg|dataurl] [flags] [file/text...]</div>
<div class="c-dim">  echo "https://syzarn.github.io" | qrcode</div>
<div class="c-dim">  qrcode -t microqr -v M3 "12345678"</div>
<div class="c-dim">  qrcode -t rmqr --rmqr-size R11x43 "RMQR-SAMPLE"</div>
<div class="c-dim">  qrcode -t dotcode --ratio 2 "EIKHI-2002"</div>
<div class="c-dim">  qrcode -t hanxin -e L3 "述而不作、信而好古"</div>
<div class="c-dim">  qrcode -t mailmark "JGB 012100123412345678AB19XY1A 0             "</div>
<div class="c-dim">  qrcode --ui "custom payload"</div>
<div style="margin-top:6px;"><span class="c-accent ansi-bold">types & input restrictions:</span></div>
<div class="c-dim">  qr          : UTF-8, Latin-1, binary, numeric, alphanumeric, Kanji (up to 7,089 digits / 2,953 bytes)</div>
<div class="c-dim">  microqr     : Compact single-finder QR code (M1-M4, up to 35 digits / 15 bytes / 9 Kanji)</div>
<div class="c-dim">  rmqr        : Rectangular Micro QR (32 sizes R7x43..R17x139, up to 361 digits / 150 bytes)</div>
<div class="c-dim">  datamatrix  : Full ASCII (0-127), extended (128-255), UTF-8, binary (up to 3,116 digits / 1,555 bytes)</div>
<div class="c-dim">  aztec       : Full 8-bit binary/ASCII (compact 1-4 layers, full 1-32 layers; up to 3,832 digits)</div>
<div class="c-dim">  maxicode    : Mode 4 standard (93 chars), Mode 5 secure (77 chars), Mode 2/3 postal SCM</div>
<div class="c-dim">  dotcode     : Full ASCII (0-127), extended (128-255), UTF-8, GS1 FNC1 (up to ~1,500+ chars/bytes)</div>
<div class="c-dim">  hanxin      : Chinese (GB18030), full ASCII, Latin, digits, binary (84 versions up to 7,827 digits / 2,174 Chinese chars)</div>
<div class="c-dim">  mailmark    : Royal Mail 2D Mailmark CMDM (Type 7 24x24, Type 9 32x32, Type 29 16x48, starting with 'JGB ')</div>
<div style="margin-top:6px;"><span class="c-accent ansi-bold">common flags:</span></div>
<div class="c-dim">  -t, --type &lt;type&gt;    : symbology type (qr, microqr, rmqr, datamatrix, aztec, maxicode, dotcode, hanxin, mailmark)</div>
<div class="c-dim">  -f, --format &lt;fmt&gt;   : output format (ascii, full-ascii, svg, dataurl, raw)</div>
<div class="c-dim">  -s, --scale &lt;N&gt;      : module pixel scale for image/canvas (default: 8)</div>
<div class="c-dim">  --size &lt;N&gt;           : target PNG image size / max dimension (max: 4000)</div>
<div class="c-dim">  -b, --border &lt;N&gt;     : quiet zone border modules (default: 2 for ascii, 4 for image)</div>
<div class="c-dim">  --dark, --color &lt;hex&gt;: dark module color (default: #000000)</div>
<div class="c-dim">  --light, --bg &lt;hex&gt;  : light module color (default: #ffffff)</div>
<div class="c-dim">  --ui                 : launch interactive 2D matrix generator in workbench</div>
<div style="margin-top:6px;"><span class="c-accent ansi-bold">type-specific flags:</span></div>
<div class="c-dim">  QR Code     : -e, --ecc &lt;low|medium|quartile|high&gt;, --mask &lt;0-7&gt;, --no-boost</div>
<div class="c-dim">  Micro QR    : -v, --version &lt;M1|M2|M3|M4&gt;, -e, --ecc &lt;L|M|Q&gt;, --mask &lt;0-3&gt;</div>
<div class="c-dim">  rMQR Code   : --rmqr-size &lt;R7x43..R17x139&gt;, -e, --ecc &lt;M|H&gt;</div>
<div class="c-dim">  Data Matrix : --shape &lt;square|rect&gt;, --parsefnc</div>
<div class="c-dim">  Aztec Code  : --aztec-format &lt;compact|full&gt;, --layers &lt;1-32&gt;, --eclevel &lt;5-95&gt;</div>
<div class="c-dim">  MaxiCode    : --mode &lt;2|3|4|5|6&gt;</div>
<div class="c-dim">  DotCode     : --columns &lt;N&gt;, --rows &lt;N&gt;, --ratio &lt;N&gt;, --parsefnc, --fastfind</div>
<div class="c-dim">  Han Xin Code/汉信码: -e, --ecc &lt;L1|L2|L3|L4&gt;, -v, --version &lt;1-84&gt;, --mask &lt;1-4&gt;, --parsefnc</div>
<div class="c-dim">  Mailmark 2D : --mailmark-type &lt;7|9|29|auto&gt;</div>
</div>`;
        }

        const opts = {
          scale: Math.max(1, Math.min(20, Math.round(scale / 2) || 3)),
          border: border !== undefined ? border : (type === 'qr' ? 2 : 1),
          darkColor,
          lightColor,
          targetSize
        };

        if (type === 'qr') {
          opts.ecc = ecc;
          opts.minVersion = minVer;
          opts.maxVersion = maxVer;
          opts.mask = mask;
          opts.boostEcc = boostEcc;
        } else if (type === 'microqr') {
          if (ecc) opts.eclevel = ecc;
          if (mqrVersion) opts.version = mqrVersion;
          if (mask >= 0) opts.mask = mask;
          if (dmParsefnc) opts.parsefnc = true;
        } else if (type === 'rmqr') {
          if (ecc) opts.eclevel = ecc;
          if (rmqrSize) opts.version = rmqrSize;
          if (dmParsefnc) opts.parsefnc = true;
        } else if (type === 'datamatrix') {
          if (dmShape) opts.shape = dmShape;
          if (dmParsefnc) opts.parsefnc = true;
        } else if (type === 'aztec') {
          if (aztecFmt) opts.format = aztecFmt;
          if (aztecLayers) opts.layers = aztecLayers;
          if (aztecEcc) opts.eclevel = aztecEcc;
        } else if (type === 'maxicode') {
          if (maxiMode) opts.mode = maxiMode;
        } else if (type === 'dotcode') {
          if (dotCols) opts.columns = dotCols;
          if (dotRows) opts.rows = dotRows;
          if (dotRatio) opts.ratio = dotRatio;
          if (dmParsefnc) opts.parsefnc = true;
          if (dotFastfind) opts.fastfind = true;
        } else if (type === 'hanxin') {
          if (ecc) opts.eclevel = ecc;
          if (hxVersion) opts.version = hxVersion;
          if (mask > 0) opts.mask = mask;
          if (dmParsefnc) opts.parsefnc = true;
        } else if (type === 'mailmark') {
          if (mailmarkType) opts.type = mailmarkType;
        }

        const codeRes = window.TextEngine.generate2DCode(input.text, type, opts);

        if (codeRes.error) {
          const rest = window.TextEngine.getSymbologyRestriction(type);
          const hint = rest ? `\n<span class="c-dim">note for ${rest.name}: allowed: ${rest.allowedChars}. capacity: ${rest.lengthLimit}. ${rest.notes}</span>` : '';
          return `qrcode: error: ${escapeHTML(codeRes.error)}${hint}`;
        }

        if (format === 'svg') {
          return window.TextEngine.generate2DCodeSvg(input.text, type, opts);
        }

        if (format === 'dataurl' || format === 'png' || format === 'base64') {
          return window.TextEngine.generate2DCodeDataUrl(input.text, type, opts);
        }

        if (format === 'ascii') {
          return window.TextEngine.generate2DCodeAscii(codeRes, { border: opts.border, mode: 'half', invert });
        }

        if (format === 'full-ascii') {
          return window.TextEngine.generate2DCodeAscii(codeRes, { border: opts.border, mode: 'full', invert });
        }

        if (format === 'raw') {
          if (type === 'qr') {
            let matrix = [];
            for (let y = 0; y < codeRes.size; y++) {
              let row = [];
              for (let x = 0; x < codeRes.size; x++) {
                row.push(codeRes.qr.getModule(x, y) ? 1 : 0);
              }
              matrix.push(row.join(''));
            }
            return matrix.join('\n');
          } else if (codeRes.pixs && codeRes.width && codeRes.height) {
            let matrix = [];
            for (let y = 0; y < codeRes.height; y++) {
              let row = [];
              for (let x = 0; x < codeRes.width; x++) {
                row.push(codeRes.isDark(x, y) ? '1' : '0');
              }
              matrix.push(row.join(''));
            }
            return matrix.join('\n');
          }
          return input.text;
        }

        // Interactive / rich terminal card
        const asciiArt = window.TextEngine.generate2DCodeAscii(codeRes, { border: 1, mode: 'half', invert });
        const svgCode = window.TextEngine.generate2DCodeSvg(input.text, type, { border: 4, darkColor: '#000000', lightColor: '#ffffff' });
        const dataUrl = window.TextEngine.generate2DCodeDataUrl(input.text, type, { scale: 8, border: 4, darkColor: '#000000', lightColor: '#ffffff' });
        const textSnippet = input.text.length > 80 ? input.text.substring(0, 77) + '...' : input.text;

        const cardId = '2d-' + Math.random().toString(36).substring(2, 9);
        const typeTitle = codeRes.typeName || type.toUpperCase();
        let sizeInfo = '';
        if (type === 'qr') sizeInfo = `Version ${codeRes.version} (${codeRes.size}&times;${codeRes.size})`;
        else if (codeRes.width && codeRes.height) sizeInfo = `${codeRes.width}&times;${codeRes.height} modules`;
        else if (type === 'maxicode') sizeInfo = `Mode ${codeRes.mode || 4}`;

        let out = `<div class="tool-result-box" id="${cardId}">
<div class="tool-result-header">${escapeHTML(typeTitle)} Symbol &bull; ${sizeInfo}</div>
<div class="qr-terminal-display" style="margin: 8px 0; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
  <div style="background: #000; padding: 4px 8px; border: 1px solid #333; border-radius: 4px; font-family: monospace; line-height: 1; letter-spacing: 0; color: #fff; display: inline-block; user-select: all;">
<pre style="margin:0; font-family:inherit; line-height:1; font-size: 11px;">${escapeHTML(asciiArt)}</pre>
  </div>
  <div style="flex: 1; min-width: 200px; font-size: 0.86rem; line-height: 1.5;">
    <div><span class="c-dim">type    :</span> <span class="c-accent">${escapeHTML(typeTitle)}</span></div>
    <div><span class="c-dim">size    :</span> <span class="c-file">${sizeInfo}</span></div>
    ${type === 'qr' ? `<div><span class="c-dim">ECC     :</span> <span class="c-file">${codeRes.eccName}</span></div>
    <div><span class="c-dim">mask    :</span> <span class="c-file">Pattern ${codeRes.mask}</span></div>` : ''}
    <div><span class="c-dim">payload :</span> <span class="c-user">${escapeHTML(textSnippet)}</span> <span class="c-dim">(${input.text.length} chars)</span></div>
    <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
      <button type="button" class="tm-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(asciiArt)}'))" title="copy ASCII representation">copy ASCII</button>
      <button type="button" class="tm-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(svgCode)}'))" title="copy SVG XML">copy SVG</button>
      <button type="button" class="tm-btn" onclick="const a=document.createElement('a'); a.href='${dataUrl}'; a.download='${type}-code.png'; a.click();" title="download PNG">download PNG</button>
      <button type="button" class="tm-btn" onclick="const b=new Blob([decodeURIComponent('${encodeURIComponent(svgCode)}')],{type:'image/svg+xml'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='${type}-code.svg'; a.click(); URL.revokeObjectURL(u);" title="download SVG">download SVG</button>
    </div>
  </div>
</div>
</div>`;
        return out;
      }
    },

    qr: {
      desc: 'alias for qrcode',
      usage: 'qr [flags] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(args, stdin);
      }
    },

    microqr: {
      desc: 'generate Micro QR Code (compact single-finder QR code for small items; up to 35 digits / 15 bytes; versions M1-M4)',
      usage: 'microqr [-v M1-M4] [-e L|M|Q] [--mask 0-3] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'microqr', ...args], stdin);
      }
    },

    mqr: {
      desc: 'alias for microqr',
      usage: 'mqr [flags] [file/text...]',
      exec(args, stdin) {
        return commands.microqr.exec(args, stdin);
      }
    },

    rmqr: {
      desc: 'generate Rectangular Micro QR Code (rMQR / ISO/IEC 23943; 32 sizes from R7x43 to R17x139; M and H error correction)',
      usage: 'rmqr [--rmqr-size R7x43..R17x139] [-e M|H] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'rmqr', ...args], stdin);
      }
    },

    datamatrix: {
      desc: 'generate 2D Data Matrix barcodes (square or rectangular; ASCII 0-255 / binary up to 3,116 digits)',
      usage: 'datamatrix [--shape square|rect] [--parsefnc] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'datamatrix', ...args], stdin);
      }
    },

    dm: {
      desc: 'alias for datamatrix',
      usage: 'dm [flags] [file/text...]',
      exec(args, stdin) {
        return commands.datamatrix.exec(args, stdin);
      }
    },

    aztec: {
      desc: 'generate 2D Aztec Code barcodes (compact/full 8-bit binary / ASCII up to 3,832 digits)',
      usage: 'aztec [--format compact|full] [--layers N] [--eclevel 5-95] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'aztec', ...args], stdin);
      }
    },

    maxicode: {
      desc: 'generate 2D MaxiCode barcodes (hexagonal postal symbols; Mode 4 standard 93 chars, Mode 2/3 SCM)',
      usage: 'maxicode [--mode 2|3|4|5|6] [-s scale] [--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'maxicode', ...args], stdin);
      }
    },

    dotcode: {
      desc: 'generate 2D DotCode barcodes (high-speed industrial dot matrix; ASCII/binary up to 1,500+ chars)',
      usage: 'dotcode [--columns N] [--rows N] [--ratio N] [--parsefnc] [--fastfind] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'dotcode', ...args], stdin);
      }
    },

    dot: {
      desc: 'alias for dotcode',
      usage: 'dot [flags] [file/text...]',
      exec(args, stdin) {
        return commands.dotcode.exec(args, stdin);
      }
    },

    hanxin: {
      desc: 'generate 2D Han Xin code (汉信码 / chinese sensible code / ISO/IEC 20830; up to 7,827 digits / 2,174 chinese chars)',
      usage: 'hanxin [-e L1|L2|L3|L4] [-v version] [--mask 1-4] [--parsefnc] [-s scale] [-b border] [--size 4000] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'hanxin', ...args], stdin);
      }
    },

    hx: {
      desc: 'alias for hanxin',
      usage: 'hx [flags] [file/text...]',
      exec(args, stdin) {
        return commands.hanxin.exec(args, stdin);
      }
    },

    mailmark: {
      desc: 'generate Royal Mail Mailmark 4-state barcode or 2D complex mail data mark (CMDM)',
      usage: 'mailmark [-f mailmark4s|mailmark2d] [file/text...]',
      exec(args, stdin) {
        const raw = args.join(' ');
        if (args.includes('mailmark2d') || args.includes('cmdm') || raw.includes('JGB ') || args.includes('--mailmark-type')) {
          return commands.qrcode.exec(['-t', 'mailmark', ...args], stdin);
        }
        return commands.barcode.exec(['-f', 'mailmark4s', ...args], stdin);
      }
    },

    mailmark4s: {
      desc: 'generate Royal Mail Mailmark 4-State barcode (Barcode C & L, 66/78 bars)',
      usage: 'mailmark4s [-w width] [-h height] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.barcode.exec(['-f', 'mailmark4s', ...args], stdin);
      }
    },

    mailmark2d: {
      desc: 'generate Royal Mail 2D Mailmark CMDM (Data Matrix ECC 200, Type 7/9/29)',
      usage: 'mailmark2d [--mailmark-type 7|9|29] [-s scale] [-b border] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.qrcode.exec(['-t', 'mailmark', ...args], stdin);
      }
    },

    cmdm: {
      desc: 'alias for mailmark2d',
      usage: 'cmdm [flags] [file/text...]',
      exec(args, stdin) {
        return commands.mailmark2d.exec(args, stdin);
      }
    },

    barcode: {
      desc: 'generate customizable 1D, postal, and stacked 2D barcodes (CODE128, EAN, UPC, POSTNET, PLANET, Intelligent Mail, RM4SCC, KIX, PDF417, CODE39, etc.)',
      usage: 'barcode [-f format] [-w width] [-h height] [-m margin] [--columns N] [--rows N] [--compact] [--no-text] [--color hex] [--bg hex] [--ascii|--svg|--dataurl] [--ui] [file/text...]',
      exec(args, stdin) {
        if (!window.TextEngine) return 'barcode: text engine not loaded';

        if (args.includes('--ui') || args.includes('--gui') || args.includes('-u')) {
          const nonUiArgs = args.filter(a => a !== '--ui' && a !== '--gui' && a !== '-u');
          const input = extractTextInput(nonUiArgs, stdin);
          textManipWorkbench.open('barcode', input.text || '');
          return '<span class="c-accent">opened Barcode generator in text manipulation workbench.</span>';
        }

        let format = 'CODE128';
        let width = 2;
        let height = 80;
        let margin = 10;
        let displayValue = true;
        let textPosition = 'bottom';
        let textAlign = 'center';
        let fontSize = 16;
        let lineColor = '#000000';
        let background = '#ffffff';
        let outputMode = 'interactive';
        let columns = undefined;
        let rows = undefined;
        let eclevel = undefined;
        let compact = false;
        let targetSize = undefined;
        const textArgs = [];

        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if ((a === '-f' || a === '--format' || a === '--type' || a === '-s' || a === '--symbology') && args[i + 1]) {
            format = args[i + 1];
            i++;
          } else if ((a === '-w' || a === '--width') && args[i + 1]) {
            width = parseInt(args[i + 1], 10) || width;
            i++;
          } else if ((a === '--size' || a === '--max-dim' || a === '--png-size') && args[i + 1]) {
            targetSize = Math.min(4000, Math.max(50, parseInt(args[i + 1], 10) || 4000));
            i++;
          } else if ((a === '-h' || a === '--height') && args[i + 1]) {
            height = parseInt(args[i + 1], 10) || height;
            i++;
          } else if ((a === '-m' || a === '--margin') && args[i + 1]) {
            margin = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--columns' && args[i + 1]) {
            columns = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--rows' && args[i + 1]) {
            rows = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--eclevel' && args[i + 1]) {
            eclevel = parseInt(args[i + 1], 10);
            i++;
          } else if (a === '--compact') {
            compact = true;
          } else if (a === '--font-size' && args[i + 1]) {
            fontSize = parseInt(args[i + 1], 10) || fontSize;
            i++;
          } else if ((a === '--color' || a === '--line-color') && args[i + 1]) {
            lineColor = args[i + 1];
            i++;
          } else if ((a === '--bg' || a === '--background') && args[i + 1]) {
            background = args[i + 1];
            i++;
          } else if (a === '--no-text' || a === '--notext' || a === '-n') {
            displayValue = false;
          } else if (a === '--text-top') {
            textPosition = 'top';
          } else if (a === '--ascii' || a === '-a') {
            outputMode = 'ascii';
          } else if (a === '--svg') {
            outputMode = 'svg';
          } else if (a === '--dataurl' || a === '--png' || a === '--base64') {
            outputMode = 'dataurl';
          } else if (a === '--raw') {
            outputMode = 'raw';
          } else if (!a.startsWith('-')) {
            textArgs.push(a);
          }
        }

        const input = extractTextInput(textArgs, stdin);
        if (!input.text && input.isEmpty) {
          return `<div class="tool-result-box">
<div class="tool-result-header">Barcode Generator (1D, Postal & Stacked PDF417 Barcodes)</div>
<div><span class="c-accent ansi-bold">usage:</span></div>
<div class="c-dim">  barcode [-f CODE128|EAN13|UPC|POSTNET|PLANET|onecode|rm4scc|kix|mailmark4s|mailmark2d|PDF417|CODE39|ITF14|pharmacode] [-w width] [-h height] [--size 4000] [file/text...]</div>
<div class="c-dim">  echo "123456789012" | barcode -f EAN13</div>
<div class="c-dim">  echo "90210" | barcode -f postnet</div>
<div class="c-dim">  echo "12345678901" | barcode -f planet</div>
<div class="c-dim">  echo "0123456709498765432101234567891" | barcode -f onecode</div>
<div class="c-dim">  echo "LE28HS9Z" | barcode -f rm4scc</div>
<div class="c-dim">  echo "1231FZ13XHS" | barcode -f kix</div>
<div class="c-dim">  echo "11100010112345678AB19XY1A " | barcode -f mailmark4s</div>
<div class="c-dim">  echo "JGB 012100123412345678AB19XY1A 0             " | barcode -f mailmark2d</div>
<div class="c-dim">  echo "SECURE-PAYLOAD" | barcode -f pdf417 --columns 4 --eclevel 3</div>
<div class="c-dim">  barcode --ui "HELLO-128"</div>
<div style="margin-top:6px;"><span class="c-accent ansi-bold">formats & input restrictions:</span></div>
<div class="c-dim">  CODE128 (auto) : Full ASCII 0-127 (auto A/B/C compaction)</div>
<div class="c-dim">  CODE128A       : Uppercase A-Z, digits 0-9, punctuation, control chars (NO lowercase)</div>
<div class="c-dim">  CODE128B       : ASCII printable 32-127 (mixed case letters, digits, symbols)</div>
<div class="c-dim">  CODE128C       : Numeric digits ONLY (0-9), must be an EVEN number of digits</div>
<div class="c-dim">  EAN-13         : Exactly 12 or 13 numeric digits (0-9)</div>
<div class="c-dim">  EAN-8          : Exactly 7 or 8 numeric digits (0-9)</div>
<div class="c-dim">  UPC (UPC-A)    : Exactly 11 or 12 numeric digits (0-9)</div>
<div class="c-dim">  UPC-E          : 6, 7, or 8 numeric digits (0-9)</div>
<div class="c-dim">  POSTNET        : USPS Postal 5 (ZIP), 9 (ZIP+4), or 11 (Delivery Point) numeric digits</div>
<div class="c-dim">  PLANET         : USPS Postal tracking 11 or 13 numeric digits</div>
<div class="c-dim">  OneCode (IMb)  : USPS Intelligent Mail 4-state 20, 25, 29, or 31 numeric digits</div>
<div class="c-dim">  RM4SCC         : Royal Mail 4-State Customer Code alphanumeric (A-Z, 0-9)</div>
<div class="c-dim">  KIX Code       : Royal Dutch TPG Post / PostNL 4-state alphanumeric (A-Z, 0-9)</div>
<div class="c-dim">  Mailmark 4-S   : Royal Mail Mailmark 4-State C (22 chars) or L (26 chars), or 66/78 DAFT string</div>
<div class="c-dim">  Mailmark 2D    : Royal Mail 2D Mailmark CMDM (Type 7, 9, 29) formatted with 'JGB ' prefix</div>
<div class="c-dim">  CODE39         : Uppercase A-Z, digits 0-9, space, symbols (- . $ / + %)</div>
<div class="c-dim">  CODE93         : Uppercase A-Z, digits 0-9, symbols (full ASCII via escapes)</div>
<div class="c-dim">  ITF-14         : Exactly 13 or 14 numeric digits (0-9)</div>
<div class="c-dim">  ITF            : Numeric digits ONLY (0-9), must be an EVEN number of digits</div>
<div class="c-dim">  Pharmacode     : Numeric integer from 3 to 131070</div>
<div class="c-dim">  Codabar        : Digits 0-9, symbols (- $ : / . +), start/stop (A, B, C, D)</div>
<div class="c-dim">  MSI / 10 / 11  : Numeric digits ONLY (0-9)</div>
<div class="c-dim">  PDF417         : Full ASCII, text, binary (up to 1,850 chars / 1,108 bytes; 1-30 cols, 3-90 rows)</div>
<div style="margin-top:6px;"><span class="c-accent ansi-bold">flags:</span></div>
<div class="c-dim">  -f, --format &lt;fmt&gt;    : Symbology format (default: CODE128)</div>
<div class="c-dim">  -w, --width &lt;N&gt;      : Bar/module width (default: 2)</div>
<div class="c-dim">  -h, --height &lt;N&gt;     : Bar height in pixels (default: 80)</div>
<div class="c-dim">  -m, --margin &lt;N&gt;     : Margin quiet zone (default: 10)</div>
<div class="c-dim">  --size &lt;N&gt;           : Target PNG image size / max dimension (max: 4000, aspect-ratio adjusted)</div>
<div class="c-dim">  --no-text            : Hide human-readable text beneath barcode</div>
<div class="c-dim">  --color &lt;hex&gt;        : Bar line color (default: #000000)</div>
<div class="c-dim">  --bg &lt;hex&gt;           : Background color (default: #ffffff)</div>
<div class="c-dim">  --columns &lt;N&gt;        : PDF417 data columns (1-30)</div>
<div class="c-dim">  --rows &lt;N&gt;           : PDF417 rows (3-90)</div>
<div class="c-dim">  --eclevel &lt;0-8&gt;      : PDF417 error correction level</div>
<div class="c-dim">  --compact            : Generate compact / truncated PDF417</div>
<div class="c-dim">  --ascii              : Output ASCII art directly</div>
<div class="c-dim">  --svg                : Output standalone SVG XML code</div>
<div class="c-dim">  --dataurl            : Output base64 PNG data URL</div>
<div class="c-dim">  --ui                 : Launch interactive Barcode workbench UI</div>
</div>`;
        }

        const cleanText = input.text.trim();
        const bcOpts = {
          format, width, height, margin, displayValue, textPosition, textAlign, fontSize, lineColor, background, targetSize
        };
        if (columns) bcOpts.columns = columns;
        if (rows) bcOpts.rows = rows;
        if (eclevel !== undefined) bcOpts.eclevel = eclevel;
        if (compact) bcOpts.compact = true;

        const bcRes = window.TextEngine.generateBarcode(cleanText, bcOpts);

        if (bcRes.error) {
          const rest = window.TextEngine.getSymbologyRestriction(format);
          const hint = rest ? `\n<span class="c-dim">note for ${rest.name}: allowed: ${rest.allowedChars}. length: ${rest.lengthLimit}. ${rest.notes}</span>` : '';
          return `barcode: error: ${escapeHTML(bcRes.error)}${hint}`;
        }

        if (outputMode === 'svg') {
          return window.TextEngine.generateBarcodeSvg(cleanText, bcOpts);
        }

        if (outputMode === 'dataurl' || outputMode === 'png' || outputMode === 'base64') {
          return window.TextEngine.generateBarcodeDataUrl(cleanText, bcOpts);
        }

        if (outputMode === 'ascii') {
          return window.TextEngine.generateBarcodeAscii(bcRes, { height: 6, margin: 2, displayValue, textPosition });
        }

        if (outputMode === 'raw') {
          return bcRes.binary;
        }

        // Rich interactive terminal card
        const asciiArt = window.TextEngine.generateBarcodeAscii(bcRes, { height: 5, margin: 2, displayValue, textPosition });
        const svgCode = window.TextEngine.generateBarcodeSvg(cleanText, bcOpts);
        const dataUrl = window.TextEngine.generateBarcodeDataUrl(cleanText, bcOpts);
        const textSnippet = cleanText.length > 60 ? cleanText.substring(0, 57) + '...' : cleanText;
        const bcId = 'bc-' + Math.random().toString(36).substring(2, 9);
        const modInfo = bcRes.totalModules ? `${bcRes.totalModules} modules` : `${bcRes.width}x${bcRes.height}`;

        let out = `<div class="tool-result-box" id="${bcId}">
<div class="tool-result-header">Barcode &bull; ${bcRes.format} (${modInfo})</div>
<div class="barcode-terminal-display" style="margin: 8px 0; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
  <div style="background: #000; padding: 6px 10px; border: 1px solid #333; border-radius: 4px; font-family: monospace; line-height: 1; letter-spacing: 0; color: #fff; display: inline-block; overflow-x: auto; max-width: 100%; user-select: all;">
<pre style="margin:0; font-family:inherit; line-height:1; font-size: 11px;">${escapeHTML(asciiArt)}</pre>
  </div>
  <div style="flex: 1; min-width: 200px; font-size: 0.86rem; line-height: 1.5;">
    <div><span class="c-dim">Format  :</span> <span class="c-accent">${bcRes.format}</span></div>
    <div><span class="c-dim">Size    :</span> <span class="c-file">${modInfo}</span></div>
    <div><span class="c-dim">Payload :</span> <span class="c-user">${escapeHTML(textSnippet)}</span> <span class="c-dim">(${cleanText.length} chars)</span></div>
    <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
      <button type="button" class="tm-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(asciiArt)}'))" title="copy ASCII representation">copy ASCII</button>
      <button type="button" class="tm-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(svgCode)}'))" title="copy SVG XML">copy SVG</button>
      <button type="button" class="tm-btn" onclick="const a=document.createElement('a'); a.href='${dataUrl}'; a.download='barcode-${bcRes.format.toLowerCase()}.png'; a.click();" title="download PNG">download PNG</button>
      <button type="button" class="tm-btn" onclick="const b=new Blob([decodeURIComponent('${encodeURIComponent(svgCode)}')],{type:'image/svg+xml'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='barcode-${bcRes.format.toLowerCase()}.svg'; a.click(); URL.revokeObjectURL(u);" title="download SVG">download SVG</button>
    </div>
  </div>
</div>
</div>`;
        return out;
      }
    },

    bc: {
      desc: 'alias for barcode',
      usage: 'bc [flags] [file/text...]',
      exec(args, stdin) {
        return commands.barcode.exec(args, stdin);
      }
    },

    pdf417: {
      desc: 'generate stacked 2D PDF417 barcodes (full ASCII/binary up to 1,850 chars; 1-30 cols, 3-90 rows)',
      usage: 'pdf417 [--columns N] [--rows N] [--eclevel 0-8] [--compact] [-w width] [-h height] [--ascii|--svg|--dataurl] [file/text...]',
      exec(args, stdin) {
        return commands.barcode.exec(['-f', 'pdf417', ...args], stdin);
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
          'document & commerce': ['invoice', 'receipt', 'prescription', 'rx', 'pad'],
          'symbology & matrix': ['qrcode', 'qr', 'microqr', 'rmqr', 'datamatrix', 'dm', 'aztec', 'maxicode', 'dotcode', 'dot', 'hanxin', 'hx', 'barcode', 'bc', 'pdf417', 'mailmark'],
          'text manipulation & utilities': ['textmanip', 'tm', 'count', 'replace', 'sed', 'case', 'unaccent', 'trim', 'prefix', 'suffix', 'wrap', 'join', 'uniq', 'compact', 'filter', 'grep', 'sort', 'seq', 'nl', 'diff', 'wdiff', 'mapdiff'],
          'linguistics & encoding': ['unicodemap', 'unimap', 'bijoy', 'ansi2uni', 'uni2ansi', 'mjcdi', 'longs', 'url', 'urlencode', 'urldecode', 'base64', 'b64', 'iconv', 'detect-encoding', 'zenkaku', 'hankaku', 'kana', 'punycode', 'idn'],
          'crypto & obfuscation': ['encrypt', 'decrypt', 'rot13', 'caesar', 'binary', 'disemvowel', 'rev', 'flip', 'scramble', 'comb', 'perm', 'rng', 'randstr', 'shuffle', 'cut', 'unicode', 'decayfmt'],
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
   • Real-time procedural audio synthesis, DSP filters, and visualizer suite.

<span class="c-user ansi-bold">5. MJcdi - Bijoy ANSI ⇄ Unicode Engine & Converter</span>
   Stack: Vanilla JS, Node.js CLI, Regular Expressions, Bengali Philology
   • High-performance bidirectional converter between Bijoy (ANSI) typography encoding and standard Unicode with conjunct reordering.

<span class="c-user ansi-bold">6. JSON Map Difference Checker (MapDiffChecker)</span>
   Stack: Vanilla JS, Object Diffing, Terminal ANSI / Interactive Workbench
   • Key-value map comparison utility computing missing keys, extra keys, and mismatched values with structured visual reports.`;
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
          return `opening: <a href="${escapeHTML(target)}" target="_blank" class="term-link">${escapeHTML(target)}</a>`;
        }

        if (target === 'textmanip' || target === 'text-manipulation' || target === 'workbench' || target === 'text-tools' || target === 'tools') {
          textManipWorkbench.open('count');
          return `<span class="c-accent">opened text manipulation workbench.</span>`;
        }

        if (target === 'unicodemap' || target === 'unimap' || target === 'charmap') {
          textManipWorkbench.open('unicodemap');
          return `<span class="c-accent">opened Unicode character map (unimap) in text manipulation workbench.</span>`;
        }

        if (target === 'qr' || target === 'qrcode' || target === 'qrcodegen') {
          textManipWorkbench.open('qrcode');
          return `<span class="c-accent">opened QR code generator in text manipulation workbench.</span>`;
        }

        if (target === 'microqr' || target === 'mqr' || target === 'microqrcode' || target === 'uqr') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'microqr';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened micro qr code generator in text manipulation workbench.</span>`;
        }

        if (target === 'rmqr' || target === 'rectmicroqr' || target === 'rectmicroqrcode' || target === 'rmqrcode' || target === 'rectangularmicroqrcode') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'rmqr';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened rmqr code generator in text manipulation workbench.</span>`;
        }

        if (target === 'datamatrix' || target === 'dm') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'datamatrix';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened data matrix generator in text manipulation workbench.</span>`;
        }

        if (target === 'aztec' || target === 'azteccode') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'aztec';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened aztec code generator in text manipulation workbench.</span>`;
        }

        if (target === 'maxicode' || target === 'maxi') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'maxicode';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened maxi code generator in text manipulation workbench.</span>`;
        }

        if (target === 'dotcode' || target === 'dot' || target === 'dot-code') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'dotcode';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened dotcode generator in text manipulation workbench.</span>`;
        }

        if (target === 'hanxin' || target === 'hx' || target === 'han-xin' || target === 'hanxincode') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'hanxin';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened han xin code generator in text manipulation workbench.</span>`;
        }

        if (target === 'mailmark' || target === 'mailmark2d' || target === 'cmdm') {
          textManipWorkbench.open('qrcode');
          const typeSel = document.getElementById('tm-qr-type');
          if (typeSel) {
            typeSel.value = 'mailmark';
            typeSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened royal mail 2d mailmark generator in text manipulation workbench.</span>`;
        }

        if (target === 'mailmark4s' || target === 'mailmark4state') {
          textManipWorkbench.open('barcode');
          const fmtSel = document.getElementById('tm-bc-format');
          if (fmtSel) {
            fmtSel.value = 'mailmark4s';
            fmtSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">opened royal mail mailmark 4-state generator in text manipulation workbench.</span>`;
        }

        if (target === 'barcode' || target === 'bc') {
          textManipWorkbench.open('barcode');
          return `<span class="c-accent">Opened Barcode Generator in Text Manipulation Workbench.</span>`;
        }

        if (target === 'pdf417') {
          textManipWorkbench.open('barcode');
          const fmtSel = document.getElementById('tm-bc-format');
          if (fmtSel) {
            fmtSel.value = 'pdf417';
            fmtSel.dispatchEvent(new Event('change'));
          }
          return `<span class="c-accent">Opened PDF417 Generator in Text Manipulation Workbench.</span>`;
        }

        if (target === 'longs' || target === 'long-s' || target === 'archaic-s') {
          textManipWorkbench.open('longs');
          return `<span class="c-accent">opened long s (ſ) converter in text manipulation workbench.</span>`;
        }

        if (target === 'decayfmt' || target === 'idcy' || target === 'tdcy') {
          textManipWorkbench.open('decayfmt');
          return `<span class="c-accent">opened decayfmt simulator & decayer in text manipulation workbench.</span>`;
        }

        if (target === 'iconv' || target === 'charenc' || target === 'encoding' || target === 'charset') {
          textManipWorkbench.open('iconv');
          return `<span class="c-accent">opened character encoding converter in text manipulation workbench.</span>`;
        }

        if (target === 'url' || target === 'urlencode' || target === 'urldecode') {
          textManipWorkbench.open('url');
          return `<span class="c-accent">opened URL percent-encoding tool in text manipulation workbench.</span>`;
        }

        if (target === 'base64' || target === 'b64') {
          textManipWorkbench.open('base64');
          return `<span class="c-accent">opened base64 tool in text manipulation workbench.</span>`;
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
│  <span class="c-warn">☀︎ Sunny</span>     │  <span class="c-warn">☀︎ Clear</span>     │  <span class="c-path">☁︎ Light Breeze</span>│
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
        return `theme: invalid theme '${name}'. available: ${valid.join(', ')}`;
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
  window.commands = commands;

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
  window.executePipeline = executePipeline;
  window.executeCommandLine = executePipeline;

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
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        textManipWorkbench.toggleSidebar();
        e.preventDefault();
        return;
      }
      return;
    }

    if (activeInteractiveMode === 'matrix') {
      matrixModule.stop();
      e.preventDefault();
      return;
    }

    // Ignore standalone modifier keys so they don't trigger focusInput() or disrupt text selection
    if (['Control', 'Shift', 'Alt', 'Meta', 'CapsLock', 'AltGraph', 'NumLock', 'ScrollLock'].includes(e.key)) {
      return;
    }

    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().length > 0;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      commands.clear.exec();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      if (hasSelection) {
        return;
      }
      e.preventDefault();
      printCommandLine(currentInputBuffer + '^C');
      currentInputBuffer = '';
      historyIndex = -1;
      updateInputDisplay();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      currentInputBuffer = '';
      updateInputDisplay();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      focusInput();
      return;
    }

    if (e.ctrlKey && e.key === 'Insert') {
      if (hasSelection) {
        return;
      }
    }

    if (e.ctrlKey || e.metaKey || e.altKey) {
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
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
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
    bannerEl.innerHTML = `type 'help' for commands.<br>quick: 'cv', 'tools', 'experience', 'works', 'languages', 'projects', 'skills'`;
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
