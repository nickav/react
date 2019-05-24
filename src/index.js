const coerceArray = (obj) =>
  (Array.isArray(obj) ? obj : [obj]).filter((e) => e);

// returns a vnode
const createElement = (type, props = null, children = null) => ({
  type,
  props,
  children: coerceArray(children)
});

// vnode: string | vnode
const render = vnode => {
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

  // render (build) and then append child nodes:
  //(vnode.children || []).forEach(child => n.appendChild(render(child)));
  
  return n;
}

const renderVDOM = vnode => {
  console.log('entering RENDER', vnode);
  
  //text node
  if (typeof vnode === 'string') {
    return render(vnode);
  //html node
  } else if (typeof vnode.type === 'string') {
    vnode._render = () => render(vnode);
  } else {
  //react element
    if (!vnode._inst) {
      vnode._inst = new vnode.type(vnode.props);
    }
    
    vnode._render = () => {
      console.log('_render', vnode._inst.render());
      //renderVDOM(vnode._inst.render());
      return renderVDOM(vnode._inst.render());
    }
  }

  const n = vnode._render();
  vnode.children.forEach(child => n.appendChild(renderVDOM(child)));

  console.log(n);
  return n;
}

const mount = (root, vnode) => {
  root.appendChild(renderVDOM(vnode));
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
    return createElement('div', { class: "Header" }, this.props.name);
  }
}


/*
const tree = createElement('div', { style: "background: red;" }, [
  createElement(Header, null, 'hello world'),
  createElement(Header, null, 'hello there'),
]);
*/

const tree = createElement(Header, {name: "hey"});

console.log(tree);

// bootstrap
const root = document.getElementById('root');
mount(root, tree);
