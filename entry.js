import * as React from 'react';
import { createElement, mount } from 'react';

class Ticker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { counter: 0 };
    //setTimeout(this.tick, 0);
    setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  render() {
    return <div class="Ticker">{new Date().toLocaleString()}</div>;
  }
}

const tree = (
  <div style="background: red;">
    <Ticker />
    <Ticker />
    <div>hello</div>
  </div>
);

//const Title = () => createElement('div', { class: 'title' }, 'title');

// const tree = createElement(Ticker, null, createElement(Ticker, null, createElement('div', null, "yo")));

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);
