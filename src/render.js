import Component from './Component';

export const getComponentProps = (vnode) => ({
  ...vnode.props,
  children: vnode.children || props.children,
});

export const renderVNode = (vnode, renderNode) => {
  // empty node
  if (vnode === null || typeof vnode === 'boolean') {
    return renderNode(vnode, renderVNode);
  }

  // text node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return renderNode(vnode.toString(), renderVNode);
  }

  // html node
  if (typeof vnode.type === 'string') {
    return renderNode(vnode, renderVNode);
  }

  // react element
  if (Component.isPrototypeOf(vnode.type)) {
    vnode._inst = new vnode.type(getComponentProps(vnode));
    vnode._inst._vnode = vnode;

    vnode._inst.componentWillMount();
    setTimeout(() => vnode._inst.componentDidMount(), 0);

    const { _inst, props } = vnode;
    const nextVNode = _inst.render(props, _inst.state);
    const html = renderVNode(nextVNode, renderNode);
    vnode._prevVNode = nextVNode;
    vnode._root = html;
    return html;
  }

  // functional component
  if (typeof vnode.type === 'function') {
    return renderVNode(vnode.type(getComponentProps(vnode)), renderNode);
  }

  throw `Unknown component: ${vnode}`;
};

// vnode: string | vnode
export const renderDOM = (vnode, render) => {
  // Strings just convert to #text Nodes:
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // Null and boolean are just comments (for debugging)
  if (vnode === null || typeof vnode === 'boolean') {
    return document.createComment(` ${vnode} `);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);
  vnode._root = n;

  // copy attributes onto the new node:
  const props = vnode.props || {};
  Object.keys(props).forEach((k) => n.setAttribute(k, props[k]));

  // render children
  vnode.children.forEach((child) => n.appendChild(render(child, renderDOM)));

  return n;
};

export default (root, vnode) => {
  root.appendChild(renderVNode(vnode, renderDOM));
};
