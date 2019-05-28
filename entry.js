import * as React from 'react';
import { createElement, mount } from 'react';

class Ticker extends React.Component {
  state = { counter: 0 };
  
  componentWillMount() {
    console.log('will mount...', this._vnode._root);
    this.interval = setInterval(this.tick, 1000);
  }

  componentDidMount() {
    console.log('mounted!', this._vnode._root);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
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
    {null}
    <div>hello</div>
  </div>
);

//const Title = () => createElement('div', { class: 'title' }, 'title');

// const tree = createElement(Ticker, null, createElement(Ticker, null, createElement('div', null, "yo")));

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);
