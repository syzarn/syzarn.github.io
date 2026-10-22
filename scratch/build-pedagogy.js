const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

async function fetchCached(url, filename) {
  const filePath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(filePath)) {
    console.log(`Using cached ${filename}`);
    return fs.readFileSync(filePath, 'utf8');
  }
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Saved ${filename} (${(text.length / 1024).toFixed(1)} KB)`);
  return text;
}

async function buildAll() {
  console.log('=== Building Pedagogical CJK Dataset with Full Pīnyīn & Meanings ===\n');

  // 1. Fetch HSK Hanzi (Bands 1 to 7-9)
  const hskHanzi = {}; // cp -> band (1..6, '7-9')
  const hskBands = ['1', '2', '3', '4', '5', '6', '7-9'];
  for (const b of hskBands) {
    const raw = await fetchCached(
      `https://raw.githubusercontent.com/krmanik/HSK-3.0/main/New%20HSK%20(2021)/HSK%20Hanzi/HSK%20${encodeURIComponent(b)}.txt`,
      `hsk_hanzi_${b}.txt`
    );
    raw.split('\n').map(l => l.trim()).filter(Boolean).forEach(char => {
      const cp = char.codePointAt(0);
      if (cp) hskHanzi[cp] = b === '7-9' ? '7-9' : parseInt(b, 10);
    });
  }
  console.log(`Loaded ${Object.keys(hskHanzi).length} official HSK characters.`);

  // 2. Fetch complete-hsk-vocabulary (drkameleon) with Pīnyīn, Definitions & Levels
  const drkRaw = await fetchCached(
    'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.min.json',
    'complete_hsk_vocab.json'
  );
  const drkVocab = JSON.parse(drkRaw);
  console.log(`Loaded ${drkVocab.length} vocabulary entries from complete-hsk-vocabulary.`);

  // Extract single character definitions/pinyin and multi-character words
  const drkCharMeta = {}; // cp -> { pinyin, definition, hskLvl }
  const charHskWords = {}; // cp -> [{ w, p, m, lvl, rank }]

  for (const item of drkVocab) {
    const word = item.s;
    if (!word) continue;

    // Determine HSK 3.0 level
    let hskLvl = null;
    let lvlNum = 99;
    for (const l of (item.l || [])) {
      if (l.startsWith('n')) {
        const num = l === 'n7' ? 7 : parseInt(l.slice(1), 10);
        hskLvl = l === 'n7' ? 'HSK 7-9' : `HSK ${num}`;
        lvlNum = num;
        break;
      }
    }
    if (!hskLvl && item.l && item.l.length > 0) {
      // Fallback old HSK or TOCFL
      const old = item.l.find(l => l.startsWith('o'));
      if (old) {
        hskLvl = `HSK ${old.slice(1)}`;
        lvlNum = parseInt(old.slice(1), 10) + 10;
      }
    }

    const pinyin = (item.f && item.f[0] && item.f[0].i && item.f[0].i.y) || '';
    const def = (item.f && item.f[0] && item.f[0].m && item.f[0].m.slice(0, 2).join('; ')) || '';

    const chars = Array.from(word);
    if (chars.length === 1) {
      const cp = chars[0].codePointAt(0);
      if (cp) {
        drkCharMeta[cp] = {
          p: pinyin,
          d: def,
          lvl: hskLvl
        };
      }
    } else {
      // Multi-character compound word
      const wordRec = {
        w: word,
        p: pinyin,
        m: def,
        lvl: hskLvl || 'HSK',
        _lvlNum: lvlNum,
        _len: chars.length
      };

      for (const ch of chars) {
        const cp = ch.codePointAt(0);
        if (!charHskWords[cp]) charHskWords[cp] = [];
        charHskWords[cp].push(wordRec);
      }
    }
  }

  // Sort and prune compound words for each character (prefer lower HSK level, shorter length)
  for (const cp of Object.keys(charHskWords)) {
    charHskWords[cp].sort((a, b) => {
      if (a._lvlNum !== b._lvlNum) return a._lvlNum - b._lvlNum;
      return a._len - b._len;
    });
    // Remove internal sort keys and take top 4
    charHskWords[cp] = charHskWords[cp].slice(0, 4).map(x => ({
      w: x.w,
      p: x.p,
      m: x.m,
      lvl: x.lvl
    }));
  }
  console.log(`Mapped HSK compounds with Pīnyīn & definitions for ${Object.keys(charHskWords).length} characters.`);

  // 3. Fetch Make Me A Hanzi dictionary for additional character definitions & pīnyīn
  const mmahRaw = await fetchCached(
    'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt',
    'mmah_dictionary.txt'
  );
  const mmahDict = {};
  mmahRaw.split('\n').forEach(line => {
    if (!line) return;
    try {
      const obj = JSON.parse(line);
      const cp = obj.character.codePointAt(0);
      if (cp) {
        mmahDict[cp] = {
          p: (obj.pinyin || [])[0] || '',
          d: obj.definition || ''
        };
      }
    } catch(e) {}
  });
  console.log(`Loaded ${Object.keys(mmahDict).length} entries from MMAH dictionary.`);

  // 4. Fetch TOCFL characters
  const tocflCsv = await fetchCached(
    'https://raw.githubusercontent.com/ivankra/zhongwen/master/chars/tocfl.csv',
    'tocfl.csv'
  );
  const tocflMap = {};
  const tocflLvlNames = { '0': 'Novice', '1': 'A1', '2': 'A2', '3': 'B1', '4': 'B2', '5': 'C1' };
  tocflCsv.split('\n').slice(1).forEach(line => {
    const [ch, lvl] = line.trim().split(',');
    if (ch && lvl !== undefined && tocflLvlNames[lvl]) {
      const cp = ch.codePointAt(0);
      if (cp) tocflMap[cp] = tocflLvlNames[lvl];
    }
  });
  console.log(`Loaded ${Object.keys(tocflMap).length} TOCFL characters.`);

  // 5. Fetch Kanji Data (Joyo & JLPT)
  const kanjiRaw = await fetchCached(
    'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json',
    'kanji.json'
  );
  const kanjiData = JSON.parse(kanjiRaw);
  const joyoMap = {};
  const jlptMap = {};
  const kanjiMeta = {};
  for (const [ch, kObj] of Object.entries(kanjiData)) {
    const cp = ch.codePointAt(0);
    if (!cp) continue;
    if (kObj.grade !== undefined && kObj.grade !== null) {
      joyoMap[cp] = kObj.grade;
    }
    if (kObj.jlpt_new !== undefined && kObj.jlpt_new !== null) {
      jlptMap[cp] = `N${kObj.jlpt_new}`;
    }
    kanjiMeta[cp] = {
      m: (kObj.meanings || []).slice(0, 3).join(', '),
      on: (kObj.readings_on || []).slice(0, 3).join('、'),
      kun: (kObj.readings_kun || []).slice(0, 3).join('、')
    };
  }
  console.log(`Loaded ${Object.keys(joyoMap).length} Joyo kanji, ${Object.keys(jlptMap).length} JLPT kanji.`);

  // 6. Fetch JLPT Vocabulary
  const charJlptWords = {};
  for (const lvl of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    const raw = await fetchCached(
      `https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/${lvl}.csv`,
      `jlpt_${lvl}.csv`
    );
    raw.split('\n').slice(1).forEach(line => {
      const m = line.match(/^([^,]+),([^,]+),"?([^"]*)"?,/);
      if (m) {
        const expr = m[1].trim();
        const reading = m[2].trim();
        const meaning = m[3].trim();
        const lvlTag = lvl.toUpperCase();
        if (expr.length >= 2) {
          for (const ch of expr) {
            const cp = ch.codePointAt(0);
            if (!charJlptWords[cp]) charJlptWords[cp] = [];
            if (charJlptWords[cp].length < 3 && !charJlptWords[cp].some(x => x.w === expr)) {
              charJlptWords[cp].push({ w: expr, r: reading, m: meaning, lvl: lvlTag });
            }
          }
        }
      }
    });
  }
  console.log(`Mapped JLPT compounds for ${Object.keys(charJlptWords).length} kanji.`);

  // 7. Subtitle Word Frequency & Zipf Scores
  const freqRaw = await fetchCached(
    'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/zh_cn/zh_cn_50k.txt',
    'zh_cn_50k.txt'
  );
  let totalTokenCount = 0;
  const charCounts = {};
  freqRaw.split('\n').forEach(line => {
    const parts = line.trim().split(' ');
    if (parts.length >= 2) {
      const w = parts[0];
      const count = parseInt(parts[1], 10);
      if (!isNaN(count)) {
        totalTokenCount += count;
        if (w.length === 1) {
          const cp = w.codePointAt(0);
          charCounts[cp] = (charCounts[cp] || 0) + count;
        } else {
          for (const ch of w) {
            const cp = ch.codePointAt(0);
            charCounts[cp] = (charCounts[cp] || 0) + (count / w.length);
          }
        }
      }
    }
  });

  const zipfMap = {};
  for (const [cp, count] of Object.entries(charCounts)) {
    const freqPerMillion = (count / totalTokenCount) * 1e6;
    if (freqPerMillion > 0) {
      const z = Math.log10(freqPerMillion) + 3;
      zipfMap[cp] = Math.round(z * 100) / 100;
    }
  }
  console.log(`Computed Zipf scores for ${Object.keys(zipfMap).length} characters.`);

  // 8. BabelStone IDS
  const idsRaw = await fetchCached(
    'https://www.babelstone.co.uk/CJK/IDS.TXT',
    'babelstone_ids.txt'
  );
  const idsMap = {};
  idsRaw.split('\n').forEach(line => {
    if (line.startsWith('U+')) {
      const parts = line.split('\t');
      const hex = parts[0].slice(2);
      const cp = parseInt(hex, 16);
      if (parts[2]) {
        const clean = parts[2].replace(/^\^/, '').replace(/\$\([^)]*\)/, '').trim();
        if (clean) idsMap[cp] = clean;
      }
    }
  });
  console.log(`Loaded ${Object.keys(idsMap).length} IDS sequences.`);

  // --- Phase 2: Assemble Unified Pedagogical Dataset ---
  console.log('\n--- Phase 2: Assembling Dataset with Pīnyīn & Meanings ---');

  const allCps = new Set([
    ...Object.keys(hskHanzi).map(Number),
    ...Object.keys(tocflMap).map(Number),
    ...Object.keys(joyoMap).map(Number),
    ...Object.keys(jlptMap).map(Number)
  ]);

  const characters = {};
  const schemas = {
    hsk: { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7-9': [] },
    tocfl: { 'Novice': [], 'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [] },
    joyo: { 'Grade 1': [], 'Grade 2': [], 'Grade 3': [], 'Grade 4': [], 'Grade 5': [], 'Grade 6': [], 'Secondary': [] },
    jlpt: { 'N5': [], 'N4': [], 'N3': [], 'N2': [], 'N1': [] },
    zipf: { 'Core (> 5.5)': [], 'Common (4.5–5.5)': [], 'General (3.5–4.5)': [], 'Low (< 3.5)': [] }
  };

  const joyoGradeNames = {
    1: 'Grade 1', 2: 'Grade 2', 3: 'Grade 3',
    4: 'Grade 4', 5: 'Grade 5', 6: 'Grade 6',
    8: 'Secondary'
  };

  for (const cp of allCps) {
    let char = '';
    try { char = String.fromCodePoint(cp); } catch(e) {}
    const h = hskHanzi[cp] || null;
    const t = tocflMap[cp] || null;
    const j = joyoMap[cp] !== undefined ? joyoMap[cp] : null;
    const jl = jlptMap[cp] || null;
    const z = zipfMap[cp] || null;
    const ids = idsMap[cp] || char;

    // Combine compounds (HSK + JLPT)
    const words = [
      ...(charHskWords[cp] || []),
      ...(charJlptWords[cp] || [])
    ].slice(0, 5);

    // Primary character Pīnyīn and Definition:
    // Prioritize DRK -> MMAH -> Kanji meaning
    let pinyin = drkCharMeta[cp]?.p || mmahDict[cp]?.p || '';
    let definition = drkCharMeta[cp]?.d || '';
    if (mmahDict[cp]?.d) {
      if (!definition || definition.toLowerCase().startsWith('surname')) {
        definition = mmahDict[cp].d;
      }
    }
    if (!definition && kanjiMeta[cp]?.m) {
      definition = kanjiMeta[cp].m;
    }

    const rec = {
      cp,
      char,
      pinyin,
      definition,
      hsk: h,
      tocfl: t,
      joyo: j,
      jlpt: jl,
      zipf: z,
      ids,
      words
    };
    if (kanjiMeta[cp]) {
      rec.kanji = kanjiMeta[cp];
    }
    characters[cp] = rec;

    // Schema indexing
    if (h && schemas.hsk[String(h)]) schemas.hsk[String(h)].push(cp);
    if (t && schemas.tocfl[t]) schemas.tocfl[t].push(cp);
    if (j && joyoGradeNames[j]) schemas.joyo[joyoGradeNames[j]].push(cp);
    if (jl && schemas.jlpt[jl]) schemas.jlpt[jl].push(cp);

    if (z !== null) {
      if (z >= 5.5) schemas.zipf['Core (> 5.5)'].push(cp);
      else if (z >= 4.5) schemas.zipf['Common (4.5–5.5)'].push(cp);
      else if (z >= 3.5) schemas.zipf['General (3.5–4.5)'].push(cp);
      else schemas.zipf['Low (< 3.5)'].push(cp);
    }
  }

  // Compile tierVocab (complete wordlists per tier for learner vocabulary browsing)
  const tierVocab = {
    hsk: { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7-9': [] },
    jlpt: { 'N5': [], 'N4': [], 'N3': [], 'N2': [], 'N1': [] }
  };

  for (const item of drkVocab) {
    if (!item.s) continue;
    let b = null;
    for (const l of (item.l || [])) {
      if (l.startsWith('n')) {
        b = l === 'n7' ? '7-9' : l.slice(1);
        break;
      }
    }
    if (b && tierVocab.hsk[b]) {
      tierVocab.hsk[b].push({
        w: item.s,
        p: (item.f && item.f[0] && item.f[0].i && item.f[0].i.y) || '',
        m: (item.f && item.f[0] && item.f[0].m && item.f[0].m.slice(0, 2).join('; ')) || '',
        lvl: `HSK ${b}`
      });
    }
  }

  for (const lvl of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    const raw = await fetchCached(
      `https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/${lvl}.csv`,
      `jlpt_${lvl}.csv`
    );
    const lvlKey = lvl.toUpperCase();
    raw.split('\n').slice(1).forEach(line => {
      const m = line.match(/^([^,]+),([^,]+),"?([^"]*)"?,/);
      if (m) {
        tierVocab.jlpt[lvlKey].push({
          w: m[1].trim(),
          r: m[2].trim(),
          m: m[3].trim(),
          lvl: lvlKey
        });
      }
    });
  }

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      characterCount: Object.keys(characters).length,
      description: 'Unified CJK Pedagogical Dataset (HSK 3.0, TOCFL, Joyo, JLPT, SUBTLEX Zipf, BabelStone IDS, Pīnyīn & Meanings)'
    },
    schemas,
    characters,
    tierVocab
  };

  const outJsonPath = path.resolve(__dirname, '../files/unicode-data/cjk-pedagogy.json');
  const outJsPath = path.resolve(__dirname, '../files/unicode-data/cjk-pedagogy.js');

  const jsonStr = JSON.stringify(payload);
  fs.writeFileSync(outJsonPath, jsonStr, 'utf8');
  fs.writeFileSync(outJsPath, `window.__CJK_PEDAGOGY__ = ${jsonStr};\n`, 'utf8');
  console.log(`Saved cjk-pedagogy.json (${(jsonStr.length / 1024).toFixed(1)} KB) and cjk-pedagogy.js`);

  console.log('--- Build Finished Successfully! ---');
}

buildAll().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
