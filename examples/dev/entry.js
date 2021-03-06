import React from 'react';

class Ticker extends React.Component {
  state = { counter: 0 };

  componentWillMount() {
    console.log('will mount...', this, this.getRef());
    this.interval = setInterval(this.tick, 1000);
  }

  componentDidMount() {
    console.log('mounted!', this, this.getRef());
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('componentWillRecieveProps', {
      props: this.props,
      state: this.state,
      nextProps,
      nextState,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate', {
      props: this.props,
      state: this.state,
      prevProps,
      prevState,
    });
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate');
    return true;
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
    //console.log('MOUNTING Text');
  }

  render() {
    const { title, innerRef } = this.props;
    return (
      <div class="Title" ref={innerRef}>
        {title}
      </div>
    );
  }
}

class Header extends React.Component {
  componentWillMount() {
    // console.log('MOUNTING Header');
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

const MyName = (props) => <h1>{props.name}</h1>;

class DefaultProp extends React.Component {
  static defaultProps = {
    name: 'Bob',
  };

  render() {
    return <div>{this.props.name}</div>;
  }
}

class App extends React.Component {
  state = { flag: false };

  componentDidMount() {
    console.log(this);
    setTimeout(() => this.setState({ flag: true }), 2000);
  }

  render(_, { flag }) {
    console.log('App render!', flag);
    return (
      <div class="App" ref={(root) => (this.div = root)}>
        <MyName ref={(el) => (this.fn = el)} name={flag ? 'slim' : 'shady'} />
        <DefaultProp />
        <DefaultProp name="Barb" />
        <Title
          title="HELLO"
          ref={(el) => (this.component = el)}
          innerRef={(el) => (this.innerRef = el)}
        />
        <input
          {...(!flag ? { 'data-first': true } : { 'data-second': true })}
          onInput={flag ? console.log : undefined}
        />
        <ul>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    );
  }
}

const tree = <App />;
window.tree = tree;

// bootstrap
React.render(tree, document.getElementById('app'));
