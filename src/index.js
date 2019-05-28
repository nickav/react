import Component from './Component';

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
    _inst.componentWillMount();
    const html = render(_inst.render(props, _inst.state), renderNode);
    setTimeout(() => _inst.componentDidMount(), 0);
    vnode._root = html;
    return html;
  }

  // functional component
  if (typeof vnode.type === 'function') {
    return render(vnode.type(getComponentProps(vnode)), renderNode);
  }

  throw `Unknown component: ${vnode}`;
};

//export default { createElement, Component, };

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
    n.appendChild(render(child, renderDOM) || document.createComment('null'))
  );

  return n;
};

export const mount = (root, vnode) => {
  root.appendChild(render(vnode, renderDOM));
  // didMounts
};
