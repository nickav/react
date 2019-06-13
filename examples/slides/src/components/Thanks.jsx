import React from 'react';

import Link from './Link';
import './Thanks.css';
import meme from '../assets/tomhanksmeme.jpg';

export default class Thanks extends React.Component {
  static MAX_HANKS = 40;

  constructor() {
    super();
    this.state.message = 'T.hanks';
    this.state.numOfHanks = 1;
  }

  clickHandler = () => {
    if (this.state.numOfHanks < Thanks.MAX_HANKS) {
      this.setState({
        message: 'T.hanks a lot!',
        numOfHanks: this.state.numOfHanks * 2,
      });
    }
  };

  render() {
    const HanksByRow = [];
    for (let i = 1; i <= this.state.numOfHanks; i++) {
      const currHanksRow = [];
      for (let j = 1; j <= this.state.numOfHanks; j *= 2) {
        currHanksRow.push(
          tHanksMeme({
            key: i,
            onClick: () => {
              this.clickHandler();
            },
          })
        );
      }
      HanksByRow.push(currHanksRow);
    }

    return (
      <div class="thanks-component">
        <h1>{this.state.message}</h1>
        <Link to="https://github.com/nickav/react">
          https://github.com/nickav/react
        </Link>
        <div class="thanks-container">
          {HanksByRow.map((row) => (
            <div class="thanks-row">{row}</div>
          ))}
        </div>
      </div>
    );
  }
}

const tHanksMeme = (props) => (
  <div class="thanks__image-wrapper">
    <img
      src={meme}
      alt="t.hanks meme of tom hanks"
      class="thanks__img"
      {...props}
    />
  </div>
);
