export function writeHeader(file, name, starting, proglen) {
  let header = 'H^' + programname(name) + '^';
  header += hexstrToWord(starting.toString(16)) + '^';
  header += hexstrToWord(proglen.toString(16));
  file.push(header);
}

export function programname(name) {
  return name.padEnd(6, ' ');
}

export function writeText(file, starting, tline) {
  let textrecord = 'T^' + hexstrToWord(starting.toString(16)) + '^';
  let l = (tline.replaceAll('^', '').length / 2).toString(16);
  l = l.padStart(2, '0');
  l = l.toUpperCase();
  textrecord += l + '^';
  textrecord += tline;
  file.push(textrecord);
}

export function writeEnd(file, address) {
  let endrecord = 'E^' + hexstrToWord(address.toString(16));
  file.push(endrecord);
  return file;
}

export function hexstrToWord(hexstr) {
  const hex = '0x';
  hexstr = hex + hexstr;
  hexstr = hexstr.toUpperCase();
  hexstr = hexstr.substring(2);
  return hexstr.padStart(6, '0');
}

export function asSixBitString(num) {
  typeof num === 'string' && (num = parseInt(num, 10));
  return num.toString().padStart(6, '0');
}

export function hexaToDecimal(hex) {
  return parseInt(hex, 16);
}

export function decimalToHexa(decimal) {
  return parseInt(decimal.toString(16));
}
