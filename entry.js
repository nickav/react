import * as React from 'react';

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

// test

class Title extends React.Component {
  componentWillMount() {
    console.log('MOUNTING Text');
  }

  render() {
    return <div class="Title">{this.props.title}</div>;
  }
}

class Header extends React.Component {
  componentWillMount() {
    console.log('MOUNTING Header');
  }

  render() {
    return (
      <div class="Header">
        <Title title={this.props.title} />
        <Title title="TITLE" />
      </div>
    );
  }
}

class App extends React.Component {
  state = { flag: false };

  componentDidMount() {
    setTimeout(() => this.setState({ flag: true }), 2000);
  }

  render(_, { flag }) {
    console.log('App render!', flag);
    return (
      <div>
        <input
          {...(!flag ? { 'data-first': true } : { 'data-second': true })}
        />
      </div>
    );
  }
}

const tree = <App />;
window.tree = tree;

// bootstrap
React.render(tree, document.getElementById('app'));
