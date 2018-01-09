import React from 'react';

import Key from './Key';

export default class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  handleKeyClicked(idx) {
    return (_event) => {
      this.setState({ selected: idx });
    };
  }

  render() {
    const layout = [
      'ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⟵',
      '↹', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '|',
      '⇓', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', '↵',
      '⇑', 'Z', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '⇑',
      'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Anne', 'Ctrl',
    ];
    const specials = {
      '⟵': 2,
      '↹': 1.5,
      '⇓': 1.75,
      '|': 1.5,
      '↵': 2.25,
      '⇑': 3,
      'Ctrl': 1.25,
      'Win': 1.25,
      'Alt': 1.25,
      'Fn': 1.25,
      'Anne': 1.25,
      'Space': 6.25,
    };
    const keyWidth = 52;
    const keyHeight = 52;
    const gap = 0;
    const totalWidth = keyWidth + gap;
    const totalHeight = keyWidth + gap;
    const rowWidth = totalWidth * 14 - 10;

    let y = 0;
    let x = 0;

    const keys = layout.map(key => { return { key }; });

    const rows = keys.map((keyDef, idx) => {
      // const gapSize = specials[k] ? Math.ceil(specials[k]) * gap : 0;
      const k = keyDef.key;
      const size = keyWidth * (specials[k] || 1);
      const res = <Key x={x} y={y} width={size} height={keyHeight} label={k} onClick={this.handleKeyClicked(idx)} selected={this.state.selected === idx} />;
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
