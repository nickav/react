import Component from './Component';
import { create } from 'domain';

export { Component };

// returns a vnode
export const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});

export const getComponentProps = (vnode) => ({
  ...vnode.props,
  children: vnode.children || props.children,
});

export const render = (vnode, renderNode) => {
  // empty node
  if (vnode === null || typeof vnode === 'boolean') {
    return vnode;
  }

  // text node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return renderNode(vnode.toString(), render);
  }

  // html node
  if (typeof vnode.type === 'string') {
    return renderNode(vnode, render);
  }

  // react element
  if (Component.isPrototypeOf(vnode.type)) {
    // create the component (if needed)
    if (!vnode._inst) {
      vnode._inst = new vnode.type(getComponentProps(vnode));
      vnode._inst._vnode = vnode;
      vnode._render = (vnode) => render(vnode, renderNode);
    }

    // do the render
    const { _inst, props } = vnode;
    _inst.componentWillMount();

    const nextVNode = _inst.render(props, _inst.state);
    const html = render(nextVNode, renderNode);
    vnode._prevVNode = nextVNode;
    vnode._root = html;
    
    setTimeout(() => _inst.componentDidMount(), 0);
    return html;
  }

  // functional component
  if (typeof vnode.type === 'function') {
    return render(vnode.type(getComponentProps(vnode)), renderNode);
  }

  throw `Unknown component: ${vnode}`;
};

// 'hey' => string.0
// 'there' => string.0
import diffTree from './diff-tree';
const t1 = createElement('div', null, [ createElement('header') ]);
const t2 = createElement('div', null, [ createElement('div') ]);

console.log(
  diffTree(t1, t2)
);

// vnode: string | vnode
export const renderDOM = (vnode, render) => {
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
  vnode.children.forEach((child) =>
    n.appendChild(render(child, renderDOM) || document.createComment(child))
  );

  return n;
};

export const mount = (root, vnode) => {
  root.appendChild(render(vnode, renderDOM));
  // didMounts
};
