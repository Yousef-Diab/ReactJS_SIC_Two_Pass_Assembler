import toast from 'react-hot-toast';

import * as objfile from './objfile.jsx';
import * as sic from './sic.jsx';
import * as sicasmparser from './sicasmparser.jsx';

function processBYTEC(operand) {
  let constant = '';
  for (let i = 2; i < operand.length - 1; i++) {
    let tmp = operand.charCodeAt(i).toString(16).toUpperCase();
    tmp = tmp.length === 1 ? '0' + tmp : tmp;
    constant += tmp;
  }
  return constant;
}

function generateInstruction(opcode, operand, SYMTAB) {
  try {
    opcode = sic.OPTAB[opcode.toUpperCase()].toString(16).padStart(2, '0');
    if (!opcode) {
      return '';
    }
    // Check for indexed addressing mode
    if (operand?.includes(',X')) {
      operand = operand.replace(',X', '');
      SYMTAB = JSON.parse(SYMTAB);
      operand = SYMTAB[operand] || '0000'; 
      operand = (parseInt(operand, 16) | 0x8000).toString(16).toUpperCase();
    } else {
      SYMTAB = JSON.parse(SYMTAB);
      operand = SYMTAB[operand] || '0000'; 
    }

    // Combine opcode and operand to get object code
    const objectCode = opcode + operand;

    return objectCode.toUpperCase();
  } catch (error) {
    console.error(error);
    return '';
  }
}

/*
const upperCaseOpcode = opcode.toUpperCase();
  let baseInstruction = sic.OPTAB[upperCaseOpcode];

  if (baseInstruction === undefined) {
    toast(`Invalid opcode: ${upperCaseOpcode}`);
    return '';
  }

  let instruction = baseInstruction << 16;

  if (operand !== null) {
    // indexed addressing mode
    if (operand.slice(-2) === ',X') {
      instruction += 0x8000;
      operand = operand.slice(0, -2);
    }

    // Parse the SYMTAB and retrieve the address
    try {
      SYMTAB = JSON.parse(SYMTAB);
      const address = SYMTAB[operand];

      if (address !== undefined) {
        instruction += parseInt(address, 10);
      } else {
        toast(`Symbol not found in SYMTAB: ${operand}`);
        return '';
      }
*/

export function Pass2(lines, SYMTAB, proglen) {
  let reserveflag = false;
  let LOCCTR = 0;
  let progname = '';
  let tline = '';
  let tstart = 0;
  let file = [];
  let currentLineStartCTR = 0;

  const splitLines = lines.split('\n');

  for (let i = 0; i < splitLines.length; i++) {
    const t = sicasmparser.decompositLine(splitLines[i]);

    if (t[1] === null && t[2] === null && t[3] === null) {
      continue;
    }

    if (t[1] === 'START') {
      LOCCTR = parseInt(t[2], 16);
      currentLineStartCTR = LOCCTR;
      progname = t[0];
      tstart = LOCCTR;
      objfile.writeHeader(file, progname, tstart, proglen);
      continue;
    }

    if (t[1] === 'END') {
      if (tline.length > 0) {
        objfile.writeText(file, currentLineStartCTR, tline);
      }
      let address = SYMTAB[t[2]] || tstart;
      return objfile.writeEnd(file, address);
    }

    if (t[1] in sic.OPTAB) {
      let instruction = generateInstruction(t[1], t[2], SYMTAB);
      if (instruction.length === 0) {
        toast(`Undefined Symbol: ${t[2]}`);
        return;
      }
      tline = appendToTextLine(tline, instruction, currentLineStartCTR, LOCCTR - currentLineStartCTR, reserveflag);
      LOCCTR += 3;
    } else if (t[1] === 'WORD') {
      let constant = objfile.hexstrToWord(parseInt(t[2]).toString(16));
      tline = appendToTextLine(tline, constant, currentLineStartCTR, LOCCTR - currentLineStartCTR, reserveflag);
      LOCCTR += 3;
    } else if (t[1] === 'BYTE') {
      let operandlen, constant;
      if (t[2][0] === 'X') {
        operandlen = parseInt((t[2].length - 3) / 2);
        constant = t[2].slice(2, t[2].length - 1);
      } else if (t[2][0] === 'C') {
        operandlen = t[2].length - 3;
        constant = processBYTEC(t[2]);
      }
      tline = appendToTextLine(tline, constant, currentLineStartCTR, LOCCTR - currentLineStartCTR, reserveflag);
      LOCCTR += operandlen;
    } else if (t[1] === 'RESB') {
      LOCCTR += objfile.decimalToHexa(t[2]);
      reserveflag = true;
    } else if (t[1] === 'RESW') {
      LOCCTR += parseInt(t[2]) * 3;
      reserveflag = true;
    } else {
      toast('Invalid Instruction / Invalid Directive');
      return;
    }

    // eslint-disable-next-line no-loop-func
  }
  function appendToTextLine(line, item, currentLOCCTR, diff, isReserved) {
    const newItemLength = Math.ceil(item.length / 2); // Assuming item is a hexadecimal string

    if (diff + newItemLength > 30 || isReserved) {
      reserveflag = false;
      currentLineStartCTR = LOCCTR;
      objfile.writeText(file, currentLOCCTR, line);
      return item;
    } else {
      return line + (line.length > 0 ? '^' : '') + item;
    }
  }
}
