import React from 'react';

import Key from './Key';

export default class Keyboard extends React.Component {
  render() {
    const keys = [
      'ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BKSP',
      'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '|',
      'Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', ',', 'Enter',
      'Shift', 'Z', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift',
      'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Anne', 'Ctrl',
    ];
    const specials = {
      'BKSP': 2,
      'Tab': 1.5,
      'Caps': 1.75,
      '|': 1.5,
      'Enter': 2.25,
      'Shift': 3.1,
      'Ctrl': 1.25,
      'Win': 1.25,
      'Alt': 1.25,
      'Fn': 1.25,
      'Anne': 1.25,
      'Space': 6.75,
    };
    const keyWidth = 54;
    const keyHeight = 54;
    const gap = 5;
    const totalWidth = keyWidth + gap;
    const totalHeight = keyWidth + gap;
    const rowWidth = totalWidth * 14 - 10;

    let y = 0;
    let x = 0;

    const rows = keys.map(k => {
      const size = keyWidth * (specials[k] || 1);
      const res = <Key x={x} y={y} size={size} label={k} />;
      x += size + gap;
      if (x >= rowWidth) {
        x = 0;
        y += totalHeight;
      }
      return res;
    });

    return (
      <div class="layout">
        { rows }
      </div>
    );
  }
}
