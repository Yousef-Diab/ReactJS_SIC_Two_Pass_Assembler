import './App.css';

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Pass1 } from './Pass1.jsx';
import { Pass2 } from './Pass2.jsx';

export default function App() {
  const [content, setContent] = useState('');
  const [sym, setSYM] = useState('');
  const [proglen, setProglen] = useState('');
  const [isDone, setIsDone] = useState(false);
  const handleFileRead = (e) => {
    const content = e.target.result;
    setContent(content);
    document.getElementById('output3').value = content;
  };
  const handleFileChosen = (file) => {
    if (!file) {
      handleClear();
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
    handleClear();
  };

  const handleClear = (keepInput = false) => {
    setSYM('');
    setProglen('');
    setIsDone(false);
    document.getElementById('output1').value = '';
    document.getElementById('output2').value = '';
    if (!keepInput) {
      setContent('');
      document.getElementById('output3').value = '';
    }
  };
  function writeoutput1() {
    try {
      var result_pass1 = Pass1(content);
      setSYM(result_pass1.SYMTAB);
      setProglen(result_pass1.proglen);
      document.getElementById('output1').value = result_pass1.output.join('\n');
    } catch (error) {
      console.error(error);
      toast("Your input file has a problem, Pass one didn't work.");
    }
  }
  function writeoutput2() {
    try {
      const SYMTAB = JSON.stringify(sym);
      const t = Pass2(content, SYMTAB, proglen);
      var temp_result2 = JSON.stringify(t);
      temp_result2 = temp_result2.replaceAll(',', '\n').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '');
      document.getElementById('output2').value = temp_result2;
      setIsDone(true);
    } catch (error) {
      console.error(error);
      toast("Your input file has a problem, Pass two didn't work.");
    }
  }

  return (
    <>
      <div className='container'>
        <h1 className='title'>Two Pass Assembler - SIC</h1>
        <div className='assembler-section'>
          <div className='input-section'>
            <input id='input' type='file' accept='.txt' onChange={(e) => handleFileChosen(e.target.files[0])} />
            <button className='button' disabled={!content || (sym && proglen)} onClick={writeoutput1}>
              PASS ONE
            </button>
            <button className='button' disabled={!sym || !proglen || isDone} onClick={writeoutput2}>
              PASS TWO
            </button>
            <button
              className='button'
              style={{
                backgroundColor: 'grey',
              }}
              onClick={handleClear}
            >
              Clear output
            </button>
            <textarea id='output3' type='text' disabled={true} className='output3'></textarea>
          </div>

          <div className='output-section'>
            <div className='text-area-container'>
              <b>Pass One Output</b>
              <textarea id='output1' type='text' disabled={true} className='textbox'></textarea>
            </div>
            <div className='text-area-container'>
              <b>Object Program</b>
              <textarea id='output2' type='text' disabled={true} className='textbox'></textarea>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
