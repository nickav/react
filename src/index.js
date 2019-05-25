// returns a vnode
const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null
});

// vnode: string | vnode
const renderDom = vnode => {
  console.log('in render', vnode);
  // Strings just convert to #text Nodes:
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);

  // copy attributes onto the new node:
  const props = vnode.props || {};
  Object.keys(props).forEach(k => n.setAttribute(k, props[k]));
  
  return n;
}

const render = vnode => {
  console.log('entering RENDER', vnode);
  if (vnode === null) {
    return;
  } else if (typeof vnode === 'string'|| typeof vnode === 'number' || typeof vnode === 'boolean') {
    // text node
    return renderDom(vnode.toString());
  } else if (typeof vnode.type === 'string') {
    // html node
    const n = renderDom(vnode);
    vnode.children.forEach(child => n.appendChild(render(child)));
    return n;
  } else if (Component.isPrototypeOf(vnode.type)) {
    // react element
    if (!vnode._inst) {
      vnode._inst = new vnode.type({ ...vnode.props, children: vnode.children });
    }
    return render(vnode._inst.render());
  } else if (typeof vnode.type === 'function') {
    // functional component
    return render(vnode.type({ ...vnode.props, children: vnode.children }));
  } else {
    throw `Unknown component: ${vnode}`;
  }
}

const mount = (root, vnode) => {
  root.appendChild(render(vnode));
};

class Component {
  constructor(props){
    this.props = props || {};
    this.state = {};
  }
  
  setState = (state, callbackFn) => {
    this.state = state;
    callbackFn();
    
  }

  render() {

  }
}

class Header extends Component {
  render() {
    return createElement('div', { class: "Header" }, this.props.children);
  }
}

/*
const tree = createElement('div', { style: "background: red;" }, [
  createElement(Header, null, 'hello world'),
  createElement(Header, null, 'hello there'),
]);
*/

const Title = () => createElement('div', { class: 'title' }, 'title')

const tree = createElement(Header, {name: "hey"}, [createElement(Title, null, 'child')]);

console.log(tree);

// bootstrap
const root = document.getElementById('app');
mount(root, tree);
