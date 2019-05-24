const coerceArray = (obj) =>
  (Array.isArray(obj) ? obj : [obj]).filter((e) => e);

// returns a vnode
const createElement = (type, props = null, children = null) => ({
  type,
  props,
  children: coerceArray(children),
});

// vnode: string | vnode
const render = vnode => {  
  // Strings just convert to #text Nodes:
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);

  // copy attributes onto the new node:
  const props = vnode.props || {};
  Object.keys(props).forEach( k => n.setAttribute(k, props[k]) );

  // render (build) and then append child nodes:
  (vnode.children || []).forEach(child => n.appendChild(render(child)) );

  return n;
}

const mount = (root, vnode) => {
  function update() {
    //if (root.childNodes[0]) root.removeChild(root.childNodes[0]);
    //root.appendChild(renderTree(tree));

    window.requestAnimationFrame(update);
  }
  update();

  root.appendChild(render(vnode));
};

class Component {}

class Header extends Component {
  render() {
    return createElement('div', null, 'header');
  }
}

const tree = createElement('div', { style: "background: red;" }, [
  createElement('div', null, 'hello world')
]);

console.log(tree);

// bootstrap
const root = document.getElementById('root');
mount(root, tree);
