import { mount, createElement, Component } from './src';

class Ticker extends Component {
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
    return createElement('div', { class: 'Ticker' }, new Date().toLocaleString());
  }
}

const tree = createElement('div', { style: "background: red;" }, [
  createElement(Ticker),
  createElement(Ticker),
  createElement('div', null, "div")
]);


//const Title = () => createElement('div', { class: 'title' }, 'title');

// const tree = createElement(Ticker, null, createElement(Ticker, null, createElement('div', null, "yo")));

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);
