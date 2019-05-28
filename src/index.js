// returns a vnode
const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});

const getComponentProps = (vnode) => ({
  ...vnode.props,
  children: vnode.children || props.children,
});

const render = (vnode, renderNode) => {
  // empty node
  if (vnode === null) {
    return;
  }

  // text node
  if (
    typeof vnode === 'string' ||
    typeof vnode === 'number' ||
    typeof vnode === 'boolean'
  ) {
    return renderNode(vnode.toString(), render);
  }

  // html node
  if (typeof vnode.type === 'string') {
    return renderNode(vnode, render);
  }

  // react element
  if (Component.isPrototypeOf(vnode.type)) {
    if (!vnode._inst) {
      vnode._inst = new vnode.type(getComponentProps(vnode));
      vnode._inst._vnode = vnode;
      vnode._render = (vnode) => render(vnode, renderNode);
    }

    const { _inst, props } = vnode;
    const html = render(_inst.render(props, _inst.state), renderNode);
    vnode._root = html;
    return html;
  }

  // functional component
  if (typeof vnode.type === 'function') {
    return render(vnode.type(getComponentProps(vnode)), renderNode);
  }

  throw `Unknown component: ${vnode}`;
};

// vnode: string | vnode
const renderDOM = (vnode, render) => {
  // Strings just convert to #text Nodes:
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);

  // copy attributes onto the new node:
  const props = vnode.props || {};
  Object.keys(props).forEach((k) => n.setAttribute(k, props[k]));

  // render children
  vnode.children.forEach((child) => n.appendChild(render(child, renderDOM)));

  return n;
};

const mount = (root, vnode) => {
  root.appendChild(render(vnode, renderDOM));
};

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState = (state, callbackFn) => {
    this.state = state;
    this.forceUpdate();
    callbackFn && callbackFn();
  };

  forceUpdate = () => {
    const newElem = this._vnode._render(this.render(this.props, this.state));
    this._vnode._root.replaceWith(newElem);
    this._vnode._root = newElem;
  };

  render() {}
}

// test

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
    return createElement('div', { class: 'Ticker' }, this.state.counter);
  }
}

/*
const tree = createElement('div', { style: "background: red;" }, [
  createElement(Header, null, 'hello world'),
  createElement(Header, null, 'hello there'),
]);
*/

//const Title = () => createElement('div', { class: 'title' }, 'title');

const tree = createElement(Ticker);

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);
