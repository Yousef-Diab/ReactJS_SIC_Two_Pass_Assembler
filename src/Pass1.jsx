import toast from 'react-hot-toast';

import * as sic from './sic.jsx';
import * as sicasmparser from './sicasmparser.jsx';

/* eslint-disable eqeqeq */

const isValid = (symbol, lineNumber, lines) => {
  if (symbol.length > 6) {
    toast('Error: Symbol is too long. (line ' + lineNumber + ')');
    return false;
  }
  if (!symbol.match(/^[a-zA-Z0-9]+$/)) {
    toast('Error: Symbol contains invalid characters. (line ' + lineNumber + ')');
    return false;
  }
  if ((symbol == 'START' && lineNumber != 0) || (symbol != 'START' && lineNumber == 0)) {
    toast('Error: START must be the first line. (line ' + lineNumber + ')');
    return false;
  }
  if ((symbol == 'END' && lineNumber != lines.length - 1) || (symbol != 'END' && lineNumber == lines.length - 1)) {
    toast('Error: END must be the last line. (line ' + lineNumber + ')');
    return false;
  }
  return true;
};

export function Pass1(lines) {
  try {
  } catch (error) {}
  let STARTING = 0;
  let LOCCTR = 0;
  let proglen = 0;
  let SYMTAB = {};
  let output = [];
  let prevLOCCTR = '';
  lines = lines.split('\n').filter((x) => x);
  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i];
    let t = sicasmparser.decompositLine(line);

    if (t == (null, null, null)) {
      continue;
    }

    if (!isValid(t[1], i, lines)) return;
    if (t[1] == 'START') {
      STARTING = parseInt(t[2], 16) ?? parseInt(0, 16);
      prevLOCCTR = STARTING;
      LOCCTR = parseInt(STARTING);
    }

    if (t[1] == 'END') {
      proglen = parseInt(LOCCTR - STARTING);
      output.push(`\t${line}`);
      break;
    }

    if (t[0] != null && t[1] != 'START') {
      if (t[0] in SYMTAB) {
        toast('Duplicate Symbol: ' + t[0] + ' (line ' + (i + 1) + ')');
        continue;
      }
      SYMTAB[t[0]] = prevLOCCTR.toString(16).toUpperCase();
    }

    if (sic.isInstruction(t[1]) == true) {
      LOCCTR = LOCCTR + 3;
    } else if (t[1] == 'WORD') {
      LOCCTR = LOCCTR + 3;
    } else if (t[1] == 'RESW') {
      LOCCTR = LOCCTR + parseInt(t[2]) * 3;
    } else if (t[1] == 'RESB') {
      LOCCTR = LOCCTR + parseInt(t[2]);
    } else if (t[1] == 'BYTE') {
      if (t[2][0] == 'C') {
        LOCCTR = LOCCTR + (t[2].length - 3);
      }
      if (t[2][0] == 'X') {
        LOCCTR = LOCCTR + (t[2].length - 3) / 2;
      }
    }
    output.push(`${prevLOCCTR ? prevLOCCTR.toString(16).toUpperCase() + '\t' : '\t'}${line}`);
    prevLOCCTR = LOCCTR;
  }
  output.push(`\nStarting Address: ${STARTING.toString(16)}`);
  output.push(`\nProgram Length: ${proglen.toString(16).padStart(4, '0').toUpperCase()}`);
  output.push(
    '\n\n Symbols Table:\n' +
      Object.keys(SYMTAB)
        .map((key) => `${key}\t${SYMTAB[key]}`)
        .join('\n')
  );
  return { SYMTAB, proglen, output };
}
