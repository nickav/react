import * as React from 'react';
import { createElement, mount } from 'react';

class Ticker extends React.Component {
  state = { counter: 0 };

  componentWillMount() {
    console.log('will mount...', this, this._vnode._root);
    this.interval = setInterval(this.tick, 1000);
  }

  componentDidMount() {
    console.log('mounted!', this, this._vnode._root);
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('componentWillRecieveProps', {
      props: this.props,
      state: this.state,
      nextProps,
      nextState,
    });
  }

  componentWillUnmount() {
    console.log('unmounting!!!!!!!');
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

class Text extends React.Component {
  render() {
    return <div>{this.props.title}</div>;
  }
}

class App extends React.Component {
  state = { hide: false };

  componentDidMount() {
    setTimeout(() => this.setState({ hide: true }), 200);
    setTimeout(() => this.setState({ hide: false }), 400);
  }

  render(_, { hide }) {
    console.log('App render!', this.state);
    return (
      <div style="background: red;">
        {hide && <div>hello world!</div>}
        <Text title={hide ? 'hidden' : 'visible'} />
        {null}
        {!hide && <div>remove me</div>}
      </div>
    );
  }
}

const tree = <App />;
//const tree = <div><div></div></div>

//const Title = () => createElement('div', { class: 'title' }, 'title');

// const tree = createElement(Ticker, null, createElement(Ticker, null, createElement('div', null, "yo")));

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);

window.tree = tree;
